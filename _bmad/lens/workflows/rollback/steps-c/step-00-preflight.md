---
name: 'step-00-preflight'
description: 'Preflight checks and guardrails'
nextStepFile: './step-01-select-snapshot.md'
---

# Step 0: Preflight

## Goal
Validate prerequisites and guardrails before rollback. This is a destructive operation that restores prior state, so extra safety measures are critical.

## Instructions

### 1. Load and Validate Configuration
```yaml
required_config:
  target_project_root: string  # workspace root
  docs_output_folder: string   # lens docs location
  lens_config_path: string     # domain-map.yaml location
  
optional_config:
  enable_jira_integration: boolean
  jira_project_key: string
  rollback_retention_days: N  # how long to keep snapshots
  require_confirmation: boolean  # default: true
  auto_backup: boolean  # default: true
```

### 2. Verify Workspace Access
```python
def verify_workspace(config):
    errors = []
    
    root = config.get("target_project_root")
    if not root:
        errors.append("target_project_root is required")
    elif not exists(root):
        errors.append(f"target_project_root not found: {root}")
    elif not is_writable(root):
        errors.append(f"target_project_root not writable: {root}")
    
    return errors
```

### 3. Validate Path Security
```python
def validate_paths(docs_output_folder, target_project_root):
    abs_output = os.path.abspath(docs_output_folder)
    abs_root = os.path.abspath(target_project_root)
    
    # Ensure output is inside project root
    if not abs_output.startswith(abs_root):
        raise SecurityError("Output folder must be inside project root")
    
    # Reject path traversal
    if ".." in docs_output_folder:
        raise SecurityError("Path traversal not allowed")
    
    # Check for symlink escape
    real_output = os.path.realpath(abs_output)
    real_root = os.path.realpath(abs_root)
    if not real_output.startswith(real_root):
        raise SecurityError("Symlink escape detected")
    
    return abs_output
```

### 4. Discover Available Rollback Points
```yaml
rollback_sources:
  git_tags:
    pattern: "lens-sync-pre-*"
    description: "Automatic pre-operation snapshots"
    
  git_commits:
    scope: "lens files only"
    depth: 50  # last 50 commits affecting lens
    
  manual_backups:
    path: "{docs_output_folder}/.lens-backups/"
    description: "Manual backup snapshots"
```

**Discovery implementation:**
```python
def discover_rollback_points():
    points = []
    
    # Git tags
    tag_output = run_command("git tag -l 'lens-sync-pre-*' --sort=-creatordate")
    for tag in tag_output.strip().split("\n"):
        if tag:
            tag_date = run_command(f"git log -1 --format=%ci {tag}")
            points.append({
                "type": "git_tag",
                "ref": tag,
                "date": tag_date.strip(),
                "description": f"Pre-operation snapshot: {tag}"
            })
    
    # Git commits
    commit_output = run_command(
        "git log -50 --format='%H|%ci|%s' -- '**/domain-map.yaml' '**/lens-sync/**'"
    )
    for line in commit_output.strip().split("\n"):
        if line:
            sha, date, message = line.split("|")
            points.append({
                "type": "git_commit",
                "ref": sha,
                "date": date,
                "description": message
            })
    
    # Manual backups
    backup_dir = f"{docs_output_folder}/.lens-backups/"
    if exists(backup_dir):
        for backup in sorted(listdir(backup_dir), reverse=True):
            backup_path = f"{backup_dir}/{backup}"
            points.append({
                "type": "manual_backup",
                "ref": backup_path,
                "date": get_mtime(backup_path),
                "description": f"Manual backup: {backup}"
            })
    
    return points
```

### 5. Verify Git Availability
```python
def verify_git():
    if not command_exists("git"):
        raise PreflightError("Git is required for rollback operations")
    
    # Verify we're in a git repo
    result = run_command("git rev-parse --git-dir")
    if not result:
        raise PreflightError("Not inside a git repository")
    
    return True
```

