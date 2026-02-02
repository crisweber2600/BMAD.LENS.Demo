# Workflow Specification: workflow-guide

**Module:** lens
**Status:** Implemented
**Created:** 2026-01-30

---

## Workflow Overview

**Goal:** Recommend next workflows based on current lens and phase.

**Description:** Detect lens and BMAD phase, map recommendations, and display a navigation card.

**Workflow Type:** Utility

---

## Workflow Structure

### Entry Point

```yaml
---
name: workflow-guide
description: Recommend next workflow based on lens
web_bundle: true
installed_path: '{project-root}/_bmad/lens/workflows/workflow-guide'
---
```

### Mode

- [x] Create-only (steps-c/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 1 | Detect context | Resolve lens and current phase |
| 2 | Map recommendations | Select relevant workflows |
| 3 | Present guidance | Display navigation card |

---

## Workflow Inputs

### Required Inputs

- None

### Optional Inputs

- `current_phase`

---

## Workflow Outputs

### Output Format

- [ ] Document-producing
- [x] Non-document

### Output Files

- N/A

---

## Agent Integration

### Primary Agent

Navigator

### Other Agents

None

---

## Implementation Notes

Implemented in `workflow.md` and `steps-c/`.

---

_Spec created on 2026-01-30 via BMAD Module workflow_
