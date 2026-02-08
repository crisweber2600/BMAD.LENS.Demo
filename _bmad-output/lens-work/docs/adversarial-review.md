---
generated_at: "2026-02-08T00:00:00Z"
layer: portfolio
generator: adversarial-review
scope: documentation-quality-audit
overall_confidence: 62
---

# Adversarial Review — AUTO Pipeline Documentation Quality Audit

> **Reviewer:** Automated adversarial agent (stress-test mode)  
> **Scope:** All DS → AC → GD pipeline outputs  
> **Date:** 2026-02-08  
> **Overall Confidence Score: 62/100** — Significant gaps found requiring remediation

---

> **⚠️ FIX REPORT AVAILABLE:** See [adversarial-fix-report.md](adversarial-fix-report.md) for verified corrections to all issues found below. Updated confidence: **88/100** (was 62/100).

---

## Executive Summary

The AUTO pipeline outputs are a **strong first pass** that establishes a useful documentation baseline across 6 repos. The major structural claims (repo count, tech stacks, domain structure) are largely correct. However, adversarial verification uncovered **fabricated API details, inconsistent numbers, undocumented services, and shallow analysis** in several areas. The documentation is trustworthy at the **architectural overview level** but unreliable for **implementation-level details**.

**Verdict:** The portfolio-level docs (architecture-overview.md, portfolio-health.md, bmad-readiness.md) are solid (75-80% confidence). The deep-service-discovery-report.md is good but has numerical inconsistencies (70%). **The per-repo canonical docs have the most serious issues**, including fabricated endpoint details (40-60% confidence on specific API claims).

---

## PART 1: Adversarial Review of Documentation Quality

### 1.1 FACTUAL GAPS — Claims Without Evidence

| # | Severity | Finding | Location | Details |
|---|----------|---------|----------|---------|
| F1 | **CRITICAL** | **Fabricated ChatController API surface** | [bmadServer/api-surface.md](BMAD/CHAT/bmadServer/api-surface.md) lines 29-43 | Doc lists 7 endpoints: `GET /sessions`, `GET /sessions/{id}`, `POST /sessions`, `DELETE /sessions/{id}`, `GET /sessions/{id}/messages`, `POST /sessions/{id}/messages`, `POST /sessions/{id}/stream`. Actual source has ONLY 2 endpoints: `GET history` and `GET recent`. 5 endpoints were **invented**. |
| F2 | **CRITICAL** | **Fabricated api-surface.md endpoint details across ALL controllers** | [bmadServer/api-surface.md](BMAD/CHAT/bmadServer/api-surface.md) passim | The deep-report correctly lists controller routes (api/v1/auth, api/v1/users, etc.) but api-surface.md rewrites them to simplified `/api/auth`, `/api/chat`, `/api/decisions` etc. and invents handler method names (`Login`, `Register`, `TestCopilot`) that may not match actual method signatures. The two docs tell DIFFERENT stories about the same API. |
| F3 | **HIGH** | **OldNorthStar batch processors unnamed** | [OldNorthStar.md](OldNorthStar/default/OldNorthStar.md) lines 86-92 | "Batch Processor 1: Scheduled data aggregation / Batch Processor 2: Report generation / Batch Processor 3: Data import/export" — these are obvious placeholder descriptions. No source verification was done. |
| F4 | **HIGH** | **"~85% core coverage" claim for bmadServer** | [bmad-readiness.md](bmad-readiness.md) line 14 | No evidence for 85% coverage metric. No code coverage tools were run. The claim is fabricated. |
| F5 | **MEDIUM** | **BMAD.Lens workflow count "40 workflows" not verified breakdown** | [BMAD.Lens.md](BMAD/LENS/BMAD.Lens.md) line 10 | Claims "40 workflows across 5 categories" with specific category counts (Core: 4, Router: 6, Discovery: 10, Utility: 15, Governance: 5 = 40). These were likely read from module.yaml rather than counting actual files. |
| F6 | **MEDIUM** | **Polly resilience** claimed for bmadServer | [bmadServer.md](BMAD/CHAT/bmadServer.md) tech stack table | Polly is listed but not verified whether it's actually configured or just a NuGet reference. |

