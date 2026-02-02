# Workflow Specification: validate-schema

**Module:** lens
**Status:** Placeholder — To be created via create-workflow workflow
**Created:** 2026-01-31

---

## Workflow Overview

**Goal:** Validate lens data against schemas.

**Description:** Verify domain/service/microservice metadata conforms to expected schemas and report issues.

**Workflow Type:** Core

---

## Workflow Structure

### Entry Point

```yaml
---
name: validate-schema
description: Validate lens data against schemas
web_bundle: true
installed_path: '{project-root}/_bmad/lens/workflows/validate-schema'
---
```

### Mode

- [x] Create-only (steps-c/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 1 | Load schemas | Load lens schema definitions |
| 2 | Validate data | Check domain/service/microservice files |
| 3 | Summarize issues | Aggregate errors and warnings |
| 4 | Report results | Write validation report |

---

## Workflow Inputs

### Required Inputs

- Lens schemas
- Lens metadata files

### Optional Inputs

- Target domain/service filters

---

## Workflow Outputs

### Output Format

- [x] Document-producing
- [ ] Non-document

### Output Files

- `{project-root}/_bmad-output/validate-schema-report.md`

---

## Agent Integration

### Primary Agent

Link

### Other Agents

None

---

## Implementation Notes

**Use the create-workflow workflow to build this workflow.**

---

_Spec created on 2026-01-31 via BMAD Module workflow_
