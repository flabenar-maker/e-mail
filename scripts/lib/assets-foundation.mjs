import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { SystemValidationError } from "./diagnostics.mjs";
import { validateDocumentShape } from "./schema-validation.mjs";
import { readStrictYaml } from "./strict-yaml.mjs";

const SUPPORTED_ASSETS_VERSION = "1.0.0";
const DEFINITION_GROUPS = [
  "source_modes",
  "display_modes",
  "export_profiles",
  "alpha_modes",
  "clipping_policies",
  "compatibility",
  "global_invariants",
];
const FORBIDDEN_BUILD_CHOICE_KEYS = new Set([
  "owner",
  "export_boundary",
  "display_width",
  "display_height",
  "component_id",
]);

function diagnostic(code, path, message) {
  return new SystemValidationError(code, path, message);
}

function sortDiagnostics(errors) {
  return errors.sort(
    (left, right) =>
      left.path.localeCompare(right.path) ||
      left.code.localeCompare(right.code) ||
      left.message.localeCompare(right.message),
  );
}

function definitionMaps(assets) {
  return {
    source_modes: new Map(
      (assets?.source_modes ?? []).map((item) => [item.id, item]),
    ),
    display_modes: new Map(
      (assets?.display_modes ?? []).map((item) => [item.id, item]),
    ),
    export_profiles: new Map(
      (assets?.export_profiles ?? []).map((item) => [item.id, item]),
    ),
    alpha_modes: new Map(
      (assets?.alpha_modes ?? []).map((item) => [item.id, item]),
    ),
    clipping_policies: new Map(
      (assets?.clipping_policies ?? []).map((item) => [item.id, item]),
    ),
  };
}

function duplicateIds(items) {
  const seen = new Set();
  const duplicates = new Set();
  for (const item of items ?? []) {
    if (seen.has(item?.id)) {
      duplicates.add(item?.id);
    }
    seen.add(item?.id);
  }
  return [...duplicates]
    .filter((value) => value !== undefined)
    .sort();
}

function findBuildChoiceFields(value, path = "") {
  const errors = [];
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      errors.push(...findBuildChoiceFields(item, `${path}/${index}`));
    });
    return errors;
  }
  if (!value || typeof value !== "object") {
    return errors;
  }

  for (const [key, child] of Object.entries(value)) {
    const childPath = `${path}/${key}`;
    if (FORBIDDEN_BUILD_CHOICE_KEYS.has(key)) {
      errors.push(
        diagnostic(
          "ASSETS_BUILD_CHOICE_FORBIDDEN",
          childPath || "/",
          `Component build choice field is forbidden in the Assets foundation: ${key}.`,
        ),
      );
    }
    errors.push(...findBuildChoiceFields(child, childPath));
  }
  return errors;
}

function pushUnknownReference(errors, maps, group, id, path) {
  if (!maps[group].has(id)) {
    errors.push(
      diagnostic(
        "ASSETS_UNKNOWN_REFERENCE",
        path,
        `Unknown ${group} reference: ${String(id)}.`,
      ),
    );
  }
}

export function validateAssetsShape(assets, schema) {
  return validateDocumentShape({
    document: assets,
    schema,
    supportedVersion: SUPPORTED_ASSETS_VERSION,
    versionCode: "assets-version-unsupported",
    schemaCode: "assets-schema",
  });
}

export async function loadAssetsFoundation({
  repoRoot,
  dataPath = "data/foundations/assets.yaml",
  schemaPath = "schemas/assets.schema.json",
}) {
  const [assets, schemaText] = await Promise.all([
    readStrictYaml(join(repoRoot, dataPath)),
    readFile(join(repoRoot, schemaPath), "utf8"),
  ]);
  const schema = JSON.parse(schemaText);
  const errors = validateAssetsShape(assets, schema);
  if (errors.length > 0) {
    throw new AggregateError(
      errors,
      "Assets foundation validation failed.",
    );
  }
  return assets;
}

