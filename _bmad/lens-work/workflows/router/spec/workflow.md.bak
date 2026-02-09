---
name: spec
description: Launch Planning phase (PRD/UX/Architecture)
agent: compass
trigger: /spec command
category: router
phase: 2
phase_name: Planning
---

# /spec — Planning Phase Router

**Purpose:** Guide users through the Planning phase, invoking PRD, UX, and Architecture workflows.

---

## Role Authorization

**Authorized:** PO, Architect, Tech Lead

---

## Prerequisites

- [x] `/pre-plan` complete (Phase 1 merged)
- [x] Product Brief exists
- [x] state.yaml + initiatives/{id}.yaml exist
- [x] P1 gate passed (Analysis artifacts committed)

---

## Execution Sequence

### 0. Git Discipline — Verify Clean State

```yaml
# Verify working directory is clean
invoke: casey.verify-clean-state

# Load two-file state
state = load("_bmad-output/lens-work/state.yaml")
initiative = load("_bmad-output/lens-work/initiatives/${state.active_initiative}.yaml")

# Read size from initiative config (shared, canonical)
size = initiative.size
domain_prefix = initiative.domain_prefix

# Validate we're on the correct branch (or can switch)
# Branch pattern: {Domain}/{InitiativeId}/{size}-{phaseNumber}
expected_branch: "${domain_prefix}/${initiative.id}/${size}-2"
current_branch = casey.get-current-branch()

if current_branch != expected_branch:
  if branch_exists(expected_branch):
    invoke: casey.checkout-branch
    params:
      branch: ${expected_branch}
    invoke: casey.pull-latest
  # else: branch will be created in Step 2
```

### 1. Validate Prerequisites & Gate Check

```yaml
# Gate check — verify P1 (Analysis/Pre-Plan) artifacts exist
# Branch pattern: {Domain}/{InitiativeId}/{size}-{phaseNumber}
p1_branch = "${domain_prefix}/${initiative.id}/${size}-1"

if not phase_complete("p1"):
  # Ancestry check: P1 must be merged into size branch
  size_branch = "${domain_prefix}/${initiative.id}/${size}"
  result = casey.exec("git merge-base --is-ancestor origin/${p1_branch} origin/${size_branch}")
  
  if result.exit_code != 0:
    error: "Phase 1 (Analysis) not complete. Run /pre-plan first or merge pending PRs."

# Verify P1 artifacts exist
required_artifacts:
  - "_bmad-output/planning-artifacts/product-brief.md"

for artifact in required_artifacts:
  if not file_exists(artifact):
    warning: "Required artifact not found: ${artifact}. Proceeding but spec quality may suffer."
```

### 2. Start Phase 2 — Auto-Branch Creation

```yaml
# Casey creates P2 branch if it doesn't exist
# Branch pattern: {Domain}/{InitiativeId}/{size}-{phaseNumber}
if not branch_exists("${domain_prefix}/${initiative.id}/${size}-2"):
  invoke: casey.start-phase
  params:
    phase_number: 2
    phase_name: "Planning"
    initiative_id: ${initiative.id}
    size: ${size}
    domain_prefix: ${domain_prefix}
  # Casey creates: ${domain_prefix}/{initiative_id}/{size}-2 and pushes to remote

  invoke: casey.pull-latest
else:
  # Branch exists, ensure we're on it
  invoke: casey.checkout-branch
  params:
    branch: "${domain_prefix}/${initiative.id}/${size}-2"
  invoke: casey.pull-latest
```

### 2a. Constitutional Context Injection (Required)

```yaml
# Resolve constitutional governance for this context before planning workflows
constitutional_context = invoke("scribe.resolve-context")

if constitutional_context.status == "parse_error":
  error: |
    Constitutional context parse error:
    ${constitutional_context.error_details.file}
    ${constitutional_context.error_details.error}

session.constitutional_context = constitutional_context
```

### 2b. Batch Mode (Single-File Questions)

```yaml
if initiative.question_mode == "batch":
  invoke: lens-work.batch-process
  params:
    phase_number: "2"
    phase_name: "Planning"
    template_path: "templates/phase-2-planning-questions.template.md"
    output_filename: "phase-2-planning-questions.md"
  exit: 0
```

### 3. Offer Workflow Options

```
🧭 /spec — Planning Phase

You're starting the Planning phase. Workflows:

**[1] PRD** (required) — Product Requirements Document
**[2] UX Design** (if UI involved) — User experience design
**[3] Architecture** (required) — Technical architecture design

Select workflow(s): [1] [2] [3] [A]ll
```

