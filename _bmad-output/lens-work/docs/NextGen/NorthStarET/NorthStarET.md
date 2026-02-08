---
repo: NorthStarET
remote: https://github.com/crisweber2600/NorthStarET.git
default_branch: main
source_commit: eb8046ee3f55277fe0b2466e4896f20c98bcb4c1
generated_at: "2026-02-07T00:00:00Z"
layer: repo
domain: NextGen
service: NorthStarET
generator: scout-auto-pipeline
---

# NorthStarET — Canonical Documentation

## 1. Overview

NorthStarET is the **primary Learning Management System (LMS)** modernization project, operating a **dual-track strategy** to modernize the legacy OldNorthStar application:

- **Upgrade Track:** In-place .NET 10 upgrade of the monolith (34 controllers, EF6, SQL Server)
- **Migration Track:** Clean-architecture microservice rebuild (7 services + 1 mock server + 1 YARP gateway + 1 React UI, PostgreSQL)
- **AIUpgrade Track:** AI-assisted experimental upgrade variant (.NET Framework 4.8, 33 controllers)
- **AutomatedRollover:** Standalone .NET 10 Worker service for batch student roster rollover (NOT in Aspire AppHost)

**Key facts:**
- 1,755 commits, 34,301 files, ~19K C# + ~7K TypeScript lines
- .NET 10 + Aspire 13.1 + EF6 + EF Core + React 18 + YARP
- Contributors: copilot-swe-agent (48%), Cris Weber (46%), Sai Potluri, Tayrika
- **Status: STALLED since Jan 19, 2026 (20+ days)**

**Role in domain:** NorthStarET is the **flagship application** — a full K-12 assessment and intervention tracking system serving districts, schools, teachers, and students. It is the largest codebase in the portfolio and the primary target for BMAD lifecycle management.

## 2. Technology Stack

### Migration Track

| Layer | Technology | Version |
|-------|-----------|---------|
| **Runtime** | .NET | 10 |
| **Orchestration** | Aspire | 13.1 |
| **Gateway** | YARP | Latest |
| **Database** | PostgreSQL (per-service) | Latest |
| **ORM** | Entity Framework Core | 10.x |
| **Frontend** | React | 18 |
| **Frontend Build** | Vite | Latest |
| **Auth** | Custom JWT + Microsoft Entra ID | — |
| **Observability** | OpenTelemetry (via Aspire) | — |
| **Testing** | xUnit, Vitest, Playwright | — |

### Upgrade Track

| Layer | Technology | Version |
|-------|-----------|---------|
| **Runtime** | .NET | 10 |
| **Orchestration** | Aspire | 13.1 |
| **Database** | SQL Server | Legacy |
| **ORM** | Entity Framework 6 (.NET 10 compat shim) | 6.x |
| **Frontend** | React + Legacy bower_components | Mixed |
| **Auth** | Custom JWT | — |
| **Logging** | Serilog + OpenTelemetry | — |
| **Testing** | xUnit | — |

## 3. Architecture

### Migration Track — Microservice Architecture

```
Src/Migration/
├── Backend/
│   ├── AppHost/Program.cs          # Aspire orchestration (86 lines)
│   ├── Gateway/                    # YARP reverse proxy (port 8080)
│   ├── Identity.API/               # Auth service (JWT + Entra ID)
│   ├── StudentService/             # Student management → student-db
│   ├── AssessmentService/          # Assessment engine
│   ├── AssessmentManagement.Api/   # Benchmark management
│   ├── InterventionService.Api/    # Intervention groups → intervention-db
│   ├── NorthStar.Staff.Api/       # Staff management → staff-db
│   ├── NorthStar.SectionService.Api/ # Section management → section-db
│   ├── NorthStar.MockServer/      # Dev mock server (port 5001)
│   └── SharedLibraries/           # Common DTOs, auth, middleware
├── Frontend/
│   └── migration-ui/              # React 18 SPA (port 3100)
└── Tests/
    ├── Identity.Tests/
    ├── NorthStar.Staff.Tests/
    └── migration-ui tests (Vitest + Playwright)
```

