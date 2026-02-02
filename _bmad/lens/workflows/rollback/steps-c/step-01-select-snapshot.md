---
name: 'step-01-select-snapshot'
description: 'Select rollback point'
nextStepFile: './step-02-apply.md'
---

# Step 1: Select Snapshot

## Goal
Present available rollback points and capture the user's selection. Provide context to help make an informed decision.

## Instructions

### 1. Retrieve Rollback Points from Preflight
```python
def get_rollback_points(preflight_status):
    return preflight_status["rollback_points"]["list"]
```

### 2. Enrich Rollback Point Details
```python
def enrich_rollback_point(point):
    enriched = dict(point)
    
    if point["type"] == "git_tag":
        # Get commit info for tag
        commit = run_command(f"git rev-list -1 {point['ref']}")
        enriched["commit"] = commit.strip()
        
        # Get files changed since this tag
        diff = run_command(f"git diff --name-only {point['ref']} HEAD")
        enriched["files_changed_since"] = diff.strip().split("\n")
        enriched["change_count"] = len(enriched["files_changed_since"])
        
    elif point["type"] == "git_commit":
        # Get commit details
        details = run_command(f"git show --stat {point['ref']} --format='%an|%ae|%s'")
        lines = details.strip().split("\n")
        author_info = lines[0].split("|")
        
        enriched["author"] = author_info[0]
        enriched["email"] = author_info[1]
        enriched["message"] = author_info[2]
        
        # Get lens-specific changes in this commit
        lens_changes = run_command(
            f"git show --name-only {point['ref']} -- '**/domain-map.yaml' '**/lens-sync/**'"
        )
        enriched["lens_files_changed"] = [f for f in lens_changes.strip().split("\n") if f]
        
    elif point["type"] == "manual_backup":
        # Get backup contents
        backup_path = point["ref"]
        enriched["contents"] = {
            "config": list_files(f"{backup_path}/config/"),
            "docs": list_files(f"{backup_path}/docs/")
        }
        enriched["total_files"] = len(enriched["contents"]["config"]) + len(enriched["contents"]["docs"])
    
    return enriched
```

### 3. Calculate Impact Assessment
```python
def calculate_impact(point, current_state):
    impact = {
        "severity": "low",
        "files_affected": 0,
        "commits_reverted": 0,
        "warnings": []
    }
    
    if point["type"] in ["git_tag", "git_commit"]:
        # Count commits between point and HEAD
        commit_count = run_command(
            f"git rev-list --count {point['ref']}..HEAD"
        ).strip()
        impact["commits_reverted"] = int(commit_count)
        
        # Get files that would change
        diff_files = run_command(
            f"git diff --name-only {point['ref']} HEAD"
        ).strip().split("\n")
        impact["files_affected"] = len([f for f in diff_files if f])
        
        # Assess severity
        if impact["commits_reverted"] > 10:
            impact["severity"] = "high"
            impact["warnings"].append(f"Rolling back {impact['commits_reverted']} commits")
        elif impact["commits_reverted"] > 3:
            impact["severity"] = "medium"
    
    return impact
```

### 4. Present Selection Interface
```markdown
## Available Rollback Points

{For each point, sorted by date descending}
### Option {N}: {point.description}

| Attribute | Value |
|-----------|-------|
| Type | {point.type} |
| Reference | `{point.ref}` |
| Date | {point.date} |
| Age | {human_readable_age} |

{If git_tag or git_commit}
**Changes since this point:**
- {impact.commits_reverted} commits would be reverted
- {impact.files_affected} files affected

{If high severity}
⚠️ **Warning:** This is a significant rollback.
{End if}
{End if}

{If manual_backup}
**Backup contents:**
- Config files: {N}
- Doc files: {N}
{End if}

---
{End for}

## Selection

Enter the option number (1-{N}) or the reference (tag/commit/path) to select:
```

### 5. Validate Selection
```python
def validate_selection(selection, available_points):
    # Try as option number
    if selection.isdigit():
        index = int(selection) - 1
        if 0 <= index < len(available_points):
            return available_points[index]
    
    # Try as reference
    for point in available_points:
        if point["ref"] == selection:
            return point
        if point["ref"].startswith(selection):  # Partial match
            return point
    
    raise SelectionError(f"Invalid selection: {selection}")
```

### 6. Confirm Selection
```yaml
selection_confirmation:
  message: |
    ## Confirm Rollback Selection
    
    You have selected:
    
    - **Type:** {selected.type}
    - **Reference:** `{selected.ref}`
    - **Date:** {selected.date}
    - **Description:** {selected.description}
    
    **Impact:**
    - Commits reverted: {impact.commits_reverted}
    - Files affected: {impact.files_affected}
    - Severity: {impact.severity}
    
    {If warnings}
    **Warnings:**
    {For each warning}
    - ⚠️ {warning}
    {End for}
    {End if}
    
    **Current state backup:** {preflight.backup.tag}
    
    Proceed with this rollback point? (yes/no)
```

### 7. Preview Changes (optional)
```python
def preview_changes(selected_point):
    if selected_point["type"] in ["git_tag", "git_commit"]:
        # Show diff summary
        diff = run_command(
            f"git diff --stat {selected_point['ref']} HEAD -- '**/domain-map.yaml' '**/lens-sync/**'"
        )
        return {
            "type": "git_diff",
            "summary": diff
        }
    
    elif selected_point["type"] == "manual_backup":
        # Compare backup contents with current
        return {
            "type": "file_comparison",
            "backup_files": selected_point["contents"],
            "current_files": get_current_lens_files()
        }
```

### 8. Build Rollback Point Output
```yaml
rollback_point:
  selected_at: ISO8601
  
  selection:
    type: git_tag|git_commit|manual_backup
    ref: string
    date: ISO8601
    description: string
    
  details:
    # For git_tag/git_commit
    commit: string
    author: string
    files_changed_since: [list]
    
    # For manual_backup
    contents:
      config: [list]
      docs: [list]
      
  impact:
    severity: low|medium|high
    commits_reverted: N
    files_affected: N
    warnings: [list]
    
  preview:
    diff_summary: string
    
  confirmation:
    received: true
    confirmed_at: ISO8601
```

## Edge Cases and Failure Modes

| Condition | Action |
|-----------|--------|
| No rollback points | FAIL: "No rollback points available" |
| Invalid selection | Prompt for re-selection |
| Selection cancelled | FAIL: "Rollback cancelled by user" |
| Point no longer valid | Re-verify before proceeding |
| High severity selection | Require explicit confirmation |
| Ambiguous selection | Show matching options, ask to clarify |

## Output
```yaml
rollback_point:
  type: git_tag|git_commit|manual_backup
  ref: string
  date: ISO8601
  description: string
  
  impact:
    severity: low|medium|high
    commits_reverted: N
    files_affected: N
    
  confirmed: true
```
