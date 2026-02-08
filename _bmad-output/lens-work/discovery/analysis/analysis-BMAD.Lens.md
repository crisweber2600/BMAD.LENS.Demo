# BMAD.Lens — Deep Technical Analysis
> SCOUT AC Workflow | Generated: 2026-02-07 | Confidence: HIGH (85%)

## 1. Technology Stack

| Component | Technology | Version | Source |
|-----------|-----------|---------|--------|
| Runtime | Node.js | N/A (installer scripts) | `src/modules/lens-work/_module-installer/` |
| Configuration | YAML + Markdown | N/A | `src/modules/lens-work/module.yaml` |
| Agents | Agent YAML + Markdown personas | BMAD v6 | `src/modules/lens-work/agents/` |
| Workflows | Step-file Markdown | BMAD v6 | `src/modules/lens-work/workflows/` |
| Validation | PowerShell | 5.1+ | `src/modules/lens-work/scripts/` |

**File Count:** 91 source files (`.js`, `.ts`, `.yaml`, `.yml`, `.md`)

## 2. API Surface

BMAD.Lens is NOT an API service. It is a framework module providing:

### Agent Interface (4 agents)
| Agent | File | Role |
|-------|------|------|
| Compass | `agents/compass.agent.yaml` | Phase-aware lifecycle router |
| Casey | `agents/casey.agent.yaml` | Git branch orchestrator |
| Tracey | `agents/tracey.agent.yaml` | State & recovery specialist |
| Scout | `agents/scout.agent.yaml` | Bootstrap & discovery manager |

### Command Surface (prompt files)
| Category | Commands | Entry Point |
|----------|----------|-------------|
| Phase Router | `/pre-plan`, `/spec`, `/plan`, `/review`, `/dev` | Compass |
| Initiative | `#new-domain`, `#new-service`, `#new-feature`, `#fix-story` | Compass |
| State/Recovery | `/status`, `/resume`, `/sync`, `/fix`, `/override`, `/archive` | Tracey |
| Discovery | `/onboard`, `/bootstrap`, `/discover`, `/document`, `/reconcile`, `/repo-status`, `/rollback` | Scout |
| Context | `/switch`, `/context`, `/constitution`, `/compliance`, `/focus`, `/lens` | Compass |

**Total commands: ~27 prompt entry points**

## 3. Data Models

### State Model (`_bmad-output/lens-work/state.yaml`)
- Initiative tracking (domain, service, phase, status)
- Branch topology state
- Event log (JSONL)

### Service Map (`service-map.yaml`)
- Repository paths and metadata
- Cross-repo service definitions

### Module Configuration (`module.yaml`)
- Agent roster, workflow categories, output paths
- Git branch pattern templates
- Dependencies: `bmm`, `core` (required); `cis`, `tea` (optional)

## 4. Architecture Pattern

**Pattern: Agent-Workflow-Step Architecture**

- **Agents** define persona + menu system (YAML config + MD persona)
- **Workflows** orchestrate multi-step processes (step-file markdown)
- **5-Category Workflow Structure:** core, router, discovery, governance, utility
- **Module Installer** handles deployment from source to control repo
- Evidence: `module.yaml` lines 76-130 define workflow_categories

### Anti-patterns
- No automated testing of YAML/MD content validity
- Sidecar memory system planned but not fully implemented in current agent files

## 5. Dependencies

| Category | Dependency | Purpose |
|----------|-----------|---------|
| Core | `bmm` module | Core workflow execution |
| Core | `core` module | BMAD infrastructure |
| Optional | `cis` module | Creative Innovation Suite |
| Optional | `tea` module | Test Engineering Academy |
| Scripts | PowerShell | Validation and sync |
| Installer | Node.js | Module installation |

## 6. Integration Points

- **Dogfooding:** Source at `TargetProjects/BMAD/LENS/BMAD.Lens/src/modules/lens-work/` installs to `_bmad/lens-work/`
- **Installer script:** `install-lens-work-relative.ps1` (3-step sync)
- **GitHub Copilot:** Agent stubs in `.github/agents/` load from `_bmad/{module}/agents/`
- **Control repo output:** All state persisted to `_bmad-output/lens-work/`

## 7. Testing Coverage

- **Test spec file:** `tests/lens-work-tests.spec.md`
- **Validation scripts:** `scripts/validate-lens-work.ps1`, `scripts/sync-prompts.ps1`
- **Coverage:** LOW — primarily spec-based, no automated unit/integration tests
- **Gap:** No YAML schema validation, no agent behavior tests

## 8. Security Considerations

- No authentication/authorization (framework tooling, not a service)
- File system access for installer (PowerShell execution)
- Git operations require appropriate permissions on target repos

## 9. Technical Debt Signals

1. **Missing automated tests** — validation is manual via PowerShell scripts
2. **Sidecar memory system** — designed in archive but not fully ported to current
3. **No schema validation** — YAML/MD files could have invalid structure
4. **Prompt file proliferation** — 27+ prompt files with potential duplication

## 10. Confidence Score

| Dimension | Score | Notes |
|-----------|-------|-------|
| Completeness | 90% | All agent/workflow files inspected |
| Accuracy | 85% | Module.yaml is authoritative |
| Currency | 80% | Active development branch |
| **Overall** | **85%** | |
