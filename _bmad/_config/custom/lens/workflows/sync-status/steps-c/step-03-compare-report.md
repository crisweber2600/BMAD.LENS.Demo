---
name: 'step-03-compare-report'
description: 'Compare structures and write drift report'
outputFile: '{project-root}/_bmad-output/sync-status-report.md'
---

# Step 3: Compare & Report

## Goal
Compare lens map to target structure, classify sync status for each item, identify conflicts, and write a comprehensive drift report.

## Instructions

### 1. Item-by-Item Comparison
For each item in `lens_map.expected_paths`:

```yaml
comparison_entry:
  lens_path: string
  lens_type: domain|service|microservice
  expected_git_remote: string|null
  expected_branch: string|null
  
  target_exists: boolean
  target_is_git_repo: boolean|null
  target_git_remote: string|null
  target_git_branch: string|null
  target_is_dirty: boolean|null
  
  sync_status: synced|drifted|missing|conflicted
  drift_details: {...}|null
```

### 2. Sync Status Classification
Apply classification rules:

| Condition | Status | Details |
|-----------|--------|---------|
| Target doesn't exist | `missing` | Need to create/clone |
| Exists, no git expected, none found | `synced` | Folder matches |
| Exists, git expected, matches remote+branch | `synced` | Fully in sync |
| Exists, git expected, different remote | `conflicted` | Remote mismatch |
| Exists, git expected, different branch | `drifted` | Branch drift |
| Exists, git expected, has uncommitted changes | `drifted` | Local changes |
| Exists, git expected, behind tracking | `drifted` | Needs pull |
| Exists, git expected, ahead of tracking | `drifted` | Needs push |
| Exists, git expected, detached HEAD | `drifted` | Not on branch |
| Exists, no git expected, git found | `drifted` | Unexpected repo |

### 3. Drift Categorization
Group drift items by type:

```yaml
drift_analysis:
  structural_drift:
    missing_domains: [list]
    missing_services: [list]
    missing_microservices: [list]
    unexpected_items: [list]
  
  git_drift:
    remote_mismatches:
      - path: string
        expected: string
        actual: string
    branch_drift:
      - path: string
        expected: string
        actual: string
    uncommitted_changes:
      - path: string
        files_modified: N
        files_untracked: N
    behind_tracking:
      - path: string
        commits_behind: N
    ahead_tracking:
      - path: string
        commits_ahead: N
    detached_head:
      - path: string
        current_sha: string
  
  metadata_drift:
    stale_docs:
      - path: string
        days_since_update: N
    stale_analysis:
      - path: string
        days_since_analysis: N
```

### 4. Conflict Identification
Flag items requiring human decision:

```yaml
conflicts:
  - id: "conflict-{N}"
    path: string
    type: remote_mismatch|merge_conflict|path_collision
    severity: high|medium|low
    description: string
    lens_value: string
    target_value: string
    suggested_resolutions:
      - "Update lens to match target"
      - "Reset target to match lens"
      - "Manual investigation required"
```

**Severity rules:**
- `high`: Remote URL mismatch (data loss risk)
- `medium`: Branch mismatch, significant drift
- `low`: Minor drift (uncommitted changes, behind tracking)

### 5. Generate Summary Statistics
```yaml
sync_summary:
  timestamp: ISO8601
  
  counts:
    total_expected: N
    synced: N
    drifted: N
    missing: N
    conflicted: N
  
  percentages:
    sync_percentage: N%
    drift_percentage: N%
  
  by_level:
    domains:
      synced: N
      drifted: N
      missing: N
    services:
      synced: N
      drifted: N
      missing: N
    microservices:
      synced: N
      drifted: N
      missing: N
  
  health_score: 0-100  # weighted composite
```

**Health score calculation:**
```
health = (synced * 1.0 + drifted * 0.5 + missing * 0.0 + conflicted * 0.0) / total * 100
```

### 6. Determine Next Actions
Based on findings, recommend next steps:

