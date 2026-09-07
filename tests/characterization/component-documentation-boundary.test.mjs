import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));

async function read(relativePath) {
  return readFile(join(repoRoot, relativePath), "utf8");
}

test("component documentation standards keep the full contract and Figma projection separate", async () => {
  const [contractStandard, figmaStandard] = await Promise.all([
    read("core/component-contract-standard.md"),
    read("core/figma-component-description-standard.md"),
  ]);

  assert.match(contractStandard, /structured component contract/u);
  assert.match(contractStandard, /Mobile[^\n]*Desktop|Desktop[^\n]*Mobile/u);
  assert.match(contractStandard, /не дублиру/u);
  assert.match(contractStandard, /purpose/u);
  assert.match(contractStandard, /foundation references/u);
  assert.match(contractStandard, /asset contracts/u);
  assert.match(contractStandard, /onboarding/u);

  assert.match(figmaStandard, /CUPIS ID/u);
  assert.match(figmaStandard, /PURPOSE/u);
  assert.match(figmaStandard, /RENDER/u);
  assert.match(figmaStandard, /CRITICAL/u);
  assert.match(figmaStandard, /не является[^\n]*HTML/u);
  assert.match(figmaStandard, /Documentation link/u);

  assert.doesNotMatch(
    figmaStandard,
    /полны(?:й|е) (?:таблиц|секци)[^\n]*(?:typography|spacing)/iu,
  );
  assert.doesNotMatch(
    figmaStandard,
    /весь email workflow/u,
  );
});