### Upgrade Track — Monolith Architecture

```
Src/Upgrade/
├── Backend/
│   ├── NS4.WebAPI/                # 34-controller monolith
│   │   ├── Controllers/           # 34 controllers
│   │   ├── Models/                # View models
│   │   └── Program.cs             # App configuration (152 lines)
│   ├── NorthStar.EF6/            # EF6 compatibility layer
│   └── NorthStarET.AppHost/      # Aspire orchestration
├── Frontend/
│   └── (legacy bower_components + React)
└── Tests/
    ├── NS4.WebAPI.Tests/          # Controller unit tests
    └── NS4.Parity.Tests/         # Parity validation
```

### AutomatedRollover — Standalone Worker Service

```
Src/Migration/Backend/AutomatedRollover/
├── Program.cs                      # .NET 10 Worker host (Windows Service capable)
├── Worker.cs                       # BackgroundService — orchestrates batch rollover
├── Services/
│   ├── RolloverService.cs          # Core rollover logic (NOT FULLY IMPLEMENTED)
│   ├── DatabaseService.cs          # Database operations
│   ├── FtpDownloadService.cs       # FTP file retrieval
│   └── BlobStorageService.cs       # Azure Blob storage
├── Models/
│   ├── RolloverOptions.cs          # DistrictId, ForceLoad, PollingInterval
│   ├── EmailOptions.cs             # SendGrid config
│   ├── UrlOptions.cs               # SiteUrlBase, IdentityServer
│   └── LicenseOptions.cs           # Rebex FTP key
└── Configuration/
    └── appsettings.json
```

**Status:** Scaffolded but **NOT FULLY IMPLEMENTED** — `RolloverService.ExecuteRolloverBatchAsync()` has TODO comments. Modernized from `OldNorthStar/NorthStar.AutomatedRollover` (.NET Framework 4.8). Runs independently as a Windows Service, NOT registered in Aspire AppHost.

### AIUpgrade Track — Experimental Variant

```
Src/AIUpgrade/                      # .NET Framework 4.8 (copy of OldNorthStar)
├── NS4.WebAPI/                     # 33 controllers (WebAPI)
├── NorthStar.Core/                 # Business logic
├── NorthStar.EF6/                  # EF6 data access
├── EntityDto/                      # DTOs
├── NS4.Angular/                    # Legacy Angular frontend
├── IdentityServer/                 # OAuth2 identity provider
└── ... (13 csproj files, 729 .cs files total)
```

**Status:** AI-assisted experimental variant. Same architecture as OldNorthStar (.NET Framework 4.8). copilot-swe-agent has made experimental modifications — **48% commits are AI-generated and unaudited**.

### Complete Source Directory Map

| Directory | Track | Framework | Status |
|-----------|-------|-----------|--------|
| `Src/Migration/` | Migration | .NET 10 | Active (stalled) |
| `Src/Upgrade/` | Upgrade | .NET 10 + EF6 | Active (stalled) |
| `Src/AIUpgrade/` | AIUpgrade | .NET Framework 4.8 | Experimental |
| `Src/NextGen/Foundation/` | NextGen | — | Placeholder (AppHost mock-data only) |
| `Src/Foundation/` | Foundation | — | Placeholder |

### Key Patterns

| Pattern | Track | Quality |
|---------|-------|---------|
| **Clean Architecture** | Migration | ✅ Textbook 4-layer: API → Application → Domain → Infrastructure |
| **YARP Gateway** | Migration | ✅ Single entry point routing to all microservices |
| **Database-per-Service** | Migration | ✅ Each service owns its PostgreSQL database |
| **Aspire Orchestration** | Both | ✅ Modern dev experience with service discovery |
| **Dual-Track Strategy** | Both | ⚠️ High complexity, splits resources |
| **EF6 Compatibility** | Upgrade | ⚠️ Legacy burden blocking EF Core adoption |
| **Mock Server** | Migration | ✅ Good DX — UI development without backends |
| **Entra ID Auth** | Migration | ✅ Enterprise-grade identity (in addition to custom JWT) |

