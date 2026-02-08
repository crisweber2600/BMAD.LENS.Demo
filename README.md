# BMAD.Lens Demo Repository

This repository demonstrates the BMAD framework with the LENS Workbench module installed.

## Structure

- `_bmad/` - BMAD framework modules and configuration
  - `lens-work/` - LENS Workbench module for phase-aware project orchestration
  - `core/` - Core BMAD platform
  - `bmm/` - BMAD Method Module
  - `bmb/` - BMAD Builder Module
  - Other modules (cis, gds, tea)
- `_bmad-output/` - Runtime state, logs, and planning artifacts
- `.github/` - GitHub Copilot Chat agent integrations
- `TargetProjects/` - Managed repositories (cloned via lens-work)
- `docs/` - Discovery scans and documentation

## Installation

Run the installation script to sync the lens-work module:

```powershell
powershell ./install-lens-work-relative.ps1
```

This script:
1. Syncs lens-work from the BMAD.Lens source repository
2. Runs the BMAD installer
3. Deploys lens-work to the active `_bmad/lens-work/` directory
4. Ensures branch consistency between BMAD.Lens and this demo repo

## BMAD Lifecycle

The BMAD Method follows a structured lifecycle:
1. **Analysis** (Phase 1): Brainstorm → Research → Product Brief
2. **Planning** (Phase 2): PRD → UX Design
3. **Solutioning** (Phase 3): Architecture → Epics & Stories
4. **Implementation** (Phase 4): Sprint Planning → Development → Code Review

Use LENS Workbench commands via GitHub Copilot Chat:
- `/pre-plan` - Analysis phase
- `/spec` - Planning phase
- `/plan` - Solutioning phase
- `/review` - Implementation gate
- `/dev` - Development phase

## Learn More

- [BMAD Framework Documentation](https://github.com/crisweber2600/BMAD.Lens)
- [LENS Workbench Guide](_bmad/lens-work/README.md)
