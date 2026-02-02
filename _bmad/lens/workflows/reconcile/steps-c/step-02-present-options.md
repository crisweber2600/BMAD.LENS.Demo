---
name: 'step-02-present-options'
description: 'Present resolution options'
nextStepFile: './step-03-apply-report.md'
---

# Step 2: Present Options

## Goal
Present clear resolution choices for each conflict with full context, risk assessment, and recommended actions. Capture user decisions for all conflicts before proceeding.

## Instructions

### 1. Build Resolution Options per Conflict Type

**For `remote_mismatch` conflicts:**
```yaml
resolution_options:
  - id: "update_lens"
    label: "Update lens to match target"
    description: "Change lens metadata to use {target_remote}"
    action: "Modify service.yaml git_repo field"
    risk: low
    destructive: false
    preserves_local_work: true
    recommended_when: "Target remote is the correct/authoritative source"
    
  - id: "reset_to_lens"
    label: "Reset target to match lens"
    description: "Re-clone from {lens_remote}, DISCARDING local changes"
    action: "Backup and re-clone repository"
    risk: high
    destructive: true
    preserves_local_work: false
    data_at_risk: 
      - "All uncommitted changes"
      - "{N} local commits not pushed"
    recommended_when: "Target was cloned from wrong source"
    requires_confirmation: "Type 'CONFIRM' to proceed"
    
  - id: "add_remote"
    label: "Add lens remote as secondary"
    description: "Keep both remotes, add lens remote as 'upstream'"
    action: "git remote add upstream {lens_remote}"
    risk: low
    destructive: false
    preserves_local_work: true
    recommended_when: "Working with a fork, need both origins"
    
  - id: "skip"
    label: "Skip (resolve manually later)"
    description: "Leave conflict unresolved"
    action: "No changes"
    risk: none
    destructive: false
```

**For `branch_mismatch` conflicts:**
```yaml
resolution_options:
  - id: "checkout_expected"
    label: "Switch to expected branch"
    description: "Checkout {expected_branch}"
    action: "git checkout {expected_branch}"
    risk: low|medium  # medium if local changes exist
    destructive: false
    precondition: "No uncommitted changes OR stash first"
    
  - id: "update_lens_branch"
    label: "Update lens to current branch"
    description: "Change lens to expect {current_branch}"
    action: "Modify service.yaml branch field"
    risk: low
    destructive: false
    
  - id: "merge_branches"
    label: "Merge expected branch into current"
    description: "Keep current branch, merge in changes from {expected_branch}"
    action: "git merge {expected_branch}"
    risk: medium
    destructive: false
    precondition: "Merge must be possible (no conflicts)"
    
  - id: "skip"
    label: "Skip"
    ...
```

**For `path_collision` conflicts:**
```yaml
resolution_options:
  - id: "rename_in_lens"
    label: "Rename conflicting entry in lens"
    description: "Update lens path for one of the colliding entries"
    action: "Modify service.yaml path field"
    risk: medium
    requires_input: "new_path"
    
  - id: "remove_from_lens"
    label: "Remove duplicate from lens"
    description: "Delete one of the colliding entries"
    action: "Remove entry from service.yaml"
    risk: medium
    
  - id: "skip"
    label: "Skip"
    ...
```

### 2. Present Conflicts Interactively
Display each conflict with full context:

```
════════════════════════════════════════════════════════════════════
CONFLICT 1 of {N}  │  Severity: 🔴 HIGH  │  Type: remote_mismatch
════════════════════════════════════════════════════════════════════

📁 Path: platform/auth/auth-api/

┌─ LENS EXPECTS ─────────────────────────────────────────────────────┐
│ Remote: git@github.com:org/auth-api.git                           │
│ Branch: main                                                       │
└────────────────────────────────────────────────────────────────────┘

┌─ TARGET HAS ───────────────────────────────────────────────────────┐
│ Remote: git@github.com:myuser/auth-api.git                        │
│ Branch: main                                                       │
│ Status: 3 uncommitted files, 5 commits ahead of origin            │
└────────────────────────────────────────────────────────────────────┘

⚠️  WARNING: Target has local work that may be lost with some options.

RESOLUTION OPTIONS:

  [1] Update lens to match target
      → Changes lens metadata, preserves all local work
      ✓ RECOMMENDED for fork workflows
      
  [2] Reset target to lens remote  ⚠️ DESTRUCTIVE
      → Re-clones from org/auth-api, LOSES local commits
      ⚡ 5 commits and 3 files will be lost
      
  [3] Add lens remote as 'upstream'
      → Keeps both, adds git@github.com:org/auth-api.git as upstream
      ✓ RECOMMENDED for contributing back to upstream
      
  [4] Skip (resolve manually)
      → No changes, conflict remains

Enter choice [1-4] or 'details' for more info:
```

### 3. Handle Auto-Resolvable Items
For low-risk, auto-resolvable conflicts, offer batch resolution:

```
════════════════════════════════════════════════════════════════════
AUTO-RESOLVABLE ITEMS ({N} conflicts)
════════════════════════════════════════════════════════════════════

The following conflicts can be resolved automatically with low risk:

  ✓ platform/orders - behind tracking by 3 commits (will: git pull)
  ✓ platform/users - on wrong branch (will: checkout main)
  ✓ business/api - behind tracking by 1 commit (will: git pull)

Apply all auto-resolutions? [y/N/review each]
```

### 4. Capture Resolution Decisions
Build resolution plan:

```yaml
resolution_plan:
  plan_id: "reconcile-{timestamp}"
  created_at: ISO8601
  
  decisions:
    - conflict_id: string
      selected_option: string
      user_input: {...}|null     # for options requiring input
      confirmation_received: boolean|null  # for destructive options
      
  auto_resolutions:
    - conflict_id: string
      resolution: string
      approved: boolean
      
  skipped:
    - conflict_id: string
      reason: "user_skipped"|"no_safe_option"
```

### 5. Validate Resolution Plan
Before applying, verify:

```yaml
plan_validation:
  total_conflicts: N
  resolved: N
  skipped: N
  
  destructive_operations: N
  all_confirmations_received: boolean
  
  estimated_changes:
    lens_files_modified: N
    repos_affected: N
    repos_to_reclone: N
    
  warnings:
    - "3 conflicts skipped - will remain unresolved"
    - "1 repo will be re-cloned (data loss)"
```

### 6. Final Confirmation
Present summary before execution:

```
════════════════════════════════════════════════════════════════════
                    RESOLUTION PLAN SUMMARY
════════════════════════════════════════════════════════════════════

Conflicts resolved: {N} of {total}
Conflicts skipped:  {N}

CHANGES TO BE MADE:

  Lens Metadata:
    • Update git_repo in platform/auth/service.yaml
    • Update branch in business/orders/service.yaml
    
  Target Repositories:
    • git pull in platform/orders/
    • git checkout main in platform/users/
    • RE-CLONE business/legacy/ (⚠️ DESTRUCTIVE)

════════════════════════════════════════════════════════════════════

Apply resolution plan? [y/N]
```

### 7. Store Resolution Plan
Save for Step 3:

**File:** `_memory/bridge-sidecar/resolution-plan.yaml`
```yaml
plan_id: string
status: pending_execution
created_at: ISO8601
decisions: [...]
auto_resolutions: [...]
skipped: [...]
validation: {...}
```

## Edge Cases and Failure Modes

| Condition | Action |
|-----------|--------|
| User chooses destructive option | Require "CONFIRM" input |
| All conflicts skipped | WARN, allow exit without changes |
| Invalid input | Re-prompt with valid options |
| Session timeout | Save partial decisions, allow resume |
| Conflict state changed during selection | Re-validate before Step 3 |

## Output
```yaml
resolution_plan:
  plan_id: string
  status: pending_execution
  
  summary:
    total_conflicts: N
    resolved: N
    auto_resolved: N
    skipped: N
    destructive_ops: N
    
  decisions: [...]
  auto_resolutions: [...]
  skipped: [...]
  
  ready_for_execution: boolean
```
