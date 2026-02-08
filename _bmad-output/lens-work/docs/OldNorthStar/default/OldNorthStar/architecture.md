---
repo: OldNorthStar
remote: https://github.com/crisweber2600/OldNorthStar.git
default_branch: master
generated_at: 2026-02-07T12:00:00Z
domain: OldNorthStar
service: default
generator: lens-sync
confidence: 0.94
---

# OldNorthStar — Architecture

## Overview

OldNorthStar is the **original production legacy LMS (Learning Management System)** — the system that NorthStarET is modernizing. It's a .NET Framework 4.8 monolithic web application managing K-12 educational assessments, student tracking, classroom reporting, intervention programs, team meetings, roster management, and staff administration.

This codebase represents over a decade of production development and serves as the **source of truth** against which the modernized NorthStarET system's "visual parity" is tested.

**Business Purpose:** Production K-12 LMS serving school districts with assessment management, student tracking, intervention programs, and classroom reporting. This is the legacy system being replaced by NorthStarET.

## Technology Stack

| Technology | Version | Purpose | Evidence |
|---|---|---|---|
| .NET Framework | 4.8 | Runtime (EOL for new features) | `NorthStar4_Framework46.sln` |
| ASP.NET WebAPI 2 | 5.x | REST API framework | `NS4.WebAPI/Controllers/` (33 controllers) |
| ASP.NET MVC | — | Web framework | `NS4.WebAPI/Views/`, `Global.asax` |
| Entity Framework 6 | — | ORM | `NorthStar.EF6/` (171 files) |
| SQL Server | Azure SQL | Primary database | Connection strings in `Web.config` |
| AngularJS | 1.x | Frontend framework (EOL Dec 2021) | `NS4.Angular/` |
| JavaScript | ES5/ES6 | Frontend scripts | Client-side code |
| jQuery | Various | DOM manipulation | `bower_components/` |
| IIS Express | — | Development web server | `.vs/` config |
| Azure Blob Storage | — | File storage | `AzureDownloadController` |
| Azure Table Storage | — | Structured data | Connection strings |
| Azure App Insights | — | Monitoring | Application Insights key |
| SendGrid | — | Email service | Configuration |
| Vzaar | — | Video hosting | `VideoController` |
| Bower | — | Package manager (DEPRECATED) | `bower_components/` |
| TFS (SCC) | — | Original source control | SCC metadata in `.csproj` files |

## Project Structure

