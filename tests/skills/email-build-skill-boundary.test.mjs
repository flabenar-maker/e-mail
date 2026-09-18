import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const allowedRoutes = ["email-new-build", "email-continue-fix"];
const allowedInlineTokens = new Set(["npm run resolve:skill-context", "workflow.steps", "SKILL_ROUTE_PAUSED", ...allowedRoutes]);

function routePolicy(source) {
  const policies = [...source.matchAll(/<!-- EMAIL_BUILD_ROUTE_POLICY\n([\s\S]*?)\n-->/gu)];
  assert.equal(policies.length, 1, "the skill must contain exactly one route policy");
  return JSON.parse(policies[0][1]);
}

function assertRouteBoundary(source) {
  assert.match(source, /npm run resolve:skill-context/u);
  const policy = routePolicy(source);
  assert.deepEqual(Object.keys(policy).sort(), ["onPaused", "resolvedBundle", "routes", "steps"]);
  assert.deepEqual(policy.routes, allowedRoutes);
  assert.equal(policy.resolvedBundle, "exactly-one");
  assert.equal(policy.steps, "returned-workflow.steps-only");
  assert.equal(policy.onPaused, "stop-without-manual-fallback");
  assert.doesNotMatch(source, /\b(?:invoke|select|route to|run|follow)\b[^\n]*(?:maintenance|component-development)\b/iu);
}

function assertNoDuplicatedMaterial(source) {
  for (const forbidden of [
    /data\/(?:components|foundations)(?:\/|\b)/iu,
    /core\/[^\s/`]+\.md\b/iu,
    /(?:component\s+catalog|catalog\s+of\s+components)[\s\S]{0,300}(?:\n\s*(?:[-*+]|\d+\.)\s+|\|)/iu,
    /(?:^|\n)\s*#{1,6}\s*components?\s*\n(?:\s*\n){0,2}\s*(?:[-*+]|\d+\.)\s+/imu,
    /#[0-9a-f]{3,8}\b/iu,
    /\b(?:rgba?|hsla?)\s*\(/iu,
    /\b(?:color|background(?:-color)?|border(?:-color)?)\s*:\s*(?:red|blue|green|black|white|gray|grey|yellow|orange|purple|pink|brown)\b/iu,
    /(?:\b\d+(?:\.\d+)?\s*(?:px|pt|pc|rem|em|ex|ch|vh|vw|vmin|vmax|cm|mm|in)\b|\b\d+(?:\.\d+)?\s*%)/iu,
    /@media\b|\b(?:min|max)-(?:width|height)\s*:/iu,
    /\b(?:export|image|asset)\s+(?:quality|compression|format)\b[^\n]*\b(?:\d+|lossless|lossy|high|medium|low)\b/iu,
    /<\/?[a-z][^>]*>/iu,
    /(?:^|\n)\s*(?:[.#][\w-]+|[a-z][\w-]*)\s*\{[^}]*\}/imu,
  ]) assert.doesNotMatch(source, forbidden);

  for (const [, token] of source.matchAll(/`([^`\n]+)`/gu)) {
    const isStepIdentifier = /^[a-z][a-z0-9]*(?:[-_][a-z0-9]+)+$/iu.test(token);
    assert.ok(!isStepIdentifier || allowedInlineTokens.has(token), `copied workflow step identifier: ${token}`);
  }
}

function assertOperatingBoundaries(source) {
  for (const requiredBoundary of [
    /\bno Figma mutation\b/iu,
    /\bno new-component design\b/iu,
    /\bno production email outputs committed to GitHub\b/iu,
    /\bno overwrite of a source email version\b/iu,
    /\bno GitHub Actions or PR Checks\b/iu,
  ]) assert.match(source, requiredBoundary);

  const actionableLines = source.split(/\r?\n/u).filter((line) => !/\b(?:no|never|do not|don't)\b/iu.test(line)).join("\n");
  for (const prohibitedInstruction of [
    /\b(?:mutate|write|edit|update|create|change)\b[^\n]*\bFigma\b/iu,
    /\bFigma\b[^\n]*\b(?:mutate|write|edit|update|create|change)\b/iu,
    /\b(?:create|design|add|build)\b[^\n]*\bnew[- ]component\b/iu,
    /\b(?:commit|push)\b[^\n]*\bproduction email output(?:s)?\b/iu,
    /\boverwrite\b[^\n]*\bsource email version\b/iu,
    /\b(?:run|use|consult|rely on|wait for)\b[^\n]*\b(?:GitHub Actions|PR Checks)\b/iu,
  ]) assert.doesNotMatch(actionableLines, prohibitedInstruction);
  assert.doesNotMatch(source, /\b(?:unless|except|however|but)\b[^\n]*\b(?:Figma|new[- ]component|production email output|source email version|GitHub Actions|PR Checks)\b/iu);
}

const validFixture = `<!-- EMAIL_BUILD_ROUTE_POLICY
{"routes":["email-new-build","email-continue-fix"],"resolvedBundle":"exactly-one","steps":"returned-workflow.steps-only","onPaused":"stop-without-manual-fallback"}
-->
npm run resolve:skill-context
No Figma mutation.
No new-component design.
No production email outputs committed to GitHub.
No overwrite of a source email version.
No GitHub Actions or PR Checks.`;

function assertGuardFixtures() {
  assert.doesNotThrow(() => { assertRouteBoundary(validFixture); assertNoDuplicatedMaterial(validFixture); assertOperatingBoundaries(validFixture); });
  for (const invalidRoute of [
    validFixture.replace("email-continue-fix", "maintenance"), validFixture.replace('"exactly-one"', '"many"'),
    validFixture.replace("returned-workflow.steps-only", "copied-steps-allowed"), validFixture.replace("stop-without-manual-fallback", "manual-fallback"),
    `${validFixture}\nInvoke maintenance route.`,
  ]) assert.throws(() => assertRouteBoundary(invalidRoute));
  for (const duplication of [
    "data/components/button.json", "data/foundations/colors.json", "core/example.md", "## Components\n- Button", "#fff", "color: red", "16pt", "80%",
    "@media (min-width: 600px)", "export quality 80", "<a href=\"#\">", ".button { color: red; }", "`render-email-html`",
  ]) assert.throws(() => assertNoDuplicatedMaterial(`${validFixture}\n${duplication}`));
  for (const contradiction of [
    "Edit Figma now.", "Create a new component.", "Commit production email outputs.", "Overwrite the source email version.", "Run GitHub Actions.",
    "No Figma mutation, except update Figma.",
  ]) assert.throws(() => assertOperatingBoundaries(`${validFixture}\n${contradiction}`));
}

assertGuardFixtures();

const skill = await readFile(join(repoRoot, ".agents/skills/building-cupis-emails/SKILL.md"), "utf8");

test("email-build skill obeys the resolver route boundary", () => assertRouteBoundary(skill));
test("email-build skill does not duplicate canonical material", () => assertNoDuplicatedMaterial(skill));
test("email-build skill has no contradictory prohibited instructions", () => assertOperatingBoundaries(skill));