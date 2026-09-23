#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { verifyEmailModelSource } from "./lib/email-source-fidelity.mjs";

const path = process.argv[2];
const selectedTest = process.argv[3] === "--selected-test";
if (!path || process.argv.length > 4 || (process.argv.length === 4 && !selectedTest)) {
  process.stderr.write("Usage: node scripts/verify-email-source.mjs <source-evidence.json> [--selected-test]\n");
  process.exitCode = 2;
} else {
  try {
    const input = JSON.parse(await readFile(path, "utf8"));
    const diagnostics = verifyEmailModelSource(input).map(({ code, path: fieldPath, message }) =>
      ({ code, path: fieldPath, message }));
    if (!selectedTest) {
      for (const viewport of ["mobile", "desktop"]) {
        if (input.readings?.selection?.[viewport]?.scope !== "full-email") {
          diagnostics.push({ code: "EMAIL_SOURCE_SCOPE_INCOMPLETE", path: `/readings/selection/${viewport}/scope`,
            message: `Production verification requires the complete ${viewport} email, not a selected subtree.` });
        }
      }
      for (const [index, item] of (input.authorizedInputs ?? []).entries()) {
        if (!["user", "policy-derived"].includes(item.origin)) {
          diagnostics.push({ code: "EMAIL_SOURCE_INPUT_UNAUTHORIZED", path: `/authorizedInputs/${index}/origin`,
            message: `Production source verification cannot accept ${item.origin ?? "missing"} input provenance.` });
        }
      }
      for (const [index, item] of (input.correspondence?.fields ?? []).entries()) {
        if (!["figma", "user", "policy-derived"].includes(item.origin)) {
          diagnostics.push({ code: "EMAIL_SOURCE_INPUT_UNAUTHORIZED", path: `/correspondence/fields/${index}/origin`,
            message: `Production source verification cannot accept ${item.origin ?? "missing"} field provenance.` });
        }
      }
    }
    process.stdout.write(`${JSON.stringify({ status: diagnostics.length ? "failed" : "passed", scope: selectedTest ? "selected-test" : "full-email", diagnostics }, null, 2)}\n`);
    if (diagnostics.length) process.exitCode = 1;
  } catch (error) {
    process.stderr.write(`Source evidence could not be read: ${error.message}\n`);
    process.exitCode = 2;
  }
}


