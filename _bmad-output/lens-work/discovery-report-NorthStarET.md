# DISCOVERY REPORT: NorthStarET

**Domain:** NextGen | **Service:** NorthStarET  
**Remote:** https://github.com/crisweber2600/NorthStarET.git  
**Default Branch:** main  
**Scanned:** 2026-02-07  

---

## TECHNOLOGY STACK

| Category | Details |
|----------|---------|
| **Primary Language** | C# (.NET 10) + TypeScript/React 18 |
| **Framework** | .NET 10, ASP.NET Core WebAPI, .NET Aspire 13.1 |
| **Frontend** | React 18 + Vite + TypeScript + Tailwind CSS |
| **ORM** | Entity Framework 6 (legacy upgrade path), Clean Architecture (migration path) |
| **Database** | PostgreSQL (migration), SQL Server/Azure SQL (upgrade/legacy) |
| **API Gateway** | YARP (Yet Another Reverse Proxy) via Aspire |
| **Authentication** | JWT Bearer (upgrade), Custom Identity Service (migration) |
| **Logging** | Serilog → OpenTelemetry + Application Insights |
| **UI Libraries** | Radix UI, TanStack Query/Table, React Hook Form, Zod, Lucide, FontAwesome |
| **Testing** | xUnit (backend), Vitest (frontend unit), Playwright (E2E/visual) |
| **Build System** | dotnet CLI + MSBuild (backend), Vite (frontend), Central Package Management |
| **CI/CD** | GitHub Actions (ci.yml, scheduled-e2e-visual.yml) |
| **Cloud** | Azure (Blob Storage, Table Storage, Application Insights, WebJobs) |
| **External Services** | SendGrid (email), Vzaar (video), FTP (data import/export), PDF service |

---

## PROJECT STRUCTURE

```
NorthStarET/
├── Src/
│   ├── Upgrade/                         # IN-PLACE UPGRADE (.NET 4.6 → .NET 10)
│   │   ├── Backend/
│   │   │   ├── NorthStarET.AppHost/     # Aspire orchestrator (YARP + React)
│   │   │   ├── NorthStarET.ServiceDefaults/  # Aspire shared config
│   │   │   ├── NS4.WebAPI/              # Monolithic API (33 controllers)
│   │   │   ├── NorthStar.EF6/           # EF6 data access layer
│   │   │   ├── EntityDto/               # Entities + DTOs (62 entities)
│   │   │   ├── DataAccess/              # Custom DataTable abstraction
│   │   │   ├── Northstar.Core/          # Shared: Identity, FileUpload, Extensions
│   │   │   ├── IdentityServer/          # Legacy identity provider
│   │   │   ├── WnvHtmlToPdfClient/      # PDF generation client
│   │   │   ├── NorthStar.AutomatedRollover/  # Year-end rollover batch
│   │   │   ├── NorthStar.BatchProcessor/     # Background processing
│   │   │   ├── NorthStar4.BatchPrint/        # Print batch jobs
│   │   │   ├── NorthStar4.BatchProcessor/    # Legacy batch processor
│   │   │   ├── VzaarConsoleTest/             # Video service testing
│   │   │   ├── NS4.WebAPI.Tests/        # API unit tests
│   │   │   └── NS4.Parity.Tests/        # Upgrade parity validation
│   │   └── UI/
│   │       └── NS4.React/               # React frontend (Upgrade path)
│   │
│   ├── Migration/                       # GREENFIELD MICROSERVICES REWRITE
│   │   ├── Backend/
│   │   │   ├── AppHost/                 # Aspire orchestrator (PostgreSQL + YARP)
│   │   │   ├── StudentService/          # Student bounded context
│   │   │   ├── AssessmentService/       # Assessment bounded context
│   │   │   ├── AssessmentManagement/    # Assessment admin (Clean Arch)
│   │   │   ├── InterventionService/     # Intervention bounded context (Clean Arch)
│   │   │   ├── StaffManagement/         # Staff bounded context (Clean Arch)
│   │   │   ├── SectionService/          # Section/Class bounded context (Clean Arch)
│   │   │   ├── Identity/               # Auth service (Clean Arch)
│   │   │   └── AutomatedRollover/      # Year-end rollover service
│   │   └── UI/
│   │       ├── web/                     # React 18 + Vite frontend
│   │       └── NorthStar.MockServer/    # Development mock API
│   │
│   ├── AIUpgrade/                       # AI-ASSISTED UPGRADE (VS2026 tooling)
│   │   └── (mirrors Upgrade structure)  # Automated conversion artifacts
│   │
│   └── NextGen/                         # SHARED FOUNDATION LIBRARIES
│       └── Foundation/shared/
│           ├── Application/             # MediatR, Result pattern, Behaviors
│           ├── Domain/                  # AggregateRoot, EntityBase, ValueObject
│           └── ServiceDefaults/         # Health checks (RabbitMQ, Redis)
│
├── tests/                               # CENTRALIZED TEST PROJECTS
│   ├── Migration/Backend/               # Service-level tests
│   │   ├── AssessmentManagement.UnitTests/
│   │   ├── InterventionService.UnitTests/
│   │   ├── InterventionService.IntegrationTests/
│   │   ├── StudentService.UnitTests/
│   │   └── UI/MockServer.IntegrationTests/
│   └── NextGen/Foundation/
│       └── ApiGateway.IntegrationTests/
│
├── .referenceSrc/                       # LEGACY CODE (READ-ONLY REFERENCE)
│   ├── OldNorthStar/                    # Original .NET Framework 4.6
│   └── WIPNorthStar/                    # Previous migration attempt
│
├── .github/
│   ├── workflows/ci.yml                 # Build + test + coverage
│   └── workflows/scheduled-e2e-visual.yml  # Nightly Playwright visual tests
│
└── .specify/                            # SpecKit planning artifacts
```

