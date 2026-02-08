---
name: onboarding
description: Full onboarding — profile, repo reconciliation, state init, welcome
agent: scout
trigger: "@scout onboard" or "@lens-work onboard"
category: utility
first_run: true
---

# Onboarding Workflow

**Purpose:** Create user profile, reconcile TargetProjects against service map, initialize personal state, and orient new team members with next steps.

**⚠️ CRITICAL:** Profile settings override equivalent values in `bmad-config.yaml`. Repo reconciliation delegates health checks to the `check-repos` workflow. State initialization detects legacy format and suggests migration.

---

## Input Parameters

```yaml
# None required — all inputs gathered interactively
```

---

## Execution Sequence

### 0. Welcome

```
🔭 Welcome to LENS Workbench!

I'm Scout, your setup guide. I'll walk you through:
1. Creating your personal profile
2. Reconciling your TargetProjects repos
3. Initializing your workbench state
4. Getting you ready to start building

This takes about 3-5 minutes. Ready? [Y]es / [L]ater
```

```yaml
response = prompt_user("[Y]es / [L]ater")
if response == "L":
  output: "No problem — run @scout onboard when you're ready."
  exit: 0
```

---

## Section 1: Profile Creation

### 1.1 Read Git Config

```bash
# Auto-detect identity from git config
git_user_name=$(git config user.name 2>/dev/null || echo "")
git_user_email=$(git config user.email 2>/dev/null || echo "")

if [ -z "$git_user_name" ]; then
  echo "⚠️ git config user.name not set"
fi
if [ -z "$git_user_email" ]; then
  echo "⚠️ git config user.email not set"
fi
```

```yaml
if git_user_name != "":
  output: "👤 Detected git identity: ${git_user_name} <${git_user_email}>"
  output: "Use this? [Y]es / [N]o (enter manually)"
  confirm = prompt_user()
  if confirm == "N":
    git_user_name = prompt_user("Enter your name:")
    git_user_email = prompt_user("Enter your email:")
else:
  git_user_name = prompt_user("Enter your name:")
  git_user_email = prompt_user("Enter your email:")
```

### 1.2 Select Role

```yaml
output: |
  🎭 What's your primary role?
  
  [1] Developer
  [2] PM (Product Manager)
  [3] Architect
  [4] Tech Lead
  [5] Scrum Master

role_choice = prompt_user("[1-5]")

role_map = {
  "1": "Developer",
  "2": "PM",
  "3": "Architect",
  "4": "Tech Lead",
  "5": "Scrum Master"
}

selected_role = role_map[role_choice]
output: "Role: ${selected_role} ✓"
```

### 1.3 Select Preferred Lane

```yaml
output: |
  🛤️ What's your preferred initiative size?
  
  [1] small  — Solo dev, fast iteration (1 reviewer)
  [2] medium — Small team, structured reviews (2-3 reviewers)
  [3] large  — Full team, formal gates (lead + architect review)

lane_choice = prompt_user("[1-3]")

lane_map = {
  "1": "small",
  "2": "medium",
  "3": "large"
}

selected_lane = lane_map[lane_choice]
output: "Lane: ${selected_lane} ✓"
```

### 1.4 Save Profile

```yaml
profile = {
  name: git_user_name,
  email: git_user_email,
  role: selected_role,
  preferred_lane: selected_lane,
  created_at: now_iso(),
  preferences: {
    auto_fetch: true,
    status_on_start: true,
    color_output: true
  }
}

# Ensure output directory exists
mkdir_p("_bmad-output/personal")

save(profile, "_bmad-output/personal/profile.yaml")
```

Profile file format:

```yaml
# _bmad-output/personal/profile.yaml
name: "Jane Smith"
email: "jane.smith@example.com"
role: "Developer"
preferred_lane: "small"
created_at: "2026-02-05T14:30:00Z"
preferences:
  auto_fetch: true
  status_on_start: true
  color_output: true
```

> **Note:** Profile values override equivalent settings in `bmad-config.yaml`. For example, `preferred_size` in the profile takes precedence over any default size configured at the project level.

```yaml
output: |
  ✅ Profile saved to _bmad-output/personal/profile.yaml
  
  ${git_user_name} (${selected_role}) — size: ${selected_lane}
```

---

## Section 2: Repository Reconciliation

### 2.1 Load Expected Repos (Service Map)

```yaml
# Load service map from standard locations
service_map_paths:
  - "_bmad/lens-work/service-map.yaml"
  - "_lens/domain-map.yaml"
  - "lens/domain-map.yaml"

service_map = null
for path in service_map_paths:
  if file_exists(path):
    service_map = load(path)
    service_map_path = path
    break

if service_map == null:
  output: |
    ⚠️ No service map found. Skipping repo reconciliation.
    
    Create a service map at _bmad/lens-work/service-map.yaml
    then run @scout onboard again to reconcile repos.
  skip_reconciliation = true
else:
  output: "📋 Service map loaded from: ${service_map_path}"
  skip_reconciliation = false
```

