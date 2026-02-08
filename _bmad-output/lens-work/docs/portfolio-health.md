---
generated_at: "2026-02-07T00:00:00Z"
layer: portfolio
generator: scout-auto-pipeline
scope: health-dashboard
---

# Portfolio Health Dashboard

## 1. Per-Repo Health Scores

| Repo | Domain | Health | Architecture | Testing | CI/CD | Security | Debt Load | Activity |
|------|--------|--------|-------------|---------|-------|----------|-----------|----------|
| **bmadServer** | BMAD/CHAT | 🟢 GREEN | ✅ Clean, well-structured | ✅ 87 test files + 9 BDD features | ✅ GitHub Actions | ✅ JWT + BCrypt | ≡️ Medium | ≡️ 9 days ago |
| **BMAD.Lens** | BMAD/LENS | 🟢 GREEN | ✅ Well-organized modules | ⚠️ Spec-based only | 🔴 None | ✅ N/A (no auth) | ⚠️ Low | ✅ Today |
| **NorthStarET** | NextGen | 🟡 AMBER | ✅ Clean Arch (Migration) | ⚠️ Partial | ✅ GitHub Actions | ⚠️ Mixed (JWT+Entra) | 🔴 High | 🔴 STALLED 20d |
| **bmad-chat** | BMAD/CHAT | 🔴 RED | ⚠️ Spark-locked SPA | 🔴 Zero tests | 🔴 None | 🔴 Plaintext passwords | 🔴 Critical | ⚠️ 1 day ago |
| **NorthStarET.Student** | NextGen | ⬜ GRAY | N/A (no code) | N/A | N/A | N/A | N/A | 🔴 Dormant |
| **OldNorthStar** | OldNorthStar | ⬜ GRAY | N/A (archive) | 🔴 Zero tests | 🔴 None | ⚠️ Legacy auth | 🔴 EOL stack | N/A (archive) |

### Score Criteria

| Color | Meaning | Action Required |
|-------|---------|----------------|
| 🟢 GREEN | Healthy — meets standards, actively maintained | Continue normal development |
| 🟡 AMBER | Caution — addressable issues, needs attention | Plan remediation within 1-2 sprints |
| 🔴 RED | Critical — blocking issues, security risks | Immediate action required |
| ⬜ GRAY | Not applicable — archive or not yet started | Decision needed on repo status |

## 2. Risk Matrix

### Probability vs. Impact Assessment

```
                        IMPACT
                 Low        Medium       High        Critical
            ┌──────────┬──────────┬──────────┬──────────┐
   High     │          │ #11 YAML │ #6 AI    │ #1 Chat  │
            │          │ CI/CD    │ quality  │ disconn. │
            │          │          │          │ #2 Ptxt  │
Probability ├──────────┼──────────┼──────────┼──────────┤
   Medium   │ #15 typo │ #10 bwr  │ #3 stall │ #4 0test │
            │          │ #14 dorm │ #5 dup   │          │
            │          │          │ auth     │          │
            ├──────────┼──────────┼──────────┼──────────┤
   Low      │ #7 JSONB │ #13 mem  │ #8 auto  │          │
            │ schema   │ cache   │ migrate  │          │
            │          │ #12 no  │ #9 EF6   │          │
            │          │ CI chat │          │          │
            └──────────┴──────────┴──────────┴──────────┘
```

### Risk Register

| ID | Risk | Probability | Impact | Score | Repo(s) | Owner |
|----|------|-------------|--------|-------|---------|-------|
| #1 | bmad-chat ↔ bmadServer disconnection | High | Critical | 🔴 16 | bmad-chat, bmadServer | Architecture |
| #2 | Plaintext password storage | High | Critical | 🔴 16 | bmad-chat | Security |
| #3 | NorthStarET stalled 20+ days | Medium | High | 🔴 12 | NorthStarET | Management |
| #4 | Zero test coverage on bmad-chat | Medium | Critical | 🔴 12 | bmad-chat | QA |
| #5 | Duplicated JWT auth across repos | Medium | Medium | ⚠️ 9 | bmadServer, NorthStarET | Architecture |
| #6 | AI-generated code quality unknown | High | High | ⚠️ 12 | bmadServer, NorthStarET | QA |
| #7 | JSONB columns without schema validation | Low | Low | 🟢 4 | bmadServer | Development |
| #8 | Auto-migration on startup | Low | High | ⚠️ 6 | bmadServer | DevOps |
| #9 | EF6 legacy burden | Low | High | ⚠️ 6 | NorthStarET Upgrade | Architecture |
| #10 | bower_components in modernized repos | Medium | Medium | ⚠️ 6 | NorthStarET | Development |
| #11 | No CI for BMAD.Lens | High | Medium | ⚠️ 8 | BMAD.Lens | DevOps |
| #12 | No CI for bmad-chat | Medium | Low | 🟡 4 | bmad-chat | DevOps |
| #13 | DistributedMemoryCache in production | Medium | Low | 🟡 4 | bmadServer | DevOps |
| #14 | NorthStarET.Student dormant | Medium | Medium | ⚠️ 6 | NorthStarET.Student | Management |
| #15 | Controller typo (InterventonToolkit) | Medium | Low | 🟢 2 | NorthStarET | Development |

