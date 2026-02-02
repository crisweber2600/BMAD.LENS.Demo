---
name: gather-harmonization-rules
module: file-harmonizer
type: "spec"
status: "spec"
---

# Workflow Goal

Collect user-approved mappings for blocked extensions and non-standard filenames, producing a harmonization plan.

# Description

Presents Scout findings, proposes default rules (e.g., `config.* → bmad-config.*`), gathers user overrides, and outputs a final mapping plan.

# Workflow Type

Planning / Rule Collection

# Primary Agent

Scout (results) + User input

# Step Outline

1. Display blocked extensions and counts
2. Propose default rename rules
3. Prompt for blocked filenames (default: `config.*`)
4. Collect custom mappings and exclusions
5. Present and confirm final plan

# Inputs

- Blocked extensions list (from analysis)
- User-provided mappings and exclusions

# Outputs

- Harmonization mapping plan
- Approved rename rules