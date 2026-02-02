---
name: 'step-06-update-state'
description: 'Update state and event log'

---

# Step 6: Update state and event log

## Goal
Update state and event log.

## Instructions
- Update `workflow_status[current.phase][current.workflow]` to complete (merged status is set after merge validation).
- Append finish-workflow event to event-log.jsonl.

## Output
- `state_updated`
