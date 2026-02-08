---
name: phase-lifecycle
description: Start and finish phase operations
agent: casey
trigger: Phase transitions via Compass
category: core
auto_triggered: true
---

# Phase Lifecycle Workflows

---

## Start Phase

**Purpose:** Create phase branch from lane when first workflow of phase begins.

### Input

```yaml
phase_number: int          # 1, 2, 3, 4
phase_name: string         # "Analysis", "Planning", "Solutioning", "Implementation"
lane: string               # "small" or "large"
initiative_id: string
```

### Sequence

0. **Verify Git State**
   ```bash
   # Ensure clean working tree in BMAD control repo
   if ! git diff-index --quiet HEAD --; then
     echo "Uncommitted changes detected. Commit or stash before starting a phase."
     exit 1
   fi

   git fetch origin
   ```

1. **Validate Previous Phase**
   ```bash
   if [ ${phase_number} -gt 1 ]; then
     prev_phase="p$((phase_number - 1))"
     # Check all workflows in prev_phase are merged
     if ! all_workflows_merged ${prev_phase}; then
       echo "⚠️ Phase ${prev_phase} not complete. Finish all workflows first."
       exit 1
     fi
   fi
   ```

2. **Create Phase Branch**
   ```bash
   git checkout "lens/${initiative_id}/${lane}"
   git pull origin "lens/${initiative_id}/${lane}"
   git checkout -b "lens/${initiative_id}/${lane}/p${phase_number}"
   git push -u origin "lens/${initiative_id}/${lane}/p${phase_number}"
   ```

3. **Update State**
   ```yaml
   current:
     phase: "p${phase_number}"
     phase_name: "${phase_name}"
   ```

4. **Log Event**
   ```json
   {"ts":"${ISO_TIMESTAMP}","event":"start-phase","phase":"p${phase_number}","lane":"${lane}"}
   ```

5. **Commit Phase Start**
    ```bash
    # Ensure we're on the new phase branch
    git checkout "lens/${initiative_id}/${lane}/p${phase_number}"

    # Stage state + event log
    git add _bmad-output/lens-work/state.yaml _bmad-output/lens-work/event-log.jsonl

    # Commit only if there are changes
    if ! git diff-index --quiet HEAD --; then
       git commit -m "phase(p${phase_number}): Start ${phase_name} (${initiative_id})"
       git push origin "lens/${initiative_id}/${lane}/p${phase_number}"
    else
       echo "No phase-start changes to commit."
    fi
    ```

---

## Finish Phase

**Purpose:** Push phase branch and print PR to lane after all workflows complete.

### Sequence

0. **Verify Git State**
   ```bash
   # Ensure clean working tree in BMAD control repo
   if ! git diff-index --quiet HEAD --; then
     echo "Uncommitted changes detected. Commit or stash before finishing a phase."
     exit 1
   fi

   git fetch origin
   ```

1. **Validate All Workflows Complete**
   ```bash
   if ! all_workflows_merged ${phase}; then
     echo "⚠️ Not all workflows merged. Complete remaining workflows."
     exit 1
   fi
   ```

2. **Push Phase Branch**
   ```bash
   git push origin "lens/${initiative_id}/${lane}/${phase}"
   ```

3. **Generate PR Link**
   ```
   PR: ${remote}/compare/${lane}...${lane}/${phase}
   ```

4. **Log Event**
   ```json
   {"ts":"${ISO_TIMESTAMP}","event":"finish-phase","phase":"${phase}","pr":"${pr_link}"}
   ```

5. **Commit Phase Finish**
   ```bash
   # Ensure we're on the phase branch
   git checkout "lens/${initiative_id}/${lane}/${phase}"

   # Stage state + event log
   git add _bmad-output/lens-work/state.yaml _bmad-output/lens-work/event-log.jsonl

   # Commit only if there are changes
   if ! git diff-index --quiet HEAD --; then
     git commit -m "phase(${phase}): Finish ${initiative_id} phase"
     git push origin "lens/${initiative_id}/${lane}/${phase}"
   else
     echo "No phase-finish changes to commit."
   fi
   ```

6. **Output**
   ```
   ✅ Phase ${phase} complete
   ├── All workflows merged
   ├── PR: ${pr_link}
   └── Ready for next phase
   ```

---

## Open Large Review

**Trigger:** Phase 2 complete + architecture workflow merged

**Purpose:** Open PR from small → large for large review.

```bash
# Validate p2 complete
if phase_complete "p2"; then
  pr_link="${remote}/compare/lead...small"
  echo "🔍 Large Review Ready"
  echo "├── PR: ${pr_link}"
  echo "└── Assign large reviewers"
fi
```

---

## Open Final PBR

**Trigger:** Lead review merged

**Purpose:** Open PR from large → base for final product backlog review.

```bash
# Validate large merged from small
if large_merged_from_small; then
  pr_link="${remote}/compare/base...large"
  echo "📋 Final PBR Ready"
  echo "├── PR: ${pr_link}"
  echo "└── Ready for implementation planning"
fi
```
