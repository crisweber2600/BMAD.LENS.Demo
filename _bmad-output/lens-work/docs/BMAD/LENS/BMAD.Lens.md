---
repo: BMAD.Lens
remote: https://github.com/crisweber2600/BMAD.Lens.git
default_branch: main
source_commit: 6697f67d12db24bfb3a18564a8b7079d96bd0a06
generated_at: "2026-02-07T00:00:00Z"
layer: repo
domain: BMAD
service: LENS
generator: scout-auto-pipeline
---

# BMAD.Lens — Canonical Documentation

## 1. Overview

BMAD.Lens is the **source repository** for the BMAD Method framework and the `lens-work` module. It is a pure AI agent framework composed of YAML definitions, Markdown persona/spec files, Markdown workflow step files, and a JavaScript-based installer pipeline. The repo contains no compiled application code — its purpose is to define the agents, workflows, prompts, templates, and governance rules that power the BMAD lifecycle across all target projects.

**Key facts:**
- 5 specialized AI agents (Compass, Casey, Scout, Scribe, Tracey)
- 40 workflows across 5 categories (Core, Router, Discovery, Utility, Governance)
- 26 prompt files, 25+ documentation files
- 46 commits, 3,431 files
- **Dogfooding origin:** The control repo `NorthStarET.BMAD` installs `lens-work` from this source via `install-lens-work-relative.ps1`

**Role in domain:** BMAD.Lens is the **framework foundation** — every other repo in the portfolio depends on it for planning, discovery, and lifecycle governance. Changes here propagate to the control repo's `_bmad/lens-work/` directory.

## 2. Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Runtime** | Node.js | Latest LTS |
| **Agent Definitions** | YAML | — |
| **Persona / Specs** | Markdown | — |
| **Workflows** | Markdown step files | — |
| **Prompts** | Markdown | — |
| **Installer** | JavaScript (Node.js) | — |
| **Config Management** | YAML + CSV manifests | — |
| **Validation Scripts** | PowerShell | — |
| **Sync Scripts** | PowerShell | — |

**Key dependencies:** None (pure YAML/MD/JS framework — no npm packages, no compiled code)

## 3. Architecture

### Code Organization

```
src/modules/lens-work/
├── _module-installer/     # JavaScript installer pipeline
│   └── installer.js       # Reads module.yaml, deploys to _bmad/
├── agents/                # 5 agent definitions
│   ├── compass.agent.yaml + compass.md + compass.spec.md
│   ├── casey.agent.yaml + casey.spec.md
│   ├── scout.agent.yaml + scout.spec.md
│   ├── scribe.agent.yaml + scribe.spec.md
│   └── tracey.agent.yaml + tracey.spec.md
├── data/                  # Reference data (governance events)
├── docs/                  # 25+ architecture, API, governance docs
├── prompts/               # 26 prompt files for workflow steps
├── scripts/               # PowerShell validation/sync scripts
├── templates/             # Constitution and initiative templates
├── tests/                 # Spec-based test definitions
├── workflows/             # 40 workflows in 5 categories
│   ├── core/              # init-initiative, start/finish-workflow, phase-lifecycle
│   ├── router/            # pre-plan, spec, plan, review, dev, init-initiative
│   ├── discovery/         # repo-discover, analyze-codebase, generate-docs, etc.
│   ├── utility/           # status, resume, sync, fix-state, onboarding, etc.
│   └── governance/        # constitution, compliance-check, ancestry, etc.
├── config.yaml            # Module configuration
├── module.yaml            # 314-line module manifest (install questions, deps, outputs)
├── service-map.yaml       # Canonical registry of 6 target repos
└── README.md              # Module documentation
```

### Key Patterns

- **Agent Registry (CSV):** Flat CSV manifests for lazy-loaded agent discovery at runtime
- **YAML-Driven Workflows:** Composable step-file architecture with includes
- **Phase-Gated Lifecycle:** 4 ordered phases: Analysis → Planning → Solutioning → Implementation
- **Constitution System:** Domain/service constitutions codify project rules as governance artifacts
- **Dogfooding Loop:** Source lives here, installed copy runs in `NorthStarET.BMAD/_bmad/lens-work/`
- **Numbered Menus:** All agent interactions present numbered option lists for user selection
- **Module Independence:** Each BMAD module (bmm, bmb, cis, gds, tea) is self-contained

### Entry Points

- **`_module-installer/installer.js`** — The only runnable code; processes `module.yaml` to deploy module
- **`module.yaml`** — Master manifest defining all agents, workflows, configs, install questions
- **`config.yaml`** — Runtime configuration for the installed module
- **`service-map.yaml`** — Canonical mapping of domain → service → repo paths

