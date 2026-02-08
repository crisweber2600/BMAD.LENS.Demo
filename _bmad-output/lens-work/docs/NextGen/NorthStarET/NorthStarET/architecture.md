---
repo: NorthStarET
remote: https://github.com/crisweber2600/NorthStarET.git
default_branch: main
generated_at: 2026-02-07T12:00:00Z
domain: NextGen
service: NorthStarET
generator: lens-sync
confidence: 0.95
---

# NorthStarET — Architecture

## Overview

NorthStarET is a **large-scale LMS (Learning Management System) modernization project** migrating from .NET Framework 4.6/4.8 to .NET 10. The system manages K-12 educational assessments, student tracking, intervention programs, team meetings, section reports, and classroom dashboards for school districts.

The project follows a **dual-track strategy:**
1. **Upgrade Track** — Monolith upgrade (`.NET 4.8 → .NET 10`) with new React 18 frontend, Aspire orchestration, and YARP API gateway
2. **Migration Track** — Clean Architecture microservices decomposition with PostgreSQL and dedicated service boundaries

This is the **largest repository in the portfolio** with 1,786 commits, 8 contributors, 449 total endpoints, and 104 entities.

**Business Purpose:** Modernize a production K-12 LMS from legacy .NET Framework to cloud-native .NET 10, decomposing a monolith into domain-driven microservices while maintaining feature parity with the production system.

## Technology Stack

### Upgrade Track (Monolith Modernization)

| Technology | Version | Purpose | Evidence |
|---|---|---|---|
| .NET | 10.0 | Runtime | `NS4.WebAPI.csproj` |
| ASP.NET Core WebAPI | 10.0 | Backend API | 33 controllers in `NS4.WebAPI/Controllers/` |
| .NET Aspire | 13.1 | Orchestration | `NorthStarET.AppHost/AppHost.cs` |
| YARP | Aspire.Hosting.Yarp | API Gateway | AppHost YARP route config |
| Entity Framework 6 | Compat mode | ORM (LEGACY — not EF Core) | `NorthStar.EF6/` |
| SQL Server | Azure SQL | Database | AppHost `LoginConnection` parameter |
| React | 18/19 | Frontend | `UI/NS4.React/` |
| TypeScript | — | Frontend language | `NS4.React/package.json` |
| Vite | — | Build tooling | `NS4.React/package.json` |
| Serilog | — | Structured logging | `Serilog.AspNetCore` |
| Azure Blob Storage | — | File storage | AppHost env vars |
| Azure Application Insights | — | Monitoring/OpenTelemetry | AppHost config |
| SendGrid | — | Email service | AppHost `SendGridApiKey` |
| Vzaar | — | Video hosting | AppHost `VzaarToken` + `VzaarSecret` |

### Migration Track (Microservices)

| Technology | Version | Purpose | Evidence |
|---|---|---|---|
| .NET | 10.0 | Runtime | Multiple `.csproj` files |
| .NET Aspire | 13.1 | Orchestration | `Migration/Backend/AppHost/Program.cs` |
| PostgreSQL | Aspire-managed | Database (per-service) | `AddPostgres("postgres")` |
| YARP | Aspire.Hosting.Yarp | API Gateway | YARP route-based decomposition |
| Clean Architecture | — | Domain-driven design | Domain/Application/Infrastructure layers |
| Entra ID (Azure AD) | — | Authentication | `EntraAuthController` |
| React | 19 | Frontend | `Migration/UI/web/` |
| Mock Server | — | Dev stubs | `UI/NorthStar.MockServer/` |

### Frontend Stack

| Technology | Version | Purpose | Evidence |
|---|---|---|---|
| React | 19 | UI framework | `package.json` |
| TypeScript | — | Type safety | `tsconfig.json` |
| Vite | — | Build tool | `vite.config.ts` |
| Vitest | — | Unit testing | `package.json` |
| Playwright | ^1.49.0 | E2E testing | `package.json` |
| Axios | — | HTTP client | `package.json` |
| Chart.js | — | Data visualization | `package.json` |

## Project Structure

