---
name: 'step-01-preflight'
description: 'Validate repo, state, and workflow context'
nextStepFile: './step-02-fetch.md'
---

# Step 1: Validate repo, state, and workflow context

## Goal
Validate repo, state, and workflow context.

## Instructions
- Load state.yaml and confirm current phase/lane.
- Verify no active block (unless override set).
- Confirm workflow name from LENS trigger.

## Output
- `workflow_context`
