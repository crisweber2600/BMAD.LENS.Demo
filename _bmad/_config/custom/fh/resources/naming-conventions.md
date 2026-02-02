---
name: naming-conventions
description: BMAD naming convention guidelines (JSON-first)
version: "1.0.0"
created: "2026-02-02"
---

# BMAD Naming Conventions

## File Naming Rules

### Rule 1: Use Descriptive Names
- ✅ `agent-scout.md` (descriptive, purpose clear)
- ❌ `scout.md` (could be many things)
- ❌ `a.md` (too generic)

### Rule 2: Use Lowercase with Hyphens
- ✅ `file-harmonizer` (lowercase, hyphen-separated)
- ❌ `FileHarmonizer` (camelCase not preferred)
- ❌ `file_harmonizer` (underscore not preferred)

### Rule 3: Include Context Prefix
- ✅ `agent-scout.md` (context = agent)
- ✅ `workflow-analyze.md` (context = workflow)
- ❌ `scout.md` (no context)
- ❌ `analyze.md` (no context)

### Rule 4: Use Standard Extensions
- ✅ `.json` (config/data standard)
- ✅ `.md` (documentation standard)
- ❌ `.yaml` (blocked)
- ❌ `.yml` (blocked)

### Rule 5: Configuration Files
- ✅ `bmad-config.json` (BMAD standard)
- ✅ `module.json` (module configuration)
- ❌ `config.json` (blocked)
- ❌ `configuration.json` (too long)

---

## Standard Prefixes

### Agent Files
```
agent-{name}.md

Examples:
- agent-scout.md
- agent-harmonizer.md
- agent-scribe.md
```

### Workflow Files
```
workflow-{name}.md

Examples:
- workflow-analyze-repository.md
- workflow-gather-rules.md
- workflow-execute-harmonization.md
```

### Module Files
```
module-{feature}.json

Examples:
- module.json
- module-installer.js
- module-metadata.json
```

### Configuration Files
```
{context}-config.json

Examples:
- bmad-config.json
- agent-config.json
- workflow-config.json
```

### Resource Files
```
{type}-{name}.{ext}

Examples:
- file-type-standards.md
- naming-conventions.md
- default-rules.json
```

### Documentation Files
```
{section}-{topic}.md

Examples:
- getting-started.md
- architecture-overview.md
- api-reference.md
```

---

## Context Prefixes

| Prefix | Usage | Example |
|--------|-------|---------|
| `agent-` | Agent specification files | `agent-scout.md` |
| `workflow-` | Workflow files | `workflow-analyze.md` |
| `module-` | Module files | `module.json` |
| `bmad-` | BMAD system files | `bmad-config.json` |
| `spec-` | Specification documents | `spec-api.md` |
| `example-` | Example files | `example-usage.md` |
| `test-` | Test files | `test-scout.js` |
| `doc-` | Documentation files | `doc-guide.md` |

---

## Naming Anti-Patterns (Avoid)

### ❌ Generic Names Without Context
```
❌ config.json        → ✅ bmad-config.json
❌ agent.md           → ✅ agent-scout.md
❌ workflow.md        → ✅ workflow-analyze.md
❌ spec.md            → ✅ spec-scout-agent.md
```

### ❌ Incorrect Case
```
❌ FileHarmonizer     → ✅ file-harmonizer
❌ File_Harmonizer    → ✅ file-harmonizer
❌ FILEHARMONIZER     → ✅ file-harmonizer
```

### ❌ Incorrect Separators
```
❌ file_harmonizer    → ✅ file-harmonizer
❌ file.harmonizer    → ✅ file-harmonizer
❌ fileharmonizer     → ✅ file-harmonizer
```

### ❌ Wrong Extensions
```
❌ config.yaml        → ✅ bmad-config.json
❌ readme.txt         → ✅ readme.md
❌ module.yaml        → ✅ module.json
```

### ❌ Ambiguous Abbreviations
```
❌ cfg.json           → ✅ bmad-config.json
❌ wf.md              → ✅ workflow.md
❌ ag.md              → ✅ agent.md
```

---

## Specific File Naming Standards

### Agent Files
```text
# Standard format
agent-{name}.md

# Examples
agent-scout.md
agent-harmonizer.md
agent-scribe.md

# Should contain
- agent name and code
- role and personality
- responsibilities
- skills and capabilities
```

### Workflow Files
```text
# Standard format
workflow-{purpose}.md

# Examples
workflow-analyze-repository.md
workflow-gather-harmonization-rules.md
workflow-execute-harmonization.md

# Should contain
- workflow purpose and goals
- step-by-step process
- inputs and outputs
- success criteria
```

### Module Configuration
```text
# Standard format
module.json (in module root)

# Contains
- module code and name
- version and status
- installation requirements
- agent and workflow registration
```

### Configuration Files
```text
# Standard formats
- bmad-config.json (system-wide BMAD config)
- module-config.json (module-specific)
- {feature}-config.json (feature-specific)

# Examples
- bmad-config.json
- scout-config.json
- harmonization-rules.json
```

### Documentation Files
```markdown
# Standard formats
- README.md (module overview)
- TODO.md (development tasks)
- architecture.md (design docs)
- user-guide.md (usage instructions)
- examples.md (code examples)
```

### Resource Files
```text
# Standard format
{type}-{name}.{ext}

# Examples
- file-type-standards.md
- naming-conventions.md
- default-rules.json
```