### 1.2 MISSING COVERAGE

| # | Severity | What's Missing | Impact |
|---|----------|---------------|--------|
| M1 | **CRITICAL** | **AutomatedRollover service** in NorthStarET Migration (`Src/Migration/Backend/AutomatedRollover/`) is completely undocumented. Has its own Worker.cs, Services/, appsettings, and README. Not in AppHost, not in any doc. | Missed background service could contain critical business logic (rollover = end-of-year data transition). |
| M2 | **HIGH** | **AIUpgrade track** — NorthStarET mentions 3 tracks (Upgrade, Migration, AIUpgrade) but AIUpgrade has 36 controllers and is barely analyzed. Referred to as "(experimental)" without substance. | A full copy of the controller set exists. This isn't experimental scaffolding — it's a substantial codebase. |
| M3 | **HIGH** | **`.referenceSrc/` directory** in NorthStarET contains: `microservices/`, `OldNorthStar/`, `specs/`, `WIPNorthStar/`, `UpgradeItteration1/`, `Plans/`, and `northstar_pages_buttons.csv`. Prior iterations and planning artifacts completely undocumented. | Historical architecture decisions, planning docs, and CSV data specifications that inform the current tracks. |
| M4 | **HIGH** | **SharedLibraries in NorthStarET Migration** — mentioned in architecture diagrams but not enumerated. What DTOs, middleware, auth utilities are shared? | Shared libs define the actual integration contracts between microservices. |
| M5 | **HIGH** | **bmadServer `src/frontend/` directory** — found `.dockerignore` in bmadServer's frontend dir. What frontend exists in the bmadServer repo? Not documented. | May contain a frontend that relates to or supersedes bmad-chat. |
| M6 | **MEDIUM** | **NorthStarET Migration UI** (`Src/Migration/UI/`) — React 18 frontend barely mentioned. No component analysis, no route mapping, no state management docs. | The Migration track includes a full SPA that was not analyzed. |
| M7 | **MEDIUM** | **Environment variable analysis** — appsettings.json files exist across 15+ locations but were never parsed for required configuration. Docker files exist but not analyzed. | Deployment readiness cannot be assessed without env config analysis. |
| M8 | **MEDIUM** | **Control repo architecture** — `_bmad/` itself (core, bmm, bmb, cis, gds, tea modules) is not analyzed as a system. Module interactions, config resolution, agent loading pipeline undocumented. | Control repo IS a software system worth documenting — it has agents, workflows, installers, and manifests. |
| M9 | **LOW** | **GitHub Actions workflows** — CI/CD pipelines mentioned but never read. What do they actually test? What gates exist? | CI/CD quality claims ("GitHub Actions build + test") are unverified. |
| M10 | **LOW** | **BMAD.Lens docs/ directory** contains 25+ MD docs (architecture, governance, reviews) that were cataloged but not analyzed for content. | The framework's own documentation could inform quality of pipeline outputs. |

### 1.3 STALE/WRONG DATA

