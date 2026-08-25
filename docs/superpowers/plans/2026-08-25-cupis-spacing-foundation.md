# CUPIS Spacing Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Derive, prove and encode one semantic spacing system that exactly explains the current CUPIS email libraries and gives Codex an unambiguous rule for creating future components without giving HTML builds any freedom to choose spacing values.

**Architecture:** This is stage 4A of the structured-system migration. The work starts with a read-only audit of actual Mobile and Desktop geometry in Figma, derives a semantic decision model from evidence, blocks on every unexplained deviation, and only after user approval creates the structured spacing foundation. Design-time may select an exact value through the approved rule; build-time may only consume already-resolved exact values from an active component contract.

**Tech Stack:** GitHub as the only persistent source, Figma MCP for read-only geometry and variable-binding evidence, YAML 1.2, JSON Schema 2020-12, Node.js 22.x, AJV 8.x, `yaml` 2.x, `node:test`.

**Spec:** `docs/superpowers/specs/2026-08-24-cupis-structured-email-system-design.md`

## Global Constraints

- Pin the current `main` SHA at the start of execution and read every GitHub source at that exact SHA.
- Treat Figma file `8zka5bHkcrJVK9I9dKjnhC` as the visual source for actual geometry.
- Audit these library roots completely: Marketing `538:17236`, Service `538:17235`, Shared `539:38025`, Templates `1084:34055`.
- Figma access in Tasks 1–4 is read-only. This plan does not authorize any Figma write.
- Existing Figma geometry is evidence. A deviation from the emerging rule is never silently converted into a token, rule or exception.
- If a current component cannot be explained by the proposed model, stop at the appropriate approval gate and report the exact component, viewport, relationship, value, binding and likely cause.
- Do not infer a shared token or variable from equal pixel values. A Figma variable claim requires an inspected variable binding.
- Mobile and Desktop are audited and resolved independently. Neither viewport inherits spacing from the other.
- Separate outer email rhythm, component inset, internal container padding, stack gap, inline gap, local text gap, asset-to-content gap, fixed geometry offset and optical compensation.
- Do not encode margins of exported images, invisible spacer layers or accidental empty geometry as semantic spacing without explicit evidence.
- Do not change `core/email-figma-prompt.md`, `registry/email-component-descriptions-registry.md`, any Figma Description, component geometry, bundle profile or email-build workflow in this phase.
- Do not migrate component contracts in this phase. The structured component registry remains a later global stage.
- The spacing foundation may describe design-time selection. It must never expose ranges, alternatives or “nearest value” behavior to HTML build-time.
- Build-time resolution is exact-only: each active component viewport must ultimately provide one resolved value for every spacing field it uses.
- Missing, conflicting or unresolved build-time spacing is a typed blocker. Codex must not guess.
- The currently confirmed outer rhythm remains `16px` Mobile and `24px` Desktop unless the complete audit proves that the current design contradicts it and the user approves a separate correction.
- Existing Markdown sources remain the shadow baseline until a separate cutover is approved.
- Publication uses a dedicated `codex/...` branch and a draft PR. Merging remains a separate user decision.

## What “golden rule” means

The golden rule is one deterministic decision process, not one universal pixel value:

1. Identify the relationship being spaced.
2. Identify whether the relationship is outer, container, stack, inline, local text, asset-to-content, fixed geometry or optical compensation.
3. Resolve the viewport independently.
4. Select only a confirmed semantic spacing role supported by current-library evidence.
5. Resolve that role to one exact value.
6. Store the exact result in the component contract.
7. During HTML build, ignore the design-time choice process and use only that stored exact result.

The foundation answers “how may a new component select an exact spacing value?”. The component contract answers “what exact value is used here?”. HTML rendering receives only the second answer.

---

## File Responsibility Map

### Files created during execution

- `docs/superpowers/specs/2026-08-25-cupis-spacing-foundation-design.md`
  - Audited semantic model, confirmed vocabulary, decision tree, compatibility matrix, approved deviations and design-time/build-time boundary.
- `schemas/spacing.schema.json`
  - Strict shape for the structured spacing foundation.
- `data/foundations/spacing.yaml`
  - Canonical spacing roles, exact values, viewport rules, evidence and exception records approved by the user.
