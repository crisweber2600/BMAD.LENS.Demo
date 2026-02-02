# Workflow Specification: ancestry

**Module:** spec (LENS extension)
**Agent:** Scribe
**Status:** To be created via workflow-builder
**Created:** 2026-01-31

---

## Workflow Metadata

```yaml
name: ancestry
description: Display constitution inheritance chain with heritage details
web_bundle: true
installed_path: '{project-root}/_bmad/lens/workflows/ancestry'
```

---

## Purpose

Display the constitutional ancestry — the inheritance chain showing how governance flows from Domain to the current context, with ratification dates and article counts.

---

## Inputs

| Input | Source | Required |
|-------|--------|----------|
| LENS context | Runtime | Yes |

---

## Outputs

| Output | Format |
|--------|--------|
| Heritage display | Markdown (console) |

---

## Display Format

```markdown
📜 Constitution Ancestry: checkout-api

Domain Constitution (ratified 2024-03-15)
├─ 5 articles
├─ Last amended: 2025-06-01
│
└─ ecommerce Service Constitution (ratified 2024-06-01)
   ├─ 4 articles (+9 inherited = 9 total)
   ├─ Last amended: 2025-09-15
   │
   └─ checkout-api Constitution (ratified 2025-01-10)
      ├─ 6 articles (+9 inherited = 15 total)
      ├─ Last amended: 2026-01-20
      │
      └─ [YOU ARE HERE]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total inherited articles: 15
Constitution depth: 3 layers
Oldest ratification: 2024-03-15
Most recent amendment: 2026-01-20
```

---

## Success Criteria

- Complete ancestry chain displayed
- Ratification dates shown
- Article counts (local + inherited) accurate
- Visual hierarchy clear

---

_Spec created on 2026-01-31 via BMAD Module workflow_
