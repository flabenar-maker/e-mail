#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { verifyEmailModelSource } from "./lib/email-source-fidelity.mjs";

const path = process.argv[2];
if (!path || process.argv.length !== 3) {
  process.stderr.write("Usage: node scripts/verify-email-source.mjs <source-evidence.json>\n");
  process.exitCode = 2;
} else {
  try {
    const input = JSON.parse(await readFile(path, "utf8"));
    const diagnostics = verifyEmailModelSource(input).map(({ code, path: fieldPath, message }) =>
      ({ code, path: fieldPath, message }));
    process.stdout.write(`${JSON.stringify({ status: diagnostics.length ? "failed" : "passed", diagnostics }, null, 2)}\n`);
    if (diagnostics.length) process.exitCode = 1;
  } catch (error) {
    process.stderr.write(`Source evidence could not be read: ${error.message}\n`);
    process.exitCode = 2;
  }
}
