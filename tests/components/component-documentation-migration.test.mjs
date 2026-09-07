import test from "node:test";
import assert from "node:assert/strict";

import { migrateComponentDocument } from "../../system/migrations/components-1-to-2.mjs";

function legacyRecord(id) {
  return {
    id,
    status: "active",
    identity: {
      figma_name: `Block/${id}`,
      node_kind: "component",
      library: "marketing",
      semantic_role: "block",
      category: "test",
    },
    figma: {
      file_key: "file-key",
      node_id: "1:2",
      source_root_node_id: "1:1",
      verified_at: "2026-09-07",
      structure_fingerprint:
        "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    },
    variants: [],
    properties: [],
    asset_contracts: [],
    contracts: {
      mobile: {
        root: {
          id: "root",
          semantic_role: "block",
          render_mode: "html-text",
          visibility: { mode: "always" },
          facts: [],
          children: [],
        },
      },
      desktop: {
        root: {
          id: "root",
          semantic_role: "block",
          render_mode: "html-text",
          visibility: { mode: "always" },
          facts: [],
          children: [],
        },
      },
    },
    description: {
      mode: "rendered",
      blocks: [{ type: "heading", value: "SCOPE" }],
    },
    provenance: {
      baseline_path: "registry/legacy.md",
      baseline_heading: id,
      baseline_blob_sha: "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    },
  };
}

function legacyDocument() {
  return {
    schema_version: "1.0.0",
    registry: {
      id: "components-marketing",
      library: "marketing",
      status: "shadow",
      source: {
        figma_file_key: "file-key",
        roots: [{ role: "library", node_id: "1:1" }],
        baseline_path: "registry/legacy.md",
        baseline_commit: "cccccccccccccccccccccccccccccccccccccccc",
        verified_at: "2026-09-07",
      },
    },
    components: [legacyRecord("first"), legacyRecord("second")],
  };
}

function mapping(entries = [
  {
    id: "second",
    purpose: "Второй тестовый блок.",
    critical_constraint_ids: [],
    constraints: [],
  },
  {
    id: "first",
    purpose: "Первый тестовый блок.",
    critical_constraint_ids: ["keep-order"],
    constraints: [
      {
        id: "keep-order",
        scope: "all",
        kind: "content",
        severity: "critical",
        statement: "Сохранять смысловой порядок содержимого.",
      },
    ],
  },
]) {
  return {
    schema_version: "1.0.0",
    migration: "components-1-to-2",
    components: entries,
  };
}

function withoutMigratedDocumentation(record) {
  const clone = structuredClone(record);
  delete clone.description;
  delete clone.documentation;
  delete clone.constraints;
  return clone;
}

test("migration is deterministic and preserves every non-documentation field", () => {
  const source = legacyDocument();
  const migrated = migrateComponentDocument(source, mapping());

  assert.equal(migrated.schema_version, "2.0.0");
  assert.deepEqual(
    migrated.components.map((record) => record.id),
    source.components.map((record) => record.id),
  );
  assert.deepEqual(
    migrated.components.map(withoutMigratedDocumentation),
    source.components.map(withoutMigratedDocumentation),
  );
  assert.deepEqual(migrated.components[0].documentation, {
    purpose: "Первый тестовый блок.",
    critical_constraint_ids: ["keep-order"],
  });
  assert.deepEqual(migrated.components[0].constraints, [
    {
      id: "keep-order",
      scope: "all",
      kind: "content",
      severity: "critical",
      statement: "Сохранять смысловой порядок содержимого.",
    },
  ]);
  assert.equal(Object.hasOwn(migrated.components[0], "description"), false);
  assert.deepEqual(
    migrateComponentDocument(source, mapping()),
    migrateComponentDocument(source, mapping()),
  );
  assert.deepEqual(source, legacyDocument(), "Migration must not mutate input.");
});

test("migration accepts only the 1.0.0 source schema", () => {
  const source = legacyDocument();
  source.schema_version = "2.0.0";
  assert.throws(
    () => migrateComponentDocument(source, mapping()),
    (error) => error.code === "COMPONENT_MIGRATION_VERSION_UNSUPPORTED",
  );
});

test("migration blocks a missing reviewed mapping entry", () => {
  const entries = mapping().components.filter((entry) => entry.id !== "second");
  assert.throws(
    () => migrateComponentDocument(legacyDocument(), mapping(entries)),
    (error) => error.code === "COMPONENT_MIGRATION_MAPPING_MISSING",
  );
});

test("migration blocks an extra reviewed mapping entry", () => {
  const entries = [
    ...mapping().components,
    {
      id: "extra",
      purpose: "Лишняя запись.",
      critical_constraint_ids: [],
      constraints: [],
    },
  ];
  assert.throws(
    () => migrateComponentDocument(legacyDocument(), mapping(entries)),
    (error) => error.code === "COMPONENT_MIGRATION_MAPPING_EXTRA",
  );
});

test("migration blocks duplicate reviewed mapping IDs", () => {
  const entries = [...mapping().components, structuredClone(mapping().components[0])];
  assert.throws(
    () => migrateComponentDocument(legacyDocument(), mapping(entries)),
    (error) => error.code === "COMPONENT_MIGRATION_MAPPING_DUPLICATE",
  );
});