- `scripts/lib/spacing-foundation.mjs`
  - Loader, semantic validator and exact design-time resolver for spacing data.
- `tests/foundation/spacing-foundation.test.mjs`
  - Shape, semantic, resolution and blocker tests.
- `tests/characterization/spacing-shadow.test.mjs`
  - Proof that all current spacing facts are represented without changing the Markdown baseline.

### Files modified during execution

- `system/manifest.yaml`
  - Declares the spacing data and schema as shadow sources only.
- `scripts/lib/system-manifest.mjs`
  - Loads and validates the spacing foundation through manifest IDs.
- `scripts/validate-system.mjs`
  - Includes spacing validation in the repository validation command.
- `tests/foundation/system-manifest.test.mjs`
  - Covers spacing source references and failures.
- `tests/foundation/validator-cli.test.mjs`
  - Covers spacing diagnostics from the public validator.
- `README.md`
  - States that spacing has a structured shadow source without changing the active build source.
- `package.json`
  - Changes only if a dedicated spacing test selector is needed; no new dependency is expected.

### Files explicitly preserved

- `core/email-figma-prompt.md`
- `core/figma-component-naming-standard.md`
- `registry/email-component-descriptions-registry.md`
- `registry/email-typography-registry.md`
- `workflows/library-maintenance-checkpoint.md`
- `workflows/email-build-checkpoint.md`
- `data/foundations/typography.yaml`
- `schemas/typography.schema.json`
- all Figma nodes, Descriptions, properties, bindings and geometry
- all concrete email folders, `email.html` files and image assets

---

### Task 1: Freeze the Baseline and Build the Audit Inventory

**Purpose:** Establish one reproducible evidence set before deriving any rule.

**Consumes:**
- Current `main` SHA.
- Canonical GitHub sources from `system/manifest.yaml`.
- Figma roots declared in the registry.

**Produces:**
- Complete list of in-scope production components, nested items, root shells, templates and export-only assets.
- Audit worksheet in working memory with one row per spacing relationship and no inferred semantics.

- [ ] **Step 1: Pin and record the baseline**

Resolve `main`, then fetch at that exact SHA:

```text
README.md
system/manifest.yaml
core/email-figma-prompt.md
core/figma-component-naming-standard.md
registry/email-component-descriptions-registry.md
workflows/library-maintenance-checkpoint.md
docs/superpowers/specs/2026-08-24-cupis-structured-email-system-design.md
```

Stop if any source is missing. Do not substitute local files.

- [ ] **Step 2: Enumerate every auditable Figma object**

Read the four roots and classify every relevant descendant as:

```text
production-component
nested-item
root-shell
assembly-template
example
export-asset
```

Examples and export assets may provide context but must not create layout spacing contracts unless their own geometry participates in HTML.

- [ ] **Step 3: Capture actual spacing facts**

For every Mobile and Desktop variant, record:

```text
figma_file_key
node_id
component_name
semantic_role
viewport
parent_node_id
relationship_path
layout_mode
padding_top
padding_right
padding_bottom
padding_left
item_spacing
counter_axis_spacing when present
alignment
sizing_mode
bound_variable_name for each inspected field
literal_value when no binding exists
source_description_value
registry_value
```

Record values as observed. Do not classify equal numbers as the same role.

- [ ] **Step 4: Separate spacing from non-spacing geometry**

Mark each fact as one of:

```text
layout-spacing
fixed-size
alignment
exported-empty-area
visual-compensation-candidate
unknown
```

Export crop, image dimensions, border radius and typography metrics are not spacing tokens.

- [ ] **Step 5: Verify inventory completeness**

Every active component heading in `registry/email-component-descriptions-registry.md` must map to an audited Figma object or to an explicit non-layout reason. Report missing, renamed and unregistered objects before continuing.

**Checkpoint 1:** Present the inventory count by library, viewport and relationship type. No rule or token proposal is allowed yet.

---

### Task 2: Classify Relationships Before Looking for a Scale

**Purpose:** Explain what each current distance does before grouping numeric values.

**Consumes:**
- Task 1 audit worksheet.

**Produces:**
- Candidate semantic relationship map with evidence citations.
- Explicit list of values that cannot yet be classified.

- [ ] **Step 1: Classify each relationship**

