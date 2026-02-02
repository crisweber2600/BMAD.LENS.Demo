# Workflow Specification: rollback

**Module:** lens
**Status:** Placeholder — To be created via create-workflow workflow
**Created:** 2026-01-31

---

## Workflow Overview

**Goal:** Revert lens changes safely to a previous state.

**Description:** Select rollback point, restore data, verify integrity, and report.

**Workflow Type:** Core

---

## Workflow Structure

### Entry Point

```yaml
---
name: rollback
description: Revert lens changes safely
web_bundle: true
installed_path: '{project-root}/_bmad/lens/workflows/rollback'
---
```

### Mode

- [x] Create-only (steps-c/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 1 | Select snapshot | Choose rollback point |
| 2 | Apply rollback | Restore lens data |
| 3 | Verify integrity | Validate schemas and structure |
| 4 | Report outcomes | Write rollback report |

---

## Workflow Inputs

### Required Inputs

- Lens backups or git history

### Optional Inputs

- Target scope (domain/service/microservice)

---

## Workflow Outputs

### Output Format

- [x] Document-producing
- [ ] Non-document

### Output Files

- `{project-root}/_bmad-output/rollback-report.md`

---

## Agent Integration

### Primary Agent

Link

### Other Agents

Bridge (structure alignment)

---

## Implementation Notes

**Use the create-workflow workflow to build this workflow.**

---

_Spec created on 2026-01-31 via BMAD Module workflow_
