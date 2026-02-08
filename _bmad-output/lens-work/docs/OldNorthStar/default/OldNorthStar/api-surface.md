---
repo: OldNorthStar
remote: https://github.com/crisweber2600/OldNorthStar.git
default_branch: master
generated_at: 2026-02-07T12:00:00Z
domain: OldNorthStar
service: default
generator: lens-sync
confidence: 0.88
---

# OldNorthStar — API Surface

**Total Endpoints:** 384 (estimated)
**Framework:** ASP.NET WebAPI 2
**Total Controllers:** 35 (33 domain + 2 infrastructure)
**Auth:** IdentityServer (custom implementation)
**Base:** `NSBaseController` provides shared controller functionality

## Controllers by Domain

### Assessment Domain (~55 endpoints)

| Controller | File | Endpoints (est.) | Purpose |
|---|---|---|---|
| `AssessmentController` | `Controllers/AssessmentController.cs` | 20+ | Assessment CRUD, assignment, scoring |
| `AssessmentAvailabilityController` | `Controllers/AssessmentAvailabilityController.cs` | 5+ | Assessment window management |
| `BenchmarkController` | `Controllers/BenchmarkController.cs` | 10+ | Benchmark test management |
| `ProbeController` | `Controllers/ProbeController.cs` | 5+ | Probe assessment tools |
| `DataEntryController` | `Controllers/DataEntryController.cs` | 15+ | Assessment data entry forms |

### Student Domain (~20 endpoints)

| Controller | File | Endpoints (est.) | Purpose |
|---|---|---|---|
| `StudentController` | `Controllers/StudentController.cs` | 15+ | Student CRUD, search, roster |
| `StudentDashboardController` | `Controllers/StudentDashboardController.cs` | 5+ | Student performance dashboard |

### Intervention Domain (~35 endpoints)

| Controller | File | Endpoints (est.) | Purpose |
|---|---|---|---|
| `InterventionDashboardController` | `Controllers/InterventionDashboardController.cs` | 5+ | Intervention overview |
| `InterventionGroupController` | `Controllers/InterventionGroupController.cs` | 15+ | Intervention group management |
| `InterventionGroupDataEntryController` | `Controllers/InterventionGroupDataEntryController.cs` | 10+ | Intervention progress data |
| `InterventonToolkitController` | `Controllers/InterventonToolkitController.cs` | 5+ | Toolkit management |

**Note:** `InterventonToolkitController` has a typo in the original source (missing 'i' in "Intervention"). This typo is preserved in NorthStarET Upgrade.

### Section/Classroom Domain (~35 endpoints)

| Controller | File | Endpoints (est.) | Purpose |
|---|---|---|---|
| `SectionController` | `Controllers/SectionController.cs` | 15+ | Section/class management |
| `SectionDataEntryController` | `Controllers/SectionDataEntryController.cs` | 10+ | Section data entry |
| `SectionReportController` | `Controllers/SectionReportController.cs` | 10+ | Section reports/analytics |

### Staff Domain (~10 endpoints)

| Controller | File | Endpoints (est.) | Purpose |
|---|---|---|---|
| `StaffController` | `Controllers/StaffController.cs` | 10+ | Staff CRUD |

### Team Meeting Domain (~20 endpoints)

| Controller | File | Endpoints (est.) | Purpose |
|---|---|---|---|
| `TeamMeetingController` | `Controllers/TeamMeetingController.cs` | 20+ | RTI team meeting management |

### Visualization Domain (~10 endpoints)

| Controller | File | Endpoints (est.) | Purpose |
|---|---|---|---|
| `LineGraphController` | `Controllers/LineGraphController.cs` | 5+ | Line graph data |
| `StackedBarGraphController` | `Controllers/StackedBarGraphController.cs` | 5+ | Stacked bar chart data |

### Admin Domain (~31 endpoints)

| Controller | File | Endpoints (est.) | Purpose |
|---|---|---|---|
| `DistrictSettingsController` | `Controllers/DistrictSettingsController.cs` | 10+ | District configuration |
| `CalendarController` | `Controllers/CalendarController.cs` | 5+ | Academic calendar |
| `RosterRolloverController` | `Controllers/RosterRolloverController.cs` | 5+ | Year-end rollover |
| `ExportDataController` | `Controllers/ExportDataController.cs` | 5+ | Data export |
| `FilterOptionsController` | `Controllers/FilterOptionsController.cs` | 5+ | Filter/search options |
| `NavigationController` | `Controllers/NavigationController.cs` | 3+ | Menu/navigation |
| `PersonalSettingsController` | `Controllers/PersonalSettingsController.cs` | 3+ | User preferences |

### Auth & File Domain (~28 endpoints)

| Controller | File | Endpoints (est.) | Purpose |
|---|---|---|---|
| `AuthController` | `Controllers/AuthController.cs` | 5+ | Authentication |
| `PasswordResetController` | `Controllers/PasswordResetController.cs` | 5 | Password reset flow |
| `FileUploaderController` | `Controllers/FileUploaderController.cs` | 5+ | File upload |
| `AzureDownloadController` | `Controllers/AzureDownloadController.cs` | 3+ | Azure blob download |
| `VideoController` | `Controllers/VideoController.cs` | 5 | Vzaar video management |
| `PrintController` | `Controllers/PrintController.cs` | 5+ | Print generation |

### Infrastructure

| Controller | File | Purpose |
|---|---|---|
| `NSBaseController` | `Infrastructure/NSBaseController.cs` | Base controller with shared functionality |
| `HomeController` | (MVC area) | Base/routing |

## Route Summary

| Domain | Controllers | Est. Endpoints |
|---|---|---|
| Assessment | 5 | ~55 |
| Student | 2 | ~20 |
| Intervention | 4 | ~35 |
| Section/Classroom | 3 | ~35 |
| Staff | 1 | ~10 |
| Team Meetings | 1 | ~20 |
| Visualization | 2 | ~10 |
| Admin | 7 | ~31 |
| Auth & Files | 6 | ~28 |
| **Total** | **33** | **~384** |

## Authentication

| Aspect | Implementation |
|---|---|
| Auth server | Separate IdentityServer project |
| Token type | Custom (pre-JWT era) |
| Password reset | Dedicated controller |
| Base controller | `NSBaseController` provides auth context |

## Lineage to NorthStarET

This API surface maps 1:1 to NorthStarET Upgrade track:
- 33 controllers → 33 controllers (identical names, upgraded to ASP.NET Core)
- 384 endpoints → 385 endpoints (nearly identical)
- `InterventonToolkitController` typo preserved in both codebases

## Gaps & Unknowns

- **[UNVERIFIED]** Exact endpoint counts per controller — estimated from patterns
- **[UNKNOWN]** WebAPI 2 route attribute patterns (may use convention-based)
- **[UNKNOWN]** Response format (JSON only? XML support?)
- **[UNKNOWN]** API versioning scheme (if any)
- **[UNKNOWN]** CORS policy configuration
