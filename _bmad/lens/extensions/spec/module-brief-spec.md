# Module Brief: SPEC

**Date:** 2026-01-31  
**Author:** Cris  
**Module Code:** `spec`  
**Module Type:** Extension (extends LENS)  
**Status:** Ready for Development  

---

## Executive Summary

**SPEC (Specification-Driven Enterprise Compass)** bridges Spec-Kit's specification-driven workflow with BMAD's enterprise-scale, multi-agent orchestration.

SPEC provides a **familiar command interface** (`/specify`, `/plan`, `/tasks`, `/implement`) that **routes to existing BMAD workflows** while adding **always-on constitutional governance** via LENS.

SPEC does **not replace** BMAD.  
It **injects context, resolves governance, and delegates execution**.

**Module Category:** Governance & Workflow Routing  
**Target Users:** Spec-Kit users, Enterprise architects, Teams with layered repositories  
**Complexity Level:** Medium-High (single agent, significant LENS integration)

---

## Module Identity

### Module Code & Name

- **Code:** `spec`
- **Name:** `SPEC: Specification-Driven Enterprise Compass`

### Core Concept

SPEC serves as a **constitutional governance layer** that automatically applies inherited rules to all BMAD workflows. When installed, every workflow—whether triggered via SPEC commands or native BMAD menus—receives constitutional context from the current LENS layer.

The module introduces a **constitution hierarchy** that mirrors the LENS architecture:
- Domain Constitution → Enterprise-wide standards
- Service Constitution → Service-specific rules
- Microservice Constitution → Bounded context constraints
- Feature Constitution → Implementation discipline

### Personality Theme

**Constitutional Scholar** — SPEC speaks with the gravitas of governance, explaining *why* rules exist while enforcing discipline without bureaucracy. Think founding documents meets pragmatic engineering.

---

## Module Type

**Type:** Extension Module (extends LENS)

SPEC is an **extension** to the LENS module, not a standalone module. It:
- Uses the same module code (`lens`) for installation co-location
- Adds constitutional governance to LENS context detection
- Extends LENS exports with `resolved_constitution`, `constitution_chain`, etc.
- Requires LENS to be installed

**Installation Location:** `src/modules/lens/extensions/spec/`

---

## Key Design Principles

| Principle | Description |
|-----------|-------------|
| **Bridge, Not Replace** | SPEC routes to BMAD workflows; it does not duplicate them |
| **Always-On Constitution** | Governance applies to *all* workflows when SPEC is installed |
| **Context Over Command** | Constitution is part of LENS context, not command routing |
| **LENS Tells WHERE, Not WHAT** | Artifacts may exist at any layer; LENS defines scope awareness |

---

## Unique Value Proposition

**What makes this module special:**

1. **Zero-Friction Migration** — Spec-Kit users get familiar commands that route to BMAD's powerful workflows
2. **Always-On Governance** — Constitutional rules apply automatically, not just when using SPEC commands
3. **Hierarchical Inheritance** — Rules flow from Domain → Feature with automatic resolution
4. **Audit Trail** — Every workflow execution includes constitutional compliance context

**Why users would choose this module:**

- Teams adopting BMAD from Spec-Kit can use familiar commands immediately
- Enterprise architects get codified governance that travels with context
- Large repositories maintain consistency through inherited constitutions
- Compliance requirements are met through explicit, traceable rules

---

## User Scenarios

### Target Users

| User Type | Need | SPEC Solution |
|-----------|------|---------------|
| **Spec-Kit Migrators** | Familiar workflow | `/specify` routes to `create-prd` |
| **Enterprise Architects** | Codified governance | Constitution hierarchy |
| **Compliance Teams** | Audit trail | Constitutional compliance checks |
| **Feature Developers** | Context awareness | Automatic rule inheritance |

### Primary Use Case

**Scenario:** A developer starts work on a new checkout feature in an e-commerce service.

