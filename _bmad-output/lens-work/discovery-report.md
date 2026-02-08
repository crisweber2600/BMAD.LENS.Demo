# DISCOVERY REPORT: BMAD.Lens

**Domain:** BMAD | **Service:** LENS
**Remote:** https://github.com/crisweber2600/BMAD.Lens.git
**Default Branch:** main | **Current Branch:** main
**Scan Date:** 2026-02-07 | **Agent:** Scout (DS - Deep Service Discover)

---

## TECHNOLOGY STACK

- **Primary Language:** Markdown (96.2% — 1,380 of 1,436 content files)
- **Configuration:** YAML (123 files — agent definitions, module configs, state)
- **Data Registries:** CSV (35 files — manifests for agents, workflows, tasks, tools)
- **Executable Code:** JavaScript (3 files — installer, 152 LOC), PowerShell (6 files — validation/sync scripts)
- **Package Metadata:** JSON (4 files — package.json, package-lock.json)
- **Frameworks:** BMAD Method v6 (`bmad-method@^6.0.0-Beta.7` via npm)
- **Build System:** npm (package.json at root, node_modules for bmad-method dependency)
- **Runtime:** Node.js (installer.js uses `fs/promises`), PowerShell (validation scripts)
- **IDE Integrations:** GitHub Copilot Chat (`.github/agents/`, `.github/prompts/`), OpenAI Codex (`.codex/prompts/`)

## PROJECT STRUCTURE

```
BMAD.Lens/                                    [ROOT — BMAD framework distribution repo]
├── .codex/prompts/              (113 files)   [Codex IDE — AI prompt entry points]
├── .github/
│   ├── agents/                  (34 files)    [Copilot Chat agent stubs — thin loaders]
│   ├── prompts/                 (28 files)    [Copilot prompt files — lens-work commands]
│   └── lens-work-instructions.md              [Copilot context injection]
├── _bmad/                       (977 files)   [INSTALLED BMAD framework — 7 modules]
│   ├── _config/                 (185 files)   [Manifests, agent customizations, custom layer]
│   │   ├── agents/              (34 files)    [Agent customize.yaml overrides]
│   │   └── custom/lens-work/    (148 files)   [Custom layer — full lens-work mirror]
│   ├── _memory/                 (4 files)     [Agent sidecar memory (storyteller, tech-writer)]
│   ├── bmb/                     (162 files)   [BMAD Builder Module — create agents/modules/workflows]
│   ├── bmm/                     (194 files)   [BMAD Method Module — planning→implementation lifecycle]
│   ├── cis/                     (31 files)    [Creative Intelligence Suite]
│   ├── core/                    (33 files)    [Core platform — bmad-master, tasks, resources]
│   ├── gds/                     (210 files)   [Game Dev Studio]
│   ├── lens-work/               (148 files)   [INSTALLED lens-work module (from src/)]
│   └── tea/                     (210 files)   [Test Engineering Academy]
├── _bmad-output/                              [Runtime state & output artifacts]
│   ├── bmb-creations/                         [Builder module output]
│   └── lens-work/                             [State, event log, initiatives]
│       ├── state.yaml                         [Current initiative/phase/lane context]
│       └── event-log.jsonl                    [Immutable audit trail]
├── archive/                     (1,844 files) [Previous version archive — lens v1/v2]
├── src/modules/lens-work/       (199 files)   [**SOURCE** — canonical lens-work module]
│   ├── _module-installer/       (1 file)      [installer.js — 152 LOC]
│   ├── agents/                  (11 files)    [5 agents: compass, casey, tracey, scout, scribe]
│   ├── data/                    (1 file)      [governance-events.yaml schema]
│   ├── docs/                    (41 files)    [Comprehensive documentation suite]
│   │   ├── governance/          (4 files)     [Constitutional governance docs]
│   │   └── reviews/             (5 files)     [Adversarial review reports]
│   ├── prompts/                 (36 files)    [Prompt entry points for all commands]
│   ├── scripts/                 (2 files)     [validate-lens-work.ps1, sync-prompts.ps1]
│   ├── templates/               (5 files)     [Constitution + phase question templates]
│   ├── tests/                   (1 file)      [lens-work-tests.spec.md]
│   ├── workflows/               (102 files)   [5-category workflow architecture]
│   │   ├── core/                (7 files)     [Auto-triggered: init, start, finish, phase-lifecycle]
│   │   ├── router/              (7 files)     [Phase commands: pre-plan, spec, plan, review, dev]
│   │   ├── discovery/           (42 files)    [10 workflows: discover, analyze, generate-docs, etc.]
│   │   ├── governance/          (18 files)    [5 workflows: constitution, compliance, ancestry, etc.]
│   │   ├── utility/             (22 files)    [15 workflows: bootstrap, status, resume, switch, etc.]
│   │   └── includes/            (6 files)     [Shared refs: lane-topology, jira, gates, pr-links]
│   ├── module.yaml                            [Module manifest — full configuration]
│   └── README.md                              [Module documentation]
├── package.json                               [npm dependency: bmad-method@^6.0.0-Beta.7]
├── package-lock.json                          [Lock file]
└── .gitignore                                 [Ignores: _bmad/lens-work/_memory/, _bmad-output/lens-work/]
```

