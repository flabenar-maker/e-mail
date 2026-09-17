import test from "node:test";
import assert from "node:assert/strict";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import {
  compareFigmaComponentDescription,
  renderComponentDescription,
  renderFigmaComponentDescription,
} from "../../scripts/lib/component-description.mjs";
import { loadComponentRegistries } from "../../scripts/lib/component-registry.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));

async function byId(id) {
  const registries = await loadComponentRegistries({ repoRoot });
  const record = Object.values(registries)
    .flatMap((registry) => registry.components)
    .find((candidate) => candidate.id === id);
  assert.ok(record, `Missing fixture component ${id}.`);
  return record;
}

const fiscalExpected = [
  "CUPIS ID: banner-fiscal-check-link",
  "PURPOSE: Группа кликабельных строк со ссылками на проверку фискального чека.",
  "RENDER: HYBRID",
  "",
  "CRITICAL",
  "- Каждая видимая ячейка строки содержит ссылку с одним URL, чтобы кликабельной оставалась вся площадь строки без помещения таблицы внутрь ссылки.",
  "- item-01 использует отдельный ofd-badge @4x, item-02 отдельный fns-badge @4x; эти изображения не заменяются общим bank-badge.",
  "",
].join("\n");

test("renderer produces the exact compact projection with selected CRITICAL only", async () => {
  const record = await byId("banner-fiscal-check-link");

  assert.equal(renderFigmaComponentDescription(record), fiscalExpected);
  assert.equal(renderComponentDescription(record), fiscalExpected);
});

test("renderer omits the whole CRITICAL section when selection is empty", async () => {
  const record = await byId("banner-secondary");
  assert.equal(
    renderFigmaComponentDescription(record),
    [
      "CUPIS ID: banner-secondary",
      "PURPOSE: Вторичный промобаннер с текстовой и визуальной областями.",
      "RENDER: HYBRID",
      "",
    ].join("\n"),
  );
});

test("full contracts, foundations and authoring metadata cannot leak into Description", async () => {
  const record = structuredClone(await byId("banner-fiscal-check-link"));
  record.identity.figma_name = "FORBIDDEN_FIGMA_NAME";
  record.figma.node_id = "FORBIDDEN_NODE_ID";
  record.figma.structure_fingerprint = "FORBIDDEN_FINGERPRINT";
  record.variants.push({
    id: "forbidden-variant",
    node_id: "FORBIDDEN_VARIANT_NODE",
    axes: [{ name: "FORBIDDEN_AXIS", value: "FORBIDDEN_VALUE" }],
  });
  record.properties.push({
    id: "forbidden-property",
    figma_name: "FORBIDDEN_PROPERTY",
    type: "boolean",
    default: true,
  });
  record.provenance.baseline_path = "FORBIDDEN_PROVENANCE";
  record.contracts.mobile.root.facts.push({
    id: "forbidden-fact",
    value: { type: "string", value: "FORBIDDEN_MOBILE_TREE" },
    provenance: {
      kind: "registry-literal",
      source_path: "FORBIDDEN_SPACING_TYPOGRAPHY_TABLE",
    },
  });
  record.contracts.desktop.root.facts.push({
    id: "forbidden-desktop-fact",
    value: { type: "string", value: "FORBIDDEN_DESKTOP_TREE" },
    provenance: {
      kind: "registry-literal",
      source_path: "FORBIDDEN_EMAIL_WORKFLOW",
    },
  });
  record.constraints.push({
    id: "forbidden-unselected-constraint",
    scope: "all",
    kind: "email-rendering",
    severity: "critical",
    statement: "FORBIDDEN_UNSELECTED_CONSTRAINT",
  });

  const rendered = renderFigmaComponentDescription(record);
  assert.equal(rendered, fiscalExpected);
  for (const forbidden of [
    "FORBIDDEN_FIGMA_NAME",
    "FORBIDDEN_NODE_ID",
    "FORBIDDEN_FINGERPRINT",
    "FORBIDDEN_VARIANT",
    "FORBIDDEN_PROPERTY",
    "FORBIDDEN_PROVENANCE",
    "FORBIDDEN_MOBILE_TREE",
    "FORBIDDEN_DESKTOP_TREE",
    "FORBIDDEN_SPACING_TYPOGRAPHY_TABLE",
    "FORBIDDEN_EMAIL_WORKFLOW",
    "FORBIDDEN_UNSELECTED_CONSTRAINT",
  ]) {
    assert.equal(rendered.includes(forbidden), false, forbidden);
  }
});

test("only constraint ids selected by documentation are rendered", async () => {
  const record = structuredClone(await byId("banner-secondary"));
  record.documentation.critical_constraint_ids = ["selected-rule"];
  record.constraints = [
    {
      id: "selected-rule",
      scope: "mobile",
      kind: "responsive-image",
      severity: "critical",
      statement: "Выбранное критическое правило.",
    },
    {
      id: "unselected-rule",
      scope: "desktop",
      kind: "layout",
      severity: "critical",
      statement: "Невыбранное критическое правило.",
    },
  ];

  const rendered = renderFigmaComponentDescription(record);
  assert.match(rendered, /- Выбранное критическое правило\./u);
  assert.doesNotMatch(rendered, /Невыбранное/u);
  assert.doesNotMatch(rendered, /selected-rule|unselected-rule/u);
});

