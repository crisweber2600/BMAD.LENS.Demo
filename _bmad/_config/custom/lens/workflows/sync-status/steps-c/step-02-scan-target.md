---
name: 'step-02-scan-target'
description: 'Scan target project root'
nextStepFile: './step-03-compare-report.md'
---

# Step 2: Scan Target

## Goal
Capture current folder structure under `target_project_root` with full git repository status. Build a comprehensive inventory for drift comparison.

## Instructions

### 1. Configure Scan Parameters
```yaml
scan_config:
  root: {target_project_root}
  max_depth: {discovery_depth}
  follow_symlinks: false
  ignore_patterns:
    - node_modules/
    - .git/          # ignore .git contents, not .git itself
    - __pycache__/
    - .venv/
    - venv/
    - dist/
    - build/
    - coverage/
    - .next/
    - .nuxt/
    - target/        # Java/Maven
    - vendor/        # Go, PHP
```

### 2. Directory Tree Scan
Build complete tree:

```yaml
target_structure:
  root: {target_project_root}
  scan_timestamp: ISO8601
  
  tree:
    - path: "platform/"
      type: directory
      children:
        - path: "platform/auth/"
          type: directory
          is_git_repo: true
          children: [...]
```

For each directory:
1. Record path (relative to root)
2. Check for `.git/` subdirectory
3. If git repo, extract git status
4. Continue recursion up to max_depth

### 3. Git Repository Deep Scan
For each directory containing `.git/`:

```bash
cd {repo_path}

# Get remote information
git remote -v
# Parse: origin    git@github.com:org/repo.git (fetch)

# Get current branch
git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "detached"

# Get commit info
git log -1 --format="%H|%ai|%s"
# Parse: sha|datetime|message

# Check for uncommitted changes
git status --porcelain
# Non-empty = dirty

# Check if ahead/behind tracking branch
git rev-list --left-right --count HEAD...@{upstream} 2>/dev/null
# Parse: ahead\tbehind

# Get tracking branch
git rev-parse --abbrev-ref --symbolic-full-name @{upstream} 2>/dev/null
# e.g., origin/main

# List local branches
git branch --format='%(refname:short)'
```

Build per-repo status:
```yaml
git_status:
  remote_url: string
  current_branch: string
  tracking_branch: string|null
  last_commit:
    sha: string
    timestamp: ISO8601
    message: string
  is_dirty: boolean
  dirty_files:
    modified: [list]
    untracked: [list]
    staged: [list]
  ahead: N
  behind: N
  local_branches: [list]
  detached: boolean
```

### 4. Detect Non-Lens Items (Extras)
Find items in target not defined in lens:

```yaml
extra_items:
  directories:
    - path: "experiments/"
      has_git: false
      classification: unknown_folder
    - path: "legacy/old-api/"
      has_git: true
      remote: git@github.com:org/old-api.git
      classification: potential_orphan
  
  files_at_root:
    - path: "docker-compose.yaml"
    - path: "Makefile"
```

**Classification rules:**
- `unknown_folder`: No git, no project manifests
- `potential_orphan`: Has git, not in lens
- `infrastructure`: docker-compose, terraform, etc.
- `config_files`: root-level configs

### 5. Build Flat Inventory
For efficient comparison with lens_map:

```yaml
flat_inventory:
  - path: "platform/"
    exists: true
    type: directory
    
  - path: "platform/auth/"
    exists: true
    type: directory
    is_git_repo: false
    
  - path: "platform/auth/auth-api/"
    exists: true
    type: directory
    is_git_repo: true
    git:
      remote_url: "git@github.com:org/auth-api.git"
      branch: "main"
      is_dirty: false
      last_commit_age_days: 3
```

### 6. Gather Drift Signals
Pre-compute signals for drift detection:

```yaml
drift_signals:
  # Repos with uncommitted changes
  dirty_repos:
    - path: string
      dirty_file_count: N
  
  # Repos behind tracking branch
  behind_repos:
    - path: string
      commits_behind: N
  
  # Repos with local-only branches
  local_branch_repos:
    - path: string
      local_only_branches: [list]
  
  # Recently modified (last 24h)
  recently_modified:
    - path: string
      last_commit_timestamp: ISO8601
```

## Edge Cases and Failure Modes

| Condition | Action |
|-----------|--------|
| Permission denied | WARN, skip path, record in scan_errors |
| Symlink loop | Detect via inode tracking, skip |
| Corrupted .git | WARN, mark as `git_status: corrupted` |
| Submodule detected | Record separately as `type: submodule` |
| >1000 directories | Show progress, warn about scan time |
| Path with special chars | URL-encode for cross-platform compat |
| Empty directory | Record with `type: empty_directory` |

## Output
```yaml
target_structure:
  scan_timestamp: ISO8601
  root: string
  
  statistics:
    total_directories: N
    total_git_repos: N
    total_files_at_root: N
    
  flat_inventory: [...]
  
  extra_items:
    directories: [...]
    files: [...]
    
  drift_signals:
    dirty_repos: N
    behind_repos: N
    recently_modified: N
    
  scan_errors: [list]
  scan_warnings: [list]
```
