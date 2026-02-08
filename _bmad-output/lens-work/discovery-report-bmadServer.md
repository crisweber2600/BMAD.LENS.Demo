# DISCOVERY REPORT: bmadServer

**Domain:** BMAD | **Service:** CHAT
**Remote:** https://github.com/crisweber2600/bmadServer.git
**Default Branch:** main
**Discovery Date:** 2026-02-07
**Discovery Agent:** Scout (Deep Service Discovery)

---

## TECHNOLOGY STACK

| Attribute | Value |
|---|---|
| **Primary Language** | C# (.NET 10.0) |
| **Secondary Language** | TypeScript / React 19 |
| **Framework** | ASP.NET Core 10 + .NET Aspire 13.1 |
| **Frontend** | React 19.2 + Vite 7.2 + Ant Design 6.2 |
| **Real-time** | SignalR (Microsoft.AspNetCore.SignalR) |
| **Database** | PostgreSQL via Aspire.Npgsql.EntityFrameworkCore 13.1 |
| **ORM** | Entity Framework Core 10.0 (Code-First + Migrations) |
| **Auth** | JWT Bearer (Microsoft.AspNetCore.Authentication.JwtBearer 10.0) |
| **Validation** | FluentValidation 11.3 |
| **Resilience** | Polly 8.5 + Microsoft.Extensions.Http.Polly 10.0 |
| **Rate Limiting** | AspNetCoreRateLimit 5.0 |
| **Password Hashing** | BCrypt.Net-Next 4.0 |
| **API Docs** | Swashbuckle/Swagger + OpenAPI |
| **Telemetry** | OpenTelemetry (tracing, metrics, logging via Aspire ServiceDefaults) |
| **AI Integration** | GitHub.Copilot.SDK 0.1.19 |
| **Build System** | dotnet + npm (Vite) |
| **Testing** | xUnit, Reqnroll (BDD), Playwright, Vitest + React Testing Library |

### Key NuGet Packages
- `Aspire.Npgsql.EntityFrameworkCore.PostgreSQL` 13.1.0
- `Aspire.Hosting.PostgreSQL` 13.1.0
- `Aspire.Hosting.JavaScript` 13.1.0
- `Microsoft.AspNetCore.Authentication.JwtBearer` 10.0.2
- `FluentValidation.AspNetCore` 11.3.1
- `GitHub.Copilot.SDK` 0.1.19
- `Polly` 8.5.0
- `CsvHelper` 33.0.1
- `NJsonSchema` 11.1.0
- `Npgsql.EntityFrameworkCore.PostgreSQL` 10.0.0

### Frontend Packages
- `@microsoft/signalr` 10.0.0
- `react` 19.2.1 + `react-dom` 19.2.1
- `antd` 6.2.1 + `@ant-design/icons` 6.1.0
- `react-markdown` 10.1.0 + `react-syntax-highlighter` 16.1.0
- `vitest` 4.0.18 + `@testing-library/react` 16.3.2

---

## PROJECT STRUCTURE