## 4. API Surface

BMAD.Lens has no REST API. Its "API" is a **YAML-based agent/workflow registry system** consumed by GitHub Copilot Chat agents and bmadServer's `BmadAgentRegistry`/`BmadWorkflowRegistry`.

### Agent Roster

| Agent | File | Role | Communication Style |
|-------|------|------|-------------------|
| **Compass** | `compass.agent.yaml` | Phase-aware lifecycle router — determines which phase and workflow to activate | Directive, menu-driven |
| **Casey** | `casey.agent.yaml` | Git branch orchestrator — manages branching discipline per initiative/phase | Precise, systematic |
| **Tracey** | `tracey.agent.yaml` | State & recovery specialist — manages `state.yaml` and `event-log.jsonl` | Methodical, checkpoint-oriented |
| **Scout** | `scout.agent.yaml` | Bootstrap & discovery manager — repo scanning, doc generation, analysis | Thorough, investigative |
| **Scribe (Cornelius)** | `scribe.agent.yaml` | Constitutional governance guardian — enforces domain/service constitutions | Formal, compliance-focused |

### Workflow Catalog

| Category | Count | Key Workflows |
|----------|-------|---------------|
| **Core** | 4 | `init-initiative`, `start-workflow`, `finish-workflow`, `phase-lifecycle` |
| **Router** | 6 | `pre-plan`, `spec`, `plan`, `review`, `dev`, `init-initiative` |
| **Discovery** | 10 | `repo-discover`, `repo-document`, `repo-reconcile`, `repo-status`, `discover`, `analyze-codebase`, `generate-docs`, `lens-sync`, `domain-map`, `impact-analysis` |
| **Utility** | 15 | `status`, `resume`, `sync`, `fix-state`, `override`, `archive`, `batch-process`, `onboarding`, `setup-rollback`, `fix-story`, `switch`, `check-repos`, `migrate-state`, `recreate-branches`, `bootstrap` |
| **Governance** | 5 | `constitution`, `compliance-check`, `resolve-constitution`, `ancestry`, `resolve-context` |

**Total: 40 workflows + 26 prompt files**

### Phase Commands (via Compass agent)

| Command | Phase | Purpose |
|---------|-------|---------|
| `/pre-plan` | Analysis | Brainstorm → Research → Product Brief |
| `/spec` | Planning | PRD → UX Design |
| `/plan` | Solutioning | Architecture → Epics → Stories → Readiness Check |
| `/review` | Solutioning | Implementation Readiness Check |
| `/dev` | Implementation | Sprint Planning → Story Dev → Code Review |

### Initiative Commands

| Command | Purpose |
|---------|---------|
| `#new-domain` | Create new domain constitution |
| `#new-service` | Create new service within domain |
| `#new-feature` | Create new feature initiative |
| `#fix-story` | Fix an existing story |

## 5. Data Models

### State Files (YAML/JSONL)

| File | Format | Purpose | Location (installed) |
|------|--------|---------|---------------------|
| `state.yaml` | YAML | Active initiative/phase state, current context | `_bmad-output/lens-work/state.yaml` |
| `event-log.jsonl` | JSONL | Immutable append-only event history | `_bmad-output/lens-work/event-log.jsonl` |
| `repo-inventory.yaml` | YAML | Discovered repository metadata from DS workflow | `_bmad-output/lens-work/repo-inventory.yaml` |
| `domain-map.yaml` | YAML | Domain → service → repo hierarchical mapping | `_bmad-output/lens-work/domain-map.yaml` |
| `service-map.yaml` | YAML | Canonical repo registry (6 repos, paths, remotes) | `_bmad/lens-work/service-map.yaml` |

### Registry Files (CSV)

| File | Columns | Purpose |
|------|---------|---------|
| `agent-manifest.csv` | module, name, file, description | Agent discovery registry |
| `workflow-manifest.csv` | module, category, name, file, description | Workflow discovery registry |
| `task-manifest.csv` | module, name, file, description | Task discovery registry |
| `files-manifest.csv` | module, name, path, type, description | File discovery registry |
| `tool-manifest.csv` | module, name, file, description | Tool discovery registry |

### Module Configuration (module.yaml schema)

| Section | Fields |
|---------|--------|
| **Identity** | name, version, description, author |
| **Dependencies** | required: [bmm, core], optional: [cis, tea] |
| **Install Questions** | 10 questions (paths, toggles, depth, integrations) |
| **Git Config** | Branch pattern: `{domain}/{initiative_id}/{size}-{phase_number}` |
| **Templates** | 4 constitution templates (domain, service, microservice, feature) |
| **Outputs** | state.yaml, event-log.jsonl, repo-inventory, dashboards, constitutions |

