# Workflow Specification: sync-status

**Module:** lens
**Status:** Placeholder — To be created via create-workflow workflow
**Created:** 2026-01-31

---

## Workflow Overview

**Goal:** Detect drift between the lens model and physical project structure.

**Description:** Scan folders, compare against lens domain map, and produce a drift report with reconciliation options.

**Workflow Type:** Core

---

## Workflow Structure

### Entry Point

```yaml
---
name: sync-status
description: Check drift between lens and reality
web_bundle: true
installed_path: '{project-root}/_bmad/lens/workflows/sync-status'
---
```

### Mode

- [x] Create-only (steps-c/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 1 | Load lens map | Load domain-map.yaml and service definitions |
| 2 | Scan folders | Inventory TargetProject folders |
| 3 | Compare structures | Identify drift and conflicts |
| 4 | Write drift report | Summarize synced, drifted, conflicted |
| 5 | Recommend reconcile | Offer reconciliation path |

---

## Workflow Inputs

### Required Inputs

- `domain-map.yaml`
- `target_project_root`

### Optional Inputs

- Target domain/service/microservice filters

---

## Workflow Outputs

### Output Format

- [x] Document-producing
- [ ] Non-document

### Output Files

- `{project-root}/_bmad-output/sync-status-report.md`

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
