# Lens Compass: Intelligent Role-Based Navigation

Role-aware navigation and guidance for Lens workflows.

Learns user roles, tracks contributions, and suggests next steps.

---

## Overview

Lens Compass extends the Lens module with persona-aware guidance, automatic roster tracking, and context-driven next-step recommendations. It reduces decision fatigue by pointing users to the right workflows based on role and phase.

---

## Installation

```bash
bmad install lens
```

Lens Compass installs as a Lens extension by default.

---

## Quick Start

1. Run onboarding to create your personal profile
2. Use Next Steps to get role-aware guidance
3. Let Compass auto-track your contributions

---

## Components

### Agents

- Navigator (Compass)

### Workflows

Core:
- onboarding
- next-step-router
- roster-tracker

Feature:
- profile-manager
- roster-query
- preference-learner
- context-analyzer

Utility:
- data-cleanup
- roster-export

---

## Configuration

The module supports these configuration options (set during installation):

- `personal_profiles_folder`
- `roster_file`
- `use_git_identity`
- `suggestion_mode`
- `preference_learning`

---

## Module Structure

```
lens/extensions/lens-compass/
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
└── _module-installer/
```

---

## Documentation

For detailed user guides and documentation, see the **docs/** folder:
- Getting Started
- Agents Reference
- Workflows Reference
- Examples

---

## Development Status

This module is currently in development. The following components are built:

- [x] Agents: 1 agent
- [x] Workflows: 9 workflows

See TODO.md for detailed status.

---

## Author

Created via BMAD Module workflow

---

## License

Part of the BMAD framework.
