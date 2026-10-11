import Ajv2020 from 'ajv/dist/2020.js';
import schema from '../../schemas/machine-profile.schema.json' with {type:'json'};
const validate=new Ajv2020({strict:true,allErrors:true}).compile(schema);
// Shared pure validator: importing this module cannot read a saved profile or collect hardware.
export function isValidMachineProfile(profile,pairKey) {
 return validate(profile)&&profile.pair_key===pairKey&&Number.isFinite(Date.parse(profile.initialized_at))&&new Set(profile.workload_decisions.map(x=>x.id)).size===profile.workload_decisions.length&&(profile.observations_status!=='unavailable'||profile.workload_decisions.every(x=>x.target==='github-hosted'));
}
export function validatedProfileWrapper({wrapper,pairKey}) {
 if(typeof pairKey!=='string'||!pairKey||wrapper?.status!=='resolved'||wrapper.pair_key!==pairKey||!isValidMachineProfile(wrapper.profile,pairKey))return {status:'invalid',code:'PROFILE_STATE_INVALID'};
 return wrapper;
}
