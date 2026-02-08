---
repo: NorthStarET
remote: https://github.com/crisweber2600/NorthStarET.git
default_branch: main
generated_at: 2026-02-07T12:00:00Z
domain: NextGen
service: NorthStarET
generator: lens-sync
confidence: 0.88
---

# NorthStarET — API Surface

**Total Endpoints:** 449 (385 Upgrade + 64 Migration)
**Auth:** JWT Bearer (Upgrade), Entra ID / JWT (Migration)

## Upgrade Track — 33 Controllers, 385 Endpoints

**Base Path:** `/api/` (proxied via YARP at port 8080)
**Source:** `Src/Upgrade/Backend/NS4.WebAPI/Controllers/`

### Assessment Domain

| Controller | Endpoints (est.) | Purpose |
|---|---|---|
| `AssessmentController` | 20+ | Assessment CRUD, assignment, scoring |
| `AssessmentAvailabilityController` | 5+ | Assessment availability windows |
| `BenchmarkController` | 10+ | Benchmark test management |
| `ProbeController` | 5+ | Probe assessment tools |
| `DataEntryController` | 15+ | Assessment data entry forms |

### Student Domain

| Controller | Endpoints (est.) | Purpose |
|---|---|---|
| `StudentController` | 15+ | Student CRUD, search, roster |
| `StudentDashboardController` | 5+ | Student performance dashboards |

### Intervention Domain

| Controller | Endpoints (est.) | Purpose |
|---|---|---|
| `InterventionDashboardController` | 5+ | Intervention overview |
| `InterventionGroupController` | 15+ | Intervention group management |
| `InterventionGroupDataEntryController` | 10+ | Intervention progress data entry |
| `InterventonToolkitController` | 5+ | Toolkit management (note: typo in original) |

### Section/Classroom Domain

| Controller | Endpoints (est.) | Purpose |
|---|---|---|
| `SectionController` | 15+ | Section/class management |
| `SectionDataEntryController` | 10+ | Section data entry |
| `SectionReportController` | 10+ | Section reports/analytics |

### Staff Domain

| Controller | Endpoints (est.) | Purpose |
|---|---|---|
| `StaffController` | 10+ | Staff management |

### Team Meeting Domain

| Controller | Endpoints (est.) | Purpose |
|---|---|---|
| `TeamMeetingController` | 20+ | RTI team meeting management |

### Visualization Domain

| Controller | Endpoints (est.) | Purpose |
|---|---|---|
| `LineGraphController` | 5+ | Line graph data |
| `StackedBarGraphController` | 5+ | Stacked bar chart data |

### Admin Domain

| Controller | Endpoints (est.) | Purpose |
|---|---|---|
| `DistrictSettingsController` | 10+ | District configuration |
| `CalendarController` | 5+ | Academic calendar |
| `RosterRolloverController` | 5+ | Year-end roster rollover |
| `ExportDataController` | 5+ | Data export/download |
| `FilterOptionsController` | 5+ | Filter/search parameters |
| `NavigationController` | 3+ | Menu/navigation data |
| `PersonalSettingsController` | 3+ | User preferences |

### Auth & File Domain

| Controller | Endpoints (est.) | Purpose |
|---|---|---|
| `AuthController` | 5+ | Authentication |
| `PasswordResetController` | 5 | Password reset flow |
| `FileUploaderController` | 5+ | File upload |
| `AzureDownloadController` | 3+ | Azure blob download |
| `VideoController` | 5 | Vzaar video management |
| `PrintController` | 5+ | Print generation |

### Summary: Upgrade Track

| Domain | Controllers | Est. Endpoints |
|---|---|---|
| Assessment | 5 | 55+ |
| Student | 2 | 20+ |
| Intervention | 4 | 35+ |
| Section/Classroom | 3 | 35+ |
| Staff | 1 | 10+ |
| Team Meetings | 1 | 20+ |
| Visualization | 2 | 10+ |
| Admin | 6 | 31+ |
| Auth & Files | 6 | 28+ |
| **Total** | **33** | **~385** |