### 6. Check Current State
```python
def check_current_state():
    state = {
        "has_uncommitted_changes": False,
        "lens_files_modified": [],
        "current_branch": None,
        "head_commit": None
    }
    
    # Check for uncommitted changes
    status = run_command("git status --porcelain")
    if status.strip():
        state["has_uncommitted_changes"] = True
        for line in status.strip().split("\n"):
            if "lens" in line.lower() or "domain-map" in line.lower():
                state["lens_files_modified"].append(line.strip())
    
    # Get current branch and commit
    state["current_branch"] = run_command("git branch --show-current").strip()
    state["head_commit"] = run_command("git rev-parse HEAD").strip()
    
    return state
```

### 7. Create Pre-Rollback Backup
```python
def create_pre_rollback_backup():
    timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    
    # Create git tag for current state
    tag_name = f"lens-sync-pre-rollback-{timestamp}"
    run_command(f"git tag {tag_name}")
    
    # Create file backup if uncommitted changes exist
    backup_path = None
    if has_uncommitted_lens_changes():
        backup_dir = f"{docs_output_folder}/.lens-backups/{timestamp}/"
        makedirs(backup_dir)
        
        # Copy current lens files
        copy_tree(f"{lens_config_path}", f"{backup_dir}/config/")
        copy_tree(f"{docs_output_folder}/", f"{backup_dir}/docs/")
        
        backup_path = backup_dir
    
    return {
        "tag": tag_name,
        "backup_path": backup_path
    }
```

### 8. JIRA Integration Check (if enabled)
```yaml
jira_checks:
  enabled: from config.enable_jira_integration
  
  validations:
    - name: credentials_available
    - name: project_accessible
    - name: can_create_issues
```

### 9. Require Explicit Confirmation
```yaml
confirmation_required:
  message: |
    ⚠️  ROLLBACK WARNING
    
    This operation will restore lens data to a previous state.
    
    Current state:
    - Branch: {current_branch}
    - Commit: {head_commit}
    - Uncommitted changes: {has_uncommitted}
    
    Available rollback points: {N}
    
    A backup of the current state will be created before rollback.
    
    Do you want to proceed?
    
  require_explicit_yes: true
  skip_if: config.require_confirmation == false
```

### 10. Build Preflight Report
```yaml
preflight_status:
  workflow: rollback
  checked_at: ISO8601
  
  config_validation:
    status: pass|fail
    errors: [list]
    
  path_security:
    status: pass|fail
    resolved_paths:
      output_folder: string
      lens_config: string
      
  git_status:
    available: true
    current_branch: string
    head_commit: string
    has_uncommitted_changes: boolean
    lens_files_modified: [list]
    
  rollback_points:
    available: N
    by_type:
      git_tags: N
      git_commits: N
      manual_backups: N
    recent:
      - type: string
        ref: string
        date: string
        description: string
        
  pre_rollback_backup:
    tag: string
    backup_path: string|null
    
  jira_integration:
    enabled: boolean
    status: pass|fail|skipped
    
  confirmation:
    required: boolean
    received: boolean
    
  overall_status: pass|fail
  blocking_issues: [list]
  warnings: [list]
```

## Edge Cases and Failure Modes

| Condition | Action |
|-----------|--------|
| Git not available | FAIL: "Git required for rollback" |
| No rollback points found | FAIL: "No rollback points available" |
| Uncommitted changes in lens files | Warn, require confirmation |
| Pre-rollback backup fails | FAIL: "Cannot proceed without backup" |
| Disk space insufficient | FAIL: Check before backup |
| Current state is the only point | FAIL: "Nothing to rollback to" |
| Confirmation not received | FAIL: "Rollback cancelled" |

## Output
```yaml
preflight_status:
  status: pass|fail
  checked_at: ISO8601
  
  rollback_points:
    total: N
    list: [type, ref, date, description]
    
  current_state:
    branch: string
    commit: string
    has_changes: boolean
    
  backup:
    tag: string
    path: string|null
    
  blocking_issues: [list]
  warnings: [list]
```