---

## GIT ANALYSIS

| Metric | Value |
|--------|-------|
| **Total Commits** | 1,786 |
| **First Commit** | 2025-11-19 (Cris Weber, "Initial commit") |
| **Most Recent** | 2026-02-06 ("feat(staff-rollover): Add Staff Rollover page with production parity (#585)") |
| **Active Since** | ~2.5 months |
| **Branch Count** | 55 (3 local, 52 remote) |

### Commit Frequency
| Month | Commits | Rate |
|-------|---------|------|
| Nov 2025 | 461 | ~42/day (initial ramp-up) |
| Dec 2025 | 1,201 | ~39/day (peak velocity) |
| Jan 2026 | 93 | ~5/day (slowdown / Jan 19 last activity) |

### Contributors
| Contributor | Commits | % | Role |
|-------------|---------|---|------|
| copilot-swe-agent[bot] | 845 | 48% | AI agent (primary implementor) |
| Cris Weber | 798 | 45% | Lead developer |
| Sai Potluri | 104 | 6% | Developer |
| Tayrika | 95 | 5% | Developer |
| RM | 64 | 4% | Developer |

### Branch Patterns
- **Feature branches**: `2854-InterventionGroupManage`, `2855-InterventionGroupAttendance`, etc. (JIRA-style numbered)
- **Bug branches**: `bug3216`, `bug3220`, `bug3240–3245`
- **Copilot branches**: `copilot/sub-pr-324`, `copilot/fix-*` (12 branches — heavy AI-assisted development)
- **Infra branches**: `AzurePrep`, `Tests`, `codexTests`

### Activity Trend
**ACTIVE** — Latest commit Feb 6, 2026 (1,786 total). Dec 2025 was peak velocity at 1,201 commits. Development continues with staff rollover, intervention dashboard, and team meeting features.

---

## ARCHITECTURE

### Pattern: Dual-Track Modernization
This repo implements **two parallel migration strategies** for a legacy .NET Framework 4.6 LMS monolith:

1. **Upgrade Track** (`Src/Upgrade/`): In-place upgrade preserving monolithic architecture → .NET 10 with Aspire orchestration + YARP gateway + React SPA
2. **Migration Track** (`Src/Migration/`): Greenfield rewrite to Clean Architecture microservices with bounded contexts + PostgreSQL + YARP API gateway

### Upgrade Architecture
```
[React SPA :3000] → [YARP Gateway] → [NS4.WebAPI :5000 (33 controllers)]
                                          ↓
                                    [NorthStar.EF6] → [SQL Server]
                                    [Azure Blob Storage]
                                    [SendGrid, Vzaar, PDF Service]
```

