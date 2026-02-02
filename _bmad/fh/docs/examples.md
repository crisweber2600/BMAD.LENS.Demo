# File Harmonizer — Real-World Examples

**Module:** File Harmonizer (fh)  
**Version:** 1.0.0  
**Created:** 2026-02-02

---

## Example 1: Standardizing a New BMAD Repository

### Scenario

You just created a new BMAD repository with various contributions, and now want to standardize all file naming and extensions before formal release.

### Repository State

```
Current structure has:
- Multiple config files: config.yaml, config.yml, config.json
- Inconsistent agent names: scout.md, Scout.md, SCOUT_AGENT.md
- Various documentation files: readme.md, README.md, Readme.txt
- Some binary files: data.bin, app.exe
- Mixed naming conventions
```

### Process

#### Step 1: Analyze

```bash
/fh analyze
```

**Output:**
```
File Analysis Report
Generated: 2026-02-02 10:15 UTC

Total Files: 342
Unique Extensions: 28

Top Extensions:
  .yaml          89 files ✅
  .md            78 files ✅
  .js            65 files ✅
  .yml           23 files → needs mapping
  .txt           12 files → needs mapping
  .json          8 files → needs mapping
  .bin           3 files ❌ blocked
  .exe           1 file ❌ blocked

Blocked Extensions:
  .bin: 3 files (binary data)
  .exe: 1 file (executable)
```

#### Step 2: Gather Rules

```
Scout found non-standard extensions:

Current Config Files:
  .yaml: 89 files ✅
  .yml: 23 files
  .json: 8 files
  .txt: 12 files (configs?)

Apply standard rules?
1. .yml → .yaml
2. .json → .yaml
3. .txt → .md

Confirm? [Y]es / [N]o / [M]odify
```

**User Response:** `Yes`

```
Additionally found:

Inconsistent Naming:
  - config files: 42 count
    Rename to bmad-config.yaml? [Y]es

  - Binary files (.bin): 3 count
    Option A) Rename to .data
    Option B) Remove
    Option C) Exclude
    
Choose: A
```

**Execution Plan:**
```
Harmonization Rules Approved:
- .yml → .yaml (23 files)
- .json → .yaml (8 files)
- .txt → .md (12 files, if docs)
- config → bmad-config (42 files)
- .bin → .data (3 files)

Total Operations: 88 files
Estimated Impact: High

Proceed? [Y]es / [P]review / [N]o
```

#### Step 3: Execute

```bash
/fh execute
```

**Dry-Run Preview:**
```
DRY RUN - NO CHANGES YET

File Renamings (88 total):
  config.yaml → bmad-config.yaml (12 files)
  config.yml → bmad-config.yaml (8 files)
  config.json → bmad-config.yaml (6 files)
  settings.yml → settings.yaml (5 files)
  data.bin → data.data (3 files)
  ... (54 more)

Reference Updates (127 total):
  Within module.yaml: 15
  Within installer.js: 8
  Within README.md: 23
  ... (81 more)

PREVIEW COMPLETE
Approve execution? [Y]es / [N]o
```

**User Response:** `Yes`

**Execution Results:**
```
EXECUTION IN PROGRESS...

✅ File Renamings: 88/88 complete
  ✅ 42 config files standardized
  ✅ 23 YAML extensions updated
  ✅ 12 JSON to YAML conversions
  ✅ 8 text files updated
  ✅ 3 binary files handled

✅ Reference Updates: 127/127 complete
  ✅ Module configuration files
  ✅ JavaScript files
  ✅ Agent specifications

✅ Verification: 100% success
  ✅ All files exist
  ✅ All references valid
  ✅ No broken links

HARMONIZATION COMPLETE
Details: harmonization-changelog-20260202.md
```

#### Step 4: Update Documentation

```bash
/fh update-docs
```

**Results:**
```
DOCUMENTATION REFERENCE UPDATE

Scanned: 34 documentation files

References Updated: 52
  - _bmad/config.yaml: 8 refs
  - _bmad/module.yaml: 12 refs
  - docs/architecture.md: 18 refs
  - docs/examples.md: 14 refs

Verification: ✅ PASSED
  ✅ All references verified
  ✅ All files accessible
  ✅ No broken links

DOCUMENTATION UPDATE COMPLETE
```

#### Result

**Before:**
```
Repository is disorganized:
- Multiple config file formats
- Inconsistent naming
- Mixed extensions
- Unreadable binary files
- Broken documentation links
```

**After:**
```
✅ All config files: bmad-config.yaml
✅ Consistent extensions: .yaml, .md, .js, .ts
✅ Standard naming: agent-X, workflow-Y
✅ Binary files: .data format
✅ Documentation: All links valid
✅ Ready for release
```

---

## Example 2: Post-Migration Repository Cleanup

### Scenario

You merged two BMAD repositories and now have:
- Duplicate files with similar names
- Files from both old and new structures
- Broken references to missing files
- Inconsistent naming between the two sources

### Repository State

```
After merge:
- Some files exist twice (old_config.yaml + config.yaml)
- Reference conflicts
- Mixed naming from both repos
- Some old structure files remain
```

### Process

#### Step 1: Analyze Post-Merge State

```bash
/fh analyze
```

