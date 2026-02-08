# Discovery Report: bmadServer

---
repo: bmadServer
remote: https://github.com/crisweber2600/bmadServer.git
branch: main
commit: 42fab8ea1779d9cf4ce357dec65de8b165a17884
timestamp: 2026-02-07T12:00:00Z
domain: BMAD
service: CHAT
scanner: SCOUT DS (Deep Brownfield Discovery)
confidence: 0.93
---

## Overview / Business Purpose

bmadServer is a **.NET 10 Aspire-based full-stack application** serving as the backend API for the BMAD collaboration platform. It provides a multi-user chat system with AI agent orchestration, workflow management, decision tracking with conflict resolution, translation services, and checkpoint/rollback capabilities. The backend integrates the GitHub Copilot SDK for AI-powered agent interactions and uses SignalR for real-time communication.

This is the most feature-rich and actively developed backend in the BMAD ecosystem, with 188 commits and contributions from both human developers and AI agents (copilot-swe-agent, Claude).

## Technology Stack

| Technology | Version | Purpose |
|---|---|---|
| .NET | 10.0 | Runtime framework |
| ASP.NET Core | 10.0 | Web API framework |
| Aspire | 13.1.0 | Cloud-native orchestration |
| PostgreSQL | via Npgsql | Primary database |
| Entity Framework Core | 10.0.2 | ORM |
| SignalR | — | Real-time communication (ChatHub) |
| JWT | Bearer tokens | Authentication |
| BCrypt | 4.0.3 | Password hashing |
| Polly | 8.5.0 | Resilience/circuit breaker |
| FluentValidation | 11.3.1 | Request validation |
| GitHub Copilot SDK | 0.1.19 | AI agent integration |
| Swashbuckle | 10.1.0 | OpenAPI/Swagger |
| CsvHelper | 33.0.1 | CSV parsing |
| NJsonSchema | 11.1.0 | JSON schema validation |
| AspNetCoreRateLimit | 5.0.0 | Rate limiting |
| React | (frontend) | Frontend UI |
| TypeScript | (frontend) | Frontend language |
| Playwright | (tests) | E2E testing |
| SpecFlow/BDD | (tests) | BDD testing |
| xUnit | (tests) | Unit testing |

## Project Structure Map

