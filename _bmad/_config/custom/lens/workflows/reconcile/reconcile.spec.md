# Workflow Specification: reconcile

**Module:** lens
**Status:** Placeholder — To be created via create-workflow workflow
**Created:** 2026-01-31

---

## Workflow Overview

**Goal:** Resolve conflicts between lens data and physical project structure.

**Description:** Present conflict options, apply resolution, validate results, and report outcomes.

**Workflow Type:** Core

---

## Workflow Structure

### Entry Point

```yaml
---
name: reconcile
description: Resolve lens/reality conflicts
web_bundle: true
installed_path: '{project-root}/_bmad/lens/workflows/reconcile'
---
```

### Mode

- [x] Create-only (steps-c/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 1 | Load conflicts | Load conflict list from sync-status |
| 2 | Present options | Offer update lens, update reality, or manual |
| 3 | Apply resolution | Execute user choice |
| 4 | Validate results | Confirm alignment |
| 5 | Report outcomes | Write reconciliation report |

---

## Workflow Inputs

### Required Inputs

- Conflict list from sync-status
- `target_project_root`

### Optional Inputs

- Target domain/service/microservice filters

---

## Workflow Outputs

### Output Format

- [x] Document-producing
- [ ] Non-document

### Output Files

- `{project-root}/_bmad-output/reconcile-report.md`

---

## Agent Integration

### Primary Agent

Bridge

### Other Agents

Link (integrity checks)

---

## Implementation Notes

**Use the create-workflow workflow to build this workflow.**

---

_Spec created on 2026-01-31 via BMAD Module workflow_
