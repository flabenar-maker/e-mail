import test from "node:test";
import assert from "node:assert/strict";

import { formatRendererDiagnostics } from "../../scripts/lib/diagnostics.mjs";
import { renderEmailDocument } from "../../scripts/lib/email-renderer.mjs";
import {
  buildRenderImpactProjection,
  digestRenderImpact,
} from "../../scripts/lib/render-impact.mjs";

function component() {
  const root = {
    id: "root",
    semantic_role: "card",
    render_mode: "presentation-table",
    visibility: { mode: "always" },
    facts: [
      {
        id: "root-padding",
        value: {
          type: "foundation-reference",
          foundation_id: "spacing",
          definition_group: "roles",
          definition_id: "content-gap",
        },
        provenance: {
          kind: "registry-literal",
          source_path: "registry/source.md",
        },
      },
    ],
    children: [
      {
        id: "heading",
        semantic_role: "heading",
        render_mode: "html-text",
        visibility: { mode: "always" },
        facts: [
          {
            id: "heading-font-size",
            value: { type: "measure", value: 16, unit: "px" },
          },
        ],
        content_slots: [
          { id: "text", type: "rich-text", required: true },
        ],
        children: [],
      },
    ],
  };
  return {
    id: "test-card",
    status: "active",
    identity: { figma_name: "Card/Test", library: "marketing" },
    figma: {
      file_key: "file",
      node_id: "1:2",
      verified_at: "2026-09-11",
    },
    variants: [
      {
        id: "mobile",
        node_id: "1:3",
        axes: [{ name: "Viewport", value: "Mobile" }],
      },
      {
        id: "desktop",
        node_id: "1:4",
        axes: [{ name: "Viewport", value: "Desktop" }],
      },
    ],
    properties: [
      {
        id: "show-copy",
        figma_name: "Show Copy",
        type: "boolean",
        default: true,
      },
    ],
    asset_contracts: [
      {
        id: "card-image",
        owner_layer_name: "Card Image @2x",
        source_viewport: "desktop",
        source_mode_id: "composite-node",
        display_mode_id: "fluid-proportional",
        export_profile_id: "jpeg-2x",
        alpha_mode_id: "opaque",
        clipping_policy_id: "presentation-only",
        export_boundary: { kind: "node", semantic_node_name: "Card Image @2x" },
        pixel_dimensions: { width: 464, height: 296, unit: "px" },
        aspect_ratio: { width: 58, height: 37 },
        crop: "cover",
        background: "included",
      },
    ],
    contracts: {
      mobile: { root: structuredClone(root) },
      desktop: { root: structuredClone(root) },
    },
    documentation: {
      purpose: "Human documentation only.",
      critical_constraint_ids: [],
    },
    constraints: [],
    provenance: { baseline_path: "registry/source.md" },
  };
}

function foundations() {
  return {
    spacing: {
      roles: [
        {
          id: "content-gap",
          values: { mobile: 16, desktop: 24 },
        },
        {
          id: "unrelated-gap",
          values: { mobile: 8, desktop: 12 },
        },
      ],
    },
    rendering: {
      breakpoints: [
        { id: "cupis-mobile", query: "max-width", value: 660, unit: "px" },
      ],
      postprocessing: {
        allowed: [
          "normalize-attributes",
          "strip-technical-markers",
          "validate-local-src",
        ],
        forbidden: ["change-layout"],
      },
    },
  };
}

function coverage() {
  return {
    component_id: "test-card",
    mode: "recipe",
    recipe_id: "card-stack",
  };
}

function digestOf(record = component(), rendererCoverage = coverage(), values = foundations()) {
  return digestRenderImpact(
    buildRenderImpactProjection({
      component: record,
      coverage: rendererCoverage,
      foundations: values,
    }),
  );
}

test("render-impact digest changes for every declared rendering input", () => {
  const baseline = digestOf();
  const changes = [
    (record) => {
      record.contracts.mobile.root.children[0].facts[0].value.value = 18;
    },
    (record) => {
      record.contracts.mobile.root.children[0].render_mode = "html-link";
    },
    (record) => {
      record.contracts.mobile.root.children[0].visibility = {
        mode: "property",
        property_id: "show-copy",
      };
    },
    (record) => {
      record.properties[0].default = false;
    },
    (record) => {
      record.variants[0].axes[0].value = "Compact";
    },
    (record) => {
      record.asset_contracts[0].pixel_dimensions.width = 466;
    },
  ];

  for (const change of changes) {
    const record = component();
    change(record);
    assert.notEqual(digestOf(record), baseline);
  }

  const changedFoundation = foundations();
  changedFoundation.spacing.roles[0].values.mobile = 20;
  assert.notEqual(digestOf(component(), coverage(), changedFoundation), baseline);

  const changedRecipe = coverage();
  changedRecipe.recipe_id = "card-grid";
  assert.notEqual(digestOf(component(), changedRecipe), baseline);
});