```
bmadServer/
├── src/
│   ├── bmadServer.AppHost/              # Aspire AppHost orchestrator
│   ├── bmadServer.ServiceDefaults/      # Shared service defaults
│   ├── bmadServer.ApiService/           # Main API service
│   │   ├── Controllers/                 # 11 REST controllers
│   │   │   ├── AuthController.cs        # JWT authentication
│   │   │   ├── BmadSettingsController.cs # BMAD configuration
│   │   │   ├── ChatController.cs        # Chat operations
│   │   │   ├── CheckpointsController.cs # Workflow checkpoints
│   │   │   ├── ConflictsController.cs   # Conflict resolution
│   │   │   ├── CopilotTestController.cs # Copilot SDK testing
│   │   │   ├── DecisionsController.cs   # Decision tracking
│   │   │   ├── RolesController.cs       # Role management
│   │   │   ├── TranslationsController.cs # Translation mappings
│   │   │   ├── UsersController.cs       # User management
│   │   │   └── WorkflowsController.cs   # Workflow orchestration
│   │   ├── Data/
│   │   │   ├── ApplicationDbContext.cs  # EF Core DbContext
│   │   │   ├── ApplicationDbContextFactory.cs # Design-time factory
│   │   │   └── Entities/               # 14 entity classes + 1 enum
│   │   │       ├── User.cs, Role.cs, UserRole.cs
│   │   │       ├── Session.cs, RefreshToken.cs
│   │   │       ├── Decision.cs, DecisionVersion.cs, DecisionReview.cs
│   │   │       ├── Conflict.cs, DecisionConflict.cs
│   │   │       ├── TranslationMapping.cs
│   │   │       ├── Workflow.cs, AgentMessageLog.cs
│   │   │       ├── BufferedInput.cs
│   │   │       └── PersonaType.cs (enum)
│   │   ├── DTOs/                        # 20+ DTOs
│   │   ├── Models/
│   │   │   ├── Decisions/               # Decision domain models
│   │   │   ├── Events/                  # Domain events (SignalR)
│   │   │   ├── Workflows/              # Workflow state models
│   │   │   └── InputTypes.cs, WorkflowState.cs
│   │   ├── Hubs/
│   │   │   └── ChatHub.cs              # SignalR hub
│   │   ├── Services/                    # Business logic services
│   │   ├── BackgroundServices/          # Background jobs
│   │   │   ├── ConflictEscalationJob.cs
│   │   │   └── SessionCleanupService.cs
│   │   ├── Middleware/                  # HTTP middleware
│   │   │   ├── ActivityTrackingMiddleware.cs
│   │   │   └── SessionActivityMiddleware.cs
│   │   ├── Infrastructure/
│   │   │   └── Policies/AgentCallPolicy.cs # Polly circuit breaker
│   │   ├── Configuration/              # Settings classes
│   │   ├── Constants/                   # PersonaKeywords
│   │   ├── Migrations/                  # EF Core migrations
│   │   └── Program.cs                  # Startup configuration
│   ├── frontend/                        # React frontend
│   │   └── src/
│   │       ├── components/              # 30+ React components
│   │       ├── hooks/                   # Custom React hooks
│   │       ├── services/               # Frontend services
│   │       └── types/                  # TypeScript types
│   ├── bmadServer.Tests/               # Unit tests
│   ├── bmadServer.BDD.Tests/           # BDD/SpecFlow tests
│   ├── bmadServer.ApiService.IntegrationTests/ # Integration tests
│   └── bmadServer.Playwright.Tests/    # E2E Playwright tests
├── docs/                                # Documentation
│   └── examples/                       # Code examples
├── .aspire/                            # Aspire configuration
├── .mcp.json                           # MCP configuration
└── .opencode/                          # OpenCode integration
```

## Architecture Pattern Analysis

- **Pattern:** Layered MVC with domain events and CQRS-lite
- **Orchestration:** .NET Aspire AppHost (cloud-native deployment model)
- **API:** 11 RESTful controllers with OpenAPI documentation
- **Real-time:** SignalR `ChatHub` for live collaboration
- **Data Access:** EF Core with PostgreSQL, code-first migrations
- **Auth:** JWT Bearer tokens with BCrypt password hashing, refresh tokens
- **Resilience:** Polly circuit breaker policies for external service calls
- **Rate Limiting:** Per-user rate limiting via `AspNetCoreRateLimit`
- **Background Jobs:** Conflict escalation and session cleanup services
- **Validation:** FluentValidation for request validation
- **AI Integration:** GitHub Copilot SDK v0.1.19 for agent-powered chat
- **Frontend:** Embedded React frontend with component-test co-location

**Key architectural decisions:**
- Monolithic backend with clear layer separation (Controllers → Services → Data)
- Domain events for SignalR broadcasting (MessageReceived, PresenceEvent, StepChanged, etc.)
- Workflow checkpoint/rollback support
- Conflict detection and escalation pipeline
- Multi-persona system (technical vs. business users)

**Key files:**
- `src/bmadServer.ApiService/Program.cs` — Application startup
- `src/bmadServer.ApiService/Hubs/ChatHub.cs` — Real-time hub
- `src/bmadServer.ApiService/Data/ApplicationDbContext.cs` — Database schema
- `src/bmadServer.ApiService/Infrastructure/Policies/AgentCallPolicy.cs` — Circuit breaker

## Git Activity Summary

| Metric | Value |
|---|---|
| Total Commits | 188 |
| Commits (6 months) | 188 |
| First Commit | ~2026-01 |
| Last Commit | 2026-01-29 |
| Active Days | ~30 days |
| Contributors | 5 |

**Activity Status:** 🟡 PAUSED — Last commit Jan 29, 2026 (9 days ago). Rapid development period appears complete through Epic 9.

### Contributors

