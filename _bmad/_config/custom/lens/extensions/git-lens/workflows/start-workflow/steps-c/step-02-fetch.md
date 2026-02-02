---
name: 'step-02-fetch'
description: 'Refresh cached refs if needed'
nextStepFile: './step-03-validate.md'
---

# Step 2: Refresh cached refs if needed

## Goal
Refresh cached refs if needed.

## Instructions
- Check fetch cache TTL based on fetch_strategy.
- Fetch remote refs if cache expired or manual sync requested.

## Output
- `fetch_result`
