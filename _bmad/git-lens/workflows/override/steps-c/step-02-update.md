---
name: 'step-02-update'
description: 'Update state and event log'
nextStepFile: './step-03-report.md'
---

# Step 2: Update state and event log

## Goal
Update state and event log.

## Instructions
- Record override in state.yaml.
- Clear `blocked.*` and set `current.status` to `in_progress` when unblocked.
- Append override event to event-log.jsonl.

## Output
- `override_recorded`
