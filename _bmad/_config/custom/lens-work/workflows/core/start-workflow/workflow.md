---
name: start-workflow
description: Create workflow branch with merge-gate validation
agent: casey
trigger: Compass invokes when user begins a workflow
category: core
auto_triggered: true
---

# Start Workflow

**Purpose:** Create a workflow branch with merge-gate validation.

---

## Input Parameters

```yaml
workflow_name: string      # e.g., "discovery", "brainstorm", "product-brief"
phase: integer             # Phase number: 1, 2, 3, 4
size: string               # e.g., "small", "large" (read from initiative.size)
initiative_id: string      # From state.active_initiative
domain_prefix: string      # From initiative.domain_prefix
```

---

## Execution Sequence

### 1. Load Current State

```yaml
# Read from two-file state architecture
state = load("_bmad-output/lens-work/state.yaml")
initiative = load("_bmad-output/lens-work/initiatives/${state.active_initiative}.yaml")
initiative_id = initiative.id
current_phase = state.current.phase
current_size = initiative.size           # Size from shared initiative config
domain_prefix = initiative.domain_prefix
```

### 2. Validate Merge Gate

```bash
# Get previous workflow in this phase (if any)
previous_workflow=$(get_previous_workflow ${phase} ${workflow_name})

if [ -n "$previous_workflow" ]; then
  # Check if previous workflow is merged into phase branch
  # Branch pattern: {Domain}/{InitiativeId}/{size}-{phaseNumber}
  phase_branch="${domain_prefix}/${initiative_id}/${size}-${phase}"
  workflow_branch="${domain_prefix}/${initiative_id}/${size}-${phase}-${previous_workflow}"
  
  git fetch origin ${phase_branch} ${workflow_branch}
  
  if ! git merge-base --is-ancestor origin/${workflow_branch} origin/${phase_branch}; then
    # GATE BLOCKED
    echo "⚠️ Merge gate blocked"
    echo "├── Expected: ${previous_workflow} merged to phase ${phase}"
    echo "├── Actual: ${previous_workflow} not found in ancestry"
    echo "└── Action: Complete and merge previous workflow first"
    exit 1
  fi
fi
```

### 3. Create Workflow Branch & Push to Remote

```bash
# Branch from phase
# Branch pattern: {Domain}/{InitiativeId}/{size}-{phaseNumber}-{workflow}
phase_branch="${domain_prefix}/${initiative_id}/${size}-${phase}"
workflow_branch="${domain_prefix}/${initiative_id}/${size}-${phase}-${workflow_name}"

git checkout "${phase_branch}"
git pull origin "${phase_branch}"
git checkout -b "${workflow_branch}"

# CRITICAL: Push immediately to ensure remote backup exists
git push -u origin "${workflow_branch}"
```

### 4. Update State

```yaml
# Update _bmad-output/lens-work/state.yaml
current:
  workflow: ${workflow_name}
  workflow_status: in_progress

branches:
  active: "${domain_prefix}/${initiative_id}/${size}-${phase}-${workflow_name}"

gates:
  - name: "${size}-${phase}-${workflow_name}"
    status: in_progress
    started_at: "${ISO_TIMESTAMP}"
```

### 5. Log Event

```json
{"ts":"${ISO_TIMESTAMP}","event":"start-workflow","workflow":"${workflow_name}","branch":"${domain_prefix}/${initiative_id}/${size}-${phase}-${workflow_name}","pushed":true}
```

### 6. Output

```
✅ Workflow branch created & pushed
├── Branch: ${domain_prefix}/${initiative_id}/${size}-${phase}-${workflow_name}
├── Phase: ${phase}
├── Remote: pushed to origin
└── Status: in_progress
```

---

## Error Handling

| Error | Recovery |
|-------|----------|
| Gate blocked | Return block message, do not create branch |
| Branch exists | Checkout existing, warn user |
| Fetch failed | Retry with backoff, then fail gracefully |
