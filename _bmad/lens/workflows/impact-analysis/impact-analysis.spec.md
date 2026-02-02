# Workflow Specification: impact-analysis

**Module:** lens
**Status:** Implemented
**Created:** 2026-01-30

---

## Workflow Overview

**Goal:** Analyze cross-boundary impacts of proposed changes.

**Description:** Identify affected domains, services, and microservices, then present an impact summary.

**Workflow Type:** Feature (Post-MVP1)

---

## Workflow Structure

### Entry Point

```yaml
---
name: impact-analysis
description: Analyze cross-boundary impacts
web_bundle: true
installed_path: '{project-root}/_bmad/lens/workflows/impact-analysis'
---
```

### Mode

- [x] Create-only (steps-c/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 1 | Capture scope | Identify change scope and targets |
| 2 | Compute impact | Map dependencies and boundaries |
| 3 | Present report | Summarize risks and affected areas |

---

## Workflow Inputs

### Required Inputs

- `change_scope`

### Optional Inputs

- `affected_paths`
- `branch_name`

---

## Workflow Outputs

### Output Format

- [ ] Document-producing
- [x] Non-document

### Output Files

- N/A (summary report only)

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
