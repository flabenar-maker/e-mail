import test from "node:test";
import assert from "node:assert/strict";

import {
  measureEmailOutput,
  validateEmbeddedCssBudget,
} from "../../scripts/lib/email-metrics.mjs";

test("email output metrics count UTF-8 bytes rather than JavaScript characters", () => {
  assert.deepEqual(measureEmailOutput({ html: "é", css: "" }), {
    html_bytes: 2,
    embedded_css_bytes: 0,
  });
});

test("embedded CSS budget is exclusive at the exact byte boundary", () => {
  assert.deepEqual(validateEmbeddedCssBudget("a".repeat(16383), 16384), []);

  const errors = validateEmbeddedCssBudget("a".repeat(16384), 16384);
  assert.equal(errors.length, 1);
  assert.equal(errors[0].code, "RENDER_EMBEDDED_CSS_BUDGET_EXCEEDED");
  assert.equal(errors[0].path, "/embedded_css");
  assert.match(errors[0].message, /16384/u);
  assert.match(errors[0].message, /exclusive limit 16384/u);
});

test("embedded CSS budget uses UTF-8 bytes for non-ASCII CSS", () => {
  assert.deepEqual(validateEmbeddedCssBudget("é".repeat(8191), 16384), []);
  assert.equal(
    validateEmbeddedCssBudget("é".repeat(8192), 16384)[0].code,
    "RENDER_EMBEDDED_CSS_BUDGET_EXCEEDED",
  );
});