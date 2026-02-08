# Discovery Report: NorthStarET

---
repo: NorthStarET
remote: https://github.com/crisweber2600/NorthStarET.git
branch: main
commit: b7782e62f4760fb0542173b362dd6c0c6f5f88e5
timestamp: 2026-02-07T12:00:00Z
domain: NextGen
service: NorthStarET
scanner: SCOUT DS (Deep Brownfield Discovery)
confidence: 0.95
---

## Overview / Business Purpose

NorthStarET is a **large-scale LMS (Learning Management System) modernization project** migrating from .NET Framework 4.6/4.8 to .NET 10. The system manages K-12 educational assessments, student tracking, intervention programs, team meetings, section reports, and classroom dashboards. It serves school districts with features like roster rollover, benchmark tracking, data entry, and intervention toolkit management.

The project follows a **dual-track strategy:**
1. **Upgrade Track** — Monolith upgrade (`.NET 4.8 → .NET 10`) with a new React 18 frontend, Aspire orchestration, and YARP API gateway
2. **Migration Track** — Clean Architecture microservices decomposition with PostgreSQL, dedicated service boundaries

This is the **largest and most active repository** in the portfolio with 1,786 commits, 8 contributors, and 342 React components.

## Technology Stack

### Upgrade Track
| Technology | Version | Purpose |
|---|---|---|
| .NET | 10.0 | Runtime (upgraded from .NET 4.8) |
| ASP.NET Core WebAPI | 10.0 | Backend API |
| Aspire AppHost | — | Orchestration |
| YARP | — | API Gateway/Reverse Proxy |
| Entity Framework 6 | — | ORM (legacy, not yet migrated to EF Core) |
| SQL Server | — | Database (original) |
| React | 18/19 | Frontend framework |
| TypeScript | — | Frontend language |
| Vite | — | Build tooling |
| Serilog | — | Structured logging |
| Azure Blob Storage | — | File storage |
| Azure Application Insights | — | Monitoring |
| SendGrid | — | Email service |

### Migration Track
| Technology | Version | Purpose |
|---|---|---|
| .NET | 10.0 | Runtime |
| Aspire AppHost | — | Orchestration |
| PostgreSQL | — | Database (new) |
| YARP | — | API Gateway |
| Clean Architecture | — | Domain-driven design |
| Multiple databases | — | Per-service data isolation |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| TypeScript | — | Type safety |
| Vite | — | Build tool |
| Vitest | — | Unit testing |
| Playwright | ^1.49.0 | E2E testing |
| Axios | — | HTTP client |
| Chart.js | — | Data visualization |

## Project Structure Map

```
NorthStarET/
├── Src/
│   ├── Upgrade/                          # TRACK 1: Monolith Upgrade
│   │   ├── Backend/
│   │   │   ├── NorthStarET.AppHost/      # Aspire AppHost (YARP gateway)
│   │   │   ├── NorthStarET.ServiceDefaults/ # Service defaults
│   │   │   ├── NS4.WebAPI/              # Main WebAPI (33 controllers)
│   │   │   ├── NorthStar.Core/          # Core domain logic
│   │   │   ├── NorthStar.EF6/           # Entity Framework 6 data layer
│   │   │   ├── DataAccess/              # DataTable library
│   │   │   ├── EntityDto/               # DTOs
│   │   │   ├── IdentityServer/          # Auth server
│   │   │   ├── NorthStar.BatchProcessor/ # Batch processing
│   │   │   ├── NorthStar4.BatchPrint/   # Batch printing
│   │   │   ├── NorthStar.AutomatedRollover/ # Year-end rollover
│   │   │   ├── NS4.Parity.Tests/        # Parity tests
│   │   │   ├── NS4.WebAPI.Tests/        # API tests
│   │   │   └── WnvHtmlToPdfClient/      # PDF generation
│   │   └── UI/
│   │       └── NS4.React/               # React frontend (250 .tsx files)
│   │           └── src/pages/           # 30+ page components
│   │
│   ├── Migration/                        # TRACK 2: Microservices
│   │   ├── Backend/
│   │   │   ├── AppHost/                 # Aspire AppHost (7 services + YARP)
│   │   │   ├── Identity/               # Clean Arch: API, Application, Domain, Infrastructure
│   │   │   ├── StudentService/          # Student management
│   │   │   ├── AssessmentService/       # Assessment engine
│   │   │   ├── AssessmentManagement/    # Clean Arch: API, Application, Domain, Infrastructure
│   │   │   ├── InterventionService/     # Clean Arch: API, Application, Domain, Infrastructure
│   │   │   ├── SectionService/          # Clean Arch: API, Application, Domain, Infrastructure
│   │   │   ├── StaffManagement/         # Clean Arch: API, Application, Domain, Infrastructure
│   │   │   └── AutomatedRollover/       # Rollover service
│   │   └── UI/
│   │       └── NorthStar.MockServer/    # Mock server for UI dev
│   │
│   └── AIUpgrade/                        # AI-assisted upgrade (experimental)
│       ├── NS4.WebAPI/                  # AI-upgraded WebAPI
│       ├── NS4.Angular/                 # Legacy Angular frontend
│       ├── NS4.Client/                  # Legacy MVC client
│       └── (mirrors Upgrade backend)
│
├── .referenceSrc/                        # Reference copies
│   ├── OldNorthStar/                    # Original .NET 4.6 source
│   └── UpgradeItteration1/             # First upgrade iteration (prefixed with zz_)
│
├── NorthStarET.Student/                  # Symlink/subdir (empty)
├── Plan/                                 # Planning artifacts
├── PrePlan/                             # Pre-planning docs
├── docs/                                # Discovery & documentation
├── specs/                               # Specifications
├── tests/                               # Additional test files
└── tools/                               # Utility tools
```

