# Workflow Specification: archive

**Module:** git-lens
**Status:** Placeholder — To be created via create-workflow workflow
**Created:** 2026-02-01

---

## Workflow Overview

**Goal:** Archive completed initiative state and mark as inactive.

**Description:** Moves state to archive folder, updates status, prints summary.

**Workflow Type:** Create-only

---

## Workflow Structure

### Entry Point

```yaml
---
name: archive
description: Archive Git-Lens initiative
web_bundle: true
installed_path: '{project-root}/_bmad/lens/workflows/archive'
---
```

### Mode

- [x] Create-only (steps-c/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 01 | validate | Ensure initiative complete or user confirms |
| 02 | move | Move state files to archive |
| 03 | report | Confirm archive and next steps |

---

## Workflow Inputs

### Required Inputs

- state_folder

### Optional Inputs

- archive_folder override

---

## Workflow Outputs

### Output Format

- [ ] Document-producing
- [x] Non-document

### Output Files

- archived state files

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
