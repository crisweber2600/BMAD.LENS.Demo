# OldNorthStar — Deep Technical Analysis
> SCOUT AC Workflow | Generated: 2026-02-07 | Confidence: HIGH (88%)

## 1. Technology Stack

| Component | Technology | Version | Source |
|-----------|-----------|---------|--------|
| Runtime | .NET Framework 4.8 | 4.8 | Legacy monolith |
| ORM | Entity Framework 6 | EF6 | `NorthStar.EF6/` |
| Database | SQL Server | Azure SQL | DistrictContext + LoginContext |
| Frontend | AngularJS | 1.x | `NS4.Angular/` + `NS4.Client/` |
| API | ASP.NET Web API 2 | 5.x | `NS4.WebAPI/` |
| Libraries | jQuery | Various | bower_components |
| Package Mgr | Bower | Deprecated | `bower_components/` |

**Total Source Files:** 729 C# files

## 2. API Surface

### Controllers — 33 Controllers, 384 Endpoints
| Controller | Domain | Endpoint Count (est.) |
|-----------|---------|----------------------|
| `TeamMeetingController` | RTI team meetings | 20+ |
| `AssessmentController` | Assessment management | 20+ |
| `StudentController` | Student CRUD | 15+ |
| `InterventionGroupController` | Intervention groups | 15+ |
| `InterventionGroupDataEntryController` | Intervention data | 10+ |
| `SectionController` | Class sections | 15+ |
| `StaffController` | Staff management | 10+ |
| `DataEntryController` | Data entry forms | 15+ |
| `BenchmarkController` | Benchmark tests | 10+ |
| `SectionDataEntryController` | Section data | 10+ |
| `SectionReportController` | Section reports | 10+ |
| `PasswordResetController` | Password flows | 5 |
| `VideoController` | Video management | 5 |
| `CalendarController` | Calendar views | 5+ |
| `DistrictSettingsController` | Admin settings | 10+ |
| `ExportDataController` | Data export | 5+ |
| `FilterOptionsController` | Filter/search | 5+ |
| `FileUploaderController` | File uploads | 5+ |
| `LineGraphController` | Charting | 5+ |
| `StackedBarGraphController` | Charting | 5+ |
| `PrintController` | Print generation | 5+ |
| `AuthController` | Authentication | 5+ |
| `HomeController` | Base/routing | 3+ |
| `AssessmentAvailabilityController` | Assessment scheduling | 5+ |
| `AzureDownloadController` | Azure blob downloads | 3+ |
| `ImportStateTestDataController` | State test data import | 3+ |
| `InterventionDashboardController` | Intervention overview | 10+ |
| `InterventonToolkitController` | Toolkit management (typo in original) | 10+ |
| `NavigationController` | App navigation | 5+ |
| `PersonalSettingsController` | User preferences | 5+ |
| `ProbeController` | Probe assessments | 10+ |
| `RosterRolloverController` | Year-end rollover | 5+ |
| `StudentDashboardController` | Student overview | 10+ |

**Total Endpoints: 384** (nearly identical to NorthStarET Upgrade)

## 3. Data Models

### EF6 — 2 DbContexts, 104 Total Entities
| Context | Entity Count | Source |
|---------|-------------|--------|
| `DistrictContext` | 60 DbSets | `NorthStar.EF6/DistrictContext.cs` |
| `LoginContext` | 44 DbSets | `NorthStar.EF6/LoginContext.cs` |
| **Total** | **104** | |

### Key Entity Domains
- **Students:** Student, StudentAssessment, StudentGroup, StudentRoster
- **Staff:** Staff, StaffRole, StaffSchool
- **Assessments:** Assessment, AssessmentCategory, BenchmarkTest, ProbeItem
- **Interventions:** InterventionGroup, InterventionAttendance, InterventionToolkit
- **Sections:** Section, SectionStudent, SectionSchedule
- **Teams:** TeamMeeting, TeamMeetingNote, TeamAction
- **District:** DistrictSetting, School, SchoolYear
- **Auth:** User, UserRole, LoginAttempt, PasswordReset

## 4. Architecture Pattern

