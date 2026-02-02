# Workflow Specification: service-registry

**Module:** lens
**Status:** Implemented
**Created:** 2026-01-30

---

## Workflow Overview

**Goal:** Manage service registry mappings for the domain map.

**Description:** List, edit, and save service registry entries for consistent naming.

**Workflow Type:** Feature (Post-MVP1)

---

## Workflow Structure

### Entry Point

```yaml
---
name: service-registry
description: Manage service registry mappings
web_bundle: true
installed_path: '{project-root}/_bmad/lens/workflows/service-registry'
---
```

### Mode

- [x] Create-only (steps-c/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 1 | Load registry | Read existing service mappings |
| 2 | Edit entries | Add or update services |
| 3 | Save registry | Persist registry changes |

---

## Workflow Inputs

### Required Inputs

- None

### Optional Inputs

- `registry_path`

---

## Workflow Outputs

### Output Format

- [ ] Document-producing
- [x] Non-document

### Output Files

- `.lens/service-registry.yaml`

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
