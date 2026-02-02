---
name: 'step-04-execute-report'
description: 'Execute sync and write bootstrap report'
outputFile: '{docs_output_folder}/lens-sync/bootstrap-report.md'
---

# Step 4: Execute & Report

## Goal
Execute the approved sync plan with full error handling, progress reporting, and rollback capability. Produce a comprehensive bootstrap report documenting all actions taken.

## Instructions

### 1. Pre-Execution Validation
Before executing, verify:
```yaml
pre_execution_checks:
  - plan_status: approved           # must be approved
  - plan_age: < 1 hour              # reject stale plans
  - snapshot_exists: true           # rollback point ready
  - network_available: true         # for clone operations
  - disk_space_sufficient: true     # based on estimated size
  - target_projects_exists: true    # TargetProjects directory ready
  - all_paths_within_target_projects: true  # CRITICAL guardrail
  - all_branches_defined: true      # no implicit branch defaults
```

**GUARDRAIL VALIDATION (BLOCKING):**
```bash
# Verify TargetProjects exists and is writable
[ -d "{target_projects_path}" ] || FAIL "TargetProjects not found"
touch "{target_projects_path}/.write-test" && rm "{target_projects_path}/.write-test" || FAIL "TargetProjects not writable"

# Verify all clone targets are under TargetProjects
for target_path in sync_plan.actions.clone_repos:
  realpath "{target_path}" | grep -q "^{target_projects_path}/" || FAIL "Clone target outside TargetProjects: {target_path}"
done
```

If any check fails, STOP and prompt user to re-run from Step 3.

### 2. Execute Folder Creation
Process `sync_plan.actions.create_folders` in order (parents before children):

```bash
# For each folder
mkdir -p "{target_path}"

# Verify creation
if [ -d "{target_path}" ]; then
  record_success(folder, "created")
else
  record_failure(folder, "mkdir failed: {error}")
fi
```

**Progress tracking:**
```yaml
folder_progress:
  total: N
  completed: N
  failed: N
  current: "{path}"
```

### 3. Execute Repository Clones (Within TargetProjects Only)
Process `sync_plan.actions.clone_repos` sequentially (not parallel to avoid network contention):

**GUARDRAIL CHECK per repo:**
```bash
# Verify target is within TargetProjects BEFORE cloning
realpath "{parent_path}/{folder_name}" | grep -q "^{target_projects_path}/" || SKIP "Path escapes TargetProjects"
```

**For each repo:**
```bash
# Navigate to parent directory (must be under TargetProjects)
cd "{parent_path}"

# Clone with appropriate depth and EXPLICIT branch
if [ "{depth}" = "shallow" ]; then
  git clone --depth 1 --branch "{branch}" "{git_repo}" "{folder_name}"
else
  git clone --branch "{branch}" "{git_repo}" "{folder_name}"
fi

# Verify clone success
cd "{folder_name}"
git status  # should succeed
git remote -v  # verify remote URL

# ENFORCE branch checkout verification
current_branch=$(git rev-parse --abbrev-ref HEAD)
if [ "$current_branch" != "{branch}" ]; then
  git checkout "{branch}" || record_failure(repo, "Branch checkout failed: {branch}")
fi

# Final branch verification
git rev-parse --abbrev-ref HEAD | grep -q "^{branch}$" || record_failure(repo, "Branch mismatch after checkout")
```

**Clone error handling:**
| Error | Action |
|-------|--------|
| Authentication failed | Log, skip, add to manual_fixes |
| Network timeout | Retry once, then skip |
| Branch not found | FAIL for this repo (do NOT use default branch - branch must be explicit) |
| Branch checkout failed | Log, add to manual_fixes with checkout command |
| Disk full | STOP all clones, report partial state |
| Repository not found (404) | Log, skip, warn about stale lens data |
| Path outside TargetProjects | SKIP with CRITICAL warning (guardrail violation) |

**Progress tracking:**
```yaml
clone_progress:
  total: N
  completed: N
  failed: N
  skipped: N
  current:
    repo: "{git_repo}"
    progress: "Receiving objects: X%"
```

### 4. Execute Manual Resolutions
For approved manual resolutions from Step 3:

**Remote mismatch - Update lens:**
```yaml
# Update service.yaml with actual remote
microservice.git_repo = target_git_repo
# Write back to lens file
```

**Remote mismatch - Re-clone:**
```bash
# Backup existing
mv "{path}" "{path}.backup-{timestamp}"
# Clone fresh
git clone --branch {branch} "{lens_git_repo}" "{path}"
# If successful, remove backup
rm -rf "{path}.backup-{timestamp}"
```

### 5. Post-Execution Validation
After all actions complete:

```bash
# For each expected microservice path
cd "{path}"
[ -d ".git" ] && git status --porcelain
[ -f "package.json" ] || [ -f "requirements.txt" ] || ...
```

**Build validation report:**
```yaml
validation_results:
  total_expected: N
  total_validated: N
  validation_failures:
    - path: string
      issue: "Missing .git directory"|"Wrong remote"|"Clone incomplete"
```

### 6. Update Bridge Sidecar State
Update `_memory/bridge-sidecar/bridge-state.md`:

```yaml
last_sync: ISO8601
last_sync_type: bootstrap
last_sync_plan_id: "{plan_id}"
sync_status: success|partial|failed
target_projects_path: "{target_projects_path}"  # Record for future operations

sync_statistics:
  folders_created: N
  repos_cloned: N
  repos_skipped: N
  branches_checked_out: N
  branch_checkout_failures: N
  manual_fixes_pending: N

guardrails_enforced:
  all_clones_within_target_projects: true
  all_branches_explicit: true
  no_default_branch_fallback: true

last_drift_report: null  # reset after bootstrap
pending_conflicts: []     # clear conflicts
```

### 7. Generate Bootstrap Report
Write comprehensive report to `{docs_output_folder}/lens-sync/bootstrap-report.md`:

```markdown
# Bootstrap Report

**Generated:** {ISO8601}
**Plan ID:** {plan_id}
**Status:** {SUCCESS|PARTIAL|FAILED}

## Bootstrap Configuration

| Setting | Value |
|---------|-------|
| TargetProjects Path | {target_projects_path} |
| Target Project Root | {target_project_root} |
| Guardrails Enforced | ✓ All clones within TargetProjects |
| Branch Policy | Explicit branches only (no defaults) |

## Summary

| Metric | Count |
|--------|-------|
| Domains bootstrapped | N |
| Services bootstrapped | N |
| Microservices bootstrapped | N |
| Folders created | N |
| Repositories cloned | N |
| Branches checked out | N |
| Branch checkout failures | N |
| Items skipped | N |
| Manual fixes needed | N |

## Execution Timeline

| Time | Action | Branch | Result |
|------|--------|--------|--------|
| HH:MM:SS | Created platform/ | — | ✓ |
| HH:MM:SS | Cloned auth-api | main | ✓ |
| HH:MM:SS | Checkout auth-api | main | ✓ |
| HH:MM:SS | Cloned auth-ui | develop | ✗ Branch not found |
| ... | ... | ... | ... |

## Successfully Bootstrapped

### Domain: {name}

#### Service: {name}
- ✓ microservice-1 (cloned from {repo} @ branch: {branch})
- ✓ microservice-2 (folder only)

## Failures and Skipped Items

| Item | Branch | Reason | Remediation |
|------|--------|--------|-------------|
| payments/gateway | main | Auth failed | Run: `git clone -b main {url}` manually |
| billing/invoices | develop | Branch not found | Verify branch exists, update service.yaml |
| ... | ... | ... | ... |

## Manual Fixes Required

1. **payments/gateway** - Clone failed due to authentication
   ```bash
   cd {target_projects_path}/{project}/payments/gateway
   git clone -b main git@github.com:org/gateway.git .
   git checkout main  # Verify branch
   ```

2. **business/reporting** - Remote URL mismatch
   - Current: git@github.com:fork/reporting.git
   - Expected: git@github.com:org/reporting.git
   - Expected Branch: main
   - Action: Verify correct remote and update lens or repo

3. **billing/invoices** - Branch checkout failed
   - Expected Branch: develop
   - Error: Branch 'develop' not found in remote
   - Action: Update service.yaml with correct branch name or create branch in remote

## Next Steps

1. Run `sync-status` to verify bootstrap completeness
2. Verify all repositories are on correct branches: `git branch` in each repo
3. Resolve manual fixes listed above (especially branch checkout failures)
4. Run `discover` on bootstrapped repos to generate docs
5. Commit changes if working in a tracked workspace

## Guardrails Verification

| Guardrail | Status |
|-----------|--------|
| All clones within TargetProjects/ | {PASS|FAIL} |
| All branches explicitly defined | {PASS|FAIL} |
| No default branch fallback used | {PASS|FAIL} |
| Branch checkout verified post-clone | {PASS|FAIL} |

## Rollback Information

To rollback this bootstrap:
- Snapshot ID: {snapshot_id}
- Run: `lens-sync rollback --snapshot {snapshot_id}`
```

### 8. Handle Partial Failure
If some actions fail but others succeed:

1. **DO NOT rollback automatically** - preserve successful work
2. **Mark status as PARTIAL** 
3. **List specific failures** with remediation steps
4. **Offer continue option**: "N items failed. Run bootstrap again to retry failed items?"

## Edge Cases and Failure Modes

| Condition | Action |
|-----------|--------|
| All clones fail (network down) | FAIL, preserve folder structure, report |
| Clone interrupted (Ctrl+C) | Cleanup partial clone, mark as failed |
| Disk fills mid-clone | Stop remaining clones, report space issue |
| Git LFS objects fail | Clone succeeds, warn about LFS |
| Submodules present | Warn, don't auto-init submodules |
| Report file write fails | Log to console, warn but don't fail entire operation |

## Output
```yaml
execution_result:
  status: success|partial|failed
  plan_id: string
  execution_time_seconds: N
  target_projects_path: string
  
  statistics:
    folders_created: N
    repos_cloned: N
    repos_failed: N
    branches_checked_out: N
    branch_checkout_failures: N
    manual_pending: N
  
  guardrails:
    all_clones_within_target_projects: boolean
    all_branches_explicit: boolean
    no_default_branch_fallback: boolean
  
  failures:
    - item: string
      branch: string
      error: string
      remediation: string
  
  report_path: "{docs_output_folder}/lens-sync/bootstrap-report.md"
  
  next_actions:
    - "Run sync-status to verify"
    - "Verify branches: git branch in each repo"
    - "Resolve N manual fixes"
    - "Resolve N branch checkout failures"
```
