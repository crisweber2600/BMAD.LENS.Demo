---
name: lens-work-installation
description: Install and configure LENS Workbench (lens-work) module for guided BMAD lifecycle management. Use this skill when users need to set up lens-work in their BMAD control repository for phase-aware project orchestration with git-based discipline.
license: MIT
---

# LENS Workbench Installation Skill

LENS Workbench is a guided lifecycle router that transforms BMAD into an accessible, phase-aware system with automated git-orchestrated discipline. This skill guides you through installing and initializing lens-work.

---

## About LENS Workbench

LENS Workbench (lens-work) provides:

- **Phase Router Commands** — `/pre-plan`, `/spec`, `/plan`, `/review`, `/dev` for structured lifecycle phases
- **Automated Git Orchestration** — Branch topology mirrors BMAD phases automatically
- **Layer-Aware Context** — Auto-detects domain/service/microservice/feature layers
- **Repo Discovery & Documentation** — Inventories and documents repos before planning
- **Lifecycle Telemetry** — Tracks phase progress with dashboard visibility

---

## Prerequisites

Before installing lens-work, verify:

1. **BMAD Framework Installed** — You have a BMAD control repository with:
   - `_bmad/core/` — Core BMAD infrastructure
   - `_bmad/bmm/` — BMad Method Module (required dependency)
   - `_bmad/_config/` — Installation manifests

2. **Node.js & npm** — Version 18+ for running BMAD installer
   ```bash
   node --version  # Should be v18+
   npm --version   # Should be v9+
   ```

3. **Git** — For version control operations
   ```bash
   git --version   # Should be available
   ```

4. **Write Permissions** — To your BMAD directory

Verify prerequisites:
```bash
cd /path/to/bmad-control-repo
npx bmad-method --version
```

---

## Installation Modes

### Mode 1: Interactive Installation (Default)

**Recommended for first-time setup.** Prompts guide you through each configuration step.

```bash
cd /path/to/bmad-control-repo
npx bmad-method install
```

When prompted:
1. Select **lens-work** from the module list
2. Provide your name (for agent communication)
3. Confirm installation settings
4. If prompted, configure IDE integration (optional)

**Time**: ~2 minutes  
**Best for**: Learning LENS Workbench, understanding available options

---

### Mode 2: Non-Interactive Installation (Automated)

**Ideal for CI/CD, scripted deployments, and repeatable setups.** Provide all configuration flags upfront.

```bash
npx bmad-method install \
  --directory . \
  --modules bmm,lens-work \
  --tools none \
  --user-name "Development Team" \
  --communication-language English \
  --document-output-language English \
  --output-folder _bmad-output \
  --yes
```

**Flags Explained**:

| Flag | Purpose | Example |
|------|---------|---------|
| `--directory` | Installation directory (use `.` for current) | `--directory .` |
| `--modules` | Comma-separated module IDs | `--modules bmm,lens-work` |
| `--tools` | IDE/tool integration: `none`, `claude-code`, `cursor`, `vscode` | `--tools none` |
| `--user-name` | Name for agent communication | `--user-name "Your Team"` |
| `--communication-language` | Agent language preference | `--communication-language English` |
| `--document-output-language` | Documentation language | `--document-output-language English` |
| `--output-folder` | Artifact output path | `--output-folder _bmad-output` |
| `--yes` / `-y` | Accept all defaults, skip confirmations | (flag only) |

**Time**: ~1 minute  
**Best for**: Automated deployments, CI/CD pipelines, batch installations

---

### Mode 3: Semi-Interactive (Graceful Fallback)

**Provides some flags, prompts for remainder.** Useful when you have partial configuration.

```bash
npx bmad-method install \
  --directory . \
  --modules bmm,lens-work \
  --user-name "Your Team"
```

BMAD will:
- Use provided directory and modules
- Prompt for tool/IDE selection
- Prompt for output folder if needed

**Best for**: Hybrid setups, CI/CD with user customization

---

### Mode 4: Quick Install (Defaults)

**Fastest installation.** Accepts all defaults and skips custom prompts.

```bash
npx bmad-method install --yes
```

This will:
- Install to current directory
- Disable tool configuration
- Use standard defaults
- Reuse previous tool settings (if any)

**Time**: ~30 seconds  
**Best for**: Testing, quick bootstraps, offline environments

---

## Post-Installation: Bootstrap Phase

After successful installation, LENS Workbench requires a bootstrap step to initialize your TargetProjects structure:

### Step 1: Verify Installation

```bash
# Confirm lens-work was installed
ls _bmad/lens-work/
# Should show: agents/, workflows/, config.yaml, module.yaml, README.md
```

### Step 2: Activate Compass Agent

Compass is the phase router. Start your first interaction:

**In VS Code Copilot Chat:**
```
@compass help
```

Or via CLI:
```bash
npx @lens-work compass
```

