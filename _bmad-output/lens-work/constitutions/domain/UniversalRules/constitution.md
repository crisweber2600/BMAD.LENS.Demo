---
layer: domain
name: "UniversalRules"
created_by: "Cris Weber"
ratification_date: "2026-02-07"
last_amended: "2026-02-07"
amendment_count: 1
---

# Domain Constitution: UniversalRules

**Inherits From:** None (root constitution)
**Version:** 1.1.0
**Ratified:** February 7, 2026
**Last Amended:** February 7, 2026

---

## Preamble

This constitution establishes the foundational governance principles for all software development. These articles apply to every service, microservice, and feature regardless of domain or team.

We hold these principles to ensure consistency, security, quality, and maintainability across our entire technology portfolio. They are derived from proven practices in enterprise software development, focusing on test-driven development, comprehensive observability, clear documentation structure, API-first design, and security by design.

---

## Articles

### Article I: Test-Driven Development (NON-NEGOTIABLE)

**Red-Green-Refactor cycle is mandatory for all feature development and migration work.**

**Non-Negotiable Rules:**
- Tests MUST be written before implementation code
- Tests MUST fail before implementation (Red phase)
- Implementation MUST pass all tests (Green phase)
- Code cleanup happens after tests pass (Refactor phase)
- Minimum test coverage: 80% for migrated code
- Integration tests required for: API contract changes, cross-service communication, data migrations

**Rationale:** Legacy codebase migration requires high confidence that functionality is preserved. TDD ensures safety and enables refactoring with proof of correctness.

**Evidence Required:**
- Test files created before implementation files (git timestamps)
- Test coverage reports showing ≥80% coverage
- CI/CD pipeline test execution logs
- Code review confirmation of TDD adherence

---

### Article V: Observability First

**Every service/component emits structured logs and distributed traces.**

**Non-Negotiable Rules:**
- Structured logging (JSON format) mandatory for all services
- Correlation IDs propagated across service boundaries
- Distributed tracing enabled (OpenTelemetry standard)
- Key metrics: request latency, error rates, feature flag evaluation counts
- All authentication/authorization events logged (compliance requirement)
- Logs retained per organizational policy (default: 90 days)

**Rationale:** Complex systems with multiple services require observability to enable fast incident response and anomaly detection. Without structured logs and traces, troubleshooting becomes impossible at scale.

**Evidence Required:**
- Structured log output samples (JSON format)
- Distributed trace examples showing correlation IDs
- OpenTelemetry instrumentation in code
- Metrics dashboard configuration
- Log retention policy documentation

---

### Article VI: Domain-Driven Document Structure

**Business requirements decomposed into domain-specific folders with clear vertical slices.**

**Non-Negotiable Rules:**
- Business requirement documents organized by bounded domain (e.g., "Local Authentication", "Session Management")
- Large domains (>5 concepts) MUST be split into multiple focused documents
- Each domain document includes: Must-Have Behaviors, User Stories, BDD Scenarios, Acceptance Criteria
- Technical requirements mirror business requirement structure (1:1 mapping)
- Plan documents generated from domain structure (not monolithic)
- Splitting criteria: 5+ core concepts OR 4+ user personas OR 15+ endpoints

**Rationale:** Enables clear vertical slice definition, reduces coordination overhead, improves test organization. Monolithic documentation creates bottlenecks and makes it difficult to parallelize work.

**Evidence Required:**
- Domain-organized directory structure
- Business requirements documents with clearly defined bounded contexts
- Technical requirements showing 1:1 mapping to business requirements
- Plan documents scoped to vertical slices
- Documentation review confirming splitting criteria compliance

---

### Article VII: API-First Contract Definition

**OpenAPI specification is source of truth; implementation follows contract.**

**Non-Negotiable Rules:**
- All API endpoints defined in OpenAPI before implementation
- Mock server auto-generated from OpenAPI (if tooling available)
- Implementation MUST satisfy OpenAPI contract
- Breaking changes require explicit amendment to OpenAPI spec
- Backward compatibility mapping documented in `MIGRATION_NOTES.md` for each service

