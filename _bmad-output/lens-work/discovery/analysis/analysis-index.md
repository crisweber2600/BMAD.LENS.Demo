# Portfolio Analysis Index — SCOUT AC Workflow
> Generated: 2026-02-07 | 6 Target Projects Analyzed

---

## Key Metrics Summary

| Repo | Endpoints | Entities | Controllers | Test Files | Source Files | Stack |
|------|-----------|----------|-------------|------------|--------------|-------|
| **bmadServer** | 63 | 23 | 11 | 115 | ~438 | .NET 10 + Aspire + PostgreSQL + React 19 |
| **bmad-chat** | 0 (SPA) | N/A (client types) | N/A | 0 | 91 | React 19 + Vite 7 + Tailwind 4 |
| **NorthStarET Upgrade** | 385 | 104 | 33 | ~sparse | 802 | .NET 10 + EF6 + SQL Server + React |
| **NorthStarET Migration** | 64 | 27 | 17 | ~sparse | ~382 | .NET 10 + Aspire + PostgreSQL + React |
| **OldNorthStar** | 384 | 104 | 33 | 0 | 729 | .NET 4.8 + EF6 + SQL Server + AngularJS |
| **NorthStarET.Student** | 0 | 0 | 0 | 0 | 0 | Planning phase only |
| **BMAD.Lens** | N/A (framework) | N/A | N/A | ~spec | 91 | YAML + Markdown + PowerShell |
| **TOTALS** | **896** | **258** | **94** | **115+** | **2,533+** | |

---

## Integration Points Discovered

### Cross-Repo Service Mesh

```
┌──────────────────────────────────────────────────────────────┐
│                    BMAD Control Repo                          │
│  ┌────────────┐                      ┌───────────────────┐   │
│  │ BMAD.Lens  │──install──────────→  │ _bmad/lens-work/  │   │
│  │ (source)   │                      │ (installed)       │   │
│  └────────────┘                      └───────────────────┘   │
└──────────────────────────────────────────────────────────────┘
         │                                      │
         │ dogfooding                           │ orchestrates
         │                                      ▼
┌────────────────────────────────────────────────────────────────┐
│                    CHAT Domain                                  │
│  ┌──────────────┐         ┌──────────────┐                     │
│  │  bmad-chat   │◄──API──►│  bmadServer  │                     │
│  │  (React 19)  │         │  (.NET 10)   │                     │
│  │  Port: 5173  │         │  Port: 8080  │                     │
│  └──────────────┘         └──────┬───────┘                     │
│                                  │ PostgreSQL                  │
│                                  ▼                             │
│                            ┌──────────┐                        │
│                            │  pgAdmin │                        │
│                            └──────────┘                        │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│               NorthStarET Domain (DUAL TRACK)                  │
│                                                                │
│  UPGRADE TRACK              MIGRATION TRACK                    │
│  ┌──────────────┐          ┌──────────────────────────┐        │
│  │  NS4.WebAPI  │          │  7 Microservices         │        │
│  │  (33 ctlrs)  │          │  ┌──────────────────┐    │        │
│  │  Port: 5000  │          │  │ Identity.API     │    │        │
│  └──────┬───────┘          │  │ StudentService   │    │        │
│         │                  │  │ AssessmentSvc    │    │        │
│    YARP Gateway             │  │ AssessmentMgmt   │    │        │
│    (port 8080)             │  │ InterventionSvc  │    │        │
│         │                  │  │ StaffMgmt        │    │        │
│  ┌──────┴───────┐          │  │ SectionService   │    │        │
│  │  React UI    │          │  └──────────────────┘    │        │
│  │  Port: 3000  │          │  Port: 8080 (YARP)     │        │
│  └──────────────┘          │  React UI Port: 3100    │        │
│         │                  └──────────────────────────┘        │
│    SQL Server                     PostgreSQL (4 DBs)           │
│    (EF6, 104 entities)            (27 entities)                │
└────────────────────────────────────────────────────────────────┘
         ▲
         │ source lineage
┌────────┴──────────────────────────────────────────────────────┐
│               OldNorthStar (LEGACY)                            │
│  .NET 4.8 + AngularJS + EF6 + SQL Server                     │
│  33 Controllers, 384 Endpoints, 104 Entities                  │
│  NO CI/CD, NO Tests                                           │
└───────────────────────────────────────────────────────────────┘
```

### Integration Type Matrix

