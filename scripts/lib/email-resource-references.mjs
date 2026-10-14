import { posix, win32 } from 'node:path';
import { validateZipEntryPath } from './zip-store.mjs';
const issue=(code,path,message)=>({code,path,message});
function decode(value) {
  const entities=value.replaceAll('&amp;','&').replace(/&#(?:x([0-9a-f]+)|(\d+));/giu,(_,hex,decimal)=>String.fromCodePoint(Number.parseInt(hex??decimal,hex?16:10)));
  return decodeURIComponent(entities);
}
// HTML entities are decoded by browsers in style attributes, but not in style
// raw text. Keep a source range for each decoded code unit so replacements touch
// the resource alone and leave quote entities and every surrounding byte intact.
function attributeCss(raw) {
  let text='';const spans=[];
  const entities=/&(?:amp|quot|apos);|&#(?:x([0-9a-f]+)|(\d+));/giu;
  let cursor=0;
  const appendRaw=(start,end)=>{for(let index=start;index<end;index++){text+=raw[index];spans.push({start:index,end:index+1});}};
  for(const match of raw.matchAll(entities)) {
    appendRaw(cursor,match.index);
    let decoded;
    if(match[1]!==undefined||match[2]!==undefined) {
      const point=Number.parseInt(match[1]??match[2],match[1]!==undefined?16:10);
      if(point>0x10ffff||point>=0xd800&&point<=0xdfff){appendRaw(match.index,match.index+match[0].length);cursor=match.index+match[0].length;continue;}
      decoded=String.fromCodePoint(point);
    } else decoded={'&amp;':'&','&quot;':'"','&apos;':"'"}[match[0].toLowerCase()];
    for(const unit of decoded.split('')){text+=unit;spans.push({start:match.index,end:match.index+match[0].length});}
    cursor=match.index+match[0].length;
  }
  appendRaw(cursor,raw.length);return {text,spans};
}
function cssReferences(raw,offset,{attribute=false}={}) {
  const decoded=attribute?attributeCss(raw):null,text=decoded?.text??raw,references=[];
  const urls=/\burl\(\s*(?:"([^"]*)"|'([^']*)'|([^\s)'";]+))\s*\)/giu;
  for(const url of text.matchAll(urls)) {
    const value=url[1]??url[2]??url[3];
    if(!value)continue;
    const index=url.index+url[0].indexOf(value);
    const start=decoded?decoded.spans[index].start:index;
    const end=decoded?decoded.spans[index+value.length-1].end:index+value.length;
    references.push({kind:'css-url',raw_value:raw.slice(start,end),start:offset+start,end:offset+end});
  }
  return references;
}
export function collectResourceReferences({html}) {
  const references=[];
  // Attribute matches stop at the quote, not at '>' within a quoted value.
  const tags=/<[a-z][a-z0-9:-]*\b(?:[^<>"']|"[^"]*"|'[^']*')*>/giu;
  for(const tag of html.matchAll(tags)) {
    const name=tag[0].match(/^<([a-z0-9:-]+)/iu)[1].toLowerCase();
    const attrs=/\s+([a-z_:][\w:.-]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/giu;
    for(const attr of tag[0].matchAll(attrs)) {
      const key=attr[1].toLowerCase(),raw=attr[2]??attr[3]??attr[4];
      const valueOffset=attr.index+attr[0].length-raw.length-(attr[2]!==undefined||attr[3]!==undefined?1:0);
      const start=tag.index+valueOffset;
      if(key==='style') {
        references.push(...cssReferences(raw,start,{attribute:true}));
      } else if(key==='background'||key==='src'&&(name==='img'||['v:fill','v:imagedata'].includes(name))) references.push({kind:key==='background'?'html-background':name==='img'?'img-src':'vml-src',raw_value:raw,start,end:start+raw.length});
    }
  }
  for(const style of html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style\s*>/giu)) {
    const offset=style.index+style[0].indexOf('>')+1;
    references.push(...cssReferences(style[1],offset));
  }
  return references.sort((a,b)=>a.start-b.start);
}
export function rebasePackageResources({html,assetPaths,htmlEntry,assetRootEntry}) {
  const references=collectResourceReferences({html});
  const diagnostics=[];const replacements=[];const declared=new Set(assetPaths);
  if(!validateZipEntryPath(htmlEntry)||!validateZipEntryPath(assetRootEntry)) return {html,references,diagnostics:[issue('EMAIL_RESOURCE_PACKAGE_PATH_INVALID','/profile','Package entry paths are unsafe.')]};
  for(const ref of references) {
    let path;
    try {path=decode(ref.raw_value);} catch {diagnostics.push(issue('EMAIL_RESOURCE_ENCODING_INVALID','/html','Invalid resource escaping.'));continue;}
    if(path.includes('\\')||path.split('/').some(part=>part==='..'||part==='.'||part==='')||posix.isAbsolute(path)||win32.isAbsolute(path)||/^[a-z][a-z0-9+.-]*:/iu.test(path)||!path.startsWith(assetRootEntry+'/')||!declared.has(path)) {
      diagnostics.push(issue('EMAIL_RESOURCE_UNDECLARED','/html', 'Resource is unsafe, undeclared, or differs in case: '+path));continue;
    }
    const relative=posix.relative(posix.dirname(htmlEntry),assetRootEntry);
    if(relative!==assetRootEntry)replacements.push({...ref,value:relative+'/'+ref.raw_value.slice(ref.raw_value.indexOf('/')+1)});
  }
  if(diagnostics.length)return {html,references,diagnostics};
  let rebased=html;
  for(const ref of replacements.sort((a,b)=>b.start-a.start))rebased=rebased.slice(0,ref.start)+ref.value+rebased.slice(ref.end);
  return {html:rebased,references,diagnostics};
}
