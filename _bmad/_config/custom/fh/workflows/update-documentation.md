---
name: update-documentation
code: update-docs-fh
module: file-harmonizer
status: "specification"
description: "Update all _bmad documentation references to renamed files"
created: "2026-02-02"
---

# Workflow: Update Documentation

**Module:** File Harmonizer (fh)  
**Status:** Specification  
**Primary Agent:** Scribe

## Purpose

Update Documentation scans the _bmad documentation directory and systematically updates all references to files that were renamed in the harmonization phase. Scribe ensures referential integrity across all documentation.

## Workflow Goal

Update all documentation files in _bmad to point to correctly renamed files, verify all links are valid, and maintain referential integrity across the entire documentation tree.

## Workflow Type

Documentation / Verification

## Inputs

- Rename mappings (from execution)
- Documentation paths (default: _bmad/)

## Outputs

- Updated documentation files
- Verification report (broken links, status)

## Invocation

```
/fh update-docs
/fh update-documentation
```

(Recommended after execute-harmonization completes)

## Workflow Steps

### Step 1: Load Harmonization Context
- Load change log from execution phase
- Extract file mappings (old → new)
- Extract reference updates made
- Prepare for documentation scan

### Step 2: Scan _bmad Documentation
- Scribe scans _bmad directory recursively
- Identifies all documentation files (*.md, *.yaml, *.json)
- Extracts file references from:
  - Markdown links: `[text](file.yaml)`
  - File paths: `/path/to/file.yaml`
  - Code blocks and examples
  - Configuration references

### Step 3: Identify References to Update
- For each reference found, check if it matches an old file name
- Categorize references:
  - Direct file references
  - Relative paths
  - Absolute paths
  - Code examples
  - Configuration paths
- Build update plan

### Step 4: Update References
- Scribe updates each reference:
  - Preserve formatting and context
  - Update paths correctly
  - Maintain markdown/yaml/json syntax
  - Preserve any surrounding text
- Log each update with:
  - File name
  - Line number
  - Old reference
  - New reference
  - Context

### Step 5: Verify All References
- Check that all updated references point to valid files
- Verify file existence
- Test relative path calculations
- Identify any broken links
- Generate verification report

### Step 6: Present Verification Results
- Display summary:
  - Total documentation files scanned: X
  - Total references found: Y
  - Total references updated: Z
  - Broken links found: 0
- Show verification report
- Ask if user wants to review details

## Outputs

**Documentation Update Report** (`documentation-updates-{timestamp}.md`)
```
## Documentation Reference Updates

**Executed:** 2026-02-02 11:00:00 UTC
**Harmonization Rules Applied:** harmonization-rules-20260202.json

### Files Scanned: 23 documentation files

### References Found and Updated: 47

#### Module Configuration Files (12 updates)
- _bmad/config.yaml: 2 references updated
- _bmad/manifest.yaml: 3 references updated
- ... (all files listed)

#### Agent Files (8 updates)
- agents/agent-scout.md: 1 reference updated
- ... (all files listed)

#### Workflow Documentation (15 updates)
- workflows/analyze.md: 4 references updated
- ... (all files listed)

#### README/Documentation (12 updates)
- README.md: 2 references updated
- docs/guide.md: 5 references updated
- ... (all files listed)

### Verification Results
✅ All references verified
✅ All files exist and accessible
✅ No broken links detected
✅ Documentation is consistent
```

**Verification Report** (`documentation-verification-{timestamp}.json`)
```json
{
  "executedAt": "2026-02-02T11:00:00Z",
  "status": "success",
  "statistics": {
    "filesScanned": 23,
    "referencesFound": 47,
    "referencesUpdated": 47,
    "brokenLinksFound": 0,
    "updateRate": 100,
    "verificationStatus": "passed"
  },
  "updateReport": "documentation-updates-20260202.md"
}
```

## Reference Update Examples

### Markdown Links
```
OLD: [Config Guide](../config.yaml)
NEW: [Config Guide](../bmad-config.yaml)
```

### Code Examples
```
OLD: with open('config.yaml') as f:
NEW: with open('bmad-config.yaml') as f:
```

### YAML References
```
OLD: configFile: config.yaml
NEW: configFile: bmad-config.yaml
```

### Paths
```
OLD: See _bmad/config.yaml for details
NEW: See _bmad/bmad-config.yaml for details
```

## Success Criteria

✅ All file references in _bmad updated  
✅ No broken links remaining  
✅ All updated files are valid  
✅ Formatting and context preserved  
✅ Complete audit trail of updates  
✅ Verification report confirms success  

## Error Handling

- **Reference Not Found:** Log warning, manual review needed
- **File Doesn't Exist:** Flag as broken link
- **Parse Error:** Skip file, log error, continue
- **Permission Denied:** Log and skip file
- **Ambiguous Reference:** Flag for manual review

## Reference Search Patterns

```regex
# Markdown links
\[.*?\]\((.*?)\)

# File paths
(?:^|[^a-zA-Z0-9])((?:\.\.?/)?[a-zA-Z0-9_\-./]+\.yaml)

# Relative paths
(?:\./|\.\./)[\w\-./]+

# Code references
(?:config|module|bmad)[a-z_\-]*\.(yaml|yml|json)
```

## Next Steps

After documentation update:
1. **[V]** Verify Results (detailed inspection)
2. **[C]** Complete Process (finish all workflows)
3. **[R]** Review All Changes (comprehensive summary)
4. **[M]** Manual Review (specific files)

---

**Status:** Ready for Implementation  
**Created:** 2026-02-02
