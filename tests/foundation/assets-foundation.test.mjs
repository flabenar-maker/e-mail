import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import * as assetsFoundation from "../../scripts/lib/assets-foundation.mjs";
import {
  loadAssetsFoundation,
  validateAssetsShape,
} from "../../scripts/lib/assets-foundation.mjs";
import {
  parseStrictYaml,
  readStrictYaml,
} from "../../scripts/lib/strict-yaml.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const schemaPath = join(repoRoot, "schemas/assets.schema.json");
const dataPath = join(repoRoot, "data/foundations/assets.yaml");

async function canonicalAssets() {
  return readStrictYaml(dataPath);
}

async function readSchema() {
  return JSON.parse(await readFile(schemaPath, "utf8"));
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}

function hasDiagnostic(errors, code, path) {
  return errors.some((error) => error.code === code && error.path === path);
}

test("loads the canonical assets foundation through its strict shape contract", async () => {
  const assets = await loadAssetsFoundation({ repoRoot });

  assert.equal(assets.foundation.id, "assets");
  assert.equal(assets.foundation.status, "shadow");
  assert.deepEqual(
    assets.source_modes.map((item) => item.id),
    ["image-fill", "rendered-node"],
  );
  assert.deepEqual(
    assets.display_modes.map((item) => item.id),
    ["direct-image", "fill-image"],
  );
  assert.deepEqual(
    assets.export_profiles.map((item) => item.id),
    ["jpeg-2x", "png-4x"],
  );
  assert.deepEqual(
    assets.alpha_modes.map((item) => item.id),
    ["none", "transparent", "opaque", "source"],
  );
  assert.deepEqual(
    assets.clipping_policies.map((item) => item.id),
    ["preserve-artwork", "neutralize-presentation-only"],
  );
});

test("schema rejects unknown root and nested fields", async () => {
  const [assets, schema] = await Promise.all([
    canonicalAssets(),
    readSchema(),
  ]);
  assets.unexpected = true;
  assets.source_modes[0].contract.unexpected = true;

  const errors = validateAssetsShape(assets, schema);

  assert.ok(hasDiagnostic(errors, "assets-schema", "/"));
  assert.ok(
    hasDiagnostic(
      errors,
      "assets-schema",
      "/source_modes/0/contract",
    ),
  );
});

test("shape validation rejects an unsupported assets version", async () => {
  const [assets, schema] = await Promise.all([
    canonicalAssets(),
    readSchema(),
  ]);
  assets.schema_version = "1.1.0";

  const errors = validateAssetsShape(assets, schema);

  assert.ok(
    hasDiagnostic(
      errors,
      "assets-version-unsupported",
      "/schema_version",
    ),
  );
});

for (const group of [
  "source_modes",
  "display_modes",
  "export_profiles",
  "alpha_modes",
  "clipping_policies",
  "compatibility",
  "global_invariants",
]) {
  test(`shape validation requires at least one ${group} item`, async () => {
    const [assets, schema] = await Promise.all([
      canonicalAssets(),
      readSchema(),
    ]);
    assets[group] = [];

    const errors = validateAssetsShape(assets, schema);

    assert.ok(hasDiagnostic(errors, "assets-schema", `/${group}`));
  });
}

test("shape validation rejects malformed definition ids", async () => {
  const [assets, schema] = await Promise.all([
    canonicalAssets(),
    readSchema(),
  ]);
  assets.source_modes[0].id = "IMAGE FILL";

  const errors = validateAssetsShape(assets, schema);

  assert.ok(
    hasDiagnostic(errors, "assets-schema", "/source_modes/0/id"),
  );
});

for (const [name, mutate, expectedPath] of [
  [
    "owner",
    (assets) => {
      assets.source_modes[0].contract.owner = "hero-image";
    },
    "/source_modes/0/contract",
  ],
  [
    "export_boundary",
    (assets) => {
      assets.display_modes[0].contract.export_boundary = "asset-node";
    },
    "/display_modes/0/contract",
  ],
  [
    "display_width",
    (assets) => {
      assets.export_profiles[0].contract.display_width = 232;
    },
    "/export_profiles/0/contract",
  ],
  [
    "display_height",
    (assets) => {
      assets.compatibility[0].display_height = 148;
    },
    "/compatibility/0",
  ],
  [
    "component_id",
    (assets) => {
      assets.global_invariants[0].component_id = "Banner/Hero";
    },
    "/global_invariants/0",
  ],
]) {
  test(`shape validation rejects component build field ${name}`, async () => {
    const [assets, schema] = await Promise.all([
      canonicalAssets(),
      readSchema(),
    ]);
    mutate(assets);

    const errors = validateAssetsShape(assets, schema);

    assert.ok(hasDiagnostic(errors, "assets-schema", expectedPath));
  });
}

