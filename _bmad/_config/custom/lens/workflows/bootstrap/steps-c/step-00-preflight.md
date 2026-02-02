---
name: 'step-00-preflight'
description: 'Preflight checks and guardrails'
nextStepFile: './step-01-load-lens-map.md'
---

# Step 0: Preflight

## Goal
Validate prerequisites and guardrails before bootstrapping. This step is the primary safeguard against accidental data loss and ensures all dependencies are available.

## Instructions

### 1. Validate and Create TargetProjects Root

**CRITICAL GUARDRAIL:** All repository clones MUST occur within a dedicated `TargetProjects/` directory. This prevents accidental modification of the lens workspace or system directories.

```
target_projects_path = resolve_absolute("{workspace_root}/TargetProjects")
```

**TargetProjects Directory Enforcement:**
1. **Check if exists**: If `TargetProjects/` does not exist:
   - Present confirmation: "TargetProjects/ directory does not exist. Create it? [y/N]"
   - If confirmed, create with `mkdir -p {target_projects_path}`
   - If declined, FAIL: "Bootstrap requires TargetProjects/ directory. Aborting."

2. **Validate TargetProjects path:**
   - Must be at `{workspace_root}/TargetProjects` (no symlinks allowed)
   - Must NOT be the lens workspace itself
   - Must NOT be a parent of the lens workspace
   - Must NOT be a system directory (`/`, `/home`, `C:\`, etc.)

3. **Bootstrap isolation check:**
   ```
   if target_projects_path == lens_workspace_root:
     FAIL: "TargetProjects cannot be the same as lens workspace"
   if is_parent_of(target_projects_path, lens_workspace_root):
     FAIL: "TargetProjects cannot be a parent of lens workspace"
   ```

### 2. Validate Target Project Root Within TargetProjects
```
target_path = resolve_absolute(config.target_project_root)
```

**Guardrail Enforcement:**
- **Must be under TargetProjects**: If `target_path` is not under `{target_projects_path}/`, FAIL: "target_project_root must be within TargetProjects/. Got: {path}"
- **Check existence**: If `target_path` does not exist, create it: `mkdir -p {target_path}`
- **Check is directory**: If exists but is file, FAIL: "Target must be a directory, found file: {path}"
- **Check permissions**: Verify read/write access. Test by attempting to create `.lens-preflight-test` then delete.
- **Check symlink safety**: If `target_path` contains symlinks, resolve them and verify final path is still under `TargetProjects/`. Reject paths that escape via `..` or symlink chains.

### 3. Validate Lens Root and Schema Files
Locate lens root at `{target_path}/_lens/` or `{target_path}/lens/` (check both, prefer `_lens`).

**Note:** The lens configuration files define where repositories will be cloned within the TargetProjects structure.

**Required files:**
| File | Purpose | Validation |
|------|---------|------------|
| `domain-map.yaml` | Domain structure | Must parse as valid YAML, must have `domains` key |
| `service.yaml` (per domain) | Service definitions | Path from domain-map must resolve, must have `services` array |

**Validation procedure:**
```yaml
# domain-map.yaml expected structure
domains:
  - name: string (required)
    path: string (required, relative)
    service_file: string (optional, defaults to 'service.yaml')
```

For each domain entry:
1. Resolve `{lens_root}/{domain.path}/{domain.service_file}`
2. Verify file exists and is valid YAML
3. Collect all referenced `git_repo` URLs for later validation

### 4. Resolve and Secure Output Folder
```
docs_path = resolve_absolute(config.docs_output_folder)
```
**Security checks:**
- Must not contain `..` after resolution
- Must be under `target_project_root` within TargetProjects (compare canonicalized paths)
- Must not be a symlink pointing outside TargetProjects
- Must not collide with reserved paths: `_lens/`, `.git/`, `node_modules/`

**If missing:** Create with `mkdir -p` equivalent. Record in preflight notes.

### 5. Git Environment Validation
**Required checks:**
```bash
# Verify git is available
git --version  # Must succeed

# Verify we're operating within TargetProjects (not in lens workspace)
cd {target_projects_path}
git rev-parse --git-dir 2>/dev/null || echo "Not a git repo (expected for TargetProjects root)"
```

**Working tree status:**
```bash
git status --porcelain
```
- If output is non-empty, record dirty files
- If dirty AND no rollback snapshot exists, WARN: "Working tree has uncommitted changes. Recommend creating snapshot before proceeding."

**Clone prerequisites:**
- Verify SSH key or HTTPS credentials can authenticate (test with `git ls-remote` on first repo URL)
- Check disk space: Estimate ~500MB per repo minimum, warn if <2GB free

### 6. Create Pre-Bootstrap Snapshot
```bash
# Create rollback point in sidecar
snapshot_id = "bootstrap-pre-{timestamp}"
snapshot_path = "_memory/bridge-sidecar/snapshots/{snapshot_id}/"

# Record current state within TargetProjects
- List of existing directories under target_project_root (within TargetProjects)
- Hash of domain-map.yaml
- Hash of each service.yaml
- Record TargetProjects path for rollback validation
```
Store in `_memory/bridge-sidecar/bridge-state.md`:
```yaml
last_snapshot: {snapshot_id}
snapshot_timestamp: {ISO8601}
snapshot_trigger: bootstrap-preflight
target_projects_path: {target_projects_path}
```

### 7. JIRA Integration Check (Conditional)
**If `enable_jira_integration == true`:**
- Check for JIRA config file at `{lens_root}/jira-config.yaml` or environment variables `JIRA_URL`, `JIRA_USER`, `JIRA_TOKEN`
- Validate credentials with a lightweight API call (e.g., `/rest/api/2/myself`)
- If validation fails, downgrade to WARN (don't block bootstrap)

**If `enable_jira_integration == false`:**
- Skip all JIRA checks, note in preflight output

### 8. User Confirmation Gate
Before proceeding, present summary:
```
BOOTSTRAP PREFLIGHT SUMMARY
===========================
TargetProjects:  {target_projects_path} ✓
Target Root:     {target_project_root} (within TargetProjects)
Lens Root:       {lens_root}
Domains Found:   {count}
Services Found:  {count}
Repos to Clone:  {count}
Output Folder:   {docs_output_folder}
Git Status:      {clean|dirty with N files}
Snapshot:        {snapshot_id}
JIRA:            {enabled|disabled}

⚠️  BOOTSTRAP GUARDRAILS:
   • All clones will occur ONLY within TargetProjects/
   • Branch checkout will be enforced per service.yaml definitions
   • Existing folders matching lens structure will be PRESERVED (not overwritten)

Proceed? [y/N]
```

## Edge Cases and Failure Modes

| Condition | Action |
|-----------|--------|
| `target_project_root` is `/` or `/home` | REJECT - too dangerous |
| `target_project_root` not under TargetProjects | REJECT - "Must clone into TargetProjects/" |
| TargetProjects does not exist and user declines creation | FAIL - "Bootstrap requires TargetProjects/" |
| TargetProjects is symlink to outside workspace | REJECT - "TargetProjects must be real directory" |
| TargetProjects equals lens workspace | REJECT - "Cannot bootstrap into lens workspace" |
| Lens root has circular domain references | FAIL with cycle detection output |
| Git credentials expired mid-check | FAIL with re-auth instructions |
| Disk full | FAIL before any writes occur |
| domain-map.yaml has YAML syntax errors | FAIL with line number and fix hint |
| User declines confirmation | EXIT cleanly, no changes |

## Output
```yaml
preflight_status:
  result: pass|fail
  timestamp: ISO8601
  target_projects_path: /absolute/path/to/TargetProjects
  target_root: /absolute/path (must be under target_projects_path)
  lens_root: /absolute/path
  domains_found: N
  services_found: N
  repos_to_clone: N
  branches_to_checkout: [list of {repo, branch} pairs]
  git_status: clean|dirty
  dirty_files: [list if dirty]
  snapshot_id: string
  jira_enabled: boolean
  jira_validated: boolean|null
  guardrails_validated:
    target_projects_exists: boolean
    target_projects_is_isolated: boolean
    all_clones_within_target_projects: boolean
  warnings: [list]
  errors: [list]
  remediation_checklist: [list if failed]
```