```
bmadServer/
├── src/
│   ├── bmadServer.sln                          # Solution file
│   │
│   ├── bmadServer.AppHost/                     # .NET Aspire Orchestrator
│   │   ├── AppHost.cs                          # PostgreSQL + API + Frontend wiring
│   │   └── bmadServer.AppHost.csproj           # Aspire.AppHost.Sdk 13.1
│   │
│   ├── bmadServer.ServiceDefaults/             # Aspire Shared Defaults
│   │   ├── Extensions.cs                       # OTel, health checks, resilience
│   │   ├── Models/Workflows/                   # WorkflowDefinition, WorkflowStep
│   │   └── Services/Workflows/                 # WorkflowRegistry, BmadWorkflowRegistry
│   │
│   ├── bmadServer.ApiService/                  # Main API Service (275 C# files)
│   │   ├── Program.cs                          # 377-line service composition root
│   │   ├── Controllers/                        # 11 REST API controllers
│   │   ├── Hubs/ChatHub.cs                     # SignalR hub (533 lines)
│   │   ├── Data/                               # EF Core DbContext + 15 Entities
│   │   ├── DTOs/                               # 20+ request/response DTOs
│   │   ├── Models/                             # Domain models (Events, Workflows, Decisions)
│   │   ├── Services/                           # 30 service classes + interfaces
│   │   ├── Services/Workflows/                 # Workflow engine (30 files)
│   │   ├── Services/Workflows/Agents/          # Agent system (16 files)
│   │   ├── Validators/                         # FluentValidation validators (9 files)
│   │   ├── Middleware/                          # Activity tracking, session middleware
│   │   ├── BackgroundServices/                 # Session cleanup, conflict escalation
│   │   ├── Infrastructure/Policies/            # AgentCallPolicy (Polly)
│   │   ├── Configuration/                      # JwtSettings, SessionSettings
│   │   ├── Constants/                          # PersonaKeywords
│   │   └── Migrations/                         # EF Core migration (InitialCreate)
│   │
│   ├── bmadServer.Tests/                       # Unit + Integration tests (77 files)
│   │   ├── Unit/                               # Unit tests by domain
│   │   ├── Integration/                        # Full-stack integration tests
│   │   ├── Aspire/                             # Aspire-specific tests
│   │   └── Helpers/                            # TestDatabaseHelper, TestWorkflowRegistry
│   │
│   ├── bmadServer.ApiService.IntegrationTests/ # Aspire integration tests (4 files)
│   │
│   ├── bmadServer.BDD.Tests/                   # BDD/Reqnroll feature tests
│   │   ├── Features/                           # 9 .feature files (Epics 1-8 + CI/CD)
│   │   └── StepDefinitions/                    # Step definition implementations
│   │
│   ├── bmadServer.Playwright.Tests/            # E2E browser tests (7 specs)
│   │   ├── tests/epic3/                        # Chat interface E2E
│   │   ├── tests/epic8/                        # Persona switching E2E
│   │   └── pages/                              # Page Object Models
│   │
│   └── frontend/                               # React SPA (TypeScript/Vite)
│       ├── src/components/                     # 30+ React components
│       ├── src/hooks/                          # Custom hooks (SignalR, scroll, streaming)
│       ├── src/pages/                          # Page components
│       ├── src/types/                          # TypeScript type definitions
│       ├── src/data/                           # Static data (glossary)
│       └── src/styles/                         # CSS modules
│
├── _bmad-output/                               # BMAD planning & implementation artifacts
│   ├── planning-artifacts/                     # PRD, architecture, epics, ADRs
│   └── implementation-artifacts/               # Sprint stories, retrospectives
│
├── docs/                                       # API docs, SignalR examples
└── README.md
```

**Total source files:** 438 (excluding bin/obj/node_modules)

---

## GIT ANALYSIS

| Metric | Value |
|---|---|
| **Total Commits** | 188 |
| **Active Days** | 8 (Jan 20-29, 2026) |
| **Avg Commits/Day** | ~23.5 |
| **First Commit** | 2026-01-20 |
| **Latest Commit** | 2026-01-29 |
| **Project Age** | 10 days |
| **Branches (total)** | 11 (2 local, 9 remote) |

### Contributors
| Contributor | Role |
|---|---|
| **Cris Weber** | Primary developer, code review, merges |
| **copilot-swe-agent[bot]** | AI coding agent (Epics 6-8, code review fixes) |
| **Claude** | AI agent (LENS Phase 4-6 integration) |
| **Copilot** | AI agent (feature implementation) |

### Activity Pattern
- **Extremely high velocity** — 188 commits in 10 days
- **Burst development** — concentrated Jan 25-29 (most prolific)
- **Heavy AI-assisted development** — ~40% of commits from AI agents
- **Epic-driven cadence** — work organized into numbered Epics (1-9+)
- **Adversarial code review** pattern visible in commit messages

### Branch Strategy
- `main` — default, active
- `feature/*` — feature branches (test-coverage, chat-spark-alignment)
- `copilot/*` — AI agent PR branches
- `ui&GithubSDK` — UI integration branch

---

## LINES OF CODE

