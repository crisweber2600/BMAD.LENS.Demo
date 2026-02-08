# LENS Workbench Installation Quick Reference

## Installation Commands at a Glance

### Interactive (Default)
```bash
npx bmad-method install
```
Select `lens-work` when prompted. Follow interactive setup.

### Non-Interactive (Standard)
```bash
npx bmad-method install \
  --modules bmm,lens-work \
  --tools none \
  --user-name "Team Name" \
  --yes
```

### Using Helper Script (Mac/Linux)
```bash
chmod +x install-lens-work.sh
./install-lens-work.sh --auto
```

### Using Helper Script (Windows)
```cmd
install-lens-work.bat --auto
```

---

## Post-Installation Checklist

- [ ] Verify lens-work installed: `ls _bmad/lens-work/`
- [ ] Check config created: `cat _bmad/lens-work/config.yaml`
- [ ] Activate Compass: `@compass help` (in ChatGPT/Cursor)
- [ ] Create first initiative: `#new-domain "Name"`
- [ ] Run bootstrap: `bootstrap`
- [ ] Check bootstrap report: `cat _bmad-output/lens-work/bootstrap-report.md`

---

## Key Commands After Installation

| Command | Purpose |
|---------|---------|
| `@compass help` | Start LENS Workbench |
| `#new-domain "Name"` | Create domain initiative |
| `#new-service "Name"` | Create service initiative |
| `#new-feature "Name"` | Create feature initiative |
| `bootstrap` | Initialize TargetProjects |
| `/pre-plan` | Start Analysis phase |
| `/spec` | Start Planning phase |
| `/plan` | Start Solutioning phase |
| `/review` | Implementation gate |
| `/dev` | Development phase |
| `@scout discover` | Inventory repos |
| `@tracey ?` | Check status |

---

## Directory Structure After Installation

```
project-root/
├── _bmad/
│   └── lens-work/           ← Installed here
│       ├── agents/
│       ├── workflows/
│       ├── config.yaml
│       └── module.yaml
├── _bmad-output/
│   └── lens-work/           ← Runtime artifacts
│       ├── state.yaml
│       ├── event-log.jsonl
│       └── bootstrap-report.md
├── TargetProjects/          ← Repos organized here
│   └── {DOMAIN}/{SERVICE}/{REPO}/
└── Docs/                    ← Generated documentation
    └── {domain}/{service}/{repo}/
```

---

## Troubleshooting Quick Links

| Error | Solution |
|-------|----------|
| "Module not found" | Run `npx bmad-method install` (interactive) to see available modules |
| "Directory not found" | Use absolute path: `--directory /Users/you/projects/app` |
| "Permission denied" | Check write permissions: `chmod u+w /path/to/dir` |
| "Node.js not found" | Install Node.js v18+: `brew install node` (Mac) or visit nodejs.org |
| "Repos cloned flat" | Domain initiatives need domain/service path during bootstrap |
| "State file locked" | Kill running processes: `pkill -f lens-work` |

---

## Installation Modes Summary

| Mode | Command | Best For | Interaction |
|------|---------|----------|------------|
| **Interactive** | `npx bmad-method install` | First-time setup, learning | Full prompts |
| **Non-Interactive** | `npx bmad-method install --modules ... --yes` | CI/CD, automation | No prompts |
| **Semi-Interactive** | `npx bmad-method install --modules ... --user-name ...` | Hybrid | Partial prompts |
| **Quick** | `npx bmad-method install --yes` | Testing, defaults | Minimal |
| **Helper Script** | `./install-lens-work.sh --auto` | Easy installation | Guided setup |

---

## Environment Variables (Optional)

You can set environment variables before installation:

```bash
export BMAD_USER="Development Team"
export BMAD_LANG="English"
export BMAD_OUTPUT="_bmad-output"
npx bmad-method install --modules bmm,lens-work --yes
```

---

## For Full Documentation

- **Full Skill Guide**: See `SKILL.md` in this directory
- **LENS Workbench README**: Check `_bmad/lens-work/README.md` after installation
- **BMAD Method Docs**: `https://github.com/bmad-code-org/BMAD-METHOD`
- **Non-Interactive Installation**: `https://github.com/bmad-code-org/BMAD-METHOD/blob/main/docs/non-interactive-installation.md`

---

## Support

Issues? Try these:

1. **Enable debug**: `npx bmad-method install --debug`
2. **Check logs**: `cat _bmad-output/lens-work/bootstrap-report.md`
3. **Reset state**: `rm _bmad-output/lens-work/state.yaml` (backup first!)
4. **Report issue**: `https://github.com/bmad-code-org/BMAD-METHOD/issues`

