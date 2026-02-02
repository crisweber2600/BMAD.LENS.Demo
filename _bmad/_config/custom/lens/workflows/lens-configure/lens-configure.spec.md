# Workflow Specification: lens-configure

**Module:** lens
**Status:** Implemented
**Created:** 2026-01-30

---

## Workflow Overview

**Goal:** Configure lens detection rules and branch patterns.

**Description:** Collect configuration settings and write `.lens/lens-config.yaml` for the project.

**Workflow Type:** Utility

---

## Workflow Structure

### Entry Point

```yaml
---
name: lens-configure
description: Configure lens detection rules
web_bundle: true
installed_path: '{project-root}/_bmad/lens/workflows/lens-configure'
---
```

### Mode

- [x] Create-only (steps-c/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 1 | Gather settings | Collect branch patterns and rules |
| 2 | Validate config | Ensure valid patterns and paths |
| 3 | Write config | Save `.lens/lens-config.yaml` |

---

## Workflow Inputs

### Required Inputs

- None

### Optional Inputs

- `branch_patterns`
- `default_lens`

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
