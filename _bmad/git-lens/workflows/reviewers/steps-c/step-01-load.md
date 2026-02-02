---
name: 'step-01-load'
description: 'Load Compass roster'
nextStepFile: './step-02-filter.md'
---

# Step 1: Load Compass roster

## Goal
Load Compass roster.

## Instructions
- If `compass_enabled` is false, skip roster loading and return an empty list.
- Resolve `compass_roster_file` from module config.
- If the configured file is missing, fallback to:
	- `{project-root}/_bmad/lens/extensions/git-lens/test-data/mock-compass.csv`
	- `{project-root}/src/modules/lens/extensions/git-lens/test-data/mock-compass.csv`
- If no roster file is found, warn and return.
- Accept CSV or YAML; parse into {username, role, initiative} records.

## Output
- `roster_data`
