# Workflow Specification: new-feature

**Module:** lens
**Status:** Implemented
**Created:** 2026-01-30

---

## Workflow Overview

**Goal:** Create a new feature branch with BMAD context.

**Description:** Collect feature metadata, generate branch name, and initialize feature context.

**Workflow Type:** Feature (Post-MVP1)

---

## Workflow Structure

### Entry Point

```yaml
---
name: new-feature
description: Create feature branch and context
web_bundle: true
installed_path: '{project-root}/_bmad/lens/workflows/new-feature'
---
```

### Mode

- [x] Create-only (steps-c/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 1 | Collect metadata | Gather feature name and scope |
| 2 | Create branch | Generate branch naming schema |
| 3 | Initialize context | Seed feature context files |

---

## Workflow Inputs

### Required Inputs

- `feature_name`

### Optional Inputs

- `domain_name`
- `service_name`
- `microservice_name`

---

## Workflow Outputs

### Output Format

- [ ] Document-producing
- [x] Non-document

### Output Files

- N/A (branch created)

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
