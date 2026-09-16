import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { validateDocumentShape } from "../../scripts/lib/schema-validation.mjs";
import {
  parseStrictYaml,
  readStrictYaml,
} from "../../scripts/lib/strict-yaml.mjs";
import {
  loadTypographyFoundation,
  renderFigmaTypographyDescription,
  validateTypographyFoundation,
  validateTypographySemantics,
} from "../../scripts/lib/typography-foundation.mjs";
import {
  copyFixtureFile,
  createSystemFixture,
  writeFixtureFile,
} from "../helpers/system-fixture.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const schemaPath = join(repoRoot, "schemas/typography.schema.json");
const dataPath = join(repoRoot, "data/foundations/typography.yaml");

async function readSchema() {
  return JSON.parse(await readFile(schemaPath, "utf8"));
}

async function canonicalTypography() {
  return readStrictYaml(dataPath);
}

function validate(document, schema) {
  return validateDocumentShape({
    document,
    schema,
    supportedVersion: "1.0.0",
    versionCode: "typography-version-unsupported",
    schemaCode: "typography-schema",
  });
}

test("loads the canonical typography foundation", async () => {
  const [schema, typography] = await Promise.all([
    readSchema(),
    canonicalTypography(),
  ]);

  assert.deepEqual(validate(typography, schema), []);
  assert.equal(typography.styles.length, 15);
  assert.equal(typography.responsive_pairs.length, 8);
});

test("renders Figma descriptions from semantic text and exact typography metrics", async () => {
  const typography = await canonicalTypography();
  const style = typography.styles.find(({ id }) => id === "desktop-display");

  assert.equal(
    renderFigmaTypographyDescription(style),
    "Главный выразительный текст Desktop для Hero-заголовка и крупного результата операции. Не использовать как обычный заголовок блока или карточки. Пара: Mobile/Display. Roboto Bold, 32px, line-height 120%, letter-spacing 0. Стиль управляется централизованно; локальные переопределения запрещены.",
  );

  const mutations = [
    ["font size", (value) => { value.font_size_px = 33; }, "33px", "32px"],
    ["font style", (value) => { value.font.figma_style = "Medium"; }, "Roboto Medium", "Roboto Bold"],
    ["line-height", (value) => { value.line_height = { unit: "px", value: 30 }; }, "line-height 30px", "line-height 120%"],
    ["letter-spacing", (value) => { value.letter_spacing = { unit: "px", value: 1 }; }, "letter-spacing 1px", "letter-spacing 0"],
  ];
  for (const [, mutate, expected, retired] of mutations) {
    const changed = structuredClone(style);
    mutate(changed);
    const description = renderFigmaTypographyDescription(changed);
    assert.ok(description.includes(expected));
    assert.equal(description.includes(retired), false);
  }
});
test("rejects an unsupported typography version", async () => {
  const [schema, typography] = await Promise.all([
    readSchema(),
    canonicalTypography(),
  ]);
  typography.schema_version = "1.1.0";

  const errors = validate(typography, schema);

  assert.equal(errors[0].code, "typography-version-unsupported");
  assert.equal(errors[0].path, "/schema_version");
});

for (const [name, mutate, expectedPath] of [
  [
    "unknown root data",
    (value) => {
      value.unexpected = true;
    },
    "/",
  ],
  [
    "unknown nested data",
    (value) => {
      value.foundation.source.unexpected = true;
    },
    "/foundation/source",
  ],
  [
    "missing styles",
    (value) => {
      delete value.styles;
    },
    "/",
  ],
  [
    "zero font size",
    (value) => {
      value.styles[0].font_size_px = 0;
    },
    "/styles/0/font_size_px",
  ],
  [
    "non-hundred font weight",
    (value) => {
      value.styles[0].font.css_weight = 550;
    },
    "/styles/0/font/css_weight",
  ],
  [
    "measure without unit",
    (value) => {
      delete value.styles[0].line_height.unit;
    },
    "/styles/0/line_height",
  ],
  [
    "unknown viewport",
    (value) => {
      value.styles[0].viewport = "tablet";
    },
    "/styles/0/viewport",
  ],
  [
    "unknown role",
    (value) => {
      value.styles[0].role = "label";
    },
    "/styles/0/role",
  ],
  [
    "unknown variant",
    (value) => {
      value.styles[0].variant = "tiny";
    },
    "/styles/0/variant",
  ],
]) {
  test(`rejects ${name}`, async () => {
    const [schema, typography] = await Promise.all([
      readSchema(),
      canonicalTypography(),
    ]);
    mutate(typography);

    const errors = validate(typography, schema);

    assert.ok(
      errors.some(
        (error) =>
          error.code === "typography-schema" &&
          error.path === expectedPath,
      ),
    );
  });
}

test("rejects a remote reference in the typography schema", async () => {
  const [schema, typography] = await Promise.all([
    readSchema(),
    canonicalTypography(),
  ]);
  schema.$defs.style.properties.font = {
    $ref: "https://example.com/font.schema.json",
  };

  assert.throws(
    () => validate(typography, schema),
    (error) => error.code === "remote-schema-reference",
  );
});

for (const [name, yaml, code] of [
  ["duplicate keys", "schema_version: 1.0.0\nschema_version: 1.0.0\n", "yaml-duplicate-key"],
  ["anchors", "schema_version: &version 1.0.0\n", "yaml-anchor-forbidden"],
  ["aliases", "version: &version 1.0.0\nschema_version: *version\n", "yaml-alias-forbidden"],
  ["merge keys", "base: &base\n  id: typography\nfoundation:\n  <<: *base\n", "yaml-merge-key-forbidden"],
]) {
  test(`strict YAML rejects typography ${name}`, () => {
    assert.throws(
      () => parseStrictYaml(yaml, "typography.yaml"),
      (error) => error.code === code,
    );
  });
}

