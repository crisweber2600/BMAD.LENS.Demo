# Domain Constitution: {Enterprise Name}

**Inherits From:** None (root constitution)  
**Version:** 1.0.0  
**Ratified:** {YYYY-MM-DD}  
**Last Amended:** {YYYY-MM-DD}

---

## Preamble

This constitution establishes the foundational governance principles for all software development within {Enterprise Name}. These articles apply to every service, microservice, and feature regardless of domain or team.

We hold these principles to ensure consistency, security, quality, and maintainability across our entire technology portfolio.

---

## Articles

### Article I: Security Review Required

All features that handle user data, authentication, or external integrations must undergo security review before implementation.

**Rationale:** Security vulnerabilities discovered post-deployment are 10x more costly to remediate than those caught during design.

**Evidence Required:** Security review sign-off or security section in PRD.

---

### Article II: Data Classification

All data elements must be classified according to the enterprise data classification policy (Public, Internal, Confidential, Restricted).

**Rationale:** Data handling requirements differ by classification; misclassification leads to compliance violations.

**Evidence Required:** Data classification section in architecture documents.

---

### Article III: API Versioning

All APIs must implement semantic versioning and maintain backward compatibility within major versions.

**Rationale:** Breaking changes without versioning cause cascading failures across dependent services.

**Evidence Required:** API versioning strategy in architecture documents.

---

### Article IV: Observability

All services must emit structured logs, metrics, and traces sufficient for debugging production issues.

**Rationale:** Services without observability become black boxes during incidents.

**Evidence Required:** Observability section in architecture or operations documentation.

---

### Article V: Documentation

All services must maintain up-to-date README, API documentation, and runbook.

**Rationale:** Undocumented services cannot be effectively maintained or handed off.

**Evidence Required:** Documentation artifacts in repository.

---

### Article VI: Documentation Discipline

Agents must NOT create markdown documents, summaries, or reports unless they are:
1. Explicitly requested by the user, OR
2. Required as an output artifact by a BMAD workflow, OR
3. Part of the standard BMAD process documentation (PRDs, architecture docs, etc.)

**Rationale:** Unsolicited documentation creates noise, clutters repositories, and dilutes the value of essential documentation. Every document must serve a clear purpose within the BMAD process.

**Evidence Required:** All created markdown files must be traceable to user request or workflow specification.

**Violations:** Creating summary documents, implementation reports, or "for your reference" documentation without explicit instruction.

---

## Governance

### Amendment Process

1. Propose amendment via Pull Request to this constitution
2. Require approval from Architecture Review Board
3. Allow 5 business days for comment period
4. Ratify with 2/3 majority of ARB members

### Enforcement

- Compliance checks are run automatically via SPEC
- Violations block implementation until resolved
- Exemptions require documented justification and ARB approval

---

_Constitution ratified on {YYYY-MM-DD}_
