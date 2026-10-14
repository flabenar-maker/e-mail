import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
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
  await mkdir(join(repoRoot, "data", "delivery"), { recursive: true }); await mkdir(join(repoRoot, "schemas"), { recursive: true }); await writeFile(join(repoRoot,"schemas","email-delivery-profiles.schema.json"), await readFile(join(process.cwd(),"schemas","email-delivery-profiles.schema.json"))); await writeFile(join(repoRoot,"schemas","email-delivery.schema.json"), await readFile(join(process.cwd(),"schemas","email-delivery.schema.json")));
  await writeFile(join(repoRoot, "data", "delivery", "profiles.yaml"), JSON.stringify({ ...profileDocument, unexpected: true }));
  const manifest={sources:[{id:"email-delivery-profiles",kind:"registry",path:"data/delivery/profiles.yaml"},{id:"email-delivery-profiles-schema",kind:"schema",path:"schemas/email-delivery-profiles.schema.json"},{id:"email-delivery-schema",kind:"schema",path:"schemas/email-delivery.schema.json"}]}; await assert.rejects(loadEmailDeliveryProfiles({ repoRoot, manifest, componentIndex:{bySystemId:new Map()} }), (error) => error instanceof AggregateError && error.errors.some((item) => item.code === "EMAIL_DELIVERY_PROFILES_SCHEMA"));
});



test("profile validator accepts the canonical root HTML package policy",()=>{
  const rootProfile={...profile,version:"1.0.1",package:{...profile.package,id:"altcraft-root-html-v1",html_entry:"email.html",asset_root_entry:"images"}};
  assert.deepEqual(validateDeliveryProfile(rootProfile),[]);
});
