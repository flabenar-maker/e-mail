import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {readBoundInventory,inventoryTreePaths,bytesDigest,inputFailure} from './lib/execution-inputs.mjs';
import {readExecutionRef} from './lib/execution-context.mjs';
export async function verifyInstalledSkills({inventoryRef,referenceRoot,skillsRoot,repoRoot}={}){
 if(!inventoryRef||!referenceRoot||!skillsRoot||!repoRoot)throw inputFailure('INSTALLED_SKILLS_EVIDENCE_MISSING','A bound inventory, explicit installed root and exact source root are required.');
 const {inventory,fresh}=await readBoundInventory({ref:inventoryRef,referenceRoot,root:skillsRoot,kind:'installed-skills'});
 const expected=await inventoryTreePaths(resolve(repoRoot,'.agents/skills'));
 // Only repository-owned skill directories are in scope; other installed skills are unrelated.
 const owned=[...new Set(expected.map(p=>p.split('/')[0]))];
 const actual=(await Promise.all(owned.map(async name=>(await inventoryTreePaths(resolve(skillsRoot,name))).map(p=>name+'/'+p)))).flat().sort();
 if(JSON.stringify(actual)!==JSON.stringify(expected)||JSON.stringify([...inventory.files.map(f=>f.path)].sort())!==JSON.stringify(expected))throw inputFailure('INSTALLED_SKILLS_MISMATCH','Installed skill tree must match the complete canonical skill tree.');
 for(const ref of inventory.files){const canonical=await readFile(resolve(repoRoot,'.agents/skills',ref.path));if(bytesDigest(canonical)!==ref.digest)throw inputFailure('INSTALLED_SKILLS_MISMATCH','Installed skill bytes differ from exact canonical source.');}
 return {status:'success',fresh_inventory:fresh};
}
// Inputs are fixed runner-written JSON data; arbitrary shell strings are never evaluated.
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
 try {if(!process.env.CUPIS_VERIFICATION_CONTEXT)throw inputFailure('INSTALLED_SKILLS_EVIDENCE_MISSING','Expected private runner context.');const context=JSON.parse(await readFile(process.env.CUPIS_VERIFICATION_CONTEXT,'utf8'));if(JSON.stringify(process.argv.slice(2))!==JSON.stringify(['--inventory',resolve(context.referenceRoot,context.inventoryRef.path)]))throw inputFailure('INSTALLED_SKILLS_EVIDENCE_MISSING','Arguments must identify the bound inventory file.');const result=await verifyInstalledSkills(context);process.stdout.write(JSON.stringify(result)+'\n');}catch(error){process.stderr.write(JSON.stringify({code:error.code??'INSTALLED_SKILLS_EVIDENCE_UNSUPPORTED'})+'\n');process.exitCode=1;}
}
