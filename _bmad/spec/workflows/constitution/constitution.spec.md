# Workflow Specification: constitution

**Module:** spec (LENS extension)
**Agent:** Scribe
**Status:** To be created via workflow-builder
**Created:** 2026-01-31

---

## Workflow Metadata

```yaml
name: constitution
description: Create or amend constitution files
web_bundle: true
installed_path: '{project-root}/_bmad/lens/workflows/constitution'
```

---

## Purpose

Create new constitutions or amend existing ones at any LENS layer. Enforces inheritance rules and prevents contradictions with parent constitutions.

---

## Modes

- **Create** — New constitution for a layer that doesn't have one
- **Amend** — Add or modify articles in an existing constitution

---

## Inputs

| Input | Source | Required |
|-------|--------|----------|
| LENS context | Runtime | Yes |
| Layer (Domain/Service/Microservice/Feature) | User or auto-detect | Yes |
| Constitution name | User | Yes (for create) |
| Articles | User | Yes |

---

## Outputs

| Output | Location | Format |
|--------|----------|--------|
| Constitution file | `{constitution_root}/{path}/constitution.md` | Markdown |
| Amendment log | Scribe sidecar | YAML |

---

## Steps

1. **Detect context** — Get current LENS layer
2. **Check existing** — Is there a constitution at this layer?
3. **Route mode** — Create or Amend
4. **Gather articles** — Elicit rules from user
5. **Validate inheritance** — Check for contradictions with parents
6. **Generate constitution** — Create/update the file
7. **Ratify** — User confirms, file is written
8. **Update sidecar** — Log the operation

---

## Inheritance Validation

Before creating/amending, check:
- Load parent constitution(s)
- Compare new articles against parent articles
- If contradiction detected → Constitutional Crisis mode
- User must resolve before proceeding

---

## Template Used

Constitution files follow this structure:

```markdown
# {Layer} Constitution: {Name}

**Inherits From:** {parent_path}
**Version:** {version}
**Ratified:** {date}
**Last Amended:** {date}

## Preamble
{purpose}

## Articles

### Article I: {name}
{rule with rationale}

## Governance
{amendment process}
```

---

## Success Criteria

- Constitution file created/updated at correct location
- Inheritance validated (no contradictions)
- Sidecar updated with operation log
- User received ratification confirmation

---

_Spec created on 2026-01-31 via BMAD Module workflow_
