# bmadServer — Deep Technical Analysis
> SCOUT AC Workflow | Generated: 2026-02-07 | Confidence: HIGH (90%)

## 1. Technology Stack

| Component | Technology | Version | Source |
|-----------|-----------|---------|--------|
| Runtime | .NET 10 | 10.0 | `bmadServer.ApiService.csproj` |
| Orchestration | .NET Aspire | 13.1 | `AppHost.cs` |
| Database | PostgreSQL | via Npgsql 10.0 | Aspire service discovery |
| ORM | Entity Framework Core | 10.0 | Npgsql.EntityFrameworkCore.PostgreSQL |
| Real-time | SignalR | built-in | `Hubs/ChatHub.cs` |
| Auth | JWT Bearer | 10.0.2 | Microsoft.AspNetCore.Authentication.JwtBearer |
| Validation | FluentValidation | 11.3.1 | FluentValidation.AspNetCore |
| Frontend | React 19 + Vite | 19.x | `frontend/` |
| UI Framework | Tailwind CSS 4 | 4.x | `frontend/package.json` |

**Total Source Files:** ~438 files (~25K LOC estimated)

## 2. API Surface

### Controllers (11)
| Controller | Domain | Evidence |
|-----------|---------|----------|
| `AuthController` | Authentication/JWT | Login, Register, Refresh |
| `ChatController` | Messaging core | CRUD sessions, messages |
| `CheckpointsController` | Workflow checkpoints | GET, POST |
| `ConflictsController` | Conflict detection/resolution | GET |
| `CopilotTestController` | AI integration testing | SDK integration |
| `DecisionsController` | Decision tracking | CRUD |
| `RolesController` | RBAC | GET, POST |
| `TranslationsController` | i18n/l10n | Translation mappings |
| `UsersController` | User management | CRUD |
| `WorkflowsController` | Workflow orchestration | GET, POST |
| `BmadSettingsController` | App settings | Configuration |

**Total Endpoints: 63** (from `[Http*]` attribute count)

### Real-time API (SignalR)
| Hub | Path | Functions |
|-----|------|-----------|
| `ChatHub` | `/hubs/chat` | Message streaming, presence, collaboration |

## 3. Data Models

### DbContext: `ApplicationDbContext` — 23 DbSets
Key entity domains:
- **Chat:** Sessions, Messages, Participants, Streaming
- **Auth:** Users, Roles, RefreshTokens
- **Workflows:** Workflows, Checkpoints, Decisions
- **Collaboration:** Conflicts, ConflictResolutions, Translations
- **Settings:** BmadSettings, ContributionMetrics

## 4. Architecture Pattern

**Primary: Layered Architecture with Service + Validator Pattern**

```
Controllers → Services → DbContext → PostgreSQL
          ↘ Validators (FluentValidation)
          ↘ Hubs/ChatHub (SignalR - real-time)
          ↘ Middleware (ActivityTracking, SessionActivity)
```

### Service Layer (18+ services)
Key services: `JwtTokenService`, `SessionService`, `ConflictDetectionService`, `ConflictResolutionService`, `ContextAnalysisService`, `ContributionMetricsService`, `PresenceTrackingService`, `UpdateBatchingService`, `TranslationService`, `CopilotTestService`

All services follow interface-implementation pattern (`IXxxService` / `XxxService`).

### Validator Layer (10+ validators)
`RegisterRequestValidator`, `LoginRequestValidator`, `AssignRoleRequestValidator`, `ResolveConflictRequestValidator`, etc.

### Middleware
- `ActivityTrackingMiddleware` — tracks user/session activity
- `SessionActivityMiddleware` — session lifecycle management

## 5. Dependencies

| Category | Package | Version |
|----------|---------|---------|
| ORM | Npgsql.EntityFrameworkCore.PostgreSQL | 10.0.0 |
| Aspire | Aspire.Npgsql.EntityFrameworkCore.PostgreSQL | 13.1.0 |
| Auth | Microsoft.AspNetCore.Authentication.JwtBearer | 10.0.2 |
| Validation | FluentValidation.AspNetCore | 11.3.1 |

## 6. Integration Points

| Integration | Type | Evidence |
|-------------|------|----------|
| PostgreSQL | Database | Aspire `AddPostgres("pgsql")` |
| pgAdmin | Dev tooling | `WithPgAdmin()` in AppHost |
| React Frontend | Vite dev server | `AddViteApp("frontend")` |
| Aspire Dashboard | Observability | Built-in at https://localhost:17360 |
| Health Checks | `/health` endpoint | `WithHttpHealthCheck("/health")` |
| GitHub Copilot SDK | AI | `CopilotTestService`, `CopilotTestController` |

### Aspire Orchestration (AppHost.cs)
```
PostgreSQL → bmadServer.ApiService → React Frontend (Vite)
           ↳ Health checks ↳ Service discovery ↳ pgAdmin
```

## 7. Testing Coverage

### Test Projects (4)
| Project | Type | Focus |
|---------|------|-------|
| `bmadServer.Tests` | Unit + Integration | ChatHub, Services |
| `bmadServer.ApiService.IntegrationTests` | Integration | Aspire end-to-end |
| `bmadServer.BDD.Tests` | BDD (SpecFlow) | Feature acceptance |
| `bmadServer.Playwright.Tests` | E2E | UI automation |

**Total Test Files: 115 `.cs` files**

### Notable Test Files
- `ChatHubIntegrationTests.cs`, `ChatHubPerformanceTests.cs`, `ChatHubStreamingTests.cs`
- `ChatHubAspireTests.cs` (Aspire integration)
- `GitHubActionsCICD.feature` (BDD)

**Testing Maturity: HIGH** — 4 test projects covering unit, integration, BDD, and E2E

## 8. Configuration & Infrastructure

### Aspire Deployment Topology
- PostgreSQL container with pgAdmin
- API service with health checks
- Vite dev server for React frontend
- Test mode flag disables frontend/pgAdmin

### CI/CD
- GitHub Actions workflow present
- BDD feature file covers CI/CD validation

## 9. Security Considerations

- JWT Bearer authentication with refresh tokens
- RBAC via `RolesController` and `RoleService`
- Password hashing (`PasswordHasher` service)
- FluentValidation on all request DTOs
- Session activity tracking middleware

## 10. Technical Debt Signals

1. **No MediatR/CQRS** — Controllers directly call services; may become unwieldy at scale
2. **No repository pattern** — Services directly use DbContext (tight coupling)
3. **Copilot SDK integration** — `CopilotTestController` suggests experimental integration
4. **Rate limiting installed but needs production tuning** — `AspNetCoreRateLimit 5.0.0` configured with `IpRateLimitOptions` in Program.cs (lines 204-207, 341)
5. **23 DbSets in single context** — may benefit from bounded context separation

## 11. Confidence Score

| Dimension | Score | Notes |
|-----------|-------|-------|
| Completeness | 95% | All controllers, services, and test files inspected |
| Accuracy | 90% | Evidence from csproj, AppHost.cs, controllers |
| Currency | 85% | Epics 1-9 complete per memory |
| **Overall** | **90%** | |
