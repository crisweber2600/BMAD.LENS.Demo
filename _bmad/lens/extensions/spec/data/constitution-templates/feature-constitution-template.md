# Feature Constitution: {Feature Name}

**Inherits From:** `../{microservice}/constitution.md`  
**Version:** 1.0.0  
**Ratified:** {YYYY-MM-DD}  
**Last Amended:** {YYYY-MM-DD}

---

## Preamble

This constitution governs the {Feature Name} feature implementation. It inherits all articles from Microservice, Service, and Domain Constitutions.

{Brief description of the feature}

---

## Inherited Articles

*All articles from parent Constitutions apply automatically.*

---

## Feature Articles

### Article XIII: Test Coverage

This feature must maintain minimum 80% unit test coverage and 100% coverage of critical paths.

**Rationale:** Features without adequate testing become liabilities during refactoring.

**Evidence Required:** Coverage report meeting thresholds.

---

### Article XIV: Code Review

All code changes must be reviewed by at least one team member before merge.

**Rationale:** Code review catches defects and shares knowledge.

**Evidence Required:** Approved Pull Request.

---

### Article XV: Documentation Updates

Feature implementation must update relevant documentation (README, API docs, user guides).

**Rationale:** Documentation drift erodes system understanding over time.

**Evidence Required:** Documentation commits with implementation.

---

### Article XVI: Feature Flag

This feature must be deployable behind a feature flag for gradual rollout.

**Rationale:** Feature flags enable safe deployment and quick rollback.

**Evidence Required:** Feature flag configuration.

---

## Acceptance Criteria

{List specific acceptance criteria for this feature}

---

## Governance

### Amendment Process

Feature constitutions are typically not amended; they are versioned with each iteration.

### Owner

- Developer: {Name}
- Reviewer: {Name}

---

_Constitution ratified on {YYYY-MM-DD}_
