---
name: update-documentation
module: file-harmonizer
type: "spec"
status: "spec"
---

# Workflow Goal

Update all documentation references to renamed files and verify referential integrity across `_bmad` docs.

# Description

Scribe scans documentation, applies mapping rules, updates references, and generates verification reports.

# Workflow Type

Documentation / Verification

# Primary Agent

Scribe

# Step Outline

1. Load rename mappings from execution phase
2. Scan documentation for file references
3. Update references and preserve formatting
4. Verify updated links and generate report

# Inputs

- Rename mappings (from execution)
- Documentation paths (default: `_bmad/`)

# Outputs

- Updated documentation files
- Verification report (broken links, status)