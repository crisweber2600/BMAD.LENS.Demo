# Workflow Specification: reviewers

**Module:** git-lens
**Status:** Placeholder — To be created via create-workflow workflow
**Created:** 2026-02-01

---

## Workflow Overview

**Goal:** Suggest reviewers for PRs based on Compass roster.

**Description:** Loads roster data and filters reviewers by PR type and role.

**Workflow Type:** Create-only

---

## Workflow Structure

### Entry Point

```yaml
---
name: reviewers
description: Suggest reviewers for Git-Lens PRs
web_bundle: true
installed_path: '{project-root}/_bmad/lens/workflows/reviewers'
---
```

### Mode

- [x] Create-only (steps-c/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 01 | load | Load Compass roster (or mock) |
| 02 | filter | Filter by PR type + roles |
| 03 | output | Present suggested reviewers |

---

## Workflow Inputs

### Required Inputs

- PR type

### Optional Inputs

- roster_file override

---

## Workflow Outputs

### Output Format

- [ ] Document-producing
- [x] Non-document

### Output Files

- None

---

## Agent Integration

### Primary Agent

Tracey (State Manager)

### Other Agents

None

---

## Implementation Notes

**Use the create-workflow workflow to build this workflow.**

---

_Spec created on 2026-02-01 via BMAD Module workflow_