## 4. API Surface

### Migration Track — Service Mesh

| Service | YARP Route | Port | Controllers | Database |
|---------|-----------|------|-------------|----------|
| **Identity** | `/identity/{**}` | Auto | `AuthController`, `EntraAuthController`, `SessionController` | — |
| **Student** | `/students/{**}` | Auto | `StudentsController`, `StudentAttributesController`, `StudentNotesController` | `student-db` (PostgreSQL) |
| **Assessment** | `/api/assessments/{**}` | Auto | `AssessmentController` | — |
| **Benchmarks** | `/api/benchmarks/{**}` | Auto | `BenchmarksController` | — |
| **Intervention** | `/api/intervention-groups/{**}`, `/api/intervention-toolkit/{**}` | Auto | `InterventionGroupController`, `InterventionAttendanceController`, `InterventionDashboardController`, `InterventionToolkitController` | `intervention-db` (PostgreSQL) |
| **Staff** | `/api/staff/{**}` | Auto | `StaffController`, `StaffSettingsController` | `staff-db` (PostgreSQL) |
| **Section** | `/api/sections/{**}` | Auto | `SectionsController`, `RosterController`, `RolloverController` | `section-db` (PostgreSQL) |
| **MockServer** | `/api/students/{**}`, `/api/reports/{**}` | 5001 | — | — (dev only) |
| **Gateway** | All routes | 8080 | — (YARP proxy) | — |
| **React UI** | — | 3100 | — (SPA) | — |

**Total Migration Controllers:** 17

### Upgrade Track — Monolith API

34 controllers in a single API:

| Domain | Controllers |
|--------|------------|
| **Assessment** | `AssessmentController`, `AssessmentAvailabilityController`, `BenchmarkController` |
| **Student** | `StudentController`, `StudentDashboardController` |
| **Staff** | `StaffController` |
| **Section** | `SectionController`, `SectionDataEntryController`, `SectionReportController` |
| **Intervention** | `InterventionDashboardController`, `InterventionGroupController`, `InterventionGroupDataEntryController`, `InterventonToolkitController` (typo in original) |
| **Data** | `DataEntryController`, `ExportDataController`, `ImportStateTestDataController` |
| **Auth** | `AuthController`, `PasswordResetController` |
| **Navigation** | `NavigationController`, `FilterOptionsController`, `PersonalSettingsController`, `DistrictSettingsController` |
| **Reporting** | `LineGraphController`, `StackedBarGraphController`, `PrintController`, `CalendarController` |
| **Other** | `HomeController`, `ProbeController`, `HelpController`, `TeamMeetingController`, `VideoController`, `RosterRolloverController`, `FileUploaderController`, `AzureDownloadController` |

## 5. Data Models

### Migration Track — Per-Service Databases

| Service | Database | Key Entities (Clean Architecture) |
|---------|----------|----------------------------------|
| **Student** | `student-db` | Student, StudentAttribute, StudentNote |
| **Intervention** | `intervention-db` | InterventionGroup, InterventionAttendance, InterventionToolkit |
| **Staff** | `staff-db` | Staff, StaffSettings |
| **Section** | `section-db` | Section, Roster, RolloverConfig |

Each service follows domain → infrastructure layering with EF Core.

### Upgrade Track — Monolith Database

Legacy SQL Server database via EF6 compatibility layer (`NorthStar.EF6`). Contains the full legacy data model from OldNorthStar with ~36 entity types covering students, assessments, interventions, staff, sections, benchmarks, calendars, and configuration.

### Domain Entities (Cross-Track)

