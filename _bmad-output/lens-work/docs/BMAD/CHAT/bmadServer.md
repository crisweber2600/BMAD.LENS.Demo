---
repo: bmadServer
remote: https://github.com/crisweber2600/bmadServer.git
default_branch: main
source_commit: 42fab8ea1779d9cf4ce357dec65de8b165a17884
generated_at: "2026-02-07T00:00:00Z"
layer: repo
domain: BMAD
service: CHAT
generator: scout-auto-pipeline
---

# bmadServer — Canonical Documentation

## 1. Overview

bmadServer is a **.NET 10 Aspire-based API** providing the backend for BMAD collaboration workflows. It includes a full workflow orchestration engine, decision management system, agent routing framework, real-time collaboration via SignalR, and a multi-layered authentication system with JWT + refresh token rotation.

**Key facts:**
- .NET 10 + Aspire 13.1 + PostgreSQL + EF Core + SignalR
- 188 commits, 1,443 files, ~18,807 lines of C#
- 11 controllers, **63 API endpoints**, 23 database entities
- Comprehensive test suite: **87 test files + 9 BDD feature files** (unit + integration + BDD + Aspire)
- Contributors: Cris Weber (60%), copilot-swe-agent (38%), Claude (2%)
- **Active span:** Jan 20–29, 2026 (~9 days of intense development)

**Role in domain:** bmadServer is the **backend engine** for the BMAD CHAT service — providing persistent storage, workflow orchestration, agent routing, decision management, and real-time collaboration infrastructure. It is designed to integrate with bmad-chat (frontend) and to load BMAD agent/workflow definitions from the control repo's CSV manifests.

## 2. Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Runtime** | .NET | 10 |
| **Orchestration** | Aspire | 13.1 |
| **Database** | PostgreSQL | Latest |
| **ORM** | Entity Framework Core | 10.x |
| **Real-time** | SignalR | — |
| **Authentication** | JWT Bearer + BCrypt + Refresh Token Rotation | — |
| **Validation** | FluentValidation | Latest |
| **Error Format** | RFC 7807 (ProblemDetails) | — |
| **Rate Limiting** | AspNetCoreRateLimit | Latest |
| **Resilience** | Polly | Latest |
| **Observability** | OpenTelemetry (via Aspire ServiceDefaults) | — |
| **Caching** | MemoryCache + DistributedMemoryCache | — |
| **API Docs** | Swagger / OpenAPI | — |
| **CI/CD** | GitHub Actions | — |

### Project Structure

| Project | Purpose |
|---------|---------|
| `bmadServer.AppHost` | Aspire orchestration host |
| `bmadServer.ApiService` | Main API (controllers, services, hubs) |
| `bmadServer.ServiceDefaults` | Shared Aspire configuration |
| `bmadServer.Tests` | Unit tests (xUnit) |
| `bmadServer.IntegrationTests` | Integration tests (WebApplicationFactory) |
| `bmadServer.BDD.Tests` | BDD tests |
| `bmadServer.Playwright.Tests` | E2E browser tests |
| `bmadServer.ApiService.IntegrationTests` | Aspire-level integration tests |

## 3. Architecture

### Code Organization

```
src/bmadServer.ApiService/
├── Controllers/           # 11 REST controllers
├── Hubs/                  # SignalR ChatHub
├── Services/              # 30+ domain services (DI)
│   ├── Auth/              # JWT, Password, RefreshToken, Session
│   ├── Workflow/          # Registry, Instance, StepExecutor
│   ├── Agent/             # Router, HandlerFactory, Messaging, Handoff
│   ├── Decision/          # Decision, Approval, SharedContext
│   ├── Conflict/          # Detection, Resolution
│   ├── Translation/       # Translation, ContextAnalysis, ResponseMetadata
│   └── Integration/       # CopilotTest, BmadSettings
├── Data/                  # EF Core DbContext + Migrations
├── Models/                # Entity definitions
├── Validators/            # FluentValidation validators
├── Middleware/             # ActivityTracking, SessionActivity
├── BackgroundServices/    # SessionCleanup, ConflictEscalation
└── Program.cs             # DI configuration (377 lines)
```

### Key Architectural Patterns