```yaml
recommended_actions:
  immediate:
    - action: "Run reconcile workflow"
      reason: "{N} conflicts require resolution"
      priority: high
    
  soon:
    - action: "Pull updates for {N} repos"
      reason: "Repos behind tracking branch"
      priority: medium
    - action: "Commit or stash changes in {N} repos"
      reason: "Uncommitted local changes"
      priority: medium
  
  maintenance:
    - action: "Run discover on {N} repos"
      reason: "Analysis is stale (>30 days)"
      priority: low
    - action: "Update lens for {N} extra items"
      reason: "Untracked repos found"
      priority: low
```

### 7. Write Drift Report
Generate `{project-root}/_bmad-output/sync-status-report.md`:

```markdown
# Sync Status Report

**Generated:** {ISO8601}  
**Target Root:** {path}  
**Health Score:** {score}/100

## Summary

| Status | Count | Percentage |
|--------|-------|------------|
| ✓ Synced | N | N% |
| ⚡ Drifted | N | N% |
| ✗ Missing | N | N% |
| ⚠️ Conflicted | N | N% |

## Health Overview

{health_score >= 90}: 🟢 Excellent - System is well synchronized
{health_score >= 70}: 🟡 Good - Minor drift detected  
{health_score >= 50}: 🟠 Fair - Significant drift needs attention
{health_score < 50}:  🔴 Poor - Major synchronization issues

## Conflicts (Immediate Attention)

| Path | Issue | Expected | Actual |
|------|-------|----------|--------|
| business/payments | Remote mismatch | git@org/pay | git@fork/pay |

## Drifted Items

### Branch Drift
| Path | Expected | Actual |
|------|----------|--------|
| platform/auth-api | main | feature/xyz |

### Uncommitted Changes
| Path | Modified | Untracked |
|------|----------|-----------|
| platform/auth-api | 3 | 5 |

### Behind Tracking Branch
| Path | Commits Behind |
|------|----------------|
| business/orders | 12 |

## Missing Items

| Type | Path | Action Needed |
|------|------|---------------|
| Microservice | platform/auth/auth-ui | Clone from {repo} |

## Extra Items (Not in Lens)

| Path | Classification | Recommendation |
|------|----------------|----------------|
| experiments/ | unknown_folder | Add to lens or delete |
| legacy/old-api/ | potential_orphan | Archive or add to lens |

## Recommended Actions

### Immediate (High Priority)
1. **Resolve {N} conflicts** - Run: `lens-sync reconcile`

### Soon (Medium Priority)  
2. **Pull updates** for {N} repos
3. **Commit/stash** changes in {N} repos

### Maintenance (Low Priority)
4. **Run discovery** on {N} stale repos
5. **Update lens** with {N} extra items

## Detailed Item List

<details>
<summary>All synced items ({N})</summary>

| Path | Type | Last Commit |
|------|------|-------------|
| platform/auth/auth-api | microservice | 2026-01-30 |
...
</details>

## Next Steps

- To resolve conflicts: `lens-sync reconcile`
- To bootstrap missing items: `lens-sync bootstrap`
- To analyze repos: `lens-sync discover --target {path}`
```

### 8. Update Bridge Sidecar State
Update `_memory/bridge-sidecar/bridge-state.md`:

```yaml
last_drift_report: ISO8601
drift_report_path: "{project-root}/_bmad-output/sync-status-report.md"
pending_conflicts:
  - id: string
    path: string
    type: string
sync_health_score: N
items_synced: N
items_drifted: N
items_missing: N
items_conflicted: N
```

## Edge Cases and Failure Modes

| Condition | Action |
|-----------|--------|
| 100% synced | Report SUCCESS, health=100 |
| 0 items to compare | WARN: "No items in lens map" |
| All items missing | Report bootstrap needed |
| Report write fails | Log to console, return results anyway |
| Previous conflicts unresolved | Highlight as recurring issues |

## Output
```yaml
sync_status:
  timestamp: ISO8601
  health_score: N
  
  summary:
    synced: N
    drifted: N
    missing: N
    conflicted: N
  
  drift_analysis: {...}
  conflicts: [...]
  recommended_actions: [...]
  
  report_path: "{project-root}/_bmad-output/sync-status-report.md"
```
