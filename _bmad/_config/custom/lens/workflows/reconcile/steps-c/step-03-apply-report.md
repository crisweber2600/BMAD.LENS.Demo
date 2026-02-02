---
name: 'step-03-apply-report'
description: 'Apply resolution and write report'
outputFile: '{project-root}/_bmad-output/reconcile-report.md'
---

# Step 3: Apply & Report

## Goal
Execute the approved resolution plan with atomic operations where possible, full error handling, and comprehensive reporting.

## Instructions

### 1. Pre-Execution Validation
Verify plan is still valid:

```yaml
pre_execution_checks:
  - plan_status: pending_execution
  - plan_age: < 30 minutes
  - snapshot_exists: true
  - all_paths_still_exist: true
  - no_new_changes_detected: true  # re-scan affected paths
```

**If paths changed since plan creation:**
```
⚠️  Warning: {N} paths have changed since resolution plan was created.
    - platform/auth/auth-api: new commits detected
    
Options:
  [1] Continue anyway (may cause issues)
  [2] Abort and re-run sync-status
  
Choice:
```

### 2. Execute Lens Metadata Updates
Process all `update_lens` decisions first (safest operations):

**For each lens update:**
```python
# Load service.yaml
service_file = load_yaml(path)

# Make atomic update
if resolution.field == "git_repo":
    service_file.microservices[index].git_repo = resolution.new_value
elif resolution.field == "branch":
    service_file.microservices[index].branch = resolution.new_value
elif resolution.field == "path":
    service_file.microservices[index].path = resolution.new_value

# Write back with preserved formatting
write_yaml(service_file, path, preserve_comments=True)

# Verify write
verify_yaml(path)
```

**Progress tracking:**
```yaml
lens_update_progress:
  total: N
  completed: N
  failed: N
  current: "{path}"
```

**Error handling:**
- If YAML write fails: Record error, continue with other updates
- If verification fails: Restore from snapshot, abort

### 3. Execute Git Operations
Process repository operations in dependency order:

**For `git_pull` operations:**
```bash
cd {repo_path}
git stash push -m "lens-reconcile-backup-{timestamp}"  # if dirty
git pull --ff-only
git stash pop  # if stashed
```

**For `checkout_branch` operations:**
```bash
cd {repo_path}
git stash push -m "lens-reconcile-backup-{timestamp}"  # if dirty
git checkout {target_branch}
git stash pop  # if stashed
```

**For `add_remote` operations:**
```bash
cd {repo_path}
git remote add upstream {lens_remote}
git fetch upstream
```

**For `reset_to_lens` (DESTRUCTIVE):**
```bash
cd {repo_path}

# Create backup archive
tar -czf "{backup_path}/{repo_name}-backup-{timestamp}.tar.gz" .

# Remove and re-clone
cd ..
rm -rf {repo_name}
git clone --branch {expected_branch} {lens_remote} {repo_name}

# Verify
cd {repo_name}
git status
```

**Progress tracking:**
```yaml
git_operation_progress:
  total: N
  completed: N
  failed: N
  current:
    path: string
    operation: string
```

### 4. Handle Operation Failures
For each failed operation:

```yaml
failure_record:
  - path: string
    operation: string
    error: string
    recovery_action: "manual"|"rollback"|"retry"
    
    manual_steps:
      - "cd {path}"
      - "git pull origin main"
      - "# resolve conflicts if any"
```

**Failure policies:**
- Lens update failure: Continue with others, report
- Git pull failure (merge conflict): Record, mark for manual
- Git checkout failure (dirty tree): Stash first, retry
- Re-clone failure (network): Retry once, then record

### 5. Verify Resolution Results
After all operations:

```bash
# For each resolved conflict
cd {path}
git status
git remote -v
git branch
```

Build verification report:
```yaml
verification_results:
  - conflict_id: string
    resolution_applied: string
    verification_status: success|failed|partial
    current_state:
      remote: string
      branch: string
      clean: boolean
    matches_lens: boolean
```

### 6. Update Sidecar State
Update `_memory/bridge-sidecar/bridge-state.md`:

