import test from "node:test";
import assert from "node:assert/strict";

import { buildEmailPreview } from "../../scripts/lib/email-preview.mjs";

const HTML = "<!doctype html><html><head><style>.desktop{display:block}</style><meta charset=\"utf-8\"><style media=\"screen\">.mobile{display:none}</style></head><body><table style=\"width:100%\"><tr><td><img src=\"images/card.jpg\" alt=\"\"></td></tr></table></body></html>";

test("normal preview preserves rendered HTML byte-for-byte", () => {
  assert.equal(buildEmailPreview({ html: HTML, mode: "normal" }), HTML);
});

test("no-style preview removes only style blocks", () => {
  assert.equal(
    buildEmailPreview({ html: HTML, mode: "no-style" }),
    "<!doctype html><html><head><meta charset=\"utf-8\"></head><body><table style=\"width:100%\"><tr><td><img src=\"images/card.jpg\" alt=\"\"></td></tr></table></body></html>",
  );
});

test("preview rejects an unsupported mode", () => {
  assert.throws(
    () => buildEmailPreview({ html: HTML, mode: "invent-layout" }),
    (error) => error.code === "EMAIL_PREVIEW_MODE_UNSUPPORTED",
  );
});