test("documentation and unrelated source metadata do not change render impact", () => {
  const baseline = digestOf();
  const changes = [
    (record) => {
      record.documentation.purpose = "Rewritten documentation.";
    },
    (record) => {
      record.description = "Legacy Figma Description.";
    },
    (record) => {
      record.figma.verified_at = "2030-01-01";
    },
    (record) => {
      record.provenance.baseline_path = "registry/other.md";
    },
    (record) => {
      record.constraints.push({
        id: "human-note",
        scope: "all",
        kind: "content",
        severity: "advisory",
        text: "Documentation only.",
      });
    },
  ];

  for (const change of changes) {
    const record = component();
    change(record);
    assert.equal(digestOf(record), baseline);
  }

  const unrelatedFoundation = foundations();
  unrelatedFoundation.spacing.roles[1].values.mobile = 10;
  assert.equal(
    digestOf(component(), coverage(), unrelatedFoundation),
    baseline,
  );
});

test("viewport-only provenance drift does not activate responsive impact", () => {
  const record = component();
  record.contracts.desktop.root.facts[0].provenance.source_path =
    "registry/other-source.md";

  assert.equal(digestOf(record), digestOf());
});

test("projection is detached and digest uses the shared sha256 contract", () => {
  const record = component();
  const projection = buildRenderImpactProjection({
    component: record,
    coverage: coverage(),
    foundations: foundations(),
  });
  projection.contracts.mobile.root.id = "changed";

  assert.equal(record.contracts.mobile.root.id, "root");
  assert.match(digestRenderImpact(projection), /^sha256:[0-9a-f]{64}$/u);
});

test("renderer diagnostics are stable, component-aware and never print stacks", () => {
  const errors = [
    {
      code: "Z_ERROR",
      path: "/z",
      message: "Last",
      component_id: "email-template",
      stack: "C:\\secret\\stack",
    },
    {
      code: "A_ERROR",
      path: "/a",
      message: "First",
      component_id: "card-image",
      stack: "/home/secret/stack",
    },
  ];

  const output = formatRendererDiagnostics(errors);

  assert.equal(
    output,
    "component=card-image path=/a [A_ERROR] First\n" +
      "component=email-template path=/z [Z_ERROR] Last",
  );
  assert.doesNotMatch(output, /secret|stack|at /u);
});

test("email document contains safe renderer version, commit and impact metadata", () => {
  const root = {
    id: "root",
    semantic_role: "email",
    render_mode: "presentation-table",
    visibility: { mode: "always" },
    facts: [],
    children: [],
  };
  const record = {
    id: "email-template",
    variants: [
      { id: "mobile", axes: [{ name: "Viewport", value: "Mobile" }] },
      { id: "desktop", axes: [{ name: "Viewport", value: "Desktop" }] },
    ],
    properties: [],
    asset_contracts: [],
    contracts: {
      mobile: { root: structuredClone(root) },
      desktop: { root: structuredClone(root) },
    },
  };
  const model = {
    metadata: { language: "ru", direction: "ltr" },
    root: {
      instance_id: "email",
      component_id: "email-template",
      variants: { mobile: "mobile", desktop: "desktop" },
      property_values: [],
      content_values: [],
      asset_files: [],
      slots: [],
    },
  };
  const result = renderEmailDocument(model, {
    rendererRegistry: {
      coverage: [{ component_id: "email-template", mode: "interpreter" }],
    },
    componentIndex: {
      bySystemId: new Map([["email-template", record]]),
    },
    foundations: {
      rendering: {
        breakpoints: [
          { id: "cupis-mobile", query: "max-width", value: 659, unit: "px" },
        ],
        shell: {
          background_color: "#F3F3F5",
          horizontal_inset_px: 15,
          max_width_px: 600,
          min_supported_viewport_px: 300,
        },
        embedded_css: {
          max_bytes_exclusive: 16384,
        },
        postprocessing: {
          allowed: ["normalize-attributes"],
          forbidden: [],
        },
      },
    },
    systemCommit: "0123456789abcdef0123456789abcdef01234567",
  });

  assert.deepEqual(result.diagnostics, []);
  assert.match(
    result.html,
    /<!-- cupis:build renderer=1\.0\.0 system-commit=0123456789abcdef0123456789abcdef01234567 render-impact=sha256:[0-9a-f]{64} -->/u,
  );
  assert.doesNotMatch(result.html, /[A-Z]:\\|\/home\/|secret/iu);
});
