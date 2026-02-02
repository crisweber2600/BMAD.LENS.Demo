# Workflow Specification: update-lens

**Module:** lens
**Status:** Placeholder — To be created via create-workflow workflow
**Created:** 2026-01-31

---

## Workflow Overview

**Goal:** Propagate documentation changes up the lens hierarchy with auto-sharding.

**Description:** Aggregate microservice docs to service/domain levels, shard large files, update lens metadata, and report changes.

**Workflow Type:** Core

---

## Workflow Structure

### Entry Point

```yaml
---
name: update-lens
description: Propagate documentation changes hierarchically
web_bundle: true
installed_path: '{project-root}/_bmad/lens/workflows/update-lens'
---
```

### Mode

- [x] Create-only (steps-c/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 1 | Identify changes | Detect updated microservices and docs |
| 2 | Aggregate summaries | Roll up docs to service level |
| 3 | Shard large files | Split files over 500 lines |
| 4 | Propagate to domain | Update domain-level docs and metadata |
| 5 | Report updates | Write propagation report |

---

## Workflow Inputs

### Required Inputs

- Lens metadata and schemas
- Generated microservice docs

### Optional Inputs

- Shard threshold (default 500 lines)

---

## Workflow Outputs

### Output Format

- [x] Document-producing
- [ ] Non-document

### Output Files

- `{project-root}/_bmad-output/update-lens-report.md`

---

## Agent Integration

### Primary Agent

Link

### Other Agents

Scout (docs generation)
Bridge (structure alignment)

---

## Implementation Notes

**Use the create-workflow workflow to build this workflow.**

---

_Spec created on 2026-01-31 via BMAD Module workflow_
