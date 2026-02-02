# File Harmonizer — User Guide

**Module:** File Harmonizer (fh)  
**Version:** 1.0.0  
**Created:** 2026-02-02

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Complete Workflow](#complete-workflow)
3. [Commands](#commands)
4. [Understanding Results](#understanding-results)
5. [Common Scenarios](#common-scenarios)
6. [Troubleshooting](#troubleshooting)
7. [FAQ](#faq)

---

## Quick Start

### 5-Minute Harmonization

1. **Analyze your repository:**
   ```bash
   /fh analyze
   ```
   This scans your repository and generates a file type inventory.

2. **Review the report:**
   Read the output and check what file types were found.

3. **Gather harmonization rules:**
   The workflow will ask you which files to rename and present defaults.
   Answer the prompts and approve the plan.

4. **Execute harmonization:**
   ```bash
   /fh execute
   ```
   Files will be renamed according to your approved rules (with dry-run preview first).

5. **Update documentation:**
   ```bash
   /fh update-docs
   ```
   Documentation references will be automatically updated.

**Done!** Your repository is now harmonized.

---

## Complete Workflow

### Phase 1: Analyze Repository

**Command:** `/fh analyze` or `/fh analyze-repository`

**What It Does:**
- Scans entire repository structure
- Catalogs all file types and extensions
- Attempts to read one sample of each type
- Identifies "blocked" extensions that can't be read
- Generates reports with statistics

**Outputs Generated:**
- `file-inventory-{timestamp}.md` — Complete file type listing
- `file-inventory-{timestamp}.csv` — Spreadsheet format
- `blocked-extensions-{timestamp}.json` — Unreadable extensions

**Example Output:**

```
File Type Inventory Report
Generated: 2026-02-02 10:15 UTC

Total Files Analyzed: 1,247
Unique Extensions Found: 34

Extension Distribution:
  .md                 245 files
  .yaml               189 files
  .json                87 files
  .js                  156 files
  .ts                   98 files
  ...

Blocked Extensions (Cannot Read):
  .bin                 2 files
  .exe                 1 file
```

**Next Step:** Review results and proceed to gathering harmonization rules.

---

### Phase 2: Gather Harmonization Rules

**Command:** Automatic after Phase 1, or `/fh gather-rules`

**What It Does:**
- Shows blocked extensions from Phase 1
- Presents default BMAD harmonization rules
- Asks you to approve or modify rules
- Collects any additional custom rules
- Generates execution plan

**Approval Process:**

1. You see the list of blocked extensions
2. Module shows default rules:
   ```
   Default Rules:
   - config.yaml → bmad-config.yaml
   - config.yml → bmad-config.yaml
   ```
3. You approve, modify, or add rules
4. You approve the complete execution plan
5. Module generates dry-run preview

**Example Conversation:**

```
Scout found these blocked extensions:
- .bin (2 files)
- .exe (1 file)
- .unknown (1 file)

Apply default rules?
[Y]es / [N]o / [M]odify
```

**Next Step:** Execute harmonization with your approved rules.

---

### Phase 3: Execute Harmonization

**Command:** `/fh execute` or `/fh execute-harmonization`

**What It Does:**
1. Shows dry-run preview of all changes
2. Requests your final approval
3. Renames files according to approved rules
4. Updates internal file references
5. Generates detailed change log
6. Verifies success

**Dry-Run Preview:**

```
DRY RUN PREVIEW (No Changes Yet)

Files to be renamed (42 total):
   config.json → bmad-config.json (6 files)
   config.ini → bmad-config.json (8 files)
  .bin → .data (2 files)
  ...

Internal References to Update:
   15 references in module.json
  8 references in installer.js
  ...

Proceed with execution? [Y]es / [N]o
```

**Execution Output:**

```
HARMONIZATION IN PROGRESS...

✅ Renaming files (42/42)
   ✅ src/config.json → src/bmad-config.json
   ✅ config.json → bmad-config.json
  ...

✅ Updating internal references (47/47)
   ✅ Updated module.json
  ✅ Updated installer.js
  ...

✅ Verification complete
  - All renamed files exist
  - All references updated
  - No broken links detected

HARMONIZATION COMPLETE
Change log: harmonization-changelog-20260202.md
```

**Next Step:** Update documentation references.

---

### Phase 4: Update Documentation

**Command:** `/fh update-docs` or `/fh update-documentation`

**What It Does:**
1. Scans all _bmad documentation files
2. Finds all references to renamed files
3. Updates references to new names
4. Verifies all links are valid
5. Generates verification report

**Documentation Scan Results:**

```
DOCUMENTATION REFERENCE UPDATE

Files Scanned: 23 documentation files

References Updated:
   - _bmad/bmad-config.json (5 references)
   - _bmad/module.json (3 references)
  - docs/guide.md (7 references)
  ...

Verification Results:
✅ All references verified
✅ No broken links
✅ All files accessible
✅ Documentation is consistent

DOCUMENTATION UPDATE COMPLETE
Verification report: documentation-verification-20260202.json
```

**Next Step:** Process complete! Review change logs if needed.

---

## Commands

### Main Commands

| Command | Alias | What It Does |
|---------|-------|------------|
| `/fh analyze` | `/fh analyze-repository` | Phase 1: Analyze repository |
| `/fh gather-rules` | `/fh gather-harmonization-rules` | Phase 2: Gather rules |
| `/fh execute` | `/fh execute-harmonization`, `/fh harmonize` | Phase 3: Execute harmonization |
| `/fh update-docs` | `/fh update-documentation` | Phase 4: Update documentation |

### Help Commands

| Command | What It Does |
|---------|------------|
| `/fh help` | Show module help |
| `/fh status` | Show current status |
| `/fh list-rules` | List current harmonization rules |
| `/fh view-log` | View the latest change log |

### Advanced Commands

| Command | What It Does |
|---------|------------|
| `/fh dry-run` | Run harmonization in preview-only mode |
| `/fh verify` | Verify repository harmonization |
| `/fh export-inventory` | Export file inventory in different formats |
| `/fh rollback` | Undo last harmonization (if available) |

---

## Understanding Results

### File Inventory Report

**File:** `file-inventory-{timestamp}.md`

```markdown
# File Inventory Report

## Summary
- Total Files: 1,247
- Unique Extensions: 34
- Blocked Extensions: 3

## Distribution

### Configuration (123 files)
- .yaml: 89 files ✅
- .yml: 18 files → .yaml
- .json: 16 files → .yaml

### Code (445 files)
- .js: 156 files ✅
- .ts: 98 files ✅
- .py: 45 files ✅

### Documentation (234 files)
- .md: 234 files ✅

### Blocked (2 files)
- .bin: 2 files ❌ (cannot read)
```

**What to Look For:**
- ✅ Files that are fine (standard extensions)
- → Files that need mapping
- ❌ Files that can't be read (blocked)

### Blocked Extensions Report

**File:** `blocked-extensions-{timestamp}.json`

```json
{
  "blockedExtensions": [".bin", ".exe", ".unknown"],
  "details": {
    ".bin": {
      "count": 2,
      "reason": "Binary file format",
      "suggestion": "Convert to .data or consider removing"
    },
    ".exe": {
      "count": 1,
      "reason": "Executable - cannot read",
      "suggestion": "Remove or exclude from repository"
    }
  }
}
```

**What to Do:**
- Decide on mapping for each blocked extension
- Some can be renamed (.bin → .data)
- Some should be excluded

### Change Log

**File:** `harmonization-changelog-{timestamp}.md`

Contains detailed record of:
- Every file renamed (before/after)
- Every reference updated (with context)
- Timestamp of each operation
- Success/failure status
- Instructions for rollback if needed

**Use This To:**
- Understand what changed
- Verify changes are correct
- Rollback if needed
- Audit trail for compliance

---

## Common Scenarios

### Scenario 1: Standardizing Configuration Files

**Goal:** All config files should be named `bmad-config.{ext}`

**Steps:**

1. **Analyze:**
   ```bash
   /fh analyze
   ```
   Look for all `config.*` files

2. **Gather Rules:**
   ```
   Apply default rule: config → bmad-config? [Y]es
   ```
   Confirm

3. **Execute:**
   ```bash
   /fh execute
   ```
   All `config.yaml`, `config.yml`, `config.json` become `bmad-config.yaml`

4. **Update Docs:**
   ```bash
   /fh update-docs
   ```
   Documentation automatically updated

**Result:** Consistent configuration file naming across repository

---

### Scenario 2: Handling Unsupported Binary Files

**Goal:** Deal with `.bin` files that can't be read

**Approach:**

1. **Analyze:**
   ```bash
   /fh analyze
   ```
   Scout identifies `.bin` as blocked

2. **Decision Options:**
   - **A)** Rename to `.data` (keep them)
   - **B)** Remove from repository
   - **C)** Exclude from scanning

3. **Gather Rules:**
   Specify mapping rule for `.bin`:
   ```
   .bin → .data
   ```

4. **Execute & Update:**
   Proceed as normal

---

### Scenario 3: Repository Cleanup After Migration

**Goal:** Harmonize repository after merging/copying structures

**Steps:**

1. **Full Analysis:**
   ```bash
   /fh analyze
   ```
   Get complete inventory of new state

2. **Identify Inconsistencies:**
   Look for duplicates and non-standard files

3. **Create Mapping:**
   Define rules for all inconsistencies:
   ```
   - module.json → app-module.json
   - test.js → scout-test.js
   - old-config.json → bmad-config.json
   ```

4. **Execute Full Harmonization:**
   ```bash
   /fh execute
   ```

5. **Verify Integrity:**
   ```bash
   /fh verify
   ```

---

### Scenario 4: Module Installation Standardization

**Goal:** Ensure module follows BMAD naming standards

**Steps:**

1. **Analyze Module:**
   ```bash
   /fh analyze /path/to/module
   ```

2. **Check Against Standards:**
   Review report against `resources/naming-conventions.md`

3. **Create Correction Rules:**
   Map non-standard names to standard ones

4. **Execute Harmonization:**
   ```bash
   /fh execute
   ```

---

## Troubleshooting

### Problem: "Cannot read file" errors

**Cause:** File is binary or unsupported format

**Solution:**
1. Check blocked extensions report
2. Decide if file should be:
   - Renamed to supported extension
   - Removed from repository
   - Excluded from scanning
3. Add rule for this file type

---

### Problem: References not updated after renaming

**Cause:** Reference format not recognized

**Solution:**
1. Run documentation update:
   ```bash
   /fh update-docs
   ```
2. Review verification report for missed references
3. Manually update any unrecognized references
4. Report issue for pattern enhancement

---

### Problem: "File not found" after execution

**Cause:** File was renamed but reference not updated

**Solution:**
1. Check change log for mapping
2. Manually update reference
3. Run verification:
   ```bash
   /fh verify
   ```
4. Report if automated update failed

---

### Problem: Want to undo changes

**Cause:** Harmonization didn't meet expectations

**Solution:**
1. Use rollback information from change log:
   ```bash
   git checkout HEAD^ -- .
   ```
   OR
   ```bash
   # Manually reverse changes using change log mappings
   mv bmad-config.yaml config.yaml
   ```

2. Review what went wrong
3. Adjust rules and try again

---

## FAQ

### Q: Can I undo a harmonization?

**A:** Yes! The change log contains all before/after mappings. You can:
- Use Git to revert: `git checkout HEAD^ -- .`
- Manually reverse changes using the mappings
- Run harmonization again with different rules

### Q: Will this affect my Git history?

**A:** The file renames will be committed as new changes. Git will track them as deletions + additions unless you use `git mv` (which harmonizer can do with proper configuration).

### Q: Can I preview without making changes?

**A:** Yes! Dry-run mode is mandatory:
```bash
/fh execute
# Shows preview, asks for approval before proceeding
```

### Q: What if I have special file types?

**A:** Add custom rules during the "Gather Rules" phase:
```
Custom harmonization rules:
Input mappings in format: OLD → NEW
Example: .custom → .bmad-custom
```

### Q: Can I harmonize only part of the repository?

**A:** Yes! During analysis, specify:
```
Repository path: /path/to/subdirectory
```

### Q: How long does analysis take?

**A:** Depends on repository size:
- Small (< 1000 files): < 10 seconds
- Medium (1000-10000 files): 10-60 seconds
- Large (> 10000 files): May need batch processing

### Q: Will this break imports/requires?

**A:** The harmonizer updates internal references automatically. However:
- External references (npm, git, etc.) won't be affected
- You may need to update those manually
- Code examples in documentation are updated

### Q: Can I use this on non-BMAD repositories?

**A:** Yes! The module works on any repository:
- Analysis works on any structure
- You define custom rules
- Documentation update scans any path
- Great for standardizing any project

### Q: What if file doesn't exist?

**A:** Scout skips missing files and continues:
- Logs the missing file
- Includes in "not found" report
- Won't try to rename non-existent files
- Won't break harmonization process

---

## Next Steps

After successfully harmonizing your repository:

1. **Commit Changes:**
   ```bash
   git add .
   git commit -m "chore: harmonize file naming and extensions"
   ```

2. **Update Team Documentation:**
   Share new naming standards from `resources/naming-conventions.md`

3. **Set Up Validation:**
   Consider adding pre-commit hooks to enforce standards

4. **Monitor Consistency:**
   Run periodic analysis to catch drift:
   ```bash
   /fh analyze
   ```

---

**Status:** Complete  
**Version:** 1.0.0  
**Last Updated:** 2026-02-02
