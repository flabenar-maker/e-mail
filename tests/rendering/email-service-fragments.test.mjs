import assert from "node:assert/strict";
import test from "node:test";

import { buildEmailServiceFragments } from "../../scripts/lib/email-service-fragments.mjs";
import { draft, profile } from "../fixtures/rendering/email-delivery-fixtures.mjs";

test("service fragments preserve ordered preheader padding marker and exact invisible code points", () => {
  const result = buildEmailServiceFragments({ deliveryDocument: draft, profile });
  assert.deepEqual(Object.keys(result), ["preheader", "padding", "snippetEnd"]);
  assert.ok(result.preheader.protected);
  assert.ok(result.padding.protected);
  assert.ok(result.snippetEnd.protected);
  assert.match(result.preheader.html, /Прехедер/u);
  assert.match(result.snippetEnd.html, /<vk-snippet-end><\/vk-snippet-end>/u);
  const prefix = result.snippetEnd.html.match(/>([^<]+)<vk-snippet-end>/u)?.[1];
  assert.deepEqual([...prefix].map((character) => character.codePointAt(0)), [0x034f, 0x200c, 0x20]);
});

test("protected fragments do not enter plain text and unsubscribe remains the exact managed token", () => {
  const result = buildEmailServiceFragments({ deliveryDocument: draft, profile });
  assert.equal(result.preheader.plain_text, "");
  assert.equal(result.padding.plain_text, "");
  assert.equal(result.snippetEnd.plain_text, "");
  const unsubscribe = profile.roles.find(({ id }) => id === "footer-unsubscribe");
  assert.equal(unsubscribe.href, "{unsubscribe}");
  assert.doesNotMatch(result.preheader.html + result.padding.html + result.snippetEnd.html, /unsubscrube|data-name|\sid=/iu);
});