## 3. Technical Debt Backlog (Prioritized)

### Priority 1 — Security Critical (Do Now)

| # | Debt Item | Repo | Effort | Impact |
|---|-----------|------|--------|--------|
| D1 | Replace plaintext password storage with server-side auth | bmad-chat | Medium | Eliminates critical security vulnerability |
| D2 | Design and implement bmad-chat → bmadServer integration layer | bmad-chat + bmadServer | Large | Unifies CHAT service domain |

### Priority 2 — Quality Critical (This Sprint)

| # | Debt Item | Repo | Effort | Impact |
|---|-----------|------|--------|--------|
| D3 | Add Vitest unit tests for bmad-chat services + hooks | bmad-chat | Medium | Quality gate for 10K+ LOC |
| D4 | Add Playwright E2E tests for critical bmad-chat flows | bmad-chat | Medium | Regression protection |
| D5 | Audit 10-15 copilot-swe-agent PRs across repos | bmadServer, NorthStarET | Small | Validate AI code quality |
| D6 | Add GitHub Actions CI pipeline for bmad-chat | bmad-chat | Small | Automated build/lint/test |

### Priority 3 — Architecture (Next Sprint)

| # | Debt Item | Repo | Effort | Impact |
|---|-----------|------|--------|--------|
| D7 | Triage NorthStarET dual-track — choose focal track | NorthStarET | Decision | Unblocks development |
| D8 | Replace auto-migration with explicit migration step | bmadServer | Small | Production safety |
| D9 | Replace DistributedMemoryCache with Redis | bmadServer | Medium | Production scalability |
| D10 | Extract shared JWT auth package | bmadServer, NorthStarET | Medium | Eliminates duplication |
| D11 | Add YAML lint + schema validation CI for BMAD.Lens | BMAD.Lens | Small | Framework reliability |

### Priority 4 — Cleanup (Backlog)

| # | Debt Item | Repo | Effort | Impact |
|---|-----------|------|--------|--------|
| D12 | Plan EF6 → EF Core migration for Upgrade track | NorthStarET | Large | Modernization |
| D13 | Remove bower_components from Upgrade + AIUpgrade | NorthStarET | Small | Dead dependency cleanup |
| D14 | Fix InterventonToolkitController typo | NorthStarET | Trivial | Code hygiene |
| D15 | Decide on NorthStarET.Student repo status | NorthStarET.Student | Decision | Resource clarity |
| D16 | Add JSON schema validation for JSONB columns | bmadServer | Medium | Data integrity |
| D17 | Split App.tsx (662 lines) into smaller components | bmad-chat | Small | Maintainability |

### Debt Metrics

| Metric | Value |
|--------|-------|
| **Total debt items** | 17 |
| **Security critical** | 2 |
| **Quality critical** | 4 |
| **Architecture** | 5 |
| **Cleanup** | 6 |
| **Estimated total effort** | ~8-12 sprints |

## 4. Recommended Actions Per Repo

### bmadServer — 🟢 GREEN

| Priority | Action | Effort |
|----------|--------|--------|
| 1 | Define API contract for bmad-chat integration | Medium |
| 2 | Replace auto-migration with init container | Small |
| 3 | Replace DistributedMemoryCache with Redis | Medium |
| 4 | Audit copilot-swe-agent commits | Small |
| 5 | Add health check dashboard | Small |

### BMAD.Lens — 🟢 GREEN

