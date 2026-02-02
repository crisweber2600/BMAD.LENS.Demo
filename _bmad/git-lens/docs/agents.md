# Agents Reference

Git-Lens includes 2 specialized agents:

---

## Casey — Git Branch Orchestrator

**ID:** `_bmad/lens/agents/casey.agent.yaml`
**Icon:** 🏗️

**Role:**
Runs auto-triggered git operations (branch creation, validation, PR link output) based on LENS hooks.

**When to Use:**
You don't invoke Casey directly. Casey runs automatically when LENS workflows start or complete.

**Key Capabilities:**
- Initialize initiative branches
- Create workflow branches with merge gating
- Smart commit + PR link output
- Phase and review gate transitions

**Menu Trigger(s):**
Auto-triggered only

---

## Tracey — State & Diagnostics Specialist

**ID:** `_bmad/lens/agents/tracey.agent.yaml`
**Icon:** 🧭

**Role:**
Provides diagnostics, recovery, and manual overrides for Git-Lens state.

**When to Use:**
Use Tracey any time you need status, recovery, or to override a block.

**Key Capabilities:**
- Status reporting with topology
- Sync and re-validation
- State recovery (event log → git scan → guided)
- Manual override escape hatch

**Menu Trigger(s):**
ST, RS, SY, FIX, OVERRIDE, REVIEWERS, RECREATE, ARCHIVE
