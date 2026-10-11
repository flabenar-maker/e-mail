import assert from "node:assert/strict";
import test from "node:test";

import { applyOutputLink } from "../../scripts/lib/email-service-fragments.mjs";
import { collectEmailActions } from "../../scripts/lib/email-action-inventory.mjs";
import { createDeliveryDraft } from "../../scripts/lib/email-delivery-form.mjs";
import { actionComponents, actionModel, profile } from "../fixtures/rendering/email-delivery-fixtures.mjs";
import { validateDeliveryDocument } from "../../scripts/lib/email-delivery.mjs";

const logoUrl = "https://1cupis.ru/?utm_source=crm&utm_medium=email&utm_campaign=logo";
const logoOrigin = {
  component_id: "email-header",
  instance_path: "email/header",
  viewport: "mobile",
  original_element_id: "root-header-logo-compact",
};
const logoTarget = {
  instance_path: "email/header",
  component_id: "email-header",
  viewport: "mobile",
  element_id: "root-header-logo-compact",
  slot_id: "href",
};

test("both header-logo origins gain the fixed managed link without nested anchors or dimension changes", () => {
  const outputBindings = [
    { kind: "managed-output-link", role: "header-logo", href: logoUrl, target: logoTarget },
    { kind: "managed-output-link", role: "header-logo", href: logoUrl, target: { ...logoTarget, viewport: "desktop", element_id: "root-header-logo" } },
  ];
  for (const origin of [
    logoOrigin,
    { ...logoOrigin, viewport: "desktop", original_element_id: "root-header-logo" },
  ]) {
    const result = applyOutputLink({
      html: '<img src="images/header-logo.png" width="212" height="33" style="display:block">',
      origin,
      outputBindings,
      existingAnchorContext: null,
    });
    assert.deepEqual(result.diagnostics, []);
    assert.match(result.html, /<a href="https:\/\/1cupis\.ru\/\?utm_source=crm&amp;utm_medium=email&amp;utm_campaign=logo"/u);
    assert.match(result.html, /width="212" height="33"/u);
    assert.equal((result.html.match(/<a\b/gu) ?? []).length, 1);
  }
});

test("unrelated images are not wrapped and an existing anchor conflict is diagnostic", () => {
  const outputBindings = [{ kind: "managed-output-link", role: "header-logo", href: logoUrl, target: logoTarget }];
  const unrelated = applyOutputLink({
    html: '<img src="images/other.png" width="32" height="32">',
    origin: { ...logoOrigin, original_element_id: "other-image" },
    outputBindings,
    existingAnchorContext: null,
  });
  assert.equal(unrelated.html, '<img src="images/other.png" width="32" height="32">');
  const conflict = applyOutputLink({
    html: '<a href="https://old.example"><img src="images/header-logo.png"></a>',
    origin: logoOrigin,
    outputBindings,
    existingAnchorContext: { href: "https://old.example" },
  });
  assert.ok(conflict.diagnostics.some(({ code }) => /CONFLICT|NESTED/i.test(code)));
});

test("store role URLs and final readiness are driven by collected required fields", () => {
  const stores = profile.roles.filter(({ id }) => id.startsWith("store-"));
  assert.deepEqual(stores.map(({ id }) => id), ["store-rustore", "store-google-play", "store-appgallery", "store-getapps"]);
  const configured = {
    ...profile,
    roles: profile.roles.map((role) => role.id === "footer-site" || role.id === "footer-support" || role.id.startsWith("nps-")
      ? { ...role, href: `https://valid.test/${role.id}` }
      : role),
  };
  const model = actionModel({ includeNps: true });
  const inventory = collectEmailActions({ model, componentIndex: actionComponents, profile: configured });
  const draft = createDeliveryDraft({ emailId: model.id, sourceSha: "8f4648681bd7ac72c5217190f1d523c0cb5f85f4", profile: configured, inventory });
  const readyDocument = { ...draft, subject: "Тема", answers: Object.fromEntries(inventory.fields.map((field) => [field.id, field.managed ? field.value : `https://1cupis.ru/${field.role ?? field.id}`])) };
  const ready = validateDeliveryDocument({ document: readyDocument, inventory, profile: configured, purpose: "final", emailId: model.id });
  assert.equal(ready.some(({ code }) => code === "EMAIL_DELIVERY_REQUIRED_URL"), false);
  const required = inventory.fields.find(({ required, managed }) => required && !managed);
  const missingDocument = { ...readyDocument, answers: { ...readyDocument.answers, [required.id]: "" } };
  const missing = validateDeliveryDocument({ document: missingDocument, inventory: { ...inventory, fields: inventory.fields.map((field) => field.id === required.id ? { ...field, value: "" } : field) }, profile: configured, purpose: "final", emailId: model.id });
  assert.ok(missing.some(({ code }) => code === "EMAIL_DELIVERY_REQUIRED_URL"));
  const absentNps = collectEmailActions({ model: actionModel({ includeNps: false }), componentIndex: actionComponents, profile: configured });
  assert.equal(absentNps.fields.some(({ role }) => String(role).startsWith("nps-")), false);
  assert.equal(logoUrl, profile.roles.find(({ id }) => id === "header-logo").href);
});
