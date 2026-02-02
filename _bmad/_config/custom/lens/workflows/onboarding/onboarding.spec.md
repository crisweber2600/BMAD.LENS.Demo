# Workflow Specification: onboarding

**Module:** lens
**Status:** Implemented
**Created:** 2026-01-30

---

## Workflow Overview

**Goal:** Provide first-time onboarding for LENS.

**Description:** Detect project structure, explain lenses, and propose starter configuration.

**Workflow Type:** Utility (Post-MVP1)

---

## Workflow Structure

### Entry Point

```yaml
---
name: onboarding
description: LENS onboarding and starter configuration
web_bundle: true
installed_path: '{project-root}/_bmad/lens/workflows/onboarding'
---
```

### Mode

- [x] Create-only (steps-c/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 1 | Detect structure | Identify services and boundaries |
| 2 | Explain lenses | Present lens concepts and usage |
| 3 | Create starter config | Generate minimal lens config |

---

## Workflow Inputs

### Required Inputs

- None

### Optional Inputs

- `project_description`

---

## Workflow Outputs

### Output Format

- [ ] Document-producing
- [x] Non-document

### Output Files

- `.lens/lens-config.yaml`

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
