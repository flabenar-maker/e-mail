import assert from 'node:assert/strict';
import test from 'node:test';
import {fixture} from './native-relationship-coverage.test.mjs';
import {collectRequiredComponentEvidence} from '../../scripts/lib/figma-component-evidence.mjs';

test('ordinary HTML native relation metadata does not dispatch into artwork scope', () => {
  const {record, packet} = fixture();
  assert.deepEqual(collectRequiredComponentEvidence({record, live: packet}), {required_sources: [], issues: []});
});
