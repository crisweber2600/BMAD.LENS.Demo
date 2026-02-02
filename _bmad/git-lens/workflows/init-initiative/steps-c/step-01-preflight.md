---
name: 'step-01-preflight'
description: 'Validate git repo, config, and active initiative'
nextStepFile: './step-02-slug.md'
---

# Step 1: Validate git repo, config, and active initiative

## Goal
Validate git repo, config, and active initiative.

## Instructions
- Verify git repository exists and is clean enough to proceed.
- Load module configuration (base_ref, auto_push, remote_name).
- Check for active initiative in state.yaml; block if already active.

## Output
- `preflight_status`
