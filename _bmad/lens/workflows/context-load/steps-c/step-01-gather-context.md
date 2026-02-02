---
name: 'step-01-gather-context'
description: 'Collect context for current lens'
nextStepFile: './step-02-format-output.md'
---

# Step 1: Gather Context

## Goal
Collect the relevant data for the active lens.

## Instructions
- Use `current_lens` to determine scope.
- Domain: list services, shared patterns, cross-cutting concerns.
- Service: list microservices, dependencies, key boundaries.
- Microservice: list contracts, responsibilities, internal structure.
- Feature: list related files, commits, issues, and scope.

## Output
- `lens_context`
