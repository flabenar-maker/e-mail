// Pure policy evaluation: no filesystem, cache, network, hardware probes or tool calls.
const blocker = (code, path, message) => ({code, path, message});
const nonempty = value => typeof value === "string" && value.trim().length > 0;
function validRuntime(runtime, policy) {
  return runtime?.schema_version === "1.0.0" && runtime.source === policy.runtime_capabilities.source && nonempty(runtime.runtime_session_id) && nonempty(runtime.tool_signature) && Number.isInteger(runtime.max_subagents) && runtime.max_subagents > 0 && Array.isArray(runtime.models) && runtime.models.every(model => nonempty(model.id) && Array.isArray(model.efforts) && model.efforts.every(nonempty) && Array.isArray(model.capabilities) && model.capabilities.every(nonempty)) && new Set(runtime.models.map(model => model.id)).size === runtime.models.length && (runtime.refusals === undefined || Array.isArray(runtime.refusals));
}
function scopePath(path) {
  if (!nonempty(path)) return null;
  const normalized = path.replaceAll("\\", "/").toLowerCase();
  if (normalized.startsWith("/") || /[:\x00-\x1f]/u.test(normalized) || normalized.split("/").some(part => part === ".." || part === "." || part === "")) return null;
  return normalized;
}
function criticalScope(paths, rule) {
  return paths.some(path => (rule.wildcard_scope_is_critical && /[*?\[\]{}]/u.test(path)) || rule.prefixes.some(prefix => path === prefix.replace(/\/$/u, "") || path.startsWith(prefix)) || rule.basenames.includes(path.split("/").at(-1)) || rule.path_fragments.some(fragment => path.includes(fragment)));
}
function refused(candidate, runtime, policy) {
  return (runtime.refusals ?? []).some(refusal => refusal?.runtime_session_id === runtime.runtime_session_id && refusal.tool_signature === runtime.tool_signature && refusal.model === candidate.model && refusal.effort === candidate.effort && policy.runtime_capabilities.typed_refusal_codes.includes(refusal.code));
}
function candidateAtOrAbove(policy, runtime, minimumTier, required) {
  for (const tier of policy.tiers) {
    if (tier.tier < minimumTier) continue;
    for (const candidate of tier.candidates) {
      const available = runtime.models.find(model => model.id === candidate.model);
      if (available && available.efforts.includes(candidate.effort) && required.every(capability => available.capabilities.includes(capability)) && !refused(candidate, runtime, policy)) return {tier:tier.tier, model:candidate.model, effort:candidate.effort};
    }
  }
  return null;
}

export function selectModel({ policy, taskKind, operation, allowedPaths, capabilities }) {
  const result = {status:"blocked", base_tier:null, target_tier:null, executor:null, review:null, safety_ceiling_reached:false, blockers:[]};
  const blocked = (code, path, message) => ({...result, blockers:[blocker(code,path,message)]});
  const rule = Object.hasOwn(policy.task_kinds, taskKind) ? policy.task_kinds[taskKind] : null;
  if (!rule) return blocked("EXECUTION_TASK_KIND_UNKNOWN", "/task_kind", "Task kind is not registered in execution policy.");
  if (!["read", "write"].includes(operation) || !Array.isArray(allowedPaths) || (operation === "write" && !allowedPaths.length) || (rule.mechanical && operation === "write")) return blocked("EXECUTION_TASK_KIND_SCOPE_MISMATCH", "/operation", "Task kind, operation and writable scope do not agree.");
  const paths = allowedPaths.map(scopePath);
  if (paths.some(path => path === null)) return blocked("EXECUTION_TASK_KIND_SCOPE_MISMATCH", "/allowed_paths", "Scope must contain explicit repository-relative paths without traversal.");
  result.base_tier = Math.max(rule.base_tier, operation === "write" && criticalScope(paths, policy.critical_mutations) ? policy.critical_mutations.minimum_base_tier : 1);
  result.target_tier = Math.min(result.base_tier + policy.safety_bump, policy.maximum_tier);
  result.safety_ceiling_reached = result.target_tier === policy.maximum_tier;
  if (!validRuntime(capabilities, policy)) return blocked("MODEL_ROLE_UNAVAILABLE", "/capabilities", "A valid declared-tool snapshot for this runtime is required.");
  const required = [...new Set([...rule.required_capabilities,...policy.operation_capabilities[operation]])];
  result.executor = candidateAtOrAbove(policy, capabilities, result.target_tier, required);
  if (!result.executor) return blocked("MODEL_ROLE_UNAVAILABLE", "/executor", "No permitted model supports the required effort and capabilities.");
  result.safety_ceiling_reached = result.executor.tier === policy.maximum_tier;
  if (rule.mechanical) {
    result.review = {required:true, mode:policy.review.mechanical_mode, primary_sources_required:true};
  } else {
    const tier = Math.min(result.executor.tier + policy.review.reviewer_tier_increment, policy.maximum_tier);
    const reviewer = candidateAtOrAbove(policy, capabilities, tier, required);
    result.review = {required:true, mode:policy.review.semantic_mode, distinct_agent_required:true, primary_sources_required:true, all_requirements_required:true, reviewer};
    if (!reviewer) return blocked("MODEL_ROLE_UNAVAILABLE", "/review/reviewer", "No independent reviewer model supports the required effort and capabilities.");
  }
  return {...result,status:"resolved"};
}
