---
name: 'step-04-run-scout'
description: 'Run SCOUT to scan and index the codebase'
---

# Step 4: Run SCOUT Discovery

## Goal
Scan the codebase and build an index for LENS workflows.

---

## Instructions

### 1. Check for SCOUT Agent

**IF SCOUT agent is NOT available:**

Display:
```
ℹ️ SCOUT Discovery (Optional)

SCOUT agent provides:
- Automated codebase scanning and indexing
- Dependency discovery
- Architecture analysis
- Documentation generation

To use SCOUT:
1. Ensure SCOUT agent is installed as part of lens module
2. Run onboarding again or manually run discovery workflow

Skipping SCOUT for now. LENS will work without it, but some workflows
may require manual context entry.
```

**STOP** — Onboarding complete without SCOUT

---

### 2. Check if SCOUT Has Already Run

**Check for:** `_bmad/_memory/scout-sidecar/scout-discoveries.md`

**IF exists and recent (< 7 days old):**

Display:
```
✅ SCOUT Index Found

SCOUT has already scanned the codebase (last run: {timestamp}).

Options:
- [s] Skip - Use existing index
- [r] Refresh - Re-scan codebase now
- [c] Continue - Complete onboarding
```

**IF user selects 's' or 'c':** Proceed to completion message
**IF user selects 'r':** Continue to step 3

---

### 3. Run SCOUT Discovery

**Display:**
```
🔍 Running SCOUT Discovery

SCOUT will now scan your project structure and build an index.
This helps LENS provide better context and recommendations.

Scanning:
- TargetProjects/ structure
- Service repositories
- Microservice boundaries  
- Dependencies and integrations
- Tech stack detection

This may take a few minutes for large codebases...
```

**Execute:** `{project-root}/_bmad/lens/workflows/discover/workflow.md`

**Pass parameters:**
- `target_root`: from lens-config (target_project_root or TargetProjects/)
- `discovery_depth`: "standard" (can be configured later)
- `output_path`: "_bmad/_memory/scout-sidecar/analysis/"

---

### 4. SCOUT Completion

**After SCOUT completes, display:**

```
✅ SCOUT Discovery Complete

Index created:
- {count} domains scanned
- {count} services analyzed
- {count} microservices detected
- {count} dependencies mapped

Scout data stored in: _memory/scout-sidecar/

LENS workflows can now provide richer context using this index.
```

---

### 5. Completion Message

Display final onboarding summary:

```
🎯 LENS Onboarding Complete!

Setup Summary:
✅ Domain map created ({domain_count} domains)
✅ LENS configuration set
✅ SCOUT index built ({service_count} services)

LENS is fully operational. Here's what you can do now:

IMMEDIATE ACTIONS:
• [NAV] - Detect current lens position
• [CL] - Load detailed context for current lens
• [GUIDE] - Get workflow recommendations

NAVIGATION:
• [SW] - Switch between Domain/Service/Microservice/Feature lenses
• [MAP] - View/edit domain architecture map
• [RS] - Restore previous session

DEVELOPMENT:
• [NM] - Create new microservice
• [NF] - Start new feature branch with context
• [IMP] - Analyze cross-boundary impacts

COLLABORATION:
• [PM] - Start Party Mode for multi-agent review

TIPS:
- LENS remembers your position between sessions
- Run GUIDE anytime for context-aware workflow suggestions
- Use CL (context-load) before implementing features
- SCOUT updates automatically when you run discovery workflows

Ready to navigate your architecture!
```

---

## Output

- SCOUT index in `_memory/scout-sidecar/` (if lens-sync installed)
- Onboarding complete
- User ready to use LENS workflows