export function validateAssetsSemantics(assets) {
  const errors = [];
  const maps = definitionMaps(assets);

  for (const group of DEFINITION_GROUPS) {
    for (const id of duplicateIds(assets?.[group])) {
      errors.push(
        diagnostic(
          "ASSETS_DUPLICATE_ID",
          `/${group}`,
          `Duplicate ${group} id: ${id}.`,
        ),
      );
    }
  }

  (assets?.compatibility ?? []).forEach((rule, ruleIndex) => {
    const root = `/compatibility/${ruleIndex}`;
    pushUnknownReference(
      errors,
      maps,
      "export_profiles",
      rule.export_profile_id,
      `${root}/export_profile_id`,
    );
    for (const [field, group] of [
      ["source_mode_ids", "source_modes"],
      ["display_mode_ids", "display_modes"],
      ["alpha_mode_ids", "alpha_modes"],
      ["clipping_policy_ids", "clipping_policies"],
    ]) {
      (rule?.[field] ?? []).forEach((id, index) => {
        pushUnknownReference(
          errors,
          maps,
          group,
          id,
          `${root}/${field}/${index}`,
        );
      });
    }

    if (
      rule.export_profile_id === "jpeg-2x" &&
      (rule.alpha_mode_ids?.length !== 1 ||
        rule.alpha_mode_ids[0] !== "none")
    ) {
      errors.push(
        diagnostic(
          "ASSETS_INCOMPATIBLE_ALPHA",
          `${root}/alpha_mode_ids`,
          "JPEG @2x compatibility must allow only the none alpha mode.",
        ),
      );
    }
  });

  for (const profile of assets?.export_profiles ?? []) {
    if (
      !(assets?.compatibility ?? []).some(
        (rule) => rule.export_profile_id === profile.id,
      )
    ) {
      errors.push(
        diagnostic(
          "ASSETS_PROFILE_COMPATIBILITY_MISSING",
          `/export_profiles/${profile.id}`,
          `Export profile has no compatibility rule: ${profile.id}.`,
        ),
      );
    }

    const scale = profile?.contract?.scale;
    const expectedSuffix = `@${String(scale)}x`;
    if (profile?.contract?.suffix !== expectedSuffix) {
      errors.push(
        diagnostic(
          "ASSETS_SCALE_SUFFIX_MISMATCH",
          `/export_profiles/${profile.id}/contract/suffix`,
          `Scale ${String(scale)} requires suffix ${expectedSuffix}.`,
        ),
      );
    }
  }

  const jpeg = maps.export_profiles.get("jpeg-2x");
  const quality = jpeg?.contract?.quality;
  if (
    jpeg &&
    (quality?.base_percent !== 82 ||
      quality?.escalation_percent !== 90 ||
      quality?.escalation_condition !== "visible-artifacts-only")
  ) {
    errors.push(
      diagnostic(
        "ASSETS_INVALID_JPEG_QUALITY",
        "/export_profiles/jpeg-2x/contract/quality",
        "JPEG @2x quality must start at 82 and escalate to 90 only for visible artifacts.",
      ),
    );
  }

  (assets?.clipping_policies ?? []).forEach((policy, index) => {
    if (
      policy.id === "neutralize-presentation-only" &&
      policy.contract?.allowed_source_mode_ids?.includes("image-fill")
    ) {
      errors.push(
        diagnostic(
          "ASSETS_INCOMPATIBLE_CLIPPING",
          `/clipping_policies/${index}/contract/allowed_source_mode_ids`,
          "Presentation-only clipping neutralization cannot be used with IMAGE FILL.",
        ),
      );
    }

    (policy.contract?.allowed_source_mode_ids ?? []).forEach(
      (id, sourceIndex) => {
        pushUnknownReference(
          errors,
          maps,
          "source_modes",
          id,
          `/clipping_policies/${index}/contract/allowed_source_mode_ids/${sourceIndex}`,
        );
      },
    );
  });

  errors.push(...findBuildChoiceFields(assets));
  return sortDiagnostics(errors);
}

