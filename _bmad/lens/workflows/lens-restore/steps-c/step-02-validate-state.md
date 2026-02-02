---
name: 'step-02-validate-state'
description: 'Validate session with current repo'
nextStepFile: './step-03-rehydrate.md'
---

# Step 2: Validate State

## Goal
Ensure the stored session matches the current repository context.

## Instructions
- Compare stored branch and path cues with current signals.
- If mismatched, warn and offer to re-detect.

## Output
- `validated_state`