| Language | LOC | Files |
|---|---|---|
| C# (backend) | 9,257 | 275 |
| TypeScript/TSX (frontend) | 15,951 | 93 |
| CSS | — | 28 |
| JSON configs | — | 16 |
| BDD Features | — | 9 |
| **Total** | **~25,200** | **438** |

---

## ARCHITECTURE

### Pattern: .NET Aspire Orchestrated Full-Stack Application

```
┌─────────────────────────────────────────────┐
│              AppHost (Aspire)                │
│  Orchestrates startup order & health checks │
├─────────┬──────────────┬────────────────────┤
│         │              │                    │
│  PostgreSQL     API Service        React    │
│  (container)    (ASP.NET Core)     (Vite)   │
│         │              │                    │
│    ┌────┘     ┌────────┴────────┐           │
│    │          │                 │           │
│  EF Core   Controllers    SignalR Hub      │
│  DbContext  (11 REST)     (ChatHub)        │
│    │          │                 │           │
│    │     ┌────┴────┐      ┌────┴────┐      │
│    │     │Services │      │Real-time│      │
│    │     │(30+)    │      │Events   │      │
│    │     └────┬────┘      └─────────┘      │
│    │          │                              │
│    │   Workflow Engine                       │
│    │   ├─ AgentRouter                        │
│    │   ├─ StepExecutor                       │
│    │   ├─ AgentRegistry (Mock/BMAD/Copilot) │
│    │   └─ SharedContext                      │
│    │                                         │
│    └──── 15 Entity Tables ──────────────────┘
└─────────────────────────────────────────────┘
```

### Project Organization
- **AppHost** — .NET Aspire orchestrator: PostgreSQL → API → Frontend dependency chain
- **ServiceDefaults** — Shared Aspire configuration (OTel, health checks, resilience, service discovery)
- **ApiService** — Monolithic API with domain-separated folders (Controllers, Services, Data, Models)
- **Frontend** — React SPA served by Vite, connected via Aspire service discovery

### Service Registration Pattern
- Constructor injection via `builder.Services.AddScoped/Singleton`
- Interface-based abstractions for all services (`IXxxService` → `XxxService`)
- Conditional registration based on `TestMode` (Mock/Replay/Live)
- Agent system uses factory pattern (`AgentHandlerFactory`) with strategy selection

### Agent Test Modes
| Mode | Agent Handler | Workflow Registry | Purpose |
|---|---|---|---|
| **Mock** | `MockAgentHandler` | `WorkflowRegistry` (hardcoded) | Fast tests, no LLM |
| **Replay** | `ReplayAgentHandler` | `BmadWorkflowRegistry` (BMAD files) | Cached responses |
| **Live** | `CopilotAgentHandler` / `OpenCodeAgentHandler` | `BmadWorkflowRegistry` | Real AI calls |

---

## API SURFACE

### REST Controllers (11)
| Controller | Responsibility |
|---|---|
| `AuthController` | Login, register, JWT refresh |
| `UsersController` | User CRUD, profile, persona switching |
| `RolesController` | RBAC role assignment |
| `ChatController` | Chat operations |
| `WorkflowsController` | Workflow CRUD, status, step navigation |
| `DecisionsController` | Decision capture, versioning, locking, review |
| `CheckpointsController` | Workflow checkpoints, input queuing |
| `ConflictsController` | Decision conflict detection & resolution |
| `TranslationsController` | Business/technical language mapping |
| `BmadSettingsController` | Runtime BMAD configuration |
| `CopilotTestController` | AI agent testing interface |

### SignalR Hub
- **Endpoint:** `/hubs/chat`
- **Authentication:** JWT Bearer (token via query string)
- **Key Events:**
  - `SESSION_RESTORED` — session recovery on reconnect
  - `AGENT_HANDOFF` — agent-to-agent handoff notification
  - `MessageReceived` — chat message delivery
  - `WorkflowEvent` — workflow state changes
  - `PresenceEvent` — user presence tracking
  - `StepChanged` — workflow step transitions
  - `ConflictEvent` — decision conflict notifications
  - `DecisionMadeEvent` — decision capture events
- **Hub size:** 533 lines — handles message routing, workflow execution, persona translation

