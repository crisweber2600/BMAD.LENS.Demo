---
name: 'step-01-validate-target'
description: 'Validate target lens and scope'
nextStepFile: './step-02-load-context.md'
---

# Step 1: Validate Target

## Goal
Confirm the target lens and any required identifiers.

## Instructions
- Accept `target_lens` from user input or workflow invocation.
- Validate lens value: Domain, Service, Microservice, Feature.
- If required, ask for target identifiers (domain/service/microservice/feature).

## Output
- `target_lens`
- `target_identifiers`
