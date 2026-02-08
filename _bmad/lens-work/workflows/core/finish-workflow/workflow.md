---
name: finish-workflow
description: Commit, push, and print PR link
agent: casey
trigger: Compass invokes when workflow completes
category: core
auto_triggered: true
---

# Finish Workflow

**Purpose:** Commit all changes, push workflow branch, and print PR link.

---

## Input Parameters

```yaml
workflow_name: string      # Current workflow from state
commit_message: string     # Optional custom message
```

---

## Execution Sequence

### 0. Validate Branch & Sync

```bash
# Verify we're on a workflow branch
# New pattern: {Domain}/{InitiativeId}/{size}-{phaseNumber}-{workflow}
current_branch=$(git branch --show-current)

# Branch must have at least 3 segments separated by / and the last segment must contain-dashes
# Valid: MyDomain/my-init-abc123/small-1-brainstorm
# Invalid: main, MyDomain/my-init-abc123/base
if [[ ! "$current_branch" =~ ^[^/]+/[^/]+/[a-z]+-[0-9]+-[a-z0-9-]+$ ]]; then
  error "Not on a workflow branch: $current_branch"
  error "Expected pattern: {Domain}/{InitiativeId}/{size}-{phaseNumber}-{workflow}"
  exit 1
fi

# Ensure branch is checked out and up to date
git checkout "$current_branch"
git fetch origin
```

### 1. Stage Changes

```bash
# Stage all changes in BMAD control repo
git add -A
```

### 2. Commit

```bash
# Default message format
commit_msg="${commit_message:-[lens-work] Complete ${workflow_name}}"
git commit -m "${commit_msg}"
```

### 3. Push

```bash
# Push workflow branch
current_branch=$(git branch --show-current)
git push -u origin "${current_branch}"
```

### 4. Generate PR Link

```bash
# Detect remote type
remote_url=$(git remote get-url origin)

# Parse components from new branch pattern: {Domain}/{InitiativeId}/{size}-{phaseNumber}-{workflow}
domain_prefix=$(echo ${current_branch} | cut -d'/' -f1)
initiative_id=$(echo ${current_branch} | cut -d'/' -f2)
branch_segment=$(echo ${current_branch} | cut -d'/' -f3)

# Parse size, phase, workflow from the branch segment (e.g., "small-1-brainstorm")
size=$(echo ${branch_segment} | cut -d'-' -f1)
phase=$(echo ${branch_segment} | cut -d'-' -f2)
workflow=$(echo ${branch_segment} | cut -d'-' -f3-)

# Target is the phase branch (same but without workflow suffix)
target_branch="${domain_prefix}/${initiative_id}/${size}-${phase}"
source_branch="${current_branch}"

# Generate PR link based on remote type
if [[ "$remote_url" == *"github.com"* ]]; then
  pr_link="https://github.com/${org}/${repo}/compare/${target_branch}...${source_branch}"
elif [[ "$remote_url" == *"gitlab.com"* ]]; then
  pr_link="https://gitlab.com/${org}/${repo}/-/merge_requests/new?source_branch=${source_branch}&target_branch=${target_branch}"
elif [[ "$remote_url" == *"dev.azure.com"* ]]; then
  pr_link="https://dev.azure.com/${org}/${project}/_git/${repo}/pullrequestcreate?sourceRef=${source_branch}&targetRef=${target_branch}"
fi
```

### 5. Update State

```yaml
# Update gates in state.yaml
gates:
  - name: "${size}-${phase}-${workflow}"
    status: completed
    completed_at: "${ISO_TIMESTAMP}"
    pr_link: "${pr_link}"

current:
  workflow_status: completed
```

### 6. Log Event

```json
{"ts":"${ISO_TIMESTAMP}","event":"finish-workflow","workflow":"${workflow_name}","pr":"${pr_link}"}
```

### 7. Output

```
✅ Workflow complete: ${workflow_name}
├── Committed: ${commit_hash}
├── Pushed: ${current_branch}
├── PR: ${pr_link}
└── Next: Merge PR, then continue to next workflow
```

---

## Error Handling

| Error | Recovery |
|-------|----------|
| Nothing to commit | Warn but continue (empty workflow) |
| Push rejected | Pull + rebase, then retry |
| Remote type unknown | Output manual PR instructions |
