---
name: 'step-01-load-profile'
description: 'Load personal profile'
nextStepFile: './step-02-edit-profile.md'
---

# Step 1: Load Profile

## Goal
Load the user's personal profile.

## Instructions
- Resolve `personal_profiles_folder` from module config.
- Locate profile by email hash.
- If missing, offer to run onboarding.

## Output
- `profile_data`
