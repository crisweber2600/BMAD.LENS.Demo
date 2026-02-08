# Branch Protection for lens-work Branches

## Overview

lens-work creates a structured branch topology under the `{Domain}/` prefix. Proper branch protection rules ensure lifecycle integrity — preventing accidental pushes to lane branches, enforcing review gates, and keeping the merge flow aligned with BMAD phases.

## Branch Topology Recap

```
{Domain}/{id}/base          ← Initiative root (created once, rarely touched)
{Domain}/{id}/small         ← Small-team lane (planning phases merge here)
{Domain}/{id}/large         ← Large review lane (receives from small after review)
{Domain}/{id}/small-1       ← Phase branch (Analysis)
{Domain}/{id}/small-1-*     ← Workflow branches (individual work)
```

## Recommended Protection Rules

### Lane Branches (small, large)

| Rule | Value | Rationale |
|------|-------|-----------|
| Require PR for merge | ✅ Yes | Workflow → phase merges must be reviewable |
| Required reviewers | 1+ | At least one team member reviews completed phase work |
| Dismiss stale reviews | ✅ Yes | Re-review if workflow branch changes after approval |
| Allow force push | ❌ No | Lane branches are accumulation points — never rewrite |
| Allow deletion | ❌ No | Lane branches persist for the initiative lifetime |

### Phase Branches (p1, p2, p3, p4)

| Rule | Value | Rationale |
|------|-------|-----------|
| Require PR for merge | ✅ Yes | Workflow branches merge into phase via PR |
| Required reviewers | 0–1 | Optional for solo dev, recommended for teams |
| Allow force push | ❌ No | Phase branches track sequential workflow merges |
| Allow deletion | ✅ After merge | Clean up after phase → lane merge |

### Workflow Branches (w/*)

| Rule | Value | Rationale |
|------|-------|-----------|
| Require PR for merge | Optional | Team preference |
| Allow force push | ✅ Yes | Developer may rebase during active work |
| Allow deletion | ✅ After merge | Clean up after workflow → phase merge |

## Lane-to-Lane Merge Reviews

The `small → large` merge is a critical gate representing the **Large Review** phase. This merge should always require:

- **2+ reviewers** including a tech lead or architect
- **All CI checks passing** (see [ci-integration.md](ci-integration.md))
- **No unresolved comments**
- **Linear merge history** (squash or rebase)

## Platform Configuration

### GitHub

```yaml
# .github/settings.yml (probot/settings format)
branches:
  - name: "{Domain}/*/small"
    protection:
      required_pull_request_reviews:
        required_approving_review_count: 1
        dismiss_stale_reviews: true
      enforce_admins: true
      restrictions: null

  - name: "{Domain}/*/large"
    protection:
      required_pull_request_reviews:
        required_approving_review_count: 2
        dismiss_stale_reviews: true
      enforce_admins: true
```

> **Note:** GitHub branch protection rules support wildcard patterns. Replace `{Domain}` with your domain prefix (e.g., `lens/*/small`).

### Azure DevOps

1. Navigate to **Project Settings → Repos → Branches**
2. Add branch policy for pattern `{Domain}/*/small` and `{Domain}/*/large`
3. Set minimum reviewers (1 for small, 2 for large)
4. Enable **Check for linked work items** if using Azure Boards
5. Add build validation policy referencing your CI pipeline

### GitLab

1. Navigate to **Settings → Repository → Protected Branches**
2. Add `{Domain}/*/small` — Allowed to merge: Maintainers, Allowed to push: No one
3. Add `{Domain}/*/large` — Allowed to merge: Maintainers, Allowed to push: No one
4. Configure merge request approvals under **Settings → Merge Requests**