test("strict YAML rejects duplicate assets keys", () => {
  assert.throws(
    () =>
      parseStrictYaml(
        "schema_version: 1.0.0\nschema_version: 1.0.0\n",
        "assets.yaml",
      ),
    (error) => error.code === "yaml-duplicate-key",
  );
});


function diagnosticCodes(errors) {
  return errors.map((error) => error.code);
}

for (const [name, mutate, expectedCodes] of [
  [
    "duplicate definition id",
    (assets) => {
      assets.source_modes.push(structuredClone(assets.source_modes[0]));
    },
    ["ASSETS_DUPLICATE_ID"],
  ],
  [
    "unknown compatibility reference",
    (assets) => {
      assets.compatibility[0].source_mode_ids[0] = "unknown-source";
    },
    ["ASSETS_UNKNOWN_REFERENCE"],
  ],
  [
    "missing export-profile compatibility",
    (assets) => {
      assets.compatibility = assets.compatibility.filter(
        (item) => item.export_profile_id !== "jpeg-2x",
      );
    },
    ["ASSETS_PROFILE_COMPATIBILITY_MISSING"],
  ],
  [
    "incompatible JPEG alpha",
    (assets) => {
      assets.compatibility[0].alpha_mode_ids.push("transparent");
    },
    ["ASSETS_INCOMPATIBLE_ALPHA"],
  ],
  [
    "presentation-only clipping allowed for IMAGE FILL",
    (assets) => {
      assets.clipping_policies[1].contract.allowed_source_mode_ids.push(
        "image-fill",
      );
    },
    ["ASSETS_INCOMPATIBLE_CLIPPING"],
  ],
  [
    "scale and suffix mismatch",
    (assets) => {
      assets.export_profiles[0].contract.suffix = "@4x";
    },
    ["ASSETS_SCALE_SUFFIX_MISMATCH"],
  ],
  [
    "invalid JPEG quality policy",
    (assets) => {
      assets.export_profiles[0].contract.quality.base_percent = 80;
    },
    ["ASSETS_INVALID_JPEG_QUALITY"],
  ],
  [
    "forbidden component build choice",
    (assets) => {
      assets.source_modes[0].contract.owner = "hero-image";
    },
    ["ASSETS_BUILD_CHOICE_FORBIDDEN"],
  ],
]) {
  test("semantic validation reports " + name + " deterministically", async () => {
    const assets = await canonicalAssets();
    mutate(assets);

    const errors = assetsFoundation.validateAssetsSemantics(assets);

    assert.deepEqual(diagnosticCodes(errors), expectedCodes);
    assert.deepEqual(
      errors,
      [...errors].sort(
        (left, right) =>
          left.path.localeCompare(right.path) ||
          left.code.localeCompare(right.code) ||
          left.message.localeCompare(right.message),
      ),
    );
  });
}

test("canonical assets foundation is semantically valid", async () => {
  const assets = await canonicalAssets();

  assert.deepEqual(assetsFoundation.validateAssetsSemantics(assets), []);
});


test("semantic validation rejects a weakened exact export-boundary policy", async () => {
  const assets = await canonicalAssets();
  assets.source_modes.find((item) => item.id === "rendered-node").contract.visible_nested_graphics_included = false;

  const errors = assetsFoundation.validateAssetsSemantics(assets);

  assert.deepEqual(diagnosticCodes(errors), ["ASSETS_RENDERED_NODE_BOUNDARY_INVALID"]);
});

test("semantic validation rejects a deformable mobile display policy", async () => {
  const assets = await canonicalAssets();
  assets.display_modes.find((item) => item.id === "direct-image").contract.mobile_height_behavior = "fixed";

  const errors = assetsFoundation.validateAssetsSemantics(assets);

  assert.deepEqual(diagnosticCodes(errors), ["ASSETS_DISPLAY_RATIO_GUARD_INVALID"]);
});
for (const selection of [
  {
    sourceModeId: "image-fill",
    displayModeId: "direct-image",
    exportProfileId: "jpeg-2x",
    expectedAlphaId: "none",
    clippingPolicyId: "preserve-artwork",
  },
  {
    sourceModeId: "rendered-node",
    displayModeId: "direct-image",
    exportProfileId: "jpeg-2x",
    expectedAlphaId: "none",
    clippingPolicyId: "neutralize-presentation-only",
  },
  {
    sourceModeId: "rendered-node",
    displayModeId: "direct-image",
    exportProfileId: "png-4x",
    expectedAlphaId: "transparent",
    clippingPolicyId: "preserve-artwork",
  },
  {
    sourceModeId: "rendered-node",
    displayModeId: "direct-image",
    exportProfileId: "png-4x",
    expectedAlphaId: "opaque",
    clippingPolicyId: "preserve-artwork",
  },
  {
    sourceModeId: "image-fill",
    displayModeId: "fill-image",
    exportProfileId: "jpeg-2x",
    expectedAlphaId: "none",
    clippingPolicyId: "preserve-artwork",
  },
]) {
  test("resolver returns exact " + selection.exportProfileId + " contract without defaults", async () => {
    const assets = await canonicalAssets();
    const resolved = assetsFoundation.resolveAssetContract(
      assets,
      selection,
    );

    assert.equal(resolved.source_mode.id, selection.sourceModeId);
    assert.equal(resolved.display_mode.id, selection.displayModeId);
    assert.equal(resolved.export_profile.id, selection.exportProfileId);
    assert.equal(resolved.expected_alpha.id, selection.expectedAlphaId);
    assert.equal(resolved.clipping_policy.id, selection.clippingPolicyId);
    assert.equal(
      resolved.compatibility.export_profile_id,
      selection.exportProfileId,
    );

    resolved.source_mode.id = "mutated";
    assert.notEqual(assets.source_modes[0].id, "mutated");
  });
}

