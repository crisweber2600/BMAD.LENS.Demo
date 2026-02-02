# Workflow Specification: lens-switch

**Module:** lens
**Status:** Implemented
**Created:** 2026-01-30

---

## Workflow Overview

**Goal:** Switch to a target architectural lens and reload context.

**Description:** Validate target lens, resolve target entities, and load the appropriate context view.

**Workflow Type:** Core

---

## Workflow Structure

### Entry Point

```yaml
---
name: lens-switch
description: Switch architectural lens and reload context
web_bundle: true
installed_path: '{project-root}/_bmad/lens/workflows/lens-switch'
---
```

### Mode

- [x] Create-only (steps-c/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 1 | Validate target | Confirm target lens and scope |
| 2 | Load context | Fetch context for target lens |
| 3 | Confirm switch | Present updated lens summary |

---

## Workflow Inputs

### Required Inputs

- `target_lens`

### Optional Inputs

- `target_domain`
- `target_service`
- `target_microservice`
- `target_feature`

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