**Total Active Files:** 1,584 (excluding archive and .git)
**Source Module (lens-work):** 199 files, 27,071 lines of Markdown
**Archive:** 1,844 files (previous lens v1/v2 — retained for migration reference)

## GIT ANALYSIS

- **Total Commits (all-time):** 55 (across all branches)
- **Commits (1yr window):** 46 (repo created 2026-01-30, all activity within 9 days)
- **Active Contributors:** 1 (Cris Weber — sole contributor)
- **Commit Frequency:** 5.1 commits/day average over active period
- **Peak Day:** 2026-02-06 (11 commits — major merge + adversarial review fixes)
- **Activity Trend:** Intense burst development — repo is 9 days old, averaging 5+ commits/day

### Commit Activity by Day

| Date | Commits | Key Activity |
|------|---------|-------------|
| 2026-01-30 | 2 | Initial creation, workflows for lens management |
| 2026-01-31 | 4 | Compliance/constitution workflows, installer refactor |
| 2026-02-01 | 10 | Compass module, Scout agent, schema validation |
| 2026-02-02 | 7 | Bootstrap, domain-map, discovery enhancement |
| 2026-02-03 | 4 | v2 init, utility workflows, cleanhouse |
| 2026-02-05 | 5 | State architecture, context switching, lane naming |
| 2026-02-06 | 11 | lensv3 merge, adversarial review fixes, governance merge |
| 2026-02-07 | 3 | Main merge, lensv4 PR merge, governance best-of-breed |

### Branch Topology

| Branch | Type | Status |
|--------|------|--------|
| `main` | Default | Active — current HEAD |
| `mvp2` | Feature | Local — v2 development |
| `lensv3` | Feature | Local — v3 merge branch |
| `origin/lensv4` | Feature | Remote — latest governance merge |
| `origin/lens-migration` | Feature | Remote — migration tracking |
| `origin/codex/edit-lens-work-module` | Codex | Remote — Codex agent edits |
| `origin/feat/lens-work-governance-migration-sync-20260207` | Feature | Remote — governance sync |

### Issue References

- **No JIRA/ticket keys found** in commit messages
- 7 fix commits identified (adversarial review fixes, domain-prefix drift, naming corrections)
- Conventional commit prefixes used: `feat()`, `fix()`, `docs()`, `chore()`

## ARCHITECTURE

- **Pattern:** Module-based monorepo with multi-IDE distribution
- **Core Paradigm:** AI-agent orchestration framework — persona-driven agents execute structured workflows
- **Key Design Decisions:**
  1. **Two-File State Architecture:** `state.yaml` (current context) + `event-log.jsonl` (immutable audit) — no database, no external services
  2. **Git-as-Process-Tracker:** Branch topology mirrors BMAD lifecycle phases — project state reconstructible from git alone
  3. **5-Category Workflow Taxonomy:** core (auto-triggered) → router (user-facing phase commands) → discovery → governance → utility
  4. **Dogfooding Model:** `src/modules/lens-work/` is the source; `_bmad/lens-work/` is the installed copy; `_bmad/_config/custom/lens-work/` is the custom override layer
  5. **Lazy Loading:** Agents/workflows resolved at runtime from CSV manifests — never pre-loaded
  6. **Separation of Concerns:** Agents have YAML configs (`.agent.yaml`) + Markdown personas (`.md`) + spec contracts (`.spec.md`)

- **Module Organization (7 installed modules):**

| Module | Source | Files | Purpose |
|--------|--------|-------|---------|
| core | Built-in | 33 | Master executor, tasks, resources |
| bmm | Built-in | 194 | BMAD Method — planning-to-implementation lifecycle |
| bmb | External (npm) | 162 | Builder — create agents, modules, workflows |
| cis | External (npm) | 31 | Creative Intelligence Suite |
| gds | External (npm) | 210 | Game Dev Studio |
| tea | External (npm) | 210 | Test Engineering Academy |
| lens-work | Custom (src/) | 148 | LENS Workbench — phase routing + git orchestration |

## API SURFACE

### Agent Interfaces (5 lens-work agents)

| Agent | ID | Role | Trigger Mode |
|-------|----|------|-------------|
| **Compass** | compass | Phase-aware lifecycle router | User commands (`/pre-plan`, `/spec`, `/plan`, `/review`, `/dev`) |
| **Casey** | casey | Git branch orchestrator | Auto-triggered (never directly by users) |
| **Tracey** | tracey | State & recovery specialist | User shortcodes (`/status`, `/resume`, `/sync`, `/fix`) |
| **Scout** | scout | Bootstrap & discovery manager | User commands (`/discover`, `/bootstrap`, `/lens-sync`) |
| **Cornelius (Scribe)** | scribe | Constitutional governance guardian | User commands (`/constitution`, `/compliance`, `/ancestry`) |

### Phase Router Commands