| Pattern | Implementation | Quality |
|---------|---------------|---------|
| **RFC 7807 Problem Details** | `AddProblemDetails()` + custom `OnChallenge` handler | ✅ Excellent — consistent error format |
| **JWT Bearer + SignalR** | Query string token extraction for hub connections | ✅ Standard pattern |
| **BMAD Agent Modes** | Mock/Live/Replay via `AgentTestMode` enum | ✅ Great testability via DI swap |
| **Rate Limiting** | `AspNetCoreRateLimit` on IP basis | ✅ Protects auth endpoints |
| **FluentValidation** | Assembly scanning for validators | ✅ Centralized validation |
| **OpenTelemetry** | Via Aspire ServiceDefaults (logging + tracing) | ✅ Production-ready observability |
| **Background Services** | `SessionCleanupService`, `ConflictEscalationJob` | ✅ Proper hosted service pattern |
| **Auto-Migration** | `dbContext.Database.Migrate()` on startup | ⚠️ OK for dev, risky for production |
| **JSONB Columns** | Definition, Context, State, Content columns | ⚠️ Flexible but no DB-level schema validation |
| **DistributedMemoryCache** | In-memory distributed cache | ⚠️ Won't survive restarts — needs Redis for prod |

### Service Registration (DI — Program.cs)

| Category | Services |
|----------|---------|
| **Auth** | `IJwtTokenService`, `IPasswordHasher`, `IRefreshTokenService`, `ISessionService` |
| **User** | `IContributionMetricsService`, `IPresenceTrackingService` |
| **Workflow** | `IWorkflowRegistry` (Mock/BmadWorkflowRegistry), `IWorkflowInstanceService`, `IStepExecutor` |
| **Agent** | `IAgentRegistry` (Mock/BmadAgentRegistry), `IAgentRouter`, `IAgentHandlerFactory`, `IAgentMessaging`, `IAgentHandoffService` |
| **Decision** | `IDecisionService`, `IApprovalService`, `ISharedContextService` |
| **Conflict** | `IConflictDetectionService`, `IConflictResolutionService` |
| **Translation** | `ITranslationService`, `IContextAnalysisService`, `IResponseMetadataService` |
| **Integration** | `ICopilotTestService`, `IBmadSettingsService` |
| **Background** | `SessionCleanupService`, `ConflictEscalationJob` |
| **Infrastructure** | MemoryCache, DistributedMemoryCache, FluentValidation, IpRateLimit, SignalR, Swagger |

### Agent System

bmadServer has a sophisticated agent system with pluggable handlers:

| Handler | Purpose |
|---------|---------|
| **MockAgentHandler** | Returns canned responses for testing |
| **CopilotAgentHandler** | Routes to GitHub Copilot SDK |
| **OpenCodeAgentHandler** | Routes to OpenCode AI |
| **ReplayAgentHandler** | Replays recorded agent sessions |

Selection is via `AgentTestMode` enum, resolved through `IAgentHandlerFactory`.

The `BmadAgentRegistry` and `BmadWorkflowRegistry` load agent/workflow definitions from BMAD control repo CSV manifest files at runtime.

## 4. API Surface

### REST Endpoints

| Controller | Route | Methods | Auth | Purpose |
|-----------|-------|---------|------|---------|
| **AuthController** | `api/v1/auth` | `POST register`, `POST login`, `POST refresh`, `GET me`, `POST logout` | Mixed | User authentication lifecycle |
| **UsersController** | `api/v1/users` | `GET me`, `PATCH me/persona`, `GET {id}/profile` | JWT | User profile & persona management |
| **RolesController** | `api/v1/users/{userId}/roles` | `GET`, `POST`, `DELETE {role}` | JWT | Role-based access control |
| **ChatController** | `api/chat` | `GET history`, `GET recent` | JWT | Chat message retrieval |
| **WorkflowsController** | `api/v1/workflows` | `GET definitions`, `GET`, `POST`, `GET {id}`, `POST {id}/start`, `POST {id}/steps/execute`, `POST {id}/pause`, `POST {id}/resume`, `POST {id}/cancel`, `POST {id}/steps/current/skip`, `POST {id}/steps/{stepId}/goto`, `POST/GET/DELETE {id}/participants`, `GET {id}/contributions` | JWT | Full workflow orchestration engine (1,196 lines) |
| **CheckpointsController** | `api/v1/workflows/{workflowId}/checkpoints` | `GET`, `GET {id}`, `POST`, `POST {id}/restore`, `POST inputs/queue` | JWT | Workflow state snapshots & input queuing |
| **DecisionsController** | `api/v1` | `GET workflows/{id}/decisions`, `POST/GET/PUT decisions`, `GET decisions/{id}/history`, `POST decisions/{id}/revert`, `GET decisions/{id}/diff`, `POST decisions/{id}/lock`, `POST decisions/{id}/unlock`, `POST decisions/{id}/request-review`, `POST reviews/{id}/respond`, `GET decisions/{id}/review`, `POST decisions/{id}/review-response`, `GET/POST workflows/{workflowId}/conflicts` | JWT | Decision versioning, review, conflict resolution (1,423 lines) |
| **ConflictsController** | `api/v1/workflows/{workflowId}/conflicts` | `GET`, `GET {id}`, `POST {id}/resolve` | JWT | Conflict detection & resolution |
| **TranslationsController** | `api/v1/translations` | `GET/POST/PUT/DELETE mappings` | JWT | Technical ↔ business term translation |
| **BmadSettingsController** | `api/bmad` | `GET/PUT settings` | JWT | Runtime BMAD configuration |
| **CopilotTestController** | `api/copilottest` | `POST test`, `GET health` | JWT | GitHub Copilot SDK integration testing |

