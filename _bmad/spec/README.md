# SPEC: Specification-Driven Enterprise Compass

Constitutional governance for BMAD workflows via LENS integration.

---

## Overview

SPEC bridges Spec-Kit's specification-driven workflow with BMAD's enterprise-scale, multi-agent orchestration. It provides familiar commands (`/specify`, `/plan`, `/tasks`, `/implement`) that route to existing BMAD workflows while adding **always-on constitutional governance** via LENS.

**Key Principle:** SPEC does not replace BMAD — it injects context, resolves governance, and delegates execution.

---

## Installation

SPEC is an extension of the LENS module. Install LENS first, then enable SPEC:

```bash
bmad install lens
```

---

## Quick Start

1. **Create a domain constitution** — `scribe, constitution` at the Domain lens level
2. **Create service constitutions** — Add rules specific to each service
3. **Use familiar commands** — `/specify`, `/plan`, `/tasks`, `/implement`
4. **Or use native BMAD workflows** — Constitution applies automatically

---

## Components

### Agent

- **Scribe (Cornelius)** — Constitutional Guardian

### Workflows

**Native:**
- `constitution` — Create or amend constitutions
- `resolve-constitution` — Display accumulated rules
- `compliance-check` — Validate artifacts
- `ancestry` — Show inheritance chain

**Command Routing:**
- `/specify` → `create-prd`
- `/plan` → `create-architecture`
- `/tasks` → `create-epics-stories` → `create-story × N`
- `/implement` → `dev-story`
- `/review` → `code-review`

---

## Constitution Hierarchy

```
Domain Constitution (enterprise-wide)
    ↓ inherits
Service Constitution (service-specific)
    ↓ inherits
Microservice Constitution (bounded context)
    ↓ inherits
Feature Constitution (implementation discipline)
```

- Inheritance is automatic
- Additions are allowed
- Contradictions are forbidden
- Specialization is encouraged

---

## Configuration

| Option | Default | Description |
|--------|---------|-------------|
| `constitution_root` | `lens/constitutions` | Where constitutions are stored |
| `auto_compliance_check` | `true` | Check compliance before workflows |
| `strict_mode` | `false` | Block execution if no constitution |

---

## Module Structure

```
spec/
├── module.yaml
├── README.md
├── TODO.md
├── CHANGELOG.md
├── agents/
│   ├── scribe/
│   │   ├── scribe.agent.yaml
│   │   └── _memory/scribe-sidecar/
│   └── scribe.spec.md
├── workflows/
│   ├── constitution/
│   ├── resolve-constitution/
│   ├── compliance-check/
│   └── ancestry/
├── data/
│   └── constitution-templates/
├── docs/
└── _module-installer/
```

---

## Documentation

- [Getting Started](docs/getting-started.md)
- [Constitution Guide](docs/constitution-guide.md)
- [Command Reference](docs/command-reference.md)
- [Examples](docs/examples.md)

---

## Author

Created via BMAD Module workflow — 2026-01-31

---

## License

Part of the BMAD framework.