## 6. Integration Points

| Integration | Direction | Mechanism | Details |
|------------|-----------|-----------|---------|
| **NorthStarET.BMAD (control repo)** | Source → Installed | `install-lens-work-relative.ps1` | Three-step sync: copy source → run installer → deploy to `_bmad/lens-work/` |
| **bmadServer** | Read-only | File system | `BmadAgentRegistry` + `BmadWorkflowRegistry` parse CSV manifests and YAML configs at runtime |
| **GitHub Copilot Chat** | Read-only | `.github/agents/*.md` stubs | Chat agents load from `_bmad/{module}/agents/` at conversation start |
| **GitHub Prompts** | Read-only | `.github/prompts/*.prompt.md` | Reusable prompt files for lens-work commands |

### External Dependencies

- None — BMAD.Lens is self-contained with no network dependencies

## 7. Build & Deploy

### Build

There is no traditional build step. BMAD.Lens is a content-only framework.

### Deploy (Install to Control Repo)

```powershell
# From NorthStarET.BMAD root:
./install-lens-work-relative.ps1
```

This performs:
1. **Copy source** from `TargetProjects/BMAD/LENS/BMAD.Lens/src/modules/lens-work/` to staging
2. **Run installer** (`node _module-installer/installer.js`) which processes `module.yaml`
3. **Deploy** to active `_bmad/lens-work/` directory

### Validation

```powershell
# Validate installed module integrity
./validate-lens-work.ps1
```

## 8. Configuration

### Module Configuration (`config.yaml`)

Runtime configuration for the installed lens-work module, including:
- Output paths for state files and artifacts
- Feature toggles and depth settings
- Integration settings for dependent modules

### Service Map (`service-map.yaml`)

Canonical registry of all target repositories:
- 6 repos across 3 domains (BMAD, NextGen, OldNorthStar)
- Each entry: name, path, remote, domain, service, branch

### Environment Variables

None required — BMAD.Lens uses path tokens (`{project-root}`) resolved at install time.

## 9. Testing

### Test Strategy

BMAD.Lens uses **spec-based testing** rather than traditional unit tests:
- `tests/lens-work-tests.spec.md` — Markdown spec defining expected behaviors
- Agent logic is prompt-based (not unit-testable in traditional sense)
- Validation scripts verify structural integrity of installed module

### Test Commands

```powershell
# Structural validation
./validate-lens-work.ps1

# Prompt sync verification  
./sync-prompts.ps1
```

### Coverage Status

| Area | Coverage | Notes |
|------|----------|-------|
| Installer (`installer.js`) | ⚠️ Manual | Only runnable code — no automated tests |
| Agent definitions | ⚠️ Spec-based | Behavioral specs, not unit tests |
| Workflow steps | ⚠️ Spec-based | Behavioral specs, not unit tests |
| Module structure | ✅ Script | `validate-lens-work.ps1` checks integrity |

## 10. Known Issues & Technical Debt

| # | Issue | Severity | Impact | Recommendation |
|---|-------|----------|--------|----------------|
| 1 | **No CI pipeline** | MEDIUM | YAML/MD changes untested in automation | Add GitHub Actions: YAML lint + schema validation |
| 2 | **No automated tests for installer.js** | MEDIUM | Installer is the only runnable code, untested | Add Jest/Vitest tests for installer logic |
| 3 | **Spec-based tests only** | LOW | Agent behavior validated by specs, not execution | Acceptable for prompt-based system — consider adding integration tests for installer |
| 4 | **Module.yaml is 314 lines** | LOW | Complex manifest grows with features | Consider splitting into multiple config files |

## 11. BMAD Readiness

### Assessment: ✅ READY (Framework Source)

BMAD.Lens IS the BMAD framework. It defines the lifecycle, agents, and workflows that other repos use. It is inherently "BMAD-ready" as it is the source of BMAD methodology.

### Readiness Details

| Criterion | Status | Notes |
|-----------|--------|-------|
| **Phase lifecycle defined** | ✅ | 4 phases fully defined with transitions |
| **Agents operational** | ✅ | 5 agents with specs and personas |
| **Workflows complete** | ✅ | 40 workflows across all categories |
| **Governance system** | ✅ | Constitution system with templates |
| **Documentation** | ✅ | 25+ docs covering all aspects |
| **CI/CD** | 🔴 | No pipeline — needed for framework reliability |
| **Version control** | ✅ | Git with proper branching discipline |

### Recommended Actions

1. Add CI pipeline for YAML linting and schema validation
2. Add automated tests for `installer.js`
3. Continue dogfooding loop with NorthStarET.BMAD