```
NorthStarET/
├── Src/
│   ├── Upgrade/                            # ── TRACK 1: Monolith Upgrade ──
│   │   ├── Backend/
│   │   │   ├── NorthStarET.AppHost/        # Aspire AppHost (YARP gateway)
│   │   │   ├── NorthStarET.ServiceDefaults/
│   │   │   ├── NS4.WebAPI/                 # Main API (33 controllers, 385 endpoints)
│   │   │   ├── NorthStar.Core/             # Core domain logic
│   │   │   ├── NorthStar.EF6/             # EF6 data layer (104 entities)
│   │   │   ├── DataAccess/                 # Custom DataTable library
│   │   │   ├── EntityDto/                  # DTOs by domain
│   │   │   ├── IdentityServer/             # Auth server
│   │   │   ├── NorthStar.BatchProcessor/   # Batch processing
│   │   │   ├── NorthStar4.BatchPrint/      # Batch printing
│   │   │   ├── NorthStar.AutomatedRollover/ # Year-end rollover
│   │   │   ├── NS4.Parity.Tests/           # Visual parity tests
│   │   │   ├── NS4.WebAPI.Tests/           # API tests
│   │   │   └── WnvHtmlToPdfClient/         # PDF generation
│   │   └── UI/
│   │       └── NS4.React/                  # React frontend (250+ .tsx files, 342 components)
│   │
│   ├── Migration/                          # ── TRACK 2: Microservices ──
│   │   ├── Backend/
│   │   │   ├── AppHost/                    # Aspire AppHost (7 services + YARP)
│   │   │   ├── Identity/                   # Identity.API (Clean Arch, 6 entities)
│   │   │   ├── StudentService/             # Student management (6 entities)
│   │   │   ├── AssessmentService/          # Assessment engine (3 entities)
│   │   │   ├── AssessmentManagement/       # Benchmark management (1 entity)
│   │   │   ├── InterventionService/        # Interventions (4 entities)
│   │   │   ├── SectionService/             # Sections & rollover (3 entities)
│   │   │   ├── StaffManagement/            # Staff admin (4 entities)
│   │   │   └── AutomatedRollover/          # Rollover service
│   │   └── UI/
│   │       └── NorthStar.MockServer/       # Mock server for UI dev
│   │
│   └── AIUpgrade/                          # Experimental AI-assisted upgrade
│       ├── NS4.WebAPI/                     # AI-upgraded WebAPI
│       └── NS4.Angular/                    # Legacy Angular frontend
│
├── .referenceSrc/                          # Reference copies
│   ├── OldNorthStar/                       # Original .NET 4.6 source
│   └── UpgradeItteration1/                # First upgrade iteration (zz_ prefixed)
│
├── Plan/ & PrePlan/                        # Planning artifacts
├── docs/                                   # Discovery & documentation
├── specs/                                  # Specifications
└── tests/                                  # Additional test files
```

## Architecture Pattern

### Upgrade Track: Modernized Monolith with Aspire

```
YARP Gateway (port 8080)
  ↓ /api/{**catch-all}
NS4.WebAPI (port 5000)  →  NorthStar.EF6  →  SQL Server
  ↓ 33 Controllers           ↓ DistrictContext (60 entities)
  ↓                           ↓ LoginContext (44 entities)
React UI (port 3000)
```

**Evidence:** `Src/Upgrade/Backend/NorthStarET.AppHost/AppHost.cs`

### Migration Track: Clean Architecture Microservices

```
YARP Gateway (port 8080)
  ├─ /identity/*       → Identity.API
  ├─ /students/*       → StudentService
  ├─ /api/assessments/* → AssessmentService
  ├─ /api/benchmarks/*  → AssessmentManagement
  ├─ /api/intervention-*/ → InterventionService
  ├─ /api/staff/*      → StaffManagement
  ├─ /api/sections/*   → SectionService
  └─ /api/students/*   → MockServer (dev-only)

PostgreSQL (per-service databases)
  ├─ student-db
  ├─ intervention-db
  ├─ staff-db
  └─ section-db

React UI (port 3100)
```

**Evidence:** `Src/Migration/Backend/AppHost/Program.cs`

Each microservice follows Clean Architecture:
```
API/ → Application/ → Domain/ → Infrastructure/
  Controllers    Services    Entities    DbContext + Migrations
  DTOs           Interfaces  ValueObjects Repositories
```

