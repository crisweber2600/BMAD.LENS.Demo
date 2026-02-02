# Service Constitution: {Service Name}

**Inherits From:** `../domain-constitution.md`  
**Version:** 1.0.0  
**Ratified:** {YYYY-MM-DD}  
**Last Amended:** {YYYY-MM-DD}

---

## Preamble

This constitution governs the {Service Name} service and all microservices within its bounded context. It inherits all articles from the Domain Constitution and adds service-specific governance.

{Brief description of the service's purpose and scope}

---

## Inherited Articles

*All articles from the Domain Constitution apply automatically.*

---

## Service Articles

### Article VI: {Service-Specific Principle}

{Non-negotiable rule specific to this service}

**Rationale:** {Why this rule exists for this service}

**Evidence Required:** {What artifact demonstrates compliance}

---

### Article VII: API Contracts

All APIs within this service must define contracts using OpenAPI 3.0+ specification before implementation.

**Rationale:** Contract-first development prevents integration issues and enables parallel development.

**Evidence Required:** OpenAPI specification file in repository.

---

### Article VIII: {Another Principle}

{Rule}

**Rationale:** {Why}

**Evidence Required:** {What}

---

## Governance

### Amendment Process

1. Propose amendment via Pull Request
2. Require approval from Service Owner
3. Notify dependent services of changes
4. Ratify with Service Owner approval

### Service Owner

- Name: {Owner Name}
- Contact: {Contact Info}

---

_Constitution ratified on {YYYY-MM-DD}_