| Command | Phase | Description |
|---------|-------|-------------|
| `/pre-plan` | Phase 1 | Analysis — brainstorm, research, product brief |
| `/spec` | Phase 2 | Planning — PRD, UX design |
| `/plan` | Phase 3 | Solutioning — architecture, epics & stories |
| `/review` | Phase 3→4 | Implementation readiness check |
| `/dev` | Phase 4 | Implementation — sprint planning, dev story, code review |

### Initiative Commands

| Command | Scope |
|---------|-------|
| `#new-domain` | Create new domain initiative |
| `#new-service` | Create new service initiative |
| `#new-feature` | Create new feature initiative |
| `#fix-story` | Fix an existing story |

### Prompt Entry Points

36 prompt files in `prompts/` + 28 deployed to `.github/prompts/` + 113 Codex prompts in `.codex/prompts/`

## DATA MODELS

### State Model (`_bmad-output/lens-work/state.yaml`)
- Active initiative context (ID, domain, service, phase, lane)
- Current workflow status and gate progression
- Branch topology state

### Event Log (`_bmad-output/lens-work/event-log.jsonl`)
- Append-only JSONL — timestamped lifecycle events
- Used for recovery, auditing, telemetry dashboards

### Governance Events Schema (`data/governance-events.yaml`)
- Typed event definitions: `constitution-created`, `constitution-amended`, compliance events
- Fields: timestamp (ISO-8601), layer (domain/service/microservice/feature), name, articles_count, ratified_by, git_commit_sha, initiative_id

### Service Map (`_bmad/lens-work/service-map.yaml`)
- Maps domain/service to repo paths in TargetProjects/

### Agent Definitions (`.agent.yaml` + `.md` + `.spec.md`)
- YAML: Identity, role, communication style, capabilities, menu system, triggers
- Markdown: Rich persona narrative, activation instructions, principles
- Spec: Behavioral contract, preconditions, postconditions, test scenarios

## INTEGRATION POINTS

| Integration | Type | Detail |
|-------------|------|--------|
| **bmad-method@6.0.0-Beta.7** | npm dependency | Core BMAD platform (core + bmm modules) |
| **bmad-builder** | External npm module | Agent/module/workflow creation tools |
| **GitHub Copilot Chat** | IDE integration | `.github/agents/` stubs load from `_bmad/` |
| **OpenAI Codex** | IDE integration | `.codex/prompts/` — 113 prompt files |
| **Git (local)** | Process backbone | Branch topology = lifecycle state |
| **GitHub (remote)** | Source management | origin: crisweber2600/BMAD.Lens.git |
| **NorthStarET.BMAD** | Control repo | Dogfooding host — installs lens-work via `install-lens-work-relative.ps1` |
| **JIRA** | Optional | `enable_jira_integration` flag in module.yaml (default: false) |

## TECHNICAL DEBT SIGNALS

| Signal | Severity | Evidence |
|--------|----------|---------|
| **12 `.bak` files** | Low | In `_bmad/bmm/` and `_bmad/core/` — stale backup files from upstream modules |
| **6 `tmpclaude-*` files** | Low | Codex temp files at repo root — should be in `.gitignore` |
| **`getting-started-old.md`** | Low | Superseded doc still tracked in 3 locations (src, custom, installed) |
| **No README.md at repo root** | Medium | Only module-level README exists; repo root has no entry documentation |
| **Archive directory (1,844 files)** | Medium | 53% of total repo by file count; retained for migration reference but adds noise |
| **`lens-work` version: null** | Medium | In `manifest.yaml` — lens-work has no version number assigned |
| **Triple-copy pattern** | Medium | Every lens-work file exists in 3 places: `src/`, `_bmad/_config/custom/`, `_bmad/lens-work/` — sync risk |
| **`docs/workflows.md` stale** | High | References deprecated "Bridge/Link" terminology from pre-lens-work era |
| **No automated tests** | High | `lens-work-tests.spec.md` is a markdown spec, not executable test code |
| **No CI/CD pipeline** | High | No `.github/workflows/` directory — no automated validation on push |

## RISKS & UNKNOWNS

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Solo contributor** | High | Bus factor = 1; all institutional knowledge is in one person |
| **9-day-old repo** | Medium | Very new codebase — patterns not yet battle-tested at scale |
| **Triple-copy file sync** | High | Source → custom → installed — manual installer sync; drift risk is real |
| **No version for lens-work** | Medium | Cannot track releases or breaking changes programmatically |
| **Archive not pruned** | Low | 1,844 archive files; migration complete per LENSV3-MERGE-CATALOG.md but files retained |
| **Conventional commits inconsistent** | Low | Mix of scoped (`feat(lens-work):`) and unscoped (`push`, `update`) messages |
| **No branch protection** | Medium | `docs/branch-protection.md` exists as guide but no enforced rules on GitHub |
| **JIRA integration defaulted off** | Low | Module supports it but disabled — no external project tracking active |
| **Codex temp files uncommitted** | Low | 6 `tmpclaude-*` files at root — likely from Codex agent sessions |

---

*Report generated by Scout (Deep Service Discovery) from control repo D:/NorthStarET.BMAD*
*Evidence base: git history (46 commits), file system scan (1,584 active files + 1,844 archive), manifest analysis*