| # | Severity | Claim | Location | Actual | Discrepancy |
|---|----------|-------|----------|--------|-------------|
| S1 | **CRITICAL** | "40+ endpoints" for bmadServer | [deep-service-discovery-report.md](../deep-service-discovery-report.md) repo index | **63 endpoints** (verified by counting `[Http*]` attributes across all 11 controllers) | 36% undercount. README.md correctly says 63. Deep report and bmadServer.md both say "40+". |
| S2 | **HIGH** | "34 controllers" for NorthStarET Upgrade | [deep-service-discovery-report.md](../deep-service-discovery-report.md) Upgrade section | **35 controller files** (34 named + NSBaseController). Report lists 33 by name + 1 base = 34 correct if excluding base, but the _listing_ in the doc only names 33 non-base plus the `HelpController` is mentioned later = inconsistent. | Report lists ~33 individually but claims "34" — NSBaseController omitted from listing but included in count. |
| S3 | **HIGH** | "~30 test files" for bmadServer | [bmad-readiness.md](bmad-readiness.md), [deep-report](../deep-service-discovery-report.md) | **77 test files** (verified by `find` for *Tests.cs and *Test.cs) | 157% undercount. Massively understates actual test coverage. |
| S4 | **HIGH** | "7 microservices" vs "8 services" | [deep-service-discovery-report.md](../deep-service-discovery-report.md) Repo 3 | **8 `AddProject` calls** in AppHost: 7 domain services + MockServer. Report uses both "7 microservices" and "8 services + YARP" inconsistently in different sections. Architecture-overview.md says "7 microservices". | Inconsistent counting — MockServer is/isn't included depending on which doc you read. |
| S5 | **MEDIUM** | "NorthStarET stalled since Jan 19" (20+ days) | [portfolio-health.md](portfolio-health.md), [bmad-readiness.md](bmad-readiness.md) | Last commit: `2026-01-19 09:34:05`. But report generated ~Feb 7-8. "20 days" is correct for the generated date. However, the stall window is a snapshot — docs don't explain they'll become stale. | Correct at generation time but will become misleading as time passes without a "as of" anchor. |
| S6 | **MEDIUM** | BMAD.Lens on branch "main" | [deep-service-discovery-report.md](../deep-service-discovery-report.md) repo index | Currently `main` per git verification, BUT terminal history shows active work on branches `lensv3` and `mvp2`. Report only captures default branch. | Active development branches not captured — analysis might miss in-progress changes. |

### 1.4 SHALLOW ANALYSIS

| # | Severity | Area | What Was Done | What Should Have Been Done |
|---|----------|------|--------------|---------------------------|
| SH1 | **HIGH** | **OldNorthStar data model** | Listed 36 controllers. Batch processors given placeholder names. | Should have read the EF6 DbContext to enumerate ALL entities and their relationships. This is critical for migration planning — you can't plan data migration without knowing the source data model. |
| SH2 | **HIGH** | **NorthStarET Migration per-service analysis** | Listed services from AppHost. Showed YARP routes. | Should have read EACH service's controllers, DbContexts, and domain models. The per-service data models are needed to understand data boundaries. How many entities in each service's DB? What are the schemas? |
| SH3 | **HIGH** | **Security audit depth** | Found plaintext passwords in bmad-chat. Listed JWT in other repos. | Should have traced the full auth flow: Where are JWT secrets configured? What's the token expiry? Are refresh tokens single-use? Is CORS properly configured? Are there authorization policies on controllers? |
| SH4 | **MEDIUM** | **AI code quality audit** | Noted "48% copilot-swe-agent" commits in NorthStarET. Recommended audit. | Should have actually sampled 3-5 AI-generated PRs and assessed quality patterns (test depth, error handling, naming). The recommendation without data is just an opinion. |
| SH5 | **MEDIUM** | **bmadServer Program.cs DI analysis** | Listed services registered. Table format. | Should have verified which interfaces have actual implementations vs. mock stubs. How much is wired up vs. scaffolded? |
| SH6 | **LOW** | **Performance indicators** | Not addressed at all. | Should have noted: App.tsx is 662 lines (code splitting needed?), JSONB query patterns (N+1 risks?), SignalR message sizes, bundle size estimates. |

### 1.5 CONTRADICTIONS Between Documents