Use the smallest vocabulary that explains the evidence:

```text
email-outer-flow
email-horizontal-inset
component-container-padding
component-section-stack
repeated-item-stack
inline-peer-gap
text-stack
asset-to-content
control-content
fixed-geometry-offset
optical-compensation
```

A new class may be proposed only when no existing class accurately expresses the relationship across the audited components.

- [ ] **Step 2: Distinguish ownership**

For every relationship, identify exactly one owner:

```text
email shell
top-level component root
component content container
nested component
repeated-item parent
text group
interactive control
asset owner
```

Reject double ownership such as `email-padding` plus a repeated component inset.

- [ ] **Step 3: Compare Mobile and Desktop independently**

Create explicit Mobile and Desktop observations for each semantic relationship. Do not write `base + override`; record two complete outcomes.

- [ ] **Step 4: Group evidence without promoting tokens**

For each candidate semantic role, list all observed exact values and every supporting component. Equal numbers remain separate observations until their role, ownership and binding also agree.

- [ ] **Step 5: Isolate unexplained deviations**

For each deviation, report:

```text
component and node
viewport
relationship
observed value
expected pattern
binding or literal status
whether the difference looks structural, optical or accidental
affected descriptions and future contracts
```

Do not resolve the deviation automatically.

**Checkpoint 2:** User decides each deviation: confirmed semantic pattern, approved optical compensation, or candidate Figma correction handled in a separate task.

---

### Task 3: Design the Golden Rule and the Exact-Only Boundary

**Purpose:** Convert confirmed evidence into one deterministic creation rule without introducing ambiguity during HTML rendering.

**Consumes:**
- Approved classifications and deviation decisions from Task 2.

**Produces:**
- `docs/superpowers/specs/2026-08-25-cupis-spacing-foundation-design.md`.

- [ ] **Step 1: Write the decision tree for new components**

The design document must require this order:

```text
relationship → owner → viewport → semantic role → exact value → component contract
```

The decision tree must state when a relationship is not represented and therefore requires a foundation extension rather than an improvised value.

- [ ] **Step 2: Define design-time behavior**

Design-time may:

- inspect the new component structure;
- match a confirmed semantic role;
- resolve one exact value for each viewport;
- propose a new universal role only when existing roles cannot express the relationship;
- return a blocker when evidence is insufficient.

Design-time may not:

- choose the nearest numeric value;
- choose from a range;
- infer a token from a matching number;
- create a one-component schema exception;
- silently reuse Desktop spacing on Mobile.

- [ ] **Step 3: Define build-time behavior**

Build-time receives only resolved component fields. It must:

```text
return one exact integer pixel value
or
return a typed unresolved-spacing blocker
```

It must not receive candidate values, allowed sets, selection recommendations, confidence scores or design-time decision branches.

- [ ] **Step 4: Define exception handling**

An approved exception must contain:

```text
stable exception ID
component ID or future component reference
viewport
relationship path
exact value
reason category
human-approved rationale
evidence node ID
```

A missing rationale, generic “visual” reason or numerical mismatch alone is invalid.

- [ ] **Step 5: Define the foundation-to-component interface**

The spacing foundation exposes:

```text
resolveDesignSpacing(role_id, viewport) -> exact value or typed blocker
```

The future component registry stores the returned exact value plus the foundation reference. The future HTML bundle exposes only the exact component value.

- [ ] **Step 6: Self-review the audited design document**

Check for:

- every term having one meaning;
- no range-based build behavior;
- no Mobile/Desktop inheritance;
- no current deviation omitted;
- no Figma mutation authorization;
- no duplicated component contracts;
- no asset or typography rules added.

**Checkpoint 3:** User reviews and approves the audited spacing design document before any schema or canonical data is created.

---

### Task 4: Prove the Rule Against the Entire Current Library

**Purpose:** Demonstrate that the golden rule does not contradict any current design.

**Consumes:**
- Approved spacing design document.
- Task 1 evidence.

**Produces:**
- A complete compatibility matrix embedded in the spacing design document.
- Zero unexplained current spacing relationships.

- [ ] **Step 1: Resolve every audited relationship**

For each audited row, apply:

```text
relationship classification
→ owner
→ viewport
→ semantic role or approved exception
→ exact current value
```

