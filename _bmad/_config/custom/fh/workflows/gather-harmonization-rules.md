---
name: gather-harmonization-rules
code: gather-rules-fh
module: file-harmonizer
status: "specification"
description: "Collect user harmonization rules and generate execution plan"
created: "2026-02-02"
---

# Workflow: Gather Harmonization Rules

**Module:** File Harmonizer (fh)  
**Status:** Specification  
**Primary Agents:** Scout (reference), User (input)

## Purpose

Gather Harmonization Rules collects approved harmonization mappings from the user based on the file inventory from the previous phase. This workflow builds the ruleset that will be applied during execution.

## Workflow Goal

Create a user-approved harmonization mapping that specifies:
- Which extensions to rename
- What they should be renamed to
- Which file names need standardization
- Which operations require special handling

## Workflow Type

Planning / Rule Collection

## Inputs

- Blocked extensions list (from analysis)
- User-provided mappings and exclusions

## Outputs

- Harmonization mapping plan
- Approved rename rules

## Invocation

```
/fh gather-rules
/fh gather-harmonization-rules
```

(Usually called automatically after analyze-repository)

## Workflow Steps

### Step 1: Review Blocked Extensions
- Display blocked extensions from Scout analysis
- Show count of files per extension
- Ask which ones need harmonization
- Collect user decisions

### Step 2: Default Rules Application
- Present default BMAD rules:
  - `config.*` → `bmad-config.*`
  - Other standard conversions
- Ask user to confirm or modify
- Let user add custom rules

### Step 3: Gather Custom Rules
- Ask user: "Any other files to harmonize?"
- Present file naming conventions
- Collect old → new mappings
- Allow multiple entries

### Step 4: Show Default Blocked Names
- Present: "Are these file names currently blocked in your repo?"
  - `config` (file name only, no extension)
  - `module` (generic name)
  - `test` (ambiguous naming)
  - Other common patterns
- Ask user to confirm which apply

### Step 5: User Approval
- Display complete harmonization plan
- Show summary of all changes:
  - Count of files affected per rule
  - Estimated total operations
  - Any conflicts or warnings
- Ask: "Approve this harmonization plan?"

### Step 6: Generate Execution Plan
- Create detailed execution plan document
- Show dry-run preview of what will happen
- Prepare for execution phase

## Outputs

**Harmonization Mapping** (`harmonization-rules-{timestamp}.json`)
```json
{
  "extensionMappings": {
    ".yaml": ".bmad-config.yaml",
    ".yml": ".bmad-config.yaml",
    ".bin": ".data"
  },
  "nameMappings": {
    "config": "bmad-config",
    "module": "app-module"
  },
  "affected_files_count": 42,
  "estimated_operations": 47,
  "approved_by": "user",
  "approved_at": "2026-02-02T10:30:00Z"
}
```

**Execution Plan** (`execution-plan-{timestamp}.md`)
- Detailed list of all operations
- Files affected per rule
- Estimated impact
- Potential warnings
- Dry-run preview

## User Interactions

### Decisions Required
1. Which blocked extensions to rename?
2. What should they be renamed to?
3. Any blocked file names to standardize?
4. Custom harmonization rules?
5. Final approval to proceed?

### Inputs Needed
- Extension mappings (old → new)
- File name mappings (old → new)
- Special handling requirements
- Exclusion patterns (if any)

## Default Rules

```yaml
extensionMappings:
  - config.yaml → bmad-config.yaml
  - config.yml → bmad-config.yml
  - config.json → bmad-config.yaml
  - .config → .bmad-config
  
nameStandardizations:
  - config → bmad-config
  - module-config → bmad-module-config
  - app-config → bmad-app-config
```

## Success Criteria

✅ Complete harmonization mapping created  
✅ User has approved all changes  
✅ Execution plan is clear and detailed  
✅ No conflicts or ambiguities remain  
✅ Ready to proceed to execution  

## Error Handling

- **Invalid Mappings:** Suggest corrections
- **Conflicts:** Highlight and resolve
- **Overlapping Rules:** Warn and allow adjustment
- **No Changes Selected:** Allow cancellation

## Next Steps

After user approval:
1. **[E]** Execute Harmonization (rename files)
2. **[D]** Dry-Run (preview without changes)
3. **[M]** Modify rules (go back and adjust)
4. **[C]** Cancel (abort this run)

---

**Status:** Ready for Implementation  
**Created:** 2026-02-02