```yaml
last_sync: ISO8601
last_sync_type: reconcile
reconcile_plan_id: "{plan_id}"

resolved_conflicts:
  - conflict_id: string
    resolution: string
    status: success|failed

pending_conflicts:  # remaining unresolved
  - conflict_id: string
    reason: "skipped"|"failed"

sync_status: success|partial|failed
```

### 7. Generate Reconcile Report
Write to `{project-root}/_bmad-output/reconcile-report.md`:

```markdown
# Reconcile Report

**Generated:** {ISO8601}  
**Plan ID:** {plan_id}  
**Status:** {SUCCESS|PARTIAL|FAILED}

## Summary

| Metric | Count |
|--------|-------|
| Conflicts resolved | N |
| Auto-resolutions | N |
| Skipped | N |
| Failed | N |

## Resolution Timeline

| Time | Conflict | Resolution | Result |
|------|----------|------------|--------|
| HH:MM:SS | platform/auth remote | Update lens | ✓ |
| HH:MM:SS | business/orders branch | Checkout main | ✓ |
| HH:MM:SS | legacy/api | Re-clone | ✓ |

## Successfully Resolved

### platform/auth/auth-api
- **Conflict:** Remote mismatch
- **Resolution:** Updated lens to use fork remote
- **Changes:** Modified `platform/auth/service.yaml`

### business/orders/gateway  
- **Conflict:** Branch drift
- **Resolution:** Checked out main branch
- **Changes:** `git checkout main`

## Failed Resolutions

| Path | Intended Resolution | Error | Manual Steps |
|------|---------------------|-------|--------------|
| business/legacy | Re-clone | Network timeout | `git clone {url}` |

## Skipped Conflicts

| Path | Reason | Recommended Action |
|------|--------|-------------------|
| platform/users | User skipped | Run reconcile again |

## Remaining Drift

After reconciliation, the following items remain out of sync:

| Path | Issue | Action Needed |
|------|-------|---------------|
| business/legacy | Clone failed | Manual clone |
| platform/users | Skipped | Re-run reconcile |

## Data Preservation

Backups created during reconciliation:
- Lens files: `_memory/bridge-sidecar/snapshots/{snapshot_id}/lens-backup/`
- Repository: `{backup_path}/legacy-api-backup-{timestamp}.tar.gz`

## Post-Reconcile Status

Run `lens-sync sync-status` to verify current state.

**Estimated new health score:** {N}/100 (was {old_score})

## Rollback Information

To rollback this reconciliation:
```bash
lens-sync rollback --snapshot {snapshot_id}
```

## Next Steps

1. {N > 0 failed}: Resolve failed items manually
2. {N > 0 skipped}: Re-run reconcile for skipped items
3. Run sync-status to verify
4. Commit lens changes if satisfied
```

### 8. Handle Partial Success
If some resolutions failed:

1. **Keep successful changes** - don't rollback working resolutions
2. **Mark status as PARTIAL**
3. **List manual remediation steps**
4. **Offer retry for failed items only**

```
Reconciliation partially complete.

  ✓ {N} conflicts resolved successfully
  ✗ {N} resolutions failed
  ○ {N} conflicts skipped

Would you like to:
  [1] View detailed failure report
  [2] Retry failed resolutions
  [3] Exit (keep successful changes)
```

## Edge Cases and Failure Modes

| Condition | Action |
|-----------|--------|
| All resolutions succeed | Report SUCCESS |
| All resolutions fail | Report FAILED, offer rollback |
| Mixed results | Report PARTIAL, keep successes |
| Network fails during re-clone | Retry once, then record manual steps |
| Lens file locked | Wait and retry, then fail |
| Merge conflict during pull | Record for manual resolution |
| Stash pop fails | Leave stash, warn user |
| Report write fails | Log to console, don't fail operation |

## Output
```yaml
reconcile_result:
  status: success|partial|failed
  plan_id: string
  execution_time_seconds: N
  
  statistics:
    resolved: N
    failed: N
    skipped: N
    
  lens_changes:
    - file: string
      field: string
      old_value: string
      new_value: string
      
  git_operations:
    - path: string
      operation: string
      result: success|failed
      
  failures:
    - path: string
      error: string
      manual_steps: [list]
      
  report_path: string
  
  remaining_drift:
    count: N
    paths: [list]
    
  rollback_snapshot: string
```
