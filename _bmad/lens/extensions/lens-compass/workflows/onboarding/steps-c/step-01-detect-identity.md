---
name: 'step-01-detect-identity'
description: 'Detect or capture git identity'
nextStepFile: './step-02-explain-roles.md'
---

# Step 1: Detect Identity

## Goal
Identify the user using git config or manual input.

## Instructions
- Read git user.name and user.email if available.
- Ask user to confirm detected identity.
- If not available or rejected, prompt for name and email.
- Normalize and store `user_identity`.

## Output
- `user_identity` (name, email, source)