### 4. Execute Workflows

#### PRD:
```yaml
invoke: casey.start-workflow
params:
  workflow_name: prd

invoke: bmm.create-prd
params:
  product_brief: "_bmad-output/planning-artifacts/product-brief.md"
  output_path: "_bmad-output/planning-artifacts/"
  constitutional_context: ${constitutional_context}

invoke: casey.finish-workflow
```

#### UX (if selected):
```yaml
invoke: casey.start-workflow
params:
  workflow_name: ux-design

invoke: bmm.create-ux-design
params:
  constitutional_context: ${constitutional_context}

invoke: casey.finish-workflow
```

#### Architecture — Technical Spec Generation:
```yaml
invoke: casey.start-workflow
params:
  workflow_name: architecture

# Reference architecture workflow from BMM module
invoke: bmm.create-architecture
params:
  prd: "_bmad-output/planning-artifacts/prd.md"
  product_brief: "_bmad-output/planning-artifacts/product-brief.md"
  output_path: "_bmad-output/planning-artifacts/"
  constitutional_context: ${constitutional_context}

invoke: casey.finish-workflow
```

### 5. Phase Completion + Large Review

```yaml
if all_workflows_complete("p2"):
  invoke: casey.finish-phase
  invoke: casey.open-large-review  # PR: small → large
  
  output: |
    ✅ /spec complete
    ├── Phase 2 (Planning) finished
    ├── Large Review PR opened
    └── Next: Get large review approval, then run /plan
```

### 6. Update State Files

```yaml
# Update initiative file: _bmad-output/lens-work/initiatives/${initiative.id}.yaml
invoke: tracey.update-initiative
params:
  initiative_id: ${initiative.id}
  updates:
    current_phase: "p2"
    current_phase_name: "Planning"
    phases:
      p2:
        status: "in_progress"
        started_at: "${ISO_TIMESTAMP}"
    gates:
      p1_complete:
        status: "passed"
        verified_at: "${ISO_TIMESTAMP}"

# Update state.yaml
invoke: tracey.update-state
params:
  updates:
    current_phase: "p2"
    current_phase_name: "Planning"
    active_branch: "${domain_prefix}/${initiative.id}/${size}-2"
```

### 7. Commit State Changes

```yaml
# Casey commits all state and artifact changes
invoke: casey.commit-and-push
params:
  paths:
    - "_bmad-output/lens-work/state.yaml"
    - "_bmad-output/lens-work/initiatives/${initiative.id}.yaml"
    - "_bmad-output/lens-work/event-log.jsonl"
    - "_bmad-output/planning-artifacts/"
  message: "[lens-work] /spec: Phase 2 Planning — ${initiative.id}"
  branch: "${domain_prefix}/${initiative.id}/${size}-2"
```

### 8. Log Event

```json
{"ts":"${ISO_TIMESTAMP}","event":"spec","id":"${initiative.id}","phase":"p2","workflow":"spec","status":"complete"}
```

---

## Output Artifacts

| Artifact | Location |
|----------|----------|
| PRD | `_bmad-output/planning-artifacts/prd.md` |
| UX Design | `_bmad-output/planning-artifacts/ux-design.md` |
| Architecture | `_bmad-output/planning-artifacts/architecture.md` |
| Initiative State | `_bmad-output/lens-work/initiatives/${id}.yaml` |

---

## Error Handling

| Error | Recovery |
|-------|----------|
| P1 not complete | Error with merge instructions |
| Product brief missing | Warn but allow proceeding |
| Dirty working directory | Prompt to stash or commit changes first |
| Branch creation failed | Check remote connectivity, retry with backoff |
| P1 ancestry check failed | Prompt to merge P1 PR before continuing |
| Architecture workflow failed | Retry or skip with warning |
| State file write failed | Retry (max 3 attempts), then fail with save instructions |

---

## Post-Conditions

- [ ] Working directory clean (all changes committed)
- [ ] On correct branch: `{domain_prefix}/{initiative_id}/{size}-2`
- [ ] state.yaml updated with phase p2
- [ ] initiatives/{id}.yaml updated with p2 status and p1 gate passed
- [ ] event-log.jsonl entry appended
- [ ] Planning artifacts written (PRD, architecture; optionally UX)
- [ ] Large Review PR opened (small → large)
- [ ] All changes pushed to origin
