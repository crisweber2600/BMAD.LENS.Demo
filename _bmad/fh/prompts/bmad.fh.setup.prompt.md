---
description: Set up and verify the File Harmonizer (FH) module using JSON-based configuration and non-blocked filenames
---

# File Harmonizer (FH) Setup Prompt

Use this prompt to set up FH in a project and verify the module is operational.

## Step 1: Verify Module Files
Ensure these files exist in `src/modules/fh/`:
- `module.json`
- `README.md`
- `TODO.md`
- `INSTALLATION.md`
- `_module-installer/installer.js`
- `resources/file-type-standards.md`
- `resources/naming-conventions.md`
- `docs/architecture.md`
- `docs/user-guide.md`
- `docs/examples.md`

Confirm there are **no** `.yaml` files in the FH module.

## Step 2: Install FH
From the project root:
```
node src/modules/fh/_module-installer/installer.js install
```

## Step 3: Verify Status
```
node src/modules/fh/_module-installer/installer.js status
```

Expected: status reports `Installed` and no missing files.

## Step 4: First Run (Optional)
Run a quick analysis to validate the workflow:
```
/fh analyze
```

If analysis succeeds, proceed to rules collection and execution as needed:
```
/fh gather-rules
/fh execute
```

## Step 5: Confirm Output
Check for generated reports in `_bmad-output/` and verify references were updated.

---

**Guardrails:**
- Do not use `.yaml` files in FH.
- Avoid files named `config.*` (blocked by policy).
