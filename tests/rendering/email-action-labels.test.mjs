import assert from "node:assert/strict";
import test from "node:test";
import { collectEmailActions } from "../../scripts/lib/email-action-inventory.mjs";
import { actionModel, actionComponents, profile } from "../fixtures/rendering/email-delivery-fixtures.mjs";

function labeledCards() {
  const componentIndex = structuredClone(actionComponents);
  const card = componentIndex.bySystemId.get("card");
  const title = { id: "card-title", semantic_role: "title", render_mode: "html-text", visibility: { mode: "always" }, facts: [], content_slots: [{ id: "text", type: "plain-text", required: true }], children: [] };
  for (const viewport of ["mobile", "desktop"]) card.contracts[viewport].root.children.unshift(structuredClone(title));
  const model = actionModel();
  for (const entry of model.root.nested_components.filter(entry => entry.instance.component_id === "card")) entry.instance.content_values.push({ element_id: "card-title", slot_id: "text", scope: "all", value: { type: "plain-text", value: entry.instance.instance_id === "card" ? "Первый бонус" : "Второй бонус" } });
  return { model, componentIndex };
}

test("identical CTA text is disambiguated by its actual visible card owner text", () => {
  const { fields, diagnostics } = collectEmailActions({ ...labeledCards(), profile });
  assert.deepEqual(diagnostics, []);
  const first = fields.find(field => field.bindings.some(binding => binding.instance_path === "email/card/cta"));
  const second = fields.find(field => field.bindings.some(binding => binding.instance_path === "email/card-2/cta-2"));
  assert.equal(first.label, "Подробнее"); assert.equal(second.label, "Подробнее");
  assert.match(first.block_label, /Первый бонус/); assert.match(second.block_label, /Второй бонус/);
});

test("registered action descriptions never replace the concrete visible button text", () => {
  const configured = { ...profile, roles: [...profile.roles, { id: "cta-link", label: "Системное имя роли", component_id: "button", bindings: ["mobile", "desktop"].map(viewport => ({ viewport, element_id: "button-root", slot_id: "href", kind: "slot-link" })) }] };
  const { fields } = collectEmailActions({ ...labeledCards(), profile: configured });
  const button = fields.find(field => field.role === "cta-link");
  assert.equal(button.label, "Подробнее");
  assert.match(button.block_label, /Первый бонус/);
});
