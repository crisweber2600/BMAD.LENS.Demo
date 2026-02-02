# Workflow Specification: new-microservice

**Module:** lens
**Status:** Implemented
**Created:** 2026-01-30

---

## Workflow Overview

**Goal:** Create a new microservice within a service.

**Description:** Gather microservice metadata, scaffold structure, and update the domain map.

**Workflow Type:** Feature (Post-MVP1)

---

## Workflow Structure

### Entry Point

```yaml
---
name: new-microservice
description: Create new microservice structure
web_bundle: true
installed_path: '{project-root}/_bmad/lens/workflows/new-microservice'
---
```

### Mode

- [x] Create-only (steps-c/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 1 | Collect metadata | Gather microservice name and service |
| 2 | Scaffold | Create microservice structure |
| 3 | Update map | Add microservice to domain map |

---

## Workflow Inputs

### Required Inputs

- `microservice_name`
- `service_name`

### Optional Inputs

- `microservice_description`

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