### Migration Architecture (Clean Architecture per service)
```
[React SPA :3100] → [YARP Gateway :8080] → ┬→ [IdentityAPI]
                                             ├→ [StudentService] → [PostgreSQL student-db]
                                             ├→ [AssessmentService]
                                             ├→ [AssessmentManagement]
                                             ├→ [InterventionService] → [PostgreSQL intervention-db]
                                             ├→ [StaffService] → [PostgreSQL staff-db]
                                             ├→ [SectionService] → [PostgreSQL section-db]
                                             └→ [MockServer :5001] (dev only)
```

Each migration service follows: `Api → Application → Domain → Infrastructure`

### NextGen Foundation
Shared DDD building blocks: `AggregateRoot`, `EntityBase`, `ValueObject`, `IDomainEvent`, `Result<T>`, `IUnitOfWork`, MediatR behaviors (Logging, Validation), health checks (RabbitMQ, Redis).

---

## API SURFACE

### Upgrade WebAPI (33 Controllers)
| Controller | Domain |
|------------|--------|
| `AssessmentController` | Assessment CRUD |
| `AssessmentAvailabilityController` | Assessment scheduling |
| `AuthController` | Authentication |
| `AzureDownloadController` | Blob storage downloads |
| `BenchmarkController` | Student benchmarks |
| `CalendarController` | District calendars |
| `DataEntryController` | Assessment data entry |
| `DistrictSettingsController` | District admin |
| `ExportDataController` | Data export |
| `FileUploaderController` | File uploads |
| `FilterOptionsController` | Filter dropdowns |
| `HomeController` | Landing/dashboard |
| `ImportStateTestDataController` | State test import |
| `InterventionDashboardController` | Intervention stats |
| `InterventionGroupController` | Intervention groups |
| `InterventionGroupDataEntryController` | Intervention data |
| `InterventonToolkitController` | Intervention tools |
| `LineGraphController` | Reporting graphs |
| `NavigationController` | Menu/nav data |
| `PasswordResetController` | Password management |
| `PersonalSettingsController` | User settings |
| `PrintController` | Print/PDF generation |
| `ProbeController` | Health probes |
| `RosterRolloverController` | Year-end rollover |
| `SectionController` | Sections/classes |
| `SectionDataEntryController` | Section scoring |
| `SectionReportController` | Section reports |
| `StackedBarGraphController` | Charts |
| `StaffController` | Staff management |
| `StudentController` | Student CRUD |
| `StudentDashboardController` | Student overview |
| `TeamMeetingController` | Team meetings |
| `VideoController` | Video integration |

### Migration Gateway Routes
| Route Pattern | Target Service |
|---------------|---------------|
| `/identity/**` | Identity API |
| `/students/**` | Student Service |
| `/api/assessments/**` | Assessment Service |
| `/api/benchmarks/**` | Assessment Management |
| `/api/intervention-groups/**` | Intervention Service |
| `/api/intervention-toolkit/**` | Intervention Service |
| `/api/staff/**` | Staff Service |
| `/api/sections/**` | Section Service |
| `/api/students/**` (mock) | Mock Server |
| `/api/reports/**` (mock) | Mock Server |

### Migration React UI Routes
- `/` — HomePage
- `/login` — LoginPage
- `/students` — StudentsPage (list + filter + pagination)
- `/students/new` — StudentCreatePage
- `/students/:id/edit` — StudentEditPage
- `/classes` — ClassesPage
- `/settings` — SettingsPage

---

## DATA MODELS

### Legacy Entities (62 EF6 entities in Upgrade/EntityDto)
**Core domain entities**: Assessment, AssessmentField, AssessmentFieldCategory, AssessmentFieldGroup, AssessmentFieldSubCategory, AssessmentLookupField, Assessment_Benchmarks, AttendanceReason, AttendeeGroup, AttendeeGroupStaff, DistrictCalendar, District_Benchmark, District_YearlyAssessmentBenchmark, FPComparison, Grade, InterventionAttendance, InterventionCardinality, and ~45 more.