1. Developer runs `/specify checkout-v2`
2. SPEC detects LENS layer: `ecommerce/checkout-api` (Microservice)
3. SPEC resolves constitution chain:
   - `domain-constitution.md` (security standards)
   - `ecommerce/constitution.md` (PCI compliance)
   - `ecommerce/checkout-api/constitution.md` (rate limits, idempotency)
4. SPEC injects `resolved_constitution` into BMAD's `create-prd` workflow
5. PRD includes constitutional compliance section automatically

### User Journey

```
┌─────────────────────────────────────────────────────────────┐
│  1. Install SPEC extension on LENS                          │
├─────────────────────────────────────────────────────────────┤
│  2. Create domain constitution (enterprise-wide)            │
├─────────────────────────────────────────────────────────────┤
│  3. Create service constitutions (per bounded context)      │
├─────────────────────────────────────────────────────────────┤
│  4. Use /specify, /plan, /tasks, /implement commands        │
│     → OR use native BMAD workflows                          │
│     → Constitution applies either way                       │
├─────────────────────────────────────────────────────────────┤
│  5. Review compliance reports before implementation         │
└─────────────────────────────────────────────────────────────┘
```

---

## Agent Architecture

### Agent Count Strategy

**Single Agent: Scribe** — SPEC is a command router + governance layer, not a parallel agent system. All work is executed by existing BMAD agents. Scribe handles constitution management only.

### Agent Roster

| Agent | Name | Title | Role | Expertise |
|-------|------|-------|------|-----------|
| Scribe | Cornelius | Constitutional Guardian | CRUD constitutions, resolve inheritance, validate compliance | Governance, legal frameworks, inheritance resolution |

### Agent Persona

**Scribe (Cornelius)**

- **Identity:** A constitutional scholar who speaks with gravitas but avoids bureaucratic overhead
- **Communication Style:** Formal yet accessible; explains *why* rules exist, not just what they are
- **Principles:**
  - Channel expert constitutional law: inheritance, precedent, and amendment
  - Governance serves the work, not the other way around
  - Every rule must have a rationale
  - Contradictions are crises—surface them immediately
- **Has Sidecar:** Yes (tracks constitution state, amendment history)

### Agent Menu

| Trigger | Command | Description | Workflow |
|---------|---------|-------------|----------|
| [CN] | constitution | Create or amend a constitution | constitution |
| [RS] | resolve | Display resolved constitution for current context | resolve-constitution |
| [CC] | compliance | Run compliance check on artifacts | compliance-check |
| [AN] | ancestry | Show constitution inheritance chain | ancestry |

---

## Workflow Ecosystem

### Core Workflows (Essential)

| Workflow | Agent | Purpose | Inputs | Outputs |
|----------|-------|---------|--------|---------|
| `constitution` | Scribe | Create or amend constitution files | Layer, name, articles | `constitution.md` |
| `resolve-constitution` | Scribe | Resolve and display accumulated rules | LENS context | Merged rules display |
| `compliance-check` | Scribe | Validate artifacts against constitution | Artifact path | Compliance report |

### Command Router Workflows

| Command | Routes To | Injects |
|---------|-----------|---------|
| `/specify` | `create-prd` | constitutional_context, lens_context |
| `/plan` | `create-architecture` | constitutional_context, lens_context |
| `/tasks` | `create-epics-stories` → `create-story × N` | constitutional_context, lens_context |
| `/story` | `create-story` | constitutional_context, lens_context |
| `/implement` | `dev-story` | constitutional_context, lens_context |
| `/review` | `code-review` | constitutional_context |

### `/tasks` Orchestration (Special Case)

The `/tasks` command performs **full feature population**:

1. Resolve constitution for current LENS layer
2. Verify PRD and architecture exist
3. Generate epics via `create-epics-stories`
4. Generate stories (N) via `create-story` iteration
5. Output: `epics-and-stories.md` + individual story files

---

## Constitution Architecture

### File Structure

```
lens/constitutions/
├─ domain-constitution.md           # Enterprise-wide
├─ {service}/
│  ├─ constitution.md               # Service-specific
│  └─ {microservice}/
│     └─ constitution.md            # Bounded context
```

### Constitution Template Structure

