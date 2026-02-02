# Workflow Specification: resume

**Module:** git-lens
**Status:** Placeholder — To be created via create-workflow workflow
**Created:** 2026-02-01

---

## Workflow Overview

**Goal:** Rehydrate session from state and check out correct branch.

**Description:** Loads state.yaml, validates branch exists, checks out branch, prints context summary.

**Workflow Type:** Create-only

---

## Workflow Structure

### Entry Point

```yaml
---
name: resume
description: Resume Git-Lens session from state
web_bundle: true
installed_path: '{project-root}/_bmad/lens/workflows/resume'
---
```

### Mode

- [x] Create-only (steps-c/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 01 | load | Load state.yaml |
| 02 | validate | Ensure branch exists (local/remote) |
| 03 | checkout | Checkout branch |
| 04 | report | Print status |

---

## Workflow Inputs

### Required Inputs

- state_folder

### Optional Inputs

- remote_name

---

## Workflow Outputs

### Output Format

- [ ] Document-producing
- [x] Non-document

### Output Files

- None

---

## Agent Integration

### Primary Agent

Tracey (State Manager)

### Other Agents

None

---

## Implementation Notes

**Use the create-workflow workflow to build this workflow.**

---

_Spec created on 2026-02-01 via BMAD Module workflow_
