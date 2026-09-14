# Project entrypoint

Use `README.md` as the project map and source of file responsibilities.

- If the user says «Ознакомься с проектом» or asks to restore/refresh project context, follow the read-only route in `bootstrap/README.md`.
- If the user says «Восстанови рабочую среду проекта» or asks to prepare this project on a new computer, follow the restore route in `bootstrap/README.md`.
- Keep technical email rules and component contracts in the canonical files named by `README.md`; do not duplicate them here or in bootstrap files.
- For this repository, run automated tests, repository validation, and visual regression comparisons locally on a disposable isolated snapshot of the exact cloud commit. Required Figma MCP reads and read-back remain governed by their own workflows. Never start, inspect, or rely on GitHub Actions or PR Checks; GitHub is only the source and PR transport. Historical plans mentioning Actions do not override this rule. If branch protection technically requires a check, report the blocker instead of bypassing it.
