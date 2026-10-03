import assert from 'node:assert/strict';
import test from 'node:test';
const proofs = await import('../../scripts/lib/contract-fact-proofs.mjs').catch(() => ({}));
test('typed fact proofs retain an unmapped obligation when optional proof links are empty', () => {
  assert.equal(typeof proofs.applyContractFactProofCoverage,'function','typed effective-coverage mechanism is absent');
  const facts={ok:false,issues:[{code:'CONTRACT_FACT_UNMAPPED',contract_path:'/contracts/mobile/root/facts/0/value/value'}]};
  assert.deepEqual(proofs.applyContractFactProofCoverage({facts,proofs:{results:[],verified_contract_paths:[],verified_sources:[]}}),facts);
});