### 2.2 Load Existing Inventory

```yaml
if not skip_reconciliation:
  inventory_path = "_bmad-output/lens-work/repo-inventory.yaml"
  
  if file_exists(inventory_path):
    existing_inventory = load(inventory_path)
    output: "📦 Existing inventory found (last scanned: ${existing_inventory.scanned_at})"
  else:
    existing_inventory = null
    output: "📦 No existing inventory — will create fresh"
```

### 2.3 Scan TargetProjects Directory

```bash
# Build actual repo list by scanning for .git directories
target_projects_path="${service_map.target_projects_path:-TargetProjects}"

actual_repos=()
for dir in $(find "${target_projects_path}" -maxdepth 5 -type d -name ".git" -exec dirname {} \;); do
  repo_name=$(basename "$dir")
  repo_path=$(realpath --relative-to="." "$dir")
  remote=$(git -C "$dir" remote get-url origin 2>/dev/null || echo "no-remote")
  branch=$(git -C "$dir" branch --show-current 2>/dev/null || echo "detached")
  commit=$(git -C "$dir" rev-parse --short HEAD 2>/dev/null || echo "unknown")
  uncommitted=$(git -C "$dir" status --porcelain 2>/dev/null | wc -l)
  
  actual_repos+=("${repo_name}|${repo_path}|${remote}|${branch}|${commit}|${uncommitted}")
done
```

### 2.4 Compare Expected vs Actual

```yaml
if not skip_reconciliation:
  comparison = {
    matched: [],
    missing: [],
    extra: [],
    issues: []
  }

  # Check each expected repo from service map
  for expected in service_map.repos:
    found = find_in(actual_repos, expected.name)
    
    if found:
      entry = {
        name: expected.name,
        path: found.path,
        remote: found.remote,
        current_branch: found.branch,
        last_commit: found.commit,
        has_uncommitted: found.uncommitted > 0,
        is_git_repo: true
      }
      comparison.matched.append(entry)
      
      # Check for issues
      if found.uncommitted > 0:
        comparison.issues.append({
          repo: expected.name,
          issue: "uncommitted_changes",
          detail: "${found.uncommitted} uncommitted file(s)"
        })
      
      if found.branch != expected.default_branch:
        comparison.issues.append({
          repo: expected.name,
          issue: "wrong_branch",
          detail: "On '${found.branch}', expected '${expected.default_branch}'"
        })
    else:
      comparison.missing.append({
        name: expected.name,
        expected_path: expected.local_path,
        remote: expected.remote_url,
        action: "clone"
      })

  # Check for extra repos not in service map
  for actual in actual_repos:
    if actual.name not in [r.name for r in service_map.repos]:
      comparison.extra.append({
        name: actual.name,
        path: actual.path,
        remote: actual.remote,
        note: "Not in service map"
      })
```

### 2.5 Present Reconciliation Plan

