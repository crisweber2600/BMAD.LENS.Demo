# Bootstrap Workflow - Quick Reference

**Automatic Execution:** First run when `domain-map.yaml` exists but `TargetProjects/` is empty

---

## Integration Flow

```
LENS Startup → Phase 3.1 Detection → Phase 5.5 Bootstrap → Phase 6 Navigator
                     ↓                       ↓
              NEEDS_BOOTSTRAP          User Approval
                                            ↓
                                    Clone Repositories
                                            ↓
                                    Generate Report
```

---

## When Bootstrap Runs

✅ **Automatically triggers when:**
- First run (no session exists)
- `_bmad/lens/domain-map.yaml` exists
- `TargetProjects/` is empty, missing, OR has incomplete git repositories
- Configuration is valid

**Smart Detection:** Even if `TargetProjects/` exists, bootstrap will run if:
- Expected repository directories are missing
- Directories exist but don't have `.git/` folders (not cloned)
- Git repositories exist but on wrong branch

❌ **Does NOT run when:**
- Session exists (not first run) AND all repos are valid
- `TargetProjects/` fully populated with correct git repos and branches
- No domain-map.yaml found
- Configuration validation fails

---

## Required Files

| File | Location | Purpose |
|------|----------|---------|
| `domain-map.yaml` | `_bmad/lens/` | Top-level domain definitions |
| `service.yaml` | `_bmad/{domain}/` | Per-domain service & microservice definitions |

---

## Configuration Template

### domain-map.yaml
```yaml
version: "1.0"
domains:
  - name: "Platform"
    path: "platform"
    service_file: "service.yaml"
```

### service.yaml
```yaml
domain: "Platform"
services:
  - name: "auth-service"
    path: "auth"
    microservices:
      - name: "auth-api"
        path: "auth-api"
        git_repo: "git@github.com:org/auth-api.git"
        branch: "main"
        status: "active"
```

---

## Bootstrap Steps (Automatic)

| Step | Action | User Interaction |
|------|--------|------------------|
| 0 | Preflight validation | None |
| 1 | Load domain map | None |
| 2 | Scan target structure | None |
| 3 | Compare & approve | **Approval Required** |
| 4 | Execute sync & report | None |

---

## User Approval Prompt

```
╭─────────────────────────────────────────╮
│  📋 BOOTSTRAP SYNC PLAN                │
│  • Clone 15 repositories (~2.3 GB)     │
│  • Create folder structure              │
╰─────────────────────────────────────────╯

Proceed with bootstrap? [y/N]: _
```

**Options:**
- `y` - Approve and execute
- `n` - Cancel bootstrap
- `d` - Show detailed plan

---

## Output

**Report:** `docs/bootstrap/bootstrap-report.md`

**Structure Created:**
```
TargetProjects/
└── {domain}/
    └── {service}/
        └── {microservice}/  ← Git repository cloned here
```

---

## Manual Execution

If you want to run bootstrap manually (outside startup):

```bash
# Navigate to workflow
cd _bmad/lens/workflows/bootstrap

# Follow workflow.md instructions
# Start with Step 0 (preflight)
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Config not detected | Check `_bmad/lens/domain-map.yaml` exists |
| Service definition missing | Ensure `_bmad/{domain}/service.yaml` exists |
| Clone fails | Verify SSH keys: `ssh -T git@github.com` |
| Path blocked | All clones must be within `TargetProjects/` |
| Stuck at prompt | Type `y` to approve, `n` to cancel |

---

## Key Features

✅ **Create-Only:** Never deletes existing repositories  
✅ **Safe Paths:** All clones restricted to `TargetProjects/`  
✅ **User Control:** Approval required before any clones  
✅ **Error Recovery:** Partial clones preserved on failure  
✅ **Idempotent:** Safe to re-run (skips existing repos)  

---

## Related Documentation

- [Bootstrap Integration Guide](./docs/bootstrap-integration.md) - Complete documentation
- [bmad.start.prompt.md](../../prompts/bmad.start.prompt.md) - Startup workflow
- [bootstrap.spec.md](./bootstrap.spec.md) - Workflow specification

---

**Last Updated:** 2026-02-02
