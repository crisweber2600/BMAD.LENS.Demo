---
repo: NorthStarET.Student
remote: https://github.com/crisweber2600/NorthStarET.Student.git
default_branch: main
source_commit: f4e15611509735f1966a410209422f344b0beeea
generated_at: "2026-02-07T00:00:00Z"
layer: repo
domain: NextGen
service: NorthStarET
generator: scout-auto-pipeline
---

# NorthStarET.Student — Canonical Documentation

## 1. Overview

NorthStarET.Student is a **planning-only repository** — it has been bootstrapped with the BMAD framework but contains no application code. Its intended purpose is to serve as a student-specific module or service within the NorthStarET domain, but development has not begun.

**Key facts:**
- 6 commits, 715 files (all BMAD framework boilerplate)
- BMAD modules installed: bmm, bmb, bmgd, cis, core
- Zero application code
- No development activity since Jan 31, 2026
- **Risk: May become orphaned if not explicitly prioritized**

**Role in domain:** NorthStarET.Student is a planned **sibling project** to NorthStarET, intended to handle student-specific functionality. Its relationship to NorthStarET's existing Student service (in both Upgrade and Migration tracks) is undefined.

## 2. Technology Stack

No application technology stack — only BMAD framework files.

| Layer | Technology | Notes |
|-------|-----------|-------|
| **Framework** | BMAD Method | bmm, bmb, bmgd, cis, core modules installed |
| **Config** | YAML + Markdown | Agent definitions and workflow files |

## 3. Architecture

No application architecture. Repository contains only BMAD framework boilerplate:

```
NorthStarET.Student/
├── _bmad/                 # BMAD framework installation
│   ├── bmm/               # BMAD Method Module
│   ├── bmb/               # BMAD Builder Module
│   ├── bmgd/              # BMAD Game Dev (likely template artifact)
│   ├── cis/               # Creative Intelligence Suite
│   └── core/              # BMAD Core
├── _bmad-output/          # Empty output directory
└── (no application code)
```

## 4. API Surface

None — no application code exists.

## 5. Data Models

None — no application code exists.

## 6. Integration Points

| Integration | Status | Notes |
|------------|--------|-------|
| **NorthStarET** | Undefined | Relationship to existing Student service unclear |
| **BMAD Control Repo** | ✅ Registered | Listed in service-map.yaml |

## 7. Build & Deploy

No build or deploy process — no application code exists.

## 8. Configuration

BMAD framework configuration only (agent definitions, workflow configs).

## 9. Testing

No tests — no application code exists.

## 10. Known Issues & Technical Debt

| # | Issue | Severity | Impact | Recommendation |
|---|-------|----------|--------|----------------|
| 1 | **No application code** | ⚠️ HIGH | Repository bootstrapped but empty — dormant since Jan 31 | Explicit decision: begin development or defer |
| 2 | **Undefined relationship to NorthStarET** | ⚠️ HIGH | NorthStarET already has a Student service in both tracks | Clarify: is this a separate deployment or merged into NorthStarET? |
| 3 | **May drift from patterns** | ⚠️ MEDIUM | BMAD framework version may become stale | If kept, update BMAD modules when NorthStarET.BMAD updates |
| 4 | **bmgd module installed** | LOW | Game Dev module seems misplaced in an LMS student repo | Remove or replace with more appropriate module |

## 11. BMAD Readiness

### Assessment: ⚠️ BLOCKED (No Code)

BMAD framework is installed, but there is no application to plan against. The repository needs an explicit decision before any BMAD lifecycle phase can begin.

### Prerequisites for BMAD /pre-plan

1. 🔴 **Purpose decision:** Define what NorthStarET.Student will contain that NorthStarET doesn't
2. 🔴 **Relationship definition:** How does this repo relate to the NorthStarET Student service?
3. 🔴 **Track alignment:** Will this follow Migration (microservice) or Upgrade (monolith) patterns?
4. ⚠️ **Framework update:** Update BMAD modules to current versions
5. ⚠️ **Initial architecture:** Define technology stack and project structure

### Recommended Sequencing

NorthStarET.Student should be **lowest priority** for BMAD planning. It should only be activated after:
1. NorthStarET track decision is made (Migration vs. Upgrade)
2. NorthStarET Student service scope is finalized
3. An explicit decision is made on whether this repo adds value beyond what's in NorthStarET
