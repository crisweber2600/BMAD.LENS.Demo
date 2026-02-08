---
repo: NorthStarET
remote: https://github.com/crisweber2600/NorthStarET.git
default_branch: main
generated_at: 2026-02-07T12:00:00Z
domain: NextGen
service: NorthStarET
generator: lens-sync
---

# NorthStarET — Onboarding Guide

## Prerequisites

| Requirement | Version | Purpose |
|---|---|---|
| .NET SDK | 10.0 | Runtime and build tooling |
| Docker Desktop | Latest | PostgreSQL + SQL Server containers |
| Node.js | 18+ | React frontend build |
| npm | 9+ | Frontend package management |
| Git | 2.30+ | Version control |
| VS Code or Visual Studio | Latest | IDE |
| .NET Aspire workload | Latest | `dotnet workload install aspire` |
| SQL Server (or Docker) | — | Upgrade track database |

## Setup Steps

### 1. Clone the Repository

```bash
git clone https://github.com/crisweber2600/NorthStarET.git
cd NorthStarET
```

### 2. Install .NET Aspire

```bash
dotnet workload install aspire
```

### 3. Choose a Track

#### Option A: Upgrade Track (Monolith)

```bash
# Install frontend dependencies
cd Src/Upgrade/UI/NS4.React/NS4.React
npm install
cd ../../../../..

# Configure secrets (AppHost requires 18+ parameters)
cd Src/Upgrade/Backend/NorthStarET.AppHost
dotnet user-secrets init
dotnet user-secrets set "Parameters:LoginConnection" "<your-sql-connection-string>"
# ... set all required secrets (see Integration Map for full list)

# Run via Aspire
dotnet run
```

This starts:
- **YARP Gateway** at port 8080
- **NS4.WebAPI** at port 5000
- **React UI** at port 3000
- Requires external SQL Server connection

#### Option B: Migration Track (Microservices)

```bash
# Install frontend dependencies
cd Src/Migration/UI/web
npm install
cd ../../../..

# Run via Aspire (PostgreSQL auto-created via Docker)
cd Src/Migration/Backend/AppHost
dotnet run
```

This starts:
- **YARP Gateway** at port 8080
- **7 microservices** (Identity, Student, Assessment, etc.)
- **PostgreSQL** container (auto-provisioned)
- **React UI** at port 3100
- **MockServer** for development stubs

### 4. Apply Database Migrations (Migration Track)

Each service has its own migrations:

```bash
# Example: StudentService
cd Src/Migration/Backend/StudentService/StudentService.Infrastructure
dotnet ef database update
```

### 5. Verify

- **Aspire Dashboard:** `https://localhost:17360`
- **Upgrade Gateway:** `http://localhost:8080`
- **Migration Gateway:** `http://localhost:8080` (separate Aspire instance)

## Development Workflow

### Build

```bash
# Build entire solution
dotnet build

# Build specific track
dotnet build Src/Upgrade/Backend/NorthStarET.AppHost
dotnet build Src/Migration/Backend/AppHost
```

### Test

```bash
# API tests (Upgrade)
dotnet test Src/Upgrade/Backend/NS4.WebAPI.Tests

# Parity tests (visual comparison)
dotnet test Src/Upgrade/Backend/NS4.Parity.Tests

# Frontend tests
cd Src/Upgrade/UI/NS4.React/NS4.React
npx vitest        # Unit tests
npx playwright test  # E2E tests
```

### Frontend Development

```bash
# Upgrade React UI
cd Src/Upgrade/UI/NS4.React/NS4.React
npm run dev

# Migration React UI
cd Src/Migration/UI/web
npm run dev
```

## Key Concepts

1. **Dual-Track Strategy** — Upgrade (monolith on .NET 10) and Migration (microservices) run in parallel
2. **YARP Gateway** — Both tracks use YARP as a reverse proxy at port 8080
3. **Aspire AppHost** — Each track has its own AppHost that orchestrates all services
4. **EF6 on .NET 10** — Upgrade track uses Entity Framework 6 in compatibility mode (NOT EF Core)
5. **Clean Architecture** — Migration track services follow Domain → Application → Infrastructure layers
6. **Visual Parity** — React frontend tested against production Angular screenshots for feature parity
7. **Per-Service Databases** — Migration track uses separate PostgreSQL databases per service
8. **18+ Secrets** — Upgrade track requires many external service credentials via `dotnet user-secrets`

## Debugging Tips

- **Aspire Dashboard** — Central log/trace viewer for all services
- **YARP routing issues** — Check `AppHost.cs` YARP route configuration
- **EF6 errors** — Entity Framework 6 has limited .NET 10 support; check compatibility docs
- **Service not starting** — Check Docker Desktop is running (PostgreSQL container)
- **Visual parity failures** — Compare against screenshots in `NS4.Parity.Tests/`
- **API 404s** — Verify the YARP catch-all route pattern matches your request

## Common Issues

| Issue | Cause | Fix |
|---|---|---|
| Docker not running | Docker Desktop not started | Start Docker Desktop |
| SQL connection refused | No SQL Server available | Use Docker SQL Server or Azure SQL |
| Secret not found | User secrets not configured | Run `dotnet user-secrets set` for each param |
| EF6 compatibility error | .NET 10 vs EF6 mismatch | Ensure EF6 compat NuGet package installed |
| Port conflict 8080 | Both tracks using same port | Run only one track at a time |
| React build fails | Node modules missing | Run `npm install` in UI directory |
| Too many services | Migration track starts 7+ services | Use Docker with sufficient memory (8GB+) |
| MockServer data stale | Static mock responses | Update mock data in `NorthStar.MockServer/` |

## Project Layout Quick Reference

| What | Where |
|---|---|
| Upgrade API controllers | `Src/Upgrade/Backend/NS4.WebAPI/Controllers/` |
| Upgrade EF6 entities | `Src/Upgrade/Backend/NorthStar.EF6/` |
| Upgrade React UI | `Src/Upgrade/UI/NS4.React/NS4.React/src/` |
| Upgrade AppHost | `Src/Upgrade/Backend/NorthStarET.AppHost/AppHost.cs` |
| Migration services | `Src/Migration/Backend/{ServiceName}/` |
| Migration AppHost | `Src/Migration/Backend/AppHost/Program.cs` |
| Migration React UI | `Src/Migration/UI/web/` |
| Original source | `.referenceSrc/OldNorthStar/` |
| Planning docs | `Plan/`, `PrePlan/`, `specs/` |