test("loads and semantically validates the canonical typography foundation", async () => {
  const typography = await loadTypographyFoundation({
    repoRoot,
    dataPath: "data/foundations/typography.yaml",
    schemaPath: "schemas/typography.schema.json",
  });

  assert.equal(typography.foundation.id, "typography");
  assert.deepEqual(validateTypographySemantics(typography), []);
});

for (const [name, mutate, code] of [
  [
    "duplicate style id",
    (value) => {
      value.styles[1].id = value.styles[0].id;
    },
    "duplicate-typography-style-id",
  ],
  [
    "duplicate Figma name",
    (value) => {
      value.styles[1].figma_name = value.styles[0].figma_name;
    },
    "duplicate-typography-figma-name",
  ],
  [
    "duplicate pair id",
    (value) => {
      value.responsive_pairs[1].id = value.responsive_pairs[0].id;
    },
    "duplicate-typography-pair-id",
  ],
  [
    "unknown desktop style",
    (value) => {
      value.responsive_pairs[0].desktop_style_id = "desktop-missing";
    },
    "unknown-typography-desktop-style",
  ],
  [
    "unknown mobile style",
    (value) => {
      value.responsive_pairs[0].mobile_style_id = "mobile-missing";
    },
    "unknown-typography-mobile-style",
  ],
  [
    "non-desktop target",
    (value) => {
      value.responsive_pairs[0].desktop_style_id = "mobile-display";
    },
    "typography-pair-desktop-viewport",
  ],
  [
    "non-mobile target",
    (value) => {
      value.responsive_pairs[0].mobile_style_id = "desktop-display";
    },
    "typography-pair-mobile-viewport",
  ],
  [
    "pair role mismatch",
    (value) => {
      value.responsive_pairs[0].role = "heading";
    },
    "typography-pair-role-mismatch",
  ],
  [
    "unpaired style",
    (value) => {
      value.responsive_pairs = value.responsive_pairs.filter(
        (pair) => pair.id !== "heading-compact",
      );
    },
    "typography-style-unpaired",
  ],
  [
    "Figma name and viewport mismatch",
    (value) => {
      value.styles[0].figma_name = "Mobile/Display-Desktop";
    },
    "typography-figma-name-viewport-mismatch",
  ],
]) {
  test(`reports ${name}`, async () => {
    const typography = await canonicalTypography();
    mutate(typography);

    const errors = validateTypographySemantics(typography);

    assert.ok(errors.some((error) => error.code === code));
  });
}

test("requires a unique exact Figma style id for every semantic style", async () => {
  const typography = await canonicalTypography();
  delete typography.styles[0].figma_style_id;
  const schema = await readSchema();
  assert.ok(
    validate(typography, schema).some(
      (error) => error.code === "typography-schema" && error.path === "/styles/0",
    ),
  );

  const duplicate = await canonicalTypography();
  duplicate.styles[1].figma_style_id = duplicate.styles[0].figma_style_id;
  assert.ok(
    validateTypographySemantics(duplicate).some(
      (error) => error.code === "duplicate-typography-figma-style-id",
    ),
  );

  const sameSemanticRole = await canonicalTypography();
  sameSemanticRole.styles[1].viewport = sameSemanticRole.styles[0].viewport;
  sameSemanticRole.styles[1].role = sameSemanticRole.styles[0].role;
  sameSemanticRole.styles[1].variant = sameSemanticRole.styles[0].variant;
  assert.ok(
    validateTypographySemantics(sameSemanticRole).some(
      (error) => error.code === "duplicate-typography-semantic-identity",
    ),
  );
});
test("sorts semantic diagnostics deterministically", async () => {
  const typography = await canonicalTypography();
  typography.styles[0].figma_name = "Mobile/Wrong";
  typography.styles[1].figma_name = "Mobile/Also-Wrong";

  const errors = validateTypographySemantics(typography);
  const sorted = [...errors].sort(
    (left, right) =>
      left.path.localeCompare(right.path) ||
      left.code.localeCompare(right.code) ||
      left.message.localeCompare(right.message),
  );

  assert.deepEqual(errors, sorted);
});

test("returns expected shape errors without throwing", async (t) => {
  const fixture = await createSystemFixture();
  t.after(fixture.cleanup);
  await copyFixtureFile(
    repoRoot,
    fixture.root,
    "schemas/typography.schema.json",
  );
  const typography = await canonicalTypography();
  typography.schema_version = "2.0.0";
  await writeFixtureFile(
    fixture.root,
    "data/foundations/typography.yaml",
    `${JSON.stringify(typography, null, 2)}\n`,
  );

  const result = await validateTypographyFoundation({
    repoRoot: fixture.root,
    dataPath: "data/foundations/typography.yaml",
    schemaPath: "schemas/typography.schema.json",
  });

  assert.equal(result.typography, null);
  assert.equal(result.errors[0].code, "typography-version-unsupported");
});

test("sanitizes unexpected typography read failures", async (t) => {
  const fixture = await createSystemFixture();
  t.after(fixture.cleanup);

  const result = await validateTypographyFoundation({
    repoRoot: fixture.root,
    dataPath: "data/foundations/typography.yaml",
    schemaPath: "schemas/typography.schema.json",
  });

  assert.equal(result.typography, null);
  assert.equal(result.errors.length, 1);
  assert.equal(result.errors[0].code, "typography-read");
  assert.equal(result.errors[0].path, "/data/foundations/typography.yaml");
});