Compass will display:
- Current system status
- Available phase commands (`/pre-plan`, `/spec`, `/plan`, `/review`, `/dev`)
- Initiative creation options (`#new-domain`, `#new-service`, `#new-feature`)

### Step 3: Initialize Domain or Service

Create your first initiative to trigger bootstrap:

**In Copilot Chat:**
```
#new-domain "My Domain"
```

Or:
```
#new-service "My Service"
```

Compass will:
1. Ask for target repositories
2. Generate initiative ID and branch topology
3. Prepare lens-work state file

### Step 4: Run Bootstrap Workflow

After creating an initiative, run bootstrap to organize TargetProjects:

**In Copilot Chat:**
```
bootstrap
```

Scout (bootstrap agent) will:
1. Check active initiative context
2. **For domain initiatives**: Prompt for domain/service structure
   ```
   Domain/Service path for 'repo-name'? DOMAIN/SERVICE
   ```
3. Create service map with proper hierarchy
4. Clone/organize repos to:
   ```
   TargetProjects/
   ├── DOMAIN/
   │   └── SERVICE/
   │       └── REPO/
   ```
5. Generate documentation
6. Return bootstrap report

### Step 5: Start First Workflow

Begin the Analysis phase:

```
/pre-plan
```

LENS Workbench is now ready for use!

---

## Installation Variations

### Install Without Tools/IDE Integration

For server environments, CI/CD, or headless setup:

```bash
npx bmad-method install \
  --directory . \
  --modules bmm,lens-work \
  --tools none \
  --yes
```

**Result**: lens-work installed, no IDE plugins configured. Perfect for container deployments.

---

### Install with Multiple Tools

For teams using multiple IDEs:

```bash
npx bmad-method install \
  --directory . \
  --modules bmm,lens-work \
  --tools claude-code,cursor,vscode \
  --user-name "Development Team"
```

Configures agents in Claude Code, Cursor, and VS Code simultaneously.

---

### Install with Custom Modules

If you have custom BMAD modules:

```bash
npx bmad-method install \
  --directory . \
  --modules bmm,lens-work \
  --custom-content ./my-custom-module,./another-module \
  --tools none
```

Custom modules must each contain a `module.yaml` with a `code` field.

---

### Update/Reinstall Existing Installation

If LENS Workbench is already installed and needs refresh:

```bash
npx bmad-method install \
  --action quick-update \
  --directory .
```

Or add new modules to existing installation:

```bash
npx bmad-method install \
  --action update \
  --directory . \
  --modules bmm,lens-work,bmb
```

---

## Environment-Specific Examples

### Development Environment

```bash
npx bmad-method install \
  --directory . \
  --modules bmm,lens-work \
  --tools claude-code,cursor \
  --user-name "${USER}" \
  --output-folder _bmad-output
```

### CI/CD Pipeline

```bash
#!/bin/bash
npx bmad-method install \
  --directory "${GITHUB_WORKSPACE}" \
  --modules bmm,lens-work \
  --tools none \
  --user-name "CI Bot" \
  --communication-language English \
  --document-output-language English \
  --output-folder _bmad-output \
  --yes
```

### Production Environment

```bash
npx bmad-method install \
  --directory /opt/bmad-app \
  --modules bmm,lens-work \
  --tools none \
  --user-name "Production Team" \
  --output-folder /var/bmad-output \
  --yes
```

---

## Troubleshooting Installation Issues

### Issue: "Directory not found"

**Error**: `Invalid directory: /path/to/repo`

**Solutions**:
1. Verify the path exists: `ls -la /path/to/repo`
2. Use absolute paths: `--directory /Users/me/projects/bmad-app`
3. Create parent directory first: `mkdir -p ~/projects/bmad-app`

---

### Issue: "Module not found"

**Error**: `Unknown module: lens-work`

**Solutions**:
1. Run interactive installer to see available modules: `npx bmad-method install`
2. Verify version: `npm install -g bmad-method@latest`
3. Check registry: `npm search bmad-method`

---

### Issue: "Permission denied" when writing to directory

**Error**: `EACCES: permission denied`

**Solutions**:
1. Check directory permissions: `ls -ld /path/to/repo`
2. Fix permissions: `chmod u+w /path/to/repo`
3. Try different directory with write access

---

### Issue: Installation hangs or times out

**Solutions**:
1. Kill process: `Ctrl+C`
2. Check network connection: `npm ping`
3. Add debug output: `npx bmad-method install --debug`
4. Try non-interactive mode: `npx bmad-method install --yes`

---

### Issue: Bootstrap workflow doesn't create folder hierarchy

**Symptoms**: Repos cloned to flat `TargetProjects/repo-name` instead of `TargetProjects/DOMAIN/SERVICE/repo-name`

**Root Cause**: For domain-level initiatives, bootstrap must ask for domain/service structure.

