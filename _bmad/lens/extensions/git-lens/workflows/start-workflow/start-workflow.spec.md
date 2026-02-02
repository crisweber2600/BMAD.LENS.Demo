# Workflow Specification: start-workflow

**Module:** git-lens
**Status:** Placeholder — To be created via create-workflow workflow
**Created:** 2026-02-01

---

## Workflow Overview

**Goal:** Start a workflow branch with merge-gate validation.

**Description:** Validates previous workflow merge status using validation cascade. Creates workflow branch and updates state.

**Workflow Type:** Create-only

---

## Workflow Structure

### Entry Point

```yaml
---
name: start-workflow
description: Start a Git-Lens workflow branch with validation
web_bundle: true
installed_path: '{project-root}/_bmad/lens/workflows/start-workflow'
---
```

### Mode

- [x] Create-only (steps-c/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 01 | preflight | Validate repo, state, config |
| 02 | fetch | Update cached refs if needed |
| 03 | validate | Run validation cascade (ancestry/pr_api/override) |
| 04 | branch | Create workflow branch |
| 05 | update-state | Update state.yaml and event log |

---

## Workflow Inputs

### Required Inputs

- workflow name (from LENS trigger)
- current phase and lane

### Optional Inputs

- validation_cascade
- pr_api_enabled

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

Tracey (State Manager) for overrides/diagnostics

---

## Implementation Notes

**Use the create-workflow workflow to build this workflow.**

---

_Spec created on 2026-02-01 via BMAD Module workflow_
