import { validateZipEntryPath } from './zip-store.mjs';
const issue=(code,path,message)=>({code,path,message});
export function buildAltcraftEntries({html,assetBuffers,deliveryDocument,plainText,profile}) {
  const diagnostics=[];
  if(profile?.package?.id!=='altcraft-full-v1'||profile.package.html_entry!=='email/html.html'||profile.package.asset_root_entry!=='images'||profile.package.is_amp!==false||profile.package.is_not_inline!==true)diagnostics.push(issue('EMAIL_PACKAGE_PROFILE_INVALID','/profile','Unsupported full package policy.'));
  if(typeof deliveryDocument?.subject!=='string'||!deliveryDocument.subject.trim()||/[\r\n]/u.test(deliveryDocument.subject))diagnostics.push(issue('EMAIL_PACKAGE_SUBJECT_REQUIRED','/delivery/subject','A single-line mailing subject is required for Altcraft.'));
  if(typeof html!=='string'||!html||typeof plainText!=='string')diagnostics.push(issue('EMAIL_PACKAGE_INPUT_MISSING','/delivery','HTML and text are required.'));
  for(const [path,bytes] of assetBuffers)if(!validateZipEntryPath(path)||!path.startsWith('images/')||!Buffer.isBuffer(bytes))diagnostics.push(issue('EMAIL_PACKAGE_ASSET_INVALID','/assets','Invalid asset entry.'));
  if(diagnostics.length)return {entries:[],diagnostics};
  const entries=[];
  const add=(path,value)=>entries.push({path,bytes:Buffer.isBuffer(value)?value:Buffer.from(value,'utf8')});
  add('email/html.html',html);add('email/subject.txt',deliveryDocument.subject);add('email/text.txt',plainText);add('email/is_amp.txt','false');add('email/is_not_inline.txt','true');
  for(const [key,prefix] of [['sender','from'],['reply_to','replyto']]) {
    const value=deliveryDocument[key];
    if(value?.mode==='inherit')continue;
    if(value?.mode!=='explicit'||typeof value.address!=='string'||typeof value.name!=='string'||/[\r\n]/u.test(value.address+value.name))return {entries:[],diagnostics:[issue('EMAIL_PACKAGE_SENDER_INVALID','/'+key,'Explicit sender fields are incomplete.')]};
    add(`email/${prefix}_email.txt`,value.address);add(`email/${prefix}_name.txt`,value.name);
  }
  for(const [path,bytes] of assetBuffers)add(path,bytes);
  return {entries,diagnostics:[]};
}
