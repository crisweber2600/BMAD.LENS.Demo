---
name: 'step-05-handoff-scout'
description: 'Hand off to SCOUT agent for deep analysis'
---

# Step 5: Hand Off to SCOUT

## Goal
Hand off to SCOUT agent to run the full discovery pipeline (DS → AC → GD).

---

## Instructions

### 1. Check Discovery Completion

Verify that initial discovery has completed:
- ✅ Targets selected
- ✅ Context extracted  
- ✅ Basic analysis performed
- ✅ Initial discovery reports generated

### 2. Display Discovery Summary

```
🔍 Initial Discovery Complete

Scanned:
- {target_count} targets
- {service_count} services
- {microservice_count} microservices detected

Discovery reports generated:
{for report in discovery_reports}
- {report.filename}
{endfor}
```

### 3. SCOUT Handoff

**Display:**
```
🧭→🔎 Handing off to SCOUT

SCOUT will now run the complete discovery pipeline in FULL AUTO mode:

For EVERY project in the domain map:
1. [DS] Full Discover - Deep brownfield discovery
2. [AC] Analyze Codebase - Technical analysis  
3. [GD] Generate Docs - Comprehensive documentation

Running in YOLO mode (no confirmations)...
```

### 4. Activate SCOUT Agent

**Call SCOUT agent in AUTO/YOLO mode:**

```
Activate SCOUT agent: {project-root}/_bmad/lens/agents/scout
Trigger: AUTO (full auto mode)

SCOUT will:
- Load domain map from: {project-root}/_lens/domain-map.yaml
- Execute DS → AC → GD on every service/microservice
- Generate complete documentation for all projects
- Return consolidated summary report
```

### 5. SCOUT Agent Not Available

**IF SCOUT agent/extension not installed:**

```
ℹ️ SCOUT Agent Not Available

The full discovery pipeline requires the SCOUT agent (part of lens-sync extension).

Initial discovery is complete. Discovery reports available at:
{project-root}/Docs/{domain}/{service}/

To run the complete pipeline:
1. Ensure lens-sync extension is fully installed
2. Activate SCOUT agent manually
3. Run: AUTO command for full automation

Or continue with Navigator for other workflows.
```

**Return to Navigator menu**

---

## Completion

**IF SCOUT activated in AUTO mode:**
- SCOUT agent now controls workflow
- Will run DS → AC → GD on ALL projects in domain map
- Each project gets complete documentation suite
- Will return consolidated report when complete
- Estimated time: ~15-30 minutes per project

**IF SCOUT not available:**
- Discovery complete with basic reports
- Return to Navigator menu
- User can manually run advanced workflows

---

**Note:** This step serves as a workflow handoff point. The discover workflow's job is to do initial scanning and prepare context. SCOUT AUTO mode takes over for comprehensive multi-project discovery, running DS → AC → GD on every service and microservice in the domain map.