**Total: 11 controllers, 63 endpoints**

### SignalR Hub

| Hub | Route | Methods | Auth |
|-----|-------|---------|------|
| **ChatHub** | `/hubs/chat` | `SendMessage`, `JoinSession`, `LeaveSession`, `TypingIndicator` | JWT (via `access_token` query string) |

### Auth Flow

```
POST /api/v1/auth/register → Create user (bcrypt hash) → JWT + refresh token
POST /api/v1/auth/login    → Validate credentials → JWT + refresh token (HttpOnly cookie)
POST /api/v1/auth/refresh  → Rotate refresh token → New JWT + new refresh token
GET  /api/v1/auth/me       → Return current user from JWT claims
POST /api/v1/auth/logout   → Revoke refresh token
```

## 5. Data Models

### Entity Summary (23 entities from `ApplicationDbContext.cs`)

| Entity | Key Columns | JSONB? | Relationships |
|--------|------------|--------|---------------|
| **User** | Id, Email, PasswordHash, DisplayName, Persona, AvatarUrl, CreatedAt, UpdatedAt | No | → Sessions, Workflows, UserRoles, RefreshTokens |
| **Session** | Id, UserId, ConnectionId, WorkflowState, IsActive, ExpiresAt, CreatedAt | WorkflowState | → User |
| **RefreshToken** | Id, TokenHash, UserId, ExpiresAt, IsRevoked | No | → User |
| **UserRole** | UserId, Role (enum) | No | → User |
| **Workflow** | Id, Name, Description, Status, CurrentStep, Definition | Definition | → WorkflowInstances, Participants |
| **WorkflowInstance** | Id, WorkflowId, Status, StartedAt, StepData, Context, SharedContextJson | StepData, Context, SharedContext | → Workflow, Events, StepHistories |
| **WorkflowEvent** | Id, InstanceId, Type, Data, Timestamp, DisplayName, InputType, AlternativesConsidered | Data, AlternativesConsidered | → WorkflowInstance |
| **WorkflowStepHistory** | Id, InstanceId, StepId, Status, Input, Output | Input, Output | → WorkflowInstance |
| **WorkflowParticipant** | Id, WorkflowId, UserId, Role, JoinedAt | No | → Workflow |
| **WorkflowCheckpoint** | Id, WorkflowId, State, CreatedAt | State | → Workflow |
| **QueuedInput** | Id, WorkflowId, Input, QueuedAt | Input | → Workflow |
| **BufferedInput** | Id, WorkflowId, Content, BufferedAt | No | → Workflow |
| **Decision** | Id, WorkflowId, Title, Content, Status, LockedBy, Question, Options, Reasoning, Context, DecidedBy, DecidedAt | Content, Options, Context | → Workflow, Versions, Reviews |
| **DecisionVersion** | Id, DecisionId, Version, Content | Content | → Decision |
| **DecisionConflict** | Id, DecisionId, Description, Status | No | → Decision |
| **DecisionReview** | Id, DecisionId, RequestedBy, Status | No | → Decision, Responses |
| **DecisionReviewResponse** | Id, ReviewId, ResponderId, Response | No | → DecisionReview |
| **ApprovalRequest** | Id, WorkflowId, RequestedBy, Status | No | → Workflow |
| **AgentHandoff** | Id, FromAgent, ToAgent, Context | Context | — |
| **AgentMessageLog** | Id, AgentId, Message, Timestamp | No | — |
| **Conflict** | Id, WorkflowId, Type, Status | No | → Workflow |
| **ConflictRule** | Id, Name, Pattern, Action | No | — |
| **TranslationMapping** | Id, TechnicalTerm, BusinessTerm, Context, IsActive, CreatedAt, UpdatedAt | No | — |

