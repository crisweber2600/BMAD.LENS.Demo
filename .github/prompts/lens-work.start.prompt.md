```prompt
---
description: Run LENS Workbench preflight check and activate Compass for lifecycle navigation
---

# LENS Workbench System Preflight Check & Activation

Execute preflight check of all lens-work systems, then activate Compass for workflow guidance.

## Phase 1: Core System Check

### 1.1 Module Configuration
- [ ] Check for module config: `_bmad/lens-work/module.yaml`
- [ ] Check for Compass agent: `_bmad/lens-work/agents/compass.agent.yaml`
- [ ] Check for state directory: `_bmad-output/lens-work/`

### 1.2 Agent Roster
- [ ] Compass (Phase Router) — `agents/compass.agent.yaml`
- [ ] Casey (Git Conductor) — `agents/casey.agent.yaml`
- [ ] Tracey (State Manager) — `agents/tracey.agent.yaml`
- [ ] Scout (Bootstrap & Discovery) — `agents/scout.agent.yaml`

### 1.3 Core Workflows
- [ ] `workflows/router/pre-plan/` — Analysis phase
- [ ] `workflows/router/spec/` — Planning phase
- [ ] `workflows/router/plan/` — Solutioning phase
- [ ] `workflows/router/review/` — Gate phase
- [ ] `workflows/router/dev/` — Implementation phase
- [ ] `workflows/discovery/repo-discover/` — Repo inventory
- [ ] `workflows/utility/bootstrap/` — Initial setup

## Phase 2: State Check

### 2.1 Active Initiative
- [ ] Check for state file: `_bmad-output/lens-work/state.yaml`
- [ ] Check for event log: `_bmad-output/lens-work/event-log.jsonl`
- [ ] Detect current phase and branch

### 2.2 Repo Inventory
- [ ] Check for repo inventory: `_bmad-output/lens-work/repo-inventory.yaml`
- [ ] Check TargetProjects path from config

## Phase 3: Activate Compass

If preflight passes:
1. Load Compass agent: `_bmad/lens-work/agents/compass.agent.yaml`
2. Display status and available commands
3. Offer: `[onboard]` for new users, `[RS]` to resume, or phase commands

If state exists, show current position:
```
📍 Current Position
├── Initiative: {id}
├── Phase: {phase}
├── Workflow: {workflow}
└── Next: {recommendation}
```

```
