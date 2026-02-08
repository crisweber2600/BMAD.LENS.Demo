---
name: pre-plan
description: Launch Analysis phase (brainstorm/research/product brief)
agent: compass
trigger: /pre-plan command
category: router
phase: 1
phase_name: Analysis
---

# /pre-plan — Analysis Phase Router

**Purpose:** Guide users through the Analysis phase, invoking brainstorming, research, and product brief workflows.

---

## Role Authorization

**Authorized:** PO, Architect, Tech Lead

```yaml
# Advisory check (logged, not blocking)
if user_role not in ["PO", "Architect", "Tech Lead"]:
  log_warning("Role ${user_role} typically doesn't initiate /pre-plan")
```

---

## Prerequisites

- [x] Initiative created via `#new-*` command
- [x] Layer detected with confidence ≥ 75%
- [x] state.yaml exists with active initiative
- [x] Initiative file exists at `_bmad-output/lens-work/initiatives/{id}.yaml`

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
# New branch pattern: {Domain}/{InitiativeId}/{size}-{phaseNumber}
expected_branch: "${domain_prefix}/${initiative.id}/${size}-1"
current_branch = casey.get-current-branch()

if current_branch != expected_branch:
  if branch_exists(expected_branch):
    invoke: casey.checkout-branch
    params:
      branch: ${expected_branch}
  # else: branch will be created in Step 2
```

### 1. Validate State & Constitution

```yaml
# Check active initiative
if state.active_initiative == null:
  error: "No active initiative. Run #new-domain, #new-service, or #new-feature first."

# Constitution enforcement — verify required fields
required_fields: [name, layer, target_repos]
for field in required_fields:
  if initiative.${field} == null or initiative.${field} == "":
    error: "Initiative missing required field: ${field}. Re-run #new-* to fix."

# Phase check
if initiative.current_phase not in [null, "p1"]:
  warning: "Current phase is ${initiative.current_phase}. /pre-plan is for Phase 1."
```

### 1a. Constitutional Context Injection (Required)

```yaml
# Resolve constitutional governance for the active initiative context
constitutional_context = invoke("scribe.resolve-context")

# Parse errors are hard failures because governance cannot be evaluated
if constitutional_context.status == "parse_error":
  error: |
    Constitutional context parse error:
    ${constitutional_context.error_details.file}
    ${constitutional_context.error_details.error}

# Make constitutional context available to downstream workflows
session.constitutional_context = constitutional_context
```

### 1b. Discovery Validation

```yaml
# Check that repo-discover has been run for target repos
for repo in initiative.target_repos:
  inventory_path = "_bmad-output/lens-work/repo-inventory.yaml"
  inventory = load(inventory_path)
  
  if repo not in inventory.repos:
    warning: |
      ⚠️ Discovery not run for repo: ${repo}
      Run @scout discover for better analysis context.
      Proceeding without discovery data.
```

### 2. Start Phase (if needed)

```yaml
# Invoke Casey if small-1 branch doesn't exist — auto-branch creation
# Branch pattern: {Domain}/{InitiativeId}/{size}-{phaseNumber}
if not branch_exists("${domain_prefix}/${initiative.id}/${size}-1"):
  invoke: casey.start-phase
  params:
    phase_number: 1
    phase_name: "Analysis"
    initiative_id: ${initiative.id}
    size: ${size}
    domain_prefix: ${domain_prefix}
  # Casey creates: ${domain_prefix}/{initiative_id}/{size}-1 and pushes to remote

  # Pull latest after branch creation
  invoke: casey.pull-latest
```

### 2a. Batch Mode (Single-File Questions)

```yaml
if initiative.question_mode == "batch":
  invoke: lens-work.batch-process
  params:
    phase_number: "1"
    phase_name: "Analysis"
    template_path: "templates/phase-1-analysis-questions.template.md"
    output_filename: "phase-1-analysis-questions.md"
  exit: 0
```

### 3. Offer Workflow Options

```
🧭 /pre-plan — Analysis Phase

You're starting the Analysis phase. Available workflows:

**[1] Brainstorming** (optional) — Creative exploration with CIS
**[2] Research** (optional) — Deep dive research with CIS  
**[3] Product Brief** (required) — Define problem, vision, and scope

