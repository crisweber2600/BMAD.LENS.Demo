---
name: bootstrap
description: Sync TargetProject folder structure with the lens domain map
nextStep: './steps-c/step-00-preflight.md'
web_bundle: true
installed_path: '{project-root}/_bmad/lens/workflows/bootstrap'
---

# Bootstrap Workflow (Create-Only)

**Goal:** Bootstrap target project structure from the lens domain map.

**Integration:** This workflow is automatically triggered during first-run setup (Phase 5.5 of [bmad.start.prompt.md](../prompts/bmad.start.prompt.md)) when bootstrap configuration is detected. See [Bootstrap Integration Guide](./docs/bootstrap-integration.md) for full documentation.

## Quick Start

1. Run LENS startup workflow (bmad.start) or execute this workflow manually
2. If `_bmad/lens/domain-map.yaml` does not exist:
   - Phase 5.5 will auto-create a starter template
   - Define your domains, services, and repositories
   - Run LENS startup again to bootstrap
3. If `_bmad/lens/domain-map.yaml` exists, validate service.yaml files
4. Review and approve sync plan when prompted
5. Wait for clones to complete
6. Review bootstrap report in `docs/bootstrap/bootstrap-report.md`

## Workflow Steps

Follow the steps in order. When a step is complete, load the next step file.
