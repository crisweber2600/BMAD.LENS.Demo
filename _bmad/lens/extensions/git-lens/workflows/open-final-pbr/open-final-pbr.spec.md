# Workflow Specification: open-final-pbr

**Module:** git-lens
**Status:** Placeholder — To be created via create-workflow workflow
**Created:** 2026-02-01

---

## Workflow Overview

**Goal:** Print PR link for lead → base final PBR.

**Description:** Validates lead review completion, prints final PR link, updates state.

**Workflow Type:** Create-only

---

## Workflow Structure

### Entry Point

```yaml
---
name: open-final-pbr
description: Open final PBR PR (lead → base)
web_bundle: true
installed_path: '{project-root}/_bmad/lens/workflows/open-final-pbr'
---
```

### Mode

- [x] Create-only (steps-c/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 01 | preflight | Validate repo and state |
| 02 | validate | Ensure lead review merged |
| 03 | pr-link | Print PR link + reviewers |
| 04 | update-state | Update final status |

---

## Workflow Inputs

### Required Inputs

- lead branch
- base branch

### Optional Inputs

- reviewer suggestions

---

## Workflow Outputs

### Output Format

- [ ] Document-producing
- [x] Non-document

### Output Files

- state.yaml
- event-log.jsonl

---

## Agent Integration

### Primary Agent

Casey (Conductor)

### Other Agents

Tracey (State Manager)

---

## Implementation Notes

**Use the create-workflow workflow to build this workflow.**

---

_Spec created on 2026-02-01 via BMAD Module workflow_
