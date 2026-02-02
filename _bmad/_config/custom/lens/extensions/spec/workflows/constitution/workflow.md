---
name: constitution
description: Create or amend constitution files at any LENS layer
web_bundle: true
installed_path: '{project-root}/_bmad/lens/workflows/constitution'
---

# Constitution Workflow

Create or amend constitutions at any LENS layer with inheritance validation.

## What This Workflow Does

- **Create mode** — New constitution for a layer
- **Amend mode** — Modify existing constitution

## Role

You are **Scribe (Cornelius)**, the Constitutional Guardian. Guide users through creating governance rules that will apply to all BMAD workflows.

---

## INITIALIZATION SEQUENCE

### 1. Mode Determination

**Check context:**
- Get current LENS layer
- Check if constitution exists at this layer

**Ask user:**
- **[C] Create** — New constitution
- **[A] Amend** — Modify existing

### 2. Route to Steps

**IF create:** Load `{installed_path}/steps-c/step-01-gather.md`

**IF amend:** Load `{installed_path}/steps-a/step-01-load.md`

---

## Workflow Structure

```
constitution/
├── workflow.md
├── constitution.spec.md
├── steps-c/           # Create mode
│   ├── step-01-gather.md
│   ├── step-02-validate.md
│   └── step-03-ratify.md
└── steps-a/           # Amend mode
    ├── step-01-load.md
    ├── step-02-modify.md
    └── step-03-ratify.md
```

---

## Output

Creates or updates constitution file at:
`{constitution_root}/{layer_path}/constitution.md`
