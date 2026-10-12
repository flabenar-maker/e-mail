import { posix, win32 } from 'node:path';
import { validateZipEntryPath } from './zip-store.mjs';
const issue=(code,path,message)=>({code,path,message});
// Decode an attribute exactly once, keeping UTF-16 offsets into its raw HTML.
// CSS in a style element is raw text and must not use HTML entity decoding.
function resourceText(raw, htmlEncoded) {
  let value='';const starts=[],ends=[];
  const tokens=htmlEncoded ? /&(?:amp|AMP|quot|QUOT|apos|lt|LT|gt|GT|#(?:[xX][0-9a-fA-F]+|\d+));|[\s\S]/gu : /[\s\S]/gu;
  for(const token of raw.matchAll(tokens)) {
    let text=token[0];
    if(htmlEncoded && text.startsWith('&')) {
      const named={amp:'&',AMP:'&',quot:'"',QUOT:'"',apos:"'",lt:'<',LT:'<',gt:'>',GT:'>'};
      const name=text.slice(1,-1);
      if(Object.hasOwn(named,name))text=named[name];
      else if(name.startsWith('#')) {
        const hex=name[1]==='x'||name[1]==='X',point=Number.parseInt(name.slice(hex?2:1),hex?16:10);
        text=point>0&&point<=0x10ffff&&!(point>=0xd800&&point<=0xdfff) ? String.fromCodePoint(point) : '\ufffd';
      }
    }
    value+=text;
    for(let i=0;i<text.length;i++) {
      starts.push(token.index);ends.push(token.index+token[0].length);
    }
  }
  return {value,starts,ends};
}
function cssReferences(raw,offset,htmlEncoded) {
  const text=resourceText(raw,htmlEncoded),references=[];
  const urls=/\burl\(\s*(?:"([^"]*)"|'([^']*)'|([^\s)'"(]+))\s*\)/dgiu;
  for(const url of text.value.matchAll(urls)) {
    const group=url[1]!==undefined?1:url[2]!==undefined?2:3;
    const [from,to]=url.indices[group];
    const start=text.starts[from]??raw.length,end=to>from?text.ends[to-1]:start;
    references.push({kind:'css-url',raw_value:raw.slice(start,end),start:offset+start,end:offset+end});
  }
  return references;
}
function collectReferences({html}) {
  const references=[],rawCss=new Set();
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
        references.push(...cssReferences(raw,start,true));
      } else if(key==='background'||key==='src'&&(name==='img'||['v:fill','v:imagedata'].includes(name))) references.push({kind:key==='background'?'html-background':name==='img'?'img-src':'vml-src',raw_value:raw,start,end:start+raw.length});
    }
  }
  for(const style of html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style\s*>/giu)) {
    const offset=style.index+style[0].indexOf('>')+1;
    for(const ref of cssReferences(style[1],offset,false)) {
      rawCss.add(ref);references.push(ref);
    }
  }
  return {references:references.sort((a,b)=>a.start-b.start),rawCss};
}
export function collectResourceReferences({html}) {
  return collectReferences({html}).references;
}
function resourceSuffix(raw,text,prefix) {
  // Stop at the decoded prefix boundary, including entity/percent separators.
  // Only the prefix changes; the original suffix escaping remains untouched.
  for(const token of text.value.matchAll(/%[0-9a-f]{2}|[\s\S]/giu)) {
    const end=token.index+token[0].length;
    let decoded;
    try {decoded=decodeURIComponent(text.value.slice(0,end));} catch {continue;}
    if(decoded===prefix)return raw.slice(text.ends[end-1]);
    if(decoded.length>=prefix.length)break;
  }
  throw new URIError('Resource prefix does not have a raw boundary.');
}
export function rebasePackageResources({html,assetPaths,htmlEntry,assetRootEntry}) {
  const {references,rawCss}=collectReferences({html});
  const diagnostics=[];const replacements=[];const declared=new Set(assetPaths);
  if(!validateZipEntryPath(htmlEntry)||!validateZipEntryPath(assetRootEntry)) return {html,references,diagnostics:[issue('EMAIL_RESOURCE_PACKAGE_PATH_INVALID','/profile','Package entry paths are unsafe.')]};
  for(const ref of references) {
    let path,text;
    try {text=resourceText(ref.raw_value,!rawCss.has(ref));path=decodeURIComponent(text.value);} catch {diagnostics.push(issue('EMAIL_RESOURCE_ENCODING_INVALID','/html','Invalid resource escaping.'));continue;}
    if(path.includes('\\')||path.split('/').some(part=>part==='..'||part==='.'||part==='')||posix.isAbsolute(path)||win32.isAbsolute(path)||/^[a-z][a-z0-9+.-]*:/iu.test(path)||!path.startsWith(assetRootEntry+'/')||!declared.has(path)) {
      diagnostics.push(issue('EMAIL_RESOURCE_UNDECLARED','/html', 'Resource is unsafe, undeclared, or differs in case: '+path));continue;
    }
    const relative=posix.relative(posix.dirname(htmlEntry),assetRootEntry);
    try {replacements.push({...ref,value:relative+'/'+resourceSuffix(ref.raw_value,text,assetRootEntry+'/')});}
    catch {diagnostics.push(issue('EMAIL_RESOURCE_ENCODING_INVALID','/html','Invalid resource prefix escaping.'));}
  }
  if(diagnostics.length)return {html,references,diagnostics};
  let rebased=html;
  for(const ref of replacements.sort((a,b)=>b.start-a.start))rebased=rebased.slice(0,ref.start)+ref.value+rebased.slice(ref.end);
  return {html:rebased,references,diagnostics};
}