### Background Services
- `SessionCleanupService` — expired session garbage collection
- `ConflictEscalationJob` — escalates unresolved decision conflicts
- `ApprovalReminderService` — nudges pending human approvals

---

## DATA MODELS

### Entity Framework Entities (15 tables)
| Entity | Purpose |
|---|---|
| `User` | User accounts (email, password hash, persona settings) |
| `Session` | Active sessions with JSONB `WorkflowState` |
| `Workflow` | Workflow definitions |
| `WorkflowInstance` | Running workflow instances |
| `WorkflowEvent` | Workflow event log |
| `WorkflowStepHistory` | Step execution history |
| `WorkflowParticipant` | Multi-user workflow participants |
| `WorkflowCheckpoint` | Save/restore points |
| `QueuedInput` | Buffered user inputs during checkpoint operations |
| `RefreshToken` | JWT refresh tokens |
| `UserRole` / `Role` | RBAC role assignments |
| `Decision` | Decision capture with versioning |
| `DecisionVersion` | Version history for decisions |
| `DecisionConflict` | Conflicting decision detection |
| `DecisionReview` | Peer review requests on decisions |
| `AgentMessageLog` | Agent-to-agent message audit trail |
| `AgentHandoff` | Agent handoff tracking |
| `BufferedInput` | Concurrent input buffering |
| `Conflict` / `ConflictRule` | General conflict detection rules |
| `TranslationMapping` | Business↔technical language mappings |
| `ApprovalRequest` | Human-in-the-loop approval requests |

### Database Features
- **JSONB columns** — `WorkflowState` stored as PostgreSQL JSONB with GIN index
- **Check constraints** — e.g., `Session.ExpiresAt > CreatedAt`
- **Concurrency control** — optimistic concurrency via EF Core
- **Auto-migration** — `Database.Migrate()` on startup

---

## INTEGRATION POINTS

### External Services
| Integration | Package/Mechanism |
|---|---|
| **GitHub Copilot SDK** | `GitHub.Copilot.SDK` 0.1.19 — AI agent calls |
| **OpenCode CLI** | `OpenCodeAgentHandler` — shell-out to `opencode` binary |
| **PostgreSQL** | Aspire-managed container, connection via service discovery |
| **BMAD Framework** | Reads `agent-manifest.csv` and `workflow-manifest.csv` via `CsvHelper` |

### Infrastructure
- **Container orchestration:** .NET Aspire (not Docker Compose)
- **Database management:** pgAdmin UI via Aspire
- **Health checks:** `/health` and `/alive` endpoints (Aspire default)
- **Service discovery:** Aspire `WithReference()` pattern
- **Telemetry:** OpenTelemetry → OTLP exporter
- **Rate limiting:** Per-IP with endpoint-specific rules (login: 5/min, register: 3/hr)

---

## TEST COVERAGE

| Test Layer | Framework | Count | Scope |
|---|---|---|---|
| **Unit Tests** | xUnit | 77 files | Services, validators, models |
| **Integration Tests** | xUnit + TestWebApplicationFactory | 4 files | Aspire health, controllers |
| **BDD Tests** | Reqnroll (SpecFlow successor) | 9 features | Epics 1-8 + CI/CD + Workflow |
| **E2E Tests** | Playwright | 7 specs | Chat UI, persona switching |
| **Frontend Tests** | Vitest + RTL | 28 files | Component unit tests |

### BDD Feature Coverage
- Epic 1: Foundation
- Epic 2: Authentication
- Epic 3: Chat Interface
- Epic 5: Multi-Agent Collaboration
- Epic 6: Decision Management
- Epic 7: Collaboration
- Epic 8: Persona Translation
- GitHub Actions CI/CD
- Workflow Orchestration

**Notable:** Epic 4 (Workflow Engine) and Epic 9 (Persistence) have no BDD features.

---

## TECHNICAL DEBT SIGNALS

1. **Monolithic API project** — All 275 C# files in a single `ApiService` project. No domain separation into class libraries. Services/Workflows/Agents folder has 30 files that should be a separate project.

