# File Harmonizer — Module Architecture

**Module:** File Harmonizer (fh)  
**Version:** 1.0.0  
**Created:** 2026-02-02

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Agent Design](#agent-design)
4. [Workflow Design](#workflow-design)
5. [Data Flow](#data-flow)
6. [Integration Points](#integration-points)
7. [Safety Mechanisms](#safety-mechanisms)

---

## Overview

File Harmonizer is a repository harmonization module designed to:
- Discover all file types in a repository
- Identify non-standard or "blocked" file extensions and names
- Apply user-approved harmonization rules
- Update documentation references to maintain integrity

The module is built on three specialized agents working together through four coordinated workflows.

---

## Architecture

### Design Principles

1. **Separation of Concerns** — Each agent has a specific focus
2. **User Control** — All major operations require user approval
3. **Safety First** — Dry-run and preview modes throughout
4. **Traceability** — Every operation is logged and auditable
5. **Modularity** — Agents and workflows can be used independently

### Module Structure

```
file-harmonizer (fh)
├── agents/
│   ├── scout.md              # File system analyzer
│   ├── harmonizer.md         # Renaming specialist
│   └── scribe.md             # Documentation manager
│
├── workflows/
│   ├── analyze-repository.md              # Phase 1: Discovery
│   ├── gather-harmonization-rules.md      # Phase 2: Planning
│   ├── execute-harmonization.md           # Phase 3: Execution
│   └── update-documentation.md            # Phase 4: Documentation
│
├── resources/
│   ├── file-type-standards.md             # Standard mappings
│   ├── naming-conventions.md              # Naming rules
│   └── templates/
│       ├── inventory-report.md
│       └── change-log-template.md
│
└── docs/
    ├── architecture.md         # This file
    ├── user-guide.md          # Usage guide
    └── examples.md            # Real-world examples
```

---

## Agent Design

### Agent 1: Scout (File System Analyzer)

**Role:** Discover, catalog, and analyze file types

**Responsibilities:**
- Recursively traverse repository structure
- Build inventory of all file types and extensions
- Attempt to read samples of each type
- Identify "blocked" extensions
- Generate inventory reports

**Key Characteristics:**
- Thorough and systematic
- Provides detailed statistics
- Non-destructive (read-only)
- Produces multiple output formats

**Interfaces:**
- **Input:** Repository path, exclusion patterns (optional)
- **Output:** File inventory (JSON, CSV, markdown), blocked extensions list

**Data Structures:**
```
FileTypeInventory {
  extension: string
  count: number
  sampleFiles: string[]
  readable: boolean
  category: string
  failureReason?: string
}
```

---

### Agent 2: Harmonizer (Renaming & Standardization Specialist)

**Role:** Execute file renamings and maintain reference integrity

**Responsibilities:**
- Apply approved harmonization rules
- Execute file renamings safely
- Update internal file references
- Generate detailed change logs
- Implement dry-run preview mode

**Key Characteristics:**
- Methodical and careful
- Safety-conscious (always preview first)
- Preserves file contents
- Fully auditable operations

**Interfaces:**
- **Input:** File inventory, harmonization rules, dry-run flag
- **Output:** Renamed files, change log, execution report

**Data Structures:**
```
HarmonizationRule {
  ruleId: string
  ruleType: "extension" | "name"
  pattern: string
  replacement: string
  affectedFiles: number
  reason: string
}

ChangeEntry {
  timestamp: datetime
  operation: "rename" | "reference-update"
  oldPath: string
  newPath: string
  status: "success" | "failed"
  details: string
}
```

---

### Agent 3: Scribe (Documentation & Reference Manager)

**Role:** Maintain documentation accuracy and referential integrity

**Responsibilities:**
- Scan documentation for file references
- Update references according to harmonization
- Verify all links are valid
- Generate verification reports

**Key Characteristics:**
- Precise and detail-oriented
- Preserves formatting and context
- Comprehensive verification
- Excellent reporting

**Interfaces:**
- **Input:** Harmonization rules, documentation path
- **Output:** Updated documentation, verification report

**Data Structures:**
```
ReferenceUpdate {
  file: string
  lineNumber: number
  oldReference: string
  newReference: string
  referenceType: "link" | "path" | "code" | "config"
  context: string
}

VerificationResult {
  referencesFound: number
  referencesUpdated: number
  brokenLinksFound: number
  status: "success" | "warning" | "failed"
}
```

---

## Workflow Design

### Workflow 1: Analyze Repository (Scout)

```
Start
  ↓
Initialize Scout
  ↓
Scan Repository
  ├─ Traverse directories
  ├─ Collect file types
  └─ Test readability
  ↓
Generate Reports
  ├─ File inventory
  ├─ Blocked extensions
  └─ Statistics
  ↓
Present to User
  ↓
End
```

**Key Features:**
- Non-destructive analysis
- Multiple output formats
- Clear statistics
- Ready for next phase

---

### Workflow 2: Gather Harmonization Rules

```
Start
  ↓
Review Blocked Extensions
  ├─ Show list
  ├─ Show counts
  └─ Ask user
  ↓
Apply Default Rules
  ├─ Present defaults
  └─ Collect modifications
  ↓
Gather Custom Rules
  ├─ Ask for extensions
  └─ Ask for names
  ↓
Generate Mapping
  ├─ Show complete plan
  ├─ Show impact analysis
  └─ Request approval
  ↓
Create Execution Plan
  ├─ Generate dry-run
  └─ Prepare for execution
  ↓
End
```

**Key Features:**
- User-approved rules
- Default rules provided
- Clear impact analysis
- Dry-run preview

---

### Workflow 3: Execute Harmonization (Harmonizer)

```
Start
  ↓
Show Dry-Run Preview
  ├─ List all operations
  ├─ Show impact
  └─ Request approval
  ↓
Execute Renaming
  ├─ Rename files
  ├─ Update references
  └─ Validate each step
  ↓
Generate Change Log
  ├─ Document all changes
  ├─ Record timestamps
  └─ Provide rollback info
  ↓
Verify Success
  ├─ Check file existence
  ├─ Spot-check references
  └─ Generate report
  ↓
End
```

**Key Features:**
- Mandatory dry-run
- Safe operations
- Detailed logging
- Verification checks

---

### Workflow 4: Update Documentation (Scribe)

```
Start
  ↓
Load Harmonization Context
  ├─ Read change log
  └─ Extract mappings
  ↓
Scan Documentation
  ├─ Find all files
  ├─ Extract references
  └─ Build update plan
  ↓
Update References
  ├─ Apply mappings
  ├─ Preserve formatting
  └─ Log updates
  ↓
Verify All Links
  ├─ Check file existence
  ├─ Verify paths
  └─ Identify broken links
  ↓
Generate Reports
  ├─ Update summary
  ├─ Verification results
  └─ Broken link report
  ↓
End
```

**Key Features:**
- Comprehensive scanning
- Formatting preservation
- Full verification
- Detailed reporting

---

## Data Flow

### End-to-End Process

```
Phase 1: Analyze
┌─────────────────────┐
│  Scout Agent        │
│  Scans repository   │
│  Tests readability  │
└──────────┬──────────┘
           │ Inventory,
           │ Blocked list
           ↓
      Analysis Report
           │
           ↓
       (User Reviews)
           │
           ↓

Phase 2: Plan
┌─────────────────────┐
│  User Input         │
│  Approval Process   │
│  Mapping Rules      │
└──────────┬──────────┘
           │ Harmonization
           │ Rules
           ↓
      Execution Plan
           │
           ↓
    (User Approves)
           │
           ↓

Phase 3: Execute
┌─────────────────────┐
│  Harmonizer Agent   │
│  Rename files       │
│  Update references  │
└──────────┬──────────┘
           │ Change Log,
           │ Report
           ↓
     Harmonization
     Complete
           │
           ↓

Phase 4: Documentation
┌─────────────────────┐
│  Scribe Agent       │
│  Update references  │
│  Verify links       │
└──────────┬──────────┘
           │ Verification
           │ Report
           ↓
    All Complete
```

### Data Structures Used

1. **FileTypeInventory** — Scout's output
2. **HarmonizationRule** — User-approved mappings
3. **ChangeEntry** — Harmonizer's operations
4. **ReferenceUpdate** — Scribe's updates

---

## Integration Points

### External Dependencies

- `read_file` tool — For testing file readability
- `file_search` tool — For discovering files
- `grep_search` tool — For finding references
- `run_in_terminal` tool — For safe rename operations

### BMAD System Integration

- Agents register in module.json
- Workflows available through BMAD menu system
- Output stored in `_bmad-output/` directory
- Follows BMAD naming conventions

### Configuration Integration

- Reads from `module.json` configuration
- References `file-type-standards.md`
- Uses `naming-conventions.md` for rules
- Respects BMAD exclusion patterns

---

## Safety Mechanisms

### 1. Dry-Run Preview
- All changes previewed before execution
- User must approve each major phase
- Show detailed impact analysis

### 2. Detailed Logging
- Every operation logged with timestamp
- Before/after state recorded
- Reasons documented
- Rollback information provided

### 3. Validation Checks
- Pre-execution validation
- Post-execution verification
- Spot-checking of random samples
- Integrity verification

### 4. Read-Only First Phase
- Scout phase is non-destructive
- Safe exploration of repository
- No changes until user approval

### 5. Reversibility
- Change logs include rollback instructions
- Old file names recorded
- Original states documented
- Can reconstruct previous state

### 6. User Control
- Explicit approvals required
- User can review all rules
- User can modify rules
- User can cancel at any point

---

## Extension Points

### Adding New Agents

Extend the module by adding agents to `agents/` directory:

```
agents/
├── scout.md
├── harmonizer.md
├── scribe.md
└── new-agent.md        ← Add here
```

Register in `module.json`:
```json
{
  "install": {
    "register_agents": [
      "new-agent"
    ]
  }
}
```

### Adding New Workflows

Extend by adding workflows to `workflows/` directory:

```
workflows/
├── analyze-repository.md
├── gather-harmonization-rules.md
├── execute-harmonization.md
├── update-documentation.md
└── new-workflow.md     ← Add here
```

Register in `module.json`:
```json
{
  "install": {
    "register_workflows": [
      "new-workflow"
    ]
  }
}
```

### Custom Harmonization Rules

Add custom rules to `resources/`:

```
resources/
├── file-type-standards.md
├── naming-conventions.md
└── custom-rules.json   ← Add here
```

---

## Performance Considerations

### Optimization Strategies

1. **Large Repository Scanning**
   - Batch process directories
   - Cache results for re-runs
   - Exclude common non-code directories

2. **Reference Updates**
   - Use regex patterns for efficiency
   - Batch file updates
   - Parallelize verification

3. **Memory Management**
   - Stream large file listings
   - Paginate results
   - Clean up temporary data

---

**Status:** Active  
**Version:** 1.0.0  
**Last Updated:** 2026-02-02
