# Constitution Guide

Everything you need to know about creating and managing constitutions.

---

## What is a Constitution?

A constitution is a governance document that defines non-negotiable rules for your codebase. These rules are automatically applied to all BMAD workflows when SPEC is installed.

---

## Constitution Hierarchy

Constitutions follow the LENS layer hierarchy:

```
Domain Constitution (enterprise-wide)
    ↓ inherits
Service Constitution (bounded context)
    ↓ inherits
Microservice Constitution (single service)
    ↓ inherits
Feature Constitution (implementation)
```

### Inheritance Rules

1. **Automatic** — All parent articles apply to children
2. **Additive** — New articles may be added at any level
3. **Non-Contradictory** — Children cannot weaken parent rules
4. **Specializing** — Children can add context-specific guidance

---

## Creating Constitutions

### Domain Constitution

Create once at the enterprise level:

```
scribe, constitution
```

Select: `[C] Create`
Layer: `Domain`

Add articles that apply everywhere:
- Security requirements
- Data classification
- API versioning standards
- Observability requirements

### Service Constitution

Create for each bounded context:

Navigate to the service folder, then:

```
scribe, constitution
```

The constitution will automatically inherit from Domain.

### Microservice & Feature Constitutions

Follow the same process at lower LENS layers. Each inherits from its parent.

---

## Constitution Structure

```markdown
# {Layer} Constitution: {Name}

**Inherits From:** {parent_path}
**Version:** {MAJOR.MINOR.PATCH}
**Ratified:** {YYYY-MM-DD}
**Last Amended:** {YYYY-MM-DD}

## Preamble
{Why this constitution exists}

## Articles

### Article I: {Name}
{Rule with rationale}

**Rationale:** {Why this rule exists}
**Evidence Required:** {What demonstrates compliance}

## Governance
{Amendment process}
```

---

## Writing Good Articles

### Do

- ✅ Be specific and actionable
- ✅ Include rationale (the "why")
- ✅ Define what evidence satisfies the article
- ✅ Use clear, unambiguous language

### Don't

- ❌ Write vague principles without enforcement criteria
- ❌ Create rules that can't be verified
- ❌ Duplicate what parent constitutions already cover
- ❌ Make rules so strict they're always bypassed

---

## Amending Constitutions

To modify an existing constitution:

```
scribe, constitution
```

Select: `[A] Amend`

You can:
- Add new articles
- Clarify existing articles
- Update governance procedures

**Note:** You cannot remove or weaken inherited articles.

---

## Best Practices

### Start Small

Begin with 3-5 essential domain articles. Add more as patterns emerge.

### Document Rationale

Every article should answer: "Why does this rule exist?"

### Make Evidence Clear

Define exactly what artifact proves compliance.

### Review Regularly

Schedule quarterly constitution reviews to remove outdated rules.

---

_Constitution Guide for SPEC — 2026-01-31_