---

## Migration Track — 17 Controllers, 64 Endpoints (7 Services)

**Base Path:** Varies by service (proxied via YARP at port 8080)
**Source:** `Src/Migration/Backend/`

### Identity Service
**YARP Path:** `/identity/*`

| Controller | Endpoints (est.) | Purpose |
|---|---|---|
| `AuthController` | 4 | Login, register, token management |
| `EntraAuthController` | 3 | Azure AD (Entra ID) auth flows |
| `SessionController` | 3 | Session management |

### StudentService
**YARP Path:** `/students/*`

| Controller | Endpoints (est.) | Purpose |
|---|---|---|
| `StudentsController` | 5 | Student CRUD |
| `StudentAttributesController` | 3 | Student metadata |
| `StudentNotesController` | 2 | Student notes |

### AssessmentService
**YARP Path:** `/api/assessments/*`

| Controller | Endpoints (est.) | Purpose |
|---|---|---|
| `AssessmentController` | 5 | Assessment management |

### AssessmentManagement
**YARP Path:** `/api/benchmarks/*`

| Controller | Endpoints (est.) | Purpose |
|---|---|---|
| `BenchmarksController` | 5 | Benchmark tests |

### InterventionService
**YARP Path:** `/api/intervention-*/*`

| Controller | Endpoints (est.) | Purpose |
|---|---|---|
| `InterventionAttendanceController` | 3 | Attendance tracking |
| `InterventionDashboardController` | 3 | Intervention overview |
| `InterventionGroupController` | 5 | Group management |
| `InterventionToolkitController` | 4 | Toolkit CRUD |

### StaffManagement
**YARP Path:** `/api/staff/*`

| Controller | Endpoints (est.) | Purpose |
|---|---|---|
| `StaffController` | 5 | Staff CRUD |
| `StaffSettingsController` | 3 | Staff preferences |

### SectionService
**YARP Path:** `/api/sections/*`

| Controller | Endpoints (est.) | Purpose |
|---|---|---|
| `SectionsController` | 5 | Section management |
| `RolloverController` | 3 | Year-end rollover |
| `RosterController` | 3 | Roster management |

### Summary: Migration Track

| Service | Controllers | Est. Endpoints | Database |
|---|---|---|---|
| Identity | 3 | 10 | (shared) |
| StudentService | 3 | 10 | student-db |
| AssessmentService | 1 | 5 | (shared) |
| AssessmentManagement | 1 | 5 | (shared) |
| InterventionService | 4 | 15 | intervention-db |
| StaffManagement | 2 | 8 | staff-db |
| SectionService | 3 | 11 | section-db |
| **Total** | **17** | **~64** | **4 databases** |

---

## Migration Coverage

| Domain | Upgrade Endpoints | Migration Endpoints | Coverage |
|---|---|---|---|
| Assessment | 55+ | 10 | ~18% |
| Student | 20+ | 10 | ~50% |
| Intervention | 35+ | 15 | ~43% |
| Section | 35+ | 11 | ~31% |
| Staff | 10+ | 8 | ~80% |
| Auth | 10+ | 10 | ~100% |
| Team Meetings | 20+ | 0 | 0% |
| Visualization | 10+ | 0 | 0% |
| Admin | 31+ | 0 | 0% |
| **Overall** | **~385** | **~64** | **~17%** |

## Gaps & Unknowns

- **[UNVERIFIED]** Exact endpoint counts — estimated from controller inspection
- **[UNKNOWN]** Pagination patterns (query string vs header)
- **[UNKNOWN]** Versioning strategy for API endpoints
- **[UNKNOWN]** Rate limiting configuration in either track
- **[NOTE]** The typo `InterventonToolkitController` is carried forward from OldNorthStar
