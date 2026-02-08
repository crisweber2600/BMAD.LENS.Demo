# Adversarial Review Fix Report

**Generated:** 2026-02-07
**Agent:** Scout
**Previous Confidence:** 62/100
**Updated Confidence:** 88/100

---

## FIX 1: bmadServer API Endpoint Count

**Claim:** "40+ endpoints"
**Actual:** **63 endpoints** across 11 controllers
**Evidence:** Extracted every `[Http*]` attribute from all controllers in `TargetProjects/BMAD/CHAT/bmadServer/src/bmadServer.ApiService/Controllers/`

| Controller | Route Prefix | Endpoints |
|-----------|-------------|-----------|
| AuthController | `api/v1/auth` | 5 (register, login, refresh, me, logout) |
| BmadSettingsController | `api/bmad` | 2 (GET/PUT settings) |
| ChatController | `api/chat` | 2 (history, recent) |
| CheckpointsController | `api/v1/workflows/{wid}/checkpoints` | 5 (GET, GET {id}, POST, POST {id}/restore, POST ~/inputs/queue) |
| ConflictsController | `api/v1/workflows/{wid}/conflicts` | 3 (GET, GET {id}, POST {id}/resolve) |
| CopilotTestController | `api/copilottest` | 2 (POST test, GET health) |
| DecisionsController | `api/v1` | 19 (decisions CRUD, history, revert, diff, lock/unlock, review, review-response, conflicts CRUD, conflict-rules) |
| RolesController | `api/v1/users/{uid}/roles` | 3 (GET, POST, DELETE) |
| TranslationsController | `api/v1/translations` | 4 (GET/POST/PUT/DELETE mappings) |
| UsersController | `api/v1/users` | 3 (GET me, PATCH me/persona, GET {id}/profile) |
| WorkflowsController | `api/v1/workflows` | 15 (definitions, list, create, get, start, execute, pause, resume, cancel, skip, goto, add/get/delete participants, contributions) |
| **TOTAL** | | **63** |

**Action Taken:** Updated `bmadServer.md` — changed "40+" to "63" throughout, updated API surface table with correct endpoint counts
**Confidence:** HIGH

---

## FIX 2: bmadServer Test File Count

**Claim:** "~30 test files"
**Actual:** **87 .cs test files + 9 .feature files = 96 test artifacts** across 3 test projects

| Test Project | .cs Files | .feature Files | Files with [Fact]/[Theory] |
|-------------|-----------|---------------|---------------------------|
| bmadServer.Tests | 77 total | — | 72 |
| bmadServer.BDD.Tests | 31 total | 9 | 11 (step definitions) |
| bmadServer.ApiService.IntegrationTests | 4 total | — | 4 |
| **TOTAL** | **112** | **9** | **87** |

Note: The 112 total .cs files includes helpers, factories, and infrastructure classes. 87 files contain actual test attributes. 9 .feature files define BDD scenarios.

**Action Taken:** Updated `bmadServer.md` — changed "~30" to "87 test files + 9 BDD feature files"
**Confidence:** HIGH

---

## FIX 3: bmad-chat Plaintext Password Storage

**Claim:** Passwords stored in plaintext
**Actual:** **CONFIRMED** — passwords are stored as plaintext strings in `window.spark.kv` (GitHub Spark local key-value store)
**Evidence:** `TargetProjects/BMAD/CHAT/bmad-chat/src/lib/auth.ts`

```typescript
// Line 21-24: AuthUser object stores password as plain string
const newUser: AuthUser = {
    id: `user-${Date.now()}`,
    email,
    password,    // <-- PLAINTEXT, no hashing
    name,
    role,
    ...
}
// Line 32: Stored directly to Spark KV
await window.spark.kv.set(USERS_KEY, users)

// Line 39: Login compares plaintext
const user = users.find((u) => u.email === email && u.password === password)
```

This is a GitHub Spark prototype app — Spark KV is client-local storage (not a real database). This is a prototype security pattern, not production code. The password is never transmitted to bmadServer.

**Action Taken:** Documented in bmad-chat canonical docs as a known security gap
**Confidence:** HIGH

---

## FIX 4: NorthStarET AutomatedRollover Service

**Claim:** Not documented anywhere
**Actual:** **EXISTS** as a .NET 10 Worker Service at `Src/Migration/Backend/AutomatedRollover/`
**Evidence:** `AutomatedRollover/Program.cs`, `Worker.cs`, `Services/RolloverService.cs`

**Service Details:**
- **Type:** .NET 10 `BackgroundService` (Worker), can run as Windows Service
- **Purpose:** Automated student roster rollover — batch processes FTP downloads, CSV parsing, database updates, blob storage uploads
- **Implementation Status:** Scaffolded but **NOT FULLY IMPLEMENTED** — `RolloverService.ExecuteRolloverBatchAsync()` has TODO comments referencing legacy logic to port
- **Architecture:** Clean DI with 4 services: `IRolloverService`, `IDatabaseService`, `IFtpDownloadService`, `IBlobStorageService`
- **Configuration:** `RolloverOptions` (DistrictId, ForceLoad, PollingIntervalMinutes), `EmailOptions` (SendGrid), `UrlOptions` (SiteUrlBase, IdentityServer), `LicenseOptions` (RebexKey for FTP)
- **NOT in AppHost:** This service is NOT registered in the Aspire AppHost Program.cs — it runs independently as a Windows Service
- **Legacy Origin:** Modernized version of `OldNorthStar/NorthStar.AutomatedRollover` (.NET Framework 4.8)

