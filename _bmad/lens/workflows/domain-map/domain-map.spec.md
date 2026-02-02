# Workflow Specification: domain-map

**Module:** lens
**Status:** Implemented
**Created:** 2026-01-30

---

## Workflow Overview

**Goal:** View and edit the domain architecture map.

**Description:** Load `.lens/domain-map.yaml`, allow edits, and save changes.

**Workflow Type:** Feature (Post-MVP1)

---

## Workflow Structure

### Entry Point

```yaml
---
name: domain-map
description: View and edit domain architecture map
web_bundle: true
installed_path: '{project-root}/_bmad/lens/workflows/domain-map'
---
```

### Mode

- [x] Create-only (steps-c/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 1 | Load map | Read current domain map |
| 2 | Edit map | Apply user changes |
| 3 | Save map | Persist updates |

---

## Workflow Inputs

### Required Inputs

- None

### Optional Inputs

- `map_path`

---

## Workflow Outputs

### Output Format

- [ ] Document-producing
- [x] Non-document

### Output Files

- `.lens/domain-map.yaml`

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
