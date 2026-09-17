import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const skill = await readFile(
  join(
    repoRoot,
    ".agents/skills/maintaining-cupis-email-system/SKILL.md",
  ),
  "utf8",
);

test("maintenance skill delegates route context to the machine resolver", () => {
  assert.match(skill, /npm run resolve:skill-context/u);
  assert.match(skill, /one resolved bundle/iu);
  assert.match(skill, /workflow\.steps/u);
  assert.match(skill, /disposable exact-SHA snapshot/iu);
  assert.match(skill, /snapshot HEAD.*pinned SHA/iu);
  assert.doesNotMatch(skill, /resolve every listed source_id/iu);
  assert.doesNotMatch(skill, /fetch only those paths/iu);
});

test("paused routes cannot fall back or authorize production operations", () => {
  assert.match(skill, /SKILL_ROUTE_PAUSED/u);
  assert.match(skill, /read-only navigation/iu);
  assert.match(skill, /explicitly scoped migration implementation plan/iu);
  assert.match(skill, /production library operation/iu);
  assert.match(skill, /Figma write/iu);
  assert.match(skill, /email build/iu);
  assert.match(skill, /Do not substitute another workflow/iu);
  assert.match(skill, /direct user request.*does not replace.*implementation plan/iu);
  assert.match(skill, /return `not ready` without any mutation/iu);
});

test("maintenance safety gates remain explicit", () => {
  assert.match(skill, /migration-progress/u);
  assert.match(skill, /impact report/iu);
  assert.match(skill, /read-back/iu);
  assert.match(skill, /separate authorization/iu);
  assert.match(skill, /gh CLI/iu);
  assert.match(skill, /GitHub Actions/iu);
  assert.match(skill, /Figma mutation gate/iu);
});

test("skill does not duplicate domain facts or canonical data paths", () => {
  for (const forbidden of [
    "data/components/",
    "data/foundations/",
    "core/email-rendering-standard.md",
    "core/typography-standard.md",
    "core/asset-export-standard.md",
  ]) {
    assert.equal(skill.includes(forbidden), false, forbidden);
  }
});
