import assert from "node:assert/strict";
import test from "node:test";

import {
  buildPersonalizationPreview,
  emitGreetingTemplate,
  planTemplateRules,
} from "../../scripts/lib/email-template-rules.mjs";
import { buildPlainText } from "../../scripts/lib/email-plain-text.mjs";
import { actionModel, inventory, profile } from "../fixtures/rendering/email-delivery-fixtures.mjs";

const TEMPLATE = "{if lead._fname}Здравствуйте, {uppercasefirst(lead._fname)}!{else}Здравствуйте!{end}";
const greetingBinding = {
  instance_path: "email/transaction",
  component_id: "block-transaction-success",
  viewport: "mobile",
  element_id: "root-greeting",
  slot_id: "text",
};

function serviceProfile() {
  return {
    ...profile,
    service_rules: { enabled: true },
  };
}

test("exact and NBSP standalone greetings emit the exact Altcraft template", () => {
  const rule = { kind: "conditional-greeting", bindings: [greetingBinding] };
  assert.equal(emitGreetingTemplate({ rule, originalText: "Здравствуйте, Имя!" }), TEMPLATE);
  assert.equal(emitGreetingTemplate({ rule, originalText: " Здравствуйте, Имя! " }), TEMPLATE);
});

test("repeated greetings share one policy while near matches stay unchanged", () => {
  const model = actionModel();
  const source = structuredClone(model);
  const result = planTemplateRules({
    model,
    inventory: {
      ...inventory,
      text_bindings: [
        { ...greetingBinding, value: "Здравствуйте, Имя!" },
        { ...greetingBinding, instance_path: "email/footer", value: "Здравствуйте, Имя!" },
        { ...greetingBinding, instance_path: "email/other", value: "Здравствуйте, Имя, команда!" },
      ],
    },
    profile: serviceProfile(),
  });
  assert.deepEqual(model, source);
  assert.equal(result.diagnostics.length, 0);
  assert.equal(result.rules.length, 2);
  assert.ok(result.rules.every(({ emitted_template }) => emitted_template === TEMPLATE));
  assert.equal(result.rules.some(({ original_text }) => original_text === "Здравствуйте, Имя, команда!"), false);
});

test("preview name, empty name, and long name are separate copies and never alter final input", () => {
  const emissionInput = {
    model: actionModel(),
    dependencies: { marker: "native-dependencies" },
    deliveryDocument: { email_id: "release-42" },
    inventory,
    templateRules: {
      rules: [{ kind: "conditional-greeting", bindings: [greetingBinding], emitted_template: TEMPLATE }],
      diagnostics: [],
    },
  };
  const original = structuredClone(emissionInput);
  const named = buildPersonalizationPreview({ emissionInput, scenario: { first_name: "алексей" } });
  const empty = buildPersonalizationPreview({ emissionInput, scenario: {} });
  const long = buildPersonalizationPreview({ emissionInput, scenario: { first_name: "Александра-Виктория" } });
  assert.deepEqual(emissionInput, original);
  assert.notStrictEqual(named.model, emissionInput.model);
  assert.equal(named.purpose, "preview");
  assert.deepEqual(named.previewValues, [{ target: greetingBinding, value: "Здравствуйте, Алексей!" }]);
  assert.deepEqual(empty.previewValues, [{ target: greetingBinding, value: "Здравствуйте!" }]);
  assert.deepEqual(long.previewValues, [{ target: greetingBinding, value: "Здравствуйте, Александра-Виктория!" }]);
  assert.doesNotMatch(JSON.stringify(emissionInput), /алексей|Александра-Виктория/u);
});

test("plain text receives the same greeting template and managed unsubscribe once without service fragments", () => {
  const model = {
    schema_version: "1.1.0",
    id: "release-42",
    metadata: { language: "ru", direction: "ltr" },
    root: {
      instance_id: "email",
      component_id: "email",
      variants: { mobile: "mobile", desktop: "desktop" },
      property_values: [],
      content_values: [{
        element_id: "greeting",
        slot_id: "text",
        scope: "all",
        value: { type: "plain-text", value: TEMPLATE },
      }],
      asset_files: [],
      slots: [],
      nested_components: [],
    },
  };
  const text = buildPlainText({
    model,
    inventory: {
      ...inventory,
      fields: [{ id: "footer-unsubscribe", label: "Отписка", required: true, managed: true, value: "{unsubscribe}", bindings: [] }],
    },
    deliveryDocument: { ...profile, answers: { "footer-unsubscribe": "{unsubscribe}" }, plain_text: { mode: "auto" } },
    profile,
  });
  assert.equal((text.match(/\{if lead\._fname\}/gu) ?? []).length, 1);
  assert.equal((text.match(/\{unsubscribe\}/gu) ?? []).length, 1);
  assert.doesNotMatch(text, /vk-snippet-end|\u034f|\u200c/u);
});
