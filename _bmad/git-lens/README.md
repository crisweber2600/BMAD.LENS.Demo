# Git-Lens

Git workflow orchestration for LENS.

Automated branching, PR gating, and workflow enforcement.

---

## Overview

Git-Lens automates git branching, merge gating, and PR routing for LENS planning workflows. It creates predictable branch topology, enforces sequential workflow completion, and provides PR links with reviewer suggestions.

---

## Installation

```bash
bmad install lens
```

Enable the Git-Lens extension when prompted.

---

## Quick Start

1. Start a LENS workflow (`#file:new-service`, `#file:new-feature`, or `#file:new-microservice`).
2. Git-Lens initializes initiative branches.
3. Continue LENS workflows; Git-Lens creates workflow branches and prints PR links.
4. Use Tracey commands (`ST`, `SY`, `FIX`) for diagnostics.

**For detailed documentation, see [docs/](docs/).**

---

## Components

### Agents

- Casey (Conductor)
- Tracey (State Manager)

### Workflows

Core:
- init-initiative
- start-workflow
- finish-workflow
- start-phase
- finish-phase
- open-lead-review
- open-final-pbr

Diagnostics:
- status
- resume
- sync
- fix-state
- override
- reviewers
- recreate-branches
- archive

---

## Configuration

The module supports these configuration options (set during installation):

- `base_ref`
- `auto_push`
- `remote_name`
- `fetch_strategy`
- `fetch_ttl`
- `commit_strategy`
- `validation_cascade`
- `pr_api_enabled`
- `state_folder`
- `event_log_enabled`

---

## Module Structure

```
lens/extensions/git-lens/
├── module.yaml
├── README.md
├── TODO.md
├── docs/
│   ├── getting-started.md
│   ├── agents.md
│   ├── workflows.md
│   └── examples.md
├── agents/
├── workflows/
├── hooks/
└── _module-installer/
```

---

## Documentation

For detailed user guides and documentation, see the **[docs/](docs/)** folder:
- [Getting Started](docs/getting-started.md)
- [Agents Reference](docs/agents.md)
- [Workflows Reference](docs/workflows.md)
- [API Reference](docs/api-reference.md)
- [Examples](docs/examples.md)

---

## Development Status

This module is currently in development. The following components are planned:

- [ ] Agents: 2 agents
- [ ] Workflows: 15 workflows

See TODO.md for detailed status.

---

## Author

Created via BMAD Module workflow

---

## License

Part of the BMAD framework.
