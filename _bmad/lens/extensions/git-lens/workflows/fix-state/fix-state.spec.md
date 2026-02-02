# Workflow Specification: fix-state

**Module:** git-lens
**Status:** Placeholder — To be created via create-workflow workflow
**Created:** 2026-02-01

---

## Workflow Overview

**Goal:** Recover state.yaml using recovery cascade.

**Description:** Attempt event log replay, then git scan, then user-guided recovery.

**Workflow Type:** Create-only

---

## Workflow Structure

### Entry Point

```yaml
---
name: fix-state
description: Recover Git-Lens state
web_bundle: true
installed_path: '{project-root}/_bmad/lens/workflows/fix-state'
---
```

### Mode

- [x] Create-only (steps-c/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 01 | detect | Detect missing/corrupt state |
| 02 | event-log | Replay event-log.jsonl |
| 03 | git-scan | Scan git branches for reconstruction |
| 04 | guided | User-guided recovery if needed |
| 05 | write | Write recovered state |

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

- state.yaml
- state.yaml.bak (if corrupted)

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