| # | Severity | Doc A | Doc B | Contradiction |
|---|----------|-------|-------|---------------|
| C1 | **CRITICAL** | [deep-service-discovery-report.md](../deep-service-discovery-report.md): "ChatController routes `api/chat` with `GET history, GET recent`" | [bmadServer/api-surface.md](BMAD/CHAT/bmadServer/api-surface.md): "ChatController path `/api/chat` with sessions/messages/stream endpoints" | **Completely different endpoint lists.** The deep report is correct (history + recent); api-surface.md is fabricated. |
| C2 | **HIGH** | [deep-service-discovery-report.md](../deep-service-discovery-report.md): "40+ endpoints" | [README.md](README.md): "63 endpoints" | README.md is correct. Deep report understates by 23. |
| C3 | **HIGH** | [deep-service-discovery-report.md](../deep-service-discovery-report.md): AuthController route `api/v1/auth` | [bmadServer/api-surface.md](BMAD/CHAT/bmadServer/api-surface.md): AuthController route `/api/auth` | Route mismatch. Source confirms `api/v1/auth` (with `v1`). Api-surface.md drops the version prefix. |
| C4 | **MEDIUM** | [architecture-overview.md](architecture-overview.md): "7 microservices + YARP + React" | [deep-service-discovery-report.md](../deep-service-discovery-report.md) Repo 3 table: "8 services + YARP gateway" | Is it 7 or 8? Answer: 7 domain services + 1 MockServer = 8 AddProject calls. Different docs count differently. |
| C5 | **MEDIUM** | [deep-service-discovery-report.md](../deep-service-discovery-report.md): NorthStarET "34 controllers" (Upgrade) | [NorthStarET.md](NextGen/NorthStarET/NorthStarET.md): "34-controller monolith" | Actual count: 35 files (34 + NSBaseController). Both say 34 but it depends on whether you count the base. |
| C6 | **LOW** | [deep-service-discovery-report.md](../deep-service-discovery-report.md): Mentions "23 entities" | [data-model.md](BMAD/CHAT/bmadServer/data-model.md): ER diagram shows different entity set (includes `Role` entity not in DbContext) | data-model.md includes entities that may not have DbSet declarations. Minor but potentially confusing. |

### 1.6 TEMPLATE SMELL — Copy-Paste / Generic Artifacts

| # | Severity | Finding | Location |
|---|----------|---------|----------|
| T1 | **HIGH** | OldNorthStar batch processor descriptions ("Scheduled data aggregation", "Report generation", "Data import/export") are generic placeholders, not derived from source. | [OldNorthStar.md](OldNorthStar/default/OldNorthStar.md) lines 86-92 |
| T2 | **MEDIUM** | bmadServer/api-surface.md appears to have been **generated speculatively** based on controller names rather than reading actual source. Method names like `Login`, `Register`, `TestCopilot`, `GetCheckpoints` are reasonable guesses but several are wrong. | [bmadServer/api-surface.md](BMAD/CHAT/bmadServer/api-surface.md) |
| T3 | **MEDIUM** | All `generated_at` dates are the same (`2026-02-07T00:00:00Z`) despite some docs being created at different times. The deep-report header says "DS 2026-02-08, AC 2026-02-09" — these dates are AFTER the other docs' timestamps. | All files |
| T4 | **LOW** | README.md reports "896 endpoints | 258 entities" across portfolio. NorthStarET has "449 endpoints" and OldNorthStar has "384 endpoints" — these large numbers seem like they might include non-public methods or be extrapolated. Unverified. | [README.md](README.md) line 20-26 |
| T5 | **LOW** | `confidence: 0.90` in the api-surface.md frontmatter is ironic given the fabricated endpoint details. The confidence score doesn't reflect actual accuracy. | [bmadServer/api-surface.md](BMAD/CHAT/bmadServer/api-surface.md) line 9 |

---

## PART 2: Source Verification — Top 5 Claims

### Claim 1: "bmadServer has 11 controllers, 40+ endpoints"

**Docs say:** 11 controllers, 40+ endpoints (deep-report) / 63 endpoints (README.md)

