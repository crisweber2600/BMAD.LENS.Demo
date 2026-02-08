# Discovery Report: OldNorthStar

---
repo: OldNorthStar
remote: https://github.com/crisweber2600/OldNorthStar.git
branch: master
commit: a77f66e25f0cc7953b5791bbbd211a2aba2cecba
timestamp: 2026-02-07T12:00:00Z
domain: OldNorthStar
service: default
scanner: SCOUT DS (Deep Brownfield Discovery)
confidence: 0.94
---

## Overview / Business Purpose

OldNorthStar is the **original production legacy LMS (Learning Management System)** — the system that NorthStarET is modernizing. It's a .NET Framework 4.8 monolithic web application managing K-12 educational assessments, student tracking, classroom reporting, intervention programs, team meetings, roster management, and staff administration. This is the "source of truth" being upgraded/migrated.

The codebase is built on classic ASP.NET WebAPI 2 with AngularJS frontend, Entity Framework 6, SQL Server, and Azure services. It represents over a decade of production development and is the baseline against which the modernized system's "visual parity" is tested.

## Technology Stack

| Technology | Version | Purpose |
|---|---|---|
| .NET Framework | 4.8 | Runtime |
| ASP.NET WebAPI 2 | — | REST API framework |
| ASP.NET MVC | — | Web framework |
| Entity Framework 6 | — | ORM |
| SQL Server | — | Primary database (via ConnectionStrings) |
| AngularJS | 1.x | Frontend framework (NS4.Angular) |
| JavaScript | ES5/ES6 | Frontend scripts |
| IIS Express | — | Development web server |
| Azure Blob Storage | — | File storage |
| Azure Table Storage | — | Table storage |
| Azure Application Insights | — | Monitoring |
| SendGrid | — | Email service |
| Vzaar | — | Video service |
| Source Control (TFS) | — | SCC metadata in `.csproj` files |

## Project Structure Map

```
OldNorthStar/
├── NorthStar4_Framework46.sln           # Solution file (.NET Framework 4.6/4.8)
├── NS4.WebAPI/                          # Main WebAPI (33 controllers)
│   ├── Controllers/                     # 33 controller files
│   │   ├── AssessmentAvailabilityController.cs
│   │   ├── AssessmentController.cs
│   │   ├── AuthController.cs
│   │   ├── AzureDownloadController.cs
│   │   ├── BenchmarkController.cs
│   │   ├── CalendarController.cs
│   │   ├── DataEntryController.cs
│   │   ├── DistrictSettingsController.cs
│   │   ├── ExportDataController.cs
│   │   ├── FileUploaderController.cs
│   │   ├── FilterOptionsController.cs
│   │   ├── HomeController.cs
│   │   ├── ImportStateTestDataController.cs
│   │   ├── InterventionDashboardController.cs
│   │   ├── InterventionGroupController.cs
│   │   ├── InterventionGroupDataEntryController.cs
│   │   ├── InterventonToolkitController.cs  ← typo in original
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
│   ├── Areas/HelpPage/                  # ASP.NET Help Page area
│   ├── Views/                           # Razor views
│   ├── Web.config                       # IIS configuration
│   └── Global.asax                      # App startup
├── NorthStar.EF6/                       # Entity Framework 6 data layer (171 files)
├── Northstar.Core/                      # Core domain logic
├── EntityDto/                           # DTOs organized by domain
│   └── DTO/Admin/
│       ├── District/                    # District management DTOs
│       ├── InterventionGroup/           # Intervention group DTOs
│       ├── InterventionToolkit/         # Toolkit DTOs
│       ├── Section/                     # Section/classroom DTOs
│       ├── Simple/                      # Common DTOs
│       ├── StackedBarGraph/            # Chart DTOs
│       ├── Student/                     # Student DTOs
│       └── TeamMeeting/               # Team meeting DTOs
├── DataAccess/                          # Custom DataTable library
│   ├── DataTable.cs
│   ├── DataTableBuilder.cs
│   ├── CsvWriter.cs
│   └── (20 supporting files)
├── IdentityServer/                      # Authentication server
├── NS4.Angular/                         # AngularJS frontend
│   └── (hosted in ASP.NET project)
├── NS4.Client/                          # MVC client app
├── NorthStar.BatchProcessor/           # Batch processing service
├── NorthStar4.BatchProcessor/          # Alternate batch processor
├── NorthStar4.BatchPrint/              # Batch print service
├── NorthStar.AutomatedRollover/        # Year-end rollover automation
├── VzaarConsoleTest/                    # Vzaar video API testing
├── wwwroot/                            # Static web assets
└── tmp/                                # Temporary files
```

## Architecture Pattern Analysis

- **Pattern:** Classic N-Tier Monolith (MVC + WebAPI + Data Layer)
- **API:** 35 ASP.NET WebAPI 2 controllers (REST endpoints)
- **Data Access:** Entity Framework 6 with 171 model/mapping files — large relational schema
- **DTO Layer:** Separate `EntityDto` project with Input/Output DTO pattern per domain area
- **Custom DataAccess:** Bespoke `DataTable` library for tabular data manipulation (20 files)
- **Auth:** Separate IdentityServer project
- **Batch Processing:** 3 separate batch/background processing projects
- **Frontend:** AngularJS (v1.x) served from ASP.NET
- **Base Controller:** `NSBaseController` provides common controller functionality

