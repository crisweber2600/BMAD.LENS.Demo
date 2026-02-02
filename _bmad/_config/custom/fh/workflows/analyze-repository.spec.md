---
name: analyze-repository
module: file-harmonizer
type: "spec"
status: "spec"
---

# Workflow Goal

Generate a complete, categorized inventory of repository file types and identify blocked extensions by attempting to read one sample per type.

# Description

Scout scans the repository, builds a distinct list of file extensions, tests readability, and outputs reports for downstream harmonization.

# Workflow Type

Discovery / Analysis

# Primary Agent

Scout

# Step Outline

1. Initialize scan parameters (root path, exclusions)
2. Traverse repository and collect file types
3. Read one sample per extension via `read_file`
4. Build inventory report and blocked extensions list
5. Present summary and next actions

# Inputs

- Repository root (default: project root)
- Exclusion patterns (optional)
- Custom categorization rules (optional)

# Outputs

- File inventory report (Markdown/JSON/CSV)
- Blocked extensions list
- Readability failure reasons