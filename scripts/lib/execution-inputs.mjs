import {readFile,readdir,lstat,realpath} from 'node:fs/promises';
import {join,resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {readExecutionRef,safeExecutionPath} from './execution-context.mjs';
export const inputFailure=(code,message)=>Object.assign(new Error(message),{code});
export const bytesDigest=value=>createHash('sha256').update(value).digest('hex');
// Inventories contain only relative paths and hashes. Their private root is supplied locally.
// Re-read the actual listed files every time; an unchanged inventory is not proof of freshness.
export async function validateInputInventory({inventory,root}){
 if(!inventory||inventory.schema_version!=='1.0.0'||typeof inventory.kind!=='string'||!Array.isArray(inventory.files)||!inventory.files.length||!root)throw inputFailure('VERIFICATION_INPUT_INVALID','Expected a nonempty file inventory and explicit authorized root.');
 const allowed=['schema_version','kind','files'];if(Object.keys(inventory).some(k=>!allowed.includes(k)))throw inputFailure('VERIFICATION_INPUT_INVALID','Unknown inventory property.');
 const paths=inventory.files.map(f=>f.path);if(new Set(paths.map(p=>p?.toLowerCase())).size!==paths.length)throw inputFailure('VERIFICATION_INPUT_INVALID','Inventory paths must be unique.');
 const actualRoot=await realpath(root),files=[];
 for(const ref of inventory.files){
  if(!safeExecutionPath(ref?.path)||!/^[a-f0-9]{64}$/u.test(ref?.digest??'')||Object.keys(ref).sort().join(',')!=='digest,path')throw inputFailure('VERIFICATION_INPUT_INVALID','Invalid inventory file reference.');
  try {await readExecutionRef({referenceRoot:actualRoot,ref});files.push({...ref});}
  catch{throw inputFailure('VERIFICATION_INPUT_CHANGED','Actual input bytes are missing, unsafe or differ from the bound inventory.');}
 }
 return {schema_version:'1.0.0',kind:inventory.kind,files};
}
export async function readBoundInventory({ref,referenceRoot,root,kind}){
 let inventory;try{inventory=JSON.parse(await readExecutionRef({referenceRoot,ref}));}catch{throw inputFailure('VERIFICATION_INPUT_CHANGED','Bound inventory file is unavailable or changed.');}
 if(inventory.kind!==kind)throw inputFailure('VERIFICATION_INPUT_INVALID','Inventory kind does not match consuming workload.');
 const fresh=await validateInputInventory({inventory,root});return {inventory,fresh};
}
// Installed tree must match inventory exactly, including unexpected files; never follow symlinks.
export async function inventoryTreePaths(root){
 const out=[];async function visit(rel=''){for(const entry of await readdir(join(root,rel),{withFileTypes:true})){const name=rel?rel+'/'+entry.name:entry.name;if(!safeExecutionPath(name)||entry.isSymbolicLink())throw inputFailure('VERIFICATION_INPUT_INVALID','Unsafe installed input path.');if(entry.isDirectory())await visit(name);else if(entry.isFile())out.push(name);else throw inputFailure('VERIFICATION_INPUT_INVALID','Unsupported installed file type.');}}
 await visit();return out.sort();
}
export async function readImageBytes(root,ref){
 await readExecutionRef({referenceRoot:root,ref});const bytes=await readFile(resolve(root,ref.path));
 if(bytesDigest(bytes)!==ref.digest)throw inputFailure('VERIFICATION_INPUT_CHANGED','Image changed while reading.');
 // Formal image-byte evidence only. An actual qualified reviewer must inspect the images.
 const png=bytes.length>24&&bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
 const jpeg=bytes.length>4&&bytes[0]===255&&bytes[1]===216&&bytes.at(-2)===255&&bytes.at(-1)===217;
 const webp=bytes.length>16&&bytes.toString('ascii',0,4)==='RIFF'&&bytes.toString('ascii',8,12)==='WEBP';
 if(!png&&!jpeg&&!webp)throw inputFailure('VISUAL_EVIDENCE_UNSUPPORTED','Visual evidence requires actual PNG, JPEG or WebP bytes.');
 return {path:ref.path,digest:ref.digest,bytes:bytes.length};
}
