import {readFile,mkdir,writeFile,realpath} from 'node:fs/promises';
import {resolve,dirname,basename,relative,isAbsolute,join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createGhAdapter,createCloudRequestStore,requestCloudVerification,readCloudVerification} from './lib/cloud-verification.mjs';
const usage='Usage: request-cloud-verification --decision FILE --pr NUMBER --repository OWNER/REPO --state-root DIR; result: --request FILE [--output NEW_EVIDENCE_DIR]. Request is an explicit opt-in. State must be in a persistent authorized local directory outside disposable source. Output preserves verified evidence files with receipt-relative paths; finalization uses that directory as reference root. No service enablement or automatic retries.';
function parse(args){const o={};for(let i=0;i<args.length;i+=2){if(!['--decision','--pr','--repository','--state-root','--request','--output'].includes(args[i])||!args[i+1]||args[i+1].startsWith('--')||Object.hasOwn(o,args[i]))throw new Error(usage);o[args[i]]=args[i+1];}if(o['--request']){if(Object.keys(o).some(k=>!['--request','--output'].includes(k)))throw new Error(usage);}else if(['--decision','--pr','--repository','--state-root'].some(k=>!o[k])||o['--output']||!/^[1-9][0-9]*$/u.test(o['--pr']))throw new Error(usage);return o;}
export async function main(args=process.argv.slice(2),{gh=createGhAdapter()}={}){
 if(args.length===1&&args[0]==='--help'){process.stdout.write(usage+'\n');return 0;}
 let options;try{options=parse(args);}catch{process.stdout.write(JSON.stringify({status:'blocked',code:'CLOUD_CLI_ARGUMENTS',message:usage})+'\n');return 2;}
 try{
  let result;
  if(options['--request']){
   const saved=JSON.parse(await readFile(options['--request'],'utf8'));let files;
   const wrapped={...gh,downloadArtifact:async input=>{files=await gh.downloadArtifact(input);return files;}};
   result=await readCloudVerification({request:saved.request??saved,gh:wrapped});
   if(options['--output']){
    const source=await realpath(process.cwd()),output=join(await realpath(dirname(resolve(options['--output']))),basename(resolve(options['--output']))),rel=relative(source,output);
    if(!rel||(!rel.startsWith('..')&&!isAbsolute(rel)))throw new Error('Evidence output must be outside the source directory.');
    await mkdir(output);
    // Malformed artifacts never become verification evidence. Bound terminal metadata
    // can still be saved for the informational offer while quality remains blocked.
    if(result.target==='github-hosted'&&files)for(const [name,bytes] of Object.entries(files))if(name!=='receipt.json')await writeFile(join(output,name),bytes,{flag:'wx'});
    await writeFile(join(output,'cloud-result.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});
   }
  }else{
   const decision=JSON.parse(await readFile(options['--decision'],'utf8'));
   result=await requestCloudVerification({decision,prIdentity:{repository:options['--repository'],number:Number(options['--pr']),explicitlySelected:true},gh,requestStore:createCloudRequestStore({stateRoot:options['--state-root']})});
  }
  process.stdout.write(JSON.stringify(result)+'\n');return result.status==='requested'||result.conclusion==='success'?0:1;
 }catch{process.stdout.write(JSON.stringify({status:'blocked',code:'CLOUD_CLI_INPUT_INVALID',message:'Cloud input, persistent state or evidence output could not be read or saved.'})+'\n');return 1;}
}
if(process.argv[1]&&pathToFileURL(resolve(process.argv[1])).href===import.meta.url)process.exitCode=await main();
