---
name: 'step-04-push'
description: 'Push workflow branch if configured'
nextStepFile: './step-05-pr-link.md'
---

# Step 4: Push workflow branch if configured

## Goal
Push workflow branch if configured.

## Instructions
- Push branch if auto_push is true.
- If push fails, mark needs_push in state.

## Output
- `push_result`
