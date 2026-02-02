# Microservice Constitution: {Microservice Name}

**Inherits From:** `../{service}/constitution.md`  
**Version:** 1.0.0  
**Ratified:** {YYYY-MM-DD}  
**Last Amended:** {YYYY-MM-DD}

---

## Preamble

This constitution governs the {Microservice Name} microservice within the {Service Name} bounded context. It inherits all articles from the Service and Domain Constitutions.

{Brief description of the microservice's responsibility}

---

## Inherited Articles

*All articles from Service and Domain Constitutions apply automatically.*

---

## Microservice Articles

### Article IX: Rate Limiting

All public endpoints must implement rate limiting with configurable thresholds.

**Rationale:** Unbounded request rates can overwhelm the service and impact dependent systems.

**Evidence Required:** Rate limiting configuration or middleware in implementation.

---

### Article X: Idempotency

All mutating operations (POST, PUT, DELETE) must support idempotency keys.

**Rationale:** Retry-safe operations are essential for reliable distributed systems.

**Evidence Required:** Idempotency key handling in API design or implementation.

---

### Article XI: Circuit Breaker

All outbound service calls must use circuit breaker patterns.

**Rationale:** Cascading failures from downstream services must be contained.

**Evidence Required:** Circuit breaker configuration in service implementation.

---

### Article XII: Data Ownership

This microservice owns the following data entities: {list entities}

**Rationale:** Clear data ownership prevents conflicting writes and schema drift.

**Evidence Required:** Data model documentation.

---

## Deployment Constraints

- **Scaling:** {Auto-scale rules}
- **Resources:** {Memory/CPU limits}
- **Dependencies:** {Required services}

---

## Governance

### Amendment Process

1. Propose amendment via Pull Request
2. Require approval from Tech Lead
3. Ratify with Tech Lead approval

### Tech Lead

- Name: {Lead Name}
- Contact: {Contact Info}

---

_Constitution ratified on {YYYY-MM-DD}_
