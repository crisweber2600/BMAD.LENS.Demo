# Workflow Specification: open-lead-review

**Module:** git-lens
**Status:** Placeholder — To be created via create-workflow workflow
**Created:** 2026-02-01

---

## Workflow Overview

**Goal:** Print PR link for small → lead review gate.

**Description:** Validates phase completion, prints PR link, suggests reviewers, updates state.

**Workflow Type:** Create-only

---

## Workflow Structure

### Entry Point

```yaml
---
name: open-lead-review
description: Open lead review PR (small → lead)
web_bundle: true
installed_path: '{project-root}/_bmad/lens/workflows/open-lead-review'
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
| 02 | validate | Ensure phases complete |
| 03 | pr-link | Print PR link + reviewers |
| 04 | update-state | Update lead review status |

---

## Workflow Inputs

### Required Inputs

- small lane branch
- lead lane branch

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