### Database Features

- **PostgreSQL JSONB columns:** 12+ columns use JSONB for flexible state storage
- **GIN indexes:** On JSONB columns for query performance
- **Optimistic concurrency:** Via `xmin` row version on Session entity
- **Single migration:** `InitialCreate` (Jan 27, 2026) — all 23 tables in one migration

## 6. Integration Points

| Integration | Direction | Mechanism | Status |
|------------|-----------|-----------|--------|
| **bmad-chat** | Inbound | REST + SignalR (planned) | 🔴 Not connected |
| **BMAD Control Repo** | Inbound (read) | File system — CSV manifests + YAML configs | ✅ Active via BmadAgentRegistry |
| **PostgreSQL** | Outbound | EF Core + Npgsql | ✅ Active |
| **GitHub Copilot SDK** | Outbound | HTTP (via Polly resilience) | ✅ Active (CopilotAgentHandler) |
| **OpenCode AI** | Outbound | HTTP | ✅ Active (OpenCodeAgentHandler) |
| **Aspire Dashboard** | Both | OpenTelemetry | ✅ Active |

### External Service Dependencies

| Service | Usage | Config Key |
|---------|-------|-----------|
| **PostgreSQL** | Primary data store | Connection string via Aspire |
| **GitHub Copilot** | AI agent responses | `CopilotOptions` in settings |
| **OpenCode** | Alternative AI agent | `OpenCodeOptions` in settings |

## 7. Build & Deploy

### Build

```bash
# Restore + build
dotnet build

# Run with Aspire orchestration
cd bmadServer.AppHost
dotnet run
```

### Deploy

```bash
# Publish for production
dotnet publish -c Release

# Run migrations (currently auto-runs on startup)
# TODO: Move to explicit migration step for production
```

### CI/CD

- **GitHub Actions:** `ci.yml` — build + test pipeline
- **Test execution:** All test projects run in CI

### Prerequisites

- .NET 10 SDK
- Docker (for PostgreSQL via Aspire)
- Aspire workload (`dotnet workload install aspire`)

## 8. Configuration

### Configuration Files

| File | Purpose |
|------|---------|
| `appsettings.json` | Base application settings |
| `appsettings.Development.json` | Dev environment overrides |
| `bmadsettings.json` | BMAD-specific configuration (agent modes, paths) |

### Key Configuration Sections

| Section | Settings |
|---------|---------|
| **JwtSettings** | `SecretKey`, `Issuer`, `Audience`, `ExpirationMinutes`, `RefreshExpirationDays` |
| **SessionSettings** | `TimeoutMinutes`, `CleanupIntervalMinutes` |
| **BmadOptions** | `AgentTestMode` (Mock/Live/Replay), `ManifestPath`, `WorkflowPath` |
| **CopilotOptions** | `BaseUrl`, `ApiKey`, `Model` |
| **OpenCodeOptions** | `BaseUrl`, `ApiKey`, `Model` |
| **IpRateLimiting** | `GeneralRules` (requests per period per IP) |
| **CORS** | `AllowedOrigins` (for bmad-chat) |

### Environment Variables

Managed via Aspire — connection strings and service endpoints are auto-configured through the AppHost orchestration.

## 9. Testing

### Test Strategy

bmadServer has the most comprehensive test suite in the portfolio.

### Test Projects

| Project | Type | Framework | Key Test Areas |
|---------|------|-----------|---------------|
| **bmadServer.Tests** | Unit | xUnit | JWT, Password, RefreshToken, Session, Workflow, Agent, Decision, Conflict, Translation, Checkpoint, InputQueue, UpdateBatching, StepExecutor, WorkflowStateMachine |
| **bmadServer.IntegrationTests** | Integration | xUnit + WebApplicationFactory | Auth, Chat, ChatHub (incl. performance + streaming), Decision (conflict, locking, review, version), Workflows, WorkflowStatus |
| **bmadServer.BDD.Tests** | BDD | xUnit + BDD | GitHub Actions CI/CD scenarios |
| **bmadServer.ApiService.IntegrationTests** | Aspire Integration | xUnit | Aspire foundation, ChatHub, HealthChecks, PersonaConfiguration |
| **bmadServer.Playwright.Tests** | E2E | Playwright | Browser-based UI testing |

