# Workflow Specification: recreate-branches

**Module:** git-lens
**Status:** Placeholder — To be created via create-workflow workflow
**Created:** 2026-02-01

---

## Workflow Overview

**Goal:** Recreate missing branches from state definitions.

**Description:** Validates branch existence, recreates missing branches locally/remotely based on state.yaml.

**Workflow Type:** Create-only

---

## Workflow Structure

### Entry Point

```yaml
---
name: recreate-branches
description: Recreate missing Git-Lens branches
web_bundle: true
installed_path: '{project-root}/_bmad/lens/workflows/recreate-branches'
---
```

### Mode

- [x] Create-only (steps-c/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 01 | scan | Scan for missing branches |
| 02 | recreate | Recreate missing branches |
| 03 | report | Summarize changes |

---

## Workflow Inputs

### Required Inputs

- state.yaml

### Optional Inputs

- auto_push

---

## Workflow Outputs

### Output Format

- [ ] Document-producing
- [x] Non-document

### Output Files

- state.yaml

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