```
OldNorthStar/
├── NorthStar4_Framework46.sln             # Solution file
├── NS4.WebAPI/                            # Main WebAPI (33 controllers)
│   ├── Controllers/                       # REST API controllers
│   │   ├── AssessmentController.cs
│   │   ├── AssessmentAvailabilityController.cs
│   │   ├── AuthController.cs
│   │   ├── AzureDownloadController.cs
│   │   ├── BenchmarkController.cs
│   │   ├── CalendarController.cs
│   │   ├── DataEntryController.cs
│   │   ├── DistrictSettingsController.cs
│   │   ├── ExportDataController.cs
│   │   ├── FileUploaderController.cs
│   │   ├── FilterOptionsController.cs
│   │   ├── InterventionDashboardController.cs
│   │   ├── InterventionGroupController.cs
│   │   ├── InterventionGroupDataEntryController.cs
│   │   ├── InterventonToolkitController.cs  # NOTE: typo in original
│   │   ├── LineGraphController.cs
│   │   ├── NavigationController.cs
│   │   ├── PasswordResetController.cs
│   │   ├── PersonalSettingsController.cs
│   │   ├── PrintController.cs
│   │   ├── ProbeController.cs
│   │   ├── RosterRolloverController.cs
│   │   ├── SectionController.cs
│   │   ├── SectionDataEntryController.cs
│   │   ├── SectionReportController.cs
│   │   ├── StackedBarGraphController.cs
│   │   ├── StaffController.cs
│   │   ├── StudentController.cs
│   │   ├── StudentDashboardController.cs
│   │   ├── TeamMeetingController.cs
│   │   ├── VideoController.cs
│   │   └── Infrastructure/NSBaseController.cs
│   ├── Areas/HelpPage/                    # ASP.NET Help Page
│   ├── Views/                             # Razor views
│   ├── Web.config                         # IIS configuration
│   └── Global.asax                        # App startup
├── NorthStar.EF6/                         # EF6 data layer (171 files)
│   ├── DistrictContext.cs                 # 60 DbSets
│   └── LoginContext.cs                    # 44 DbSets
├── Northstar.Core/                        # Core domain logic
├── EntityDto/                             # DTOs organized by domain
│   └── DTO/Admin/
│       ├── District/, InterventionGroup/, InterventionToolkit/
│       ├── Section/, Simple/, StackedBarGraph/
│       ├── Student/, TeamMeeting/
├── DataAccess/                            # Custom DataTable library (20 files)
│   ├── DataTable.cs
│   ├── DataTableBuilder.cs
│   └── CsvWriter.cs
├── IdentityServer/                        # Auth server
├── NS4.Angular/                           # AngularJS frontend
├── NS4.Client/                            # MVC client app
├── NorthStar.BatchProcessor/              # Batch processing
├── NorthStar4.BatchProcessor/             # Alternate batch processor
├── NorthStar4.BatchPrint/                 # Batch printing
├── NorthStar.AutomatedRollover/           # Year-end rollover
├── VzaarConsoleTest/                       # Vzaar API testing
├── wwwroot/                               # Static web assets
└── tmp/                                   # Temporary files (committed)
```

## Architecture Pattern

**Pattern:** Classic N-Tier Monolith (WebAPI + EF6 + SQL Server)

```
NS4.WebAPI (33 Controllers, 384 Endpoints)
    ↓
Infrastructure/FlowRequestContext.cs (request pipeline)
    ↓
NorthStar.EF6
    ├─ DistrictContext → SQL Server (60 entities)
    └─ LoginContext → SQL Server (44 entities)

NS4.Angular (AngularJS 1.x SPA)
NS4.Client (Bower-based client assets)
```

| Pattern Element | Description | Evidence |
|--|--|--|
| N-Tier | WebAPI → Core → EF6 → SQL Server | Project references in `.sln` |
| Base Controller | `NSBaseController` provides shared controller logic | `Infrastructure/NSBaseController.cs` |
| DTO Layer | Separate `EntityDto` project, Input/Output pairs | `EntityDto/DTO/Admin/` |
| Custom DataAccess | Bespoke `DataTable` library for tabular data | `DataAccess/DataTable.cs` |
| Batch Processing | 3 separate batch/background projects | `BatchProcessor`, `BatchPrint`, `AutomatedRollover` |

### Anti-Patterns

| Anti-Pattern | Evidence | Impact |
|---|---|---|
| No service layer | Controllers likely call EF6 directly | Poor testability |
| No DI container | Pre-.NET Core — no built-in DI | Tight coupling |
| Bower package manager | Deprecated since 2017 | Security risk |
| AngularJS 1.x | EOL since December 2021 | Known CVEs |
| Dual client projects | `NS4.Angular` + `NS4.Client` | Fragmented frontend |
| Two batch processors | Redundant projects | Maintenance burden |
| `tmp/` committed | Temporary files in source control | Repo clutter |

## Key Design Decisions

1. **WebAPI 2 REST API** — Classic ASP.NET WebAPI with attribute routing.
2. **EF6 code-first** — 171 model/mapping files across 2 DbContexts.
3. **AngularJS SPA** — Single-page app served via ASP.NET hosting.
4. **Separate IdentityServer** — Dedicated auth project.
5. **Custom DataTable** — Bespoke tabular data library instead of System.Data.
6. **Domain-organized DTOs** — DTOs grouped by business domain (Student, Section, etc.).