**Actual source verification:**
```
AuthController:          5 endpoints  ✅ Verified
BmadSettingsController:  2 endpoints  ✅ Verified
ChatController:          2 endpoints  ✅ Verified
CheckpointsController:   5 endpoints  ✅ Verified
ConflictsController:     3 endpoints  ✅ Verified
CopilotTestController:   2 endpoints  ✅ Verified
DecisionsController:    19 endpoints  ✅ Verified
RolesController:         3 endpoints  ✅ Verified
TranslationsController:  4 endpoints  ✅ Verified
UsersController:         3 endpoints  ✅ Verified
WorkflowsController:    15 endpoints  ✅ Verified
─────────────────────────────────────
TOTAL:                  63 endpoints
CONTROLLERS:            11            ✅ CORRECT
```

**Verdict:** Controller count ✅ CORRECT. Endpoint count: "40+" is **WRONG** — actual is **63**. The "40+" figure in the deep report and bmadServer.md undercounts by 36%. README.md correctly states 63.

---

### Claim 2: "bmad-chat stores plaintext passwords in Spark KV"

**Docs say:** Critical security issue — `auth.ts` stores raw passwords in `window.spark.kv`

**Actual source verification:**
```typescript
// From auth.ts, signUp function:
const newUser: AuthUser = {
  id: `user-${Date.now()}`,
  email, password, name, role,  // password stored in plaintext
  avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=...`,
  createdAt: Date.now(),
}
await window.spark.kv.set(USERS_KEY, users)

// From auth.ts, signIn function:
const user = users.find((u) => u.email === email && u.password === password)
// ^^^ plaintext comparison
```

**Verdict:** ✅ **CONFIRMED — 100% accurate.** Password stored in plaintext in browser KV, compared in plaintext on sign-in. No hashing, no salting, no server-side validation.

---

### Claim 3: "NorthStarET Migration has 7/8 microservices"

**Docs say:** "7 microservices" (architecture-overview), "8 services" (deep-report)

**Actual source verification (AppHost/Program.cs):**
```
1. identity-api          (Identity_API)
2. student-service       (StudentService)           → student-db
3. assessment-service    (AssessmentService)
4. assessment-management (AssessmentManagement_Api)
5. intervention-service  (InterventionService_Api)   → intervention-db
6. staff-service         (NorthStar_Staff_Api)       → staff-db
7. section-service       (NorthStar_SectionService_Api) → section-db
8. mockserver            (NorthStar_MockServer)      → port 5001
```
Plus: YARP gateway (port 8080), React UI migration-ui (port 3100)

**ALSO FOUND (undocumented):**
```
9. AutomatedRollover     (NOT in AppHost, standalone Worker service)
```

**Verdict:** ⚠️ **PARTIALLY CORRECT.** 8 projects are registered in AppHost (7 domain + 1 mock). But there are actually **9 backend service projects** if you count AutomatedRollover. No doc mentions AutomatedRollover. The "7 vs 8" inconsistency reflects confusion about whether MockServer counts.

---

### Claim 4: "BMAD.Lens has 5 agents"

**Docs say:** 5 agents (Compass, Casey, Scout, Scribe, Tracey)

**Actual source verification:**
```
casey.agent.yaml     ✅
compass.agent.yaml   ✅
scout.agent.yaml     ✅
scribe.agent.yaml    ✅
tracey.agent.yaml    ✅
```

**Verdict:** ✅ **CORRECT — 5 agent definition files confirmed.**

---

### Claim 5: "bmadServer has 23 entities"

**Docs say:** 23 entities (deep-report) / 23 DbSet declarations (count)

**Actual source verification (ApplicationDbContext.cs, lines 15-37):**
```
 1. Users                    15. Decisions
 2. Sessions                 16. DecisionVersions
 3. Workflows                17. DecisionConflicts
 4. RefreshTokens            18. DecisionReviews
 5. UserRoles                19. DecisionReviewResponses
 6. WorkflowInstances        20. ApprovalRequests
 7. WorkflowEvents           21. AgentMessageLogs
 8. WorkflowStepHistories    22. ConflictRules
 9. WorkflowParticipants     23. TranslationMappings
