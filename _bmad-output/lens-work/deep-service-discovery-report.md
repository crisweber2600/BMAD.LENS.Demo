# Deep Service Discovery + Analyze Codebase (DS+AC) Report

> **Generated:** 2026-02-08 (DS) → 2026-02-09 (AC enrichment)  
> **Control Repo:** NorthStarET.BMAD  
> **Scope:** 4 active code repositories (excludes NorthStarET.Student [planning-only] and OldNorthStar [archive])  
> **Service Map:** `_bmad/lens-work/service-map.yaml`  
> **Analysis Depth:** Source-file-level — actual file reads, not directory listings

---

## Table of Contents

1. [Repository Index](#repository-index)
2. [Repo 1: bmadServer — Deep Analysis](#repo-1-bmadserver)
3. [Repo 2: bmad-chat — Deep Analysis](#repo-2-bmad-chat)
4. [Repo 3: NorthStarET — Deep Analysis](#repo-3-northstaret)
5. [Repo 4: BMAD.Lens — Deep Analysis](#repo-4-bmadlens)
6. [Repo 5: NorthStarET.Student — Summary](#repo-5-northstaretstudent)
7. [Repo 6: OldNorthStar — Summary](#repo-6-oldnorthstar)
8. [Cross-Repo Dependency Map](#cross-repo-dependency-map)
9. [API Contract Compatibility Analysis](#api-contract-compatibility-analysis)
10. [Shared Pattern Assessment](#shared-pattern-assessment)
11. [Critical Gaps & Technical Debt](#critical-gaps--technical-debt)
12. [Domain Architecture Diagram](#domain-architecture-diagram)
13. [Risk & Health Assessment](#risk--health-assessment)

---

## Repository Index

| # | Repo | Domain | Service | Branch | Commits | Files | LOC | Status |
|---|------|--------|---------|--------|---------|-------|-----|--------|
| 1 | bmadServer | BMAD | CHAT | main | 188 | 1,443 | ~18,807 C# | Active |
| 2 | bmad-chat | BMAD | CHAT | main | 16 | 119 | ~10,615 TS | Active |
| 3 | NorthStarET | NextGen | NorthStarET | main | 1,755 | 34,301 | ~19K C# + ~7K TS | Stalled |
| 4 | BMAD.Lens | BMAD | LENS | main | 46 | 3,431 | YAML/MD/JS | Active |
| 5 | NorthStarET.Student | NextGen | NorthStarET | main | 6 | 715 | — (planning) | Early |
| 6 | OldNorthStar | OldNorthStar | default | master | 1 | 12,582 | ~13,225 C# | Archive |
| | **TOTALS** | | | | **2,012** | **52,591** | **~68,647** | |

---

## Repo 1: bmadServer

### Identity

| Field | Value |
|-------|-------|
| **Domain** | BMAD / CHAT |
| **Remote** | github.com/crisweber2600/bmadServer |
| **Stack** | .NET 10, Aspire 13.1, PostgreSQL, EF Core, SignalR, JWT |
| **Contributors** | Cris Weber (60%), copilot-swe-agent (38%), Claude (2%) |
| **Active Span** | Jan 20–29, 2026 (~9 days) |

### API Surface (Source: Controllers/)

| Controller | Route | Methods | Auth | Purpose |
|-----------|-------|---------|------|---------|
| **AuthController** | `api/v1/auth` | POST register, POST login, POST refresh, GET me, POST logout | Mixed (register/login: anon; me/logout: JWT) | User authentication lifecycle |
| **UsersController** | `api/v1/users` | GET me, PATCH me/persona, GET {id}/profile | JWT | User profile & persona management |
| **RolesController** | `api/v1/users/{userId}/roles` | GET, POST, DELETE {role} | JWT | Role-based access control |
| **ChatController** | `api/chat` | GET history, GET recent | JWT | Chat message retrieval |
| **WorkflowsController** | `api/v1/workflows` | GET definitions, GET, POST, GET {id}, POST {id}/start, POST {id}/steps/execute, POST {id}/pause, POST {id}/resume, POST {id}/cancel, POST {id}/steps/current/skip, POST {id}/steps/{stepId}/goto, POST/GET/DELETE {id}/participants, GET {id}/contributions | JWT | Full workflow orchestration engine |
| **CheckpointsController** | `api/v1/workflows/{workflowId}/checkpoints` | GET, GET {id}, POST, POST {id}/restore, POST inputs/queue | JWT | Workflow state snapshots & input queuing |
| **DecisionsController** | `api/v1` | GET workflows/{id}/decisions, POST/GET/PUT decisions, GET decisions/{id}/history, POST decisions/{id}/revert, GET decisions/{id}/diff, POST decisions/{id}/lock, POST decisions/{id}/unlock, POST decisions/{id}/request-review, POST reviews/{id}/respond, GET decisions/{id}/review, POST decisions/{id}/review-response, GET/GET/POST/POST workflows/{workflowId}/conflicts | JWT | Decision versioning, review, conflict resolution |
| **ConflictsController** | `api/v1/workflows/{workflowId}/conflicts` | GET, GET {id}, POST {id}/resolve | JWT | Conflict detection & resolution |
| **TranslationsController** | `api/v1/translations` | GET/POST/PUT/DELETE mappings | JWT | Technical↔business term translation |
| **BmadSettingsController** | `api/bmad` | GET/PUT settings | JWT | Runtime BMAD configuration |
| **CopilotTestController** | `api/copilottest` | POST test, GET health | JWT | GitHub Copilot SDK integration testing |

**Total: 11 controllers, 63 endpoints**

**SignalR Hub:** `/hubs/chat` — `ChatHub` for real-time messaging (supports JWT via query string `access_token`)

### Data Model (Source: ApplicationDbContext.cs)

| Entity | Key Columns (from OnModelCreating) | Relationships |
|--------|-------------------------------------|---------------|
| **User** | Id, Email, PasswordHash, DisplayName, Persona, AvatarUrl | → Sessions, Workflows, UserRoles |
| **Session** | Id, UserId, Token, ExpiresAt, IsRevoked | → User |
| **RefreshToken** | Id, UserId, Token, ExpiresAt, IsRevoked | → User |
| **UserRole** | Id, UserId, Role | → User |
| **Workflow** | Id, Name, Description, Status, CurrentStep, Definition (JSONB) | → WorkflowInstances, Participants |
| **WorkflowInstance** | Id, WorkflowId, Status, StartedAt, Context (JSONB) | → Workflow, Events, StepHistories |
| **WorkflowEvent** | Id, InstanceId, Type, Data (JSONB), Timestamp | → WorkflowInstance |
| **WorkflowStepHistory** | Id, InstanceId, StepId, Status, Input/Output (JSONB) | → WorkflowInstance |
| **WorkflowParticipant** | Id, WorkflowId, UserId, Role, JoinedAt | → Workflow |
| **WorkflowCheckpoint** | Id, WorkflowId, State (JSONB), CreatedAt | → Workflow |
| **QueuedInput** | Id, WorkflowId, Input (JSONB), QueuedAt | → Workflow |
| **BufferedInput** | Id, WorkflowId, Content, BufferedAt | → Workflow |
| **Decision** | Id, WorkflowId, Title, Content (JSONB), Status, LockedBy | → Workflow, Versions, Reviews |
| **DecisionVersion** | Id, DecisionId, Version, Content (JSONB) | → Decision |
| **DecisionConflict** | Id, DecisionId, Description, Status | → Decision |
| **DecisionReview** | Id, DecisionId, RequestedBy, Status | → Decision, Responses |
| **DecisionReviewResponse** | Id, ReviewId, ResponderId, Response | → DecisionReview |
| **ApprovalRequest** | Id, WorkflowId, RequestedBy, Status | → Workflow |
| **AgentHandoff** | Id, FromAgent, ToAgent, Context (JSONB) | — |
| **AgentMessageLog** | Id, AgentId, Message, Timestamp | — |
| **Conflict** | Id, WorkflowId, Type, Status | → Workflow |
| **ConflictRule** | Id, Name, Pattern, Action | — |
| **TranslationMapping** | Id, TechnicalTerm, BusinessTerm, Context | — |

**Total: 23 entities** with heavy JSONB usage for flexible state storage.

### Service Registration (Source: Program.cs DI)

| Category | Services Registered |
|----------|-------------------|
| **Auth** | IJwtTokenService, IPasswordHasher, IRefreshTokenService, ISessionService |
| **User** | IContributionMetricsService, IPresenceTrackingService |
| **Workflow** | IWorkflowRegistry (Mock/BmadWorkflowRegistry), IWorkflowInstanceService, IStepExecutor |
| **Agent** | IAgentRegistry (Mock/BmadAgentRegistry), IAgentRouter, IAgentHandlerFactory, IAgentMessaging, IAgentHandoffService |
| **Decision** | IDecisionService, IApprovalService, ISharedContextService |
| **Conflict** | IConflictDetectionService, IConflictResolutionService |
| **Translation** | ITranslationService, IContextAnalysisService, IResponseMetadataService |
| **Integration** | ICopilotTestService, IBmadSettingsService |
| **Background** | SessionCleanupService, ConflictEscalationJob |
| **Infrastructure** | MemoryCache, DistributedMemoryCache, FluentValidation, IpRateLimit, SignalR, Swagger/OpenAPI |

### Patterns Detected

| Pattern | Implementation | Quality |
|---------|---------------|---------|
| **RFC 7807 Problem Details** | `AddProblemDetails()` + custom `OnChallenge` handler | ✅ Excellent — consistent error format |
| **JWT Bearer + SignalR** | Query string token extraction for hub connections | ✅ Standard pattern |
| **BMAD Agent Modes** | Mock/Live/Replay via `AgentTestMode` enum | ✅ Good testability via DI swap |
| **Rate Limiting** | `AspNetCoreRateLimit` on IP basis | ✅ Protects auth endpoints |
| **Auto-Migration** | `dbContext.Database.Migrate()` on startup | ⚠️ OK for dev, risky for production |
| **JSONB Columns** | Definition, Context, State, Content columns | ⚠️ Flexible but opaque — no schema validation at DB level |
| **FluentValidation** | Assembly scanning for validators | ✅ Centralized validation |
| **OpenTelemetry** | Via Aspire ServiceDefaults (logging + tracing) | ✅ Production-ready observability |

### Test Coverage (Source: Solution structure — verified via attribute scan)

| Project | Type | Framework | Test Files |
|---------|------|-----------|------------|
| bmadServer.Tests | Unit | xUnit | 72 files with [Fact]/[Theory] |
| bmadServer.BDD.Tests | BDD | xUnit + BDD | 11 step def files + 9 .feature files |
| bmadServer.ApiService.IntegrationTests | Aspire Integration | xUnit | 4 test files |
| bmadServer.Playwright.Tests | E2E | Playwright | (configured but not counted) |

**Total: 87 .cs test files + 9 .feature files = 96 test artifacts**

**CI/CD:** GitHub Actions `ci.yml` — build + test pipeline.

---

## Repo 2: bmad-chat

### Identity

| Field | Value |
|-------|-------|
| **Domain** | BMAD / CHAT |
| **Remote** | github.com/crisweber2600/bmad-chat |
| **Stack** | React 19, TypeScript 5.7, Vite 7.2, Tailwind 4.1, Radix UI |
| **Generated By** | GitHub Spark |
| **Active Span** | Feb 5–6, 2026 (~1 day) |

### API Surface (Source: src/lib/services/)

bmad-chat has **no REST API** — it is a client-side SPA that uses `window.spark.kv` (Spark local storage) and `window.spark.llm` (in-browser AI). No HTTP calls to bmadServer detected.

| Service File | Functions | Storage | Purpose |
|-------------|-----------|---------|---------|
| **chat.service.ts** | getChats, getChat, createChat, sendMessage, updateChat, deleteChat | `window.spark.kv` | Chat CRUD with local persistence |
| **ai.service.ts** | generateResponse, translateMessage, generateCodeReview | `window.spark.llm` | In-browser AI for responses, translations, code review |
| **pr.service.ts** | getPullRequests, createPR, updatePRStatus, addComment | `window.spark.kv` | Pull request management |
| **line-comment.service.ts** | addLineComment, resolveComment, addReply, toggleReaction | `window.spark.kv` | Code review line comments |
| **auth.ts** | signUp, signIn, signOut, getCurrentUser, setCurrentUser | `window.spark.kv` | Local auth (password stored in plaintext in KV!) |
| **collaboration.ts** | CollaborationManager class | `window.spark.kv` | Presence tracking, typing indicators, collaboration events |

### Data Model (Source: src/lib/types.ts)

| Type | Key Fields | Relationships |
|------|-----------|---------------|
| **User** | id, name, avatarUrl, role ('technical'│'business'), email | — |
| **AuthUser** | extends User + password, createdAt | — |
| **UserPresence** | userId, userName, activeChat, lastSeen, isTyping, cursorPosition | — |
| **Chat** | id, title, messages[], participants[], domain?, service?, feature? | → Message[], User ids |
| **Message** | id, chatId, content, role ('user'│'assistant'), timestamp, fileChanges?, translations? | → Chat, FileChange[] |
| **MessageTranslation** | role (UserRole), segments (TranslatedSegment[]) | → Message |
| **FileChange** | path, additions[], deletions[], status, lineComments? | → LineComment[] |
| **PullRequest** | id, title, description, chatId, author, status, fileChanges[], comments[], approvals[] | → Chat, FileChange[], PRComment[] |
| **CollaborationEvent** | id, type, userId, chatId?, prId?, timestamp, metadata? | — |

### Patterns Detected

| Pattern | Implementation | Quality |
|---------|---------------|---------|
| **Spark KV Storage** | `window.spark.kv.set/get/delete` for all persistence | ⚠️ Platform-locked — no server sync |
| **Spark LLM** | `window.spark.llm` for AI generation | ⚠️ Platform-locked — browser-only AI |
| **Component Library** | 20+ Radix UI primitives | ✅ Accessible, composable |
| **Role-Based Translation** | Technical↔business term translation via AI | ✅ Innovative UX pattern |
| **Plaintext Passwords** | `password` field stored in Spark KV | 🔴 Critical security issue |
| **No Backend Integration** | Everything local — no HTTP to bmadServer | 🔴 Siloed data — no sync |
| **No Tests** | Zero test files found | 🔴 No quality assurance |

### Critical Security Finding

**AUTH IS CLIENT-SIDE ONLY.** Passwords are stored in plaintext in `window.spark.kv`. No hashing, no server-side validation. The `auth.ts` `signUp` function stores the raw password:

```typescript
const newUser: AuthUser = {
  id: `user-${Date.now()}`,
  email, password, name, role,  // password stored in plaintext
  avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=...`,
  createdAt: Date.now(),
}
await window.spark.kv.set(USERS_KEY, users)
```

---

## Repo 3: NorthStarET

### Identity

| Field | Value |
|-------|-------|
| **Domain** | NextGen |
| **Remote** | github.com/crisweber2600/NorthStarET |
| **Stack** | .NET 10, Aspire 13.1, EF6 + EF Core, PostgreSQL + SQL Server, React 18, YARP |
| **Tracks** | Upgrade (monolith), Migration (microservices), AIUpgrade (AI-assisted) |
| **Contributors** | copilot-swe-agent (48%), Cris Weber (46%), Sai Potluri, Tayrika, Copilot |
| **Status** | **STALLED since Jan 19, 2026** |

### API Surface — Migration Track (Source: Migration/Backend/)

**Service Mesh** (Source: `AppHost/Program.cs`): 8 services + YARP gateway on port 8080 + React UI on port 3100.

| Service | Project | YARP Route | Controllers | DB |
|---------|---------|-----------|-------------|-----|
| **Identity** | Identity.API | `/identity/{**}` | AuthController, EntraAuthController, SessionController | — |
| **Student** | StudentService | `/students/{**}` | StudentsController, StudentAttributesController, StudentNotesController | `student-db` (PostgreSQL) |
| **Assessment** | AssessmentService | `/api/assessments/{**}` | AssessmentController | — |
| **Benchmarks** | AssessmentManagement.Api | `/api/benchmarks/{**}` | BenchmarksController | — |
| **Intervention** | InterventionService.Api | `/api/intervention-groups/{**}`, `/api/intervention-toolkit/{**}` | InterventionGroupController, InterventionAttendanceController, InterventionDashboardController, InterventionToolkitController | `intervention-db` (PostgreSQL) |
| **Staff** | NorthStar.Staff.Api | `/api/staff/{**}` | StaffController, StaffSettingsController | `staff-db` (PostgreSQL) |
| **Section** | NorthStar.SectionService.Api | `/api/sections/{**}` | SectionsController, RosterController, RolloverController | `section-db` (PostgreSQL) |
| **MockServer** | NorthStar.MockServer | `/api/students/{**}`, `/api/reports/{**}` | — | — (dev only) |

**Total Migration Controllers:** 17 (including tests)

### API Surface — Upgrade Track (Source: Upgrade/Backend/NS4.WebAPI/)

34 controllers in a single monolith API. Key domains:

| Domain | Controllers |
|--------|------------|
| **Assessment** | AssessmentController, AssessmentAvailabilityController, BenchmarkController |
| **Student** | StudentController, StudentDashboardController |
| **Staff** | StaffController |
| **Section** | SectionController, SectionDataEntryController, SectionReportController |
| **Intervention** | InterventionDashboardController, InterventionGroupController, InterventionGroupDataEntryController, InterventonToolkitController (typo in original) |
| **Data** | DataEntryController, ExportDataController, ImportStateTestDataController |
| **Auth** | AuthController, PasswordResetController |
| **Navigation** | NavigationController, FilterOptionsController, PersonalSettingsController, DistrictSettingsController |
| **Reporting** | LineGraphController, StackedBarGraphController, PrintController, CalendarController |
| **Other** | HomeController, ProbeController, HelpController, TeamMeetingController, VideoController, RosterRolloverController, FileUploaderController, AzureDownloadController |

### Patterns Detected

| Pattern | Implementation | Quality |
|---------|---------------|---------|
| **Clean Architecture** | Migration services: Api → Application → Domain → Infrastructure layers | ✅ Textbook 4-layer separation |
| **YARP Gateway** | Single entry point (port 8080) routing to microservices | ✅ Proper API gateway pattern |
| **Aspire Orchestration** | Service discovery, health checks, telemetry across all services | ✅ Modern dev experience |
| **Dual-Track Strategy** | Upgrade (in-place .NET 10) + Migration (rebuild) | ⚠️ High complexity, resource split |
| **EF6 Compatibility** | Upgrade track retains EF6 with .NET 10 compatibility shim | ⚠️ Technical debt — blocks EF Core adoption |
| **Legacy bower_components** | Present in both Upgrade and AIUpgrade tracks | 🔴 Dead dependency manager |
| **Mock Server** | MockServer project for UI development without backend | ✅ Good DX pattern |
| **Database-per-service** | Each Migration service has its own PostgreSQL database | ✅ Proper microservice data isolation |

### Test Coverage

| Project | Type | Track |
|---------|------|-------|
| NS4.WebAPI.Tests | Unit (xUnit) | Upgrade |
| NS4.Parity.Tests | Parity validation | Upgrade |
| Identity.Tests | Unit + controller tests | Migration |
| NorthStar.Staff.Tests | Integration | Migration |
| Migration UI tests | Vitest + Playwright | Migration |

**CI/CD:** 2 GitHub Actions workflows (`ci.yml`, `scheduled-e2e-visual.yml`).

---

## Repo 4: BMAD.Lens

### Identity

| Field | Value |
|-------|-------|
| **Domain** | BMAD / LENS |
| **Remote** | github.com/crisweber2600/BMAD.Lens |
| **Stack** | Node.js, YAML, Markdown, JavaScript |
| **Purpose** | Source repo for BMAD Method framework + lens-work module (dogfooding origin) |
| **Active Span** | Jan 30 – Feb 7, 2026 (~8 days) |

### API Surface (Agent/Workflow System)

BMAD.Lens has no REST API. Its "API" is a YAML-based agent/workflow registry system consumed by bmadServer and GitHub Copilot Chat.

**Agent Roster** (Source: `src/modules/lens-work/agents/`):

| Agent | YAML | Role | Spec |
|-------|------|------|------|
| **Compass** | compass.agent.yaml | Phase-aware lifecycle router | compass.spec.md |
| **Casey** | casey.agent.yaml | Git branch orchestrator | casey.spec.md |
| **Tracey** | tracey.agent.yaml | State & recovery specialist | tracey.spec.md |
| **Scout** | scout.agent.yaml | Bootstrap & discovery manager | scout.spec.md |
| **Scribe (Cornelius)** | scribe.agent.yaml | Constitutional governance guardian | scribe.spec.md |

**Workflow Categories** (Source: `module.yaml`):

| Category | Count | Key Workflows |
|----------|-------|---------------|
| **Core** | 4 | init-initiative, start-workflow, finish-workflow, phase-lifecycle |
| **Router** | 6 | pre-plan, spec, plan, review, dev, init-initiative |
| **Discovery** | 10 | repo-discover, repo-document, repo-reconcile, repo-status, discover, analyze-codebase, generate-docs, lens-sync, domain-map, impact-analysis |
| **Utility** | 15 | status, resume, sync, fix-state, override, archive, bootstrap, batch-process, onboarding, setup-rollback, fix-story, switch, check-repos, migrate-state, recreate-branches |
| **Governance** | 5 | constitution, compliance-check, resolve-constitution, ancestry, resolve-context |

**Total: 40 workflows across 5 categories + 26 prompt files**

### Data Model (YAML State)

| File | Format | Purpose |
|------|--------|---------|
| `_bmad-output/lens-work/state.yaml` | YAML | Active initiative/phase state |
| `_bmad-output/lens-work/event-log.jsonl` | JSONL | Immutable event history |
| `_bmad-output/lens-work/repo-inventory.yaml` | YAML | Discovered repository metadata |
| `_bmad-output/lens-work/domain-map.yaml` | YAML | Domain→service→repo mapping |
| `_bmad/lens-work/service-map.yaml` | YAML | Canonical repo registry (6 repos) |
| `_bmad/_config/manifest.yaml` | YAML | Installation manifest |
| CSV manifests (agent, workflow, task, file, tool) | CSV | Flat registries for lazy loading |

### Module Configuration (Source: module.yaml — 314 lines)

| Section | Details |
|---------|---------|
| **Dependencies** | Required: bmm, core. Optional: cis, tea |
| **Install Questions** | 10 config questions (paths, toggles, depth, integrations) |
| **Git Config** | Branch patterns: `{domain}/{initiative_id}/{size}-{phase_number}` |
| **Templates** | 4 constitution templates (domain, service, microservice, feature) |
| **Outputs** | state.yaml, event-log.jsonl, repo-inventory, dashboards, constitutions, domain-map, personal profile |
| **Tests** | `tests/lens-work-tests.spec.md` (spec-based) |
| **Scripts** | `validate-lens-work.ps1`, `sync-prompts.ps1` |
| **Docs** | 25+ documentation files covering architecture, governance, troubleshooting, API reference |

### Installer (Source: _module-installer/installer.js)

- JavaScript-based module installer
- Reads `module.yaml` to determine what to install
- Copies agents, workflows, configs, prompts to target `_bmad/` directory
- Handles path token resolution (`{project-root}`)
- Three-step sync for dogfooding: copy source → run installer → deploy to `_bmad/lens-work/`

### Patterns Detected

| Pattern | Implementation | Quality |
|---------|---------------|---------|
| **Agent Registry (CSV)** | Flat CSV manifests for lazy-loaded agent discovery | ✅ Simple, scannable |
| **YAML-Driven Workflows** | Step-file architecture with includes | ✅ Composable, readable |
| **Phase-Gated Lifecycle** | 4 phases: Analysis → Planning → Solutioning → Implementation | ✅ Structured governance |
| **Constitution System** | Domain/service constitutions for governance rules | ✅ Novel — codified project rules |
| **Dogfooding Loop** | Source in BMAD.Lens → installed in NorthStarET.BMAD | ✅ Eats own dog food |
| **Numbered Menus** | All agent interactions use numbered option lists | ✅ Consistent UX |
| **Module Independence** | Each module (bmm, bmb, cis, gds, tea) is self-contained | ✅ Clean separation |

---

## Repo 5: NorthStarET.Student

### Summary (Planning-Only)

- **Status:** BMAD framework bootstrapped, no application code
- **Modules:** bmm, bmb, bmgd, cis, core
- **Commits:** 6 | **Files:** 715
- **Risk:** May become orphaned — no development activity since Jan 31

---

## Repo 6: OldNorthStar

### Summary (Archive Reference)

- **Status:** Single-commit archive of legacy .NET Framework 4.8 LMS
- **Stack:** .NET Fx 4.8, EF6, SQL Server, AngularJS 1.x, IdentityServer
- **Files:** 12,582 | **C# LOC:** ~13,225 | **Controllers:** 36 | **Batch Processors:** 3
- **Purpose:** Reference architecture during NorthStarET modernization
- **Risk:** No history (single commit), no tests, no CI/CD

---

## Cross-Repo Dependency Map

### Runtime Dependencies

```
┌─────────────────────────────────────────────────────────────────────┐
│                   NorthStarET.BMAD (Control Repo)                   │
│                                                                     │
│     _bmad/lens-work/ ←────── INSTALLED FROM ────── BMAD.Lens       │
│     service-map.yaml ──► routes to 6 target repos                  │
│                                                                     │
│     Compass/Casey/Tracey/Scout/Scribe agents                       │
│     40 workflows, 26 prompts, CSV registries                       │
└──────────────┬──────────────────────────────────────────────────────┘
               │ references
    ┌──────────▼────────────────────────────────────────────┐
    │              BMAD CHAT Domain                          │
    │                                                        │
    │  bmad-chat ─── NO CONNECTION ───► bmadServer           │
    │  (Spark KV)                       (PostgreSQL)         │
    │                                                        │
    │  bmadServer loads BMAD agent/workflow definitions:     │
    │    BmadAgentRegistry ──reads──► _bmad/_config/*.csv    │
    │    BmadWorkflowRegistry ──reads──► workflow manifests  │
    │                                                        │
    │  bmadServer.ApiService ──SignalR──► ChatHub (ws)       │
    │  bmadServer.ApiService ──HTTP──► GitHub Copilot SDK    │
    │  bmadServer.AppHost ──Aspire──► PostgreSQL (bmadserver)│
    └────────────────────────────────────────────────────────┘

    ┌────────────────────────────────────────────────────────┐
    │              NextGen Domain                            │
    │                                                        │
    │  NorthStarET Migration AppHost ──Aspire──►             │
    │    ├── identity-api                                    │
    │    ├── student-service ──► student-db (PostgreSQL)     │
    │    ├── assessment-service                              │
    │    ├── assessment-management                           │
    │    ├── intervention-service ──► intervention-db (PgSQL)│
    │    ├── staff-service ──► staff-db (PostgreSQL)         │
    │    ├── section-service ──► section-db (PostgreSQL)     │
    │    ├── mockserver (dev only)                           │
    │    └── YARP gateway (port 8080) ──routes to all──►    │
    │                                                        │
    │  NorthStarET Upgrade ──EF6──► SQL Server (legacy)     │
    │                                                        │
    │  NorthStarET ──modernizes──► OldNorthStar (reference) │
    │  NorthStarET.Student ──sibling (no code yet)──►       │
    └────────────────────────────────────────────────────────┘
```

### Build-Time Dependencies

| From | To | Type |
|------|----|------|
| NorthStarET.BMAD (control) | BMAD.Lens (source) | `install-lens-work-relative.ps1` copies lens-work module |
| bmadServer.ApiService | bmadServer.ServiceDefaults | .NET project reference (shared Aspire config) |
| bmadServer.ApiService | _bmad/ directory | Runtime file reads for agent/workflow loading |
| NorthStarET Migration services | Shared Foundation libraries | Common DTOs, auth, middleware |
| NorthStarET Upgrade | NorthStar.EF6 | EF6 compat layer for .NET 10 |

---

## API Contract Compatibility Analysis

### bmad-chat ↔ bmadServer: **NO INTEGRATION**

This is the most significant architectural gap. These repos share the CHAT service domain but operate independently:

| Aspect | bmad-chat | bmadServer | Compatible? |
|--------|-----------|------------|-------------|
| **Auth** | `window.spark.kv` plaintext | JWT Bearer + bcrypt hashing | 🔴 **Incompatible** |
| **Data Storage** | `window.spark.kv` (browser-local) | PostgreSQL (server) | 🔴 **No sync** |
| **AI** | `window.spark.llm` (browser) | GitHub Copilot SDK (server) | 🔴 **Different backends** |
| **Real-time** | CollaborationManager (local polling) | SignalR ChatHub (WebSocket) | 🔴 **No connection** |
| **Data Models** | TypeScript types (types.ts) | C# entities (ApplicationDbContext) | ⚠️ **Structurally similar but not shared** |

**Overlap in data models** (could be unified):
- Both have User, Chat/Message, Workflow concepts
- Both have role-based (technical/business) user models
- Both have file change / PR review concepts
- bmadServer has richer workflow orchestration; bmad-chat has richer UI interaction models

### NorthStarET Upgrade ↔ Migration: **PARALLEL BUT SEPARATE**

| Aspect | Upgrade Track | Migration Track | Parity? |
|--------|--------------|-----------------|---------|
| **Auth** | Custom JWT (AuthController) | Custom JWT + Entra ID (AuthController, EntraAuthController) | ⚠️ Migration has Entra ID |
| **Student** | StudentController (monolith) | StudentsController + Attributes + Notes (microservice) | ✅ Feature parity attempted |
| **Assessment** | AssessmentController (monolith) | AssessmentController + BenchmarksController | ✅ Split into 2 services |
| **Staff** | StaffController (monolith) | StaffController + StaffSettingsController | ✅ Similar |
| **Section** | SectionController + DataEntry + Report | SectionsController + Roster + Rollover | ✅ Similar |
| **Intervention** | 3 controllers (monolith) | 4 controllers (microservice) | ✅ Expanded in Migration |
| **Database** | SQL Server + EF6 | PostgreSQL + EF Core (per service) | 🔴 Different engines |
| **Gateway** | Direct API calls | YARP reverse proxy | ⚠️ Different routing |

### NorthStarET ↔ OldNorthStar: **MODERNIZATION SOURCE**

Controller parity check:

| OldNorthStar Controller | NorthStarET Upgrade | NorthStarET Migration | Status |
|------------------------|--------------------|-----------------------|--------|
| 36 controllers | 34 controllers | 17 controllers (split) | ⚠️ Near-parity on Upgrade, functional decomposition on Migration |

---

## Shared Pattern Assessment

### Patterns Consistent Across Repos

| Pattern | bmadServer | NorthStarET | Notes |
|---------|-----------|-------------|-------|
| **Aspire Orchestration** | ✅ AppHost + ServiceDefaults | ✅ AppHost (both tracks) | Same version (13.1) |
| **.NET 10** | ✅ | ✅ | Same runtime |
| **PostgreSQL** | ✅ (single DB) | ✅ (4 DBs: student, intervention, staff, section) | Same engine, different patterns |
| **JWT Authentication** | ✅ Custom implementation | ✅ Custom + Entra ID | Similar but not shared |
| **OpenTelemetry** | ✅ Via ServiceDefaults | ✅ Via ServiceDefaults | Likely shared config pattern |
| **GitHub Actions CI** | ✅ ci.yml | ✅ ci.yml + e2e | Both have CI |
| **Playwright E2E** | ✅ | ✅ | Both repos |
| **xUnit** | ✅ | ✅ | Both repos |

### Patterns Unique to Individual Repos

| Pattern | Repo | Concern |
|---------|------|---------|
| **SignalR ChatHub** | bmadServer | Not used by NorthStarET — potential future integration? |
| **YARP Gateway** | NorthStarET Migration | Not used by bmadServer (single API) |
| **BMAD Agent/Workflow Loading** | bmadServer | BmadAgentRegistry + BmadWorkflowRegistry parse CSV/YAML at runtime |
| **Spark KV/LLM** | bmad-chat | Platform-locked to GitHub Spark — no server equivalent |
| **EF6 Compatibility** | NorthStarET Upgrade | Legacy burden — unique to this track |
| **Database-per-Service** | NorthStarET Migration | Clean microservice pattern not yet in bmadServer |
| **Mock/Live/Replay Modes** | bmadServer | Excellent testing pattern — could benefit NorthStarET |
| **Constitution System** | BMAD.Lens | Novel governance — unique to BMAD framework |
| **Rate Limiting** | bmadServer | Not configured in NorthStarET APIs |

---

## Critical Gaps & Technical Debt

### Severity: CRITICAL 🔴

| # | Gap | Repo(s) | Impact | Recommendation |
|---|-----|---------|--------|----------------|
| 1 | **bmad-chat ↔ bmadServer disconnected** | bmad-chat, bmadServer | Users, chats, workflows stored locally ONLY — no server persistence, no collaboration across devices | Design integration layer: REST client → bmadServer API, replace Spark KV with API calls |
| 2 | **Plaintext passwords in bmad-chat** | bmad-chat | Passwords stored as plaintext in browser KV store | Move auth to bmadServer JWT, remove client-side password storage entirely |
| 3 | **NorthStarET stalled 20+ days** | NorthStarET | 34K files, dual-track complexity, 48% AI-generated code with unknown quality | Triage: pick one track to focus, audit AI-generated code, create restart backlog |
| 4 | **Zero tests in bmad-chat** | bmad-chat | 10K+ LOC with no quality gate | Add Vitest unit tests, Playwright E2E, integrate with CI |

### Severity: HIGH ⚠️

| # | Gap | Repo(s) | Impact | Recommendation |
|---|-----|---------|--------|----------------|
| 5 | **No shared auth library** | bmadServer, NorthStarET | JWT implementation duplicated — different configs, different token formats | Extract shared auth NuGet package or shared Aspire component |
| 6 | **AI-generated code quality unknown** | bmadServer (38%), NorthStarET (48%) | copilot-swe-agent commits may have shallow tests, inconsistent patterns | Audit sample of AI PRs for test quality, edge case coverage, pattern consistency |
| 7 | **JSONB columns lack schema validation** | bmadServer | Definition, Context, State, Content columns are opaque JSON — no DB-level constraints | Add JSON schema validation in application layer; consider typed JSONB columns |
| 8 | **Auto-migration on startup** | bmadServer | `Database.Migrate()` in Program.cs is risky for multi-instance production deployment | Move to explicit migration step or init container |
| 9 | **EF6 legacy burden** | NorthStarET Upgrade | EF6 compatibility layer blocks adoption of EF Core features (LINQ improvements, compiled queries) | Accelerate EF6→EF Core migration as part of Upgrade track completion |
| 10 | **bower_components** | NorthStarET (Upgrade + AIUpgrade) | Dead package manager, security vulnerabilities unlikely to be patched | Remove as React replacement matures |

### Severity: MEDIUM

| # | Gap | Repo(s) | Impact | Recommendation |
|---|-----|---------|--------|----------------|
| 11 | **No CI for BMAD.Lens** | BMAD.Lens | YAML/MD changes untested | Add YAML lint + schema validation pipeline |
| 12 | **No CI for bmad-chat** | bmad-chat | No automated build/lint/test | Add Vite build + ESLint check pipeline |
| 13 | **DistributedMemoryCache in bmadServer** | bmadServer | In-memory distributed cache won't survive restarts or scale | Replace with Redis for production |
| 14 | **NorthStarET.Student dormant** | NorthStarET.Student | Bootstrapped but empty — may drift from NorthStarET patterns | Decision needed: begin implementation or defer explicitly |
| 15 | **Typo: InterventonToolkitController** | NorthStarET Upgrade | Missing 'i' in controller name — cosmetic but indicates rushed code | Rename in cleanup PR |

---

## Domain Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                    NorthStarET.BMAD (Control Repo)                   │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  _bmad/lens-work/  ←── installed from BMAD.Lens (dogfood)   │    │
│  │  5 agents • 40 workflows • 26 prompts • CSV registries      │    │
│  │  service-map.yaml → routes to all 6 target repos            │    │
│  └─────────────────────────────────────────────────────────────┘    │
└───────────┬─────────────────────────────────────┬───────────────────┘
            │                                     │
    ┌───────▼───────────────────┐   ┌─────────────▼──────────────────┐
    │    BMAD Domain            │   │     NextGen Domain              │
    │                           │   │                                 │
    │  ┌──────────┐             │   │  ┌──────────────┐              │
    │  │BMAD.Lens │             │   │  │ NorthStarET  │──────────┐   │
    │  │(Framework│             │   │  │ (Main LMS)   │          │   │
    │  │ Source)  │             │   │  │              │          │   │
    │  │ 5 agents │             │   │  │ ┌──────────┐│  ┌───────▼─┐ │
    │  │40 wkflows│             │   │  │ │ Upgrade  ││  │Student  │ │
    │  └──────────┘             │   │  │ │ 34 ctrls ││  │(Planning│ │
    │                           │   │  │ │EF6+SQLSvr││  │ only)   │ │
    │  ┌──────────┐  ┌────────┐│   │  │ └──────────┘│  └─────────┘ │
    │  │bmad-chat │  │bmadSvr ││   │  │ ┌──────────┐│              │
    │  │React 19  │  │.NET 10 ││   │  │ │Migration ││              │
    │  │Spark KV  │  │Aspire  ││   │  │ │ 8 svcs   ││              │
    │  │NO SYNC   │  │PgSQL   ││   │  │ │YARP+PgSQL││              │
    │  │🔴        │  │SignalR  ││   │  │ └──────────┘│              │
    │  └──────────┘  │11 ctrls││   │  │ ┌──────────┐│              │
    │                │23 ents  ││   │  │ │AIUpgrade ││              │
    │                │JWT+Rate││   │  │ │(AI exp.) ││              │
    │                └────────┘│   │  │ └──────────┘│              │
    └───────────────────────────┘   │  └──────┬───────┘              │
                                    └─────────┼──────────────────────┘
                                              │ modernizes
                                    ┌─────────▼──────────────────────┐
                                    │  OldNorthStar (Archive)         │
                                    │  .NET Fx 4.8 │ 36 ctrls        │
                                    │  EF6 + SQL Server               │
                                    │  AngularJS + IdentityServer     │
                                    └─────────────────────────────────┘
```

---

## Risk & Health Assessment

### Overall Portfolio Health: **AMBER** (Moderate Risk)

| Risk | Severity | Repos | Details |
|------|----------|-------|---------|
| **NorthStarET Stall** | 🔴 CRITICAL | NorthStarET | 20+ days stalled. 34K files, 1,755 commits, dual-track complexity. 48% AI-generated code. Largest codebase in portfolio. |
| **bmad-chat Isolation** | 🔴 CRITICAL | bmad-chat, bmadServer | Frontend and backend share domain but have zero integration. Plaintext passwords in client. |
| **AI Code Quality** | ⚠️ HIGH | bmadServer, NorthStarET | Combined 40%+ AI-generated commits. Pattern consistency, test depth, and edge case coverage unknown. |
| **Test Gaps** | ⚠️ HIGH | bmad-chat (0), BMAD.Lens (minimal), OldNorthStar (0) | 3 of 6 repos have zero or minimal testing. |
| **CI/CD Gaps** | ⚠️ MEDIUM | bmad-chat, BMAD.Lens, NorthStarET.Student, OldNorthStar | 4 of 6 repos have no CI pipeline. |
| **Legacy Debt** | ⚠️ MEDIUM | NorthStarET (Upgrade), OldNorthStar | EF6, bower_components, AngularJS persist in modernization tracks. |
| **Bus Factor** | ⚠️ LOW | All | Primary contributor: Cris Weber. Bus factor = 1 for all strategic decisions. |

### Priority Recommendations

1. **🔴 Connect bmad-chat → bmadServer** — Replace Spark KV with REST API calls to bmadServer. Eliminate plaintext passwords. This is the #1 architectural fix.
2. **🔴 Unblock NorthStarET** — Triage dual-track strategy. Pick a focal track. Audit AI-generated PRs. Create restart backlog.
3. **⚠️ Add Tests to bmad-chat** — Vitest for services, Playwright for UI flows. Zero tests on 10K LOC is a liability.
4. **⚠️ Audit AI Commits** — Sample 10-15 copilot-swe-agent PRs across bmadServer + NorthStarET. Check for shallow tests, missing validation, inconsistent patterns.
5. **⚠️ CI/CD Expansion** — Add pipelines for BMAD.Lens (YAML lint), bmad-chat (build/lint/test).
6. **Extract Shared Auth** — JWT implementation duplicated between bmadServer and NorthStarET. Factor into shared package.
7. **Production-Ready bmadServer** — Replace DistributedMemoryCache with Redis, move auto-migration to init container, add health check dashboards.

---

*Report generated by Deep Service Discovery (DS) + Analyze Codebase (AC) workflows — LENS Workbench*  
*Source-file-level analysis performed on all 4 active code repositories*
