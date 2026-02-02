# LENS: Layered Enterprise Navigation System

Git-aware architectural navigation with automated discovery and synchronization for large interconnected projects.

Automatically detects and switches between Domain, Service, Microservice, and Feature lenses while syncing architectural knowledge with physical reality through automated brownfield discovery and bi-directional lens synchronization.

---

## Overview

LENS is a meta-navigation module that gives BMAD a multi-layered understanding of complex systems. It detects architectural context from git state and project structure, then loads the right level of context automatically to reduce cognitive overhead.

LENS also bridges the gap between architectural intent and the real codebase. It bootstraps legacy microservices into BMAD-ready projects, generates documentation from code analysis, and keeps lens metadata synchronized as systems evolve.

---

## Installation

```bash
bmad install lens
```

---

## Quick Start

**First Run (Automatic Setup):**
1. Run `bmad.start` to activate LENS with automatic first-run initialization
2. If `domain-map.yaml` exists, bootstrap will clone repositories automatically (with approval)
3. Navigator activates with full context after initialization completes

**Navigation & Context:**
1. Run `navigator` to detect your current lens.
2. Use `guide` to get lens-aware workflow recommendations.
3. Use `switch lens` to change zoom levels.
4. Use `context load` to pull deeper details for the current lens.
5. Configure branch patterns with `lens-configure`
6. Restore your last session with `lens-restore`

**Discovery & Synchronization:**
1. Run `Bridge, bootstrap` to align folder structure with the lens domain map.
2. Run `Scout, discover` to generate BMAD-ready documentation from your codebase.
3. Run `Link, update-lens` to propagate documentation changes.
4. Use `sync-status` to check alignment between architecture and code.
5. Use `reconcile` to resolve conflicts between versions.

---

## Usage Examples

**Navigation:**
- Detect your current lens: `navigator`
- Switch lenses: `switch lens` → `service` or `feature`
- Load deeper context: `context load`
- Configure branch patterns: `lens-configure`
- Restore your last session: `lens-restore`

**Discovery & Synchronization:**
- Bootstrap legacy structure: `bootstrap`
- Discover codebase documentation: `discover`
- Generate documentation: `generate-docs`
- Analyze codebase: `analyze-codebase`
- Check sync status: `sync-status`
- Reconcile conflicts: `reconcile`
- Update lens metadata: `update-lens`
- Validate schema: `validate-schema`
- Rollback to snapshot: `rollback`

**For detailed documentation, see [docs/](docs/).**

---

## Components

### Agents

- **Navigator** — Architectural context navigation and guidance
- **Bridge** — The Synchronizer (aligns folder structure with domain map)
- **Scout** — Discovery Specialist (generates BMAD documentation from code)
- **Link** — Lens Guardian (propagates changes, maintains sync)

### Workflows

**Navigation & Context (MVP1)**
- lens-detect
- lens-switch
- context-load
- lens-restore
- lens-configure
- workflow-guide

**Discovery & Synchronization**
- bootstrap
- discover
- analyze-codebase
- generate-docs
- sync-status
- reconcile
- update-lens
- validate-schema
- rollback

**Advanced**
- domain-map
- impact-analysis
- new-service
- new-microservice
- new-feature
- service-registry
- onboarding
- lens-sync

---

## Configuration

LENS uses module defaults with optional project overrides. Configuration can be created with `lens-configure`, which writes `.lens/lens-config.yaml` in the target project.

Discovery and synchronization can be customized with:
- `target_project_root` — Project to scan and sync (default: project root)
- `enable_jira_integration` — JIRA integration during discovery (default: false)
- `discovery_depth` — Analysis depth: shallow, standard, or deep (default: standard)
- `docs_output_folder` — Where to write generated docs (default: `docs/`)

### Documentation Output Structure

Generated documentation follows the same domain/service folder structure as TargetProjects:

```
docs/                              # Project root /docs folder (NOT _bmad-output/docs)
├── {Domain}/
│   └── {Service}/
│       ├── architecture.md
│       ├── api-surface.md
│       ├── data-model.md
│       ├── integration-map.md
│       └── onboarding.md
└── README.md                      # Index of all generated docs
```

**Example:**
```
docs/
├── NextGen/
│   ├── NorthStarET/
│   │   ├── architecture.md
│   │   └── ...
│   └── NorthStarET.Student/
│       └── ...
└── OldNorthStar/
    └── OldNorthStar/
        └── ...
```

---

## Module Structure

```
lens/
├── module.yaml
├── README.md
├── TODO.md
├── CHANGELOG.md
├── docs/
│   ├── getting-started.md
│   ├── agents.md
│   ├── workflows.md
│   ├── architecture.md
│   ├── operations.md
│   ├── configuration.md
│   ├── session-store.md
│   ├── traceability.md
│   ├── testing.md
│   ├── troubleshooting.md
│   ├── migrations.md
│   ├── spec-checklist.md
│   ├── installation-testing.md
│   ├── review-log.md
│   └── reviews/
├── prompts/
├── agents/
│   ├── navigator/
│   ├── bridge/
│   ├── scout/
│   └── link/
├── workflows/
│   ├── context-load/
│   ├── lens-detect/
│   ├── lens-switch/
│   ├── lens-restore/
│   ├── lens-configure/
│   ├── workflow-guide/
│   ├── bootstrap/
│   ├── discover/
│   ├── analyze-codebase/
│   ├── generate-docs/
│   ├── sync-status/
│   ├── reconcile/
│   ├── update-lens/
│   ├── validate-schema/
│   ├── rollback/
│   └── [others...]
└── _module-installer/
```

---

## Documentation

For detailed user guides and documentation, see the **[docs/](docs/)** folder:
- [Getting Started](docs/getting-started.md)
- [Agents Reference](docs/agents.md)
- [Workflows Reference](docs/workflows.md)
- [Architecture](docs/architecture.md)
- [Operations](docs/operations.md)
- [Configuration](docs/configuration.md)
- [Session Store](docs/session-store.md)
- [Traceability](docs/traceability.md)
- [Testing](docs/testing.md)
- [Troubleshooting](docs/troubleshooting.md)
- [Migrations](docs/migrations.md)
- [Spec Checklist](docs/spec-checklist.md)
- [Installation Testing](docs/installation-testing.md)
- [Review Log](docs/review-log.md)

---

## Development Status

This module is feature-complete. The following components are implemented:

- [x] Agents: 4 agents (Navigator, Bridge, Scout, Link)
- [x] Workflows: 22 workflows (navigation, discovery, synchronization)

See TODO.md for ongoing improvements and planned enhancements.

---

## Author

Created via BMAD Module workflow

---

## License

Part of the BMAD framework.
