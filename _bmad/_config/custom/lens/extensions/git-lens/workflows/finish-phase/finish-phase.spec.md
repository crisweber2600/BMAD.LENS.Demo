# Workflow Specification: finish-phase

**Module:** git-lens
**Status:** Placeholder — To be created via create-workflow workflow
**Created:** 2026-02-01

---

## Workflow Overview

**Goal:** Finish a phase branch and print PR link to lane.

**Description:** Pushes phase branch, prints PR link, updates state and event log.

**Workflow Type:** Create-only

---

## Workflow Structure

### Entry Point

```yaml
---
name: finish-phase
description: Finish a Git-Lens phase branch
web_bundle: true
installed_path: '{project-root}/_bmad/lens/workflows/finish-phase'
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
| 02 | push | Push phase branch |
| 03 | pr-link | Print PR link + reviewers |
| 04 | update-state | Update phase status |

---

## Workflow Inputs

### Required Inputs

- phase branch

### Optional Inputs

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

Tracey (State Manager)

---

## Implementation Notes

**Use the create-workflow workflow to build this workflow.**

---

_Spec created on 2026-02-01 via BMAD Module workflow_