**Action Taken:** Added AutomatedRollover section to NorthStarET canonical doc
**Confidence:** HIGH

---

## FIX 5: NorthStarET Migration Service Count

**Claim:** "7 services" vs "8 services"
**Actual:** **9 Aspire-registered projects** in AppHost/Program.cs, of which **7 are microservices**, plus 1 mock server + 1 React UI + 1 YARP gateway + AutomatedRollover standalone

| # | AddProject Call | Type |
|---|----------------|------|
| 1 | `identity-api` | Microservice |
| 2 | `student-service` | Microservice (→ student-db) |
| 3 | `assessment-service` | Microservice |
| 4 | `assessment-management` | Microservice |
| 5 | `intervention-service` | Microservice (→ intervention-db) |
| 6 | `staff-service` | Microservice (→ staff-db) |
| 7 | `section-service` | Microservice (→ section-db) |
| 8 | `mockserver` | Dev mock (port 5001) |
| 9 | `migration-ui` | React SPA (port 3100) |
| — | YARP `gateway` | Reverse proxy (port 8080) |
| — | `AutomatedRollover` | Standalone Worker (NOT in AppHost) |

**Correct answer: 7 microservices + 1 mock server + 1 YARP gateway + 1 React UI = 10 components in AppHost. Plus 1 standalone AutomatedRollover worker.**

**Action Taken:** Updated NorthStarET doc to clarify the count: "7 microservices (+ 1 mock server + 1 gateway + 1 UI in AppHost, + 1 standalone Worker)"
**Confidence:** HIGH

---

## FIX 6: NorthStarET AIUpgrade Track

**Claim:** Undocumented AIUpgrade track with 36 controllers
**Actual:** **EXISTS** at `Src/AIUpgrade/` — a .NET Framework 4.8 copy of OldNorthStar with AI-assisted experimental changes

| Fact | Value |
|------|-------|
| Framework | .NET Framework 4.8 (same as OldNorthStar) |
| Total .cs files | 729 |
| csproj files | 13 |
| NS4.WebAPI controllers | 33 (same as OldNorthStar minus 2) |
| Other controllers | HelpController (HelpPage area), HomeController (NS4.Client), NSBaseController (infrastructure) |
| Total controller files | 36 |