```yaml
if not skip_reconciliation:
  output: |
    📊 Repo Reconciliation Results
    ═══════════════════════════════
    ├── ✅ Matched: ${comparison.matched.length} repos
    ├── ⚠️ Missing: ${comparison.missing.length} repos
    ├── ❓ Extra: ${comparison.extra.length} repos
    └── 🔧 Issues: ${comparison.issues.length}
  
  # Handle missing repos
  if comparison.missing.length > 0:
    output: |
      
      📥 Missing repos (need clone):
      ${for repo in comparison.missing}
        - ${repo.name}: ${repo.remote}
          → ${repo.expected_path}
      ${endfor}
      
      Clone missing repos? [Y]es / [N]o / [S]elect individually
    
    clone_choice = prompt_user()
    
    if clone_choice == "Y":
      for repo in comparison.missing:
        output: "Cloning ${repo.name}..."
        shell: git clone "${repo.remote}" "${repo.expected_path}"
    elif clone_choice == "S":
      for repo in comparison.missing:
        output: "Clone ${repo.name}? [Y/N]"
        if prompt_user() == "Y":
          shell: git clone "${repo.remote}" "${repo.expected_path}"
  
  # Handle extra repos
  if comparison.extra.length > 0:
    output: |
      
      ❓ Extra repos (not in service map):
      ${for repo in comparison.extra}
        - ${repo.name} at ${repo.path}
      ${endfor}
      
      Add to service map? [Y]es / [I]gnore / [S]elect individually
    
    extra_choice = prompt_user()
    
    if extra_choice == "Y":
      for repo in comparison.extra:
        service_map.repos.append({
          name: repo.name,
          local_path: repo.path,
          remote_url: repo.remote,
          default_branch: "main"
        })
      save(service_map, service_map_path)
      output: "✅ Service map updated with ${comparison.extra.length} new repo(s)"
    elif extra_choice == "S":
      for repo in comparison.extra:
        output: "Add ${repo.name} to service map? [Y/N]"
        if prompt_user() == "Y":
          service_map.repos.append({
            name: repo.name,
            local_path: repo.path,
            remote_url: repo.remote,
            default_branch: "main"
          })
      save(service_map, service_map_path)
  
  # Handle issues
  if comparison.issues.length > 0:
    output: |
      
      🔧 Issues detected:
      ${for issue in comparison.issues}
        - ${issue.repo}: ${issue.issue} — ${issue.detail}
      ${endfor}
    
    # Wrong branch issues
    branch_issues = [i for i in comparison.issues if i.issue == "wrong_branch"]
    if branch_issues.length > 0:
      output: "Fix branch issues (checkout default branch)? [Y]es / [N]o"
      if prompt_user() == "Y":
        for issue in branch_issues:
          repo = find_repo(comparison.matched, issue.repo)
          shell: git -C "${repo.path}" checkout "${service_map.get_default_branch(issue.repo)}"
    
    # Uncommitted changes — warn only
    uncommitted_issues = [i for i in comparison.issues if i.issue == "uncommitted_changes"]
    if uncommitted_issues.length > 0:
      output: |
        ⚠️ Repos with uncommitted changes (manual action needed):
        ${for issue in uncommitted_issues}
          - ${issue.repo}: ${issue.detail}
        ${endfor}
```

### 2.6 Delegate Health Checks

```yaml
if not skip_reconciliation:
  # Delegate per-repo health checks to check-repos workflow
  invoke: scout.check-repos
  params:
    repos: comparison.matched
    verbose: false
  
  health_results = check_repos_output
```

---

## Section 3: Inventory Update

### 3.1 Build Reconciled Inventory

```yaml
if not skip_reconciliation:
  # Re-scan after reconciliation (repos may have been cloned/fixed)
  reconciled_repos = []
  
  for expected in service_map.repos:
    repo_dir = expected.local_path
    
    if dir_exists(repo_dir) AND is_git_repo(repo_dir):
      remote = shell("git -C '${repo_dir}' remote get-url origin 2>/dev/null") or "no-remote"
      branch = shell("git -C '${repo_dir}' branch --show-current 2>/dev/null") or "detached"
      commit = shell("git -C '${repo_dir}' rev-parse --short HEAD 2>/dev/null") or "unknown"
      uncommitted = shell("git -C '${repo_dir}' status --porcelain 2>/dev/null | wc -l")
      
      # Extract domain/service from path structure
      path_parts = expected.local_path.split("/")
      domain = path_parts[1] if path_parts.length >= 3 else "default"
      service = path_parts[2] if path_parts.length >= 4 else "default"
      
      reconciled_repos.append({
        name: expected.name,
        path: expected.local_path,
        remote: remote,
        current_branch: branch,
        last_commit: commit,
        has_uncommitted: int(uncommitted) > 0,
        is_git_repo: true,
        domain: domain,
        service: service,
        last_scanned: now_iso()
      })
    else:
      reconciled_repos.append({
        name: expected.name,
        path: expected.local_path,
        remote: expected.remote_url or "unknown",
        current_branch: "n/a",
        last_commit: "n/a",
        has_uncommitted: false,
        is_git_repo: false,
        domain: "unknown",
        service: "unknown",
        last_scanned: now_iso()
      })
```

### 3.2 Write Inventory

Write to `_bmad-output/lens-work/repo-inventory.yaml`:

```yaml
version: 2
scanned_at: "${ISO_TIMESTAMP}"
onboarding_run: true

repos:
  - name: "{repo_name}"
    path: "TargetProjects/{domain}/{service}/{repo_name}"
    remote: "{remote_url}"
    current_branch: "{branch}"
    last_commit: "{commit_hash}"
    has_uncommitted: false
    is_git_repo: true
    domain: "{domain}"
    service: "{service}"
    last_scanned: "{ISO_TIMESTAMP}"

summary:
  total_expected: ${service_map.repos.length}
  total_found: ${reconciled_repos.filter(r => r.is_git_repo).length}
  healthy: ${healthy_count}
  issues: ${issue_count}
```

```yaml
if not skip_reconciliation:
  inventory = {
    version: 2,
    scanned_at: now_iso(),
    onboarding_run: true,
    repos: reconciled_repos,
    summary: {
      total_expected: service_map.repos.length,
      total_found: reconciled_repos.filter(r => r.is_git_repo).length,
      healthy: reconciled_repos.filter(r => r.is_git_repo AND not r.has_uncommitted).length,
      issues: comparison.issues.length
    }
  }
  
  save(inventory, "_bmad-output/lens-work/repo-inventory.yaml")
  output: "✅ Inventory updated: _bmad-output/lens-work/repo-inventory.yaml"
```

