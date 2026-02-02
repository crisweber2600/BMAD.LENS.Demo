---
name: 'step-01-load-conflicts'
description: 'Load conflict list from sync-status'
nextStepFile: './step-02-present-options.md'
---

# Step 1: Load Conflicts

## Goal
Load and enrich conflicts reported by `sync-status` for resolution. Gather all context needed to present meaningful choices to the user.

## Instructions

### 1. Parse Drift Report
Load from `{project-root}/_bmad-output/sync-status-report.md` or cached location.

**Extract conflict section:**
```yaml
raw_conflicts:
  - id: string
    path: string
    type: string
    severity: string
    lens_value: string
    target_value: string
```

### 2. Enrich Each Conflict with Full Context
For each conflict, gather additional details:

**For `remote_mismatch` conflicts:**
```bash
cd {conflict.path}

# Get full remote details
git remote -v
# origin    git@github.com:fork/repo.git (fetch)
# origin    git@github.com:fork/repo.git (push)

# Check if lens remote is accessible
git ls-remote {lens_expected_remote} --exit-code 2>/dev/null
accessible_lens_remote = exit_code == 0

# Check commit history
git log --oneline -10
# See if local commits exist that would be lost

# Check if there's a common ancestor between remotes
# (indicates fork vs completely different repo)
```

Build enriched entry:
```yaml
enriched_conflict:
  id: string
  path: string
  type: remote_mismatch
  severity: high
  
  lens_context:
    expected_remote: string
    expected_branch: string
    remote_accessible: boolean
    
  target_context:
    current_remote: string
    current_branch: string
    uncommitted_changes: boolean
    local_commits_ahead: N
    last_commit_sha: string
    last_commit_message: string
    
  analysis:
    is_fork: boolean              # same repo, different origin
    has_local_work: boolean       # would lose commits if reset
    risk_level: high|medium|low
    data_loss_possible: boolean
```

**For `branch_mismatch` conflicts:**
```bash
cd {conflict.path}

# Get all branches
git branch -a

# Check if expected branch exists
git rev-parse --verify {expected_branch} 2>/dev/null

# Get commits unique to current branch
git log {expected_branch}..HEAD --oneline

# Get commits we'd gain by switching
git log HEAD..{expected_branch} --oneline
```

Build enriched entry:
```yaml
enriched_conflict:
  type: branch_mismatch
  
  lens_context:
    expected_branch: string
    branch_exists_locally: boolean
    branch_exists_remotely: boolean
    
  target_context:
    current_branch: string
    commits_ahead: N
    commits_behind: N
    
  analysis:
    can_fast_forward: boolean
    would_lose_commits: boolean
    merge_possible: boolean
```

**For `path_collision` conflicts:**
```yaml
enriched_conflict:
  type: path_collision
  
  collision_details:
    path: string
    lens_entry_1:
      name: string
      expected_path: string
    lens_entry_2:
      name: string
      expected_path: string
      
  analysis:
    requires_lens_restructure: true
    suggested_resolution: "Rename one entry in lens"
```

### 3. Categorize and Prioritize
Sort conflicts for presentation:

```yaml
conflict_categories:
  critical:
    description: "May cause data loss if resolved incorrectly"
    conflicts: [remote_mismatches with local work]
    
  important:
    description: "Require decision but low data loss risk"
    conflicts: [branch mismatches, clean remote mismatches]
    
  routine:
    description: "Standard drift, safe to auto-resolve"
    conflicts: [minor drift, formatting differences]
```

### 4. Identify Auto-Resolvable Items
Some drift can be resolved automatically with user consent:

```yaml
auto_resolvable:
  - conflict_id: string
    auto_resolution: "pull"
    description: "Repo is behind tracking branch, can fast-forward"
    risk: none
    
  - conflict_id: string
    auto_resolution: "checkout_branch"
    description: "Wrong branch, expected branch exists, no local changes"
    risk: none
```

### 5. Build Conflict List for Presentation
Structure for Step 2:

```yaml
conflict_list:
  summary:
    total: N
    critical: N
    important: N
    routine: N
    auto_resolvable: N
  
  conflicts:
    - id: string
      path: string
      type: string
      severity: string
      
      context:
        lens: {...}
        target: {...}
        
      analysis:
        risk_level: string
        data_loss_possible: boolean
        auto_resolvable: boolean
        auto_resolution: string|null
        
      resolution_options: []  # populated in Step 2
```

### 6. Cache Conflict List
Store in sidecar for Step 2:

**File:** `_memory/bridge-sidecar/pending-conflicts.yaml`
```yaml
loaded_at: ISO8601
source_report: string
conflict_list: {...}
```

## Edge Cases and Failure Modes

| Condition | Action |
|-----------|--------|
| Conflict path no longer exists | Mark as `stale`, skip |
| Cannot access git in conflict repo | Mark as `inaccessible`, require manual |
| Lens remote unreachable | WARN, still allow "update lens" option |
| Conflict resolved since report | Mark as `already_resolved`, skip |
| New conflicts since report | WARN: "New drift detected. Consider re-running sync-status." |

## Output
```yaml
conflict_list:
  loaded_at: ISO8601
  source_report: string
  
  summary:
    total: N
    by_severity:
      critical: N
      important: N  
      routine: N
    auto_resolvable: N
    stale: N
    
  conflicts:
    - id: string
      path: string
      type: string
      severity: string
      status: active|stale|already_resolved
      context: {...}
      analysis: {...}
```
