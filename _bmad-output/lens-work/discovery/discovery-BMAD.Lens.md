# Discovery Report: BMAD.Lens

---
repo: BMAD.Lens
remote: https://github.com/crisweber2600/BMAD.Lens.git
branch: main
commit: 49a23b7313f78ead0c744a2f7416f380e1bc7920
timestamp: 2026-02-07T12:00:00Z
domain: BMAD
service: LENS
scanner: SCOUT DS (Deep Brownfield Discovery)
confidence: 0.92
---

## Overview / Business Purpose

BMAD.Lens is the **source repository for the BMAD framework platform**. It contains the BMAD Method v6 framework modules, agents, workflows, and the lens-work module that provides phase-aware project lifecycle management. This is the "upstream" repo from which the control repo (`NorthStarET.BMAD`) installs its `_bmad/` directory content. It defines persona-driven AI agents, step-based workflows, and the BMAD lifecycle phases (Analysis → Planning → Solutioning → Implementation).

The lens-work module within this repo is the primary active development focus — it provides git-based discipline for multi-repo initiative orchestration with agents like Compass (router), Casey (git), Tracey (state), and Scout (discovery).

## Technology Stack

| Technology | Version | Purpose |
|---|---|---|
| JavaScript (Node.js) | ES Modules | Module installer (`installer.js`) |
| YAML | — | Agent configs, module configs, service maps |
| Markdown | — | Agent personas, workflow steps, documentation |
| PowerShell | — | Scripts (sync-prompts, validate-lens-work) |
| GitHub Copilot Agents | — | `.github/agents/` stubs for IDE integration |
| GitHub Codex Prompts | — | `.codex/prompts/` for Codex integration |

**No runtime application code.** This is a configuration/documentation-as-code repository.

## Project Structure Map

```
BMAD.Lens/
├── .codex/prompts/              # 90+ Codex prompt files (agent & workflow stubs)
├── .github/
│   ├── agents/                  # 30+ GitHub Copilot Chat agent stubs
│   └── prompts/                 # 25+ lens-work prompt files
├── _bmad/                       # Installed BMAD framework (output of installer)
│   ├── bmb/                     # Builder Module (agents, workflows)
│   ├── bmm/                     # Method Module (lifecycle agents)
│   ├── cis/                     # Creative Intelligence Suite
│   ├── core/                    # Core platform (bmad-master, tasks)
│   ├── gds/                     # Game Dev Studio
│   ├── tea/                     # Test Engineering Academy
│   └── _config/                 # Manifests, agent customizations
├── src/modules/lens-work/       # SOURCE for lens-work module
│   ├── agents/                  # compass, casey, scout, tracey (.agent.yaml + .spec.md)
│   ├── docs/                    # CI integration, branch protection, migration guide
│   ├── prompts/                 # 25+ lens-work command prompts
│   ├── scripts/                 # sync-prompts.ps1, validate-lens-work.ps1
│   ├── templates/               # Phase 1-4 question templates
│   ├── tests/                   # Spec tests
│   ├── workflows/
│   │   ├── core/                # Git lifecycle, init-initiative, phase-lifecycle
│   │   ├── discovery/           # repo-discover, repo-document, repo-reconcile, repo-status
│   │   ├── includes/            # Shared includes (artifact-validator, lane-topology, etc.)
│   │   ├── router/              # Phase commands (pre-plan, spec, plan, review, dev)
│   │   └── utility/             # Bootstrap, fix-state, override, resume, switch, sync
│   ├── _module-installer/       # installer.js (Node.js ES module)
│   ├── config.yaml
│   ├── module.yaml
│   └── README.md
└── archive/                     # Archived lens v1 files
```

## Architecture Pattern Analysis

