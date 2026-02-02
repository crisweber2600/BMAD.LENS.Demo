# Workflow Specification: generate-docs

**Module:** lens
**Status:** Placeholder — To be created via create-workflow workflow
**Created:** 2026-01-31

---

## Workflow Overview

**Goal:** Generate documentation from analysis findings.

**Description:** Transform analysis results into BMAD-ready documentation artifacts.

**Workflow Type:** Core

---

## Workflow Structure

### Entry Point

```yaml
---
name: generate-docs
description: Generate BMAD-ready documentation from analysis
web_bundle: true
installed_path: '{project-root}/_bmad/lens/workflows/generate-docs'
---
```

### Mode

- [x] Create-only (steps-c/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 1 | Load analysis | Read analysis results and context |
| 2 | Map templates | Select appropriate doc templates |
| 3 | Generate docs | Create architecture, API, data, integration docs |
| 4 | Write outputs | Save documentation artifacts |

---

## Workflow Inputs

### Required Inputs

- Analysis results from analyze-codebase
- `docs_output_folder`

### Optional Inputs

- Target selection (domain/service/microservice)

---

## Workflow Outputs

### Output Format

- [x] Document-producing
- [ ] Non-document

### Output Structure

**IMPORTANT:** Documentation follows the same domain/service folder structure as TargetProjects.

```
docs/                              # Project root /docs folder
├── {Domain}/
│   └── {Service}/
│       ├── architecture.md
│       ├── api-surface.md
│       ├── data-model.md
│       ├── integration-map.md
│       └── onboarding.md
└── README.md                      # Index of all generated docs
```

**NOT** `_bmad-output/docs` - documentation goes in the project's `/docs` folder.

### Output Files

- `docs/{domain}/{service}/architecture.md`
- `docs/{domain}/{service}/api-surface.md`
- `docs/{domain}/{service}/data-model.md`
- `docs/{domain}/{service}/integration-map.md`
- `docs/{domain}/{service}/onboarding.md`

---

## Agent Integration

### Primary Agent

Scout

### Other Agents

Link (propagation)

---

## Implementation Notes

**Use the create-workflow workflow to build this workflow.**

---

_Spec created on 2026-01-31 via BMAD Module workflow_
