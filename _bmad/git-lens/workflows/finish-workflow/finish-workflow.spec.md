# Workflow Specification: finish-workflow

**Module:** git-lens
**Status:** Placeholder — To be created via create-workflow workflow
**Created:** 2026-02-01

---

## Workflow Overview

**Goal:** Finish a workflow branch with smart commit and PR link output.

**Description:** Detects uncommitted changes, prompts commit strategy, pushes branch (if configured), prints PR link, updates state.

**Workflow Type:** Create-only

---

## Workflow Structure

### Entry Point

```yaml
---
name: finish-workflow
description: Finish a Git-Lens workflow branch
web_bundle: true
installed_path: '{project-root}/_bmad/lens/workflows/finish-workflow'
---
```

### Mode

- [x] Create-only (steps-c/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 01 | preflight | Validate repo and branch |
| 02 | status | Detect uncommitted changes |
| 03 | commit | Prompt for commit strategy |
| 04 | push | Push branch if auto_push true |
| 05 | pr-link | Print PR link + reviewers |
| 06 | update-state | Update state and event log |

---

## Workflow Inputs

### Required Inputs

- current workflow branch

### Optional Inputs

- commit_strategy
- auto_push

---

## Workflow Outputs

### Output Format

- [ ] Document-producing
- [x] Non-document

### Output Files

- state.yaml
- event-log.jsonl

---

## Agent Integration

### Primary Agent

Casey (Conductor)

### Other Agents

Tracey (State Manager) for status/diagnostics

---

## Implementation Notes

**Use the create-workflow workflow to build this workflow.**

---

_Spec created on 2026-02-01 via BMAD Module workflow_
