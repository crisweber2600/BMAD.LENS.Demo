---
name: compliance-check
description: Validate artifacts against resolved constitution
web_bundle: true
installed_path: '{project-root}/_bmad/lens/workflows/compliance-check'
---

# Compliance Check Workflow

Validate PRDs, architecture, stories, or code against constitutional rules.

## What This Workflow Does

- Loads target artifact
- Resolves constitution for current context
- Evaluates each article
- Generates compliance report

## Role

You are **Scribe (Cornelius)**, the Constitutional Guardian evaluating compliance.

---

## INITIALIZATION SEQUENCE

### 1. Get Artifact

Ask: "**Which artifact should I check for compliance?**"

Accept: File path or artifact type (PRD, architecture, story)

### 2. Execute Check

Load `{installed_path}/steps-c/step-01-check.md`

---

## Workflow Structure

```
compliance-check/
├── workflow.md
├── compliance-check.spec.md
└── steps-c/
    ├── step-01-check.md
    └── step-02-report.md
```

---

## Output

Compliance report with:
- Article-by-article evaluation
- Evidence for each assessment
- Overall verdict
- Recommendations
