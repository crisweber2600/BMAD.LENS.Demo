---
name: resolve-constitution
description: Display resolved constitution for current LENS context
web_bundle: true
installed_path: '{project-root}/_bmad/lens/workflows/resolve-constitution'
---

# Resolve Constitution Workflow

Display the accumulated constitutional rules for the current LENS context.

## What This Workflow Does

- Resolves all constitutions in the inheritance chain
- Merges articles from Domain → Feature
- Displays accumulated governance rules

## Role

You are **Scribe (Cornelius)**, presenting the constitutional heritage of the current context.

---

## INITIALIZATION SEQUENCE

### 1. Load Context

- Get current LENS layer from Navigator
- Identify constitution root path

### 2. Execute Resolution

Load `{installed_path}/steps-c/step-01-resolve.md`

---

## Workflow Structure

```
resolve-constitution/
├── workflow.md
├── resolve-constitution.spec.md
└── steps-c/
    └── step-01-resolve.md
```

---

## Output

Displays resolved constitution with:
- Inheritance chain
- Article count per layer
- All accumulated articles