```markdown
# {Layer} Constitution: {Name}

**Inherits From:** {parent_constitution_path}  
**Version:** {MAJOR.MINOR.PATCH}  
**Ratified:** {YYYY-MM-DD}  
**Last Amended:** {YYYY-MM-DD}

## Preamble
{Why this constitution exists and what it governs}

## Articles

### Article I: {Principle Name}
{Non-negotiable rule with rationale}

### Article II: {Principle Name}
{Non-negotiable rule with rationale}

## Governance
{Amendment process, ratification requirements}
```

### Inheritance Rules

| Rule | Description |
|------|-------------|
| **Automatic** | All parent articles apply to children |
| **Additive** | New articles may be introduced |
| **Non-Contradictory** | Parents may not be weakened |
| **Specializing** | Contextual guidance preferred |
| **Resolution Order** | Display: Feature→Domain; Validation: Domain→Feature |

---

## LENS Integration

### Context Detection Enhancement

When SPEC is installed, LENS context detection adds:

```yaml
resolved_constitution:
  description: "Accumulated constitutional rules for current context"
  source: runtime
  default: null

constitution_chain:
  description: "Inheritance-ordered constitution file paths"
  source: runtime
  default: []

constitution_article_count:
  description: "Total articles (own + inherited)"
  source: runtime
  default: 0

constitution_last_amended:
  description: "Most recent amendment date"
  source: runtime
  default: null
```

### Always-On Behavior

| Trigger Method | Constitution Applied |
|----------------|---------------------|
| SPEC command (`/specify`) | ✅ Yes |
| BMAD agent menu | ✅ Yes |
| Direct workflow invocation | ✅ Yes |
| Any BMAD workflow with LENS | ✅ Yes |

---

## Tools & Integrations

### MCP Tools

| Tool | Purpose | Required |
|------|---------|----------|
| Git | Versioning, branch detection | ✅ Required |
| File System | Constitution CRUD | ✅ Required |

### External Services

| Service | Purpose | Required |
|---------|---------|----------|
| JIRA | Spec linkage, traceability | Optional |
| GitHub | Branch creation, PR integration | Optional |

### Module Dependencies

| Module | Relationship |
|--------|--------------|
| LENS (base) | **Required** — SPEC extends LENS |
| lens-sync | **Optional** — Provisional constitutions for brownfield |
| BMM | **Compatible** — Routes to BMM workflows |

---

## Data & Templates

### Constitution Templates

| Template | Layer | Purpose |
|----------|-------|---------|
| `domain-constitution-template.md` | Domain | Enterprise standards |
| `service-constitution-template.md` | Service | API & service contracts |
| `microservice-constitution-template.md` | Microservice | Deployment, scaling, data |
| `feature-constitution-template.md` | Feature | TDD, review, documentation |

### Configuration

```yaml
# module.yaml additions
constitution_root:
  prompt: "Where should constitutions be stored?"
  default: "lens/constitutions"
  result: "{target_project_root}/{value}"

auto_compliance_check:
  prompt: "Run compliance check before workflow execution?"
  default: true
  result: "{value}"
```

---

## Creative Features

### Personality & Theming

- **Constitutional Crisis Mode** — Visual alert when contradictions detected
- **Amendment Ceremonies** — Celebratory messaging when constitutions ratified
- **Heritage Display** — `/ancestry` shows constitution lineage with gravitas
- **The Gavel** — 🔨 Compliance failure indicator

### Easter Eggs & Delighters

- "We the engineers, in order to form a more perfect codebase..."
- Constitutional quotes adapted for software development
- Amendment numbering (Article I, II, III...)
- Ratification date tracking and anniversary recognition

### Example Outputs

**Compliance Check:**
```
🧾 Constitutional Compliance Review

Checking against 3 constitutions (15 articles)...

✅ Domain: Security review — Satisfied
✅ Service: API contracts — Satisfied
⚠️ Microservice: Rate limiting — Not verified

Verdict: 1 item requires attention before implementation.
```

