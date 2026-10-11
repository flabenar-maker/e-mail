import { createHash } from "node:crypto";
import { readFile, realpath } from "node:fs/promises";
import { isAbsolute, relative, resolve } from "node:path";
import { SystemValidationError } from "./diagnostics.mjs";
import { validateDocumentShape } from "./schema-validation.mjs";
import { parseStrictYaml, readStrictYaml } from "./strict-yaml.mjs";

const fail = (code, path, message) => { throw new SystemValidationError(code, path, message); };
async function sourcePath(repoRoot, manifest, id, kind) {
  const entries = manifest?.sources?.filter(source => source.id === id) ?? [];
  const source = entries[0];
  if (entries.length !== 1 || source.kind !== kind || typeof source.path !== "string" || !source.path || /[\\:*?]/u.test(source.path) || source.path.startsWith("/") || source.path.split("/").some(part => !part || part === "." || part === "..")) {
    fail("execution-policy-source", "/sources/" + id, "Expected one registered repository-relative " + kind + " source.");
  }
  const root = await realpath(repoRoot);
  let actual;
  try { actual = await realpath(resolve(root, source.path)); }
  catch { fail("execution-policy-source", source.path, "Registered execution policy source is unavailable."); }
  const rel = relative(root, actual);
  if (rel.startsWith("..") || isAbsolute(rel)) fail("execution-policy-source", source.path, "Policy source escapes the repository.");
  return actual;
}

export function validateExecutionPolicyShape(document, schema) {
  return validateDocumentShape({document, schema, supportedVersion:"1.0.0", versionCode:"execution-policy-version", schemaCode:"execution-policy-schema"});
}

function validateReferences(policy) {
  const error = (path, message) => fail("execution-policy-reference", path, message);
  if (policy.tiers.some((tier, index) => tier.tier !== index + 1)) error("/tiers", "Tiers must be unique and ordered 1 through 4.");
  const models = policy.tiers.flatMap(tier => tier.candidates.map(candidate => candidate.model));
  if (new Set(models).size !== models.length) error("/tiers", "A model may belong to only one tier and candidate slot.");
  for (const [kind, rule] of Object.entries(policy.task_kinds)) {
    for (const capability of rule.required_capabilities) if (!policy.capability_ids.includes(capability)) error("/task_kinds/" + kind, "Unknown capability: " + capability);
  }
  for (const [operation, values] of Object.entries(policy.operation_capabilities)) for (const value of values) if (!policy.capability_ids.includes(value)) error("/operation_capabilities/" + operation, "Unknown capability: " + value);
  const ids = policy.workloads.map(workload => workload.id);
  if (new Set(ids).size !== ids.length) error("/workloads", "Workload IDs must be unique.");
  for (const required of ["docs-scoped", "repository-full", "windows-bootstrap", "visual-fixtures", "installed-skills", "real-email-visual"]) if (!ids.includes(required)) error("/workloads", "Required workload missing: " + required);
  for (const workload of policy.workloads) {
    if (["installed-skills", "real-email-visual"].includes(workload.id) && workload.portability !== "local-only") error("/workloads/" + workload.id, "Live user artifacts and installed skills require local verification.");
    const references = workload.commands.flatMap(command => command.args.filter(arg => /^\{[a-z_]+\}$/u.test(arg)).map(arg => arg.slice(1,-1)));
    if (references.some(input => !workload.required_inputs.includes(input)) || workload.required_inputs.some(input => !references.includes(input))) error("/workloads/" + workload.id, "Command input references must exactly cover required inputs.");
  }
}

export async function loadExecutionPolicy({ repoRoot, manifest }) {
  const registry = manifest ?? await readStrictYaml(resolve(repoRoot, "system/manifest.yaml"));
  const dataPath = await sourcePath(repoRoot, registry, "execution-policy", "registry");
  const schemaPath = await sourcePath(repoRoot, registry, "execution-policy-schema", "schema");
  const [raw, schemaText] = await Promise.all([readFile(dataPath, "utf8"), readFile(schemaPath, "utf8")]);
  const policy = parseStrictYaml(raw, dataPath);
  const errors = validateExecutionPolicyShape(policy, JSON.parse(schemaText));
  if (errors.length) throw errors[0];
  validateReferences(policy);
  return { ...policy, policy_digest: createHash("sha256").update(raw).digest("hex") };
}
