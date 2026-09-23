import { assessAssetExport } from "./lib/asset-export-preflight.mjs";

let input = "";
for await (const chunk of process.stdin) input += chunk;

let result;
try {
  result = assessAssetExport(JSON.parse(input));
} catch {
  result = {
    status: "blocked",
    issues: [{ code: "evidence-invalid", detail: "Expected one valid JSON export-evidence object on stdin." }],
  };
}

process.stdout.write(JSON.stringify(result) + "\n");
process.exitCode = result.status === "ready" ? 0 :
  result.status === "needs-user-decision" ? 2 : 1;