- **Pattern:** Configuration-as-Code / Infrastructure-as-Documentation
- **Agent System:** Persona-driven agents defined in YAML (`.agent.yaml`) with markdown specs (`.spec.md`)
- **Workflow Engine:** Step-based markdown workflows organized in 5 categories: core, router, discovery, governance, utility
- **Module System:** Self-contained modules (`bmm`, `bmb`, `cis`, `gds`, `tea`, `lens-work`) each with `config.yaml`
- **Installer Pattern:** Node.js `installer.js` copies source modules into target `_bmad/` directory
- **Dogfooding:** This repo installs its own output — the `_bmad/` directory IS the installed copy of the framework
- **Prompt Distribution:** Prompts replicated to `.github/prompts/` and `.codex/prompts/` for multi-IDE support

**Key files:**
- `src/modules/lens-work/module.yaml` — Module definition
- `src/modules/lens-work/_module-installer/installer.js` — Installation logic
- `src/modules/lens-work/agents/compass.agent.yaml` — Phase router agent
- `src/modules/lens-work/workflows/core/phase-lifecycle/workflow.md` — Phase lifecycle

## Git Activity Summary

| Metric | Value |
|---|---|
| Total Commits | 34 |
| Commits (6 months) | 34 |
| Commits (1 year) | 34 |
| First Commit | 2026-01-30 |
| Last Commit | 2026-02-06 |
| Active Days | ~8 days |
| Contributors | 1 (Cris Weber) |

**Activity Status:** 🟢 VERY ACTIVE — All 34 commits in the last 8 days (project started Jan 30, 2026). This is a brand-new repo under rapid development.

### Contributors

| Contributor | Commits | Role |
|---|---|---|
| Cris Weber | 34 | Sole developer |

## Commit Categories

| Category | Count | Percentage |
|---|---|---|
| Features (feat:) | ~20 | 59% |
| Documentation (docs:) | ~4 | 12% |
| Fixes (fix:) | ~3 | 9% |
| Chores (chore:) | ~3 | 9% |
| Generic/Mixed | ~4 | 12% |

**Key commit themes:** lens-work module development, workflow creation, agent definitions, installer enhancements, bootstrap/discovery flows, branch naming patterns.

## Key Dependencies

- **Runtime:** None (no application runtime)
- **Installer:** Node.js (uses `fs/promises` native module)
- **IDE Integration:** GitHub Copilot Chat, GitHub Codex
- **PowerShell:** For sync and validation scripts
- **Archive:** Contains `archive/` with v1 legacy lens module files

## Integration Points

1. **NorthStarET.BMAD control repo** — Primary consumer, installs via `install-lens-work-relative.ps1`
2. **NorthStarET.Student** — Secondary consumer (has `_bmad/` directory installed)
3. **GitHub Copilot Chat** — Agent stubs in `.github/agents/`
4. **GitHub Codex** — Prompt files in `.codex/prompts/`
5. **service-map.yaml** — References all 6 target project repos

## Technical Debt Signals

| Signal | Severity | Evidence |
|---|---|---|
| Archive directory present | LOW | `archive/` contains v1 lens files needing migration |
| No automated tests | MEDIUM | Only spec-level test docs, no CI test pipeline |
| No package.json | LOW | Installer uses raw Node.js, no dependency management |
| Single contributor | MEDIUM | Bus factor = 1 |
| Rapid iteration | LOW | 34 commits in 8 days suggests experimental/exploratory phase |

## Risks and Unknowns

1. **No CI/CD pipeline** — No GitHub Actions workflow for validation/testing
2. **Installer reliability** — `installer.js` is the critical sync mechanism; no automated testing
3. **Archive migration incomplete** — Archive scout agent has richer features not yet ported
4. **Documentation drift** — Large prompt surface area (90+ Codex, 30+ Copilot, 25+ lens-work) may drift
5. **No versioning** — No semantic versioning or release tagging

## Confidence Score: 0.92

High confidence — this is a documentation/configuration repo with clear structure. Minor uncertainty around the archive migration completeness and the installer's edge cases.
