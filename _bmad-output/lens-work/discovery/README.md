# SCOUT Discovery Index — NorthStarET.BMAD Control Repo

> **Scanner:** SCOUT DS (Deep Brownfield Discovery)
> **Scan Date:** 2026-02-07
> **Control Repo:** NorthStarET.BMAD (branch: init)
> **Total Repos Scanned:** 6

---

## Portfolio Summary

| # | Repo | Domain | Service | Branch | Commits | Contributors | LOC | Activity | Confidence |
|---|---|---|---|---|---|---|---|---|---|
| 1 | [BMAD.Lens](discovery-BMAD.Lens.md) | BMAD | LENS | main | 34 | 1 | ~4.6K (YAML/MD) | 🟢 VERY ACTIVE | 0.92 |
| 2 | [bmad-chat](discovery-bmad-chat.md) | BMAD | CHAT | main | 16 | 1 | ~11.3K (TS/TSX) | 🟡 NASCENT | 0.88 |
| 3 | [bmadServer](discovery-bmadServer.md) | BMAD | CHAT | main | 188 | 5 | ~72K (C#+TS) | 🟡 PAUSED | 0.93 |
| 4 | [NorthStarET](discovery-NorthStarET.md) | NextGen | NorthStarET | main | 1,786 | 8 | ~68K (C#+TS) | 🟢 VERY ACTIVE | 0.95 |
| 5 | [NorthStarET.Student](discovery-NorthStarET.Student.md) | NextGen | NorthStarET | main | 6 | 2 | ~0 (docs only) | 🔴 DORMANT | 0.85 |
| 6 | [OldNorthStar](discovery-OldNorthStar.md) | OldNorthStar | default | master | 1 | 1 | ~179K (C#+JS) | ⚫ ARCHIVE | 0.94 |

**Total across portfolio:** ~2,031 commits, ~335K LOC, 8 unique contributors

---

## Domain Map

### BMAD Domain (Framework & Tooling)
```
BMAD/
├── LENS/
│   └── BMAD.Lens          # Framework source (agents, workflows, modules)
└── CHAT/
    ├── bmad-chat           # React collaboration UI (frontend)
    └── bmadServer          # .NET Aspire API (backend)
```

### NextGen Domain (LMS Modernization)
```
NextGen/
└── NorthStarET/
    ├── NorthStarET         # Main modernization (dual-track: Upgrade + Migration)
    └── NorthStarET.Student # Student portal (pre-development)
```

### OldNorthStar Domain (Legacy)
```
OldNorthStar/
└── OldNorthStar            # Legacy .NET 4.8 production system (archived)
```

---

## Technology Stack Matrix

| Technology | BMAD.Lens | bmad-chat | bmadServer | NorthStarET | NorthStarET.Student | OldNorthStar |
|---|---|---|---|---|---|---|
| .NET 10 | — | — | ✅ | ✅ | — | — |
| .NET Framework 4.8 | — | — | — | — | — | ✅ |
| React 18/19 | — | ✅ | ✅ | ✅ | — | — |
| AngularJS 1.x | — | — | — | — | — | ✅ |
| TypeScript | — | ✅ | ✅ | ✅ | — | — |
| Aspire | — | — | ✅ (13.1) | ✅ | — | — |
| PostgreSQL | — | — | ✅ | ✅ (mig) | — | — |
| SQL Server | — | — | — | ✅ (upg) | — | ✅ |
| EF Core | — | — | ✅ (10.0) | — | — | — |
| EF 6 | — | — | — | ✅ (upg) | — | ✅ |
| SignalR | — | — | ✅ | — | — | — |
| YARP | — | — | — | ✅ | — | — |
| GitHub Copilot SDK | — | — | ✅ (0.1.19) | — | — | — |
| GitHub Spark | — | ✅ | — | — | — | — |
| Vite | — | ✅ | — | ✅ | — | — |
| JWT Auth | — | — | ✅ | ✅ | — | — |
| Azure Services | — | — | — | ✅ | — | ✅ |
| Node.js | ✅ (installer) | ✅ | — | — | — | — |
| BMAD Framework | ✅ (source) | — | — | — | ✅ (installed) | — |

---

## AI Agent Contribution Analysis

| Repo | Human % | AI Agent % | AI Agent Types |
|---|---|---|---|
| BMAD.Lens | 100% | 0% | — |
| bmad-chat | 100% (via Spark) | 0% | GitHub Spark generation |
| bmadServer | 62% | 38% | copilot-swe-agent, Claude, Copilot |
| NorthStarET | 56% | 44% | copilot-swe-agent, Copilot |
| NorthStarET.Student | 100% | 0% | — |
| OldNorthStar | 100% | 0% | — |

**Key insight:** The two most complex repos (NorthStarET, bmadServer) have 38-44% AI-generated commits. This represents a significant AI-assisted development pattern.

---

## Risk Heat Map

| Risk Area | BMAD.Lens | bmad-chat | bmadServer | NorthStarET | NorthStarET.Student | OldNorthStar |
|---|---|---|---|---|---|---|
| No CI/CD | 🟡 | 🔴 | 🟡 | 🟢 | — | — |
| No Tests | 🟡 | 🔴 | 🟢 | 🟡 | — | 🔴 |
| Legacy Framework | — | — | — | 🔴 (EF6) | — | 🔴 |
| Single Contributor | 🔴 | 🔴 | 🟡 | 🟢 | 🟡 | — |
| AI Code Quality | — | 🟡 | 🟡 | 🔴 | — | — |
| Technical Debt | 🟢 | 🟡 | 🟡 | 🔴 | — | 🔴 |
| Pre-release Deps | — | 🟡 (Spark) | 🔴 (Copilot SDK) | — | — | — |
| Stale/Dormant | — | — | 🟡 | — | 🔴 | ⚫ |

Legend: 🟢 Low risk | 🟡 Medium risk | 🔴 High risk | ⚫ N/A (archive)

---

## Cross-Repo Integration Map

```
                    ┌─────────────────┐
                    │   OldNorthStar   │ ← Legacy source system (.NET 4.8)
                    │   56K C# + 123K JS│
                    └────────┬────────┘
                             │ modernizes
                    ┌────────▼────────┐
                    │   NorthStarET    │ ← Dual-track modernization
                    │  25K C# + 43K TS │   (Upgrade: .NET 10 monolith)
                    │  1,786 commits   │   (Migration: Clean Arch µservices)
                    └────────┬────────┘
                             │ planned
                    ┌────────▼────────┐
                    │NorthStarET.Student│ ← Student portal (pre-dev)
                    │   (docs only)    │
                    └─────────────────┘

                    ┌─────────────────┐
                    │    BMAD.Lens     │ ← Framework source
                    │ agents/workflows │
                    └────────┬────────┘
                             │ installs to
                    ┌────────▼────────┐
                    │ NorthStarET.BMAD │ ← THIS control repo
                    │ (orchestrator)   │
                    └────────┬────────┘
                             │ manages all repos ↕
                    ┌────────┴────────┐
                    │                  │
              ┌─────▼─────┐    ┌──────▼─────┐
              │ bmad-chat  │◄──►│ bmadServer  │
              │ React UI   │    │ .NET API    │
              │ 11K TS     │    │ 54K C#+18K TS│
              └────────────┘    └─────────────┘
                    CHAT domain (frontend ←→ backend)
```

---

## Recommendations

### Immediate Actions
1. **NorthStarET.Student** — Decide: develop here or fold into NorthStarET? Current state is wasteful.
2. **bmad-chat** — Add CI/CD pipeline and basic tests before further development.
3. **bmadServer** — Resume development; Copilot SDK version pin needs monitoring.

### Short-term (1-2 weeks)
4. **NorthStarET** — Resolve dual-track strategy: pick Upgrade OR Migration as primary.
5. **NorthStarET** — EF6 → EF Core migration plan for the Upgrade track.
6. **BMAD.Lens** — Add CI validation for installer and prompt sync.

### Medium-term (1-2 months)
7. **Portfolio-wide** — Establish consistent CI/CD across all repos.
8. **AI code audit** — Systematic review of copilot-swe-agent contributions in NorthStarET and bmadServer.
9. **OldNorthStar** — Archive formally; extract any remaining reference data needed.

---

## Files in This Discovery Set

| File | Repo | Size |
|---|---|---|
| [discovery-BMAD.Lens.md](discovery-BMAD.Lens.md) | BMAD.Lens | Full report |
| [discovery-bmad-chat.md](discovery-bmad-chat.md) | bmad-chat | Full report |
| [discovery-bmadServer.md](discovery-bmadServer.md) | bmadServer | Full report |
| [discovery-NorthStarET.md](discovery-NorthStarET.md) | NorthStarET | Full report |
| [discovery-NorthStarET.Student.md](discovery-NorthStarET.Student.md) | NorthStarET.Student | Full report |
| [discovery-OldNorthStar.md](discovery-OldNorthStar.md) | OldNorthStar | Full report |
