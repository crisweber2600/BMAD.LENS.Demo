---
name: 'step-00-preflight'
description: 'Preflight checks and guardrails'
nextStepFile: './step-01-load-conflicts.md'
---

# Step 0: Preflight

## Goal
Validate prerequisites and guardrails before reconciliation. This workflow modifies both lens metadata AND target repositories—maximum caution required.

## Instructions

### 1. Validate Target Project Root
```
target_path = resolve_absolute(config.target_project_root)
```
- **Check existence**: FAIL if missing
- **Check is directory**: FAIL if file
- **Check read/write access**: MUST have write permission (reconcile modifies files)
- **Symlink safety**: Resolve and verify path stays in workspace

### 2. Validate Drift Report Exists
**Required input:** Latest sync-status report

**Check locations:**
1. `{project-root}/_bmad-output/sync-status-report.md`
2. `_memory/bridge-sidecar/bridge-state.md` → `drift_report_path`

**Validation:**
- Report must exist
- Report age: WARN if older than 24 hours (drift may have changed)
- Report must contain conflicts section (otherwise nothing to reconcile)

```yaml
drift_report:
  path: string
  timestamp: ISO8601
  age_hours: N
  has_conflicts: boolean
  conflict_count: N
```

If no conflicts exist:
```
✓ No conflicts to reconcile. Run sync-status to check current state.
```
EXIT with success (nothing to do).

### 3. Validate Lens Metadata Access
**Required files (with write access):**
- `{lens_root}/domain-map.yaml`
- All referenced `service.yaml` files

Test write access:
```bash
touch "{lens_root}/.reconcile-test" && rm "{lens_root}/.reconcile-test"
```

### 4. Resolve Output Folder
```
docs_path = resolve_absolute(config.docs_output_folder)
```
**Security checks:**
- Under `target_project_root`
- No path traversal
- Create if missing

### 5. Git Environment Validation
**Required (modifying workflow):**
```bash
git --version                    # Must succeed
git status --porcelain           # Record current state
```

**Working tree handling:**
- If dirty with lens files modified: WARN "Lens files have uncommitted changes. Reconcile will modify them further."
- If dirty with target repos modified: WARN "Target repos have uncommitted changes. Some resolutions may conflict."

### 6. Create Pre-Reconcile Snapshot
**Critical:** Snapshot current state before any modifications.

```bash
snapshot_id = "reconcile-pre-{timestamp}"
snapshot_path = "_memory/bridge-sidecar/snapshots/{snapshot_id}/"
mkdir -p "{snapshot_path}"

# Snapshot lens files
cp -r "{lens_root}/" "{snapshot_path}/lens-backup/"

# Record git state for all affected repos
for repo in affected_repos:
  cd {repo}
  git stash create "reconcile-backup" > "{snapshot_path}/{repo_name}-stash.txt"
  git log -1 --format="%H" > "{snapshot_path}/{repo_name}-head.txt"
```

Update `_memory/bridge-sidecar/bridge-state.md`:
```yaml
last_snapshot: {snapshot_id}
snapshot_timestamp: ISO8601
snapshot_trigger: reconcile-preflight
snapshot_contents:
  lens_backup: true
  repo_states: [list of repos]
```

### 7. JIRA Integration Check (Conditional)
**If `enable_jira_integration == true`:**
- Validate JIRA connectivity
- Note: Some resolutions may create/update JIRA issues

**If `enable_jira_integration == false`:**
- Skip JIRA checks

### 8. Load Conflict Context
Pre-load conflict details for Step 1:
```yaml
conflict_preview:
  total: N
  by_severity:
    high: N
    medium: N
    low: N
  by_type:
    remote_mismatch: N
    branch_mismatch: N
    path_collision: N
```

### 9. User Warning Gate
Display reconciliation warning:

```
╔═══════════════════════════════════════════════════════════════════╗
║                    RECONCILE PREFLIGHT                            ║
╠═══════════════════════════════════════════════════════════════════╣
║ This workflow will MODIFY lens metadata and/or target repos.      ║
║ A snapshot has been created for rollback.                         ║
╠═══════════════════════════════════════════════════════════════════╣
║ Conflicts to resolve:     {N}                                     ║
║   High severity:          {N}                                     ║
║   Medium severity:        {N}                                     ║
║   Low severity:           {N}                                     ║
║                                                                   ║
║ Snapshot ID: {snapshot_id}                                        ║
╚═══════════════════════════════════════════════════════════════════╝

Proceed to conflict resolution? [y/N]
```

## Edge Cases and Failure Modes

| Condition | Action |
|-----------|--------|
| No drift report found | FAIL: "Run sync-status first to detect conflicts" |
| Drift report has 0 conflicts | EXIT success: "Nothing to reconcile" |
| Lens files read-only | FAIL: "Cannot modify lens files - check permissions" |
| Snapshot creation fails | FAIL: "Cannot create backup - aborting for safety" |
| Report older than 7 days | FAIL: "Drift report too old. Re-run sync-status." |
| Git not available | FAIL: "Git required for safe reconciliation" |

## Output
```yaml
preflight_status:
  result: pass|fail|skip
  timestamp: ISO8601
  
  environment:
    target_root: string
    lens_root: string
    output_folder: string
    git_available: true
    working_tree_status: clean|dirty
  
  drift_report:
    path: string
    timestamp: ISO8601
    age_hours: N
    conflict_count: N
  
  snapshot:
    id: string
    path: string
    contents: [list]
  
  conflict_preview:
    total: N
    by_severity: {...}
    by_type: {...}
  
  warnings: [list]
  errors: [list]
```
