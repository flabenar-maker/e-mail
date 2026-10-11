export const GREETING_TEMPLATE='{if lead._fname}Здравствуйте, {uppercasefirst(lead._fname)}!{else}Здравствуйте!{end}';
const greetings=new Set(['Здравствуйте, Имя!','Здравствуйте, $user$!']);
const normalize=text=>text.replaceAll('\u00a0',' ').trim();
export function isTemplateGreeting(text) {return typeof text==='string'&&greetings.has(normalize(text));}
export function emitGreetingTemplate({rule,originalText}) {
  return rule?.kind==='conditional-greeting'&&isTemplateGreeting(originalText)?GREETING_TEMPLATE:originalText;
}
export function planTemplateRules({model,inventory,profile}) {
  if(!profile.service_rules?.enabled)return {rules:[],diagnostics:[]};
  const groups=new Map();
  for(const binding of inventory.text_bindings??[]) {
    const ranges=isTemplateGreeting(binding.value)?[null]:(binding.runs??[]).filter(run=>isTemplateGreeting(run.characters)).map(run=>({start:run.start,end:run.end,text:run.characters}));
    for(const range of ranges) {
      const {value,runs,...target}=binding;
      if(range)target.range=range;
      const key=JSON.stringify([target.instance_path,target.element_id,target.slot_id,range?.start,range?.end]);
      const rule=groups.get(key)??{kind:'conditional-greeting',bindings:[],original_text:range?.text??value,emitted_template:GREETING_TEMPLATE};
      rule.bindings.push(target);groups.set(key,rule);
    }
  }
  return {rules:[...groups.values()],diagnostics:[]};
}
export function matchesTemplateTarget(target,origin) {
  return target.instance_path===origin?.instance_path&&target.component_id===origin?.component_id&&target.viewport===origin?.viewport&&target.element_id===(origin?.original_element_id??origin?.element_id)&&(!origin?.slot_id||!target.slot_id||target.slot_id===origin.slot_id);
}
export function findGreetingRule({templateRules,origin,range}) {
  return (templateRules?.rules??[]).find(rule=>rule.bindings.some(target=>matchesTemplateTarget(target,origin)&&(!range?!target.range:target.range?.start===range.start&&target.range?.end===range.end)));
}
export function buildPersonalizationPreview({emissionInput,scenario={}}) {
  const result=structuredClone(emissionInput);
  const name=typeof scenario.first_name==='string'?scenario.first_name.trim():'';
  const chars=[...name],capitalized=chars.length?chars[0].toLocaleUpperCase('ru')+chars.slice(1).join(''):'';
  result.purpose='preview';
  result.previewValues=(result.templateRules?.rules??[]).flatMap(rule=>rule.bindings.map(target=>({target:structuredClone(target),value:capitalized?'Здравствуйте, '+capitalized+'!':'Здравствуйте!'})));
  return result;
}
export function greetingValue({rule,origin,range,previewValues}) {
  const preview=(previewValues??[]).find(item=>matchesTemplateTarget(item.target,origin)&&(!range?!item.target.range:item.target.range?.start===range.start&&item.target.range?.end===range.end));
  return preview?.value??rule.emitted_template;
}
export function renderStyledGreeting({text,segments,span,previewValue}) {
  const match=text.match(/^(\s*)Здравствуйте,[ \u00a0]+(Имя|\$user\$)!(\s*)$/u);
  if(!match)return null;
  const nameStart=text.indexOf(match[2]),nameEnd=nameStart+match[2].length,comma=text.indexOf(',');
  const render=(from,to,replacement,raw=false)=>{
    let inserted=false;const parts=[];
    for(const segment of segments) {
      const start=Math.max(from,segment.start),end=Math.min(to,segment.end);
      if(start>=end)continue;
      if(replacement!==undefined&&!inserted){parts.push(span(segment,replacement,raw));inserted=true;}
      else if(replacement===undefined)parts.push(span(segment,text.slice(start,end),false));
    }
    return parts.join('');
  };
  const prefix=render(0,nameStart),suffix=render(nameEnd,text.length);
  if(previewValue!==undefined) {
    const named=previewValue.match(/^Здравствуйте, (.*)!$/u);
    return named?prefix+render(nameStart,nameEnd,named[1])+suffix:render(0,comma)+suffix;
  }
  return '{if lead._fname}'+prefix+render(nameStart,nameEnd,'{uppercasefirst(lead._fname)}',true)+suffix+'{else}'+render(0,comma)+suffix+'{end}';
}