export function resolveAssetContract(assets, selection = {}) {
  const foundationErrors = validateAssetsSemantics(assets);
  if (foundationErrors.length > 0) {
    throw new AggregateError(
      foundationErrors,
      "Assets foundation semantic validation failed.",
    );
  }

  const maps = definitionMaps(assets);
  const requested = {
    sourceModeId: ["source_modes", selection.sourceModeId],
    displayModeId: ["display_modes", selection.displayModeId],
    exportProfileId: ["export_profiles", selection.exportProfileId],
    expectedAlphaId: ["alpha_modes", selection.expectedAlphaId],
    clippingPolicyId: [
      "clipping_policies",
      selection.clippingPolicyId,
    ],
  };

  for (const [field, [group, id]] of Object.entries(requested)) {
    if (typeof id !== "string" || !maps[group].has(id)) {
      throw diagnostic(
        "ASSETS_UNKNOWN_CONTRACT_VALUE",
        `/selection/${field}`,
        `Unknown or missing asset contract value: ${String(id)}.`,
      );
    }
  }

  const compatibility = (assets.compatibility ?? []).find(
    (rule) => rule.export_profile_id === selection.exportProfileId,
  );
  if (!compatibility) {
    throw diagnostic(
      "ASSETS_UNKNOWN_CONTRACT_VALUE",
      "/selection/exportProfileId",
      `No compatibility rule for ${selection.exportProfileId}.`,
    );
  }

  if (
    !compatibility.alpha_mode_ids.includes(selection.expectedAlphaId)
  ) {
    throw diagnostic(
      "ASSETS_INCOMPATIBLE_ALPHA",
      "/selection/expectedAlphaId",
      `${selection.expectedAlphaId} is incompatible with ${selection.exportProfileId}.`,
    );
  }

  const clippingPolicy = maps.clipping_policies.get(
    selection.clippingPolicyId,
  );
  if (
    !compatibility.clipping_policy_ids.includes(
      selection.clippingPolicyId,
    ) ||
    !clippingPolicy.contract.allowed_source_mode_ids.includes(
      selection.sourceModeId,
    )
  ) {
    throw diagnostic(
      "ASSETS_INCOMPATIBLE_CLIPPING",
      "/selection/clippingPolicyId",
      `${selection.clippingPolicyId} is incompatible with ${selection.sourceModeId}.`,
    );
  }

  for (const [field, values] of [
    ["sourceModeId", compatibility.source_mode_ids],
    ["displayModeId", compatibility.display_mode_ids],
  ]) {
    if (!values.includes(selection[field])) {
      throw diagnostic(
        "ASSETS_UNKNOWN_CONTRACT_VALUE",
        `/selection/${field}`,
        `${selection[field]} is not allowed by ${selection.exportProfileId}.`,
      );
    }
  }

  return structuredClone({
    source_mode: maps.source_modes.get(selection.sourceModeId),
    display_mode: maps.display_modes.get(selection.displayModeId),
    export_profile: maps.export_profiles.get(selection.exportProfileId),
    expected_alpha: maps.alpha_modes.get(selection.expectedAlphaId),
    clipping_policy: clippingPolicy,
    compatibility,
  });
}

export async function validateAssetsFoundation({
  repoRoot,
  dataPath = "data/foundations/assets.yaml",
  schemaPath = "schemas/assets.schema.json",
}) {
  try {
    const assets = await loadAssetsFoundation({
      repoRoot,
      dataPath,
      schemaPath,
    });
    return {
      assets,
      errors: validateAssetsSemantics(assets),
    };
  } catch (error) {
    if (error instanceof AggregateError) {
      return { assets: null, errors: sortDiagnostics(error.errors) };
    }
    if (error instanceof SystemValidationError) {
      return { assets: null, errors: [error] };
    }
    return {
      assets: null,
      errors: [
        diagnostic(
          "assets-read",
          `/${dataPath.replaceAll("\\", "/")}`,
          "Assets foundation could not be read.",
        ),
      ],
    };
  }
}
