# Workflow Specification: status

**Module:** git-lens
**Status:** Placeholder — To be created via create-workflow workflow
**Created:** 2026-02-01

---

## Workflow Overview

**Goal:** Display current initiative status and branch topology.

**Description:** Reads state.yaml and presents a formatted status report.

**Workflow Type:** Create-only

---

## Workflow Structure

### Entry Point

```yaml
---
name: status
description: Show Git-Lens current status
web_bundle: true
installed_path: '{project-root}/_bmad/lens/workflows/status'
---
```

### Mode

- [x] Create-only (steps-c/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 01 | load | Load state and validate presence |
| 02 | render | Render status card + topology |

---

## Workflow Inputs

### Required Inputs

- state_folder

### Optional Inputs

- none

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