**Key DTO domains**:
- Admin/District — DistrictInputDtos, DistrictInterventionDto, HFW management
- Admin/InterventionGroup — Attendance, stints, weekly results
- Admin/InterventionToolkit — Categories, tiers, grades, workshops
- Admin/Section — Data entry fields, student results

### Migration Domain Entities (Clean Architecture)
| Bounded Context | Entities |
|----------------|----------|
| **StudentService** | Student, StudentNote, StudentSchool, StudentSection, StudentAttributeData, ConsolidationLog |
| **StudentService Events** | StudentCreated, StudentUpdated, StudentDeactivated, StudentMoved, StudentConsolidated |
| **AssessmentService** | Assessment, AssessmentField, LookupField |
| **AssessmentManagement** | Benchmark |
| **InterventionService** | (Domain entities present) |
| **StaffManagement** | (Domain entities present) |
| **SectionService** | (Domain entities + RolloverService present) |
| **Identity** | User, RefreshToken (tested: UserLockout, UserSession) |
| **Foundation** | AggregateRoot, EntityBase, ValueObject, ITenantEntity |

---

## INTEGRATION POINTS

| Integration | Protocol | Used By |
|-------------|----------|---------|
| **Azure Blob Storage** | Azure SDK | File uploads, downloads |
| **Azure Table Storage** | Azure SDK | Structured data |
| **Application Insights** | OpenTelemetry | Telemetry export |
| **SendGrid** | REST API | Email notifications |
| **Vzaar** | REST API | Video hosting |
| **PDF Service** | TCP/IP (custom) | Report generation |
| **FTP** | FTP Protocol | State test data import/export |
| **IdentityServer** | OAuth2/OIDC | Legacy auth (Upgrade track) |
| **PostgreSQL** | EF Core | Migration microservices |
| **SQL Server** | EF6 | Legacy/Upgrade data layer |

### Cross-Track Dependencies
- Migration React UI references mock server for development
- Upgrade AppHost wires YARP gateway → NS4.WebAPI backend
- Migration AppHost wires YARP gateway → 7 microservices + mock
- NextGen Foundation shared by Migration services
- `.referenceSrc/OldNorthStar/` is READ-ONLY reference for pixel-perfect UI parity

---

## CODE METRICS

| Project Type | C# LOC | TS/TSX LOC | C# Projects |
|--------------|--------|------------|-------------|
| **Upgrade** | ~19,214 | — | 15 |
| **Migration Backend** | ~5,023 | — | 28 |
| **Migration UI** | — | ~7,074 | — |
| **AIUpgrade** | ~4,401 | — | 13 |
| **NextGen Foundation** | ~959 | — | 3 |
| **Tests** | ~2,537 | — | 6 |
| **TOTAL** | ~32,134 | ~7,074 | 65 |

| Metric | Count |
|--------|-------|
| **Total source files** (excl. ref/build/git) | ~19,279 |
| **C# files** | 1,962 |
| **TypeScript/TSX files** | 569 |
| **Frontend test files** | 22 (Playwright + Vitest) |
| **Backend test projects** | 12 |

---

## TESTING INFRASTRUCTURE

### Backend Tests
| Project | Type | Location |
|---------|------|----------|
| NS4.WebAPI.Tests | Unit | Src/Upgrade/ |
| NS4.Parity.Tests | Parity/Regression | Src/Upgrade/ |
| AssessmentService.UnitTests | Unit | Src/Migration/ (inline) |
| Identity.Tests | Unit | Src/Migration/ (inline) |
| NorthStar.SectionService.Tests | Unit | Src/Migration/ (inline) |
| NorthStar.Staff.Tests | Unit | Src/Migration/ (inline) |
| AssessmentManagement.UnitTests | Unit | tests/ (centralized) |
| InterventionService.UnitTests | Unit | tests/ (centralized) |
| InterventionService.IntegrationTests | Integration | tests/ (centralized) |
| StudentService.UnitTests | Unit | tests/ (centralized) |
| MockServer.IntegrationTests | Integration | tests/ (centralized) |
| ApiGateway.IntegrationTests | Integration | tests/ (centralized) |

### Frontend Tests
- **22 test files** (Playwright visual + Vitest unit)
- Visual parity testing via `scheduled-e2e-visual.yml` (nightly)
- jest-axe for accessibility testing

