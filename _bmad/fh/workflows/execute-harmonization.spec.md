---
name: execute-harmonization
module: file-harmonizer
type: "spec"
status: "spec"
---

# Workflow Goal

Safely apply approved rename rules with a mandatory dry-run, then update internal references and generate change logs.

# Description

Harmonizer previews all changes, executes renames on approval, updates references, and produces a detailed audit trail.

# Workflow Type

Execution / Refactor

# Primary Agent

Harmonizer

# Step Outline

1. Dry-run preview of all operations
2. User approval gate
3. Rename files and update references
4. Generate change log and verification summary

# Inputs

- Approved harmonization mapping plan
- File inventory (from analysis)

# Outputs

- Updated files and references
- Change log and execution report