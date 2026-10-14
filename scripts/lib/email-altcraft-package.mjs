import { validateZipEntryPath } from './zip-store.mjs';
const issue=(code,path,message)=>({code,path,message});
export function buildAltcraftEntries({html,assetBuffers,deliveryDocument,plainText,profile}) {
  const diagnostics=[];
  if(profile?.package?.id!=='altcraft-root-html-v1'||profile.package.html_entry!=='email.html'||profile.package.asset_root_entry!=='images'||profile.package.is_amp!==false||profile.package.is_not_inline!==true)diagnostics.push(issue('EMAIL_PACKAGE_PROFILE_INVALID','/profile','Unsupported root HTML package policy.'));
  if((deliveryDocument.subject !== undefined && typeof deliveryDocument.subject !== 'string')||/[\r\n]/u.test(deliveryDocument.subject)||typeof html!=='string'||!html||typeof plainText!=='string')diagnostics.push(issue('EMAIL_PACKAGE_INPUT_MISSING','/delivery','Valid supplied subject, HTML, and text are required.'));
  for(const [path,bytes] of assetBuffers)if(!validateZipEntryPath(path)||!path.startsWith('images/')||!Buffer.isBuffer(bytes))diagnostics.push(issue('EMAIL_PACKAGE_ASSET_INVALID','/assets','Invalid asset entry.'));
  if(diagnostics.length)return {entries:[],diagnostics};
  const entries=[];
  const add=(path,value)=>entries.push({path,bytes:Buffer.isBuffer(value)?value:Buffer.from(value,'utf8')});
  add('email.html',html);
  for(const key of ['sender','reply_to']) {
    const value=deliveryDocument[key];
    if(value?.mode==='inherit')continue;
    if(value?.mode!=='explicit'||typeof value.address!=='string'||typeof value.name!=='string'||/[\r\n]/u.test(value.address+value.name))return {entries:[],diagnostics:[issue('EMAIL_PACKAGE_SENDER_INVALID','/'+key,'Explicit sender fields are incomplete.')]};
    // Sender and reply settings remain delivery inputs; they are not package files.
  }
  for(const [path,bytes] of assetBuffers)add(path,bytes);
  return {entries,diagnostics:[]};
}
