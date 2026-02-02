# Workflow Specification: new-service

**Module:** lens
**Status:** Implemented
**Created:** 2026-01-30

---

## Workflow Overview

**Goal:** Create a new logical service in the domain map.

**Description:** Collect service metadata, update the domain map, and scaffold service structure.

**Workflow Type:** Feature (Post-MVP1)

---

## Workflow Structure

### Entry Point

```yaml
---
name: new-service
description: Create new logical service structure
web_bundle: true
installed_path: '{project-root}/_bmad/lens/workflows/new-service'
---
```

### Mode

- [x] Create-only (steps-c/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 1 | Collect metadata | Gather service name and domain |
| 2 | Update map | Add service to domain map |
| 3 | Scaffold | Create service structure |

---

## Workflow Inputs

### Required Inputs

- `service_name`
- `domain_name`

### Optional Inputs

- `service_description`

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
