---
name: 'step-03-present-guidance'
description: 'Present guidance card based on setup state'
---

# Step 3: Present Guidance

## Goal
Present a navigation card with recommended next actions based on setup state.

---

## IF SETUP INCOMPLETE

**Display setup-focused guidance:**

```
🧭 LENS Workflow Guide

STATUS: Setup Required ⚠️

Before using lens-aware workflows, complete the initial setup:

SETUP CHECKLIST:
□ 1. Create TargetProjects/ directory
□ 2. Organize domain folders
□ 3. Clone Service repositories
□ 4. Configure LENS (_bmad/lens/config.yaml)
□ 5. Run discovery/indexing (if applicable)

RECOMMENDED NEXT ACTIONS:
• Review onboarding workflow for guided setup
• Check lens-configure workflow for detection rules
• Use discover/bootstrap workflows for brownfield discovery

Run this guide again after completing setup.
```

**STOP** — No further recommendations until setup complete.

---

## IF SETUP COMPLETE

**Display full navigation card:**

```
🧭 LENS Workflow Guide

NAVIGATION CARD:
- Lens position: {current_lens}
- Phase: {current_phase}
- Active scope: {domain}/{service}/{microservice}/{feature}

RECOMMENDED WORKFLOWS:
{For each recommendation:}
• [{workflow_name}] - {reason}
  Priority: {priority}

AVAILABLE ACTIONS:
• Run recommended workflow
• Switch lens (lens-switch)
• Load detailed context (context-load)
• Restore previous session (lens-restore)
• Configure detection rules (lens-configure)

NAVIGATION TIPS:
- Use lens-detect to update your current position
- Use context-load for comprehensive architectural context
- Use lens-switch to change perspective manually
```

---

## Output Format

The guidance card should be:
- ✅ **Clear** — Easy to scan and understand
- ✅ **Actionable** — Specific next steps
- ✅ **Contextual** — Relevant to current lens/phase
- ✅ **Progressive** — Guides users forward in their workflow

## Output
- Guidance card (displayed to user)