Recommended path: 1 → 2 → 3 (or skip to 3 if you have clarity)

Select workflow(s) to run: [1] [2] [3] [A]ll [S]kip to Product Brief
```

### 4. Execute Selected Workflows

#### If Brainstorming selected:
```yaml
invoke: casey.start-workflow
params:
  workflow_name: brainstorm

invoke: cis.brainstorming  # CIS module workflow
params:
  context: "${initiative.name} at ${initiative.layer} layer"
  constitutional_context: ${constitutional_context}

invoke: casey.finish-workflow
```

#### If Research selected:
```yaml
invoke: casey.start-workflow
params:
  workflow_name: research

invoke: cis.research  # CIS module workflow
params:
  constitutional_context: ${constitutional_context}

invoke: casey.finish-workflow
```

#### Product Brief (always):
```yaml
invoke: casey.start-workflow
params:
  workflow_name: product-brief

invoke: bmm.product-brief  # BMM module workflow
params:
  output_path: "_bmad-output/planning-artifacts/"
  constitutional_context: ${constitutional_context}

invoke: casey.finish-workflow
```

### 5. Phase Completion Check

```yaml
if all_workflows_complete("p1"):
  invoke: casey.finish-phase
  
  output: |
    ✅ /pre-plan complete
    ├── Phase 1 (Analysis) finished
    ├── Artifacts: product-brief.md
    └── Next: Run /spec to continue to Planning phase
```

### 6. Update State Files

```yaml
# Update initiative file: _bmad-output/lens-work/initiatives/${initiative.id}.yaml
invoke: tracey.update-initiative
params:
  initiative_id: ${initiative.id}
  updates:
    current_phase: "p1"
    current_phase_name: "Analysis"
    phases:
      p1:
        status: "in_progress"
        started_at: "${ISO_TIMESTAMP}"

# Update state.yaml
invoke: tracey.update-state
params:
  updates:
    current_phase: "p1"
    current_phase_name: "Analysis"
    active_branch: "${domain_prefix}/${initiative.id}/${size}-1"
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
  message: "[lens-work] /pre-plan: Phase 1 Analysis — ${initiative.id}"
  branch: "${domain_prefix}/${initiative.id}/${size}-1"
```

### 8. Log Event

```json
{"ts":"${ISO_TIMESTAMP}","event":"pre-plan","id":"${initiative.id}","phase":"p1","workflow":"pre-plan","status":"complete"}
```

### 9. Offer Next Step

```
Ready to continue?

**[C]** Continue to /spec (Planning phase)
**[P]** Pause here (resume later with @compass /spec)
**[S]** Show status (@tracey ST)
```

---

## Output Artifacts

| Artifact | Location |
|----------|----------|
| Product Brief | `_bmad-output/planning-artifacts/product-brief.md` |
| Brainstorm Notes | `_bmad-output/planning-artifacts/brainstorm-notes.md` |
| Research Summary | `_bmad-output/planning-artifacts/research-summary.md` |
| Initiative State | `_bmad-output/lens-work/initiatives/${id}.yaml` |

---

## Error Handling

| Error | Recovery |
|-------|----------|
| No initiative | Prompt to run #new-* first |
| Wrong phase | Warn but allow override |
| CIS not installed | Skip brainstorm/research, proceed to product brief |
| Dirty working directory | Prompt to stash or commit changes first |
| Missing constitution fields | Error with specific field name, prompt #new-* rerun |
| Discovery not run | Warn but allow proceeding (non-blocking) |
| Branch creation failed | Check remote connectivity, retry with backoff |
| State file write failed | Retry (max 3 attempts), then fail with save instructions |

---

## Post-Conditions

- [ ] Working directory clean (all changes committed)
- [ ] On correct branch: `{domain_prefix}/{initiative_id}/{size}-1`
- [ ] state.yaml updated with phase p1
- [ ] initiatives/{id}.yaml updated with p1 status
- [ ] event-log.jsonl entry appended
- [ ] Planning artifacts written (at minimum product-brief.md)
- [ ] All changes pushed to origin
