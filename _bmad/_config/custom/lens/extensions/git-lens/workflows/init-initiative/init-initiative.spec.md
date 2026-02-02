# Workflow Specification: init-initiative

**Module:** git-lens
**Status:** Placeholder — To be created via create-workflow workflow
**Created:** 2026-02-01

---

## Workflow Overview

**Goal:** Create full git branch topology for a new initiative and initialize state.

**Description:** Creates base, lane, and phase branches, writes state.yaml and event-log.jsonl, and prints next steps.

**Workflow Type:** Create-only

---

## Workflow Structure

### Entry Point

```yaml
---
name: init-initiative
description: Initialize git-lens branch topology for a new initiative
web_bundle: true
installed_path: '{project-root}/_bmad/lens/workflows/init-initiative'
---
```

### Mode

- [x] Create-only (steps-c/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 01 | preflight | Validate git repo, remote, config, active initiative | 
| 02 | slug | Generate initiative slug and check collisions |
| 03 | branches | Create base, small, lead, p1 branches |
| 04 | state | Write state.yaml and event-log.jsonl |
| 05 | report | Print summary and next steps |

---

## Workflow Inputs

### Required Inputs

- Initiative name (from LENS trigger)
- base_ref (module config)

### Optional Inputs

- remote_name
- auto_push

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

Tracey (State Manager) for recovery and diagnostics

---

## Implementation Notes

**Use the create-workflow workflow to build this workflow.**

---

_Spec created on 2026-02-01 via BMAD Module workflow_
