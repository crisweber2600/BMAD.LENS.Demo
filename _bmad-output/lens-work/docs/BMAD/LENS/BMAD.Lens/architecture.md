---
repo: BMAD.Lens
remote: https://github.com/crisweber2600/BMAD.Lens.git
default_branch: main
generated_at: 2026-02-07T12:00:00Z
domain: BMAD
service: LENS
generator: lens-sync
confidence: 0.92
---

# BMAD.Lens — Architecture

## Overview

BMAD.Lens is the **source repository for the BMAD framework platform** (v6). It contains the BMAD Method modules, persona-driven AI agents, step-based workflows, and the lens-work module that provides phase-aware project lifecycle orchestration. This is not an application — it is a **configuration-as-code / infrastructure-as-documentation** repository.

The lens-work module is the primary active development focus, providing git-based discipline for multi-repo initiative management with four core agents: Compass (phase router), Casey (git orchestrator), Tracey (state manager), and Scout (discovery specialist).

**Business Purpose:** Enable structured, repeatable AI-assisted software development lifecycle management across multiple target project repositories.

## Technology Stack

| Technology | Version | Purpose | Evidence |
|---|---|---|---|
| JavaScript (Node.js) | ES Modules | Module installer (`installer.js`) | `src/modules/lens-work/_module-installer/installer.js` |
| YAML | — | Agent configs, module configs, service maps | `src/modules/lens-work/agents/*.agent.yaml` |
| Markdown | — | Agent personas, workflow steps, documentation | `src/modules/lens-work/workflows/**/*.md` |
| PowerShell | 5.1+ | Scripts (sync-prompts, validation) | `src/modules/lens-work/scripts/` |
| GitHub Copilot Agents | — | IDE integration stubs | `.github/agents/` |
| GitHub Codex Prompts | — | Codex IDE integration | `.codex/prompts/` |

**No runtime application code.** No databases, no APIs, no deployment artifacts.

## Project Structure

```
BMAD.Lens/
├── .codex/prompts/                    # 90+ Codex prompt stubs
├── .github/
│   ├── agents/                        # 30+ GitHub Copilot Chat agent stubs
│   └── prompts/                       # 25+ lens-work prompt files
├── _bmad/                             # INSTALLED output (dogfooding — self-installs)
│   ├── bmb/                           # Builder Module (agent/module/workflow builders)
│   ├── bmm/                           # Method Module (lifecycle: analyst → dev)
│   ├── cis/                           # Creative Intelligence Suite
│   ├── core/                          # Core platform (bmad-master, tasks, resources)
│   ├── gds/                           # Game Dev Studio
│   ├── tea/                           # Test Engineering Academy
│   └── _config/                       # Manifests, agent customizations
├── src/modules/lens-work/             # SOURCE for lens-work module
│   ├── agents/                        # compass, casey, scout, tracey
│   ├── docs/                          # CI integration, branch protection guides
│   ├── prompts/                       # 25+ lens-work command prompt files
│   ├── scripts/                       # sync-prompts.ps1, validate-lens-work.ps1
│   ├── templates/                     # Phase 1–4 question templates
│   ├── tests/                         # Spec test documents
│   ├── workflows/
│   │   ├── core/                      # Git lifecycle, init-initiative, phase-lifecycle
│   │   ├── discovery/                 # repo-discover, repo-document, repo-reconcile, repo-status
│   │   ├── includes/                  # Shared includes (artifact-validator, lane-topology)
│   │   ├── router/                    # Phase commands (pre-plan, spec, plan, review, dev)
│   │   └── utility/                   # Bootstrap, fix-state, override, resume, switch, sync
│   ├── _module-installer/             # installer.js (Node.js ES module)
│   ├── config.yaml                    # Module configuration
│   ├── module.yaml                    # Module definition
│   └── README.md
└── archive/                           # Archived lens v1 files (migration source)
```

## Architecture Pattern

**Pattern:** Agent-Workflow-Step Architecture (Configuration-as-Code)

