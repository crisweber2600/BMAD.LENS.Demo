# Copilot Instructions — NorthStarET.BMAD

## Repository Purpose

This is a **BMAD control repo** — it does NOT contain application code. It orchestrates planning, discovery, and lifecycle management for multiple target projects using the BMAD Method v6 framework. The repo dogfoods its own tooling: the `lens-work` module source lives in `TargetProjects/LENS/BMAD.Lens` and is installed into `_bmad/lens-work/`.

## Architecture: Control Repo + Target Projects

```
NorthStarET.BMAD/          ← Control repo (you are here)
├── _bmad/                 ← BMAD framework: modules, agents, workflows, config
│   ├── _config/           ← Installation manifest, agent/workflow/file manifests
│   ├── _memory/           ← Agent memory (tech-writer sidecar, storyteller, etc.)
│   ├── core/              ← Core platform (bmad-master, tasks, resources)
│   ├── bmm/               ← BMAD Method Module (planning → implementation lifecycle)
│   ├── bmb/               ← BMAD Builder Module (create agents, modules, workflows)
│   ├── cis/               ← Creative Intelligence Suite
│   ├── gds/               ← Game Dev Studio
│   ├── tea/               ← Test Engineering Academy
│   └── lens-work/         ← LENS Workbench (INSTALLED from BMAD.Lens)
├── _bmad-output/          ← Runtime state, logs, planning artifacts
├── .github/agents/        ← GitHub Copilot Chat agent stubs (load from _bmad/)
├── .github/prompts/       ← Reusable prompt files for lens-work commands
├── TargetProjects/        ← Cloned repos managed by lens-work
│   ├── LENS/BMAD.Lens/    ← Source repo for the lens-work module (dogfooding)
│   ├── bmad-chat/         ← React/TypeScript collaboration UI
│   └── bmadServer/        ← .NET Aspire workflow orchestration API
└── docs/                  ← Discovery scans and documentation
```

### Critical Rule: Control-Plane Separation

**All commands execute from THIS repo.** Never `cd` into TargetProjects repos to run BMAD operations. Repo operations use paths from `_bmad/lens-work/service-map.yaml` programmatically.

## Dogfooding: BMAD.Lens → lens-work

The `lens-work` module is sourced from `TargetProjects/LENS/BMAD.Lens/src/modules/lens-work/`. When changes to lens-work are needed:

1. **Do NOT edit `_bmad/lens-work/` directly** — it is the installed copy
2. Route changes through the **module-builder agent** (`@bmad-agent-bmb-module-builder`) (`TargetProjects/LENS/BMAD.Lens/src/modules/lens-work/`)
3. After changes are complete, run the installation script: `powershell ./install-lens-work-relative.ps1`

This script performs the three-step sync: copy source → run BMAD installer → deploy to active `_bmad/lens-work/` directory.

## BMAD Agent System

Agents are persona-driven AI assistants defined in `_bmad/{module}/agents/`. Each has a role, communication style, and principles. GitHub Copilot Chat stubs in `.github/agents/` follow this pattern:

```markdown
---
name: '{agent-name}'
disable-model-invocation: true
---
<agent-activation CRITICAL="TRUE">
1. LOAD the FULL agent file from {project-root}/_bmad/{module}/agents/{agent}.md
2. READ its entire contents
3. FOLLOW every step in the <activation> section precisely
</agent-activation>
```

**Key agents by module:**
- **core:** `bmad-master` — Master executor, runtime resource management
- **bmm:** `analyst`, `architect`, `pm`, `dev`, `sm`, `quinn`, `quick-flow-solo-dev`, `tech-writer`, `ux-designer`
- **bmb:** `agent-builder`, `module-builder`, `workflow-builder`
- **lens-work:** `compass` (phase router), `casey` (git orchestrator), `tracey` (state manager), `scout` (discovery)

## BMAD Lifecycle Phases (BMM)

The planning-to-implementation lifecycle follows ordered phases:

1. **Analysis** (Phase 1): Brainstorm → Research → Product Brief
2. **Planning** (Phase 2): PRD → UX Design
3. **Solutioning** (Phase 3): Architecture → Epics & Stories → Implementation Readiness Check
4. **Implementation** (Phase 4): Sprint Planning → Create Story → Dev Story → Code Review → Retrospective

Artifacts flow to `_bmad-output/planning-artifacts/` and `_bmad-output/implementation-artifacts/`.

## LENS Workbench Commands

Phase commands via Compass: `/pre-plan`, `/spec`, `/plan`, `/review`, `/dev`
Initiative commands: `#new-domain`, `#new-service`, `#new-feature`, `#fix-story`
Prompt files: `.github/prompts/lens-work.{command}.prompt.md`

## File Conventions

- **Agent definitions:** Markdown (`.md`) with YAML frontmatter or `.agent.yaml` files
- **Workflows:** `.md` (markdown-based steps) or `.yaml` (structured config)
- **Manifests:** CSV for flat registries (`agent-manifest.csv`, `workflow-manifest.csv`, `files-manifest.csv`)
- **State:** YAML (`state.yaml`) + JSONL event log (`event-log.jsonl`) in `_bmad-output/lens-work/`
- **Module configs:** YAML in `_bmad/{module}/config.yaml`
- **Agent customization:** `_bmad/_config/agents/{module}-{agent}.customize.yaml`
- **Path tokens:** Use `{project-root}` for absolute paths in configs; resolves at runtime

## Key Patterns

- **Load at runtime, never pre-load:** Agents and workflows resolve resources lazily from manifests
- **Numbered menus:** All agent interactions present numbered option lists for user selection
- **CSV registries:** `_config/*.csv` files are the authoritative index of all agents, workflows, tasks, and files
- **Module independence:** Each module (`bmm`, `bmb`, `cis`, etc.) is self-contained with its own `config.yaml`, agents, and workflows
- **Custom layer:** `_config/custom/` holds user overrides; `_config/agents/*.customize.yaml` extends agent behavior without modifying source

## Working with Target Projects

The `service-map.yaml` maps repos:
- `BMAD.Lens` → `TargetProjects/LENS/BMAD.Lens` (BMAD framework source)
- `bmad-chat` → `TargetProjects/bmad-chat` (React UI)
- `bmadServer` → `TargetProjects/bmadServer` (.NET Aspire API, port 8080)

Discovery docs live in `docs/discovery/` and `docs/lens-sync/`. Generated canonical docs go to `_bmad-output/lens-work/docs/`.
