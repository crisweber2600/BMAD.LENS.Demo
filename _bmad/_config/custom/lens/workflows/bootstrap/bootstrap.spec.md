# Workflow Specification: bootstrap

**Module:** lens
**Status:** Active — Integrated with LENS startup workflow
**Created:** 2026-01-31
**Updated:** 2026-02-02

---

## Workflow Overview

**Goal:** Bootstrap target project structure from the lens domain map.

**Description:** Sync TargetProject folder hierarchy and clone repositories based on lens domain map, then report status.

**Workflow Type:** Core

---

## Workflow Structure

### Entry Point

```yaml
---
name: bootstrap
description: Sync TargetProject folder structure with the lens domain map
web_bundle: true
installed_path: '{project-root}/_bmad/lens/workflows/bootstrap'
---
```

### Mode

- [x] Create-only (steps-c/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Planned Steps

| Step | Name | Goal | Status |
|------|------|------|--------|
| 0 | Preflight checks | Validate TargetProjects guardrails and dependencies | ✅ Implemented |
| 1 | Load lens domain map | Load domain-map.yaml and service definitions | ✅ Implemented |
| 2 | Scan target project | Inventory current folder structure | ✅ Implemented |
| 3 | Compare and approve | Identify gaps and get user approval | ✅ Implemented |
| 4 | Execute sync & report | Create folders, clone repositories, generate report | ✅ Implemented |

---

## Workflow Inputs

### Required Inputs

- `domain-map.yaml`
- `service.yaml`
- `target_project_root`

### Optional Inputs

- Target domain/service/microservice filters
- Git credentials

---

## Workflow Outputs

### Output Format

- [x] Document-producing
- [ ] Non-document

### Output Files

- `{project-root}/_bmad-output/bootstrap-report.md`

---

## Agent Integration

### Primary Agent

Bridge

### Other Agents

Link (integrity checks)

---

## Implementation Notes

**Integrated with LENS Startup:** This workflow is automatically triggered during first-run setup (Phase 5.5 of bmad.start.prompt.md) when bootstrap configuration is detected but TargetProjects/ is empty or missing.

**Integration Points:**
- **Trigger**: Detected in Phase 3.1 of startup when `domain-map.yaml` exists but `TargetProjects/` needs population
- **Timing**: Executes after extension initialization (Phase 5.1-5.4) to ensure Scout can immediately index cloned repositories
- **User Control**: Approval prompts in Step 3 prevent accidental massive clones
- **Output**: Creates `_bmad-output/bootstrap-report.md` with detailed status and updates Scout discovery index

**Key Features:**
- ✅ Create-only mode (never deletes existing repositories)
- ✅ TargetProjects/ guardrails prevent cloning outside safe zones
- ✅ Explicit branch checkout enforcement (no implicit defaults)
- ✅ Partial clone preservation on failure for diagnostics
- ✅ Network pre-checks before bulk cloning
- ✅ Progress tracking with rollback capability

**See Also:**
- [bmad.start.prompt.md](../../prompts/bmad.start.prompt.md) - Startup workflow integration
- [Bootstrap Integration Guide](./docs/bootstrap-integration.md) - Detailed integration documentation

---

_Spec created on 2026-01-31 via BMAD Module workflow_