**Solutions**:
1. Ensure active initiative is domain-level: `@compass ?` (check status)
2. If creating new initiative, use `#new-domain "Name"` (not feature)
3. When bootstrap prompts "Domain/Service path", enter structure:
   ```
   COLLABORATION/FRONTEND
   ORCHESTRATION/BACKEND
   ```
4. Re-run bootstrap if interrupted: `@scout bootstrap`

---

### Issue: State file errors or conflicts

**Error**: `_bmad-output/lens-work/state.yaml locked or invalid`

**Solutions**:
1. Check state file exists: `cat _bmad-output/lens-work/state.yaml`
2. Kill any running lens-work processes
3. Reset state (backup first): `rm _bmad-output/lens-work/state.yaml`
4. Re-run initiative creation: `#new-domain "Name"`

---

## Validation & Verification

After installation, verify everything is working:

```bash
# 1. Check directory structure
ls -la _bmad/lens-work/

# 2. Verify config was created
cat _bmad/lens-work/config.yaml

# 3. Test agent activation (in Copilot Chat)
@compass help

# 4. Check initial state
cat _bmad-output/lens-work/state.yaml

# 5. Review bootstrap report (after running bootstrap)
cat _bmad-output/lens-work/bootstrap-report.md
```

**Expected Structure**:
```
_bmad/lens-work/
├── agents/           # Compass, Casey, Scout, Tracey agents
├── workflows/        # Router, discovery, utility, core workflows
├── config.yaml       # lens-work configuration
├── module.yaml       # Module manifest
├── service-map.yaml  # Repository service mapping
└── README.md         # Module documentation

_bmad-output/lens-work/
├── state.yaml        # Current initiative state
├── event-log.jsonl   # Lifecycle event log
├── repo-inventory.yaml  # Discovered repositories
└── bootstrap-report.md  # Bootstrap execution report
```

---

## Next Steps After Installation

### 1. Familiarize Yourself with LENS Commands

Learn the core phase routing commands:

- `/pre-plan` — Analysis phase (brainstorm, research, product brief)
- `/spec` — Planning phase (PRD, UX design, architecture)
- `/plan` — Solutioning phase (epics, stories, readiness)
- `/review` — Implementation gate (review, approval)
- `/dev` — Development loop (code, review, retro)

### 2. Create Your First Initiative

```
#new-feature "Your Feature Idea"
```

This creates:
- Unique initiative ID
- Branch topology (base, small, lead lanes)
- Phase 1 branch ready for `/pre-plan`

### 3. Run Through a Phase

```
/pre-plan
```

Compass will guide you through Analysis phase workflows.

### 4. Check Agent Help

Get contextual guidance anytime:

```
/bmad-help I want to understand the current phase
```

---

## Tips & Best Practices

1. **Use Absolute Paths** — In CI/CD and automation, use absolute paths to avoid ambiguity
   ```bash
   npx bmad-method install --directory /opt/app ...  # ✅ Clear
   npx bmad-method install --directory ./app ...     # ❌ Relative to pwd
   ```

2. **Test Flags Locally** — Before deploying to CI/CD, test all flags in interactive mode
   ```bash
   npx bmad-method install  # Try interactively first
   ```

3. **Use Debug Mode** — If you encounter issues, enable diagnostics
   ```bash
   npx bmad-method install --debug
   ```

4. **Run Bootstrap First** — Always complete domain/service bootstrap before creating features
   ```
   #new-domain initialization
   bootstrap
   # Then:
   #new-feature "Your Feature"
   ```

5. **Keep State File** — `_bmad-output/lens-work/state.yaml` is the system of record. Don't manually edit.

6. **Server Environments** — Skip tools/IDEs in production
   ```bash
   npx bmad-method install --tools none ...
   ```

7. **Partial Flags OK** — You can omit flags and let BMAD prompt for missing values interactively

---

## For More Information

- **LENS Workbench README**: `_bmad/lens-work/README.md`
- **BMAD Installation Guide**: `https://github.com/bmad-code-org/BMAD-METHOD/docs/`
- **Non-Interactive Installation**: `https://github.com/bmad-code-org/BMAD-METHOD/blob/main/docs/non-interactive-installation.md`
- **BMAD Method Documentation**: `https://github.com/bmad-code-org/BMAD-METHOD`

---

## Support & Issues

If you encounter problems:

1. **Enable Debug Output**:
   ```bash
   npx bmad-method install --debug
   ```

2. **Check BMAD Logs**:
   ```bash
   cat _bmad-output/lens-work/bootstrap-report.md
   cat _bmad-output/lens-work/event-log.jsonl  # Latest events
   ```

3. **Report to BMAD Project**:
   - Issues: `https://github.com/bmad-code-org/BMAD-METHOD/issues`
   - Discussions: `https://github.com/bmad-code-org/BMAD-METHOD/discussions`

4. **Check State & Recovery**:
   ```bash
   @tracey ST  # Status via Tracey state manager
   @scout rollback {snapshot-id}  # If bootstrap failed
   ```

