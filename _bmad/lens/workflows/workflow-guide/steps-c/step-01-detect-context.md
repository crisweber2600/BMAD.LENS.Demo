---
name: 'step-01-detect-context'
description: 'Preflight checks and detect lens and phase'
nextStepFile: './step-02-map-recommendations.md'
---

# Step 1: Preflight & Detect Context

## Goal
Check for required setup, then resolve the active lens and current BMAD phase.

---

## PREFLIGHT: Check TargetProjects Setup

**CRITICAL:** Before providing any lens-aware guidance, verify that the foundational project structure exists.

### 1. Check for TargetProjects Directory

```bash
target_projects_path = "{workspace_root}/TargetProjects"
```

**IF TargetProjects does NOT exist:**

Display setup instructions:

```
⚠️ LENS Setup Required

TargetProjects/ directory not found. Before using LENS workflows, complete these steps:

SETUP CHECKLIST:
□ 1. Create TargetProjects/ directory
   mkdir TargetProjects

□ 2. Create domain folders
   Example: TargetProjects/Healthcare/, TargetProjects/Finance/

□ 3. Clone Service repositories into domain folders
   Example: 
   cd TargetProjects/Healthcare
   git clone <service-repo-url> ServiceName

□ 4. Configure LENS detection rules
   Edit: _bmad/lens/config.yaml
   - Set branch_patterns for your git strategy
   - Configure service/microservice detection

□ 5. Run discovery/scout to index the codebase
   (Optional - use scout/bridge agents for codebase analysis)

Once complete, run this workflow again for lens-aware guidance.
```

**STOP workflow** — Exit gracefully and wait for user to complete setup.

---

### 2. Verify TargetProjects Has Content

**IF TargetProjects exists but is empty:**

```
⚠️ TargetProjects is Empty

Found TargetProjects/ but no projects detected.

NEXT STEPS:
□ 1. Create domain folders (e.g., TargetProjects/DomainName/)
□ 2. Clone Service repos into domain folders
□ 3. Run this workflow again

Or if you're starting fresh:
- Consider using the onboarding workflow
- Or manually set up your project structure
```

**STOP workflow** — Exit gracefully.

---

## DETECTION: Resolve Lens & Phase

**IF TargetProjects setup is complete:**

Proceed with normal detection:

### 1. Check for SCOUT Index

**Check:** `_bmad/_memory/scout-sidecar/scout-discoveries.md`

**IF missing:**
```
💡 Tip: SCOUT Index Not Found

LENS works without SCOUT, but you'll get better context with it.

Run discovery to build the index:
• [discover workflow] - Scan and index your codebase
• Or re-run onboarding to complete full setup

Continuing with basic detection...
```

### 2. Detect Current Lens
- Call lens-detect if current lens is unknown
- Check for active lens session in `.lens/lens-session.yaml`
- Use SCOUT index if available for enriched detection

### 3. Infer BMAD Phase
- Check branch name for phase indicators (feature/, service/, etc.)
- Check current directory structure
- Look for phase markers in git history

## Output
- `setup_complete`: boolean
- `current_lens`: Domain | Service | Microservice | Feature | Unknown
- `current_phase`: Analysis | Planning | Implementation | QA | Unknown
- `recommendations_ready`: boolean