| From → To | Type | Protocol | Status |
|-----------|------|----------|--------|
| bmad-chat → bmadServer | API Client | HTTP/REST + SignalR | Active |
| bmad-chat → GitHub API | Platform | REST (Octokit) | Active |
| bmadServer → PostgreSQL | Database | Npgsql | Active |
| NorthStarET Upgrade → SQL Server | Database | EF6 | Active |
| NorthStarET Upgrade → Azure Blob/Table | Storage | Azure SDK | Active |
| NorthStarET Upgrade → SendGrid | Email | REST API | Active |
| NorthStarET Upgrade → Vzaar | Video | REST API | Active |
| NorthStarET Migration → PostgreSQL | Database | Npgsql/EF Core | Active |
| NorthStarET Migration → Entra ID | Auth | OIDC | Active |
| OldNorthStar → SQL Server | Database | EF6 | Legacy |
| BMAD.Lens → Control Repo | Installer | PowerShell | Active |
| NorthStarET.Student → NorthStarET | Planned | N/A | Not started |

---

## Top 5 Architectural Risks (Portfolio-Wide)

### 1. CRITICAL: NorthStarET Dual-Track Strategy is Unsustainable
- **Impact:** 802+ C# files maintained across two parallel architectures
- **Evidence:** Upgrade (385 endpoints, EF6) and Migration (64 endpoints, Clean Arch) running simultaneously
- **Risk:** Only 17% of endpoints migrated; maintaining both tracks doubles bug surface and cognitive load
- **Mitigation:** Commit to a single track or establish formal deprecation timeline for Upgrade

### 2. HIGH: OldNorthStar AngularJS is End-of-Life
- **Impact:** Known security vulnerabilities in AngularJS 1.x (EOL Dec 2021)
- **Evidence:** `NS4.Angular/` + `NS4.Client/` with Bower-managed jQuery dependencies
- **Risk:** Active exploitation vectors if this codebase is still deployed
- **Mitigation:** If deployed, upgrade to NorthStarET Upgrade track immediately; retire OldNorthStar

### 3. HIGH: bmad-chat Has Zero Test Coverage
- **Impact:** 91 TypeScript files with no unit, integration, or E2E tests
- **Evidence:** `find -name "*.test.*" -o -name "*.spec.*"` returns 0 results
- **Risk:** Regression bugs go undetected; refactoring becomes dangerous
- **Mitigation:** Add Vitest unit tests and Playwright E2E tests; target 60% coverage minimum

### 4. MODERATE: NorthStarET Secret Management is Fragile
- **Impact:** 18+ secrets hardcoded as Aspire parameters in AppHost.cs
- **Evidence:** `VzaarToken`, `SendGridApiKey`, `PdfPassword`, `FtpPassword`, etc. as `AddParameter(secret: true)`
- **Risk:** Secrets could leak in logs, source control, or Aspire dashboard
- **Mitigation:** Migrate to Azure Key Vault with managed identity; remove `AddParameter` secrets

### 5. MODERATE: bmadServer Single DbContext Scaling Risk
- **Impact:** No CQRS for write-heavy operations, single DbContext with 23 entities
- **Evidence:** No MediatR, direct service-to-DbContext calls; rate limiting IS configured (AspNetCoreRateLimit 5.0.0)
- **Risk:** Write bottlenecks as collaboration scales; bounded context separation eventually needed

---

## Portfolio Health Summary

| Repo | Health | Activity | Testing | Security | Tech Debt |
|------|--------|----------|---------|----------|-----------|
| **bmadServer** | GOOD | Active | HIGH (4 test projects) | MODERATE | LOW |
| **bmad-chat** | AT RISK | Active | NONE | LOW | MODERATE |
| **NorthStarET** | AT RISK | Active | LOW | AT RISK | CRITICAL |
| **OldNorthStar** | CRITICAL | Legacy | NONE | CRITICAL | CRITICAL |
| **NorthStarET.Student** | N/A | Not started | N/A | N/A | N/A |
| **BMAD.Lens** | GOOD | Active | LOW | LOW | LOW |

---

## Detailed Reports

| Report | Path |
|--------|------|
| BMAD.Lens | `analysis-BMAD.Lens.md` |
| bmadServer | `analysis-bmadServer.md` |
| bmad-chat | `analysis-bmad-chat.md` |
| NorthStarET | `analysis-NorthStarET.md` |
| OldNorthStar | `analysis-OldNorthStar.md` |
| NorthStarET.Student | `analysis-NorthStarET.Student.md` |

---
*Analysis performed by SCOUT AC workflow | Evidence-based, file-inspected | No inference without citation*
