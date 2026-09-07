import test from "node:test";
import assert from "node:assert/strict";
import { dirname, join } from "node:path";
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
  return Object.values(registries)
    .flatMap((registry) => registry.components)
    .find((record) => record.id === id);
}

test("renderer produces one deterministic compact Description", async () => {
  const record = await byId("banner-fiscal-check-link");
  const expected = [
    "CUPIS ID: banner-fiscal-check-link",
    "PURPOSE: Группа кликабельных строк со ссылками на проверку фискального чека.",
    "RENDER: HYBRID",
    "",
    "CRITICAL",
    "- Каждая видимая ячейка строки содержит ссылку с одним URL, чтобы кликабельной оставалась вся площадь строки без помещения таблицы внутрь ссылки.",
    "",
  ].join("\n");

  assert.equal(renderFigmaComponentDescription(record), expected);
  assert.equal(renderComponentDescription(record), expected);
  assert.equal(renderFigmaComponentDescription(record).includes("\r"), false);
});

test("renderer omits CRITICAL when no critical constraints are selected", async () => {
  const record = await byId("banner-secondary");
  const rendered = renderFigmaComponentDescription(record);
  assert.equal(
    rendered,
    [
      "CUPIS ID: banner-secondary",
      "PURPOSE: Вторичный промобаннер с текстовой и визуальной областями.",
      "RENDER: HYBRID",
      "",
    ].join("\n"),
  );
  assert.doesNotMatch(rendered, /CRITICAL/u);
});

test("comparison is exact after LF normalization", () => {
  assert.deepEqual(
    compareFigmaComponentDescription("one\r\ntwo\r\n", "one\ntwo\n"),
    [],
  );
  const errors = compareFigmaComponentDescription("expected\n", "actual\n");
  assert.equal(errors.length, 1);
  assert.equal(errors[0].code, "FIGMA_COMPONENT_DESCRIPTION_DRIFT");
  assert.equal(errors[0].path, "/description");
});

test("renderer refuses incomplete documentation instead of guessing", async () => {
  const record = structuredClone(await byId("banner-secondary"));
  record.documentation.purpose = "";
  assert.throws(
    () => renderFigmaComponentDescription(record),
    (error) => error.code === "COMPONENT_PURPOSE_MISSING",
  );

  const unresolved = structuredClone(record);
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
    (error) => error.code === "COMPONENT_RENDER_TYPE_UNRESOLVED",
  );
});