### CI/CD Pipeline (ci.yml)
- Triggers: push to main/implement/Upgrade branches, PRs to main, daily schedule 2AM UTC
- .NET 10 build + test with XPlat Code Coverage
- Scoped to `Src/Upgrade/` path only (Migration CI not yet configured)

---

## TECHNICAL DEBT SIGNALS

1. **Dual-track complexity**: Three parallel codebases (Upgrade, Migration, AIUpgrade) for the same application. Significant risk of divergence and wasted effort.

2. **EF6 legacy lock-in**: Upgrade track still uses Entity Framework 6 (not EF Core), limiting modernization benefits. The `DCOld.cs` and `ExtOld.cs` files suggest incomplete migration from even older patterns.

3. **Nullable disabled**: `NS4.WebAPI.csproj` has `<Nullable>disable</Nullable>` — missing null-safety in the largest project.

4. **Test inconsistency**: Tests split between inline (`Src/Migration/Backend/*/Tests`) and centralized (`tests/`) locations. No clear convention.

5. **Activity stall**: No commits since Jan 19 (19 days). 92% drop from Dec velocity. Possible project pause or pivot.

6. **CI gap**: CI pipeline only covers `Src/Upgrade/` path. Migration track has no CI coverage.

7. **Mock server coupling**: Migration UI development depends on MockServer for `/api/students` and `/api/reports`, masking API incompatibilities.

8. **Typo in controller**: `InterventonToolkitController` (missing 'i') — cosmetic but indicates review gaps.

9. **Heavy AI contribution**: 48% of commits from copilot-swe-agent. Quality validation and code review rigor should be verified.

10. **Missing Docker**: No Dockerfile for production deployment (only MockServer has one). `.dockerignore` exists at root but no container build.

11. **Feature flag sprawl**: `ForceLoad`, `DistrictId` passed as Aspire parameters — indicates ad-hoc config rather than structured feature management.

12. **RabbitMQ/Redis health checks** in Foundation ServiceDefaults but no actual RabbitMQ/Redis infrastructure configured in either AppHost — future infrastructure not yet wired.

---

## RISKS & UNKNOWNS

| Risk | Severity | Details |
|------|----------|---------|
| **Project stall** | HIGH | No activity for 19 days after intense 2-month sprint. Team capacity unknown. |
| **Track convergence** | HIGH | No documented strategy for when/how Upgrade and Migration tracks converge. Both are actively structured. |
| **Database migration** | MEDIUM | Migration uses PostgreSQL, Upgrade uses SQL Server via EF6. Data migration strategy not evident. |
| **No production deployment config** | HIGH | No Dockerfiles, no Kubernetes manifests, no Azure deployment templates (bicep/ARM). Only `.dockerignore` at root. |
| **Legacy reference code volume** | LOW | `.referenceSrc/` contains full legacy app. Large repo size but correctly isolated as READ-ONLY. |
| **API Gateway testing** | MEDIUM | `ApiGateway.IntegrationTests` exists but YARP route configuration is only in AppHost code — not easily testable. |
| **Identity strategy split** | MEDIUM | Upgrade uses IdentityServer + JWT. Migration has custom Identity service with User/RefreshToken. Unclear if they share auth flows. |
| **Missing observability** | MEDIUM | Serilog + AppInsights configured but no structured dashboards, alerts, or SLO definitions found. |

---

## SUMMARY

NorthStarET is a **large-scale LMS modernization project** migrating from .NET Framework 4.6 monolith to .NET 10. It employs a **dual-track strategy**: an in-place Upgrade (preserving monolithic API with 33 controllers) and a greenfield Migration (7 Clean Architecture microservices with PostgreSQL). Both tracks use .NET Aspire 13.1 for orchestration with YARP API gateway and React 18 frontends.

The project saw explosive growth (1,786 commits in ~2.5 months) with heavy AI-assisted development (48% bot commits) and remains **actively developed as of Feb 6, 2026**. The Migration track represents the future architecture with proper bounded contexts, domain events, and shared Foundation libraries, but currently has no CI/CD pipeline coverage. The Upgrade track is more mature with 19K LOC and full CI.

**Key decision needed**: Which track becomes the production path, and what is the convergence/deprecation plan for the other.
