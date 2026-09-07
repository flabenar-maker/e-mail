import { SystemValidationError } from "../../scripts/lib/diagnostics.mjs";

const SOURCE_VERSION = "1.0.0";
const TARGET_VERSION = "2.0.0";
const MIGRATION_ID = "components-1-to-2";

function migrationError(code, path, message) {
  return new SystemValidationError(code, path, message);
}

function mappingIndex(mappingDocument) {
  if (
    mappingDocument?.schema_version !== SOURCE_VERSION ||
    mappingDocument?.migration !== MIGRATION_ID ||
    !Array.isArray(mappingDocument?.components)
  ) {
    throw migrationError(
      "COMPONENT_MIGRATION_MAPPING_INVALID",
      "/",
      "Reviewed component documentation mapping is invalid.",
    );
  }

  const byId = new Map();
  mappingDocument.components.forEach((entry, index) => {
    if (byId.has(entry?.id)) {
      throw migrationError(
        "COMPONENT_MIGRATION_MAPPING_DUPLICATE",
        `/components/${index}/id`,
        `Duplicate reviewed mapping entry: ${String(entry?.id)}.`,
      );
    }
    byId.set(entry?.id, entry);
  });
  return byId;
}

function documentationFrom(entry) {
  return {
    purpose: entry.purpose,
    critical_constraint_ids: structuredClone(
      entry.critical_constraint_ids ?? [],
    ),
  };
}

export function migrateComponentDocument(document, mappingDocument) {
  if (document?.schema_version !== SOURCE_VERSION) {
    throw migrationError(
      "COMPONENT_MIGRATION_VERSION_UNSUPPORTED",
      "/schema_version",
      `Component migration requires schema ${SOURCE_VERSION}.`,
    );
  }
  if (!Array.isArray(document?.components)) {
    throw migrationError(
      "COMPONENT_MIGRATION_SOURCE_INVALID",
      "/components",
      "Component migration requires a components array.",
    );
  }

  const byId = mappingIndex(mappingDocument);
  const sourceIds = new Set(document.components.map((record) => record?.id));

  document.components.forEach((record, index) => {
    if (!byId.has(record?.id)) {
      throw migrationError(
        "COMPONENT_MIGRATION_MAPPING_MISSING",
        `/components/${index}/id`,
        `Missing reviewed mapping entry for ${String(record?.id)}.`,
      );
    }
  });

  for (const id of byId.keys()) {
    if (!sourceIds.has(id)) {
      throw migrationError(
        "COMPONENT_MIGRATION_MAPPING_EXTRA",
        "/components",
        `Reviewed mapping contains an unknown component: ${String(id)}.`,
      );
    }
  }

  const migrated = structuredClone(document);
  migrated.schema_version = TARGET_VERSION;
  migrated.components = migrated.components.map((record) => {
    const entry = byId.get(record.id);
    const next = structuredClone(record);
    delete next.description;
    next.documentation = documentationFrom(entry);
    next.constraints = structuredClone(entry.constraints ?? []);
    return next;
  });
  return migrated;
}
