import test from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

import { buildEmailPreview } from "../../scripts/lib/email-preview.mjs";

const HTML = "<!doctype html><html><head><style>.desktop{display:block}</style><meta charset=\"utf-8\"><style media=\"screen\">.mobile{display:none}</style></head><body><table style=\"width:100%\"><tr><td><img src=\"images/card.jpg\" alt=\"\"></td></tr></table></body></html>";

test("normal preview preserves rendered HTML byte-for-byte", () => {
  assert.equal(buildEmailPreview({ html: HTML, mode: "normal" }), HTML);
});

test("no-style preview removes only style blocks", () => {
  assert.equal(
    buildEmailPreview({ html: HTML, mode: "no-style" }),
    "<!doctype html><html><head><meta charset=\"utf-8\"></head><body><table style=\"width:100%\"><tr><td><img src=\"images/card.jpg\" alt=\"\"></td></tr></table></body></html>",
  );
});

test("preview rejects an unsupported mode", () => {
  assert.throws(
    () => buildEmailPreview({ html: HTML, mode: "invent-layout" }),
    (error) => error.code === "EMAIL_PREVIEW_MODE_UNSUPPORTED",
  );
});
const execFileAsync = promisify(execFile);
const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));

test("preview CLI writes normal and no-style views of the same rendered email", async () => {
  const folder = await mkdtemp(join(tmpdir(), "cupis-preview-"));
  const model = join(repoRoot, "tests", "fixtures", "rendering", "pilot-email.json");
  const normalPath = join(folder, "normal.html");
  const noStylePath = join(folder, "no-style.html");
  const script = join(repoRoot, "scripts", "render-email-preview.mjs");
  try {
    await execFileAsync(process.execPath, [script, "--model", model, "--mode", "normal", "--output", normalPath], { cwd: repoRoot });
    await execFileAsync(process.execPath, [script, "--model", model, "--mode", "no-style", "--output", noStylePath], { cwd: repoRoot });
    const normal = await readFile(normalPath, "utf8");
    const noStyle = await readFile(noStylePath, "utf8");
    assert.match(normal, /<style>[\s\S]*<\/style>/u);
    assert.doesNotMatch(noStyle, /<style\b/iu);
    assert.equal(noStyle, buildEmailPreview({ html: normal, mode: "no-style" }));
  } finally {
    await rm(folder, { recursive: true, force: true });
  }
});
