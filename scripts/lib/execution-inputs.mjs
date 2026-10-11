import {readFile,readdir,lstat,realpath} from 'node:fs/promises';
import {join,resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {readExecutionRef,safeExecutionPath} from './execution-context.mjs';
export const inputFailure=(code,message)=>Object.assign(new Error(message),{code});
export const bytesDigest=value=>createHash('sha256').update(value).digest('hex');
export const INPUT_MAX_BYTES=32*1024*1024;
export function checkInputSignal(signal){if(signal?.aborted)throw typeof signal.reason?.code==='string'&&signal.reason.code.startsWith('VERIFICATION_')?signal.reason:inputFailure('VERIFICATION_CANCELLED','Input inspection was cancelled.');}
// Inventories contain only relative paths and hashes. Their private root is supplied locally.
// Re-read the actual listed files every time; an unchanged inventory is not proof of freshness.
export async function validateInputInventory({inventory,root,signal}){
 checkInputSignal(signal);
 if(!inventory||inventory.schema_version!=='1.0.0'||typeof inventory.kind!=='string'||!Array.isArray(inventory.files)||!inventory.files.length||!root)throw inputFailure('VERIFICATION_INPUT_INVALID','Expected a nonempty file inventory and explicit authorized root.');
 const allowed=['schema_version','kind','files'];if(Object.keys(inventory).some(k=>!allowed.includes(k)))throw inputFailure('VERIFICATION_INPUT_INVALID','Unknown inventory property.');
 const paths=inventory.files.map(f=>f.path);if(new Set(paths.map(p=>p?.toLowerCase())).size!==paths.length)throw inputFailure('VERIFICATION_INPUT_INVALID','Inventory paths must be unique.');
 if(inventory.files.length>10000)throw inputFailure('VERIFICATION_INPUT_INVALID','Inventory exceeds the bounded file count.');
 const actualRoot=await realpath(root),files=[];let total=0;
 for(const ref of inventory.files){
  if(!safeExecutionPath(ref?.path)||!/^[a-f0-9]{64}$/u.test(ref?.digest??'')||Object.keys(ref).sort().join(',')!=='digest,path')throw inputFailure('VERIFICATION_INPUT_INVALID','Invalid inventory file reference.');
  checkInputSignal(signal);
  try {const info=await lstat(resolve(actualRoot,ref.path));total+=info.size;if(total>128*1024*1024)throw inputFailure('VERIFICATION_INPUT_TOO_LARGE','Inventory exceeds 128 MiB.');await readExecutionRef({referenceRoot:actualRoot,ref,signal,maxBytes:INPUT_MAX_BYTES});checkInputSignal(signal);files.push({...ref});}
  catch(error){checkInputSignal(signal);if(error.code==='VERIFICATION_INPUT_TOO_LARGE'||error.code==='EXECUTION_REFERENCE_TOO_LARGE')throw inputFailure('VERIFICATION_INPUT_TOO_LARGE','Input exceeds bounded evidence size.');throw inputFailure('VERIFICATION_INPUT_CHANGED','Actual input bytes are missing, unsafe or differ from the bound inventory.');}
 }
 return {schema_version:'1.0.0',kind:inventory.kind,files};
}
export async function readBoundInventory({ref,referenceRoot,root,kind,signal}){
 checkInputSignal(signal);
 let inventory;try{inventory=JSON.parse(await readExecutionRef({referenceRoot,ref,signal,maxBytes:2*1024*1024}));}catch{checkInputSignal(signal);throw inputFailure('VERIFICATION_INPUT_CHANGED','Bound inventory file is unavailable or changed.');}
 if(inventory.kind!==kind)throw inputFailure('VERIFICATION_INPUT_INVALID','Inventory kind does not match consuming workload.');
 const fresh=await validateInputInventory({inventory,root,signal});return {inventory,fresh};
}
// Installed tree must match inventory exactly, including unexpected files; never follow symlinks.
export async function inventoryTreePaths(root){
 const out=[];async function visit(rel=''){for(const entry of await readdir(join(root,rel),{withFileTypes:true})){const name=rel?rel+'/'+entry.name:entry.name;if(!safeExecutionPath(name)||entry.isSymbolicLink())throw inputFailure('VERIFICATION_INPUT_INVALID','Unsafe installed input path.');if(entry.isDirectory())await visit(name);else if(entry.isFile())out.push(name);else throw inputFailure('VERIFICATION_INPUT_INVALID','Unsupported installed file type.');}}
 await visit();return out.sort();
}
export async function readImageBytes(root,ref){
 await readExecutionRef({referenceRoot:root,ref,maxBytes:INPUT_MAX_BYTES});const bytes=await readFile(resolve(root,ref.path));
 if(bytesDigest(bytes)!==ref.digest)throw inputFailure('VERIFICATION_INPUT_CHANGED','Image changed while reading.');
 // Formal image-byte evidence only. An actual qualified reviewer must inspect the images.
 // Conservative container checks are not decoding or visual proof; actual image inspection
 // by the separately bound qualified reviewer is mandatory even when these bytes are supported.
 const png=bytes.length>=57&&bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))&&bytes.readUInt32BE(8)===13&&bytes.toString('ascii',12,16)==='IHDR'&&bytes.readUInt32BE(16)>0&&bytes.readUInt32BE(20)>0&&bytes.readUInt32BE(16)*bytes.readUInt32BE(20)<=100000000&&bytes.toString('ascii',bytes.length-8,bytes.length-4)==='IEND';
 const jpeg=bytes.length>=64&&bytes[0]===255&&bytes[1]===216&&bytes.at(-2)===255&&bytes.at(-1)===217&&bytes.some((b,i)=>b===255&&[192,193,194].includes(bytes[i+1]));
 const webp=bytes.length>=30&&bytes.toString('ascii',0,4)==='RIFF'&&bytes.readUInt32LE(4)===bytes.length-8&&bytes.toString('ascii',8,12)==='WEBP'&&['VP8 ','VP8L','VP8X'].includes(bytes.toString('ascii',12,16));
 if(!png&&!jpeg&&!webp)throw inputFailure('VISUAL_EVIDENCE_UNSUPPORTED','Visual evidence requires actual PNG, JPEG or WebP bytes.');
 return {path:ref.path,digest:ref.digest,bytes:bytes.length};
}