## Domain Decomposition (15 Domains)

| # | Domain | Controllers | Purpose |
|---|---|---|---|
| 1 | Assessment | Assessment, AssessmentAvailability | Assessment management |
| 2 | Benchmark | Benchmark | Benchmark testing |
| 3 | Calendar | Calendar | Academic calendar |
| 4 | Classroom | SectionReport, StackedBarGraph, LineGraph | Reporting/charts |
| 5 | Data Entry | DataEntry, SectionDataEntry, InterventionGroupDataEntry | Data input forms |
| 6 | District | DistrictSettings, ExportData | Admin settings |
| 7 | Intervention | InterventionDashboard, InterventionGroup, InterventonToolkit | Intervention programs |
| 8 | Navigation | Navigation | Menu/navigation |
| 9 | Probe | Probe | Probe assessments |
| 10 | Print | Print | Report printing |
| 11 | Rollover | RosterRollover | Year-end rollover |
| 12 | Staff | Staff | Staff management |
| 13 | Student | Student, StudentDashboard | Student records |
| 14 | Team Meeting | TeamMeeting | RTI meetings |
| 15 | Auth/Files | Auth, PasswordReset, FileUploader, AzureDownload, Video | Security, files, video |

## Security Considerations

- **.NET Framework 4.8** — No longer receiving feature updates
- **AngularJS 1.x EOL** — Known XSS vulnerabilities
- **Bower dependencies** — Unaudited, deprecated package manager
- **No modern auth** — No JWT/OAuth2 evidence; uses IdentityServer (custom)
- **Web.config secrets** — Connection strings likely contain credentials
- **No CORS visible** — Potential cross-origin attack surface
- **FERPA/COPPA** — K-12 student data requires regulatory compliance

## Technical Debt

| Signal | Severity | Evidence |
|---|---|---|
| .NET Framework 4.8 | CRITICAL | Runtime receiving no new features |
| AngularJS 1.x EOL | CRITICAL | Known security vulnerabilities |
| Entity Framework 6 (171 files) | HIGH | Massive legacy data model |
| 56K LOC C# + 123K LOC JS | HIGH | Large codebase to maintain |
| No tests visible | HIGH | Zero test projects in solution |
| Bower deprecated | MEDIUM | Unaudited packages |
| Dual batch processors | MEDIUM | Redundant projects |
| Custom DataTable library | MEDIUM | Bespoke library instead of standard |
| TFS metadata in `.csproj` | LOW | Source control artifacts embedded |
| Typo: "InterventonToolkit" | LOW | Carried through to NorthStarET |
| `tmp/` directory committed | LOW | Temp files in source control |

## Lineage

OldNorthStar is the **direct ancestor** of NorthStarET:
- Same 33 controllers → 33 controllers in NorthStarET Upgrade
- Same 104 entities → 104 entities in NorthStarET Upgrade EF6
- Same 384 endpoints → 385 endpoints in NorthStarET Upgrade
- NorthStarET Upgrade is a direct .NET 10 port of this codebase
- NorthStarET Migration decomposes these into 7 microservices (17% complete)

## Risks

1. **Deployed in production?** — If still deployed, AngularJS security vulnerabilities are active
2. **Database schema** — EF6 models exist but SQL Server schema/migrations not in repo
3. **Configuration secrets** — `Web.config` likely contains connection strings and API keys
4. **Missing deployment process** — No CI/CD, Dockerfile, or deployment scripts
5. **External service contracts** — Vzaar, FTP, PDF server integrations may be brittle
6. **Multi-tenancy** — District-based patterns suggest multi-tenancy; implementation unclear

## Related Documentation

- [API Surface](api-surface.md) — 384 endpoints across 33+ controllers
- [Data Model](data-model.md) — 104 entities in 2 EF6 DbContexts
- [Onboarding](onboarding.md) — Setup guide (legacy)
