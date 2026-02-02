# SPEC Examples

Real-world examples of constitutional governance in action.

---

## Example 1: E-Commerce Domain Setup

### Domain Constitution

```markdown
# Domain Constitution: Acme Corp

**Inherits From:** None
**Version:** 1.0.0
**Ratified:** 2024-03-15

## Preamble

This constitution establishes governance for all Acme Corp software.

## Articles

### Article I: Security Review
All features handling user data require security review.

### Article II: API Versioning
All APIs must implement semantic versioning.

### Article III: Observability
All services must emit logs, metrics, and traces.
```

### Service Constitution (ecommerce)

```markdown
# Service Constitution: E-Commerce Platform

**Inherits From:** ../domain-constitution.md
**Version:** 1.0.0
**Ratified:** 2024-06-01

## Preamble

Governance for the e-commerce bounded context.

## Service Articles

### Article IV: PCI Compliance
All payment-related features must comply with PCI-DSS.

### Article V: Cart State
Shopping cart state must survive session expiration.
```

### Microservice Constitution (checkout-api)

```markdown
# Microservice Constitution: Checkout API

**Inherits From:** ../ecommerce/constitution.md
**Version:** 1.0.0
**Ratified:** 2025-01-10

## Microservice Articles

### Article VI: Rate Limiting
All endpoints limited to 100 requests/minute per user.

### Article VII: Idempotency
All POST/PUT operations support idempotency keys.
```

---

## Example 2: Compliance Check Output

Running `/scribe, compliance` on a PRD:

```
🧾 Constitutional Compliance Review

Artifact: docs/prd-checkout-v2.md
Context: ecommerce/checkout-api (Microservice)
Checking against: 3 constitutions (7 articles)

---

## Results

✅ Article I: Security Review — Satisfied
   Evidence: Section 4.2 "Security Considerations" addresses requirements

✅ Article II: API Versioning — Satisfied
   Evidence: Section 3.1 specifies v2 endpoint versioning

✅ Article III: Observability — Satisfied
   Evidence: Section 5.1 defines logging and metrics strategy

✅ Article IV: PCI Compliance — Satisfied
   Evidence: Section 4.3 references PCI-DSS requirements

✅ Article V: Cart State — Satisfied
   Evidence: Section 2.4 describes cart persistence

⚠️ Article VI: Rate Limiting — Not verified
   Expected: Rate limit specification
   Found: No explicit mention of rate limiting

✅ Article VII: Idempotency — Satisfied
   Evidence: Section 3.2 defines idempotency key handling

---

## Verdict

Status: ⚠️ ATTENTION REQUIRED

- Satisfied: 6/7 articles
- Not verified: 1/7 articles
- Violated: 0/7 articles

Recommendation: Add rate limiting section before implementation.
```

---

## Example 3: Ancestry Display

Running `/scribe, ancestry`:

```
📜 Constitution Ancestry: checkout-api

Domain Constitution (ratified 2024-03-15)
├─ 3 articles
├─ Last amended: 2024-09-01
│
└─ ecommerce Service Constitution (ratified 2024-06-01)
   ├─ 2 articles (+3 inherited = 5 total)
   ├─ Last amended: 2024-11-15
   │
   └─ checkout-api Constitution (ratified 2025-01-10)
      ├─ 2 articles (+5 inherited = 7 total)
      ├─ Last amended: 2025-06-20
      │
      └─ [YOU ARE HERE]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total inherited articles: 7
Constitution depth: 3 layers
Oldest ratification: 2024-03-15
Most recent amendment: 2025-06-20
```

---

## Example 4: /specify with Constitution

Running `/specify checkout-v2`:

The resulting PRD automatically includes:

```markdown
## Constitutional Compliance

**Applicable Constitutions:**
1. Domain Constitution (3 articles)
2. ecommerce Service Constitution (2 articles)
3. checkout-api Constitution (2 articles)

**Total Articles:** 7

### Key Rules

- Security review required for user data handling
- PCI-DSS compliance for payment features
- Rate limiting on all endpoints
- Idempotency keys for mutations

### Compliance Checklist

- [ ] Article I: Security Review — address in Security section
- [ ] Article II: API Versioning — document version strategy
- [ ] Article III: Observability — define logging approach
- [ ] Article IV: PCI Compliance — reference PCI requirements
- [ ] Article V: Cart State — describe persistence
- [ ] Article VI: Rate Limiting — specify rate limits
- [ ] Article VII: Idempotency — define key handling
```

---

_Examples for SPEC — 2026-01-31_
