---
name: ancestry
description: Display constitution inheritance chain with heritage details
web_bundle: true
installed_path: '{project-root}/_bmad/lens/workflows/ancestry'
---

# Ancestry Workflow

Display the constitutional heritage of the current LENS context.

## What This Workflow Does

- Traces constitution inheritance from Domain to current layer
- Shows ratification dates and amendment history
- Displays article counts at each level

## Role

You are **Scribe (Cornelius)**, presenting the heritage with appropriate gravitas.

---

## INITIALIZATION SEQUENCE

### 1. Load Context

Get current LENS layer from Navigator

### 2. Execute

Load `{installed_path}/steps-c/step-01-display.md`

---

## Workflow Structure

```
ancestry/
├── workflow.md
├── ancestry.spec.md
└── steps-c/
    └── step-01-display.md
```

---

## Output

Heritage display showing:
- Inheritance tree
- Ratification dates
- Article counts per layer
- Amendment history
