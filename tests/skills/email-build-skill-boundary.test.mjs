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
  const routeInstructions = source.replace(/<!-- CUPIS_EXECUTION_BINDING -->[\s\S]*?<!-- END_CUPIS_EXECUTION_BINDING -->/u, "")
    .replaceAll("npm run resolve:skill-context", "")
    .replaceAll("pnpm run resolve:skill-context", "")
    .replaceAll("follow per-viewport instance visibility", "");
  for (const clause of routeInstructions.split(/[;\n.]/u)) {
    for (const imperativeSegment of clause.split(/\s*,?\s*(?:(?:but|however|except|and|or)\s+)(?=(?:(?:do not|never|don't)\s+)?(?:invoke|select|route to|run|follow)\b)/iu)) {
      if (/\b(?:do not|never|don't)\s+(?:invoke|select|route to|run|follow)\b/iu.test(imperativeSegment)) continue;
      const instruction = /\b(?:invoke|select|route to|run|follow)\b\s+(?:only\s+|either\s+)?(?:the\s+)?(?:route\s+)?(.+)/iu.exec(imperativeSegment);
      if (!instruction) continue;
      for (const operand of instruction[1].split(/\s*(?:,|\bor\b|\band\b)\s*/iu)) {
        const route = /`?([a-z][a-z0-9-]*)\b/iu.exec(operand)?.[1];
        if (route) assert.ok(allowedRoutes.includes(route), `invoked or selected route is not allowed: ${route}`);
      }
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
    { required: /\bActual email verification stays local\b/iu, subject: "actual email verification" },
    { required: /\bPR Checks never replace receipts\b/iu, subject: "PR Checks" },
  ];
  for (const boundary of boundaryResources) assert.match(source, boundary.required);

  const actionableClauses = [];
  let inheritedSubject = "";
  for (const line of source.split(/\r?\n/u)) {
    const isAdjacentContinuation = inheritedSubject && /^(?:(?:and\s+)?then|next|after that)\b|^(?:it|them|that)\b/iu.test(line.trim());
    if (!isAdjacentContinuation) inheritedSubject = "";
    let lineSubject = "";
    for (let clause of line.split(/;|,\s*(?:but|however|except)\b/iu)) {
      for (const boundary of boundaryResources) {
        if (boundary.required.test(clause)) {
          inheritedSubject = boundary.subject;
          lineSubject = boundary.subject;
          clause = clause.replace(new RegExp(boundary.required.source, "giu"), "");
        }
      }
      if (/\b(?:no|never|do not|don't)\b/iu.test(clause)) continue;
      if (inheritedSubject && /\b(?:it|them|that|then|next)\b/iu.test(clause)) clause = `${clause} ${inheritedSubject}`;
      actionableClauses.push(clause);
    }
    inheritedSubject = lineSubject;
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
Actual email verification stays local; PR Checks never replace receipts.`;

function assertGuardFixtures() {
  assert.doesNotThrow(() => { assertRouteBoundary(validFixture); assertNoDuplicatedMaterial(validFixture); assertOperatingBoundaries(validFixture); });
  assert.doesNotThrow(() => assertRouteBoundary(`${validFixture}\nDo not run maintenance route, but run email-new-build.`));
  assert.doesNotThrow(() => assertRouteBoundary(`${validFixture}\nHidden elements follow per-viewport instance visibility, including hidden ancestors.`));
  assert.doesNotThrow(() => assertRouteBoundary(`${validFixture}\npnpm run resolve:skill-context --route ROUTE --mode MODE`));
  assert.throws(() => assertRouteBoundary(`${validFixture}\nHidden elements follow per-viewport instance visibility, and run email-other-route.`));
  assert.throws(() => assertRouteBoundary(`${validFixture}\npnpm run resolve:skill-context; run email-other-route.`));
  assert.doesNotThrow(() => assertOperatingBoundaries(`${validFixture}\nNo Figma mutation.\nEdit it after generating the draft.`));
  for (const invalidRoute of [
    validFixture.replace("email-continue-fix", "maintenance"), validFixture.replace('"exactly-one"', '"many"'),
    validFixture.replace("returned-workflow.steps-only", "copied-steps-allowed"), validFixture.replace("stop-without-manual-fallback", "manual-fallback"),
    `${validFixture}\nInvoke maintenance route.`, `${validFixture}\nRun email-other-route.`, `${validFixture}\nSelect email-new-build or email-other-route.`, `${validFixture}\nDo not run maintenance route, but run email-other-route.`,
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
    "PR Checks never replace receipts; then run it.",
    "No Figma mutation.\nThen edit it.", "No new-component design.\nThen create it.",
    "No production email outputs committed to GitHub.\nThen commit them.",
    "No overwrite of a source email version.\nThen overwrite it.",
    "Actual email verification stays local; PR Checks never replace receipts.\nThen run it.",
  ]) assert.throws(() => assertOperatingBoundaries(`${validFixture}\n${contradiction}`));
}

assertGuardFixtures();

const skill = await readFile(join(repoRoot, ".agents/skills/building-cupis-emails/SKILL.md"), "utf8");

test("email-build skill obeys the resolver route boundary", () => assertRouteBoundary(skill));
test("email-build skill does not duplicate canonical material", () => assertNoDuplicatedMaterial(skill));
test("email-build skill has no contradictory prohibited instructions", () => assertOperatingBoundaries(skill));

// These instruction-boundary guards catch omissions and conflicting permissions.
// Fresh consuming-agent pressure tests remain the independent behavioral evidence.
function rasterSection(source) {
  const match = /^## Content raster visual decisions\s*\n([\s\S]*?)(?=^## |$(?![\s\S]))/mu.exec(source);
  assert.ok(match, "the scoped content-raster decision section is missing");
  return match[1];
}

function assertScope(section) {
  assert.match(section, /content[^\n]{0,80}\braster|содержательн[а-яё\s-]*растр/iu);
  assert.match(section, /photograph|photo|фотограф/iu);
  assert.match(section, /illustration|иллюстрац/iu);
  assert.match(section, /banner|баннер/iu);
  assert.match(section, /image cards?|карточк[а-яё\s]*изображен/iu);
  assert.match(section, /analogous|аналогичн/iu);
  for (const role of [/icons?|иконк/iu, /logos?|логотип/iu, /QR/iu, /buttons?|кнопк/iu, /text|текст/iu, /layout|компоновк|геометр/iu, /links?|ссылк/iu]) assert.match(section, role);
  assert.match(section, /role|роль|роли|назначен/iu);
  assert.match(section, /not[^\n]*(?:extension|PNG|JPEG)|не[^\n]*(?:расширен|формат|PNG|JPEG)/iu);
  for (const clause of section.split(/[.;\n]/u)) {
    if (/\b(?:not|never|do not|don't)\b|\bне\b/iu.test(clause)) continue;
    assert.doesNotMatch(clause, /(?:all|any|every)\s+(?:raster\s+)?(?:images?|image findings?|PNG|JPEG)|все[^\n]*(?:изображен|PNG|JPEG)/iu, "blanket/extension-only image eligibility widens the decision boundary");
  }
}

function assertEvidenceOrder(section) {
  const show = /(?:show|display|показ)[\s\S]{0,200}(?:actual|фактическ)[\s\S]{0,200}(?:reference|макет)[\s\S]{0,100}(?:rendered|письм|собран)/iu.exec(section);
  assert.ok(show, "show the actual reference/rendered pair, not a promised or invented comparison");
  const after = section.slice(show.index + show[0].length);
  assert.match(after, /(?:before|then|затем|до\s+вопрос)[\s\S]{0,160}(?:ask|question|спрос|вопрос)/iu, "actual evidence must precede the question");
  const labels = ["Продолжаем", "Остановись", "Исправь сам"];
  let previous = -1;
  for (const label of labels) { const index = after.indexOf(label); assert.ok(index > previous, `missing or reordered literal choice: ${label}`); previous = index; }
}

function assertPending(section) {
  assert.match(section, /(?:wait|pending|ожидан)[\s\S]{0,220}(?:answer|ответ)/iu);
  assert.match(section, /(?:elapsed|silence|timeout|молчан|истек|время)[\s\S]{0,240}(?:not|never|не)[\s\S]{0,180}(?:consent|accept|согласи|приняти)/iu);
  assert.match(section, /(?:dependent|publication|publish|выпуск|публикац)[\s\S]{0,180}(?:wait|block|not|never|жд|не)|(?:not|never|не)[\s\S]{0,180}(?:publish|publication|выпуск|публикац)/iu);
  assert.match(section, /(?:pending|awaiting|ожидан)[\s\S]{0,180}(?:not|не)[\s\S]{0,180}(?:final stop|окончательн|останов)/iu);
}

function assertScopedEvidence(section) {
  for (const term of [/finding|расхождени/iu, /literal|дословн|буквальн/iu, /direct|прям/iu, /email|письм/iu, /image|изображени/iu, /viewport/iu, /appearance|внешн[а-яё\s]*вид/iu, /digest|хэш/iu]) assert.match(section, term);
  assert.match(section, /(?:reuse|reus|переиспольз|повторно)[\s\S]{0,250}(?:only|только)[\s\S]{0,250}(?:same|unchanged|совпад|неизмен)/iu);
  assert.match(section, /(?:changed|different|new|измен|друг|нов)[\s\S]{0,220}(?:choice|decision|answer|выбор|решени|ответ)/iu);
  assert.match(section, /(?:not|never|не)[\s\S]{0,140}(?:fixed|исправлен)|(?:retained|сохран)[\s\S]{0,160}(?:finding|расхождени)/iu);
}

function assertImageOnly(section) {
  assert.match(section, /image-only|только[\s\S]{0,60}изображени/iu);
  assert.match(section, /existing|unchanged|действующ|существующ/iu);
  assert.match(section, /contract|контракт/iu);
  for (const operation of [/re-export|повторн[а-яё\s]*экспорт/iu, /crop|кадрирован/iu, /scal|масштаб/iu, /process|обработ/iu]) assert.match(section, operation);
  for (const forbidden of [/HTML/iu, /CSS/iu, /VML/iu, /template|шаблон/iu, /renderer|рендерер/iu, /contract|контракт/iu, /schema|схем/iu, /original Figma|исходн[а-яё\s]*Figma/iu]) assert.match(section, forbidden);
  assert.match(section, /(?:not|never|не)[^\n]*(?:change|edit|modify|измен|прав)/iu);
}

function assertRepairReturn(section) {
  assert.match(section, /(?:infeasible|unavailable|fails?|failed|impossible|невозмож|недоступ|неудач)[\s\S]{0,300}(?:show|display|показ)/iu);
  assert.match(section, /(?:return|again|вернут|снова)[\s\S]{0,200}(?:choice|choices|вариант|выбор)/iu);
  assert.match(section, /(?:fresh|new|свеж|нов)[\s\S]{0,180}(?:bytes|digest|байт|хэш)[\s\S]{0,180}(?:render|рендер)[\s\S]{0,180}(?:compar|сравн)/iu);
  assert.match(section, /(?:not|never|не)[\s\S]{0,180}(?:permanent stop|system change|maintenance|окончательн|систем|библиотек)/iu);
}

const validRasterFixture = `Content raster photographs and illustrations in banners, image cards and analogous blocks are eligible by semantic role, not by PNG/JPEG extension. Icons, logos, QR codes, buttons, text, layout and links are excluded.
Show the actual reference/rendered pair before asking the question: Продолжаем / Остановись / Исправь сам.
Wait for the explicit answer. Silence and elapsed timeout are not consent or acceptance. Dependent publication waits; pending is not a final stop.
Preserve the finding and literal direct answer for the same email, image, viewport, appearance and digest. Reuse only the same unchanged scope. A changed image or new viewport requires a new decision. A retained finding is not fixed.
Repair is image-only within existing contracts: re-export, crop, scale and processing. Do not change HTML, CSS, VML, templates, renderer, contracts, schemas or original Figma.
If repair is infeasible or fails, show the actual result and return the same choices again. Success requires fresh bytes and digests, rendering and comparison. Do not propose system changes or a permanent stop.
Missing/broken assets, source, contract and HTML failures retain unchanged blocking gates. A mixed photo and separate layout failure remains blocking.`;

// Hand-derived contradictory instructions must be rejected, rather than merely
// testing that a happy-path document contains the names of the choices.
test("raster-image review is semantic and narrowly scoped", () => {
  assert.doesNotThrow(() => assertScope(validRasterFixture));
  assert.throws(() => assertScope(validRasterFixture + "\nEvery image finding is eligible."));
  assert.throws(() => assertScope(validRasterFixture + "\nAny PNG or JPEG is eligible regardless of role."));
  assertScope(rasterSection(skill));
});

test("raster-image review shows evidence before the three choices", () => {
  assert.doesNotThrow(() => assertEvidenceOrder(validRasterFixture));
  assert.throws(() => assertEvidenceOrder(validRasterFixture.replace("Show the actual reference/rendered pair before asking the question", "Ask the question before showing a promised comparison")));
  assertEvidenceOrder(rasterSection(skill));
});

test("raster-image review waits without elapsed consent", () => {
  assert.doesNotThrow(() => assertPending(validRasterFixture));
  assert.throws(() => assertPending(validRasterFixture.replace("Silence and elapsed timeout are not consent or acceptance.", "Silence and elapsed timeout imply consent.")));
  assertPending(rasterSection(skill));
});

const assetStandard = await readFile(join(repoRoot, "core/asset-export-standard.md"), "utf8");

test("raster-image decisions preserve findings and scoped direct answers", () => {
  assert.doesNotThrow(() => assertScopedEvidence(validRasterFixture));
  assert.throws(() => assertScopedEvidence(validRasterFixture.replace("Reuse only the same unchanged scope.", "Reuse for every future email.")));
  assertScopedEvidence(rasterSection(assetStandard));
});

test("raster-image repair stays within existing contracts", () => {
  assert.doesNotThrow(() => assertImageOnly(validRasterFixture));
  assert.throws(() => assertImageOnly(validRasterFixture.replace("Do not change HTML, CSS, VML, templates, renderer, contracts, schemas or original Figma.", "Change HTML to achieve the requested crop.")));
  assertImageOnly(rasterSection(assetStandard));
});

test("raster-image repair failure returns the user choice", () => {
  assert.doesNotThrow(() => assertRepairReturn(validRasterFixture));
  assert.throws(() => assertRepairReturn(validRasterFixture.replace("If repair is infeasible or fails, show the actual result and return the same choices again.", "If repair is infeasible, abandon the release.")));
  assertRepairReturn(rasterSection(assetStandard));
});

