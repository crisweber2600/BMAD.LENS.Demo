---
name: 'step-03-persist-profile'
description: 'Persist the personal profile'
---

# Step 3: Persist Profile

## Goal
Create or update the personal profile file.

## Instructions
- Resolve `personal_profiles_folder` from module config.
- Hash email to build a stable profile key.
- Write profile YAML with name, email hash, roles, preferences, timestamps.
- Confirm profile path to the user.

## Output
- Personal profile file in `_bmad-output/personal/` (or configured path)
