---
name: 'step-00-preflight'
description: 'Preflight checks and guardrails'
nextStepFile: './step-01-detect-changes.md'
---

# Step 0: Preflight

## Goal
Validate prerequisites and guardrails before propagating lens documentation updates. This workflow modifies canonical lens files, so extra safety checks are critical.

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
  rollback_retention_days: N
  auto_commit: boolean
  propagation_scope: microservice|service|domain|all
```

**Validation:**
```python
def validate_config(config):
    errors = []
    
    if not config.get("target_project_root"):
        errors.append("target_project_root is required")
    elif not exists(config["target_project_root"]):
        errors.append(f"target_project_root not found: {config['target_project_root']}")
    
    if not config.get("docs_output_folder"):
        errors.append("docs_output_folder is required")
    
    return errors
```

### 2. Validate Path Security
**Critical:** Prevent path traversal attacks.

```python
def validate_output_path(docs_output_folder, target_project_root):
    # Resolve to absolute paths
    abs_output = os.path.abspath(docs_output_folder)
    abs_root = os.path.abspath(target_project_root)
    
    # Check containment
    if not abs_output.startswith(abs_root):
        raise SecurityError(f"Output folder must be inside project root")
    
    # Check for symlink escape
    real_output = os.path.realpath(abs_output)
    real_root = os.path.realpath(abs_root)
    if not real_output.startswith(real_root):
        raise SecurityError(f"Symlink escape detected")
    
    # Reject path traversal patterns
    if ".." in docs_output_folder:
        raise SecurityError(f"Path traversal patterns not allowed")
    
    return abs_output
```

### 3. Verify Source Inputs Exist
```yaml
source_verification:
  # Check microservice docs exist
  microservice_docs:
    path: "{docs_output_folder}/lens-sync/{microservice}/"
    required_files:
      - architecture.md
    check: at_least_one_target_has_docs
    
  # Or check analysis outputs exist
  analysis_outputs:
    path: "_memory/scout-sidecar/analysis/"
    check: recent_analysis_available
    max_age_hours: 24
```

**Verification logic:**
```python
def verify_source_inputs(config):
    sources_found = []
    
    # Check for existing microservice docs
    ms_docs_path = f"{config['docs_output_folder']}/lens-sync/"
    if exists(ms_docs_path):
        ms_folders = list_dirs(ms_docs_path)
        for folder in ms_folders:
            if exists(f"{ms_docs_path}/{folder}/architecture.md"):
                sources_found.append({"type": "microservice_doc", "target": folder})
    
    # Check for analysis outputs
    analysis_path = "_memory/scout-sidecar/analysis/"
    if exists(analysis_path):
        analysis_files = list_files(analysis_path, "*.yaml")
        for file in analysis_files:
            mtime = get_mtime(file)
            if age_hours(mtime) < 24:
                sources_found.append({"type": "analysis", "file": file})
    
    if not sources_found:
        raise PreflightError("No source inputs found for propagation")
    
    return sources_found
```

### 4. Git Safety Setup
**Mandatory:** Create safety net before modifying lens files.

```yaml
git_safety:
  checks:
    - name: git_available
      command: "git --version"
      required: true
      
    - name: in_git_repo
      command: "git rev-parse --git-dir"
      required: true
      
    - name: clean_working_tree
      command: "git status --porcelain"
      expected: empty or lens files only
      action_if_dirty: warn_and_continue|stash|fail
      
  safety_actions:
    - action: create_rollback_snapshot
      description: "Tag current state for rollback"
      command: "git tag lens-sync-pre-update-{timestamp}"
      
    - action: create_working_branch
      description: "Branch for update changes"
      command: "git checkout -b lens-update/{timestamp}"
      conditional: if auto_commit enabled
```

**Implementation:**
```python
def setup_git_safety(config):
    # Verify git available
    if not command_exists("git"):
        raise PreflightError("Git is required for update-lens workflow")
    
    # Create rollback tag
    timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    tag_name = f"lens-sync-pre-update-{timestamp}"
    
    run_command(f"git tag {tag_name}")
    log(f"Created rollback snapshot: {tag_name}")
    
    # Optionally create working branch
    if config.get("auto_commit"):
        branch_name = f"lens-update/{timestamp}"
        run_command(f"git checkout -b {branch_name}")
        log(f"Created working branch: {branch_name}")
    
    return {
        "rollback_tag": tag_name,
        "working_branch": branch_name if config.get("auto_commit") else None
    }
```

### 5. JIRA Integration Check (if enabled)
```yaml
jira_checks:
  enabled: from config.enable_jira_integration
  
  validations:
    - name: credentials_available
      check: JIRA_API_TOKEN env var or config
      
    - name: project_accessible
      check: API call to project endpoint
      
    - name: permissions_sufficient
      check: Can create/update issues
```

### 6. Identify Propagation Scope
```yaml
propagation_scope:
  mode: from config.propagation_scope or 'all'
  
  microservice:
    description: "Only update microservice-level docs"
    actions: [update_ms_docs]
    
  service:
    description: "Aggregate microservice docs to service level"
    actions: [update_ms_docs, aggregate_to_service]
    
  domain:
    description: "Propagate all the way to domain level"
    actions: [update_ms_docs, aggregate_to_service, propagate_to_domain]
    
  all:
    description: "Full propagation including domain-map updates"
    actions: [update_ms_docs, aggregate_to_service, propagate_to_domain, update_domain_map]
```

### 7. Build Preflight Report
```yaml
preflight_status:
  workflow: update-lens
  checked_at: ISO8601
  
  config_validation:
    status: pass|fail
    errors: [list]
    
  path_security:
    status: pass|fail
    resolved_output_path: string
    
  source_inputs:
    status: pass|fail
    sources_found: N
    sources: [list]
    
  git_safety:
    status: pass|fail
    rollback_tag: string
    working_branch: string|null
    
  jira_integration:
    enabled: boolean
    status: pass|fail|skipped
    
  propagation_scope:
    mode: string
    actions_planned: [list]
    
  overall_status: pass|fail
  blocking_issues: [list]
  warnings: [list]
```

## Edge Cases and Failure Modes

| Condition | Action |
|-----------|--------|
| Git not available | FAIL: "Git required for safe lens updates" |
| Dirty working tree with non-lens files | WARN and require confirmation |
| No source inputs found | FAIL: "Nothing to propagate" |
| Output path outside project | FAIL: Security violation |
| JIRA enabled but credentials missing | WARN, disable JIRA for this run |
| Previous update in progress | Check for lock file, fail if locked |
| Rollback tag creation fails | FAIL: Cannot proceed without safety net |

## Output
```yaml
preflight_status:
  status: pass|fail
  checked_at: ISO8601
  
  resolved_paths:
    output_folder: string
    lens_config: string
    
  source_inputs:
    count: N
    types: [microservice_doc, analysis]
    
  git_safety:
    rollback_tag: string
    working_branch: string|null
    
  propagation_scope: string
  jira_enabled: boolean
  
  blocking_issues: [list]
  warnings: [list]
```