| Pattern Element | Description | Evidence |
|--|--|--|
| Agent System | Persona-driven agents in YAML + Markdown specs | `agents/compass.agent.yaml`, `agents/scout.md` |
| Workflow Engine | Step-based markdown workflows in 5 categories | `workflows/core/`, `workflows/router/` etc. |
| Module System | Self-contained modules with own `config.yaml` | `_bmad/bmm/config.yaml`, `_bmad/bmb/config.yaml` |
| Installer | Node.js copies source modules into target `_bmad/` | `_module-installer/installer.js` |
| Dogfooding | Repo installs its own output | `_bmad/` is installed from `src/modules/` |
| Prompt Distribution | Prompts replicated for multi-IDE support | `.github/prompts/`, `.codex/prompts/` |

### 5-Category Workflow Structure

| Category | Purpose | Examples |
|---|---|---|
| **core** | Git lifecycle, initiative init, phase transitions | `git-lifecycle/`, `init-initiative/`, `phase-lifecycle/` |
| **router** | Phase command routing (pre-plan → dev) | `pre-plan/`, `spec/`, `plan/`, `review/`, `dev/` |
| **discovery** | Repo scanning, documentation, reconciliation | `repo-discover/`, `repo-document/`, `repo-status/` |
| **governance** | Compliance checks, constitutions | (planned) |
| **utility** | Bootstrap, fix-state, override, resume, sync | `bootstrap/`, `fix-state/`, `switch/` |

## Key Design Decisions

1. **Agents as YAML + Markdown** — Agent behavior split between structured config (`.agent.yaml`) and persona narrative (`.md` / `.spec.md`), enabling both machine-parseable and human-readable definitions.
2. **Module isolation** — Each module (bmm, bmb, cis, gds, tea, lens-work) is fully self-contained with its own agents, workflows, and config.
3. **Installer-based deployment** — `installer.js` copies source to target rather than using symlinks or package managers, ensuring clean isolation.
4. **5-category workflow taxonomy** — Workflows are organized by concern (core/router/discovery/governance/utility) rather than by agent.
5. **Prompt replication** — Same command prompts distributed to `.github/prompts/` (Copilot) and `.codex/prompts/` (Codex) for multi-IDE support.

## Dependencies

| Category | Dependency | Purpose |
|---|---|---|
| Core | `bmm` module | BMAD Method lifecycle execution |
| Core | `core` module | Platform infrastructure, bmad-master |
| Optional | `cis` module | Creative Intelligence Suite |
| Optional | `tea` module | Test Engineering Academy |
| Runtime | Node.js | Module installer execution |
| Scripts | PowerShell 5.1+ | Validation and sync scripts |

## Security Considerations

- No authentication/authorization (framework tooling, not a service)
- File system write access required for installer (copies files to `_bmad/`)
- Git operations require appropriate permissions on all target repositories
- PowerShell execution policy must allow script execution

## Technical Debt

| Signal | Severity | Evidence |
|---|---|---|
| No automated tests | MEDIUM | Only spec-level test docs in `tests/`; no CI test pipeline |
| Archive migration incomplete | MEDIUM | `archive/` contains v1 scout with richer features not yet ported |
| No schema validation | LOW | YAML/MD files have no automated structure validation |
| No package.json | LOW | Installer uses raw Node.js `fs/promises`; no dependency management |
| Single contributor | MEDIUM | Bus factor = 1 (34 commits, all by Cris Weber) |
| Prompt proliferation | LOW | 90+ Codex + 30+ Copilot + 25+ lens-work prompts may drift |

## Risks

1. **No CI/CD pipeline** — No GitHub Actions workflow for validation or testing
2. **Installer fragility** — `installer.js` is the critical sync mechanism with no automated testing
3. **Documentation drift** — Large prompt surface area across three prompt directories may become inconsistent
4. **No versioning** — No semantic versioning or release tagging for framework modules

## Related Documentation

- [Onboarding](onboarding.md) — Setup and development workflow