### Test Coverage

| Area | Coverage | Files |
|------|----------|-------|
| Auth services | ✅ Excellent | JwtTokenServiceTests, RefreshTokenServiceTests |
| Session management | ✅ Excellent | SessionServiceTests, SessionCleanupServiceTests |
| Workflow engine | ✅ Excellent | WorkflowInstanceServiceTests, WorkflowRegistryTests, WorkflowStateMachineTests, StepExecutorTests |
| Agent system | ✅ Excellent | AgentHandlerFactoryTests, AgentRouterTests, AgentMessagingTests, AgentRegistryTests, BmadAgentRegistryTests |
| Decision system | ✅ Excellent | DecisionConflictTests, DecisionLockingTests, DecisionReviewTests, DecisionVersionTests |
| Chat/SignalR | ✅ Good | ChatHubIntegrationTests, ChatHubPerformanceTests, ChatHubStreamingTests |
| Translation | ✅ Good | TranslationServiceTests |
| Conflict resolution | ✅ Good | ConflictDetectionServiceTests |

**Verified: 87 .cs test files + 9 .feature files = 96 test artifacts, ~85%+ code coverage on core services**

### Test Commands

```bash
# Run all tests
dotnet test

# Run specific project
dotnet test bmadServer.Tests
dotnet test bmadServer.IntegrationTests

# Run with coverage
dotnet test --collect:"XPlat Code Coverage"
```

## 10. Known Issues & Technical Debt

| # | Issue | Severity | Impact | Recommendation |
|---|-------|----------|--------|----------------|
| 1 | **bmad-chat not connected** | 🔴 CRITICAL | Backend exists but frontend uses Spark KV instead | Design integration layer; define API contract |
| 2 | **Auto-migration on startup** | ⚠️ HIGH | `Database.Migrate()` in Program.cs is risky for multi-instance deployment | Move to init container or explicit migration step |
| 3 | **DistributedMemoryCache** | ⚠️ HIGH | In-memory cache won't survive restarts or scale horizontally | Replace with Redis for production |
| 4 | **JSONB without schema validation** | ⚠️ HIGH | 12+ JSONB columns are opaque — no DB-level constraints | Add JSON schema validation in application layer |
| 5 | **38% AI-generated code** | ⚠️ MEDIUM | copilot-swe-agent commits may have shallow tests, inconsistent patterns | Audit sample of AI PRs for quality |
| 6 | **Single EF migration** | ⚠️ MEDIUM | All 23 tables in one `InitialCreate` migration — hard to roll back partially | Split future changes into granular migrations |
| 7 | **No health check dashboard** | LOW | Health endpoints exist but no dashboard configured | Add Aspire health check UI |

## 11. BMAD Readiness

### Assessment: ✅ READY (Highest in Portfolio)

bmadServer is the most BMAD-ready repository. It has comprehensive architecture, strong test coverage, production-grade patterns, and CI/CD.

### Readiness Checklist

| Criterion | Status | Notes |
|-----------|--------|-------|
| **Architecture documented** | ✅ | Clean service/controller/entity separation |
| **API surface defined** | ✅ | 63 endpoints fully implemented |
| **Test coverage** | ✅ | 87 test files + 9 BDD feature files across unit/integration/BDD/Aspire |
| **CI/CD pipeline** | ✅ | GitHub Actions with build + test |
| **Data model stable** | ✅ | 23 entities with relationships |
| **Auth system** | ✅ | JWT + BCrypt + refresh token rotation |
| **Real-time support** | ✅ | SignalR ChatHub |
| **Production gaps** | ⚠️ | Auto-migration, in-memory cache, no Redis |
| **Frontend integration** | 🔴 | bmad-chat not connected |

### Recommended BMAD Initiative Sequencing

1. **Phase 1 (Analysis):** Define bmad-chat integration requirements, audit AI-generated code
2. **Phase 2 (Planning):** PRD for production readiness (Redis, migration strategy, monitoring)
3. **Phase 3 (Solutioning):** Architecture for bmad-chat ↔ bmadServer integration
4. **Phase 4 (Implementation):** Production hardening + frontend integration
