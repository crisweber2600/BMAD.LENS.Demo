# LENS Workbench Installation Skill

A GitHub Copilot Agent Skill for installing and configuring LENS Workbench (lens-work) module for BMAD.

## What is This?

This skill enables Copilot to guide you through installing LENS Workbench, a guided lifecycle router that transforms BMAD into an accessible, phase-aware system with automated git-orchestrated discipline.

## Included Files

- **`SKILL.md`** — Complete skill instructions and reference guide for Copilot
  - 5 installation modes (interactive, non-interactive, semi-interactive, quick, and scripted)
  - Post-installation setup and bootstrap process
  - Environment-specific examples (dev, CI/CD, production)
  - Comprehensive troubleshooting guide
  - Next steps and integration documentation

- **`install-lens-work.sh`** — Bash helper script for Unix/macOS/Linux
  - Non-interactive installation wrapper
  - Prerequisite verification (Node.js, npm, Git)
  - Progress indicators and colored output
  - Flexible options: `--auto`, `--team`, `--directory`, `--tools`

- **`install-lens-work.bat`** — Batch helper script for Windows
  - Windows-native installation wrapper
  - Same features as bash version
  - Compatible with Windows Command Prompt

- **`QUICKSTART.md`** — At-a-glance reference
  - Common commands and usage patterns
  - Post-installation checklist
  - Quick troubleshooting matrix
  - Directory structure reference

- **`README.md`** — This file

## How Copilot Uses This Skill

When you ask Copilot about installing lens-work, it will:

1. Load `SKILL.md` into its context
2. Provide guidance based on your specific needs
3. Suggest appropriate installation modes
4. Help troubleshoot if issues arise
5. Point you to relevant scripts and documentation

**Example prompts that trigger this skill:**

```
How do I install lens-work?
I need to set up LENS Workbench for my BMAD project
Show me non-interactive installation commands
I'm getting errors installing lens-work
How do I bootstrap TargetProjects with lens-work?
```

## Quick Start

### With Copilot
Ask in Copilot Chat:
```
@copilot help me install lens-work
```

### With Helper Script (Easiest)
**Mac/Linux:**
```bash
chmod +x install-lens-work.sh
./install-lens-work.sh --auto
```

**Windows:**
```cmd
install-lens-work.bat --auto
```

### Manual Command
```bash
npx bmad-method install \
  --modules bmm,lens-work \
  --tools none \
  --user-name "Team Name" \
  --yes
```

## Installation Modes

| Mode | Use Case | Command |
|------|----------|---------|
| **Interactive** | First-time setup | `npx bmad-method install` |
| **Non-Interactive** | CI/CD, automation | `npx bmad-method install --modules bmm,lens-work --yes` |
| **Semi-Interactive** | Mix of flags + prompts | `npx bmad-method install --modules bmm,lens-work` |
| **Quick** | Testing, defaults | `npx bmad-method install --yes` |
| **Script-Based** | Guided, cross-platform | `./install-lens-work.sh --auto` |

## After Installation

Once installed, you'll have access to:

- **Compass** — Phase router for guided lifecycle management
- **Casey** — Git branch orchestrator
- **Scout** — Repository discovery and bootstrap manager
- **Tracey** — State management and diagnostics

Try:
```
@compass help
```

Then create your first initiative:
```
#new-domain "Your Domain Name"
```

## Troubleshooting

### "Module not found"
Open interactive installer to see available modules:
```bash
npx bmad-method install
```

### "Repos not organized by domain/service"
During bootstrap, when asked for "Domain/Service path", enter the structure:
```
COLLABORATION/FRONTEND
ORCHESTRATION/BACKEND
```

### "State file locked"
Kill any running lens-work processes:
```bash
pkill -f lens-work
rm _bmad-output/lens-work/state.yaml
```

See `SKILL.md` for comprehensive troubleshooting guide.

## Documentation

- **Full Guide**: `SKILL.md` (read this for complete instructions)
- **Quick Reference**: `QUICKSTART.md` (command reference)
- **LENS Workbench Docs**: `_bmad/lens-work/README.md` (after installation)
- **BMAD Method**: https://github.com/bmad-code-org/BMAD-METHOD

## Support

- **Issues**: https://github.com/bmad-code-org/BMAD-METHOD/issues
- **Discussions**: https://github.com/bmad-code-org/BMAD-METHOD/discussions
- **Debug Mode**: `npx bmad-method install --debug`

## About This Skill

**Version**: 1.0  
**License**: MIT  
**Based on**: BMAD Method non-interactive installation, LENS Workbench architecture  
**Compatibility**: Copilot coding agent, Copilot CLI, VS Code Insiders

---

**Next Step**: Ask Copilot in chat or run the helper script!

```bash
./install-lens-work.sh --auto
```

