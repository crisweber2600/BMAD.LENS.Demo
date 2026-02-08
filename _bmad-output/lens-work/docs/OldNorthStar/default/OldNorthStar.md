---
repo: OldNorthStar
remote: https://github.com/crisweber2600/OldNorthStar.git
default_branch: master
source_commit: a77f66e25f0cc7953b5791bbbd211a2aba2cecba
generated_at: "2026-02-07T00:00:00Z"
layer: repo
domain: OldNorthStar
service: default
generator: scout-auto-pipeline
---

# OldNorthStar — Canonical Documentation

## 1. Overview

OldNorthStar is the **legacy reference architecture** — a single-commit archive of the original .NET Framework 4.8 Learning Management System. It serves as the baseline for the NorthStarET modernization effort, providing the controller structure, data model, and business logic that the Upgrade and Migration tracks are modernizing.

**Key facts:**
- .NET Framework 4.8, Entity Framework 6, SQL Server, AngularJS 1.x, IdentityServer
- Single commit (full codebase snapshot), 12,582 files, ~13,225 C# LOC
- 36 controllers, 3 batch processors
- No tests, no CI/CD, no git history (single commit archive)
- **Status: ARCHIVE — read-only reference**

**Role in domain:** OldNorthStar is the **source of truth** for legacy business logic. During NorthStarET development, it is consulted for:
- Controller-to-controller feature parity validation
- Data model reference for Migration database design
- Business rule documentation (embedded in controller code)
- Batch processing logic for scheduled jobs

## 2. Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Runtime** | .NET Framework | 4.8 |
| **Web Framework** | ASP.NET MVC / Web API | 5.x |
| **ORM** | Entity Framework | 6 |
| **Database** | SQL Server | Legacy |
| **Frontend** | AngularJS | 1.x |
| **Identity** | IdentityServer | 3.x (estimated) |
| **Package Manager** | NuGet + bower | Legacy |
| **Build** | MSBuild | Legacy |

## 3. Architecture

### Code Organization

```
OldNorthStar/
├── Controllers/            # 36 MVC/API controllers
├── Models/                 # View models and DTOs
├── Data/                   # EF6 DbContext and migrations
├── Services/               # Business logic services
├── BatchProcessors/        # 3 scheduled job processors
├── Views/                  # MVC Razor views
├── Scripts/                # AngularJS 1.x frontend
│   └── bower_components/   # Legacy package manager
├── Identity/               # IdentityServer configuration
└── App_Start/              # Legacy ASP.NET startup
```

### Key Patterns

| Pattern | Implementation | Quality |
|---------|---------------|---------|
| **MVC + Web API** | Controllers serve both views and API endpoints | ⚠️ Mixed concerns |
| **EF6 Code First** | Database-first migrations with EF6 | ⚠️ Legacy ORM |
| **AngularJS 1.x** | Client-side SPA framework | 🔴 EOL — no longer maintained |
| **IdentityServer** | Custom OAuth/OIDC provider | ⚠️ Legacy auth |
| **Batch Processing** | 3 background job processors | ⚠️ No modern job scheduler |
| **Monolith** | Single deployable, single database | Standard for era |

## 4. API Surface

### Controllers (36 total)

| Domain | Controllers |
|--------|------------|
| **Assessment** | `AssessmentController`, `AssessmentAvailabilityController`, `BenchmarkController` |
| **Student** | `StudentController`, `StudentDashboardController` |
| **Staff** | `StaffController` |
| **Section** | `SectionController`, `SectionDataEntryController`, `SectionReportController` |
| **Intervention** | `InterventionDashboardController`, `InterventionGroupController`, `InterventionGroupDataEntryController`, `InterventionToolkitController` |
| **Data** | `DataEntryController`, `ExportDataController`, `ImportStateTestDataController` |
| **Auth** | `AuthController`, `PasswordResetController`, `AccountController` |
| **Navigation** | `NavigationController`, `FilterOptionsController`, `PersonalSettingsController`, `DistrictSettingsController` |
| **Reporting** | `LineGraphController`, `StackedBarGraphController`, `PrintController`, `CalendarController` |
| **Admin** | `AdminController`, `ManageController` |
| **Other** | `HomeController`, `ProbeController`, `HelpController`, `TeamMeetingController`, `VideoController`, `RosterRolloverController`, `FileUploaderController`, `AzureDownloadController` |

