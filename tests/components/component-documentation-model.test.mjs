import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  deriveComponentRenderType,
  validateComponentDocumentation,
  validateComponentRegistryShape,
} from "../../scripts/lib/component-registry.mjs";
import { readStrictYaml } from "../../scripts/lib/strict-yaml.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const schemaPath = join(repoRoot, "schemas/components.schema.json");

async function canonicalV2Document() {
  const document = await readStrictYaml(
    join(repoRoot, "data/components/marketing.yaml"),
  );
  document.schema_version = "2.1.0";
  for (const record of document.components) {
    delete record.description;
    record.documentation = {
      purpose: `Назначение компонента ${record.id}.`,
      critical_constraint_ids: [],
    };
    record.constraints = [];
  }
  return document;
}

function renderElement(id, renderMode, children = []) {
  return {
    id,
    semantic_role: id,
    render_mode: renderMode,
    visibility: { mode: "always" },
    facts: [],
    children,
    ...(renderMode === "direct-image"
      ? { asset_contract_id: "visual" }
      : {}),
  };
}

function renderRecord(...modes) {
  const root = renderElement(
    "root",
    "presentation-table",
    modes.map((mode, index) => renderElement(`child-${index + 1}`, mode)),
  );
  return {
    id: "component-test",
    contracts: {
      mobile: { root: structuredClone(root) },
      desktop: { root: structuredClone(root) },
    },
    documentation: {
      purpose: "Проверка типа рендеринга.",
      critical_constraint_ids: [],
    },
    constraints: [],
  };
}

function diagnosticCodes(errors) {
  return errors.map((error) => error.code);
}

test("schema 2.0 accepts typed component documentation", async () => {
  const schema = JSON.parse(await readFile(schemaPath, "utf8"));
  const document = await canonicalV2Document();
  const record = document.components[0];
  record.documentation = {
    purpose: "Вторичный промобаннер с текстовой и визуальной областями.",
    critical_constraint_ids: ["mobile-image-preserve-ratio"],
  };
  record.constraints = [
    {
      id: "mobile-image-preserve-ratio",
      scope: "mobile",
      kind: "responsive-image",
      severity: "critical",
      statement:
        "Изображение меняет ширину только с пропорциональным изменением высоты.",
    },
  ];

  assert.deepEqual(validateComponentRegistryShape(document, schema), []);
});

for (const [name, mutate] of [
  [
    "empty purpose",
    (record) => {
      record.documentation.purpose = "";
    },
  ],
  [
    "unsupported scope",
    (record) => {
      record.constraints = [{
        id: "rule",
        scope: "tablet",
        kind: "layout",
        severity: "required",
        statement: "Правило.",
      }];
    },
  ],
  [
    "unsupported kind",
    (record) => {
      record.constraints = [{
        id: "rule",
        scope: "all",
        kind: "anything",
        severity: "required",
        statement: "Правило.",
      }];
    },
  ],
  [
    "unsupported severity",
    (record) => {
      record.constraints = [{
        id: "rule",
        scope: "all",
        kind: "layout",
        severity: "optional",
        statement: "Правило.",
      }];
    },
  ],
  [
    "extra documentation field",
    (record) => {
      record.documentation.comment = "Не входит в контракт.";
    },
  ],
]) {
  test(`schema 2.0 rejects ${name}`, async () => {
    const schema = JSON.parse(await readFile(schemaPath, "utf8"));
    const document = await canonicalV2Document();
    mutate(document.components[0]);
    assert.notDeepEqual(validateComponentRegistryShape(document, schema), []);
  });
}

test("documentation validation rejects duplicate and broken critical references", () => {
  const record = renderRecord("html-text");
  record.constraints = [
    {
      id: "same-rule",
      scope: "all",
      kind: "layout",
      severity: "required",
      statement: "Первое правило.",
    },
    {
      id: "same-rule",
      scope: "mobile",
      kind: "responsive-image",
      severity: "critical",
      statement: "Второе правило.",
    },
  ];
  record.documentation.critical_constraint_ids = [
    "same-rule",
    "unknown-rule",
  ];

  const errors = validateComponentDocumentation(record);
  const codes = diagnosticCodes(errors);
  assert.ok(codes.includes("COMPONENT_CONSTRAINT_ID_DUPLICATE"));
  assert.ok(codes.includes("COMPONENT_CRITICAL_CONSTRAINT_UNKNOWN"));
  assert.ok(codes.includes("COMPONENT_CRITICAL_CONSTRAINT_NOT_CRITICAL"));
  assert.ok(errors.every((error) => error.message.includes(record.id)));
});

test("documentation validation rejects an empty purpose and retired prose blocks", () => {
  const record = renderRecord("html-text");
  record.documentation.purpose = "";
  record.description = {
    mode: "rendered",
    blocks: [{ type: "heading", value: "SCOPE" }],
  };

  const codes = diagnosticCodes(validateComponentDocumentation(record));
  assert.ok(codes.includes("COMPONENT_PURPOSE_MISSING"));
  assert.ok(codes.includes("COMPONENT_DOCUMENTATION_RETIRED_BLOCKS_FORBIDDEN"));
});

test("render type is derived from actual viewport output modes", () => {
  assert.equal(deriveComponentRenderType(renderRecord("html-text")), "HTML");
  assert.equal(deriveComponentRenderType(renderRecord("direct-image")), "ASSET");
  assert.equal(
    deriveComponentRenderType(renderRecord("html-text", "direct-image")),
    "HYBRID",
  );
});

test("ambiguous Figma-only output produces a typed blocker", () => {
  const record = renderRecord("figma-source-only");
  assert.equal(deriveComponentRenderType(record), null);
  assert.ok(
    diagnosticCodes(validateComponentDocumentation(record)).includes(
      "COMPONENT_RENDER_TYPE_UNRESOLVED",
    ),
  );
});