---

## Section 4: State Initialization

### 4.1 Check Existing State

```yaml
state_path = "_bmad-output/lens-work/state.yaml"

if file_exists(state_path):
  existing_state = load(state_path)
  output: "📍 Existing state found"
  
  # Check for legacy single-file format
  if existing_state.initiative != null AND existing_state.active_initiative == null:
    output: |
      ⚠️ Legacy state format detected (single-file).
      The current format uses two-file architecture:
        - state.yaml (personal state + active initiative pointer)
        - initiatives/{id}.yaml (initiative config)
      
      Run @tracey migrate-state to upgrade.
    legacy_detected = true
  else:
    legacy_detected = false
else:
  output: "📍 No state file — will create initial state"
  legacy_detected = false
```

### 4.2 Create Initial State (if needed)

```yaml
if not file_exists(state_path):
  initial_state = {
    version: 2,
    active_initiative: null,
    profile_ref: "_bmad-output/personal/profile.yaml",
    current: {
      phase: null,
      phase_name: null,
      workflow: null,
      workflow_status: "idle",
      size: selected_lane
    },
    last_updated: now_iso()
  }
  
  save(initial_state, state_path)
  output: "✅ State initialized: ${state_path}"
```

### 4.3 Check for Existing Initiatives

```yaml
initiatives_dir = "_bmad-output/lens-work/initiatives"

if dir_exists(initiatives_dir):
  initiative_files = list_files(initiatives_dir, "*.yaml")
  initiative_count = initiative_files.length
  
  if initiative_count > 0:
    output: |
      📂 Found ${initiative_count} existing initiative(s):
      ${for file in initiative_files}
        - ${file.name_without_ext}
      ${endfor}
else:
  mkdir_p(initiatives_dir)
  initiative_count = 0
  output: "📂 Created initiatives directory: ${initiatives_dir}"
```

### 4.4 Ensure Event Log Exists

```yaml
event_log_path = "_bmad-output/lens-work/event-log.jsonl"

if not file_exists(event_log_path):
  touch(event_log_path)
  output: "📝 Created event log: ${event_log_path}"

# Log onboarding event
append_jsonl(event_log_path, {
  ts: now_iso(),
  event: "onboarding",
  user: git_user_name,
  role: selected_role,
  size: selected_lane,
  repos_tracked: reconciled_repos.length or 0
})
```

---

## Section 5: Welcome and Next Steps

### 5.1 Compute Summary Counts

```yaml
if not skip_reconciliation:
  repos_tracked = inventory.summary.total_found
  repos_healthy = inventory.summary.healthy
  repos_issues = inventory.summary.issues
else:
  repos_tracked = 0
  repos_healthy = 0
  repos_issues = 0
```

### 5.2 Display Completion

```
✅ Onboarding complete!
├── Profile: _bmad-output/personal/profile.yaml
├── Repos: ${repos_tracked} tracked, ${repos_healthy} healthy, ${repos_issues} issues
├── State: initialized
├── Initiatives: ${initiative_count} found
│
├── 🚀 Next Steps:
│   ├── Start a new feature: @compass /new-feature "your feature"
│   ├── Switch context: @compass /switch
│   ├── Check status: @compass ?
│   └── Get help: @compass H
```

---

## Error Handling

| Error | Recovery |
|-------|----------|
| `git config` not set | Prompt for name/email manually |
| Service map not found | Skip reconciliation, warn user to create one |
| Clone fails | Log error, continue with remaining repos, report at end |
| State file corrupted | Back up existing, create fresh state |
| Initiatives dir inaccessible | Create directory, warn if permission error |
| Legacy state detected | Do not overwrite — suggest `@tracey migrate-state` |
| Profile already exists | Ask: overwrite / keep existing / merge |

---

## Post-Conditions

- [ ] Profile saved to `_bmad-output/personal/profile.yaml`
- [ ] Service map loaded and reconciled against TargetProjects
- [ ] Missing repos offered for cloning; extra repos offered for service-map addition
- [ ] Repo inventory updated at `_bmad-output/lens-work/repo-inventory.yaml`
- [ ] `_bmad-output/lens-work/state.yaml` exists (created or preserved)
- [ ] `_bmad-output/lens-work/initiatives/` directory exists
- [ ] `_bmad-output/lens-work/event-log.jsonl` has onboarding event
- [ ] Legacy state format detected and migration suggested (if applicable)
- [ ] Completion summary displayed with next-step commands