- [ ] **Step 2: Require 100% explainability**

The proof passes only when every current layout-spacing row is one of:

```text
confirmed semantic role
approved optical compensation
approved component-specific exception
non-spacing geometry
```

`unknown` is a failure, not a valid final category.

- [ ] **Step 3: Test representative future-component scenarios**

Apply the rule without editing Figma to these synthetic structures:

1. common padded content block;
2. full-width banner with internal content padding;
3. self-inset block;
4. icon plus text item;
5. repeated vertical card list;
6. text group with heading, body and optional caption;
7. interactive control with icon and live HTML text;
8. parent block containing a nested alert;
9. Mobile vertical composition paired with Desktop horizontal composition.

Each scenario must resolve exact Mobile and Desktop values or produce a precise “new universal relationship required” blocker.

- [ ] **Step 4: Recheck global invariants**

Confirm that the model preserves:

- one outer top spacing per top-level component;
- `16px` Mobile and `24px` Desktop outer rhythm where currently defined;
- no duplicated common horizontal inset;
- no external spacing on nested items;
- independent Mobile/Desktop resolution.

**Checkpoint 4:** If any current relationship cannot be explained, return to Task 2. Do not weaken the rule to make the test pass.

---

### Task 5: Specify the Structured Spacing Contract with Tests First

**Purpose:** Encode the approved model without mixing current component records into the foundation.

**Files:**
- Create: `tests/foundation/spacing-foundation.test.mjs`
- Create: `schemas/spacing.schema.json`
- Create: `data/foundations/spacing.yaml`

**Interfaces:**
- Consumes: approved design document.
- Produces: strict spacing document shape and canonical data.

- [ ] **Step 1: Write failing schema tests**

Tests must reject:

```text
unknown top-level keys
duplicate semantic role IDs
non-integer or negative pixel values
missing Mobile or Desktop resolution when the role applies to both
a range instead of an exact value
an allowed-values array in a build-facing field
a variable claim without binding provenance
an exception without component, viewport, relationship and rationale
an unresolved current-library observation
```

Run:

```powershell
node --test tests/foundation/spacing-foundation.test.mjs
```

Expected: failure because the schema and data do not exist.

- [ ] **Step 2: Create the strict JSON Schema**

The schema must require:

```text
schema_version
foundation.id
foundation.status
viewports
roles
global_invariants
exceptions
provenance
```

Each role must carry semantic purpose, ownership, applicability, exact viewport resolution and evidence. Do not place component-specific layout contracts in `roles`.

- [ ] **Step 3: Create the canonical YAML foundation**

Populate only values and roles proven in Tasks 1–4. Keep exact Figma variable names where bindings were inspected; store `literal` provenance where no binding exists.

- [ ] **Step 4: Run shape tests**

Run:

```powershell
node --test tests/foundation/spacing-foundation.test.mjs
```

Expected: shape tests pass; semantic resolver tests remain absent until Task 6.

- [ ] **Step 5: Commit the schema-and-data slice**

Commit message:

```text
feat: add structured spacing contract
```

---

### Task 6: Implement Semantic Validation and Deterministic Resolution

**Purpose:** Enforce the golden rule mechanically and prevent HTML-facing ambiguity.

**Files:**
- Create: `scripts/lib/spacing-foundation.mjs`
- Modify: `tests/foundation/spacing-foundation.test.mjs`

**Interfaces:**
- Produces:
  - `loadSpacingFoundation({ rootDir, manifest })`
  - `validateSpacingFoundation(document)`
  - `resolveDesignSpacing(document, { roleId, viewport })`
- Returns one exact integer from `resolveDesignSpacing` or throws a diagnostic with a stable spacing error code.

- [ ] **Step 1: Add failing semantic tests**

Cover stable diagnostics for:

```text
SPACING_DUPLICATE_ROLE_ID
SPACING_UNKNOWN_VIEWPORT
SPACING_NON_EXACT_VALUE
SPACING_UNRESOLVED_ROLE
SPACING_INVALID_BINDING_PROVENANCE
SPACING_INVALID_EXCEPTION
SPACING_BUILD_CHOICE_FORBIDDEN
```

- [ ] **Step 2: Add exact resolver tests**

Assert:

```javascript
assert.equal(
  resolveDesignSpacing(document, {
    roleId: "confirmed-role-id",
    viewport: "mobile"
  }),
  expectedExactInteger
);
```

Also assert that missing and ambiguous resolution throws rather than selecting a value.

- [ ] **Step 3: Implement the loader and validator**

Use the existing strict YAML and schema-validation boundaries. Do not add a second parser or validator stack.

- [ ] **Step 4: Implement exact design-time resolution**

The resolver accepts one role ID and one viewport. It never accepts an array of candidate values, “closest” option, fallback viewport or default pixel value.

- [ ] **Step 5: Run focused and complete tests**

Run:

```powershell
node --test tests/foundation/spacing-foundation.test.mjs
npm test
```

Expected: all tests pass.

- [ ] **Step 6: Commit the semantic slice**

Commit message:

```text
feat: validate spacing semantics
```

---

### Task 7: Add Shadow Equivalence for Current Design Facts

**Purpose:** Prove that structured spacing represents the current system without replacing its active Markdown owners.

**Files:**
- Create: `tests/characterization/spacing-shadow.test.mjs`

**Interfaces:**
- Consumes:
  - `data/foundations/spacing.yaml`
  - `core/email-figma-prompt.md`
  - `registry/email-component-descriptions-registry.md`
  - approved compatibility matrix
- Produces: parity and preservation tests.

- [ ] **Step 1: Characterize the global outer rhythm**

Parse and assert the currently documented exact outer values:

```text
Mobile: 16px
Desktop: 24px
```

- [ ] **Step 2: Characterize every spacing observation used as evidence**

For each current component observation represented by the approved matrix, verify that the structured role or approved exception resolves to the same exact value for the same viewport and relationship.

- [ ] **Step 3: Assert separation of concerns**

Tests must prove that:

- foundation roles contain no component Description prose;
- component-specific exceptions do not become global defaults;
- no build-facing representation contains multiple allowed values;
- typography and asset foundations are unchanged.

- [ ] **Step 4: Run characterization and full tests**

Run:

```powershell
node --test tests/characterization/spacing-shadow.test.mjs
npm test
```

Expected: all tests pass.

- [ ] **Step 5: Commit the parity slice**

Commit message:

```text
test: prove spacing shadow equivalence
```

---

### Task 8: Integrate Spacing into the Manifest Without Cutover

**Purpose:** Make the spacing foundation discoverable and validated while preserving existing runtime behavior.

**Files:**
- Modify: `system/manifest.yaml`
- Modify: `scripts/lib/system-manifest.mjs`
- Modify: `scripts/validate-system.mjs`
- Modify: `tests/foundation/system-manifest.test.mjs`
- Modify: `tests/foundation/validator-cli.test.mjs`

- [ ] **Step 1: Write failing manifest integration tests**

Require exactly these new source IDs:

```text
spacing-foundation → data/foundations/spacing.yaml
spacing-schema → schemas/spacing.schema.json
```

Assert that missing files, wrong kinds and duplicate IDs fail.

- [ ] **Step 2: Write failing CLI diagnostic tests**

Assert that a malformed spacing fixture causes `npm run validate` to fail with a stable spacing diagnostic and source path.

- [ ] **Step 3: Add manifest sources atomically**

Add the data and schema entries in the same commit. Do not add the spacing source to email-build bundle profiles in this phase.

- [ ] **Step 4: Integrate the spacing validator**

Resolve the source through manifest IDs and run shape plus semantic validation from the public validation command.

- [ ] **Step 5: Run all validation**

Run:

```powershell
npm run validate
npm test
npm run verify
```

Expected: all commands pass.

- [ ] **Step 6: Commit manifest integration**

Commit message:

```text
feat: register spacing foundation in shadow mode
```

---

### Task 9: Document Ownership and Preserve the Migration Boundary

**Purpose:** Tell humans where spacing now lives without prematurely changing active instructions or build behavior.

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Add the shadow-source note**

Document plainly:

- structured spacing is the canonical machine-readable shadow foundation;
- existing prompt and component registry remain active baselines until component contracts and build bundles migrate;
- design-time uses the approved golden rule;
- build-time requires exact component values;
- missing exact values are blockers.

- [ ] **Step 2: State what is not yet active**

Explicitly state that this phase does not:

- change Figma;
- change component Descriptions;
- migrate component contracts;
- switch context bundles;
- change HTML output.

- [ ] **Step 3: Run preservation checks**

Confirm unchanged blobs for every file listed under “Files explicitly preserved”, except `README.md`, which is intentionally modified.

- [ ] **Step 4: Commit documentation**

Commit message:

```text
docs: document spacing foundation ownership
```

---

### Task 10: Final Verification and Draft Pull Request

**Purpose:** Publish only a complete, reviewable spacing foundation.

- [ ] **Step 1: Re-read all changed files from the branch**

Verify the branch versions of:

```text
docs/superpowers/specs/2026-08-25-cupis-spacing-foundation-design.md
schemas/spacing.schema.json
data/foundations/spacing.yaml
scripts/lib/spacing-foundation.mjs
tests/foundation/spacing-foundation.test.mjs
tests/characterization/spacing-shadow.test.mjs
system/manifest.yaml
scripts/lib/system-manifest.mjs
scripts/validate-system.mjs
tests/foundation/system-manifest.test.mjs
tests/foundation/validator-cli.test.mjs
README.md
```

- [ ] **Step 2: Run clean verification**

Run:

```powershell
npm ci
npm run validate
npm test
npm run verify
```

Record actual command output and test counts.

- [ ] **Step 3: Verify the allowed diff**

The final implementation PR may contain only the files declared in this plan. Confirm there are no Figma writes, local email outputs, generated snapshots, archives or unrelated changes.

- [ ] **Step 4: Verify the exact-only invariant**

Search the spacing schema, data, resolver and tests. Confirm that build-facing output cannot contain:

```text
range
min/max spacing choice
allowed_values
candidate_values
nearest value
viewport fallback
```

Design-time evidence collections may list observed values, but the resolver must still return exactly one integer or a blocker.

- [ ] **Step 5: Open a draft PR**

The PR description must include:

- pinned base SHA;
- audited Figma roots;
- inventory totals;
- approved deviations;
- exact-only design/build boundary;
- commands and results;
- unchanged Figma statement;
- preserved active Markdown/bundle statement;
- remaining dependency on the future component-registry stage.

Stop after opening the draft PR. Do not merge without separate authorization.

---

## Progress Checkpoints

Use this compact status list during the long task:

- [ ] 1. Baseline pinned and full library inventory complete
- [ ] 2. Relationships classified; deviations reviewed by user
- [ ] 3. Golden rule and exact-only boundary approved
- [ ] 4. Rule proves 100% compatibility with current design
- [ ] 5. Spacing schema and canonical YAML created
- [ ] 6. Semantic validator and exact resolver pass
- [ ] 7. Shadow equivalence passes
- [ ] 8. Manifest integration passes without bundle cutover
- [ ] 9. Ownership documented; preserved files verified
- [ ] 10. Draft PR verified and ready for separate merge decision

## Completion Criteria

The spacing phase is complete only when all statements are true:

- Every current Mobile and Desktop spacing relationship is explained by a confirmed semantic role, approved optical compensation, approved exception or non-spacing classification.
- No unexplained deviation remains.
- The golden rule gives a deterministic design-time path for a new component.
- Build-time receives one exact value per component field and viewport, never a set of acceptable values.
- Missing or conflicting values fail with typed diagnostics.
- Structured spacing data and schema validate through the repository manifest.
- Existing prompt, registry, component Descriptions, Figma geometry and bundle profiles remain unchanged.
- No asset, typography or component-registry migration is mixed into this phase.
- The draft PR contains only the approved spacing-foundation scope.

## Plan Self-Review

- [x] The plan is stage 4A of the master migration and does not duplicate the completed typography pilot.
- [x] Evidence gathering precedes naming, tokenization and documentation.
- [x] Equal numbers cannot create tokens without semantic and binding evidence.
- [x] Mobile and Desktop are independent.
- [x] Current-design compatibility requires 100% explainability.
- [x] Deviations require an explicit user decision.
- [x] Design-time choice and build-time exact execution are mechanically separated.
- [x] Existing HTML behavior and Figma design remain untouched in this phase.
- [x] Component registry and bundle cutover remain later global stages.
- [x] The plan contains no unresolved placeholder.