| Entity | Upgrade | Migration | Parity Status |
|--------|---------|-----------|--------------|
| Student | ✅ Single table | ✅ Service (3 controllers) | ✅ Feature parity attempted |
| Assessment | ✅ 3 controllers | ✅ 2 services | ✅ Split into assessment + benchmarks |
| Intervention | ✅ 3 controllers | ✅ 4 controllers | ✅ Expanded in Migration |
| Staff | ✅ 1 controller | ✅ 2 controllers | ✅ Similar |
| Section | ✅ 3 controllers | ✅ 3 controllers | ✅ Similar |
| Auth | ✅ Custom JWT | ✅ JWT + Entra ID | ⚠️ Migration adds Entra |
| Reporting | ✅ 4 controllers | ❌ Not yet migrated | 🔴 Gap |

## 6. Integration Points

### Internal (Cross-Service)

| From | To | Mechanism | Track |
|------|----|-----------|-------|
| React UI (3100) | YARP Gateway (8080) | HTTP REST | Migration |
| YARP Gateway | All microservices | YARP reverse proxy | Migration |
| Each service | Own database | EF Core + PostgreSQL | Migration |
| NS4.WebAPI | SQL Server | EF6 | Upgrade |
| AppHost | All services | Aspire service discovery | Both |

### External

| Integration | Mechanism | Notes |
|------------|-----------|-------|
| **Microsoft Entra ID** | OAuth 2.0 / OIDC | Migration track only |
| **Azure Blob Storage** | Azure SDK | Legacy file storage (Upgrade track env vars) |
| **OldNorthStar** | Reference only | Source architecture for modernization |
| **NorthStarET.Student** | Planned sibling | BMAD planning repo (game dev) — has BMAD framework + planning artifacts, no application code yet |

## 7. Build & Deploy

### Build

```bash
# Migration track — Aspire orchestration
cd Src/Migration/Backend/AppHost
dotnet run

# Upgrade track — Aspire orchestration  
cd Src/Upgrade/Backend/NorthStarET.AppHost
dotnet run

# Frontend (Migration)
cd Src/Migration/Frontend/migration-ui
npm install && npm run dev
```

### CI/CD

| Pipeline | File | Purpose |
|----------|------|---------|
| `ci.yml` | GitHub Actions | Build + test (both tracks) |
| `scheduled-e2e-visual.yml` | GitHub Actions | Scheduled E2E + visual regression |

### Prerequisites

- .NET 10 SDK
- Node.js LTS (for React frontend)
- Docker (for PostgreSQL via Aspire)
- Aspire workload
- SQL Server (Upgrade track — or use LocalDB)

## 8. Configuration

### Migration Track

| File | Purpose |
|------|---------|
| `AppHost/Program.cs` | Aspire service orchestration, database config, port assignments |
| `appsettings.json` (per service) | Service-specific configuration |
| `Gateway/*.json` | YARP route configuration |

### Upgrade Track

| File | Purpose |
|------|---------|
| `NS4.WebAPI/appsettings.json` | Monolith configuration |
| `NorthStarET.AppHost/AppHost.cs` | Aspire orchestration |

### Environment Variables (Upgrade Track)

| Variable | Purpose |
|----------|---------|
| `AZURE_STORAGE_*` | Azure Blob Storage connection |
| `JWT_SECRET_KEY` | JWT signing key |
| `SQL_CONNECTION_STRING` | SQL Server connection |

### Service Ports (Migration Track)

| Service | Port | Configured In |
|---------|------|--------------|
| YARP Gateway | 8080 | AppHost |
| React UI | 3100 | AppHost |
| MockServer | 5001 | AppHost |
| Microservices | Auto-assigned | Aspire |

## 9. Testing

### Test Coverage

| Project | Type | Track | Framework |
|---------|------|-------|-----------|
| `NS4.WebAPI.Tests` | Unit | Upgrade | xUnit |
| `NS4.Parity.Tests` | Parity validation | Upgrade | xUnit |
| `Identity.Tests` | Unit + controller | Migration | xUnit |
| `NorthStar.Staff.Tests` | Integration | Migration | xUnit |
| `migration-ui` tests | Component + E2E | Migration | Vitest + Playwright |

### Test Commands

```bash
# .NET tests (all tracks)
dotnet test

# Frontend tests (Migration)
cd Src/Migration/Frontend/migration-ui
npm test                # Vitest
npx playwright test     # E2E
```

