---
name: 'step-00-preflight'
description: 'Preflight checks and guardrails'
nextStepFile: './step-01-load-lens-map.md'
---

# Step 0: Preflight

## Goal
Validate prerequisites and guardrails before scanning for drift. This is a read-only workflow that detects discrepancies—no destructive operations.

## Instructions

### 1. Validate Target Project Root
```
target_path = resolve_absolute(config.target_project_root)
```
- **Check existence**: FAIL if path doesn't exist
- **Check is directory**: FAIL if exists but is file
- **Check read access**: Must be able to traverse and read directory contents
- **Symlink safety**: Resolve and verify path stays within workspace

### 2. Validate Lens Root and Schema Files
**Required files:**
- `{lens_root}/domain-map.yaml` - must exist and parse as valid YAML
- Referenced `service.yaml` files - must exist for each domain

**Validation:**
```yaml
# Quick parse test without full validation
for file in [domain-map.yaml, service.yaml files]:
  try:
    yaml.safe_load(file)
  catch:
    FAIL("Invalid YAML in {file}: {error}")
```

### 3. Resolve Output Folder
```
docs_path = resolve_absolute(config.docs_output_folder)
```
**Security checks:**
- Must resolve to path under `target_project_root`
- No `..` traversal after resolution
- No symlinks escaping workspace

**Create if missing:** This workflow writes a drift report, so output folder must exist or be creatable.

### 4. Git Environment Check
```bash
# Verify git is available (needed for repo status detection)
git --version

# Check working tree status
git status --porcelain 2>/dev/null
```
- Git availability is REQUIRED (for detecting repo drift)
- Working tree status is INFORMATIONAL only (we're read-only)

**Note:** Unlike bootstrap, sync-status does not modify files, so dirty working tree is acceptable.

### 5. Check for Previous Drift Reports
Look for existing reports:
```
{project-root}/_bmad-output/sync-status-report.md
{docs_output_folder}/lens-sync/sync-status-report-{date}.md
```

If found:
- Record last report timestamp
- Calculate time since last sync check
- Note if drift was previously detected

### 6. JIRA Integration Validation (Conditional)
**If `enable_jira_integration == true`:**
- Validate JIRA config exists
- Test API connectivity with lightweight call
- WARN (don't fail) if JIRA unreachable - sync-status can proceed without JIRA

**If `enable_jira_integration == false`:**
- Skip JIRA checks
- Note in output

### 7. Load Bridge Sidecar State
Read `_memory/bridge-sidecar/bridge-state.md`:
```yaml
last_sync: ISO8601|null
last_sync_type: bootstrap|reconcile|null
sync_status: success|partial|failed|null
pending_conflicts: [list]
```

Use this context to:
- Provide continuity information
- Highlight if conflicts exist from previous runs
- Note time elapsed since last successful sync

## Edge Cases and Failure Modes

| Condition | Action |
|-----------|--------|
| `target_project_root` doesn't exist | FAIL: "Target root not found: {path}" |
| Lens files have YAML errors | FAIL with parse error details |
| Git not installed | FAIL: "Git required for drift detection" |
| Previous report shows conflicts | WARN: "Unresolved conflicts from previous scan" |
| Output folder not writable | FAIL: "Cannot write to output folder: {path}" |
| Network unreachable | WARN only - sync-status is primarily local |

## Output
```yaml
preflight_status:
  result: pass|fail
  timestamp: ISO8601
  
  environment:
    target_root: /absolute/path
    lens_root: /absolute/path
    output_folder: /absolute/path
    git_available: true
    working_tree_clean: boolean
  
  previous_state:
    last_sync: ISO8601|null
    last_sync_type: string|null
    pending_conflicts: N
    last_report: ISO8601|null
  
  jira:
    enabled: boolean
    reachable: boolean|null
  
  warnings: [list]
  errors: [list]
  remediation_checklist: [list if failed]
```