**Findings:**
```
Analysis Report - Post-Merge State

Total Files: 1,247 (up from 342)
New Unique Extensions: 12 additional

Duplicates Found:
  - config.yaml (2 copies)
  - config.yml (from merge)
  - agent-scout.md + Scout.md
  - workflow-analyze.md + analyze-workflow.md

Inconsistent Naming:
  - Prefix usage varies between sources
  - Extensions differ (.yml vs .yaml)
  - Agent naming conventions diverge
```

#### Step 2: Design Consolidation Rules

**User creates mapping:**
```
Consolidation Rules:

1. Remove duplicates (keep primary):
   - scout.md ✓ (keep, use as primary)
   - Scout.md → DELETE
   - SCOUT_AGENT.md → DELETE

2. Standardize naming:
   - analyze-workflow.md → workflow-analyze.md
   - Scout_Config.yaml → agent-scout-config.yaml

3. Merge configurations:
   - config.yaml (source A) → bmad-config.yaml
   - config.yml (source B) → DELETE (duplicate)
   - config.json (old format) → DELETE

4. Update all references from old to new

Affected Files: 127
Estimated Operations: 234
```

#### Step 3: Execute

```bash
/fh execute
```

**Results:**
```
✅ File consolidation complete
  ✅ 15 duplicate files removed
  ✅ 52 files renamed to standard format
  ✅ 38 configuration files consolidated
  ✅ 22 new references created

✅ Reference updates complete
  ✅ 234 internal references updated
  ✅ All cross-references valid

✅ Verification passed
  ✅ Zero broken links
  ✅ All consolidations successful
```

#### Step 4: Update Documentation

```bash
/fh update-docs
```

**Results:**
```
✅ Documentation synchronized
  ✅ 89 references updated
  ✅ All old structure references removed
  ✅ All links pointing to consolidated files
  ✅ No broken references
```

#### Result

**Repository State After:**
```
✅ Single copy of each logical file
✅ Consistent naming throughout
✅ No duplicate definitions
✅ All references point to consolidated files
✅ Ready for unified development
```

---

## Example 3: Adding Support for New File Type

### Scenario

Your team starts using a new tool that generates `.config.toml` files. You want to:
- Detect these files
- Include them in analysis
- Map them to YAML for consistency
- Update all references

### Process

#### Step 1: Analyze

```bash
/fh analyze
```

**Findings:**
```
New Extension Found:
  .toml: 5 files (NEW - not in standards)

These are config files from new tool
Need to standardize
```

#### Step 2: Add Custom Rule

```
Encountered non-standard extension: .toml

Options:
A) Convert to .yaml (recommended)
B) Keep .toml (add to standards)
C) Map to different format
D) Remove these files

Choose: A (Convert to YAML)
```

#### Step 3: Execute

```bash
/fh execute
```

**Result:**
```
✅ Converted 5 .toml files to .yaml
✅ Updated content to YAML format (using converter)
✅ Updated all references
✅ Documentation updated
```

---

## Example 4: Verification and Ongoing Maintenance

### Scenario

After initial harmonization, you want to:
- Verify nothing broke
- Check for drift (new non-standard files)
- Maintain standards over time

### Process

#### Periodic Check

```bash
/fh analyze
```

**Output:**
```
Repository Verification Report

Current State: COMPLIANT ✅
  ✅ All extensions standard
  ✅ All names follow conventions
  ✅ No blocked extensions
  ✅ All files readable

Statistics:
  Files: 342 (no change)
  Extensions: 8 (all standard)
  Non-compliant: 0

Recommendation: Status green, continue current practices
```

#### After Team Adds Non-Standard File

```bash
/fh analyze
```

**Output:**
```
Repository Verification Report

Current State: NEEDS ATTENTION ⚠️
  ⚠️ New non-standard extension detected: .cfg
  ⚠️ Inconsistent naming found: config.yaml + legacy_config.yaml

New Issues:
  - .cfg: 2 files (unknown type)
  - Legacy naming: 1 file

Recommendation: Run harmonization to standardize
```

#### Quick Fix

```bash
/fh gather-rules
```

**Process:**
```
New Issues Found:

1. .cfg extension:
   Recommendation: Map to .yaml
   Accept? [Y]es

2. legacy_config.yaml:
   Recommendation: Rename to bmad-config.yaml
   Accept? [Y]es
```

**Execute and update:**
```bash
/fh execute
/fh update-docs
```

---

## Lessons from Examples

### Best Practices Demonstrated

1. **Always Preview First** — Dry-run before execution
2. **Start with Analysis** — Understand current state
3. **Use Defaults** — BMAD provides sensible mappings
4. **Approve Changes** — Review before committing
5. **Update Documentation** — Don't forget to sync docs
6. **Verify Results** — Check that everything worked
7. **Keep Logs** — Use change logs for accountability

### Common Patterns

- **Standardization:** Map various formats to one standard
- **Consolidation:** Merge duplicates into single canonical files
- **Naming:** Apply consistent prefix/suffix patterns
- **References:** Update all pointers after renaming
- **Documentation:** Keep docs in sync with file structure

### When to Use Each Workflow

| Workflow | Use When |
|----------|----------|
| Analyze | First time, periodic checks, after major changes |
| Gather Rules | Ready to commit to changes |
| Execute | Approved and previewed rules |
| Update Docs | After files are renamed |

---

**Status:** Complete  
**Version:** 1.0.0  
**Last Updated:** 2026-02-02
