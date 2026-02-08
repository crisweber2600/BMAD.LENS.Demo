# NorthStarET — Deep Technical Analysis
> SCOUT AC Workflow | Generated: 2026-02-07 | Confidence: HIGH (88%)

## 1. Technology Stack

### Upgrade Track (Monolith Modernization)
| Component | Technology | Version | Source |
|-----------|-----------|---------|--------|
| Runtime | .NET 10 | 10.0 | `NS4.WebAPI.csproj` |
| Orchestration | .NET Aspire | 13.1 | `NorthStarET.AppHost/AppHost.cs` |
| ORM | Entity Framework 6 | EF6 Compat | `NorthStar.EF6/` |
| Database | SQL Server | via LoginConnection | AppHost parameters |
| API Gateway | YARP | Aspire.Hosting.Yarp | AppHost |
| Storage | Azure Blob + Table | Connection strings | AppHost |
| Frontend | React 18+ | Vite dev server | `UI/NS4.React/` |
| Video | Vzaar | API integration | AppHost env vars |
| Email | SendGrid | API key | AppHost env vars |
| PDF | Remote PDF Service | FTP-based | AppHost env vars |

### Migration Track (Microservices)
| Component | Technology | Version | Source |
|-----------|-----------|---------|--------|
| Runtime | .NET 10 | 10.0 | Multiple `.csproj` |
| Orchestration | .NET Aspire | 13.1 | `Migration/Backend/AppHost/Program.cs` |
| Database | PostgreSQL | Aspire-managed | `AddPostgres("postgres")` |
| API Gateway | YARP | Aspire.Hosting.Yarp | YARP route config |
| Architecture | Clean Architecture | N/A | Domain/Entities per service |
| Frontend | React + Vite | dev server | `UI/web/` |
| Auth | Entra ID + JWT | Identity.API | `EntraAuthController` |

## 2. API Surface

### Upgrade Track — 33 Controllers, 385 Endpoints
| Controller | Domain | Method Count (est.) |
|-----------|---------|---------------------|
| `AssessmentController` | Assessment management | 20+ |
| `StudentController` | Student CRUD | 15+ |
| `TeamMeetingController` | RTI meetings | 20+ |
| `InterventionGroupController` | Intervention groups | 15+ |
| `SectionController` | Class sections | 15+ |
| `StaffController` | Staff management | 10+ |
| `DataEntryController` | Data entry forms | 15+ |
| `BenchmarkController` | Benchmark tests | 10+ |
| `PasswordResetController` | Password flows | 5 |
| `VideoController` | Video management | 5 |
| `CalendarController` | Calendar views | 5+ |
| `DistrictSettingsController` | Admin settings | 10+ |
| `ExportDataController` | Data export | 5+ |
| `FilterOptionsController` | Filter/search | 5+ |
| `FileUploaderController` | File uploads | 5+ |
| `LineGraphController` | Data visualization | 5+ |
| `StackedBarGraphController` | Chart rendering | 5+ |
| `PrintController` | Print views | 5+ |
| `SectionReportController` | Reporting | 10+ |
| `AuthController` | Authentication | 5+ |
| And 13 more... | Various | — |

### Migration Track — 17 Controllers, 64 Endpoints (across 7 services)

| Service | Controllers | Endpoints |
|---------|------------|-----------|
| **Identity** | AuthController, EntraAuthController, SessionController | ~10 |
| **StudentService** | StudentsController, StudentAttributesController, StudentNotesController | ~10 |
| **AssessmentService** | AssessmentController | ~5 |
| **AssessmentManagement** | BenchmarksController | ~5 |
| **InterventionService** | InterventionAttendanceController, InterventionDashboardController, InterventionGroupController, InterventionToolkitController | ~15 |
| **StaffManagement** | StaffController, StaffSettingsController | ~8 |
| **SectionService** | SectionsController, RolloverController, RosterController | ~11 |

**Total Combined: 449 endpoints (385 Upgrade + 64 Migration)**

## 3. Data Models

### Upgrade Track — EF6 (104 entities)
| Context | Entity Count | Source |
|---------|-------------|--------|
| `DistrictContext` | 60 DbSets | `NorthStar.EF6/DistrictContext.cs` |
| `LoginContext` | 44 DbSets | `NorthStar.EF6/LoginContext.cs` |
| **Total** | **104** | |

Key entity domains: Students, Staff, Assessments, Interventions, Sections, Teams, Benchmarks, Calendar, District Settings, Audit Logs

### Migration Track — Clean Architecture Entities (27)
| Service | Entity Count | Path |
|---------|-------------|------|
| Identity | 6 | `Identity/Identity.Domain/Entities/` |
| StudentService | 6 | `StudentService/Domain/Entities/` |
| StaffManagement | 4 | `NorthStar.Staff.Domain/Entities/` |
| InterventionService | 4 | `InterventionService.Domain/Entities/` |
| AssessmentService | 3 | `AssessmentService/Domain/Entities/` |
| SectionService | 3 | `SectionService.Domain/Entities/` |
| AssessmentManagement | 1 | `AssessmentManagement/Domain/Entities/` |
| **Total** | **27** | |

## 4. Architecture Pattern

### Upgrade Track: Monolith with Aspire Wrapper
```
YARP Gateway (port 8080)
  ↓ /api/{**catch-all}
NS4.WebAPI (port 5000)  →  NorthStar.EF6
  ↓ 33 Controllers           ↓ DistrictContext (SQL Server)
React UI (port 3000)          ↓ LoginContext (SQL Server)
```
- Classic MVC-style controllers
- EF6 on .NET 10 (compatibility mode)
- Azure services: Blob Storage, Table Storage, Application Insights
- External: Vzaar video, SendGrid email, FTP import/export, PDF service

