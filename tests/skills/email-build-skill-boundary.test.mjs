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
  const routeInstructions = source.replaceAll("npm run resolve:skill-context", "");
  for (const clause of routeInstructions.split(/[;\n.]/u)) {
    if (/\b(?:do not|never|don't)\s+(?:invoke|select|route to|run|follow)\b/iu.test(clause)) continue;
    const instruction = /\b(?:invoke|select|route to|run|follow)\b\s+(?:only\s+|either\s+)?(?:the\s+)?(?:route\s+)?(.+)/iu.exec(clause);
    if (!instruction) continue;
    for (const operand of instruction[1].split(/\s*(?:,|\bor\b|\band\b)\s*/iu)) {
      const route = /`?([a-z][a-z0-9-]*)\b/iu.exec(operand)?.[1];
      if (route) assert.ok(allowedRoutes.includes(route), `invoked or selected route is not allowed: ${route}`);
    }
  }
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
  const boundaryResources = [
    { required: /\bno Figma mutation\b/iu, subject: "Figma" },
    { required: /\bno new-component design\b/iu, subject: "new component" },
    { required: /\bno production email outputs committed to GitHub\b/iu, subject: "production email outputs" },
    { required: /\bno overwrite of a source email version\b/iu, subject: "source email version" },
    { required: /\bno GitHub Actions or PR Checks\b/iu, subject: "GitHub Actions" },
  ];
  for (const boundary of boundaryResources) assert.match(source, boundary.required);

  const actionableClauses = [];
  for (const line of source.split(/\r?\n/u)) {
    let inheritedSubject = "";
    for (let clause of line.split(/;|,\s*(?:but|however|except)\b/iu)) {
      for (const boundary of boundaryResources) {
        if (boundary.required.test(clause)) {
          inheritedSubject = boundary.subject;
          clause = clause.replace(new RegExp(boundary.required.source, "giu"), "");
        }
      }
      if (/\b(?:no|never|do not|don't)\b/iu.test(clause)) continue;
      if (inheritedSubject && /\b(?:it|them|that|then|next)\b/iu.test(clause)) clause = `${clause} ${inheritedSubject}`;
      actionableClauses.push(clause);
    }
  }
  const actionableText = actionableClauses.join("\n");
  for (const prohibitedInstruction of [
    /\b(?:mutate|write|edit|update|create|change)\b[^\n]*\bFigma\b/iu,
    /\bFigma\b[^\n]*\b(?:mutate|write|edit|update|create|change)\b/iu,
    /\b(?:create|design|add|build)\b[^\n]*\bnew[- ]component\b/iu,
    /\b(?:commit|push)\b[^\n]*\bproduction email output(?:s)?\b/iu,
    /\boverwrite\b[^\n]*\bsource email version\b/iu,
    /\b(?:run|use|consult|rely on|wait for)\b[^\n]*\b(?:GitHub Actions|PR Checks)\b/iu,
  ]) assert.doesNotMatch(actionableText, prohibitedInstruction);
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
    `${validFixture}\nInvoke maintenance route.`, `${validFixture}\nRun email-other-route.`, `${validFixture}\nSelect email-new-build or email-other-route.`,
  ]) assert.throws(() => assertRouteBoundary(invalidRoute));
  for (const duplication of [
    "data/components/button.json", "data/foundations/colors.json", "core/example.md", "## Components\n- Button", "#fff", "color: red", "16pt", "80%",
    "@media (min-width: 600px)", "export quality 80", "<a href=\"#\">", ".button { color: red; }", "`render-email-html`",
  ]) assert.throws(() => assertNoDuplicatedMaterial(`${validFixture}\n${duplication}`));
  for (const contradiction of [
    "Edit Figma now.", "Create a new component.", "Commit production email outputs.", "Overwrite the source email version.", "Run GitHub Actions.",
    "No Figma mutation; edit Figma now.", "No new-component design; create a new component now.",
    "No production email outputs committed to GitHub; commit production email outputs now.",
    "No overwrite of a source email version; overwrite source email version now.",
    "No GitHub Actions or PR Checks; run GitHub Actions now.", "No Figma mutation, except update Figma.",
    "No Figma mutation; then edit it.", "No new-component design; then create it.",
    "No production email outputs committed to GitHub; then commit them.",
    "No overwrite of a source email version; then overwrite it.",
    "No GitHub Actions or PR Checks; then run it.",
  ]) assert.throws(() => assertOperatingBoundaries(`${validFixture}\n${contradiction}`));
}

assertGuardFixtures();

const skill = await readFile(join(repoRoot, ".agents/skills/building-cupis-emails/SKILL.md"), "utf8");

test("email-build skill obeys the resolver route boundary", () => assertRouteBoundary(skill));
test("email-build skill does not duplicate canonical material", () => assertNoDuplicatedMaterial(skill));
test("email-build skill has no contradictory prohibited instructions", () => assertOperatingBoundaries(skill));