2. **Program.cs is 377 lines** — Service registration is manually wired, no modular registration pattern (extension methods per domain). Hard to maintain as service count grows.

3. **ChatHub is 533 lines** — Hub handles routing, workflow execution, persona translation, presence. Should be decomposed into smaller hubs or handler classes.

4. **Single EF migration** — `InitialCreate` migration suggests schema was built all at once rather than incrementally. Future schema changes need careful migration planning.

5. **Hardcoded JWT secret** — `appsettings.json` contains `OVERRIDE_THIS_IN_PRODUCTION...` placeholder. No evidence of secret management integration (Azure Key Vault, etc.).

6. **In-memory distributed cache** — `AddDistributedMemoryCache()` comment says "replace with Redis in production" but no Redis integration exists.

7. **Test mode conditional logic** — `Program.cs` has multiple `if (testMode == Mock)` branches creating divergent code paths. Risk of mode-specific bugs.

8. **Missing .gitignore for `nul`** — A `nul` file exists in the repo root (Windows device file artifact).

9. **AI-generated code velocity risk** — 40% of commits from AI agents with multi-round code review fixes visible in history. Suggests initial AI output required significant correction.

10. **No CI/CD pipeline file** — No `.github/workflows/`, `azure-pipelines.yml`, or similar. BDD feature exists for CI/CD but no actual pipeline.

11. **No Docker/containerization** — Frontend has `.dockerignore` but no `Dockerfile`. Deployment path unclear beyond Aspire local dev.

---

## RISKS & UNKNOWNS

| Risk | Severity | Details |
|---|---|---|
| **No CI/CD pipeline** | HIGH | No automated build/test/deploy. All 188 commits untested in CI. |
| **Young codebase** | MEDIUM | 10 days old, 188 commits. Pattern stability uncertain. |
| **Single contributor** | MEDIUM | One human developer + AI agents. Bus factor = 1. |
| **No production deployment path** | HIGH | Aspire local dev only. No cloud deployment config. |
| **JWT secret management** | HIGH | Placeholder secret in config. No Key Vault integration. |
| **Database migration strategy** | MEDIUM | Single `InitialCreate` migration. No seed data. |
| **Epic 4 & 9 untested by BDD** | LOW | Workflow engine and persistence have unit tests but no BDD. |
| **OpenCode CLI dependency** | MEDIUM | Shells out to local `opencode` binary. Not portable. |
| **`net10.0` target** | LOW | .NET 10 is preview (GA Nov 2025). Package compatibility risk. |
| **Frontend in devDependencies** | LOW | `antd`, `react-markdown` in devDeps instead of deps (won't affect Vite build but semantically incorrect). |

---

## EPIC PROGRESS SUMMARY

Based on commit messages and `_bmad-output/` artifacts:

| Epic | Name | Status |
|---|---|---|
| 1 | Foundation (Aspire Setup) | COMPLETE |
| 2 | Authentication (JWT) | COMPLETE |
| 3 | Chat Interface (SignalR) | COMPLETE |
| 4 | Workflow Engine | COMPLETE |
| 5 | Multi-Agent Collaboration | COMPLETE |
| 6 | Decision Management | COMPLETE |
| 7 | Real-time Collaboration | COMPLETE |
| 8 | Persona/Translation | COMPLETE |
| 9 | Persistence & Audit | COMPLETE (stories 9.1-9.6) |
| 10-13 | Implementation Readiness | PLANNED |

---

## SUMMARY METRICS

| Metric | Value |
|---|---|
| Source files | 438 |
| Lines of code | ~25,200 |
| C# LOC | 9,257 |
| TS/TSX LOC | 15,951 |
| .NET Projects | 6 (.csproj) + 1 (.esproj) |
| Controllers | 11 |
| Services | 30+ |
| DB Entities | 15+ |
| SignalR Hubs | 1 (ChatHub) |
| Test files | 116 (77 C# + 28 frontend + 7 Playwright + 4 integration) |
| BDD Features | 9 |
| NuGet packages | 14 (API) + 7 (ServiceDefaults) |
| npm packages | 24 |
| Commits | 188 in 10 days |
| Contributors | 1 human + 3 AI agents |