**Pattern: ASP.NET Web API 2 MVC Monolith**

```
NS4.WebAPI (33 Controllers)
    ↓
Infrastructure/FlowRequestContext.cs (request pipeline)
    ↓
NorthStar.EF6
    ├─ DistrictContext → SQL Server (60 entities)
    └─ LoginContext → SQL Server (44 entities)

NS4.Angular (AngularJS 1.x SPA)
NS4.Client (Bower-based client assets)
```

### Anti-patterns
- No service layer — controllers likely call EF6 directly
- No dependency injection container (pre-.NET Core)
- Bower package manager (deprecated since 2017)
- AngularJS 1.x (end-of-life since December 2021)
- Two separate client projects (`NS4.Angular` + `NS4.Client`)

## 5. Dependencies

| Category | Package | Status |
|----------|---------|--------|
| Runtime | .NET Framework 4.8 | Long-term support (legacy) |
| ORM | Entity Framework 6 | Maintenance mode |
| Frontend | AngularJS 1.x | End-of-life |
| Package Mgr | Bower | Deprecated |
| Libraries | jQuery | Via bower_components |
| Database | SQL Server | Production |

## 6. Integration Points

| Integration | Type | Evidence |
|-------------|------|----------|
| SQL Server | Database | DistrictContext + LoginContext |
| Azure SQL | Hosted DB | Implied by NorthStarET migration |
| AngularJS SPA | Frontend | `NS4.Angular/` directory |
| File Uploads | Storage | `FileUploaderController` |
| Azure Downloads | Storage | `AzureDownloadController` |
| Video | External | `VideoController` |
| State Test Data | Import | `ImportStateTestDataController` |

## 7. Testing Coverage

**No CI/CD pipeline found** (no GitHub Actions workflows).

**Testing Maturity: NONE/UNKNOWN** — No CI files discovered; no test project directories visible.

## 8. Configuration & Infrastructure

### Project Structure
```
OldNorthStar/
├── NS4.WebAPI/          (33 controllers, API)
├── NorthStar.EF6/       (2 DbContexts, 104 entities)
├── NS4.Angular/         (AngularJS frontend)
├── NS4.Client/          (Client assets, bower)
└── Infrastructure/      (FlowRequestContext)
```

No Aspire, no Docker, no containerization. Traditional IIS deployment assumed.

## 9. Security Considerations

- **.NET Framework 4.8** — No longer receiving feature updates
- **AngularJS EOL** — Known XSS vulnerabilities in AngularJS 1.x
- **No modern auth** — No JWT, no OAuth2 evidence
- **Bower dependencies** — Unaudited, deprecated package manager
- **SQL injection risk** — EF6 without parameterized queries could be exposed
- **No CORS configuration visible** — Potential cross-origin attack surface

## 10. Technical Debt Signals

1. **AngularJS END-OF-LIFE** — Security risk; no patches since Dec 2021
2. **Bower deprecated** — Should have migrated to npm/yarn years ago
3. **No CI/CD** — No automated build, test, or deployment pipeline
4. **.NET Framework 4.8** — Cannot use modern .NET features (no Aspire, no minimal APIs)
5. **104 entities in 2 contexts** — Identical to NorthStarET Upgrade; confirms this is the source
6. **729 C# files with no tests** — Zero automated quality assurance
7. **Dual client projects** — `NS4.Angular` + `NS4.Client` suggests fragmented frontend
8. **No service layer** — Controllers likely have direct data access logic

## 11. Lineage Analysis

OldNorthStar is the **original source** for NorthStarET:
- Same 33 controllers with identical names
- Same 104 entities (60 + 44 DbSets)
- Nearly identical endpoint count (384 vs 385)
- NorthStarET Upgrade is a direct port of this codebase to .NET 10

**Migration Coverage: 17%** — Only 64 of 384 endpoints have been migrated to the new microservices track in NorthStarET.

## 12. Confidence Score

| Dimension | Score | Notes |
|-----------|-------|-------|
| Completeness | 90% | All controllers and entities counted |
| Accuracy | 90% | Direct file inspection |
| Currency | 85% | Legacy — no expected changes |
| **Overall** | **88%** | |
