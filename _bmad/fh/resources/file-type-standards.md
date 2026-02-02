---
name: file-type-standards
description: BMAD standard file types and extension mappings (JSON-first)
version: "1.0.0"
created: "2026-02-02"
---

# File Type Standards

## Standard Extensions

### Configuration Files

| Type | Standard Extension | Accepted Alternatives | Maps To |
|------|-------------------|----------------------|---------|
| BMAD Config | `.bmad-config.json` | `.bmad-config.yaml`, `.bmad-config.yml` | `.bmad-config.json` |
| Module Config | `.module.json` | `.module.yaml`, `.module.yml` | `.module.json` |
| Agent Config | `.agent.json` | `.agent.yaml`, `.agent.yml` | `.agent.json` |
| Workflow Config | `.workflow.json` | `.workflow.yaml`, `.workflow.yml` | `.workflow.json` |
| Generic Config | `.bmad-config.json` | `.config.json`, `.config.yaml`, `.config.yml` | `.bmad-config.json` |

### Documentation Files

| Type | Standard Extension | Accepted Alternatives | Maps To |
|------|-------------------|----------------------|---------|
| Markdown | `.md` | `.markdown` | `.md` |
| Plain Text | `.txt` | `.text` | `.txt` |

### Code Files

| Language | Standard Extension | Accepted Alternatives | Maps To |
|----------|-------------------|----------------------|----------|
| JavaScript | `.js` | None | `.js` |
| TypeScript | `.ts` | None | `.ts` |
| Python | `.py` | None | `.py` |
| Shell | `.sh` | `.bash` | `.sh` |

### Data Files

| Type | Standard Extension | Accepted Alternatives | Maps To |
|------|-------------------|----------------------|---------|
| JSON | `.json` | None | `.json` |
| CSV | `.csv` | None | `.csv` |
| Data (Binary) | `.data` | `.bin`, `.dat` | `.data` |

### Archive Files

| Type | Standard Extension | Accepted Alternatives | Maps To |
|------|-------------------|----------------------|---------|
| Gzip Archive | `.gz` | None | `.gz` |
| ZIP Archive | `.zip` | None | `.zip` |
| TAR Archive | `.tar` | None | `.tar` |

---

## Blocked Extensions (Not Supported)

These extensions are typically NOT readable by standard file tools and should be converted or renamed:

- `.yaml` — Blocked for this module
- `.yml` — Blocked for this module
- `.exe` — Binary executables
- `.bin` — Binary data
- `.dll` — Dynamic libraries
- `.so` — Shared objects
- `.pyc` — Python bytecode
- `.class` — Java bytecode
- `.o` — Object files
- Any compressed format not listed above

---

## File Naming Conventions

### Generic Name Standardization

| Current Pattern | Standard Form | Example |
|-----------------|---------------|---------|
| `config` | `bmad-config` | `config.json` → `bmad-config.json` |
| `module` | `{context}-module` | `module.md` → `agent-module.md` |
| `test` | `{context}-test` | `test.js` → `agent-test.js` |
| `spec` | `{context}-spec` | `spec.md` → `workflow-spec.md` |
| `utils` | `{context}-utils` | `utils.js` → `core-utils.js` |

### Prefix Standards

Standard prefixes for organized naming:

- `bmad-` — BMAD system files
- `agent-` — Agent-related files
- `workflow-` — Workflow-related files
- `module-` — Module-related files
- `spec-` — Specification documents
- `example-` — Example files
- `test-` — Test files

### File Naming Examples

```
Good:
✅ bmad-config.json
✅ agent-scout.md
✅ workflow-analysis.md
✅ module-installer.js

Avoid:
❌ config.json
❌ agent.md
❌ workflow.md
❌ installer.js
```

---

## Categorization

Files are categorized as follows for inventory:

### Configuration (Config)
- `.json` files in `_config/` directories
- Module configuration files
- System configuration files

### Agents (Agents)
- `.md` files in `agents/` directories
- Agent specification files
- Agent implementation files

### Workflows (Workflows)
- `.md` files in `workflows/` directories
- Workflow specification files
- Workflow implementation files

### Documentation (Docs)
- `.md` files in `docs/` directories
- README files
- Guide and reference files

### Code (Code)
- `.js`, `.ts`, `.py`, `.sh` files
- Implementation files
- Script files

### Resources (Resources)
- `.md`, `.json`, `.csv` in `resources/` directories
- Data files
- Template files

### Build/System (System)
- `.json` in `_build/`, `_temp/` directories
- Build configuration
- System metadata

---

## Harmonization Rules Template

Use this to define harmonization rules:

```json
{
  "harmonizationRules": {
    "extensionMappings": [
      {
        "from": ".config.json",
        "to": ".bmad-config.json",
        "reason": "BMAD naming standard"
      },
      {
        "from": ".config.yaml",
        "to": ".bmad-config.json",
        "reason": "Blocked YAML extension"
      },
      {
        "from": ".bin",
        "to": ".data",
        "reason": "Binary files → generic data extension"
      }
    ],
    "nameMappings": [
      {
        "from": "config",
        "to": "bmad-config",
        "reason": "BMAD naming convention"
      },
      {
        "from": "module",
        "to": "{{context}}-module",
        "reason": "Require context prefix"
      }
    ],
    "excludePatterns": [
      "node_modules/**",
      ".git/**",
      "dist/**",
      "build/**"
    ],
    "verifyIntegrity": true,
    "generateBackups": true,
    "dryRunRequired": true
  }
}
```

---

**Status:** Active  \
**Last Updated:** 2026-02-02
