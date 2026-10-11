// The sole PR-body field owned by cloud verification. Everything outside it is user text.
const OPEN='<!-- cupis-cloud-verification:v1\n';
const CLOSE='\n-->';
const IDS=new Set(['docs-scoped','repository-full','windows-bootstrap','visual-fixtures']);
const fail=()=>{throw Object.assign(new Error('Invalid explicit cloud verification request.'),{code:'CLOUD_REQUEST_INVALID'});};
export function validateCloudRequest(request){
 if(!request||Object.keys(request).sort().join(',')!=='request_id,schema_version,source_sha,workload_ids'||request.schema_version!=='1.0.0'||!/^[-A-Za-z0-9_.]{1,100}$/u.test(request.request_id??'')||!/^[a-f0-9]{40}$/u.test(request.source_sha??'')||!Array.isArray(request.workload_ids)||!request.workload_ids.length||new Set(request.workload_ids).size!==request.workload_ids.length||request.workload_ids.some(id=>!IDS.has(id)))fail();
 return structuredClone(request);
}
function marker(body){
 if(typeof body!=='string')fail();
 const start=body.indexOf(OPEN);if(start<0){if(body.includes('<!-- cupis-cloud-verification:'))fail();return null;}
 if(body.indexOf('<!-- cupis-cloud-verification:',start+1)>=0)fail();
 const end=body.indexOf(CLOSE,start+OPEN.length);if(end<0)fail();
 let request;try{request=JSON.parse(body.slice(start+OPEN.length,end));}catch{fail();}
 return {start,end:end+CLOSE.length,request:validateCloudRequest(request)};
}
export function writeCloudRequestMarker(body,request){
 const valid=validateCloudRequest(request),old=marker(body),text=OPEN+JSON.stringify(valid)+CLOSE;
 return old?body.slice(0,old.start)+text+body.slice(old.end):body+'\n'+text;
}
export function readCloudEventRequest({eventName,event}){
 if(eventName==='workflow_dispatch'){
  const inputs=event?.inputs;if(!inputs||Object.keys(inputs).sort().join(',')!=='request_id,source_sha,workloads')fail();
  return validateCloudRequest({schema_version:'1.0.0',request_id:inputs.request_id,source_sha:inputs.source_sha,workload_ids:typeof inputs.workloads==='string'?inputs.workloads.split(','):null});
 }
 const pr=event?.pull_request;
 if(eventName!=='pull_request'||event.action!=='labeled'||event.label?.name!=='cupis-cloud-verification'||!pr||pr.mergeable!==true||!event.repository?.full_name||pr.head?.repo?.full_name!==event.repository.full_name)fail();
 const result=marker(pr.body??'');if(!result||result.request.source_sha!==pr.head.sha)fail();return result.request;
}
