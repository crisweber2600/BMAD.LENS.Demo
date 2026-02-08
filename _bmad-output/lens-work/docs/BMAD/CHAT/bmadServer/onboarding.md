---
repo: bmadServer
remote: https://github.com/crisweber2600/bmadServer.git
default_branch: main
generated_at: 2026-02-07T12:00:00Z
domain: BMAD
service: CHAT
generator: lens-sync
---

# bmadServer — Onboarding Guide

## Prerequisites

| Requirement | Version | Purpose |
|---|---|---|
| .NET SDK | 10.0 | Runtime and build tooling |
| Docker Desktop | Latest | PostgreSQL container via Aspire |
| Node.js | 18+ | React frontend build |
| Git | 2.30+ | Version control |
| VS Code or Visual Studio | Latest | IDE |
| .NET Aspire workload | Latest | `dotnet workload install aspire` |

## Setup Steps

### 1. Clone the Repository

```bash
git clone https://github.com/crisweber2600/bmadServer.git
cd bmadServer
```

### 2. Install .NET Aspire Workload

```bash
dotnet workload install aspire
```

### 3. Install Frontend Dependencies

```bash
cd src/frontend
npm install
cd ../..
```

### 4. Start with Aspire AppHost

```bash
cd src/bmadServer.AppHost
dotnet run
```

This starts:
- **PostgreSQL** container (auto-created by Aspire)
- **pgAdmin** dev tooling
- **bmadServer.ApiService** on configured port
- **React frontend** via Vite dev server
- **Aspire Dashboard** at `https://localhost:17360`

### 5. Apply Database Migrations

```bash
cd src/bmadServer.ApiService
dotnet ef database update
```

### 6. Verify Health

Open browser to:
- **Aspire Dashboard:** `https://localhost:17360`
- **Swagger UI:** `https://localhost:{port}/swagger`
- **Health endpoint:** `https://localhost:{port}/health`

## Development Workflow

### Build

```bash
# Build entire solution
dotnet build

# Build API service only
dotnet build src/bmadServer.ApiService
```

### Run Tests

```bash
# All tests
dotnet test

# Unit tests only
dotnet test tests/bmadServer.Tests

# Integration tests
dotnet test tests/bmadServer.ApiService.IntegrationTests

# BDD tests
dotnet test tests/bmadServer.BDD.Tests

# E2E Playwright tests
cd tests/bmadServer.Playwright.Tests
dotnet test
```

### Add EF Core Migration

```bash
cd src/bmadServer.ApiService
dotnet ef migrations add <MigrationName>
dotnet ef database update
```

### Frontend Development

```bash
cd src/frontend
npm run dev    # Start Vite dev server
npm run build  # Production build
npm run lint   # ESLint
```

## Key Concepts

1. **Aspire AppHost** — Orchestrates all services; PostgreSQL, API, and frontend are managed as a single unit
2. **Controllers → Services → DbContext** — Standard layered pattern; business logic lives in Services
3. **FluentValidation** — All request DTOs validated before reaching service layer
4. **ChatHub (SignalR)** — Real-time WebSocket hub at `/hubs/chat` for messaging and presence
5. **Domain Events** — SignalR broadcasts events: `MessageReceived`, `PresenceEvent`, `StepChanged`, `ConflictDetected`
6. **Polly Circuit Breaker** — External calls (Copilot SDK) wrapped in resilience policies
7. **Background Jobs** — `ConflictEscalationJob` and `SessionCleanupService` run on timers

## Debugging Tips

- **Aspire Dashboard** (`https://localhost:17360`) shows all service logs, traces, and metrics in one place
- **pgAdmin** is available for direct database inspection when running via Aspire
- **Swagger UI** at `/swagger` for interactive API testing
- **SignalR debugging:** Use browser F12 → Network → WS tab to inspect WebSocket frames
- **EF Core logging:** Aspire captures SQL queries in structured logs
- **Circuit breaker tripped?** Check `AgentCallPolicy` state; may need to wait for reset timeout

## Common Issues

| Issue | Cause | Fix |
|---|---|---|
| `Docker is not running` | Docker Desktop not started | Start Docker Desktop |
| PostgreSQL connection refused | Container not ready | Wait for Aspire to report healthy |
| Migration fails | Pending migrations | Run `dotnet ef database update` |
| Copilot SDK timeout | GitHub Copilot service down or SDK pre-release | Check circuit breaker; SDK is v0.1.19 |
| Frontend not loading | Node modules missing | Run `npm install` in `src/frontend/` |
| 401 Unauthorized | JWT expired | Call `/api/auth/refresh` with refresh token |
| SignalR disconnect | Connection lost | Client should auto-reconnect; check CORS settings |
| Aspire dashboard blank | Workload not installed | Run `dotnet workload install aspire` |

## Test Project Overview

| Project | Type | Framework | Focus |
|---|---|---|---|
| `bmadServer.Tests` | Unit + Integration | xUnit | Services, ChatHub |
| `bmadServer.ApiService.IntegrationTests` | Integration | xUnit + Aspire | End-to-end API |
| `bmadServer.BDD.Tests` | BDD | SpecFlow | Feature acceptance |
| `bmadServer.Playwright.Tests` | E2E | Playwright | UI automation |

**Total test files:** 115 `.cs` files across 4 projects.
