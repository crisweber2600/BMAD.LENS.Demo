# Workflow Specification: resolve-context

**Module:** spec (LENS extension)
**Status:** Implemented
**Created:** 2026-01-31

---

## Workflow Overview

**Goal:** Resolve constitutional governance context for the current LENS layer.

**Description:** Internal workflow that extends LENS context with constitutional data. Called automatically during context loading and on-demand by Scribe.

**Workflow Type:** Internal/System

---

## Workflow Structure

### Entry Point

```yaml
---
name: resolve-context
description: Resolve constitutional context for current LENS layer
web_bundle: true
installed_path: '{project-root}/_bmad/lens/workflows/resolve-context'
---
```

### Mode

- [x] Create-only (steps-c/)

---

## Workflow Inputs

### Required Inputs

- `current_layer` — From LENS Navigator
- `layer_path` — Current lens path
- `constitution_root` — From SPEC config

### Optional Inputs

- `force_refresh` — Bypass cache

---

## Workflow Outputs

### Output Format

- [ ] Document-producing
- [x] Non-document (context extension)

### Output Variables

```yaml
constitutional_context:
  resolved_constitution: object | null
  constitution_chain: array
  constitution_article_count: integer
  constitution_last_amended: string | null
  constitution_depth: integer
```

---

## Integration Points

### Called By

- LENS `context-load` workflow (automatic)
- Scribe agent (on-demand resolution)
- SPEC command router (pre-workflow check)

### Dependencies

- LENS Navigator (context detection)
- Constitution files in `{constitution_root}/`

---

## Implementation Notes

- Cache resolved context per session
- Invalidate on constitution changes
- Null-safe when no constitutions exist

---

_Spec created on 2026-01-31 via BMAD Module workflow_