**Rationale:** Prevents scope creep, enables parallel development, simplifies client integration. API-first design ensures frontend and backend teams can work independently with a clear contract.

**Evidence Required:**
- OpenAPI specification files (YAML/JSON)
- Mock server configuration referencing OpenAPI contract
- API implementation code with contract validation
- Swagger UI or similar API documentation interface
- MIGRATION_NOTES.md documenting breaking changes

---

### Article VIII: Security & Compliance by Design

**Security controls baked into architecture, not added after implementation.**

**Non-Negotiable Rules:**
- All authentication flows use JWT with RS256 signing (default)
- Multi-tenancy isolation enforced at data access layer, not UI layer
- Compliance requirements: audit logs for sensitive data access, GDPR-ready deletion paths
- Secrets never in code; configuration service provides runtime injection
- TLS 1.2+ required for all external communication
- Security requirements captured in technical specs; security tests part of TDD cycle

**Rationale:** Sensitive data requires security controls from day one; security cannot be retrofitted. Baking security into architecture prevents vulnerabilities and ensures compliance with data protection regulations.

**Evidence Required:**
- Authentication implementation using JWT with RS256
- Data access layer code showing multi-tenancy enforcement
- Audit log implementation for sensitive data access
- Secret management configuration (e.g., Azure Key Vault, AWS Secrets Manager)
- TLS configuration for external services
- Security test cases in test suites

---

### Article IX: Acceptance Criteria Validation via BDD Tests

**All Acceptance Criteria must be reflected in BDD tests; stories incomplete until tests pass.**

**Non-Negotiable Rules:**
- Every Acceptance Criteria item MUST have a corresponding BDD test (Given/When/Then format)
- BDD tests MUST be written in executable specification format (e.g., SpecFlow, Cucumber, Gherkin)
- All BDD tests MUST pass before a story can be marked as complete
- Test scenarios MUST be reviewed and approved by stakeholders during specification phase
- Test execution results MUST be tracked and visible to the entire team
- Failed BDD tests block story completion regardless of implementation status
- Stories CANNOT be closed, deployed, or considered "done" with failing BDD tests

**Rationale:** Acceptance Criteria define what "done" means for a story. BDD tests provide executable verification that AC is met, preventing ambiguity and scope creep. Requiring tests to pass ensures delivered functionality matches stakeholder expectations and prevents regression. This bridges the gap between business requirements and technical implementation.

**Evidence Required:**
- BDD test files in Gherkin/SpecFlow format matching AC items
- Test execution reports showing 100% BDD test pass rate for completed stories
- Traceability matrix mapping AC items to BDD scenarios
- Stakeholder sign-off on test scenarios during spec review
- CI/CD pipeline BDD test execution logs
- Story completion checklist confirming all BDD tests passing

---

## Amendments

### Amendment 1 — February 7, 2026

**Type:** Add Article
**Article:** Article IX: Acceptance Criteria Validation via BDD Tests
**Rationale:** Formalize the requirement that Acceptance Criteria must be validated through executable BDD tests before stories can be considered complete. This ensures alignment between business requirements and delivered functionality.
**Ratified By:** Cris Weber
**Version:** 1.0.0 → 1.1.0

---

## Rationale

This constitution establishes the foundational standards for all software development within the organization. These six principles — Test-Driven Development, Observability, Domain-Driven Documentation, API-First Design, Security by Design, and Acceptance Criteria Validation — form the bedrock of quality software engineering practice.

All services, microservices, and features inheriting from this domain are bound by these articles.

---

## Governance

### Amendment Process

1. Propose amendment via `/constitution` amend mode
2. Require approval from Architecture Review Board or Engineering Leadership
3. Ratify amendment — Scribe records and Casey commits
4. Amendment logged via Tracey (`constitution-amended` event)

### Enforcement

- Compliance checks run via `/compliance` command
- Violations surface as WARN or FAIL per article
- Exemptions require documented justification approved by Architecture Review Board

### Scope of Application

This constitution applies to:
- All new service development
- All legacy system migration work
- All feature development regardless of team or domain
- All refactoring and modernization efforts

---

_Constitution ratified on February 7, 2026 by Cris Weber_
