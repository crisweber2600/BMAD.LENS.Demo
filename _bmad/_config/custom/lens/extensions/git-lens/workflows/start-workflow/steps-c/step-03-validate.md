---
name: 'step-03-validate'
description: 'Run validation cascade for previous workflow'
nextStepFile: './step-04-branch.md'
---

# Step 3: Run validation cascade for previous workflow

## Goal
Run validation cascade for previous workflow.

## Instructions
- Access `workflow_status[current.phase]` (may not exist for first workflow in phase).
- If `workflow_status[current.phase]` is missing or has no merged entries, skip validation and proceed.
- Otherwise determine previous workflow from merged entries using the latest `merged_at` timestamp.
- Run ancestry check between previous workflow branch head and phase branch head.
- If configured, check PR metadata for previous workflow PR merge.
- If needed, require manual override via Tracey with reason.
- If validation fails, set `blocked.is_blocked` to true with details, set `current.status` to `blocked`, and persist state.yaml immediately (do not proceed to branch creation).

## Output
- `validation_result`
