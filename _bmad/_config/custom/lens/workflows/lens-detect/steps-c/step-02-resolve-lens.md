---
name: 'step-02-resolve-lens'
description: 'Resolve active lens and entities'
nextStepFile: './step-03-present-summary.md'
---

# Step 2: Resolve Lens

## Goal
Determine the active lens and primary entities.

## Instructions
- Apply detection priority: config override → branch patterns → directory structure → auto-discovery.
- Resolve `current_lens` and any active identifiers (domain/service/microservice/feature).
- If ambiguous, choose the most specific valid lens and note ambiguity.

## Output
- `lens_state`: { current_lens, active_domain, active_service, active_microservice, active_feature }
