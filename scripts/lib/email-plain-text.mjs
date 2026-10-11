import {deliveryText,indexDeliveryInstances} from './email-action-inventory.mjs';
export function buildPlainText({model,inventory,deliveryDocument,profile,templateRules}) {
  if(deliveryDocument.plain_text.mode==='manual') {
    const text=deliveryDocument.plain_text.value;
    const required=(inventory.fields??[]).filter(field=>field.managed&&field.value==='{unsubscribe}');
    if(required.length && !text.includes('{unsubscribe}'))throw new Error('EMAIL_PLAIN_TEXT_UNSUBSCRIBE_MISSING');
    return text;
  }
  let bindings=inventory.text_bindings;
  if(!bindings) bindings=[...indexDeliveryInstances(model)].flatMap(([path,instance])=>(instance.content_values??[]).filter(item=>['plain-text','rich-text'].includes(item.value.type)).map(item=>({instance_path:path,element_id:item.element_id,slot_id:item.slot_id,viewport:item.scope,value:deliveryText(item.value)})));
  const logical=new Map();
  for(const binding of bindings) {
    const key=JSON.stringify([binding.instance_path,binding.element_id,binding.slot_id]);
    const previous=logical.get(key);
    if(previous && previous.value!==binding.value)throw new Error('EMAIL_PLAIN_TEXT_VIEWPORT_CONFLICT: '+binding.instance_path+'/'+binding.element_id);
    if(!previous)logical.set(key,binding);
  }
  const paragraphs=[...logical.values()].map(binding=>binding.value).filter(Boolean);
  for(const field of inventory.fields??[]) {
    const href=deliveryDocument.answers[field.id]??field.value??'';
    if(href)paragraphs.push(`${field.label}: ${href}`);
  }
  return paragraphs.join('\n\n')+'\n';
}
