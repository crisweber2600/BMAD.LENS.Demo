---
repo: BMAD.Lens
remote: https://github.com/crisweber2600/BMAD.Lens.git
default_branch: main
generated_at: 2026-02-07T12:00:00Z
domain: BMAD
service: LENS
generator: lens-sync
---

# BMAD.Lens — Onboarding Guide

## Prerequisites

| Requirement | Version | Purpose |
|---|---|---|
| Node.js | 18+ (ES Modules support) | Module installer execution |
| PowerShell | 5.1+ | Validation and sync scripts |
| Git | 2.30+ | Repository operations |
| VS Code | Latest | IDE with GitHub Copilot integration |
| GitHub Copilot | Active subscription | Agent interactions via `.github/agents/` |

## Setup Steps

### 1. Clone the Repository

```bash
git clone https://github.com/crisweber2600/BMAD.Lens.git
cd BMAD.Lens
```

### 2. Verify Node.js

```bash
node --version  # Must be 18+ for ES module support
```

### 3. Install the Framework (Self-Dogfooding)

The repo installs its own modules into `_bmad/`:

```bash
node src/modules/lens-work/_module-installer/installer.js
```

### 4. Validate Installation

```powershell
pwsh src/modules/lens-work/scripts/validate-lens-work.ps1
```

### 5. Sync Prompts (Optional)

Replicate lens-work prompts to `.github/prompts/` and `.codex/prompts/`:

```powershell
pwsh src/modules/lens-work/scripts/sync-prompts.ps1
```

## For Control Repo Users (NorthStarET.BMAD)

If you're working in the control repo that **consumes** BMAD.Lens:

### 1. Clone Both Repos (if not already done)

```bash
# Control repo
git clone https://github.com/crisweber2600/NorthStarET.BMAD.git
cd NorthStarET.BMAD

# Source repo (into TargetProjects)
git clone https://github.com/crisweber2600/BMAD.Lens.git TargetProjects/BMAD/LENS/BMAD.Lens
```

### 2. Install lens-work from Source

```powershell
# From the control repo root
pwsh install-lens-work-relative.ps1
```

This performs the 3-step sync:
1. Copy source from `TargetProjects/BMAD/LENS/BMAD.Lens/src/modules/lens-work/`
2. Run the BMAD installer
3. Deploy to `_bmad/lens-work/`

### 3. Critical Rule: Dogfooding

**Never edit `_bmad/lens-work/` directly.** It is the installed copy.

To modify lens-work:
1. Edit source files in `TargetProjects/BMAD/LENS/BMAD.Lens/src/modules/lens-work/`
2. Run `install-lens-work-relative.ps1` to sync changes
3. Commit changes in the source repo

## Development Workflow

### Editing Agents

Agent files live in `src/modules/lens-work/agents/`:
- `*.agent.yaml` — Structured configuration (menu, capabilities, dependencies)
- `*.md` — Persona narrative (communication style, principles)
- `*.spec.md` — Behavioral specification

### Editing Workflows

Workflows are step-file markdown under `src/modules/lens-work/workflows/`:

```
workflows/
├── core/          # Git lifecycle, init, phase transitions
├── router/        # Phase commands (pre-plan, spec, plan, review, dev)
├── discovery/     # Repo scanning and documentation
├── governance/    # Compliance and constitutions
└── utility/       # Bootstrap, fix, override, resume, sync, switch
```

Each workflow has a `workflow.md` orchestrator and numbered step files (`step-01-*.md`, etc.).

### Running Commands

From VS Code with GitHub Copilot Chat:
- **Phase commands:** `/pre-plan`, `/spec`, `/plan`, `/review`, `/dev` (via Compass)
- **Initiative commands:** `#new-domain`, `#new-service`, `#new-feature`, `#fix-story`
- **Discovery commands:** `/discover`, `/document`, `/reconcile`, `/repo-status`
- **State commands:** `/status`, `/resume`, `/sync`, `/fix`, `/override`

## Key Concepts

1. **Agents** — Persona-driven AI assistants with defined roles, styles, and capabilities
2. **Workflows** — Multi-step processes orchestrated by agents (step-file markdown)
3. **Modules** — Self-contained packages of agents, workflows, and config
4. **Service Map** — `service-map.yaml` maps repo names to file system paths
5. **State** — `_bmad-output/lens-work/state.yaml` tracks initiative phase and context
6. **Event Log** — `_bmad-output/lens-work/event-log.jsonl` records all state transitions

## Debugging Tips

- **Agent not loading?** Check that `.github/agents/` stubs point to correct `_bmad/{module}/agents/` paths
- **Installer fails?** Verify Node.js 18+ and that source directory exists at expected path
- **Prompts missing?** Run `sync-prompts.ps1` to regenerate
- **State corruption?** Use Tracey's `/fix` command or manually edit `state.yaml`
- **Workflow step not found?** Verify the step file exists within the workflow directory

## Common Issues

| Issue | Cause | Fix |
|---|---|---|
| `ERR_MODULE_NOT_FOUND` | Node.js < 18 | Upgrade to Node.js 18+ |
| Agent file not loading | Incorrect path in `.github/agents/` stub | Verify `{project-root}` resolves correctly |
| Empty `_bmad/` after install | Installer script path error | Run from repo root; check `install-lens-work-relative.ps1` |
| Stale prompts | Source prompts updated but not synced | Run `sync-prompts.ps1` |
| PowerShell execution policy | Script blocked by OS policy | `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` |
