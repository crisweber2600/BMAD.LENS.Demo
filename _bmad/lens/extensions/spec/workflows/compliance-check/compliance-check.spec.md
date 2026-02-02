# Workflow Specification: compliance-check

**Module:** spec (LENS extension)
**Agent:** Scribe
**Status:** To be created via workflow-builder
**Created:** 2026-01-31

---

## Workflow Metadata

```yaml
name: compliance-check
description: Validate artifacts against resolved constitution
web_bundle: true
installed_path: '{project-root}/_bmad/lens/workflows/compliance-check'
```

---

## Purpose

Validate PRDs, architecture documents, stories, or code against the accumulated constitutional rules for the current LENS context.

---

## Inputs

| Input | Source | Required |
|-------|--------|----------|
| Artifact path | User | Yes |
| LENS context | Runtime | Yes |
| Resolved constitution | Runtime (via resolve) | Yes |

---

## Outputs

| Output | Format |
|--------|--------|
| Compliance report | Markdown (console) |
| Pass/Fail verdict | Boolean |
| Violation details | List |

---

## Validation Process

1. Load artifact content
2. Resolve constitution for current context
3. For each article:
   - Check if artifact addresses the requirement
   - Mark: ✅ Satisfied, ⚠️ Not verified, ❌ Violated
4. Generate compliance report
5. Update sidecar with results

---

## Report Format

```markdown
🧾 Constitutional Compliance Review

**Artifact:** docs/prd-checkout-v2.md
**Context:** ecommerce/checkout-api (Microservice)
**Checking against:** 3 constitutions (15 articles)

---

## Results

✅ Article I: Security Review — Satisfied
   Evidence: Section 4.2 addresses security requirements

✅ Article II: API Versioning — Satisfied
   Evidence: Versioning strategy in Section 3.1

⚠️ Article V: Rate Limiting — Not verified
   Expected: Rate limit specification
   Found: No mention of rate limits

❌ Article VI: Idempotency — Violated
   Expected: Idempotency key requirement
   Found: POST endpoints without idempotency

---

## Verdict

**Status:** ⚠️ ATTENTION REQUIRED

- Satisfied: 13/15 articles
- Not verified: 1/15 articles
- Violated: 1/15 articles

**Recommendation:** Address rate limiting and idempotency before implementation.
```

---

## Success Criteria

- All articles evaluated
- Clear evidence for each assessment
- Actionable recommendations for violations
- Report logged to sidecar

---

_Spec created on 2026-01-31 via BMAD Module workflow_
