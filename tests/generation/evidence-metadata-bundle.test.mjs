import test from "node:test";
import assert from "node:assert/strict";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { buildContextBundle } from "../../scripts/lib/context-bundle.mjs";
const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
test("email route component projections do not expose synthetic evidence metadata", async () => {
  for (const routeId of ["email-new-build", "email-continue-fix"]) {
    const result = await buildContextBundle({ repoRoot, routeId, candidates: [{ id: "email-header" }], viewports: ["mobile", "desktop"] });
    assert.equal(result.status, "resolved", routeId);
    for (const component of result.bundle.components) assert.equal(Object.hasOwn(component, "evidence_links"), false, component.id);
  }
});
