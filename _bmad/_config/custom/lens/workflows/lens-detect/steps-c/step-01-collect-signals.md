---
name: 'step-01-collect-signals'
description: 'Collect git, directory, and config signals'
nextStepFile: './step-02-resolve-lens.md'
---

# Step 1: Collect Signals

## Goal
Gather the input signals needed to resolve the current lens.

## Instructions
- Read the current git branch (if available).
- Identify working directory or path cues (e.g., services/, apps/).
- Load `.lens/lens-config.yaml` if present.
- Record signals as a small structured list: branch, paths, config.

## Output
- `lens_signals`: { branch, paths, config }