### Migration Track: Microservices with Clean Architecture
```
YARP Gateway (port 8080)
  ├─ /identity/*     → Identity.API
  ├─ /students/*     → StudentService
  ├─ /api/assessments/* → AssessmentService
  ├─ /api/benchmarks/*  → AssessmentManagement
  ├─ /api/intervention-*/ → InterventionService
  ├─ /api/staff/*    → StaffService
  ├─ /api/sections/* → SectionService
  └─ /api/students/* → MockServer (dev)
            ↓
     PostgreSQL (per-service DBs)
     ├─ student-db
     ├─ intervention-db
     ├─ staff-db
     └─ section-db

Migration React UI (port 3100)
```

Each microservice follows Clean Architecture:
```
Api/ → Domain/ → Infrastructure/
  Controllers    Entities    DbContext + Migrations
  DTOs           Interfaces  Repositories
```

## 5. Dependencies

### Upgrade Track
| Category | Dependency | Notes |
|----------|-----------|-------|
| ORM | Entity Framework 6 | .NET 10 compatibility mode |
| Gateway | YARP | Aspire.Hosting.Yarp |
| Storage | Azure Blob/Table Storage | Connection strings |
| Telemetry | Application Insights | OpenTelemetry export |
| Video | Vzaar API | Token + Secret auth |
| Email | SendGrid | API key auth |
| PDF | Custom PDF server | IP + Port + FTP |
| Import | FTP | Bulk data import/export |

### Migration Track
| Category | Dependency | Notes |
|----------|-----------|-------|
| Database | PostgreSQL | Per-service databases |
| Gateway | YARP | Route-based decomposition |
| Auth | Entra ID (Azure AD) | `EntraAuthController` |
| Mock | MockServer | Development-time stubs |
| Orchestration | Aspire | Service discovery + health |

## 6. Integration Points

### Cross-Service Integrations
| From | To | Pattern | Evidence |
|------|-----|---------|----------|
| Upgrade → SQL Server | DB | EF6 connection | DistrictContext + LoginContext |
| Upgrade → Azure Blob | Storage | Connection string | AppHost env var |
| Upgrade → Azure Table | Storage | Connection string | AppHost env var |
| Upgrade → App Insights | Telemetry | Connection string | OpenTelemetry |
| Upgrade → SendGrid | Email | API key | AppHost env var |
| Upgrade → Vzaar | Video | Token + Secret | AppHost env var |
| Upgrade → PDF Server | PDF | FTP + IP | AppHost env vars |
| Migration → PostgreSQL | DB | Aspire service discovery | Per-service DBs |
| YARP → All Services | Gateway | Route patterns | AppHost YARP config |
| React UI → YARP | Frontend | Service discovery | Aspire env injection |

### Dual-Track Coexistence
Both tracks run simultaneously via Aspire with different port ranges:
- Upgrade: API port 5000, React port 3000, Gateway port 8080
- Migration: Gateway port 8080 (separate Aspire instance), React port 3100

## 7. Testing Coverage

### Test Directories
- CI workflow: `.github/workflows/ci.yml`
- E2E/Visual: `.github/workflows/scheduled-e2e-visual.yml`
- Reference source includes test infrastructure

**Testing Maturity: LOW-MODERATE** — CI pipeline exists but inline test coverage sparse relative to 802 C# source files.

## 8. Configuration & Infrastructure

### Secret Management (Upgrade Track — 18+ parameters)
| Category | Secrets |
|----------|---------|
| Database | LoginConnection |
| Azure | BlobStorage, WebJobsStorage, WebJobsDashboard, TableStorage |
| Telemetry | ApplicationInsightsConnectionString |
| Video | VzaarToken, VzaarSecret |
| Email | SendGridApiKey, SendGridUser, SendGridPassword |
| PDF | PdfKey, PdfUserName, PdfPassword, PdfServerIp, PdfServerPort |
| FTP | FtpSite, FtpUsername, FtpPassword |
| Admin | RolloverEmail, AdminEmail, RebexKey, DistrictId |

### CI/CD
- `ci.yml` — main CI pipeline
- `scheduled-e2e-visual.yml` — scheduled E2E and visual regression testing

## 9. Security Considerations

- **18+ secrets** in AppHost config — need Azure Key Vault integration
- **EF6 on .NET 10** — compatibility layer may have unpatched CVEs
- **FTP integration** — insecure file transfer protocol still in use
- **No rate limiting** visible in Upgrade track
- **Entra ID** — Migration track properly using Azure AD for auth

## 10. Technical Debt Signals

1. **DUAL-TRACK STRATEGY** — Maintaining two backends simultaneously is unsustainable (802 C# files total)
2. **EF6 on .NET 10** — Legacy ORM in compatibility mode; migration to EF Core needed
3. **104 entities in 2 DbContexts** — Monolithic data model with no bounded context separation
4. **FTP dependency** — Insecure, legacy integration; should migrate to Azure Blob uploads
5. **18+ hardcoded secret parameters** — Need Azure Key Vault or managed identity
6. **Active development (1,786 commits)** — Latest commit Feb 6, 2026; 48% by copilot-swe-agent
7. **385 endpoints in monolith** — Extremely large API surface for single service
8. **Migration only 17% complete** — 64 of ~385 endpoints migrated to microservices

## 11. Confidence Score

| Dimension | Score | Notes |
|-----------|-------|-------|
| Completeness | 90% | AppHost files, controller count, entity count verified |
| Accuracy | 90% | Direct file inspection of both tracks |
| Currency | 90% | Active project — latest commit Feb 6, 2026 |
| **Overall** | **90%** | |