### Coverage Status

| Area | Coverage | Notes |
|------|----------|-------|
| Upgrade controllers | ⚠️ Partial | `NS4.WebAPI.Tests` covers some controllers |
| Parity validation | ✅ | `NS4.Parity.Tests` validates Upgrade ↔ OldNorthStar |
| Migration Identity | ✅ | Controller + service tests |
| Migration Staff | ✅ | Integration tests |
| Migration UI | ⚠️ Unknown | Vitest + Playwright configured but coverage unclear |
| Assessment services | ⚠️ Unknown | No dedicated test project found |
| Intervention services | ⚠️ Unknown | No dedicated test project found |  
| Section services | ⚠️ Unknown | No dedicated test project found |

## 10. Known Issues & Technical Debt

| # | Issue | Severity | Impact | Recommendation |
|---|-------|----------|--------|----------------|
| 1 | **Stalled 20+ days** | 🔴 CRITICAL | No commits since Jan 19 — development momentum lost | Triage: pick one track, create restart backlog |
| 2 | **48% AI-generated code** | ⚠️ HIGH | copilot-swe-agent commits (48%) — quality/consistency unknown | Audit sample of AI PRs for patterns, test quality, edge cases |
| 3 | **Dual-track resource split** | ⚠️ HIGH | Upgrade + Migration + AIUpgrade — too many parallel efforts | Focus on one track; defer or archive others |
| 4 | **EF6 compatibility layer** | ⚠️ HIGH | Upgrade track locked to EF6 — blocks EF Core features | Plan EF6 → EF Core migration within Upgrade track |
| 5 | **bower_components** | ⚠️ MEDIUM | Dead package manager in Upgrade + AIUpgrade tracks | Remove as React replacement matures |
| 6 | **No shared auth library** | ⚠️ MEDIUM | JWT duplicated between NorthStarET and bmadServer | Extract shared auth package |
| 7 | **Controller typo** | LOW | `InterventonToolkitController` — missing 'i' | Rename in cleanup PR |
| 8 | **Reporting not migrated** | ⚠️ MEDIUM | 4 reporting controllers in Upgrade, none in Migration | Plan reporting service for Migration track |
| 9 | **Missing test coverage** | ⚠️ MEDIUM | Assessment, Intervention, Section services lack dedicated tests | Add test projects for each Migration service |

## 11. BMAD Readiness

### Assessment: ⚠️ CONDITIONALLY READY

NorthStarET can enter BMAD planning but requires triage decisions first.

### Readiness Checklist

| Criterion | Status | Notes |
|-----------|--------|-------|
| **Repository exists** | ✅ | Large, active (though stalled) codebase |
| **Architecture defined** | ✅ | Dual-track with clean separation |
| **Multiple tracks** | 🔴 | Must choose focal track BEFORE /pre-plan |
| **Test coverage** | ⚠️ | Partial — gaps in Migration services |
| **CI/CD pipeline** | ✅ | GitHub Actions with build + test + E2E |
| **Stalled development** | 🔴 | 20+ days stalled — restart backlog needed |
| **AI code audit** | 🔴 | 48% AI code unaudited |
| **Legacy dependencies** | ⚠️ | EF6, bower_components |

### Prerequisites for BMAD /pre-plan

1. 🔴 **Track decision:** Choose Migration OR Upgrade as primary focus
2. 🔴 **Restart backlog:** Create prioritized list of next steps after 20-day stall
3. 🔴 **AI code audit:** Review copilot-swe-agent contributions for quality
4. ⚠️ **Missing tests:** Add test projects for Assessment, Intervention, Section services
5. ⚠️ **Feature parity doc:** Document which Upgrade features are missing in Migration

### Recommended Sequencing

NorthStarET should be the **second priority** for BMAD planning (after bmadServer), because:
1. It's stalled and needs triage decisions before structured planning can begin
2. It's the largest and most complex repo — benefits most from BMAD lifecycle structure
3. The dual-track decision must be made explicitly during Analysis phase
