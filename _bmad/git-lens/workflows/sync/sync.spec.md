# Workflow Specification: sync

**Module:** git-lens
**Status:** Placeholder — To be created via create-workflow workflow
**Created:** 2026-02-01

---

## Workflow Overview

**Goal:** Fetch remote refs and re-validate state.

**Description:** Runs fetch (respecting fetch_strategy), updates cache, re-validates blocks.

**Workflow Type:** Create-only

---

## Workflow Structure

### Entry Point

```yaml
---
name: sync
description: Sync remote refs and update Git-Lens state
web_bundle: true
installed_path: '{project-root}/_bmad/lens/workflows/sync'
---
```

### Mode

- [x] Create-only (steps-c/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 01 | fetch | Fetch refs (background or sync) |
| 02 | validate | Re-run validation cascade for current block |
| 03 | update | Update state.yaml and event-log |

---

## Workflow Inputs

### Required Inputs

- remote_name

### Optional Inputs

- fetch_strategy
- fetch_ttl

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
