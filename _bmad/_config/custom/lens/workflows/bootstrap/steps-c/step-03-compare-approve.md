---
name: 'step-03-compare-approve'
description: 'Compare lens map to target structure and request approval'
nextStepFile: './step-04-execute-report.md'
---

# Step 3: Compare & Approve

## Goal
Identify gaps between the lens map and target structure, generate a detailed sync plan, and obtain explicit user approval before making any changes.

## Instructions

### 1. Generate Comparison Matrix
Cross-reference `lens_map` with `target_structure`:

```yaml
comparison_matrix:
  domains:
    - name: string
      lens_path: string
      target_status: exists|missing
      services: [...]
  
  services:
    - domain: string
      name: string
      lens_path: string
      target_status: exists|missing
      microservices: [...]
  
  microservices:
    - domain: string
      service: string
      name: string
      lens_path: string
      lens_git_repo: string|null
      target_status: exists_matches|exists_different_remote|exists_no_repo|missing
      target_git_repo: string|null  # if exists
      action_required: none|create_folder|clone_repo|update_remote|manual_review
```

### 2. Classify Actions Required
For each microservice entry, determine required action:

**GUARDRAIL:** All clone operations MUST target paths within `TargetProjects/`. Verify each target path before adding to action list.

| Target Status | Has git_repo in lens | Action |
|--------------|---------------------|--------|
| missing | yes | `clone_repo` (will create folder + clone into TargetProjects) |
| missing | no | `create_folder` (empty structure within TargetProjects) |
| exists_no_repo | yes | `clone_into_existing` (git init + set remote) |
| exists_no_repo | no | `none` (folder exists, no repo expected) |
| exists_matches | yes/no | `none` (already synced) |
| exists_different_remote | yes | `manual_review` (conflict) |
| exists_wrong_branch | yes | `checkout_branch` (switch to correct branch) |

**Branch enforcement:** For each repo with a `branch` defined in `service.yaml`, the sync plan must include branch checkout verification.

### 3. Build Sync Plan
Aggregate actions into executable plan:

**GUARDRAIL VERIFICATION:** Before finalizing plan, verify:
- All `target_path` entries are under `{target_projects_path}/`
- All repos have explicit `branch` values (no implicit defaults)

```yaml
sync_plan:
  plan_id: "bootstrap-{timestamp}"
  generated_at: ISO8601
  target_projects_path: string  # Root for all clone operations
  
  summary:
    folders_to_create: N
    repos_to_clone: N
    branches_to_checkout: N
    manual_reviews: N
    already_synced: N
  
  guardrails:
    all_paths_under_target_projects: true  # MUST be true to proceed
    all_branches_explicit: true             # MUST be true to proceed
  
  actions:
    create_folders:
      - path: string                        # Must be under target_projects_path
        reason: "Domain folder for {domain}"
      - path: string
        reason: "Service folder for {service}"
      - path: string
        reason: "Microservice folder for {microservice}"
    
    clone_repos:
      - target_path: string                 # Must be under target_projects_path
        git_repo: string
        branch: string                      # REQUIRED - no default branch fallback
        depth: shallow|full                 # shallow for large repos
        reason: "Clone {microservice} from {repo}"
        post_clone_verify:
          - "git rev-parse --abbrev-ref HEAD == {branch}"
          - "git remote get-url origin == {git_repo}"
    
    checkout_branches:
      - target_path: string
        expected_branch: string
        current_branch: string              # detected during scan
        reason: "Switch to {expected_branch} from {current_branch}"
    
    manual_reviews:
      - path: string
        issue: "Remote mismatch"|"Branch mismatch"
        lens_expects: string
        target_has: string
        options:
          - "Update lens to match target"
          - "Re-clone with lens settings (DESTRUCTIVE)"
          - "Skip and resolve manually"
  
  execution_order:
    1. Validate all paths are within TargetProjects (ABORT if not)
    2. Create domain folders (top-level)
    3. Create service folders (within domains)
    4. Clone microservice repos (within services)
    5. Checkout correct branches for all cloned repos
    6. Verify branch checkout success
    7. Report manual review items
  
  estimated_time: "~N minutes"
  estimated_disk_space: "~N MB"
```

### 4. Conflict Detection
Identify situations requiring human judgment:

**Conflict types:**
- `remote_mismatch`: Existing repo has different origin URL
- `branch_mismatch`: Existing repo on different branch than expected (from `service.yaml`)
- `branch_undefined`: `service.yaml` entry missing required `branch` field
- `dirty_repo`: Existing repo has uncommitted changes
- `path_collision`: Two lens entries resolve to same target path
- `orphan_in_path`: Unlisted files exist where clone would occur
- `path_outside_target_projects`: Target path escapes TargetProjects boundary (BLOCKING)

**For each conflict:**
```yaml
conflicts:
  - id: "conflict-{N}"
    type: string
    path: string
    details:
      expected: string
      actual: string
    risk_level: low|medium|high
    resolution_options:
      - id: "opt-1"
        label: string
        action: string
        destructive: boolean
```

### 5. Present Sync Plan for Approval
Display to user with clear formatting:

```
╔══════════════════════════════════════════════════════════════════╗
║                    BOOTSTRAP SYNC PLAN                           ║
╠══════════════════════════════════════════════════════════════════╣
║ Folders to create:  {N}                                          ║
║ Repositories to clone: {N}                                       ║
║ Manual reviews needed: {N}                                       ║
║ Already synced: {N}                                              ║
╠══════════════════════════════════════════════════════════════════╣
║ Estimated time: ~{N} minutes                                     ║
║ Estimated disk space: ~{N} MB                                    ║
╚══════════════════════════════════════════════════════════════════╝

FOLDERS TO CREATE:
  ✓ platform/                          (Domain)
  ✓ platform/auth/                     (Service)
  ✓ platform/auth/auth-api/            (Microservice)
  ...

REPOS TO CLONE (into TargetProjects/):
  ⬇ platform/auth/auth-api/  ← git@github.com:org/auth-api.git
    └─ Branch: main (will checkout after clone)
  ⬇ platform/auth/auth-ui/   ← git@github.com:org/auth-ui.git
    └─ Branch: develop (will checkout after clone)
  ...

MANUAL REVIEW REQUIRED:
  ⚠ business/payments/gateway/ - Remote mismatch
    Expected: git@github.com:org/gateway.git
    Found:    git@github.com:fork/gateway.git
    [1] Update lens  [2] Re-clone (destructive)  [3] Skip

──────────────────────────────────────────────────────────────────
Proceed with sync plan? [y/N/review details]
```

### 6. Capture Approval and Selections
If conflicts exist, capture resolution selection for each:

```yaml
approval_record:
  approved: boolean
  approved_at: ISO8601
  conflict_resolutions:
    - conflict_id: string
      selected_option: string
      user_note: string (optional)
  
  modifications:                       # if user requested changes
    - action_id: string
      modification: skip|defer|custom
```

### 7. Store Sync Plan in Sidecar
Persist for execution and audit:

**File:** `_memory/bridge-sidecar/pending-sync-plan.yaml`
```yaml
plan_id: string
status: pending_approval|approved|executing|completed|failed
created_at: ISO8601
approved_at: ISO8601|null
sync_plan: {...}
approval_record: {...}
```

## Edge Cases and Failure Modes

| Condition | Action |
|-----------|--------|
| Any path outside TargetProjects | BLOCK: "Cannot proceed. All clones must be within TargetProjects/" |
| Missing branch in service.yaml | BLOCK: "Branch must be explicitly defined for {repo}. Add 'branch:' to service.yaml" |
| >50 repos to clone | WARN: "Large clone operation. Consider batch mode." |
| Network unavailable | FAIL: "Cannot verify repo connectivity. Check network." |
| All items already synced | SUCCESS: "Bootstrap complete - no changes needed" |
| User declines approval | EXIT: "Sync cancelled. No changes made." |
| User selects destructive option | Require re-confirmation: "This will DELETE existing repo. Type 'CONFIRM' to proceed." |
| Timeout waiting for approval | Save plan, prompt to resume later |

## Output
```yaml
sync_plan:
  plan_id: string
  summary: {...}
  actions: {...}
  conflicts: [...]
  execution_order: [...]

approval_status:
  approved: boolean
  timestamp: ISO8601
  conflict_resolutions: [...]
  ready_for_execution: boolean
```
