import assert from "node:assert/strict";
import test from "node:test";

import { verifyEmailModelSource } from "../../scripts/lib/email-source-fidelity.mjs";

const variants = { mobile: "mobile", desktop: "desktop" };
const plain = (value) => ({ type: "plain-text", value });
const empty = (instance_id, component_id) => ({
  instance_id, component_id, variants,
  property_values: [], content_values: [], asset_files: [], slots: [],
});

function scenario() {
  const root = empty("letter", "email-template");
  const a = empty("a", "block-sample");
  const b = empty("b", "block-sample");
  const a…2746 tokens truncated…CE_RELATION_MISMATCH"));
  const scope = scenario();
  scope.readings.selection.mobile.terminal = false;
  assert.ok(codes(scope).includes("EMAIL_SOURCE_EVIDENCE_INCOMPLETE"));
});

test("duplicate source or correspondence keys cannot be silently overwritten", () => {
  const source = scenario();
  source.readings.fields.push({ ...source.readings.fields[0] });
  assert.ok(codes(source).includes("EMAIL_SOURCE_DUPLICATE"));
  const mapped = scenario();
  mapped.correspondence.fields.push({ ...mapped.correspondence.fields[0] });
  assert.ok(codes(mapped).includes("EMAIL_SOURCE_DUPLICATE"));
});


test("source variant selection must match the email model", () => {
  const input = scenario();
  input.readings.instances.find(({ node_id }) => node_id === "m-a").variant_id = "desktop";
  assert.ok(codes(input).includes("EMAIL_SOURCE_VARIANT_MISMATCH"));
});

