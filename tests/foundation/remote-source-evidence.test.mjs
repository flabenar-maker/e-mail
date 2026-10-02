import assert from "node:assert/strict";
import test from "node:test";
import * as evidence from "../../scripts/lib/figma-component-evidence.mjs";
import { auditFigmaContractFacts } from "../../scripts/lib/figma-contract-facts.mjs";

// Independent synthetic remote-source model. It deliberately contains no live
// geometry; only the known compound identity and remote component key are used.
const SHA = "a".repeat(40);
const KEY = "8ea141edd5ec0679825e7fde633e211282b2405b";
const sessionNonce = "1".repeat(64);
const nonce = number => number.toString(16).padStart(64, "0");
const axes = viewport => [{ name: "Viewport", value: viewport }];

function node(node_id, node_type, children = [], extra = {}) {
  return { node_id, node_type, name: node_id, visible: true, opacity: 1,
    reference_dimensions: { width: 24, height: 24, unit: "px" }, children, ...extra };
}

function record(id, nodeId, role, variants = []) {
  return {
    id,
    identity: { semantic_role: role, node_kind: variants.length ? "component-set" : "component" },
    figma: { file_key: "synthetic-current-file", node_id: nodeId },
    variants,
    asset_contracts: [],
    evidence_links: { foundation_values: [], source_dependencies: [] },
    contracts: {
      mobile: { root: { render_mode: "presentation-table", facts: [], children: [] } },
      desktop: { root: { render_mode: "presentation-table", facts: [], children: [] } },
      figma_fact_links: [],
    },
  };
}

function componentVariants(mobile, desktop) {
  return [
    { id: "mobile", node_id: mobile, axes: axes("Mobile") },
    { id: "desktop", node_id: desktop, axes: axes("Desktop") },
  ];
}

function addPlacement(owner, viewport, variantNodeId, nodeId, target) {
  owner.contracts[viewport].root.children.push({
    id: `placement-${viewport}`,
    render_mode: "nested-component",
    ...target,
    children: [],
    facts: [{ id: "reference-size", value: { type: "dimensions", width: 24, height: 24, unit: "px" },
      provenance: { kind: "figma-literal", node_id: nodeId } }],
  });
  for (const dimension of ["width", "height"]) {
    owner.contracts.figma_fact_links.push({
      variant_node_id: variantNodeId,
      node_id: nodeId,
      source_path: `/reference_dimensions/${dimension}`,
      contract_path: `/contracts/${viewport}/root/children/0/facts/0/value/${dimension}`,
      transform: "identity",
    });
  }
}

function packet(owner, roots, requestNonce) {
  const count = current => 1 + (current.children ?? []).reduce((total, child) => total + count(child), 0);
  return {
    capture_version: "1.2.0",
    file_key: owner.figma.file_key,
    component_node_id: owner.figma.node_id,
    component_properties: [],
    capture_errors: [],
    capture_meta: {
      started_at: "2040-01-01T00:00:01.000Z",
      completed_at: "2040-01-01T00:00:02.000Z",
      request: { session_nonce: sessionNonce, request_nonce: requestNonce, canonical_git_sha: SHA },
      tree_complete: true,
      node_count: roots.reduce((total, root) => total + count(root), 0),
    },
    variants: roots.map((source_node, index) => ({
      variant_node_id: source_node.node_id,
      axes: owner.variants[index]?.axes ?? [],
      source_node,
    })),
  };
}