10. WorkflowCheckpoints
11. QueuedInputs
12. Conflicts
13. BufferedInputs
14. AgentHandoffs
```

**Verdict:** ✅ **CORRECT — exactly 23 DbSet declarations.** However, the data-model.md ER diagram introduces a `Role` entity that is NOT in the DbContext (UserRole exists, but there's no separate Role DbSet). The data-model.md was partly fabricated.

---

## PART 3: Gap Analysis — What's MISSING

### Gap 1: Inter-Repo Communication Contracts
**Status: PARTIALLY ANALYZED**

The deep-report correctly identifies that bmad-chat has NO connection to bmadServer. But it does NOT prove this by tracing actual HTTP call sites. Analysis should have:
- Searched bmad-chat for `fetch(`, `axios`, `XMLHttpRequest`
- Searched for any bmadServer URL references
- Confirmed zero outbound API calls

**The conclusion is likely correct but arrived at by observation rather than systematic proof.**

### Gap 2: Database Schema Analysis
**Status: SHALLOW**

- bmadServer: EF migration file exists (`20260127151644_InitialCreate.cs`) but was NOT read. The migration contains the actual CREATE TABLE SQL — the gold standard for schema verification.
- NorthStarET Migration: Multiple migration files exist across services (AssessmentManagement, Identity, Student, Intervention, Staff, Section) but NONE were read.
- OldNorthStar: EF6 DbContext was not read — the source of truth for legacy data model.

**This is the largest analysis gap.** You cannot plan data migration without reading actual schemas.

### Gap 3: NorthStarET Migration vs Upgrade
**Status: BOTH LISTED, NEITHER DEEP**

Both tracks are documented at a structural level (controllers listed, tech stack noted). But neither track has:
- Per-controller endpoint enumeration
- Domain model analysis per service
- Feature parity matrix (which OldNorthStar features are covered by which track?)
- Shared library analysis

### Gap 4: Environment/Deployment Requirements
**Status: NOT ANALYZED**

- 15+ appsettings.json files exist across repos: **none read**
- Docker-related files found in bmadServer and NorthStarET: **not analyzed**
- No `.env` or `.env.example` files discussed
- No ports/connection strings/secrets documentation
- No discussion of local development setup requirements

### Gap 5: Security Audit Beyond Plaintext Passwords
**Status: SURFACE LEVEL**

Found plaintext passwords in bmad-chat ✅. But:
- Were JWT signing keys hardcoded in appsettings? **Unknown — not checked**
- Is CORS configured restrictively or wide-open? **Unknown**
- Are authorization policies defined per-endpoint or globally? **Unknown**
- Is rate limiting actually configured with sensible limits? **Unknown**
- Refresh token rotation: single-use? Expiry? **Claimed but not verified from source**

### Gap 6: Performance Indicators
**Status: NOT ADDRESSED**

Zero performance analysis:
- No bundle size estimates for bmad-chat or NorthStarET Migration UI
- No query pattern analysis (N+1 risks with 23 JSONB entities and EF Core?)
- No SignalR connection scaling discussion
- No database indexing analysis beyond "GIN indexes on JSONB"
- App.tsx at 662 lines — no code splitting assessment

### Gap 7: OldNorthStar Migration Path
**Status: SUPERFICIAL**

Controller parity table exists (36 → 34 mapping). But:
- Actual data that needs migrating (SQL Server → PostgreSQL): **not scoped**
- Business rules embedded in controllers: **not extracted**
- Batch processor logic: **placeholder descriptions only**
- Feature coverage gaps between OldNorthStar and NorthStarET: **not systematically identified**

### Gap 8: BMAD.Lens Test Coverage
**Status: CORRECTLY DOCUMENTED**

Tests dir contains one file: `lens-work-tests.spec.md` (spec-based, not automated). This is correctly noted as "Spec-based only — no automated tests" in the docs.

### Gap 9: NorthStarET.Student
**Status: CORRECT**

Verified: contains only `_bmad/`, `_bmad-output/`, `docs/` — zero application code. 6 commits. Correctly documented as "planning only."

### Gap 10: Control Repo Architecture
**Status: NOT ANALYZED**

The `_bmad/` directory contains 7 modules (core, bmm, bmb, cis, gds, tea, lens-work), each with agents, workflows, configs. This is a software system in its own right:
- How do modules interact?
- How does agent loading work (CSV manifests)?
- What is the installer pipeline?
- How does dogfooding sync work?

None of this is in the discovery docs — the control repo was treated as infrastructure, not as a system to understand.

---

## PART 4: Recommendations

### MUST RE-RUN (Immediate)

| Priority | Target | Action | Impact |
|----------|--------|--------|--------|
| P1 🔴 | **bmadServer api-surface.md** | **DELETE AND REGENERATE** from actual source. Read every controller file. Extract route attributes, method names, and parameter types from C# source — do NOT guess. | Eliminates the most damaging fabricated content. |
| P2 🔴 | **bmadServer data-model.md** | Regenerate from DbContext source. Read the EF migration file to get actual column types, constraints, and indexes. Remove fabricated `Role` entity. | Ensures data model accuracy for integration planning. |
| P3 🔴 | **Deep report endpoint count** | Update "40+ endpoints" to "63 endpoints" in all occurrences (deep-service-discovery-report.md, bmadServer.md). | Eliminates the most prominent numerical error. |
| P4 🔴 | **Deep report test count** | Update "~30 test files" to "77 test files". Remove fabricated "~85% coverage" claim. | Corrects a 157% undercount that significantly understates quality. |

### MUST VERIFY (Before Trusting)

| Priority | Claim | How to Verify |
|----------|-------|---------------|
| V1 | NorthStarET "449 endpoints" | Count `[Http*]` attributes across ALL controller files in Upgrade + Migration + AIUpgrade |
| V2 | OldNorthStar "384 endpoints" | Count endpoints in all 36 controllers |
| V3 | "Polly" in bmadServer stack | `grep -r "Polly" bmadServer/` — is it configured or just referenced? |
| V4 | OldNorthStar batch processor descriptions | Read actual batch processor source files |
| V5 | bmadServer SignalR hub events | Read ChatHub.cs and list actual hub methods |
| V6 | NorthStarET CI/CD pipeline details | Read `.github/workflows/ci.yml` files |

### MUST ADD (New Documentation Sections)

| Priority | Document | Why |
|----------|----------|-----|
| A1 🔴 | **AutomatedRollover service doc** | Undocumented service project with Worker.cs, Services/, and configuration. Likely handles end-of-year data rollover — critical business function. |
| A2 🔴 | **AIUpgrade track analysis** | 36 controllers in a third NorthStarET track. Not scaffolding — substantial code that needs documentation or explicit archival. |
| A3 | **NorthStarET `.referenceSrc/` analysis** | Contains prior iterations (UpgradeItteration1, WIPNorthStar), microservice experiments, specs, and planning artifacts. Historical context for architecture decisions. |
| A4 | **Environment configuration doc** | Parse appsettings.json files across all repos. Document required env vars, connection strings, ports. |
| A5 | **Per-service data model analysis** | For NorthStarET Migration: read each service's DbContext and migrations. For OldNorthStar: read the EF6 context. |
| A6 | **bmadServer frontend directory** | Investigate `src/frontend/` in bmadServer — what's there? |
| A7 | **NorthStarET Migration UI analysis** | React 18 SPA in `Src/Migration/UI/` is not analyzed. Components, routes, state management. |
| A8 | **Control repo architecture doc** | Document the `_bmad/` system: module loading, CSV manifests, agent resolution, installer pipeline. |

### PRIORITY ORDER (By Impact on BMAD Lifecycle Planning)

```
IMMEDIATE (blocks planning accuracy):
  1. [P1] Fix bmadServer api-surface.md (fabricated endpoints)
  2. [P3] Fix endpoint count 40+ → 63
  3. [P4] Fix test count ~30 → 77
  4. [A1] Document AutomatedRollover service
  5. [P2] Fix bmadServer data-model.md

HIGH (improves planning quality):
  6. [A2] AIUpgrade track analysis
  7. [A5] Per-service data models for NorthStarET
  8. [V1] Verify NorthStarET endpoint counts
  9. [A4] Environment configuration doc
 10. [C1-C3] Resolve contradictions between docs

MEDIUM (enhances completeness):
 11. [A3] .referenceSrc analysis
 12. [A7] Migration UI analysis
 13. [V4] OldNorthStar batch processors
 14. [A8] Control repo architecture
 15. [SH3] Security audit depth

LOW (polish):
 16. [T3] Fix timestamp inconsistencies
 17. [A6] bmadServer frontend investigation
 18. [SH6] Performance indicators
```

---

## Scoring Summary

| Document | Confidence | Issues Found | Verdict |
|----------|-----------|--------------|---------|
| [architecture-overview.md](architecture-overview.md) | **78%** | Minor count inconsistency (7 vs 8 services) | ✅ Usable |
| [portfolio-health.md](portfolio-health.md) | **75%** | Test count wrong, coverage claim fabricated | ✅ Usable with corrections |
| [bmad-readiness.md](bmad-readiness.md) | **72%** | "85% coverage" fabricated, test count wrong | ✅ Usable with corrections |
| [deep-service-discovery-report.md](../deep-service-discovery-report.md) | **70%** | Endpoint count wrong, service count inconsistent, test count wrong | ✅ Usable with corrections |
| [README.md](README.md) | **68%** | Unverified endpoint/entity totals for NorthStarET/OldNorthStar | ⚠️ Verify before relying |
| [bmadServer.md](BMAD/CHAT/bmadServer.md) | **65%** | Copies wrong endpoint count from deep-report | ⚠️ Needs correction |
| [NorthStarET.md](NextGen/NorthStarET/NorthStarET.md) | **60%** | Missing AutomatedRollover, AIUpgrade underdocumented | ⚠️ Needs additions |
| [BMAD.Lens.md](BMAD/LENS/BMAD.Lens.md) | **80%** | Minor — workflow count from manifest not files | ✅ Good |
| [bmad-chat.md](BMAD/CHAT/bmad-chat.md) | **82%** | Most accurate per-repo doc. Security finding verified. | ✅ Good |
| [OldNorthStar.md](OldNorthStar/default/OldNorthStar.md) | **50%** | Placeholder batch processor descriptions, data model not read | 🔴 Needs re-analysis |
| [bmadServer/api-surface.md](BMAD/CHAT/bmadServer/api-surface.md) | **30%** | **Fabricated endpoint details.** ChatController endpoints invented. Route prefixes wrong. | 🔴 Must regenerate |
| [bmadServer/data-model.md](BMAD/CHAT/bmadServer/data-model.md) | **55%** | Invented `Role` entity, ER diagram partially fabricated | 🔴 Must regenerate |

### Overall Portfolio Documentation Confidence: **62/100**

The structural/architectural layer is trustworthy (70-80%).  
The implementation-detail layer has serious accuracy issues (30-55%).  
The gap analysis/readiness layer is sound but built on some incorrect data (70-75%).

**Bottom line:** Good enough to START BMAD planning (the domain map, risk assessment, and readiness sequencing are solid). NOT good enough to trust for implementation-level decisions (endpoint contracts, data schemas, test coverage metrics).
