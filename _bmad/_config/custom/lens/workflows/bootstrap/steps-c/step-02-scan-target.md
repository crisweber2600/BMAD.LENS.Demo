---
name: 'step-02-scan-target'
description: 'Scan target project root for current structure'
nextStepFile: './step-03-compare-approve.md'
---

# Step 2: Scan Target Project

## Goal
Capture the current folder structure and available repositories under the target project root. Build a complete inventory of what exists to enable accurate gap analysis against the lens map.

## Instructions

### 1. Initialize Scan Configuration
```yaml
scan_config:
  root: {target_project_root}
  max_depth: {discovery_depth}        # from module config, default 4
  ignore_patterns:
    - node_modules/
    - .git/
    - __pycache__/
    - .venv/
    - dist/
    - build/
    - coverage/
    - .next/
    - .nuxt/
```

### 2. Recursive Directory Scan
Starting from `target_project_root`, build a tree structure:

**Scan procedure:**
```
for each directory at depth <= max_depth:
  1. Record directory name and path
  2. Check for .git subdirectory (indicates git repo)
  3. If .git exists:
     - Read .git/config for remote URLs
     - Get current branch: git rev-parse --abbrev-ref HEAD
     - Get last commit: git log -1 --format="%H %s" 
     - Check for uncommitted changes: git status --porcelain
  4. Detect project type indicators:
     - package.json → Node.js
     - requirements.txt / pyproject.toml → Python
     - pom.xml / build.gradle → Java
     - Cargo.toml → Rust
     - go.mod → Go
     - *.csproj → .NET
  5. Skip directories matching ignore_patterns
  6. Recurse into subdirectories
```

### 3. Build Target Structure Map
Construct parallel structure to lens_map for comparison:

```yaml
target_structure:
  scan_timestamp: ISO8601
  root_path: /absolute/path
  
  directories:
    - path: relative/path              # e.g., "platform/auth/auth-api"
      absolute_path: /full/path
      depth: N
      is_git_repo: boolean
      git_info:                        # only if is_git_repo
        remote_url: string
        current_branch: string
        last_commit_sha: string
        last_commit_message: string
        is_dirty: boolean
        dirty_files: [list]
      project_indicators:
        detected_type: string|null     # node, python, java, etc.
        manifest_files: [list]         # package.json, etc.
      children: [recursive]
  
  flat_inventory:                      # flattened for easy lookup
    - path: string
      absolute_path: string
      is_git_repo: boolean
      remote_url: string|null
      depth: N
```

### 4. Match Against Lens Map Paths
For each entry in `lens_map` (domains, services, microservices):
1. Compute expected absolute path
2. Check if path exists in `target_structure.flat_inventory`
3. If exists and is git repo, compare remote URL to expected `git_repo`
4. Classify match status:
   - `exists_matches`: path exists AND git remote matches
   - `exists_different_remote`: path exists but different git remote
   - `exists_no_repo`: path exists but no git repo (just folder)
   - `missing`: path does not exist
   - `extra`: path exists in target but not in lens map

### 5. Identify Orphan Directories
Find directories that exist in target but are NOT in lens map:
```
orphans = target_structure.directories 
          - lens_map expected paths
          - ignore_patterns
```

**Orphan classification:**
- `potential_microservice`: has .git and project manifest
- `empty_folder`: exists but no content
- `untracked_project`: has code but not in lens
- `archive_candidate`: old/unused directories

### 6. Collect Git Repository Status
For each identified git repo:
```bash
cd {repo_path}
git remote -v                          # all remotes
git branch -a                          # all branches
git fetch --dry-run 2>&1 || echo "fetch failed"  # test connectivity
git log --oneline -5                   # recent history
```

Aggregate into:
```yaml
repo_status:
  - path: string
    remote: string
    branch: string
    ahead_behind: "+N/-M"              # if trackable
    connectivity: ok|failed|unknown
    last_commits: [5 most recent]
```

## Edge Cases and Failure Modes

| Condition | Action |
|-----------|--------|
| Permission denied on directory | WARN, skip directory, record in scan_errors |
| Symlink cycle detected | WARN, skip, record max depth reached |
| .git directory is corrupted | WARN, mark as `git_status: corrupted` |
| Remote URL requires auth | Record as `connectivity: auth_required` |
| Directory has >10000 files | WARN about performance, suggest increasing ignore patterns |
| Path contains special characters | Normalize/escape for cross-platform compat |
| Scan takes >60 seconds | Show progress indicator, allow abort |

## Output
```yaml
target_structure:
  scan_timestamp: ISO8601
  root_path: string
  total_directories: N
  total_git_repos: N
  
  flat_inventory: [...]
  
  match_summary:
    exists_matches: N
    exists_different_remote: N
    exists_no_repo: N
    missing: N
    extra: N
  
  orphans:
    - path: string
      classification: string
  
  repo_status: [...]
  
  scan_errors: [list]
  scan_warnings: [list]
```