function fixture() {
  const notification = record("notification", "1024:19285", "item", componentVariants("1024:19279", "1024:19273"));
  const feature = record("feature", "946:25769", "asset", componentVariants("946:25769", "946:25770"));
  const remote = record("remote-glyph", "1331:1646", "icon");
  remote.figma.remote_source = { component_key: KEY };
  remote.contracts.mobile.root.render_mode = "figma-source-only";
  remote.contracts.desktop.root.render_mode = "figma-source-only";
  feature.asset_contracts = [{
    id: "feature-artwork",
    owner_layer_name: "artwork @4x",
    source_viewport: "desktop",
    source_mode_id: "rendered-node",
    export_boundary: { kind: "node", semantic_node_name: "artwork @4x" },
  }];

  const parentTrees = [], featureTrees = [];
  for (const [viewport, parentRoot, featureRoot, placement] of [
    ["mobile", "1024:19279", "946:25769", "1024:19279"],
    ["desktop", "1024:19273", "946:25770", "1024:19273"],
  ]) {
    const remoteMaster = node("1331:1646", "COMPONENT", [], { remote_source: { remote: true, component_key: KEY } });
    const remoteInstance = node(`I${placement};1331:1355`, "INSTANCE", [], {
      main_component_id: "1331:1646",
      remote_source: { remote: true, component_key: KEY },
    });
    const featureMaster = node(featureRoot, "COMPONENT", [node("1331:1355", "INSTANCE", [], {
      main_component_id: "1331:1646", remote_source: { remote: true, component_key: KEY },
    })]);
    const featureInstance = node(`I${placement};946:25769`, "INSTANCE", [remoteInstance], { main_component_id: featureRoot });
    parentTrees.push(node(parentRoot, "COMPONENT", [featureInstance]));
    featureTrees.push(featureMaster);
    addPlacement(notification, viewport, parentRoot, featureInstance.node_id, { component_id: "feature" });
    addPlacement(feature, viewport, featureRoot, "1331:1355", { asset_contract_id: "feature-artwork" });
    feature.evidence_links.source_dependencies.push({
      id: `remote-${viewport}`,
      source: { variant_node_id: featureRoot, node_id: "1331:1355", field_path: "/main_component_id" },
      asset_owner: { component_id: "feature", node_id: "1331:1355", asset_id: "feature-artwork" },
      target: { component_id: "remote-glyph" },
    });
    // The standalone remote root has no parent and no local alias or HTML export.
    assert.equal(remoteMaster.remote_source.component_key, KEY);
  }

  const model = {
    canonical_sha: SHA,
    records: [notification, feature, remote],
    manifest: { sources: [] },
    source_documents: new Map(),
    targets: new Map(),
  };
  const session = {
    schema_version: "1.1.0",
    canonical_git_sha: SHA,
    session_nonce: sessionNonce,
    started_at: "2026-10-02T00:00:00.000Z",
    completed_at: "2026-10-02T00:00:09.000Z",
    component_ids: ["notification", "feature", "remote-glyph"],
    captures: [],
  };
  const add = (owner, roots) => {
    const index = session.captures.length;
    const request_nonce = nonce(index + 10);
    const live = packet(owner, roots, request_nonce);
    session.captures.push({
      component_id: owner.id,
      receipt_id: `${owner.id}-receipt`,
      tool: "use_figma",
      request_nonce,
      requested_at: `2026-10-02T00:00:0${index}.000Z`,
      received_at: `2026-10-02T00:00:0${index + 1}.000Z`,
      packet: live,
    });
    return live;
  };
  const notificationPacket = add(notification, parentTrees);
  const featurePacket = add(feature, featureTrees);
  const remotePacket = add(remote, [node("1331:1646", "COMPONENT", [], { remote_source: { remote: true, component_key: KEY } })]);
  return { notification, feature, remote, model, session, notificationPacket, featurePacket, remotePacket };
}

function audit(fixtureValue) {
  return evidence.auditNestedArtworkEvidence({ recordId: "notification", model: fixtureValue.model, session: fixtureValue.session });
}

test("remote source is standalone and contains no local aliases, HTML, variants, or exports", () => {
  const f = fixture();
  assert.deepEqual(f.remote.variants, []);
  assert.deepEqual(f.remote.asset_contracts, []);
  assert.equal(f.remote.figma.remote_source.component_key, KEY);
  assert.equal(f.remote.contracts.desktop.root.render_mode, "figma-source-only");
});

test("remote component key proves the exact compound nested dependency", () => {
  const result = audit(fixture());
  assert.equal(result.ok, true, JSON.stringify(result.issues));
  assert.equal(result.dependencies.length, 2);
  assert.ok(result.dependencies.every(dependency => dependency.target.component_id === "remote-glyph"));
});

for (const [name, mutate] of [
  ["missing remote metadata", f => delete f.remotePacket.variants[0].source_node.remote_source],
  ["false remote marker", f => f.remotePacket.variants[0].source_node.remote_source.remote = false],
  ["wrong remote key", f => f.remotePacket.variants[0].source_node.remote_source.component_key = "f".repeat(40)],
  ["wrong compound main component", f => f.notificationPacket.variants[0].source_node.children[0].children[0].main_component_id = "1331:1647"],
  ["forged link target", f => f.feature.evidence_links.source_dependencies[0].target.component_id = "feature"],
  ["local root remote metadata", f => f.feature.figma.remote_source = { component_key: KEY }],
]) {
  test(`remote source rejects ${name}`, () => {
    const f = fixture();
    mutate(f);
    const result = audit(f);
    assert.equal(result.ok, false);
    assert.ok(result.issues.length > 0, JSON.stringify(result));
  });
}

test("combined auditor exposes remote nested evidence without changing scalar facts", () => {
  const f = fixture();
  const scalar = auditFigmaContractFacts({ record: f.notification, live: f.notificationPacket });
  const combined = evidence.auditFigmaComponentEvidence({ record: f.notification, live: f.notificationPacket, model: f.model, session: f.session });
  assert.deepEqual(combined.facts, scalar);
  assert.ok(combined.nested_artwork);
});
