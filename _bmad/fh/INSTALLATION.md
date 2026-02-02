# Installation Guide — File Harmonizer Module

**Module:** File Harmonizer (fh)  
**Version:** 1.0.0  
**Status:** Installation Ready  
**Created:** 2026-02-02

---

## Quick Start Installation

### Step 1: Verify Module Location

The File Harmonizer module should be located at:
```
src/modules/fh/
```

Verify all files are present:
```
✅ module.json
✅ README.md
✅ agents/
✅ workflows/
✅ resources/
✅ docs/
✅ _module-installer/
```

### Step 2: Run Installation

**Using Node.js:**

```bash
cd src/modules/fh/_module-installer
node installer.js install
```

**Or if you're in the project root:**

```bash
node src/modules/fh/_module-installer/installer.js install
```

**Expected Output:**

```
============================================================
  File Harmonizer Module Installer
  Version: 1.0.0
============================================================

[FH] Verifying installation requirements...
  ✓ Found: agents/scout.md
  ✓ Found: agents/harmonizer.md
  ✓ Found: agents/scribe.md
  ✓ Found: workflows/analyze-repository.md
  ✓ Found: workflows/gather-harmonization-rules.md
  ✓ Found: workflows/execute-harmonization.md
  ✓ Found: workflows/update-documentation.md
  ✓ All requirements verified
[FH] Registering agents...
  ✓ Registered agent: scout (File System Analyzer)
  ✓ Registered agent: harmonizer (Renaming Specialist)
  ✓ Registered agent: scribe (Documentation Manager)
[FH] Registering workflows...
  ✓ Registered workflow: analyze-repository
  ✓ Registered workflow: gather-harmonization-rules
  ✓ Registered workflow: execute-harmonization
  ✓ Registered workflow: update-documentation
[FH] Initializing configuration...
  ✓ Configuration initialized
[FH] Verifying installation...
  ✓ Agents verified (3)
  ✓ Workflows verified (4)
  ✓ Resources accessible
  ✓ Documentation accessible
  ✓ Installation verified successfully

✅ Installation Complete!

The File Harmonizer module is now ready to use.

Module Location: /path/to/src/modules/fh
Quick Start Commands:
  1. /fh analyze            # Analyze repository
  2. /fh gather-rules       # Define harmonization rules
  3. /fh execute            # Execute harmonization
  4. /fh update-docs        # Update documentation

Documentation: See docs/user-guide.md for detailed instructions
```

### Step 3: Verify Installation

```bash
node src/modules/fh/_module-installer/installer.js status
```

**Expected Output:**

```
File Harmonizer Module Status

  Module: file-harmonizer
  Code: fh
  Version: 1.0.0
  Root: /path/to/src/modules/fh
  Status: ✓ Installed
```

---

## Installation Requirements

### Prerequisites

- **Node.js** — v12 or higher
- **BMAD Core** — v6.0.0 or higher (reference dependency)
- **Disk Space** — ~5MB for module files
- **Write Permissions** — Access to project root directory

### System Compatibility

- ✅ Windows (tested on Windows 10+)
- ✅ macOS (tested on 10.14+)
- ✅ Linux (tested on Ubuntu 18.04+)

---

## What Gets Installed

### Module Files
- ✅ 3 Agent specifications
- ✅ 4 Workflow definitions
- ✅ 2 Resource configuration files
- ✅ 3 Documentation pages
- ✅ Installation scripts

### Registration
- ✅ 3 agents registered with BMAD
- ✅ 4 workflows registered with BMAD
- ✅ Module configuration active

### Accessibility
- ✅ Module commands available
- ✅ Workflows callable via `/fh` command
- ✅ Documentation accessible

---

## Commands After Installation

### Main Workflows

```bash
# Analyze repository
/fh analyze

# Gather harmonization rules
/fh gather-rules

# Execute harmonization
/fh execute

# Update documentation
/fh update-docs
```

### Installer Commands

```bash
# Install module
node installer.js install

# Check status
node installer.js status

# Uninstall module
node installer.js uninstall
```

---

## Troubleshooting Installation

### Problem: "Module directory not found"

**Cause:** Installer can't locate the module files

**Solution:**
1. Verify you're running from correct directory
2. Check that `src/modules/fh/` exists
3. Ensure all files are present (see "Verify Module Location")

### Problem: "Required file missing"

**Cause:** One of the specification files is missing

**Solution:**
1. Check file listing: `ls -la src/modules/fh/`
2. Verify all files from "What Gets Installed" section are present
3. Reinstall module from backup if needed

### Problem: "Cannot read property 'mkdir' of undefined"

**Cause:** File system permissions issue

**Solution:**
1. Ensure you have write access to project root
2. Try running with elevated permissions: `sudo node installer.js install`
3. Check disk space availability

### Problem: "Installation failed: EACCES"

**Cause:** Permission denied

**Solution:**
1. Check file permissions: `ls -l src/modules/fh/`
2. Grant write permissions: `chmod -R 755 src/modules/fh/`
3. Try installation again

---

## Post-Installation Setup

### 1. Verify Agents

Check that agents are accessible:
```bash
/fh list-agents
```

Should show:
- scout
- harmonizer
- scribe

### 2. Test Workflows

Run a test analysis:
```bash
/fh analyze
```

Should complete successfully without errors.

### 3. Read Documentation

Get familiar with the module:
```bash
cat src/modules/fh/docs/user-guide.md
```

---

## Uninstallation

To remove the File Harmonizer module:

```bash
node src/modules/fh/_module-installer/installer.js uninstall
```

**Note:** This will:
- ✅ Unregister agents
- ✅ Unregister workflows
- ✅ Clean up configuration
- ❌ NOT delete module files (they remain for reinstallation)

To completely remove:
```bash
rm -rf src/modules/fh/
```

---

## Installation Support

### Getting Help

1. **Quick Start:** See `README.md` in module root
2. **User Guide:** See `docs/user-guide.md`
3. **Examples:** See `docs/examples.md`
4. **Architecture:** See `docs/architecture.md`

### Common Commands

```bash
# Show help
/fh help

# Show module status
/fh status

# View configuration
cat src/modules/fh/module.json

# View installation logs
node installer.js install 2>&1 | tee installation.log
```

---

## Advanced Installation

### Custom Installation Path

If you need to install to a custom location, modify the installer:

```javascript
const installer = new FileHarmonizerInstaller({
  projectRoot: '/custom/path',
  verbose: true
});
await installer.install();
```

### Silent Installation

```javascript
const installer = new FileHarmonizerInstaller({
  projectRoot: process.cwd(),
  verbose: false  // No console output
});
await installer.install();
```

### Installation with Verification

```javascript
const installer = new FileHarmonizerInstaller({
  projectRoot: process.cwd(),
  verbose: true
});

try {
  const result = await installer.install();
  console.log('Installation result:', result);
} catch (error) {
  console.error('Installation failed:', error);
}
```

---

## Verification Checklist

After installation, verify:

- [ ] All 3 agents registered
- [ ] All 4 workflows registered
- [ ] `/fh` commands available
- [ ] Documentation accessible
- [ ] Test analysis runs successfully
- [ ] No errors in console output
- [ ] Module status shows "Installed"

---

## Next Steps

1. ✅ Installation complete
2. → Run: `/fh analyze` to test module
3. → Read: `docs/user-guide.md` for usage
4. → Review: `docs/examples.md` for scenarios

---

**Installation Status:** ✅ READY  
**Module Version:** 1.0.0  
**Install Date:** 2026-02-02  

For more information, see [README.md](../README.md) or [User Guide](../docs/user-guide.md).