**Ancestry Display:**
```
📜 Constitution Ancestry: checkout-api

Domain Constitution (ratified 2024-03-15)
  └─ ecommerce Service Constitution (ratified 2024-06-01)
       └─ checkout-api Constitution (ratified 2025-01-10)
           └─ [YOU ARE HERE]

Total inherited articles: 15
```

---

## Success Metrics

### Adoption

| Metric | Target |
|--------|--------|
| Spec-Kit user retraining | Zero |
| `/specify` execution time | Matches BMAD `create-prd` |
| Constitution resolution | < 5 seconds |

### Validation

| Metric | Target |
|--------|--------|
| Workflow governance escape | 0% (all workflows get context) |
| Constitution availability | 100% via LENS |

### Quality

| Metric | Target |
|--------|--------|
| Violations caught pre-code | > 80% |
| Audit trail completeness | 100% |

---

## Implementation Phases

### Phase 1: Constitution + LENS Integration

- [ ] Scribe agent
- [ ] Constitution templates (4)
- [ ] Inheritance resolution workflow
- [ ] LENS context export enhancement
- [ ] `constitution`, `resolve-constitution`, `compliance-check` workflows

### Phase 2: Command Router + Orchestration

- [ ] `/specify`, `/plan`, `/tasks`, `/implement` routing
- [ ] Full feature generation via `/tasks`
- [ ] Compliance pre-checks

### Phase 3: Template Enhancement (Optional)

- [ ] Compliance sections in PRD/architecture templates
- [ ] Null-safe handling for missing constitutions
- [ ] JIRA integration

---

## Open Questions

| Question | Context | Proposed Resolution |
|----------|---------|---------------------|
| Constitution storage location | Inside service folders or centralized? | Centralized `lens/constitutions/` with service subfolders |
| Cross-repo inheritance | Mono-repo only or multi-repo? | Start with mono-repo; multi-repo as Phase 4 |
| Amendment approval workflow | Who can amend? | Git PR-based with CODEOWNERS |
| Context refresh frequency | On every command or cached? | Cached with manual refresh option |
| Quick-spec support | Does quick-spec get constitution? | Yes, always-on |
| Graceful degradation | What if no constitution exists? | Warn but proceed; no blocking |

---

## Module Structure (Planned)

```
src/modules/lens/extensions/spec/
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
│       ├── domain-constitution-template.md
│       ├── service-constitution-template.md
│       ├── microservice-constitution-template.md
│       └── feature-constitution-template.md
├── docs/
│   ├── getting-started.md
│   ├── constitution-guide.md
│   ├── command-reference.md
│   └── examples.md
└── _module-installer/
    └── installer.js
```

---

## Next Steps

1. **✅ Brief Complete** — This document is ready for development
2. **Run CM (Create Module)** — Generate the module structure from this brief
3. **Create Scribe Agent** — Use agent-builder workflow
4. **Create Workflows** — Constitution, resolve, compliance, ancestry
5. **Test Installation** — Install with LENS and verify integration
6. **Document** — Complete docs/ folder

---

## Appendix: Command Mapping Reference

| Spec-Kit Command | SPEC Command | BMAD Workflow | Notes |
|------------------|--------------|---------------|-------|
| `/speckit.constitution` | `/constitution` | SPEC-native | Governance CRUD |
| `/speckit.specify` | `/specify` | `create-prd` | Any LENS layer |
| `/speckit.plan` | `/plan` | `create-architecture` | Gates on PRD |
| `/speckit.tasks` | `/tasks` | `create-epics-stories` → `create-story × N` | Orchestration |
| `/speckit.implement` | `/implement` | `dev-story` | Pre-check compliance |
| `/speckit.clarify` | `/clarify` | BMAD clarify | Resolve gaps |
| `/speckit.analyze` | `/analyze` | BMAD analysis | Consistency |
| `/speckit.checklist` | Built-in | BMAD | Inline gates |

---

*Brief finalized on 2026-01-31 by Morgan, Module Creation Master*  
*YOLO mode: Generated from existing SyncBrief.md with BMAD standards applied*