test("renderer rejects missing or non-critical selected constraints", async () => {
  const missing = structuredClone(await byId("banner-secondary"));
  missing.documentation.critical_constraint_ids = ["missing-rule"];
  assert.throws(
    () => renderFigmaComponentDescription(missing),
    (error) =>
      error?.code === "COMPONENT_DESCRIPTION_CRITICAL_REFERENCE" &&
      error?.path === "/documentation/critical_constraint_ids/0",
  );

  const nonCritical = structuredClone(await byId("banner-secondary"));
  nonCritical.constraints = [
    {
      id: "required-rule",
      scope: "all",
      kind: "layout",
      severity: "required",
      statement: "Обычное обязательное правило.",
    },
  ];
  nonCritical.documentation.critical_constraint_ids = ["required-rule"];
  assert.throws(
    () => renderFigmaComponentDescription(nonCritical),
    (error) => error?.code === "COMPONENT_DESCRIPTION_CRITICAL_REFERENCE",
  );
});

test("renderer rejects compact-description bounds with typed errors", async () => {
  const tooLong = structuredClone(await byId("banner-secondary"));
  tooLong.documentation.purpose = "я".repeat(161);
  assert.throws(
    () => renderFigmaComponentDescription(tooLong),
    (error) =>
      error?.code === "COMPONENT_PURPOSE_TOO_LONG" &&
      error?.path === "/documentation/purpose",
  );

  const multiline = structuredClone(await byId("banner-secondary"));
  multiline.documentation.purpose = "Первая строка.\nВторая строка.";
  assert.throws(
    () => renderFigmaComponentDescription(multiline),
    (error) =>
      error?.code === "COMPONENT_PURPOSE_MULTILINE" &&
      error?.path === "/documentation/purpose",
  );

  const tooManyCritical = structuredClone(await byId("banner-secondary"));
  tooManyCritical.constraints = ["one", "two", "three"].map((id) => ({
    id,
    scope: "all",
    kind: "email-rendering",
    severity: "critical",
    statement: `Критическое правило ${id}.`,
  }));
  tooManyCritical.documentation.critical_constraint_ids = [
    "one",
    "two",
    "three",
  ];
  assert.throws(
    () => renderFigmaComponentDescription(tooManyCritical),
    (error) =>
      error?.code === "COMPONENT_DESCRIPTION_CRITICAL_LIMIT" &&
      error?.path === "/documentation/critical_constraint_ids",
  );
});

test("renderer blocks missing purpose and unresolved render type", async () => {
  const missingPurpose = structuredClone(await byId("banner-secondary"));
  missingPurpose.documentation.purpose = "";
  assert.throws(
    () => renderFigmaComponentDescription(missingPurpose),
    (error) => error?.code === "COMPONENT_PURPOSE_MISSING",
  );

  const unresolved = structuredClone(await byId("banner-secondary"));
  unresolved.documentation.purpose = "Тест.";
  unresolved.identity.semantic_role = "block";
  unresolved.contracts.mobile.root = {
    id: "root",
    semantic_role: "source",
    render_mode: "figma-source-only",
    visibility: { mode: "always" },
    facts: [],
    children: [],
  };
  unresolved.contracts.desktop.root = structuredClone(
    unresolved.contracts.mobile.root,
  );
  assert.throws(
    () => renderFigmaComponentDescription(unresolved),
    (error) => error?.code === "COMPONENT_RENDER_TYPE_UNRESOLVED",
  );
});

test("renderer is deterministic and does not mutate the component record", async () => {
  const record = structuredClone(await byId("banner-fiscal-check-link"));
  const before = structuredClone(record);

  const first = renderFigmaComponentDescription(record);
  const second = renderFigmaComponentDescription(record);

  assert.equal(first, second);
  assert.deepEqual(record, before);
  assert.equal(first.endsWith("\n"), true);
});

test("renderer and comparison normalize every JavaScript line separator", async () => {
  const record = structuredClone(await byId("banner-secondary"));
  record.documentation.purpose = "Первая строка.\u2028Вторая строка.\u2029Третья строка.";

  assert.equal(
    renderFigmaComponentDescription(record),
    [
      "CUPIS ID: banner-secondary",
      "PURPOSE: Первая строка. Вторая строка. Третья строка.",
      "RENDER: HYBRID",
      "",
    ].join("\n"),
  );
  assert.deepEqual(
    compareFigmaComponentDescription(
      "one\r\ntwo\rthree\u2028four\u2029",
      "one\ntwo\nthree\nfour\n",
    ),
    [],
  );
});

test("comparison reports one exact drift and otherwise ignores no content", () => {
  assert.deepEqual(
    compareFigmaComponentDescription("one\r\ntwo\r\n", "one\ntwo\n"),
    [],
  );

  const errors = compareFigmaComponentDescription(
    "CUPIS ID: expected\n",
    "CUPIS ID: actual\n",
  );
  assert.equal(errors.length, 1);
  assert.equal(errors[0].code, "FIGMA_COMPONENT_DESCRIPTION_DRIFT");
  assert.equal(errors[0].path, "/description");
});
