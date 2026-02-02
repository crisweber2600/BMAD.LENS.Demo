---
name: 'step-02-validate'
description: 'Re-run validation cascade'
nextStepFile: './step-03-update.md'
---

# Step 2: Re-run validation cascade

## Goal
Re-run validation cascade.

## Instructions
- Re-evaluate any blocks using validation cascade.
- If validation succeeds, clear `blocked.*` and set `current.status` to `in_progress`.
- If validation fails, ensure `blocked.*` remains set and `current.status` is `blocked`.

## Output
- `validation_result`