## Key Design Decisions

1. **Dual-track strategy** — Run upgrade and migration in parallel to de-risk modernization. Upgrade provides immediate .NET 10 runtime; migration decomposes for long-term scalability.
2. **YARP API gateway** — Unified API surface across both tracks at port 8080.
3. **EF6 retained in upgrade** — Pragmatic decision to avoid simultaneous ORM + runtime migration, at the cost of carrying legacy ORM debt.
4. **Per-service databases** — Migration track uses PostgreSQL with separate databases per microservice (student-db, intervention-db, etc.).
5. **Visual parity testing** — React frontend tested against production screenshots to ensure feature parity with legacy Angular UI.
6. **Reference source preservation** — `.referenceSrc/OldNorthStar/` keeps original code for comparison during migration.

## Dependencies

### Upgrade Track

| Category | Dependency | Notes |
|---|---|---|
| ORM | Entity Framework 6 | .NET 10 compatibility mode (legacy) |
| Gateway | YARP | Aspire.Hosting.Yarp |
| Storage | Azure Blob/Table Storage | Connection string-based |
| Telemetry | Application Insights | OpenTelemetry export |
| Video | Vzaar API | Token + Secret authentication |
| Email | SendGrid | API key authentication |
| PDF | Custom PDF server | FTP-based delivery |
| Data Import | FTP | Bulk data import/export |
| Logging | Serilog | Structured logging + OpenTelemetry sink |

### Migration Track

| Category | Dependency | Notes |
|---|---|---|
| Database | PostgreSQL | Per-service databases via Aspire |
| Gateway | YARP | Route-based service decomposition |
| Auth | Entra ID (Azure AD) | `EntraAuthController` |
| Mock | MockServer | Development-time API stubs |
| Orchestration | Aspire | Service discovery + health checks |

## Security Considerations

- **18+ secrets** in AppHost configuration — VzaarToken, SendGridApiKey, PdfPassword, FtpPassword, etc.
- **EF6 on .NET 10** — Compatibility layer may have unpatched CVEs
- **FTP integration** — Insecure file transfer protocol still in use
- **Entra ID** — Migration track properly uses Azure AD for auth
- **FERPA/COPPA** — K-12 student data implies regulatory compliance requirements
- **Need:** Azure Key Vault integration for secret management

## Technical Debt

| Signal | Severity | Evidence |
|---|---|---|
| Entity Framework 6 on .NET 10 | CRITICAL | Legacy ORM in compatibility mode; unsupported |
| Dual-track strategy | HIGH | Maintaining 2 backends simultaneously (802 C# files total) |
| 18+ hardcoded secrets | HIGH | `AddParameter(secret: true)` in AppHost.cs |
| FTP dependency | MEDIUM | Insecure legacy file transfer |
| 385 endpoints in monolith | MEDIUM | Extremely large API surface for single service |
| Migration only 17% complete | HIGH | 64 of ~385 endpoints migrated to microservices |
| 43% AI-generated commits | MEDIUM | 772 commits from copilot-swe-agent need quality audit |
| AIUpgrade directory | LOW | Third experimental track adds confusion |
| `.referenceSrc` copies | LOW | Full source copies of legacy code in repo |
| `zz_` prefixed files | LOW | Iteration 1 files disabled by prefix |

## Risks

1. **EF6 → EF Core migration** — Critical path; EF6 on .NET 10 is unsupported territory
2. **Dual-track convergence** — Unclear how/when upgrade and migration tracks merge
3. **AI code quality** — 43% of 1,786 commits from AI agents at scale needs systematic audit
4. **Database migration** — SQL Server to PostgreSQL path not fully established
5. **Test coverage gaps** — Only sparse standalone test files for 342 React components
6. **External service coupling** — Vzaar, FTP, PDF server, SendGrid all need modernization
7. **Scale** — 43K TS LOC + 25K C# LOC = significant codebase

## Related Documentation

- [API Surface](api-surface.md) — 449 endpoints across both tracks
- [Data Model](data-model.md) — 104 + 27 entities
- [Integration Map](integration-map.md) — External service dependencies
- [Onboarding](onboarding.md) — Setup for both tracks
