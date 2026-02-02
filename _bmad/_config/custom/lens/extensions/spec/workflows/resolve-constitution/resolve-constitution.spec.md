# Workflow Specification: resolve-constitution

**Module:** spec (LENS extension)
**Agent:** Scribe
**Status:** To be created via workflow-builder
**Created:** 2026-01-31

---

## Workflow Metadata

```yaml
name: resolve-constitution
description: Display resolved constitution for current LENS context
web_bundle: true
installed_path: '{project-root}/_bmad/lens/workflows/resolve-constitution'
```

---

## Purpose

Resolve and display the accumulated constitutional rules for the current LENS context, showing inherited articles from all parent layers.

---

## Inputs

| Input | Source | Required |
|-------|--------|----------|
| LENS context | Runtime | Yes |
| Format preference | User | Optional (default: summary) |

---

## Outputs

| Output | Format |
|--------|--------|
| Resolved constitution display | Markdown (console) |
| Article count | Number |
| Inheritance chain | List |

---

## Resolution Algorithm

1. Detect current LENS layer
2. Find constitution at current layer (if exists)
3. Walk up inheritance chain to Domain
4. Collect all articles (child → parent order)
5. Merge articles (later additions override display order)
6. Return accumulated rules

---

## Display Format

```markdown
📜 Resolved Constitution: {current_layer}

**Inheritance Chain:**
1. Domain Constitution (5 articles)
2. ecommerce Service Constitution (4 articles)
3. checkout-api Constitution (6 articles)

**Total Articles:** 15

---

## Domain Articles (inherited)
- Article I: Security Review Required
- Article II: Data Classification

## Service Articles (inherited)
- Article III: API Versioning
- Article IV: PCI Compliance

## Local Articles
- Article V: Rate Limiting
- Article VI: Idempotency Keys
```

---

## Success Criteria

- All constitutions in chain loaded
- Articles displayed in inheritance order
- Total count accurate
- Performance < 5 seconds

---

_Spec created on 2026-01-31 via BMAD Module workflow_
