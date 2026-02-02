# Workflow Specification: start-phase

**Module:** git-lens
**Status:** Placeholder — To be created via create-workflow workflow
**Created:** 2026-02-01

---

## Workflow Overview

**Goal:** Create or checkout phase branch.

**Description:** Creates phase branch lazily (p2+), validates previous phase merge, updates state.

**Workflow Type:** Create-only

---

## Workflow Structure

### Entry Point

```yaml
---
name: start-phase
description: Start a Git-Lens phase branch
web_bundle: true
installed_path: '{project-root}/_bmad/lens/workflows/start-phase'
---
```

### Mode

- [x] Create-only (steps-c/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 01 | preflight | Validate repo and state |
| 02 | validate | Ensure previous phase merged or overridden |
| 03 | branch | Create/checkout phase branch |
| 04 | update-state | Update state and event log |

---

## Workflow Inputs

### Required Inputs

- phase identifier (p1, p2, ...)

### Optional Inputs

- validation_cascade

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
