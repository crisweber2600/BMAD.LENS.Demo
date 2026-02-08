---
repo: bmadServer
remote: https://github.com/crisweber2600/bmadServer.git
default_branch: main
generated_at: 2026-02-07T12:00:00Z
domain: BMAD
service: CHAT
generator: lens-sync
confidence: 0.93
---

# bmadServer — Architecture

## Overview

bmadServer is a **.NET 10 Aspire-based full-stack application** serving as the backend API for the BMAD collaboration platform. It provides a multi-user chat system with AI agent orchestration, workflow management, decision tracking with conflict resolution, translation services, and checkpoint/rollback capabilities. The backend integrates the GitHub Copilot SDK for AI-powered agent interactions and uses SignalR for real-time communication.

**Business Purpose:** Backend orchestration for BMAD's collaborative AI-assisted development platform — managing chat sessions, agent interactions, workflow state, decision tracking, and real-time collaboration.

## Technology Stack

| Technology | Version | Purpose | Evidence |
|---|---|---|---|
| .NET | 10.0 | Runtime | `bmadServer.ApiService.csproj` `<TargetFramework>net10.0</TargetFramework>` |
| ASP.NET Core | 10.0 | Web API framework | `Program.cs` |
| .NET Aspire | 13.1.0 | Cloud-native orchestration | `Aspire.Npgsql.EntityFrameworkCore.PostgreSQL` v13.1.0 |
| PostgreSQL | via Npgsql 10.0.0 | Primary database | `Npgsql.EntityFrameworkCore.PostgreSQL` v10.0.0 |
| Entity Framework Core | 10.0.2 | ORM | `Microsoft.EntityFrameworkCore.Design` v10.0.2 |
| SignalR | built-in | Real-time communication (ChatHub) | `Hubs/ChatHub.cs` |
| JWT | 10.0.2 | Authentication | `Microsoft.AspNetCore.Authentication.JwtBearer` v10.0.2 |
| BCrypt.Net | 4.0.3 | Password hashing | `BCrypt.Net-Next` v4.0.3 |
| Polly | 8.5.0 | Resilience/circuit breaker | `Polly` v8.5.0 |
| FluentValidation | 11.3.1 | Request validation | `FluentValidation.AspNetCore` v11.3.1 |
| GitHub Copilot SDK | 0.1.19 | AI agent integration | `GitHub.Copilot.SDK` v0.1.19 |
| Swashbuckle | 10.1.0 | OpenAPI/Swagger | `Swashbuckle.AspNetCore` v10.1.0 |
| CsvHelper | 33.0.1 | CSV parsing | `CsvHelper` v33.0.1 |
| NJsonSchema | 11.1.0 | JSON schema validation | `NJsonSchema` v11.1.0 |
| AspNetCoreRateLimit | 5.0.0 | Rate limiting | `AspNetCoreRateLimit` v5.0.0 |
| React | 19.x | Embedded frontend | `frontend/` directory |

## Project Structure

```
bmadServer/
├── src/
│   ├── bmadServer.AppHost/                # Aspire orchestrator
│   │   └── AppHost.cs                     # PostgreSQL + API + Frontend orchestration
│   ├── bmadServer.ServiceDefaults/        # Shared service defaults
│   ├── bmadServer.ApiService/             # ── Main API Service ──
│   │   ├── Controllers/                   # 11 REST controllers
│   │   │   ├── AuthController.cs          # JWT auth (login, register, refresh)
│   │   │   ├── BmadSettingsController.cs  # App configuration
│   │   │   ├── ChatController.cs          # Chat sessions & messages
│   │   │   ├── CheckpointsController.cs   # Workflow checkpoints
│   │   │   ├── ConflictsController.cs     # Conflict detection/resolution
│   │   │   ├── CopilotTestController.cs   # Copilot SDK testing
│   │   │   ├── DecisionsController.cs     # Decision tracking
│   │   │   ├── RolesController.cs         # RBAC role management
│   │   │   ├── TranslationsController.cs  # Translation mappings
│   │   │   ├── UsersController.cs         # User management
│   │   │   └── WorkflowsController.cs     # Workflow orchestration
│   │   ├── Data/
│   │   │   ├── ApplicationDbContext.cs    # EF Core DbContext (23 DbSets)
│   │   │   └── Entities/                  # 15 entity classes + 1 enum
│   │   ├── DTOs/                          # 20+ Data Transfer Objects
│   │   ├── Models/
│   │   │   ├── Decisions/                 # Decision domain models
│   │   │   ├── Events/                    # Domain events (SignalR)
│   │   │   └── Workflows/                # Workflow state models
│   │   ├── Hubs/
│   │   │   └── ChatHub.cs                # SignalR real-time hub
│   │   ├── Services/                      # 18+ business logic services
│   │   ├── BackgroundServices/
│   │   │   ├── ConflictEscalationJob.cs  # Timed conflict escalation
│   │   │   └── SessionCleanupService.cs  # Session lifecycle cleanup
│   │   ├── Middleware/
│   │   │   ├── ActivityTrackingMiddleware.cs
│   │   │   └── SessionActivityMiddleware.cs
│   │   ├── Infrastructure/
│   │   │   └── Policies/AgentCallPolicy.cs  # Polly circuit breaker
│   │   ├── Configuration/                # Settings classes
│   │   ├── Constants/                    # PersonaKeywords
│   │   ├── Migrations/                   # EF Core migrations
│   │   └── Program.cs                   # Application startup
│   └── frontend/                         # Embedded React 19 frontend
│       └── src/                          # Components, hooks, services, types
├── tests/
│   ├── bmadServer.Tests/                 # Unit tests
│   ├── bmadServer.BDD.Tests/             # BDD/SpecFlow tests
│   ├── bmadServer.ApiService.IntegrationTests/ # Integration tests
│   └── bmadServer.Playwright.Tests/      # E2E Playwright tests
└── docs/                                # Documentation
```