for (const [name, selection, expectedCode] of [
  [
    "missing selection field",
    {
      sourceModeId: "image-fill",
      displayModeId: "direct-image",
      exportProfileId: "jpeg-2x",
      expectedAlphaId: "none",
    },
    "ASSETS_UNKNOWN_CONTRACT_VALUE",
  ],
  [
    "unknown selection id",
    {
      sourceModeId: "unknown-source",
      displayModeId: "direct-image",
      exportProfileId: "jpeg-2x",
      expectedAlphaId: "none",
      clippingPolicyId: "preserve-artwork",
    },
    "ASSETS_UNKNOWN_CONTRACT_VALUE",
  ],
  [
    "alpha outside profile compatibility",
    {
      sourceModeId: "rendered-node",
      displayModeId: "direct-image",
      exportProfileId: "jpeg-2x",
      expectedAlphaId: "transparent",
      clippingPolicyId: "preserve-artwork",
    },
    "ASSETS_INCOMPATIBLE_ALPHA",
  ],
  [
    "presentation-only clipping with IMAGE FILL",
    {
      sourceModeId: "image-fill",
      displayModeId: "direct-image",
      exportProfileId: "jpeg-2x",
      expectedAlphaId: "none",
      clippingPolicyId: "neutralize-presentation-only",
    },
    "ASSETS_INCOMPATIBLE_CLIPPING",
  ],
]) {
  test("resolver rejects " + name, async () => {
    const assets = await canonicalAssets();

    assert.throws(
      () => assetsFoundation.resolveAssetContract(assets, selection),
      (error) => error.code === expectedCode,
    );
  });
}

test("foundation validator combines strict loading with semantic checks", async () => {
  const result = await assetsFoundation.validateAssetsFoundation({
    repoRoot,
  });

  assert.equal(result.assets.foundation.id, "assets");
  assert.deepEqual(result.errors, []);
});


function collectFoundationFacts(value, facts = { keys: [], scalars: [] }) {
  if (Array.isArray(value)) {
    for (const item of value) {
      collectFoundationFacts(item, facts);
    }
    return facts;
  }
  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      facts.keys.push(key);
      collectFoundationFacts(child, facts);
    }
    return facts;
  }
  facts.scalars.push(value);
  return facts;
}

test("assets foundation contains definitions but no component build contracts", async () => {
  const assets = await canonicalAssets();
  const facts = collectFoundationFacts(assets);
  const scalarText = facts.scalars.map(String).join("\n");

  for (const forbidden of [
    "Banner/Hero",
    "Banner/Secondary",
    "Asset/Card-Image",
    "Asset/Feature-Icon",
    "Email/Header",
    "Banner/App-Download",
    "header-logo @4x",
    "qr-code @4x",
  ]) {
    assert.doesNotMatch(
      scalarText,
      new RegExp(escapeRegExp(forbidden), "u"),
    );
  }
  for (const forbiddenNumber of [232, 148, 464, 296]) {
    assert.equal(facts.scalars.includes(forbiddenNumber), false);
  }
  assert.equal(
    facts.scalars.some(
      (value) =>
        typeof value === "string" && /^[0-9]+:[0-9]+$/u.test(value),
    ),
    false,
  );

  for (const forbiddenKey of [
    "owner",
    "export_boundary",
    "display_width",
    "display_height",
    "component_id",
  ]) {
    assert.equal(facts.keys.includes(forbiddenKey), false);
  }

  assert.deepEqual(
    assets.source_modes.map((item) => item.id),
    ["image-fill", "rendered-node"],
  );
  assert.deepEqual(
    assets.display_modes.map((item) => item.id),
    ["direct-image", "fill-image"],
  );
  assert.deepEqual(
    assets.export_profiles.map((item) => item.id),
    ["jpeg-2x", "png-4x"],
  );
  assert.deepEqual(
    assets.alpha_modes.map((item) => item.id),
    ["none", "transparent", "opaque", "source"],
  );
  assert.deepEqual(
    assets.clipping_policies.map((item) => item.id),
    ["preserve-artwork", "neutralize-presentation-only"],
  );
});
