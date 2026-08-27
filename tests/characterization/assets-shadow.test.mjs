import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { readStrictYaml } from "../../scripts/lib/strict-yaml.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}

test("assets shadow source preserves the approved global contracts", async () => {
  const [prompt, registry, spec] = await Promise.all([
    readFile(join(repoRoot, "core/email-figma-prompt.md"), "utf8"),
    readFile(
      join(repoRoot, "registry/email-component-descriptions-registry.md"),
      "utf8",
    ),
    readFile(
      join(
        repoRoot,
        "docs/superpowers/specs/2026-08-24-cupis-structured-email-system-design.md",
      ),
      "utf8",
    ),
  ]);

  for (const anchor of [
    "IMAGE FILL",
    "RENDERED NODE",
    "DIRECT IMAGE",
    "FILL IMAGE",
    "@2x",
    "@4x",
    "sRGB",
    "начальное качество: 82%",
    "height:auto",
  ]) {
    assert.match(prompt, new RegExp(escapeRegExp(anchor), "u"));
  }

  for (const anchor of [
    "Banner/Hero",
    "Banner/Secondary",
    "Asset/Card-Image",
    "Asset/Feature-Icon",
  ]) {
    assert.match(registry, new RegExp(escapeRegExp(anchor), "u"));
  }

  for (const anchor of [
    "Image contract",
    "@2x",
    "@4x",
    "transparency",
    "structured data",
  ]) {
    assert.match(spec, new RegExp(escapeRegExp(anchor), "u"));
  }

  const assets = await readStrictYaml(
    join(repoRoot, "data/foundations/assets.yaml"),
  );

  assert.equal(assets.schema_version, "1.0.0");
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

  const profiles = new Map(
    assets.export_profiles.map((profile) => [profile.id, profile]),
  );
  assert.deepEqual(profiles.get("jpeg-2x").contract, {
    format: "JPEG",
    extension: ".jpg",
    scale: 2,
    suffix: "@2x",
    color_space: "sRGB",
    alpha_mode: "none",
    quality: {
      base_percent: 82,
      escalation_percent: 90,
      escalation_condition: "visible-artifacts-only",
    },
    rendered_node_intermediate: "lossless-png",
  });
  assert.deepEqual(profiles.get("png-4x").contract, {
    format: "PNG",
    extension: ".png",
    scale: 4,
    suffix: "@4x",
    color_space: "sRGB",
    allowed_alpha_modes: ["transparent", "opaque", "source"],
    node_export_contents_only: true,
  });
  assert.equal(assets.identity_policy.shared_mobile_desktop_file, true);
  assert.equal(assets.identity_policy.shared_mobile_desktop_src, true);
  assert.equal(assets.background_policy.artificial_matte, "forbid");
  assert.deepEqual(assets.provenance.comparison_sources, [
    "core/email-figma-prompt.md",
    "registry/email-component-descriptions-registry.md",
    "docs/superpowers/specs/2026-08-24-cupis-structured-email-system-design.md",
  ]);
});


function registrySection(registry, componentName) {
  const marker = "### \`" + componentName;
  const start = registry.indexOf(marker);
  assert.notEqual(start, -1, "Missing registry section: " + componentName);
  const next = registry.indexOf("\n### \`", start + marker.length);
  return registry.slice(start, next === -1 ? registry.length : next);
}

test("representative export boundaries remain component-owned in the registry", async () => {
  const registry = await readFile(
    join(repoRoot, "registry/email-component-descriptions-registry.md"),
    "utf8",
  );
  const expectations = new Map([
    [
      "Banner/Hero",
      ["hero-image @2x", "width:100%; height:auto", "552×353px"],
    ],
    [
      "Banner/Secondary",
      ["296:188", "background ячейки", "background-size:cover"],
    ],
    [
      "Asset/Card-Image @2x",
      ["Number является частью итогового JPEG", "232×148px", "464×296px"],
    ],
    [
      "Asset/Feature-Icon @4x",
      ["круглый фон и glyph", "прозрачностью за пределами"],
    ],
    [
      "Email/Header",
      ["header-logo @4x", "защитную подложку #F3F3F5"],
    ],
    [
      "Banner/App-Download",
      ["app-logo @4x", "rustore-icon @4x", "qr-code @4x"],
    ],
  ]);

  for (const [componentName, anchors] of expectations) {
    const section = registrySection(registry, componentName);
    for (const anchor of anchors) {
      assert.match(section, new RegExp(escapeRegExp(anchor), "u"));
    }
  }
});
