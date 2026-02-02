# Workflow Specification: lens-detect

**Module:** lens
**Status:** Implemented
**Created:** 2026-01-30

---

## Workflow Overview

**Goal:** Detect the current architectural lens and present a summary.

**Description:** Resolve lens using git branch, working directory, and config, then show a lens summary card and store session state.

**Workflow Type:** Core

---

## Workflow Structure

### Entry Point

```yaml
---
name: lens-detect
description: Detect current architectural lens and load summary
web_bundle: true
installed_path: '{project-root}/_bmad/lens/workflows/lens-detect'
---
```

### Mode

- [x] Create-only (steps-c/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 1 | Collect signals | Read branch, directory, and config signals |
| 2 | Resolve lens | Determine active lens and entities |
| 3 | Present summary | Show lens card and store session |

---

## Workflow Inputs

### Required Inputs

- None

### Optional Inputs

- `force_lens`
- `lens_config_path`

---

## Workflow Outputs

### Output Format

- [ ] Document-producing
- [x] Non-document

### Output Files

- N/A (session state only)

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
