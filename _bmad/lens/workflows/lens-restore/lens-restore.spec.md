# Workflow Specification: lens-restore

**Module:** lens
**Status:** Implemented
**Created:** 2026-01-30

---

## Workflow Overview

**Goal:** Restore the previous lens session.

**Description:** Load the last saved session state and rehydrate the lens context.

**Workflow Type:** Utility

---

## Workflow Structure

### Entry Point

```yaml
---
name: lens-restore
description: Restore previous lens session
web_bundle: true
installed_path: '{project-root}/_bmad/lens/workflows/lens-restore'
---
```

### Mode

- [x] Create-only (steps-c/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 1 | Load session | Retrieve stored session data |
| 2 | Validate state | Ensure session matches current repo |
| 3 | Rehydrate context | Restore lens summary and state |

---

## Workflow Inputs

### Required Inputs

- None

### Optional Inputs

- `session_id`

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
