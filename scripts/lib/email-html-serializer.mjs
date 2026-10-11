const issue = (code,path,message) => ({code,path,message});
const structural = new Set(['html','head','body','table','thead','tbody','tfoot','tr','td','th','div']);
const voids = new Set(['meta','link','img','br','hr','input','wbr']);
function tagEnd(html,start) {
  let quote=null;
  for(let i=start+1;i<html.length;i++) {
    const c=html[i];
    if(quote) {if(c===quote)quote=null;}
    else if(c==='"'||c==="'")quote=c;
    else if(c==='>')return i+1;
  }
  throw new Error('Unterminated HTML tag or quoted attribute.');
}
// Offsets refer to JavaScript strings, not UTF-8 bytes. Quoted attributes and raw
// islands remain intact. This scanner is deliberately not a DOM normalizer.
export function scanEmailHtml(html) {
  const tokens=[];
  let i=0;
  while(i<html.length) {
    const start=i;
    if(html.startsWith('<!--',i)) {
      const end=html.indexOf('-->',i+4);
      if(end<0)throw new Error('Unterminated HTML comment.');
      i=end+3;tokens.push({start,end:i,raw:html.slice(start,i),kind:'comment'});continue;
    }
    if(html[i]!=='<') {
      const next=html.indexOf('<',i);i=next<0?html.length:next;
      tokens.push({start,end:i,raw:html.slice(start,i),kind:'text'});continue;
    }
    i=tagEnd(html,i);
    const raw=html.slice(start,i);
    const match=raw.match(/^<\s*(\/?)\s*([a-z][a-z0-9:-]*)\b/iu);
    if(!match) {tokens.push({start,end:i,raw,kind:'declaration'});continue;}
    const name=match[2].toLowerCase(),closing=Boolean(match[1]);
    if(!closing && ['style','script','pre','textarea','p'].includes(name)) {
      const close=new RegExp('</'+name+'\\s*>','igu');close.lastIndex=i;
      const found=close.exec(html);
      if(!found)throw new Error('Unterminated raw or inline island: '+name);
      i=close.lastIndex;tokens.push({start,end:i,raw:html.slice(start,i),name,kind:'island'});continue;
    }
    tokens.push({start,end:i,raw,name,closing,void:voids.has(name)||/\/\s*>$/u.test(raw),kind:'tag'});
  }
  return tokens;
}
export function serializeEmailHtml({html,blockBoundaries=[],protectedFragments=[],indentWidth=2}) {
  if(typeof html!=='string'||![2,4].includes(indentWidth)) return {html,diagnostics:[issue('EMAIL_SERIALIZER_INPUT_INVALID','/html','Invalid serializer input.')]};
  let tokens;
  try {tokens=scanEmailHtml(html);} catch(error) {return {html,diagnostics:[issue('EMAIL_SERIALIZER_PARSE_FAILED','/html',error.message)]};}
  const protectedRanges=[...protectedFragments].sort((a,b)=>a.start-b.start);
  for(let i=0;i<protectedRanges.length;i++) {
    const span=protectedRanges[i];
    if(!Number.isInteger(span.start)||!Number.isInteger(span.end)||span.start<0||span.end>html.length||span.start>=span.end||(i && protectedRanges[i-1].end>span.start)) return {html,diagnostics:[issue('EMAIL_SERIALIZER_RANGE_INVALID','/protectedFragments','Invalid or overlapping protected range.')]};
  }
  // Keep a leaf cell (including text spacing and inline anchors) byte-for-byte.
  const islands=tokens.filter(token => token.kind==='island').map(({start,end})=>({start,end}));
  for(let i=0;i<tokens.length;i++) {
    const token=tokens[i];
    if(token.name!=='td'&&token.name!=='th')continue;
    if(token.closing)continue;
    let j=i+1;
    while(j<tokens.length && !(tokens[j].name===token.name&&tokens[j].closing))j++;
    if(j<tokens.length && !tokens.slice(i+1,j).some(t=>t.kind==='tag'&&structural.has(t.name))) {
      islands.push({start:token.start,end:tokens[j].end});i=j;
    }
  }
  const ranges=[...protectedRanges,...islands].sort((a,b)=>a.start-b.start||b.end-a.end);
  const merged=[];
  for(const span of ranges) {
    const last=merged.at(-1);
    if(last&&span.start<=last.end)last.end=Math.max(last.end,span.end);
    else merged.push({...span});
  }
  const units=[];
  let cursor=0;
  for(const span of merged) {
    const prefix=html.slice(cursor,span.start);
    try {units.push(...scanEmailHtml(prefix));} catch {return {html,diagnostics:[issue('EMAIL_SERIALIZER_RANGE_BOUNDARY','/protectedFragments','Protected ranges must align with complete text or markup islands.')]};}
    units.push({raw:html.slice(span.start,span.end),kind:'island'});cursor=span.end;
  }
  try {units.push(...scanEmailHtml(html.slice(cursor)));} catch(error) {return {html,diagnostics:[issue('EMAIL_SERIALIZER_PARSE_FAILED','/html',error.message)]};}
  const lines=[];let line='',depth=0;
  const flush=()=>{if(line){lines.push(line);line='';}};
  for(const [index,token] of units.entries()) {
    if(token.kind==='text'&&/^\s*$/u.test(token.raw)) {
      const next=units[index+1];
      if(line.trim() && next && !(next.kind==='tag'&&structural.has(next.name))) line+=token.raw;
      continue;
    }
    const boundary=token.kind==='tag'&&structural.has(token.name) || token.kind==='declaration' || token.kind==='comment';
    if(boundary) {
      flush();if(token.closing)depth=Math.max(0,depth-1);
      line=' '.repeat(depth*indentWidth)+token.raw;
      flush();if(token.kind==='tag'&&!token.closing&&!token.void)depth++;
    } else {
      if(!line)line=' '.repeat(depth*indentWidth);
      line+=token.raw;
    }
  }
  flush();
  return {html:lines.join('\n')+'\n',diagnostics:[]};
}