## Architecture Pattern Analysis

### Upgrade Track
- **Pattern:** Modernized Monolith with Aspire orchestration
- **API:** 33 ASP.NET Core controllers (1:1 migration from .NET 4.8 controllers)
- **Data:** Entity Framework 6 (NOT migrated to EF Core) with SQL Server
- **Gateway:** YARP reverse proxy routing to single backend + React frontend
- **Auth:** IdentityServer project for JWT authentication
- **Batch:** Dedicated batch processing, printing, and rollover services
- **Frontend:** React 18/19 SPA replacing Angular.js

### Migration Track
- **Pattern:** Clean Architecture with microservices
- **Services:** 7 independent services behind YARP gateway:
  1. Identity API
  2. Student Service
  3. Assessment Service
  4. Assessment Management
  5. Intervention Service
  6. Section Service
  7. Staff Management
- **Data:** PostgreSQL with per-service databases (student-db, intervention-db, staff-db, section-db)
- **API Gateway:** YARP with path-based routing (`/identity/**`, `/students/**`, `/api/assessments/**`, etc.)
- **Each service:** 4-layer Clean Architecture (API → Application → Domain → Infrastructure)
- **Mock Server:** Dedicated mock server for frontend development

### Key Architectural Decisions
- **YARP gateway** provides unified API surface across both tracks
- **Aspire AppHost** manages service orchestration in both tracks
- **EF6 retained** in upgrade track (significant debt — not migrated to EF Core)
- **Per-service databases** in migration track with PostgreSQL
- **React frontend** shared between tracks, with visual parity testing against production

**Key files:**
- `Src/Upgrade/Backend/NorthStarET.AppHost/AppHost.cs` — Upgrade orchestration
- `Src/Migration/Backend/AppHost/Program.cs` — Migration orchestration (7 services + YARP)
- `Src/Upgrade/Backend/NS4.WebAPI/NS4.WebAPI.csproj` — .NET 10 + Aspire
- `Src/Upgrade/UI/NS4.React/NS4.React/package.json` — React frontend

## Git Activity Summary

| Metric | Value |
|---|---|
| Total Commits | 1,786 |
| Commits (6 months) | 1,786 |
| Commits (1 year) | 1,786 |
| First Commit | ~2025-08 |
| Last Commit | 2026-02-06 |
| Active Days | ~170 days |
| Contributors | 8 |

**Activity Status:** 🟢 VERY ACTIVE — Multiple commits daily, most recent Feb 6, 2026. Highest velocity repo in the portfolio.

### Contributors

| Contributor | Commits | Percentage | Role |
|---|---|---|---|
| copilot-swe-agent[bot] | 772 | 43% | AI agent (PRs, code review fixes) |
| Cris Weber | 761 | 43% | Primary developer |
| Tayrika | 76 | 4% | Developer (visual parity, bug fixes) |
| Sai Potluri | 72 | 4% | Developer (visual parity, features) |
| RM | 42 | 2% | Reviewer/Merger (PR merges) |
| saicharanreddypotluri | 39 | 2% | Developer (alt account) |
| Copilot | 22 | 1% | AI agent |
| cris weber | 2 | <1% | (alt email) |

