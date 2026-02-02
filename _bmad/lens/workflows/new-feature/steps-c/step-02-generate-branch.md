---
name: 'step-02-generate-branch'
description: 'Generate branch name'
nextStepFile: './step-03-initialize-context.md'
---

# Step 2: Generate Branch

## Goal
Generate a branch name using the 6-segment schema.

## Instructions
- Build `{domain}/{service}/{microservice}/{feature}/{phase}/{workflow}`.
- If any segment is unknown, use `na` placeholder.

## Output
- `branch_name`