### Batch Processors (3)

| Processor | Purpose |
|-----------|---------|
| Batch Processor 1 | Scheduled data aggregation |
| Batch Processor 2 | Report generation |
| Batch Processor 3 | Data import/export |

## 5. Data Models

Legacy SQL Server database with EF6. Key entity domains:

| Domain | Entities (estimated) | Notes |
|--------|---------------------|-------|
| **Student** | Student, StudentAttribute, StudentDemographic | Core student identity |
| **Assessment** | Assessment, AssessmentResult, Benchmark, BenchmarkScore | Assessment tracking |
| **Intervention** | InterventionGroup, InterventionStudent, InterventionAttendance | Intervention management |
| **Staff** | Staff, StaffRole, StaffSettings | Teacher/admin management |
| **Section** | Section, SectionRoster, SectionScoreEntry | Class section management |
| **Calendar** | Calendar, CalendarEvent | Academic calendar |
| **District** | District, DistrictSettings, School | Multi-tenant district/school hierarchy |
| **Auth** | User, Role, Token | IdentityServer user management |

**Total: ~36 entity types** (inferred from controller count and domain coverage)

## 6. Integration Points

| Integration | Mechanism | Status |
|------------|-----------|--------|
| **SQL Server** | EF6 | Legacy — active in production |
| **Azure Blob Storage** | Azure SDK | File uploads, downloads |
| **NorthStarET** | Reference only | Source for modernization |
| **IdentityServer** | OAuth 2.0 / OIDC | Legacy identity provider |

## 7. Build & Deploy

### Build

```bash
# MSBuild (Visual Studio)
msbuild OldNorthStar.sln /p:Configuration=Release
```

### Deploy

Legacy IIS deployment — no containerization, no Aspire, no modern CI/CD.

### Prerequisites

- Visual Studio 2019+ (for .NET Framework 4.8)
- SQL Server (LocalDB or full instance)
- IIS or IIS Express

## 8. Configuration

| File | Purpose |
|------|---------|
| `web.config` | ASP.NET Framework configuration |
| `app.config` | Application settings |
| `connectionStrings` | SQL Server connection strings |

### Key Settings

- SQL Server connection string
- Azure Blob Storage credentials
- IdentityServer configuration
- SMTP settings (if email features exist)

## 9. Testing

### Test Coverage

🔴 **No tests exist.** Zero test projects in the repository.

This is expected for a legacy archive — OldNorthStar predates the team's testing practices. The `NS4.Parity.Tests` project in NorthStarET validates feature parity against OldNorthStar's behavior.

## 10. Known Issues & Technical Debt

| # | Issue | Severity | Impact | Recommendation |
|---|-------|----------|--------|----------------|
| 1 | **No git history** | ⚠️ MEDIUM | Single commit — no blame, no diff, no evolution tracking | Accept as archive limitation |
| 2 | **No tests** | ⚠️ MEDIUM | Business rules embedded in controllers without test coverage | Reference only — add tests in NorthStarET, not here |
| 3 | **EOL technologies** | ⚠️ MEDIUM | .NET Fx 4.8, AngularJS 1.x, EF6 — approaching/past EOL | Modernization via NorthStarET is the solution |
| 4 | **bower_components** | LOW | Dead package manager | Legacy artifact — no action needed |
| 5 | **No CI/CD** | LOW | No pipeline — manual build and deploy | Archive — no changes expected |
| 6 | **IdentityServer 3.x** | LOW | Deprecated identity framework | Being replaced by Entra ID + custom JWT in NorthStarET |

## 11. BMAD Readiness

### Assessment: GRAY (Archive — Not Applicable)

OldNorthStar is a **read-only reference archive**. BMAD lifecycle phases do not apply. It serves as input to NorthStarET planning, not as a target for development.

### Usage in BMAD Lifecycle

| Phase | Usage |
|-------|-------|
| **Analysis** | Reference for domain understanding, feature inventory |
| **Planning** | Controller parity comparison for NorthStarET PRD |
| **Solutioning** | Data model baseline for Migration database design |
| **Implementation** | Business rule reference when implementing NorthStarET features |

### No Prerequisites

OldNorthStar does not need BMAD planning. It is consumed passively during NorthStarET's lifecycle.