**43% of commits are from copilot-swe-agent** — heavily AI-assisted development.

## Commit Categories

| Category | Count (est.) | Percentage |
|---|---|---|
| Features (feat:) | ~500 | 28% |
| Fixes (fix:) | ~400 | 22% |
| Merges | ~350 | 20% |
| Visual Parity | ~200 | 11% |
| Tests | ~150 | 8% |
| Refactor | ~100 | 6% |
| Docs/Chore | ~86 | 5% |

**Key commit patterns:**
- "feat({page}): Add {Page} page with production parity (#N)" — Feature implementation
- "fix({component}): achieve visual parity for {Component}" — Visual parity testing
- "Merge pull request #N from crisweber2600/{branch}" — PR-based workflow
- "bug{NNNN}" — Bug fix branches (JIRA-style numbering: 3219, 3223, 3224)

## Key Dependencies

### Backend
| Package | Purpose |
|---|---|
| Azure.Storage.Blobs | File storage |
| Microsoft.AspNetCore.Authentication.JwtBearer | Auth |
| Serilog.AspNetCore | Logging |
| Serilog.Sinks.OpenTelemetry | Telemetry |
| Swashbuckle.AspNetCore | API documentation |
| SharpZipLib | File compression |
| Entity Framework 6 | ORM (legacy) |

### Frontend
| Package | Purpose |
|---|---|
| @playwright/test | E2E testing |
| @testing-library/react | Component testing |
| vitest | Unit testing |
| axios | HTTP client |
| chart.js | Visualization |

## Integration Points

1. **OldNorthStar** — Source system being modernized (`.referenceSrc/OldNorthStar/`)
2. **SQL Server** — Upgrade track database
3. **PostgreSQL** — Migration track database
4. **Azure** — Blob Storage, App Insights, Table Storage
5. **SendGrid** — Email notifications
6. **Vzaar** — Video service integration
7. **FTP** — Data import/export
8. **PDF Server** — Report generation (WnvHtmlToPdfClient)
9. **YARP** — API gateway routing
10. **Aspire** — Service orchestration

## Technical Debt Signals

| Signal | Severity | Evidence |
|---|---|---|
| Entity Framework 6 in .NET 10 | HIGH | EF6 is legacy; should be EF Core for .NET 10 |
| Dual-track complexity | HIGH | Maintaining upgrade AND migration tracks multiplies effort |
| AIUpgrade directory | MEDIUM | Third track (AI-assisted) adds confusion; appears experimental |
| `.referenceSrc` copies | MEDIUM | Full source copies of old code in reference directories |
| 43% AI-generated commits | MEDIUM | Need audit for quality and consistency |
| 33 controllers (upgrade) | MEDIUM | Monolithic controller surface — not decomposed |
| zz_ prefixed files | LOW | Iteration 1 files prefixed with `zz_` to disable — messy |
| Bug branch naming (bug3219) | LOW | Suggests JIRA/tracking system integration |
| NorthStarET.Student subdir empty | LOW | Placeholder or abandoned integration |
| Visual parity approach | LOW | Testing against production screenshots — fragile |

## Risks and Unknowns

1. **EF6 → EF Core migration** — Critical path; EF6 on .NET 10 is unsupported territory
2. **Dual-track convergence** — Unclear how/when upgrade and migration tracks merge
3. **AI code quality** — 43% AI-generated code at scale needs systematic review
4. **3 source copies** — `.referenceSrc/OldNorthStar`, `.referenceSrc/UpgradeItteration1`, `Src/AIUpgrade` — which is authoritative?
5. **Database migration strategy** — SQL Server to PostgreSQL migration path not evident
6. **Test coverage gaps** — Only 9 standalone test files found despite 342 React components
7. **Batch processing** — Multiple batch services (print, processor, rollover) need modernization
8. **External service coupling** — Vzaar, FTP, PDF server, SendGrid all need review
9. **Scale** — 43K TS LOC + 25K C# LOC = significant codebase to maintain

## Confidence Score: 0.95

Very high confidence — comprehensive codebase with clear architecture, well-documented dual-track strategy, extensive git history. Structure is self-evident from AppHost files and project references.