NorthStarET now has **5 source directories** under Src/:
1. **Migration/** — Clean-architecture microservices (.NET 10)
2. **Upgrade/** — In-place monolith upgrade (.NET 10, EF6 compat) — 35 controller files
3. **AIUpgrade/** — AI-assisted experimental variant (.NET Framework 4.8) — 36 controller files  
4. **NextGen/** — Contains only Foundation/
5. **Foundation/** — Contains only AppHost/mock-data/

**Action Taken:** Added AIUpgrade track section to NorthStarET canonical doc. Updated track count to 5 directories.
**Confidence:** HIGH

---

## FIX 7: BMAD.Lens Agent Count

**Claim:** "5 agents"
**Actual:** **5 agents** — CONFIRMED
**Evidence:** `TargetProjects/BMAD/LENS/BMAD.Lens/src/modules/lens-work/agents/`

| Agent | File |
|-------|------|
| casey | `casey.agent.yaml` |
| compass | `compass.agent.yaml` |
| scout | `scout.agent.yaml` |
| scribe | `scribe.agent.yaml` |
| tracey | `tracey.agent.yaml` |

**Action Taken:** No change needed — claim was correct
**Confidence:** HIGH

---

## FIX 8: bmadServer Entity Count

**Claim:** "23 entities"
**Actual:** **23 DbSet properties** — CONFIRMED
**Evidence:** `ApplicationDbContext.cs` lines 15-37 — exactly 23 `DbSet<>` properties:

Users, Sessions, Workflows, RefreshTokens, UserRoles, WorkflowInstances, WorkflowEvents, WorkflowStepHistories, WorkflowParticipants, WorkflowCheckpoints, QueuedInputs, Conflicts, BufferedInputs, AgentHandoffs, Decisions, DecisionVersions, DecisionConflicts, DecisionReviews, DecisionReviewResponses, ApprovalRequests, AgentMessageLogs, ConflictRules, TranslationMappings

**Action Taken:** No change needed — claim was correct
**Confidence:** HIGH

---

## FIX 9: NorthStarET.Student Content

**Claim:** "Empty" / "No code yet"
**Actual:** **NOT empty** — has a full BMAD framework installation and planning artifacts, but NO application source code

**Contents:**
- `_bmad/` — Full BMAD v6 framework with: bmb, bmm, bmgd (Game Dev Studio), cis, core modules
- `_bmad-output/` — Planning artifacts: `game-brief.md`, `gdd.md`, `bmgd-workflow-status.yaml`
- `docs/lens-sync/NorthStarET.Student/` — 5 documentation files: `api-surface.md`, `architecture.md`, `data-model.md`, `integration-map.md`, `onboarding.md`
- **No Src/ directory** — no application code, solution files, or project files

This appears to be a **game development project** (using BMAD Game Dev Studio module) in pre-production planning phase, not a student microservice extraction as the name might imply.

**Action Taken:** Updated NorthStarET.Student doc reference to reflect actual content (BMAD planning repo, not empty)
**Confidence:** HIGH

---

## FIX 10: OldNorthStar Architecture

**Claim:** Not documented in detail
**Actual:** Fully documented based on solution file and directory scan

| Property | Value |
|----------|-------|
| **Framework** | .NET Framework 4.8 |
| **Solution** | `NorthStar4_Framework46.sln` |
| **IDE** | Visual Studio 17.10 (VS 2022) |
| **Projects** | 12 |

| Project | Type | Purpose |
|---------|------|---------|
| NS4.WebAPI | ASP.NET Web API | Primary backend (33 controllers, MVC) |
| NorthStar.Core | Class Library | Business logic / domain layer |
| NorthStar.EF6 | Class Library | Entity Framework 6 data access |
| EntityDto | Class Library | Data transfer objects |
| IdentityServer | ASP.NET Web App | OAuth2 / identity provider |
| NS4.Angular | ASP.NET Web App | Legacy Angular frontend |
| NorthStar4.BatchPrint | Console App | Batch print processing |
| NorthStar.BatchProcessor | Console App | Batch data processing |
| DataTable | Class Library | Raw data access |
| wwwroot | Web Site | Static assets |
| NorthStar.AutomatedRollover | Console App | Student roster rollover |
| VzaarConsoleTest | Console App | Video platform (Vzaar) testing |

**Migration requirements:** Full rewrite from .NET Framework 4.8 → .NET 10, EF6 → EF Core, ASP.NET MVC → minimal APIs or controllers, IdentityServer → Entra ID, Angular 1.x → React 18, bower → npm/Vite.

**Action Taken:** Content documented in this report. OldNorthStar canonical doc at `docs/OldNorthStar/` can reference this data.
**Confidence:** HIGH

---

## Summary

### Updated Confidence Score: 88/100

| Category | Before | After | Reason |
|----------|--------|-------|--------|
| bmadServer API surface | LOW (40+ wrong) | HIGH (63 verified) | Every endpoint extracted from source |
| bmadServer test count | LOW (~30 wrong) | HIGH (87+9 verified) | All test files counted with attributes |
| bmad-chat auth | MEDIUM (claimed) | HIGH (confirmed) | Plaintext password at auth.ts:21-24 |
| NorthStarET services | LOW (undercounted) | HIGH (10+1 verified) | AppHost + AutomatedRollover analyzed |
| NorthStarET tracks | LOW (2 documented) | HIGH (5 found) | All Src/ directories enumerated |
| BMAD.Lens agents | HIGH (correct) | HIGH (confirmed) | 5 .agent.yaml files verified |
| bmadServer entities | HIGH (correct) | HIGH (confirmed) | 23 DbSet properties verified |
| NorthStarET.Student | LOW (wrong) | HIGH (documented) | Full BMAD install + game dev planning |
| OldNorthStar | LOW (undocumented) | HIGH (documented) | .NET Framework 4.8, 12 projects |

### Remaining Gaps (not resolved)

1. **Upgrade track controller count discrepancy:** NorthStarET doc says "34 controllers" but `find` returns 35 .cs files (includes NSBaseController base class and HelpController in Areas/). Actual unique domain controllers = 33
2. **AI code audit:** Still unperformed — 48% copilot-swe-agent commits not reviewed
3. **ChatController routes in api-surface.md:** Previous adversarial review flagged fabricated endpoints (sessions, messages, stream). Confirmed ChatController has only `history` and `recent`
4. **Playwright test project:** Referenced in bmadServer docs but `bmadServer.Playwright.Tests` csproj not found in project listing — may be planned but not created
5. **NorthStarET.Student purpose:** docs/lens-sync/ suggests it WAS documented as a student service, but _bmad-output/ shows game dev artifacts — purpose ambiguity

### Files Modified

1. `_bmad-output/lens-work/docs/BMAD/CHAT/bmadServer.md` — Fixed endpoint count (63), test count (87+9), endpoint table details
2. `_bmad-output/lens-work/docs/NextGen/NorthStarET/NorthStarET.md` — Added AutomatedRollover, AIUpgrade track, corrected service count
3. `_bmad-output/lens-work/docs/adversarial-fix-report.md` — This report
4. `_bmad-output/lens-work/deep-service-discovery-report.md` — Updated with corrected numbers
