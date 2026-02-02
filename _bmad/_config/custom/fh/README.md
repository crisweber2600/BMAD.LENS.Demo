# File Harmonizer Module

**Code:** `fh`  
**Status:** Active  
**Version:** 1.0.0

## Overview

File Harmonizer analyzes BMAD repository structures to identify file type inconsistencies and naming patterns, then systematically harmonizes them according to BMAD standards.

## Installation

Run the installer from the project root:

```bash
node src/modules/fh/_module-installer/installer.js install
```

For detailed setup steps, see `INSTALLATION.md`.

For a guided setup checklist, see `prompts/bmad.fh.setup.prompt.md`.

## Quick Start

### Analyze Your Repository

```bash
/fh analyze
```

Scans your repository and generates a complete inventory of file types, extensions, and naming patterns. Identifies any "blocked" extensions that don't meet standards.

### View Analysis Report

The Scout agent will provide:
- Complete file type distribution
- List of blocked extensions
- Attempted reads on sample files
- Categorized file inventory

### Harmonize Files

```bash
/fh harmonize
```

After approval, the Harmonizer agent will:
1. Rename blocked extensions to standards
2. Update internal file references
3. Create detailed change logs

### Update Documentation

```bash
/fh update-docs
```

The Scribe agent will:
1. Scan _bmad documentation
2. Update all file references
3. Verify links are valid

## Agents

- **Scout** — File system analyzer and inventory generator
- **Harmonizer** — File renaming and standardization specialist
- **Scribe** — Documentation reference manager

## Workflows

- **analyze-repository** — Discovery and file type analysis
- **gather-harmonization-rules** — User rule collection and planning
- **execute-harmonization** — Execute file renaming and updates
- **update-documentation** — Documentation reference updating

## Features

✅ Automatic file type discovery  
✅ Blocked extension detection  
✅ User-guided harmonization rules  
✅ Safe dry-run mode  
✅ Detailed change logging  
✅ Documentation reference updating  
✅ Referential integrity verification  

## Use Cases

### Repository Analysis
Get a complete understanding of what file types exist in your repository and how they're distributed.

### Configuration File Standardization
Rename all config files to follow BMAD naming conventions (e.g., `config.json` → `bmad-config.json`).

### Extension Validation
Identify and resolve unsupported file types that can't be processed by standard tools.

### Post-Migration Cleanup
After copying or merging repository structures, harmonize inconsistencies and broken references.

## Configuration

See `resources/file-type-standards.md` for supported extensions and naming conventions.

## Module Structure

```
src/modules/fh/
├── module.json
├── README.md
├── TODO.md
├── INSTALLATION.md
├── agents/
│   ├── scout.spec.md
│   ├── harmonizer.spec.md
│   └── scribe.spec.md
├── workflows/
│   ├── analyze-repository.spec.md
│   ├── gather-harmonization-rules.spec.md
│   ├── execute-harmonization.spec.md
│   └── update-documentation.spec.md
├── resources/
│   ├── file-type-standards.md
│   └── naming-conventions.md
├── prompts/
│   └── bmad.fh.setup.prompt.md
├── docs/
│   ├── architecture.md
│   ├── user-guide.md
│   └── examples.md
└── _module-installer/
	└── installer.js
```

## More Information

- See [docs/architecture.md](docs/architecture.md) for module design
- See [docs/user-guide.md](docs/user-guide.md) for detailed usage
- See [docs/examples.md](docs/examples.md) for real-world examples

---

**Module Code:** `fh`  
**Installed at:** `src/modules/fh/`
