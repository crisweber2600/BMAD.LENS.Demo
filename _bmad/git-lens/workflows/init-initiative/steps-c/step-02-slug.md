---
name: 'step-02-slug'
description: 'Generate initiative slug and check collisions'
nextStepFile: './step-03-branches.md'
---

# Step 2: Generate initiative slug and check collisions

## Goal
Generate initiative slug and check collisions.

## Instructions
- Generate slug from initiative name (short hash + sanitized name).
- Check for existing branches using slug.
- If collision, regenerate or prompt user.

## Output
- `initiative_slug`
