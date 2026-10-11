import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { loadEmailDeliveryProfiles, validateDeliveryProfile } from "../../scripts/lib/email-delivery-profile.mjs";
import { profile, profileDocument } from "../fixtures/rendering/email-delivery-fixtures.mjs";

test("profile validator is synchronous and accepts the documented profile shape", () => {
  assert.deepEqual(validateDeliveryProfile(profile), []);
  assert.ok(validateDeliveryProfile({ ...profile, unexpected: true }).some(({ code }) => /UNKNOWN|SCHEMA/i.test(code)));
  assert.equal(profileDocument.schema_version, "1.0.0");
});

test("profile schema loader rejects unknown fields", async (t) => {
  const repoRoot = await mkdtemp(join(tmpdir(), "delivery-profile-"));
  t.after(() => rm(repoRoot, { recursive: true, force: true }));
  await mkdir(join(repoRoot, "data", "delivery"), { recursive: true });
  await writeFile(join(repoRoot, "data", "delivery", "profiles.yaml"), JSON.stringify({ ...profileDocument, unexpected: true }));
  await assert.rejects(loadEmailDeliveryProfiles({ repoRoot }), /unknown|additional|schema/i);
});
