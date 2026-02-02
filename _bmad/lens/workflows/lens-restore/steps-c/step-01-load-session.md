---
name: 'step-01-load-session'
description: 'Load last session state'
nextStepFile: './step-02-validate-state.md'
---

# Step 1: Load Session

## Goal
Load the last known lens session state.

## Instructions
- Read `.lens/lens-session.yaml` if present.
- If missing, fall back to sidecar memories.

## Output
- `session_state`