| Priority | Action | Effort |
|----------|--------|--------|
| 1 | Add CI pipeline (YAML lint + schema validation) | Small |
| 2 | Add automated tests for installer.js | Small |
| 3 | Continue dogfooding feedback loop | Ongoing |

### NorthStarET — 🟡 AMBER

| Priority | Action | Effort |
|----------|--------|--------|
| 1 | **DECISION:** Choose Migration vs. Upgrade as focal track | Decision |
| 2 | Create restart backlog after 20-day stall | Medium |
| 3 | Audit AI-generated code (48% of commits) | Medium |
| 4 | Add test projects for Migration services without tests | Medium |
| 5 | Plan EF6 → EF Core migration (if Upgrade track chosen) | Large |

### bmad-chat — 🔴 RED

| Priority | Action | Effort |
|----------|--------|--------|
| 1 | **IMMEDIATE:** Replace plaintext passwords | Small |
| 2 | Design bmadServer integration architecture | Large |
| 3 | Add Vitest test suite | Medium |
| 4 | Add GitHub Actions CI | Small |
| 5 | Add Playwright E2E tests | Medium |

### NorthStarET.Student — ⬜ GRAY

| Priority | Action | Effort |
|----------|--------|--------|
| 1 | **DECISION:** Keep, merge into NorthStarET, or archive | Decision |
| 2 | If keeping: update BMAD modules + define tech stack | Medium |

### OldNorthStar — ⬜ GRAY

| Priority | Action | Effort |
|----------|--------|--------|
| — | No actions needed — archive reference only | — |

## 5. Bus Factor Analysis

| Repo | Primary Contributor | AI Contributor | Bus Factor | Risk |
|------|-------------------|---------------|------------|------|
| **bmadServer** | Cris Weber (60%) | copilot-swe-agent (38%) | 1 | ⚠️ HIGH |
| **bmad-chat** | GitHub Spark (generated) | — | 1 | ⚠️ HIGH |
| **NorthStarET** | Cris Weber (46%) | copilot-swe-agent (48%) | 1 | 🔴 CRITICAL |
| **BMAD.Lens** | Cris Weber (primary) | — | 1 | ⚠️ HIGH |
| **NorthStarET.Student** | Cris Weber | — | 1 | LOW (no code) |
| **OldNorthStar** | Unknown (archive) | — | 0 | N/A |

**Portfolio Bus Factor: 1** — All strategic decisions, architecture, and feature direction depend on a single contributor (Cris Weber). AI agents (copilot-swe-agent, Claude) contribute code but not direction.

### Mitigation Recommendations

1. **Documentation:** This canonical documentation set serves as knowledge transfer baseline
2. **BMAD Lifecycle:** Structured phases create reproducible decision records
3. **AI Code Audit:** Validate that AI-generated code is understandable and maintainable by others
4. **Constitution System:** BMAD.Lens constitutions codify project rules independently of personnel

## 6. CI/CD Coverage Gaps

| Repo | Build | Lint | Unit Test | Integration Test | E2E | Deploy | Score |
|------|-------|------|-----------|-----------------|-----|--------|-------|
| **bmadServer** | ✅ | ⚠️ | ✅ | ✅ | ✅ | ⚠️ | 4/6 |
| **NorthStarET** | ✅ | ⚠️ | ✅ | ⚠️ | ✅ | ⚠️ | 3/6 |
| **BMAD.Lens** | 🔴 | 🔴 | 🔴 | 🔴 | 🔴 | ✅* | 1/6 |
| **bmad-chat** | 🔴 | 🔴 | 🔴 | 🔴 | 🔴 | ⚠️ | 0/6 |
| **NorthStarET.Student** | 🔴 | 🔴 | 🔴 | 🔴 | 🔴 | 🔴 | 0/6 |
| **OldNorthStar** | 🔴 | 🔴 | 🔴 | 🔴 | 🔴 | 🔴 | 0/6 |

*BMAD.Lens "deploy" = install script to control repo

**Portfolio CI/CD Coverage: 33%** (2 of 6 repos have meaningful CI pipelines)

### Priority CI/CD Actions

1. **bmad-chat:** Add build + lint + type-check pipeline (GitHub Actions)
2. **BMAD.Lens:** Add YAML lint + schema validation pipeline
3. **bmadServer:** Add deploy pipeline (Aspire deploy to staging)
4. **NorthStarET:** Verify existing pipelines still pass after 20-day stall

---

*Generated by Scout (GD workflow) — LENS Workbench*
