# Project entrypoint

Use `README.md` as the project map and source of file responsibilities.

- If the user says «Ознакомься с проектом» or asks to restore/refresh project context, follow the read-only route in `bootstrap/README.md`.
- If the user says «Восстанови рабочую среду проекта» or asks to prepare this project on a new computer, follow the restore route in `bootstrap/README.md`.
- For other CUPIS email/system requests without an explicit specialization, first use `.agents/skills/cupis-email-task-router/SKILL.md`; it selects only the relevant specialized skill.
- Keep technical email rules and component contracts in the canonical files named by `README.md`; do not duplicate them here or in bootstrap files.
- Execution model, review and verification selection is owned by data/execution/policy.yaml, registered in system/manifest.yaml. After one domain specialization resolves its scope, use its thin execution helper binding; do not load a duplicate model matrix or both skills.
- The coordinator calls actual agents with the helper's explicit model/effort and bounded fork_turns=none briefs. Test PASS and executor confidence never replace independent primary-source acceptance.
- Persistent edits stay in cloud GitHub; exact-SHA disposable snapshots are for verification only. Selected portable checks may use explicitly requested GitHub-hosted verification with bound receipts; disabled/unavailable Actions remains CLOUD_WORKFLOW_NOT_READY. PR Checks do not replace receipts, and branch protection is never bypassed.
- Actual email/images, installed discovery and live application/Figma evidence remain local. Saved profile choices do not collect hardware again; no workload means no profile read. Merge and local skill installation need separate authorization.
