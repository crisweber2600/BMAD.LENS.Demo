---
repo: NorthStarET.Student
remote: https://github.com/crisweber2600/NorthStarET.Student.git
default_branch: main
generated_at: 2026-02-07T12:00:00Z
domain: NextGen
service: NorthStarET
generator: lens-sync
confidence: 0.85
---

# NorthStarET.Student — Architecture

## Status: Pre-Development Scaffold

NorthStarET.Student is an **empty BMAD-managed project scaffold**. It contains BMAD framework infrastructure (`_bmad/`, `_bmad-output/`) and planning documentation, but **no application source code**.

## Overview

This repository is intended as a **student portal** for the NorthStarET LMS ecosystem. It was created as a BMAD lifecycle workspace — the actual student-facing application has not yet been developed.

**Business Purpose (planned):** Student-facing portal for NorthStarET K-12 LMS, providing students with assessment access, grade viewing, and dashboard functionality.

## Current Contents

```
NorthStarET.Student/
├── _bmad/                              # Installed BMAD framework
│   ├── bmb/                            # Builder Module (agents, workflows)
│   │   ├── agents/                     # agent-builder, module-builder, workflow-builder
│   │   └── workflows/                  # Agent, module, workflow creation workflows
│   ├── bmm/ (expected)                 # Method Module
│   └── core/ (expected)                # Core platform
├── _bmad-output/                       # Runtime output directory
├── docs/
│   └── lens-sync/
│       └── NorthStarET.Student/
│           ├── api-surface.md          # PLANNED API surface
│           ├── architecture.md         # PLANNED architecture
│           ├── data-model.md           # PLANNED data model
│           ├── integration-map.md      # PLANNED integrations
│           └── onboarding.md           # PLANNED setup guide
└── (no source code)
```

## Planned Technology Stack (from lens-sync docs)

| Technology | Version | Purpose | Status |
|---|---|---|---|
| .NET | 10.0 | Backend runtime | PLANNED |
| React | 19.x | Frontend UI | PLANNED |
| PostgreSQL | — | Database | PLANNED |
| Aspire | — | Orchestration | PLANNED |

**Note:** The planned stack is inferred from NorthStarET Migration track patterns and `docs/lens-sync/` documentation. No code exists to confirm.

## Planned Integration Points

| Integration | Type | Status |
|---|---|---|
| NorthStarET StudentService | Backend API | PLANNED |
| NorthStarET Identity.API | Auth | PLANNED |
| NorthStarET SectionService | Enrollment | PLANNED |

## Activity

| Metric | Value |
|---|---|
| Total Commits | 6 |
| Last Commit | 2026-01-31 |
| Status | DORMANT |
| Contributors | 2 (Cris Weber, Tayrika) |

All 6 commits are scaffolding/setup — no feature development.

## Technical Debt

| Signal | Severity | Evidence |
|---|---|---|
| No source code | HIGH | Repository has zero application code |
| BMAD framework overhead | MEDIUM | Full BMAD framework installed for empty project |
| Stale planning docs | MEDIUM | lens-sync docs may not reflect current NorthStarET direction |
| Dependent on parent project | HIGH | NorthStarET (parent) is actively developed but Student portal not yet started |

## Risks

1. **Project viability unclear** — Student portal may be built within NorthStarET repo instead
2. **Planning docs may be stale** — Architecture docs describe intended design without code backing
3. **"Game brief" artifact** — Unexpected `game brief` document suggests possible scope confusion
4. **Blocked by parent** — Cannot proceed until NorthStarET backend services are stable
