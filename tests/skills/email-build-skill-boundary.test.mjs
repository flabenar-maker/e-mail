import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const skill = await readFile(
  join(repoRoot, ".agents/skills/building-cupis-emails/SKILL.md"),
  "utf8",
);

const forbiddenCanonicalPaths = [
  /data\/components\//u,
  /data\/foundations\//u,
  /core\/[^\s/]+\.md/u,
];

const forbiddenDomainFacts = [
  /#[0-9a-f]{3,8}\b/iu,
  /\brgba?\s*\(/iu,
  /\b\d+(?:\.\d+)?\s*(?:px|rem|em)\b/iu,
  /\b(?:min|max)-width\s*:\s*\d+/iu,
  /\b\d+\s*dpi\b/iu,
  /\b(?:jpeg|jpg|png|webp)\s+(?:quality|compression)\s*[:=]?\s*\d+/iu,
  /<(?:table|div|style|html|body)\b/iu,
  /\{\s*(?:color|font-size|width|margin|padding)\s*:/iu,
];

test("email-build skill routes only through the resolver-selected email build workflows", () => {
  assert.match(skill, /npm run resolve:skill-context/u);
  assert.match(skill, /(?:only|exactly)\s+one resolved bundle/iu);
  assert.match(skill, /only returned `?workflow\.steps`?/iu);
  assert.match(skill, /(?:only|either).*email-new-build.*email-continue-fix/iu);
  assert.match(skill, /SKILL_ROUTE_PAUSED/u);
  assert.match(skill, /SKILL_ROUTE_PAUSED.*(?:stop|return|halt).*without (?:a )?manual fallback/isu);
  assert.match(skill, /never invoke (?:the )?(?:maintenance|component-development) routes/iu);
});

test("email-build skill keeps canonical facts and implementation fragments out of the skill", () => {
  for (const forbidden of forbiddenCanonicalPaths) {
    assert.doesNotMatch(skill, forbidden);
  }

  for (const forbidden of forbiddenDomainFacts) {
    assert.doesNotMatch(skill, forbidden);
  }

  assert.doesNotMatch(skill, /(?:workflow step id|step_id)\s*[:=]\s*`?[^`\s]+`?/iu);
  assert.match(skill, /workflow\.steps/u);
});

test("email-build skill states operating boundaries explicitly", () => {
  assert.match(skill, /no Figma mutation/iu);
  assert.match(skill, /no new-component design/iu);
  assert.match(skill, /no production email outputs committed to GitHub/iu);
  assert.match(skill, /no overwrite of a source email version/iu);
  assert.match(skill, /no GitHub Actions or PR Checks/iu);
});