---
name: analyze-repository
code: analyze-repo-fh
module: file-harmonizer
status: "specification"
description: "Scan repository and generate file type inventory"
created: "2026-02-02"
---

# Workflow: Analyze Repository

**Module:** File Harmonizer (fh)  
**Status:** Specification  
**Primary Agent:** Scout

## Purpose

Analyze Repository is the discovery phase of file harmonization. This workflow invokes Scout to comprehensively scan the repository, catalog all file types, test extension readability, and generate a detailed inventory report.

## Workflow Goal

Generate a complete, categorized inventory of all file types in the repository, identify blocked extensions that cannot be read or don't meet standards, and prepare data for the harmonization phase.

## Workflow Type

Discovery / Analysis

## Inputs

- Repository path (default: project root)
- Exclusion patterns (optional)
- Custom categorization rules (optional)

## Outputs

- File inventory report (Markdown/JSON/CSV)
- Blocked extensions list
- Readability failure reasons

## Invocation

```
/fh analyze
/fh analyze-repository
```

## Workflow Steps

### Step 1: Initialize Scout
- Present workflow overview to user
- Gather repository path (default: project root)
- Configure scan parameters (excluded directories, custom rules)
- Display settings confirmation

### Step 2: Execute Scout Analysis
- Invoke Scout agent
- Scout scans repository recursively
- Scout attempts to read one sample of each file type
- Scout generates inventory report

### Step 3: Present Analysis Results
- Display file type distribution (stats)
- Show categorized file types
- Highlight blocked extensions
- Present read failure details
- Ask user next action

### Step 4: Generate Inventory Output
- Save inventory to CSV format
- Save inventory to JSON format
- Save inventory to markdown report
- Create blocked extensions list

## Outputs

**File Type Inventory Report** (`file-inventory-{timestamp}.md`)
- Complete file type listing
- Distribution statistics
- Categorized by type (config, code, documentation, etc.)
- Read status for each extension

**Blocked Extensions Report** (`blocked-extensions-{timestamp}.json`)
```json
{
  "blockedExtensions": [".bin", ".exe", ".unknown"],
  "failureReasons": {
    ".bin": "Binary file format not supported",
    ".exe": "Binary executable - not readable"
  },
  "totalCount": 3
}
```

**CSV Inventory** (`file-inventory-{timestamp}.csv`)
- Extension, Count, SampleFile, Readable, Category

## User Interactions

### Input Required
1. Repository path (optional, defaults to root)
2. Directories to exclude (optional)
3. Custom categorization (optional)

### Decisions
- Continue to harmonization rules?
- Save inventory for later use?
- Export to specific formats?

## Success Criteria

✅ Complete file type inventory generated  
✅ All extensions tested for readability  
✅ Blocked extensions clearly identified  
✅ Reports generated in multiple formats  
✅ Statistics accurate and complete  

## Error Handling

- **Read Permission Denied:** Log and continue
- **Unsupported Format:** Flag as blocked
- **Missing File:** Skip and continue
- **Large File:** Sample first N bytes for testing
- **Symbolic Links:** Handle appropriately

## Next Steps

After successful analysis, user can:
1. **[G]** Gather Harmonization Rules (next phase)
2. **[E]** Export results (different formats)
3. **[R]** Review details (dive deep into specific categories)
4. **[M]** Return to main menu

---

**Status:** Ready for Implementation  
**Created:** 2026-02-02
