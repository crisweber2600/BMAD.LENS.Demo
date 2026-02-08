---
repo: OldNorthStar
remote: https://github.com/crisweber2600/OldNorthStar.git
default_branch: master
generated_at: 2026-02-07T12:00:00Z
domain: OldNorthStar
service: default
generator: lens-sync
---

# OldNorthStar — Onboarding Guide

> **⚠️ LEGACY ARCHIVE** — This codebase is a .NET Framework 4.8 monolith archived for reference. Active development occurs in NorthStarET. Use this guide only for reference analysis or debugging legacy issues.

## Prerequisites

| Requirement | Version | Purpose |
|---|---|---|
| Visual Studio | 2019+ | IDE (required — .NET Framework projects) |
| .NET Framework | 4.8 Developer Pack | Runtime |
| SQL Server | 2016+ or Azure SQL | Database |
| IIS Express | — | Local web server (bundled with VS) |
| Node.js | — | AngularJS build (if modifying frontend) |
| Bower | — | Package manager (deprecated) |

**Note:** VS Code is NOT recommended — .NET Framework projects require full Visual Studio.

## Setup Steps

### 1. Clone the Repository

```bash
git clone https://github.com/crisweber2600/OldNorthStar.git
cd OldNorthStar
```

### 2. Open Solution in Visual Studio

Open `NorthStar4_Framework46.sln` in Visual Studio 2019 or later.

### 3. Restore NuGet Packages

Visual Studio will automatically restore NuGet packages on build. If not:
```
Tools > NuGet Package Manager > Restore NuGet Packages
```

### 4. Configure Connection Strings

Edit `NS4.WebAPI/Web.config`:
```xml
<connectionStrings>
  <add name="DistrictConnection" connectionString="..." />
  <add name="LoginConnection" connectionString="..." />
</connectionStrings>
```

You need access to the SQL Server database(s) containing the district and login schemas.

### 5. Build and Run

- Set `NS4.WebAPI` as the startup project
- Press F5 to launch with IIS Express
- The AngularJS frontend will be served from the same IIS instance

## Development Workflow

### Build

```
Build > Build Solution (Ctrl+Shift+B)
```

Or from command line:
```bash
msbuild NorthStar4_Framework46.sln /p:Configuration=Release
```

### Test

**No test projects exist** in this solution. Testing was likely manual or performed externally.

### Frontend (AngularJS)

The AngularJS frontend lives in `NS4.Angular/` and uses Bower for package management:

```bash
# Install Bower globally (if not already)
npm install -g bower

# Install frontend dependencies
cd NS4.Angular
bower install
```

**Warning:** Bower is deprecated. Do NOT add new dependencies via Bower.

## Key Concepts

1. **N-Tier Architecture** — WebAPI controllers → Core logic → EF6 → SQL Server
2. **Dual DbContexts** — `DistrictContext` (60 entities) for educational data; `LoginContext` (44 entities) for auth
3. **NSBaseController** — All controllers inherit from `Infrastructure/NSBaseController.cs`
4. **DTO Pattern** — DTOs in `EntityDto/DTO/Admin/` organized by domain (Student, Section, etc.)
5. **Custom DataTable** — Bespoke `DataAccess/DataTable.cs` library for tabular report data
6. **Batch Processing** — Three separate batch projects: `BatchProcessor`, `BatchPrint`, `AutomatedRollover`
7. **Multi-tenancy** — District-based data isolation via `DistrictContext`

## Debugging Tips

- **SQL Profiler** — Use SQL Server Profiler to trace EF6 queries
- **Fiddler/Postman** — Inspect WebAPI 2 REST calls
- **IIS Express logs** — Check Output pane in VS for request logs
- **Web.config transforms** — Different configs for Debug/Release
- **Global.asax** — Application startup and route registration

## Common Issues

| Issue | Cause | Fix |
|---|---|---|
| NuGet restore fails | Package sources not configured | Add `nuget.org` as package source |
| Database connection error | Wrong connection string | Update `Web.config` with valid SQL Server |
| Bower not found | Bower not installed globally | `npm install -g bower` |
| Build errors in `.csproj` | TFS SCC metadata | Remove `<SccProjectName>` elements from `.csproj` |
| AngularJS not loading | Bower deps missing | Run `bower install` in `NS4.Angular/` |
| IIS Express port conflict | Port already in use | Change port in project debug settings |

## Relationship to NorthStarET

This codebase is the **source system** being modernized:
- **NorthStarET Upgrade** — Direct .NET 10 port of this codebase (33→33 controllers, 104→104 entities)
- **NorthStarET Migration** — Domain decomposition into 7 microservices (17% of endpoints migrated)
- Reference copy embedded at `NorthStarET/.referenceSrc/OldNorthStar/` for comparison
