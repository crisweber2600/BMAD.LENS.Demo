---
name: execute-harmonization
code: execute-harm-fh
module: file-harmonizer
status: "specification"
description: "Execute approved harmonization rules to rename files"
created: "2026-02-02"
---

# Workflow: Execute Harmonization

**Module:** File Harmonizer (fh)  
**Status:** Specification  
**Primary Agent:** Harmonizer

## Purpose

Execute Harmonization applies the user-approved harmonization rules to actually rename files in the repository. This workflow implements safe, tracked file operations with dry-run capability and detailed change logging.

## Workflow Goal

Safely execute all approved file renamings, update internal file references, maintain referential integrity, and generate comprehensive audit trail for all changes.

## Workflow Type

Execution / Refactor

## Inputs

- Approved harmonization mapping plan
- File inventory (from analysis)

## Outputs

- Updated files and references
- Change log and execution report

## Invocation

```
/fh execute
/fh execute-harmonization
/fh harmonize
```

(Usually called after gather-harmonization-rules approval)

## Workflow Steps

### Step 1: Dry-Run Mode (Mandatory)
- Display: "Generating dry-run preview..."
- Invoke Harmonizer in dry-run mode
- Show preview of all operations:
  - Files to be renamed
  - New names
  - Affected references
  - Potential issues
- Ask user: "Review complete. Proceed with execution?"

### Step 2: Execute Renaming
- With user approval, invoke Harmonizer
- Harmonizer renames files according to rules:
  - Extension renamings
  - File name standardizations
  - Conflict resolution
  - Validation at each step

### Step 3: Update Internal References
- Harmonizer updates references within renamed files
- Pattern-based search for old filenames
- Update import statements, requires, includes
- Verify updates with spot checks

### Step 4: Generate Change Log
- Harmonizer creates detailed change log:
  - Timestamp of each operation
  - Before/after file paths
  - Reason for change
  - Success/failure status
  - Reference updates made

### Step 5: Verification
- Verify all renamed files exist
- Spot-check reference updates
- Generate success statistics
- Identify any issues

### Step 6: Present Results
- Display summary:
  - Total files renamed: X
  - Total references updated: Y
  - Success rate: %
  - Any failures or warnings
- Provide change log path
- Explain next steps (documentation update)

## Outputs

**Change Log** (`harmonization-changelog-{timestamp}.md`)
```
## Harmonization Execution Log
**Executed:** 2026-02-02 10:45:00 UTC
**Approved Rules:** harmonization-rules-20260202.json
**Total Operations:** 47

### File Renamings (42)
- config.json → bmad-config.json
- src/config.json → src/bmad-config.json
- ... (all operations listed)

### Reference Updates (47)
- Updated reference in module.json
- Updated require in installer.js
- ... (all updates listed)

### Verification Results
✅ All renamed files exist
✅ All internal references updated
✅ No broken links detected
```

**Execution Report** (`execution-report-{timestamp}.json`)
```json
{
  "executedAt": "2026-02-02T10:45:00Z",
  "status": "success",
  "statistics": {
    "filesRenamed": 42,
    "referencesUpdated": 47,
    "successRate": 100,
    "failures": 0,
    "warnings": 0
  },
  "changeLogPath": "harmonization-changelog-20260202.md",
  "rollbackInfo": "See changelog for reversal instructions"
}
```

## User Interactions

### Confirmation Gates
1. Review dry-run preview
2. Approve execution
3. Confirm completion

### Information Provided
- Real-time progress updates
- Success/failure notifications
- Detailed change log
- Rollback instructions (if needed)

## Safety Mechanisms

✅ **Dry-Run Mandatory** — Always preview first  
✅ **Granular Logging** — Every operation logged  
✅ **Validation Checks** — Verify each operation  
✅ **Rollback Info** — Know how to undo  
✅ **Spot Checking** — Verify random samples  

## Success Criteria

✅ All files renamed as approved  
✅ All internal references updated  
✅ No broken links introduced  
✅ Complete change log generated  
✅ Zero data loss  

## Error Handling

- **Rename Failed:** Log and skip, continue with others
- **Reference Update Failed:** Log, manual fix needed
- **Permission Denied:** Log and skip file
- **File Not Found:** Skip (already handled)
- **Conflict Detected:** Alert user, ask for resolution

## Next Steps

After successful execution:
1. **[D]** Update Documentation (run Scribe)
2. **[V]** Verify Results (detailed inspection)
3. **[L]** View Logs (examine change log)
4. **[C]** Complete (finish workflow)

---

**Status:** Ready for Implementation  
**Created:** 2026-02-02