## Architecture Pattern

**Pattern:** Layered MVC with Domain Events and Aspire Orchestration

```
┌─────────────────────────────────────────────────────┐
│                  Aspire AppHost                      │
│  PostgreSQL ──→ bmadServer.ApiService ──→ React UI  │
│       ↓              ↓          ↓                    │
│    pgAdmin    Health Checks  Service Discovery       │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────┴──────────────────────────────┐
│              bmadServer.ApiService                    │
│                                                      │
│  Controllers ──→ Services ──→ DbContext ──→ PostgreSQL│
│       ↓              ↓                               │
│  Validators     Hubs/ChatHub (SignalR)               │
│  (FluentVal)         ↓                               │
│              Domain Events → Clients                 │
│                                                      │
│  Middleware: ActivityTracking, SessionActivity        │
│  Background: ConflictEscalation, SessionCleanup      │
│  Resilience: Polly AgentCallPolicy (circuit breaker) │
└──────────────────────────────────────────────────────┘
```

| Pattern Element | Description | Evidence |
|--|--|--|
| Layered MVC | Controllers → Services → DbContext | 11 controllers, 18+ services |
| Service Interfaces | `IXxxService` / `XxxService` pairs | `IJwtTokenService.cs`, `JwtTokenService.cs` |
| FluentValidation | Request DTO validation | `RegisterRequestValidator`, `LoginRequestValidator` |
| Domain Events | SignalR broadcasting | `Models/Events/` (MessageReceived, PresenceEvent) |
| Circuit Breaker | Polly policy for external calls | `Infrastructure/Policies/AgentCallPolicy.cs` |
| Background Jobs | Timed services | `ConflictEscalationJob.cs`, `SessionCleanupService.cs` |

## Key Design Decisions

1. **Aspire orchestration** — Cloud-native deployment with service discovery, health checks, and pgAdmin dev tooling.
2. **Single DbContext with 23 entities** — All entities in `ApplicationDbContext` rather than bounded context separation.
3. **SignalR for real-time** — `ChatHub` provides message streaming, presence, and step-changed events.
4. **JWT + BCrypt** — Custom auth implementation rather than ASP.NET Identity.
5. **Polly circuit breaker** — Resilience policy for GitHub Copilot SDK calls (external dependency).
6. **Embedded frontend** — React frontend deployed alongside API via Aspire `AddViteApp()`.

## Dependencies

| Package | Version | Purpose |
|---|---|---|
| `Aspire.Npgsql.EntityFrameworkCore.PostgreSQL` | 13.1.0 | Database integration |
| `GitHub.Copilot.SDK` | 0.1.19 | AI agent framework |
| `Microsoft.AspNetCore.Authentication.JwtBearer` | 10.0.2 | JWT auth |
| `Npgsql.EntityFrameworkCore.PostgreSQL` | 10.0.0 | PostgreSQL EF Core provider |
| `Microsoft.EntityFrameworkCore.Design` | 10.0.2 | EF Core migrations |
| `Polly` | 8.5.0 | Resilience patterns |
| `Microsoft.Extensions.Http.Polly` | 10.0.0 | HttpClient resilience |
| `FluentValidation.AspNetCore` | 11.3.1 | Request validation |
| `BCrypt.Net-Next` | 4.0.3 | Password hashing |
| `AspNetCoreRateLimit` | 5.0.0 | Rate limiting |
| `CsvHelper` | 33.0.1 | CSV processing |
| `Swashbuckle.AspNetCore` | 10.1.0 | Swagger/OpenAPI |
| `NJsonSchema` | 11.1.0 | JSON schema validation |

## Security Considerations

- JWT Bearer authentication with refresh token rotation
- BCrypt password hashing (cost factor configurable)
- RBAC via `RolesController` + `RoleService`
- FluentValidation on all request DTOs (input sanitization)
- Session activity tracking middleware
- Rate limiting via `AspNetCoreRateLimit`
- Polly circuit breaker for external Copilot SDK calls

## Technical Debt

| Signal | Severity | Evidence |
|---|---|---|
| Copilot SDK pre-release | HIGH | `GitHub.Copilot.SDK` v0.1.19 — pre-1.0, API will change |
| No MediatR/CQRS | MEDIUM | Controllers directly call services; no command/query segregation |
| No repository pattern | MEDIUM | Services directly use `DbContext` (tight coupling) |
| 23 DbSets single context | MEDIUM | May benefit from bounded context separation |
| 37% AI-generated commits | MEDIUM | 69 of 188 commits from copilot-swe-agent |
| Epic retrospectives cite issues | MEDIUM | "Adversarial code review: CRITICAL FAILURES FOUND" |
| Embedded frontend | LOW | React frontend coupled to API deployment |

## Risks

1. **Copilot SDK stability** — v0.1.19 is pre-release; breaking changes expected
2. **Data model complexity** — 15 entity types with versioning, conflicts, and reviews
3. **Background job reliability** — Conflict escalation and session cleanup need production monitoring
4. **Epic 10-13 planned** — Referenced in commits but not started; scope creep risk
5. **Single DbContext scaling** — 23 entities may need split as features grow

## Related Documentation

- [API Surface](api-surface.md) — Endpoints grouped by controller
- [Data Model](data-model.md) — Entity relationship diagram
- [Integration Map](integration-map.md) — Service dependencies
- [Onboarding](onboarding.md) — Setup and development workflow
