import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  parseArguments,
  parseViewport,
} from "../../scripts/resolve-skill-context.mjs";

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const scriptPath = join(repoRoot, "scripts/resolve-skill-context.mjs");

function runCli(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [scriptPath, ...args], {
      cwd: repoRoot,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("error", reject);
    child.on("close", (code) => resolve({ code, stdout, stderr }));
  });
}

test("parses route, mode and repeated exact selectors", () => {
  assert.deepEqual(
    parseArguments([
      "--route",
      "library-maintenance",
      "--mode",
      "read-only",
      "--component",
      "email-header",
      "--component",
      "email-footer",
      "--viewport",
      "both",
      "--foundation",
      "typography",
    ]),
    {
      routeId: "library-maintenance",
      workflowMode: "read-only",
      candidates: [{ id: "email-header" }, { id: "email-footer" }],
      viewports: ["mobile", "desktop"],
      foundationIds: ["typography"],
    },
  );
  assert.deepEqual(parseViewport("mobile"), ["mobile"]);
});

test("prints deterministic JSON for a paused canonical route", async () => {
  const args = ["--route", "migration-progress"];
  const first = await runCli(args);
  const second = await runCli(args);

  assert.equal(first.code, 0);
  assert.equal(first.stderr, "");
  assert.equal(first.stdout, second.stdout);
  assert.equal(first.stdout.endsWith("\n"), true);
  const result = JSON.parse(first.stdout);
  assert.equal(result.status, "paused");
  assert.equal(result.bundle.mode, "structured-shadow");
  assert.deepEqual(result.blockers.map(({ code }) => code), [
    "SKILL_ROUTE_PAUSED",
  ]);
});

test("invalid arguments return typed JSON and exit one", async () => {
  const invalidViewport = await runCli([
    "--route",
    "migration-progress",
    "--viewport",
    "tablet",
  ]);
  const missingRoute = await runCli([]);

  assert.equal(invalidViewport.code, 1);
  assert.equal(invalidViewport.stderr, "");
  assert.deepEqual(
    JSON.parse(invalidViewport.stdout).blockers.map(({ code }) => code),
    ["SKILL_CONTEXT_VIEWPORT_INVALID"],
  );
  assert.equal(missingRoute.code, 1);
  assert.deepEqual(
    JSON.parse(missingRoute.stdout).blockers.map(({ code }) => code),
    ["SKILL_CONTEXT_CLI_ARGUMENTS"],
  );
});

test("a blocked route returns typed JSON and exit one", async () => {
  const result = await runCli(["--route", "missing-route"]);

  assert.equal(result.code, 1);
  assert.equal(result.stderr, "");
  assert.deepEqual(JSON.parse(result.stdout).blockers.map(({ code }) => code), [
    "CONTEXT_BUNDLE_ROUTE_UNKNOWN",
  ]);
});