**Domain Areas (by controller decomposition):**
1. **Assessment** — Assessment management, availability, data entry
2. **Benchmark** — Benchmark tracking and reporting
3. **Calendar** — Academic calendar management
4. **Classroom** — Section reports, stacked bar graphs, line graphs
5. **District** — District settings, export data
6. **Intervention** — Dashboard, groups, data entry, toolkit
7. **Navigation** — Menu/navigation management
8. **Probe** — Probe assessments
9. **Print** — Batch printing
10. **Rollover** — Roster/year-end rollover
11. **Staff** — Staff management
12. **Student** — Student records, dashboard
13. **Team Meeting** — Collaborative team meetings
14. **Auth/Security** — Authentication, password reset, personal settings
15. **File/Video** — File upload, Azure download, Vzaar video

**Key files:**
- `NorthStar4_Framework46.sln` — Solution file
- `NS4.WebAPI/NS4.WebAPI.csproj` — Target framework `.NET 4.8`
- `NS4.WebAPI/Web.config` — IIS configuration
- `NS4.WebAPI/Infrastructure/NSBaseController.cs` — Base controller
- `NorthStar.EF6/` — 171 EF6 files (entity models, mappings, context)

## Git Activity Summary

| Metric | Value |
|---|---|
| Total Commits | 1 |
| Commits (6 months) | 1 |
| First Commit | 2026-01-31 |
| Last Commit | 2026-01-31 |
| Active Days | 1 day |
| Contributors | 1 |

**Activity Status:** ⚫ ARCHIVE — Single "init" commit on Jan 31, 2026. This is a snapshot/archive of the production legacy system, not actively developed.

### Contributors

| Contributor | Commits | Role |
|---|---|---|
| Cris Weber | 1 | Repository creator |

**Note:** The actual development history of this codebase predates this repository. It was imported as a single "init" commit — the true commit history exists in a prior source control system (likely TFS, based on SCC metadata in `.csproj` files).

## Commit Categories

| Category | Count | Percentage |
|---|---|---|
| Initial Import | 1 | 100% |

No meaningful commit categorization possible — single initial import commit.

## Key Dependencies

### NuGet Packages (from .csproj SCC indicators)
| Package | Purpose |
|---|---|
| Microsoft.Net.Compilers | Roslyn compiler |
| Microsoft.CodeDom.Providers.DotNetCompilerPlatform | Runtime compilation |
| Entity Framework 6 | ORM |
| Azure Storage SDK | Blob/Table storage |
| SendGrid | Email |
| Vzaar SDK | Video hosting |

### Infrastructure
| Service | Purpose |
|---|---|
| IIS | Web server |
| SQL Server | Database |
| Azure Blob Storage | Document/file storage |
| Azure Table Storage | Structured data |
| Azure Application Insights | Monitoring |
| FTP Server | Data import/export |
| PDF Server | Report generation |

## Integration Points

1. **NorthStarET Upgrade Track** — Direct source for upgrade migration (controllers mirrored 1:1)
2. **NorthStarET Migration Track** — Source for domain decomposition into microservices
3. **SQL Server** — Primary database (likely on-premises or Azure SQL)
4. **Azure Blob Storage** — File storage for documents, exports
5. **Azure Table Storage** — Structured data storage
6. **SendGrid** — Email service
7. **Vzaar** — Video hosting/streaming
8. **FTP** — External data import/export
9. **PDF Server** — Report generation
10. **Identity Server** — Authentication/authorization

## Technical Debt Signals

| Signal | Severity | Evidence |
|---|---|---|
| .NET Framework 4.8 | CRITICAL | End-of-life runtime; no future patches |
| AngularJS 1.x | CRITICAL | End-of-life frontend framework |
| Entity Framework 6 | HIGH | Legacy ORM with 171 model files |
| 56K LOC C# + 123K LOC JS | HIGH | Massive codebase to maintain |
| No tests visible | HIGH | No test projects in the solution |
| TFS metadata in csproj | MEDIUM | Source control artifacts embedded in project files |
| Typo: "InterventonToolkit" | LOW | Misspelling carried through to NorthStarET upgrade |
| Dual batch processors | MEDIUM | `NorthStar.BatchProcessor` AND `NorthStar4.BatchProcessor` |
| `tmp/` directory | LOW | Temporary files committed |
| Custom DataTable library | MEDIUM | Bespoke data manipulation instead of standard libraries |
| Single init commit | LOW | No preservation of development history |

## Risks and Unknowns

1. **Database schema not visible** — EF6 model files exist but the actual SQL Server schema is not in the repo (no migration scripts)
2. **Configuration secrets** — `Web.config` files likely contain connection strings and API keys
3. **Deployment process unknown** — No CI/CD, Dockerfile, or deployment scripts
4. **External service contracts** — Vzaar, PDF server, FTP server integrations may be brittle
5. **Data volume** — No indication of database size or performance characteristics
6. **Multi-tenant** — District-based patterns suggest multi-tenancy but implementation details unclear
7. **Regulatory compliance** — K-12 student data implies FERPA/COPPA requirements
8. **Frontend state** — AngularJS state management approach and routing unknown
9. **Test coverage** — No test projects visible; production reliability depends on manual testing

## Confidence Score: 0.94

Very high confidence — this is a well-structured legacy .NET Framework monolith with clear patterns. The single-commit import and lack of git history are understood as intentional archiving. The controller surface, EF6 model count, and project structure provide comprehensive architectural understanding.
