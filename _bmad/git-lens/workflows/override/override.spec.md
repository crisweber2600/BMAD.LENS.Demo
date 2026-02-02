# Workflow Specification: override

**Module:** git-lens
**Status:** Placeholder — To be created via create-workflow workflow
**Created:** 2026-02-01

---

## Workflow Overview

**Goal:** Force-continue by recording a manual override with reason.

**Description:** Records override reason in state.yaml and event-log, clears block for specific workflow/phase.

**Workflow Type:** Create-only

---

## Workflow Structure

### Entry Point

```yaml
---
name: override
description: Record manual override for validation
web_bundle: true
installed_path: '{project-root}/_bmad/lens/workflows/override'
---
```

### Mode

- [x] Create-only (steps-c/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 01 | collect | Capture override reason |
| 02 | update | Update state + event log |
| 03 | report | Confirm override applied |

---

## Workflow Inputs

### Required Inputs

- override reason string

### Optional Inputs

- target workflow/phase

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

Tracey (State Manager)

### Other Agents

None

---

## Implementation Notes

**Use the create-workflow workflow to build this workflow.**

---

_Spec created on 2026-02-01 via BMAD Module workflow_
