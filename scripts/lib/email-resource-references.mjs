import { posix, win32 } from 'node:path';
import { validateZipEntryPath } from './zip-store.mjs';
const issue=(code,path,message)=>({code,path,message});
function decode(value) {
  const entities=value.replaceAll('&amp;','&').replace(/&#(?:x([0-9a-f]+)|(\d+));/giu,(_,hex,decimal)=>String.fromCodePoint(Number.parseInt(hex??decimal,hex?16:10)));
  return decodeURIComponent(entities);
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
        const urls=/\burl\(\s*(?:"([^"]*)"|'([^']*)'|([^\s)'";]+))\s*\)/giu;
        for(const url of raw.matchAll(urls)) {
          const value=url[1]??url[2]??url[3];
          const offset=url.index+url[0].indexOf(value);
          references.push({kind:'css-url',raw_value:value,start:start+offset,end:start+offset+value.length});
        }
      } else if(key==='background'||key==='src'&&(name==='img'||['v:fill','v:imagedata'].includes(name))) references.push({kind:key==='background'?'html-background':name==='img'?'img-src':'vml-src',raw_value:raw,start,end:start+raw.length});
    }
  }
  for(const style of html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style\s*>/giu)) {
    const offset=style.index+style[0].indexOf('>')+1;
    for(const url of style[1].matchAll(/\burl\(\s*(?:"([^"]*)"|'([^']*)'|([^\s)'";]+))\s*\)/giu)) {
      const raw=url[1]??url[2]??url[3],start=offset+url.index+url[0].indexOf(raw);
      references.push({kind:'css-url',raw_value:raw,start,end:start+raw.length});
    }
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
    replacements.push({...ref,value:relative+'/'+ref.raw_value.slice(ref.raw_value.indexOf('/')+1)});
  }
  if(diagnostics.length)return {html,references,diagnostics};
  let rebased=html;
  for(const ref of replacements.sort((a,b)=>b.start-a.start))rebased=rebased.slice(0,ref.start)+ref.value+rebased.slice(ref.end);
  return {html:rebased,references,diagnostics};
}