| Contributor | Commits | Percentage | Role |
|---|---|---|---|
| Cris Weber | 113 | 60% | Primary developer |
| copilot-swe-agent[bot] | 69 | 37% | AI agent (PR fixes, code review responses) |
| Claude | 2 | 1% | AI agent (LENS Phase 4-6) |
| Copilot | 2 | 1% | AI agent |
| cris weber | 2 | 1% | (alt email) |

**37% of commits are from AI agents** — significant AI-assisted development workflow.

## Commit Categories

| Category | Count (est.) | Percentage |
|---|---|---|
| Features (feat:) | ~60 | 32% |
| Fixes (fix:) | ~50 | 27% |
| Merge PRs | ~30 | 16% |
| Tests | ~20 | 11% |
| Refactor | ~15 | 8% |
| Chore/Config | ~13 | 7% |

**Epic-based development:** Commits reference Epics 1-9, with adversarial code reviews and retrospectives documented in commit messages. Structured lifecycle management visible.

**Key commit patterns:**
- "Epic N: [description]" — Epic implementation
- "Adversarial code review: Epic N" — Review findings
- "fix: Code review fixes" — Post-review corrections
- "Merge pull request #N" — PR-based workflow with copilot-swe-agent

## Key Dependencies

| Package | Version | Purpose |
|---|---|---|
| Aspire.Npgsql.EntityFrameworkCore.PostgreSQL | 13.1.0 | Database integration |
| GitHub.Copilot.SDK | 0.1.19 | AI agent framework |
| Microsoft.AspNetCore.Authentication.JwtBearer | 10.0.2 | JWT auth |
| Polly | 8.5.0 | Resilience patterns |
| FluentValidation.AspNetCore | 11.3.1 | Request validation |
| BCrypt.Net-Next | 4.0.3 | Password hashing |
| AspNetCoreRateLimit | 5.0.0 | Rate limiting |
| CsvHelper | 33.0.1 | CSV processing |
| Swashbuckle.AspNetCore | 10.1.0 | Swagger/OpenAPI |

## Integration Points

1. **bmad-chat** — React frontend (same CHAT domain/service)
2. **PostgreSQL** — Primary data store via Aspire
3. **GitHub Copilot SDK** — AI agent integration
4. **SignalR** — Real-time client communication
5. **GitHub** — PR workflow integration
6. **OpenCode** — `.opencode/` configuration for alternative AI tooling
7. **MCP** — `.mcp.json` for Model Context Protocol integration

## Technical Debt Signals

| Signal | Severity | Evidence |
|---|---|---|
| Large monolithic API | MEDIUM | 11 controllers, 13 entities in single service |
| Copilot SDK pre-release | HIGH | v0.1.19 is pre-1.0, API may change |
| 37% AI-generated code | MEDIUM | Need careful review for quality consistency |
| Epic retrospectives cite issues | MEDIUM | "Adversarial code review: CRITICAL FAILURES FOUND" |
| Multiple test projects | LOW | 4 test projects (unit, BDD, integration, Playwright) — good but may have coverage gaps |
| No AppHost Program.cs visible | LOW | AppHost may need review |
| Security middleware | LOW | Custom middleware for session tracking needs audit |

## Risks and Unknowns

1. **Copilot SDK stability** — v0.1.19 is pre-release; breaking changes likely
2. **Data model complexity** — 23 DbSet entity types across Data/Entities/ (13) and Models/Workflows/ (10) with complex relationships (decisions, conflicts, workflows, approvals, reviews)
3. **Background job reliability** — Conflict escalation and session cleanup need monitoring
4. **Frontend embedded** — React frontend lives inside the .NET solution, coupling deployment
5. **No CI/CD visible** — `.github/workflows/ci.yml` exists but needs validation
6. **Epic 10-13 planned** — Referenced in commits but not started; scope creep risk
7. **Rate limiting config** — Per-user rate limits need production tuning

## Confidence Score: 0.93

High confidence — well-structured .NET project with clear patterns. The Aspire integration, EF Core schema, and controller surface are all clearly documented in code. Minor uncertainty around the completeness of the epic implementation and AI-generated code quality.
