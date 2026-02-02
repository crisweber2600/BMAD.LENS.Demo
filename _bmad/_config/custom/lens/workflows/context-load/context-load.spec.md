# Workflow Specification: context-load

**Module:** lens
**Status:** Implemented
**Created:** 2026-01-30

---

## Workflow Overview

**Goal:** Load detailed context for the active lens.

**Description:** Gather architecture details, dependencies, and summaries for the current lens and present them in a structured view.

**Workflow Type:** Core

---

## Workflow Structure

### Entry Point

```yaml
---
name: context-load
description: Load detailed context for the current lens
web_bundle: true
installed_path: '{project-root}/_bmad/lens/workflows/context-load'
---
```

### Mode

- [x] Create-only (steps-c/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 1 | Gather context | Collect data for active lens |
| 2 | Format output | Build structured context view |
| 3 | Present details | Display context with progressive disclosure |

---

## Workflow Inputs

### Required Inputs

- `current_lens`

### Optional Inputs

- `detail_level`

---

## Workflow Outputs

### Output Format

- [ ] Document-producing
- [x] Non-document

### Output Files

- N/A (session state only)

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
