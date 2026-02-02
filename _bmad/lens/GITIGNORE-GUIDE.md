# LENS .gitignore Verification Helper

This file describes the .gitignore requirements and verification steps for LENS system file protection.

## Why .gitignore is Critical

LENS system files contain:
- **Session state** (`_bmad/lens/lens-session.yaml`) - Current user's navigation context
- **Sidecar memories** (`_bmad/_memory/**`) - Discovery index, git event log, personal state
- **Personal profiles** (`_bmad-output/personal/`) - User-specific role and workflow preferences
- **Generated artifacts** (`_bmad-output/implementation-artifacts/`) - Temporary discovery output

**These files are NEVER meant to be committed.** Each user has their own state, and committing them causes:
- Conflicts when multiple developers work on the same repo
- Loss of other users' navigation context
- Leakage of personal workflow preferences
- Large commits with machine-generated discovery data

## .gitignore Template Location

The LENS .gitignore template is located at:
```
_bmad/lens/.gitignore.template
```

## Verification Steps

### During Initial Setup (Phase 5.6)

1. **Check .gitignore exists**: Verify `.gitignore` in project root
2. **Merge patterns**: If `.gitignore` already exists, merge patterns from `.gitignore.template`
3. **Verify patterns**: Ensure all LENS system files are protected:
   ```
   _bmad/_memory/**/*.md
   _bmad/_memory/**/*.jsonl
   _bmad/_memory/**/*.json
   _bmad/lens/lens-session.yaml
   _bmad-output/personal/
   _bmad-output/implementation-artifacts/
   ```
4. **Commit**: Run `git add .gitignore && git commit -m "chore: add LENS system file protection to gitignore"`

### During Discovery (Step-00 Preflight)

1. Check if `.gitignore` exists
2. Verify LENS protection patterns are present
3. If missing: Display warning with instructions to update and commit

### After Discovery (Step-05 Completion)

1. Remind user to verify no LENS system files are in git staging
2. Suggest: `git status` to check
3. If any `_bmad/_memory/`, `_bmad/lens/lens-session.yaml`, or `_bmad-output/personal/` files appear, user must:
   - Update `.gitignore` with missing patterns
   - Run `git rm --cached {files}` to remove from staging
   - Commit changes

## Git Commands for Management

### Check what's currently staged
```bash
git status
```

### Remove accidentally staged LENS files (without deleting local files)
```bash
git rm --cached _bmad/_memory/scout-sidecar/scout-discoveries.md
git rm --cached _bmad/lens/lens-session.yaml
git commit -m "chore: remove LENS system files from git tracking"
```

### Check entire git history for LENS files (to see if they were ever committed)
```bash
git log --all --full-history -- "_bmad/_memory/" | head -20
git log --all --full-history -- "_bmad/lens/lens-session.yaml" | head -20
```

### Force .gitignore to take effect (re-scan)
```bash
git rm -r --cached .
git add .
git commit -m "chore: apply .gitignore to all tracked files"
```

## Troubleshooting

### Problem: "LENS system files keep appearing in git status"

**Solution 1: Ensure .gitignore is correct**
```bash
cat .gitignore | grep "_bmad/_memory"
cat .gitignore | grep "_bmad-output/personal"
```

**Solution 2: Verify file was never committed**
```bash
git log --all --full-history -- "_bmad/_memory/scout-sidecar/scout-discoveries.md"
# If output is empty, file was never committed - just remove from staging
git rm --cached _bmad/_memory/scout-sidecar/scout-discoveries.md
```

### Problem: ".gitignore itself is too large or has conflicts"

**Solution: Use `.gitignore.template` as reference**
```bash
# Restore from template (this overwrites - be careful!)
cp _bmad/lens/.gitignore.template .gitignore

# Or selectively merge
cat _bmad/lens/.gitignore.template >> .gitignore
# Then remove duplicates and test
```

### Problem: "Some developers' personal profiles got committed"

**Solution: Clean history (use with caution)**
```bash
# Find all commits with personal profiles
git log --all --name-status -- "_bmad-output/personal/" | head -50

# Remove from history (requires force push to shared branch - coordinate with team)
git filter-branch --tree-filter 'rm -rf _bmad-output/personal/' -- --all
```

## Best Practices

1. **Verify before each commit**: `git status` should never show `_bmad/_memory/`, `_bmad/lens/lens-session.yaml`, or `_bmad-output/personal/`

2. **Use pre-commit hooks** (optional): Add a git hook to prevent commits with LENS files:
   ```bash
   # .git/hooks/pre-commit
   git diff --cached --name-only | grep -E "_bmad/_memory|lens-session.yaml|_bmad-output/personal" && {
     echo "Error: Cannot commit LENS system files. Update .gitignore."
     exit 1
   }
   ```

3. **Educate team**: Ensure all developers understand:
   - LENS is a personal context tool
   - Never commit `_bmad/_memory/` or personal files
   - If accidentally committed, remove immediately with `git rm --cached`

4. **Monitor CI/CD**: Check build logs to ensure no LENS files are being packaged
