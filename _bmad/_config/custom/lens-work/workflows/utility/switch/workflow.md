---
name: switch
description: "Interactive context switcher with branch checkout and state sync"
agent: compass
trigger: "/switch via Compass"
category: utility
---

# Switch Context Workflow

**Purpose:** Interactively switch between initiatives, lenses (domain/service/microservice/feature), phases (P0–P4), and sizes (small/medium/large), with branch checkout and state synchronization.

---

## Input Parameters

```yaml
sub_command: enum | null   # initiative | lens | phase | size — if omitted, show interactive menu
target: string | null      # Optional direct target (initiative id, phase number, size name, etc.)
```

---

## Execution Sequence

### Step 0: Git Discipline — Pre-flight Check

```bash
# Ensure we're in BMAD control repo
if [ ! -d ".git" ] || [ ! -d "_bmad" ]; then
  error "Must run from BMAD control repo root"
  exit 1
fi

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
  echo "⚠️  Uncommitted changes detected."
  echo ""
  echo "Options:"
  echo "  [1] Stash changes and continue"
  echo "  [2] Abort switch"
  echo ""
  read -p "Choice: " stash_choice

  case "$stash_choice" in
    1)
      stash_label="lens-work/switch/$(date +%Y%m%dT%H%M%S)"
      git stash push -m "$stash_label"
      echo "✅ Changes stashed as: $stash_label"
      stashed=true
      ;;
    2|*)
      echo "❌ Switch aborted. Commit or stash changes first."
      exit 1
      ;;
  esac
fi

# Sync with remote
git fetch origin
```

---

### Step 1: Load Current Context

```yaml
# Load personal state
state = load("_bmad-output/lens-work/state.yaml")

if state == null:
  output: |
    📍 No active context found.
    
    No lens-work state exists yet.
    
    To get started:
    └── Run /new-domain, /new-service, or /new-feature to create an initiative
  exit: 0

# Load active initiative config (two-file architecture)
if state.active_initiative != null:
  initiative = load("_bmad-output/lens-work/initiatives/${state.active_initiative}.yaml")
  if initiative == null:
    error: "Initiative config not found: initiatives/${state.active_initiative}.yaml"
    hint: "Run @tracey migrate or check initiatives/ directory."
    exit: 1
else if state.initiative != null:
  # Legacy single-file format
  initiative = state.initiative
  legacy_warning: true
else:
  output: |
    📍 No active initiative in state.
    
    To start:
    └── Run /new-domain, /new-service, or /new-feature
  exit: 0

# Capture current position
current_branch = exec("git branch --show-current")
current_phase = state.current.phase or "unknown"
current_phase_name = state.current.phase_name or "Unknown"
current_size = initiative.size or "unknown"       # Size from shared initiative config
current_layer = initiative.layer or "unknown"

# Resolve domain prefix without hardcoding lens defaults.
normalize_domain_prefix(input):
  token = input or ""
  if token contains "/":
    token = token.split("/").last_non_empty()
  token = token.to_lower()
  token = token.replace(/[^a-z0-9-]/g, "-")
  token = token.replace(/-+/g, "-").trim("-")
  return token

domain_prefix = normalize_domain_prefix(initiative.domain_prefix)

if domain_prefix == "":
  domain_prefix = normalize_domain_prefix(initiative.domain)

if domain_prefix == "":
  parsed = parse_branch(current_branch)  # {domain_prefix}/{initiative_id}/{segment}
  domain_prefix = normalize_domain_prefix(parsed.domain_prefix)

if domain_prefix == "":
  error: "Cannot resolve domain prefix for initiative ${initiative.id}. Set initiatives/${initiative.id}.yaml:domain_prefix."
  exit: 1

# Display current position summary
output: |
  📍 Current Context
  ├── Initiative: ${initiative.name} (${initiative.id})
  ├── Layer: ${current_layer}
  ├── Phase: ${current_phase} (${current_phase_name})
  ├── Size: ${current_size}
  └── Branch: ${current_branch}
  ${if legacy_warning}
  ⚠️  Legacy state format detected. Consider running @tracey migrate.
  ${endif}
```

---

### Step 2: Interactive Selection Menu

**Condition:** Only shown if `sub_command` is null (no argument provided).

```yaml
if sub_command == null:
  output: |
    🧭 Switch Context
    ├── [1] Switch Initiative (change active initiative)
    ├── [2] Switch Lens (domain/service/microservice/feature)
    ├── [3] Switch Phase (P0-P4)
    ├── [4] Switch Size (small/medium/large)
    └── [0] Cancel
  
  read: menu_choice

  route:
    "1": goto Step 3 (Switch Initiative)
    "2": goto Step 4 (Switch Lens)
    "3": goto Step 5 (Switch Phase)
    "4": goto Step 6 (Switch Size)
    "0": |
      output: "Cancelled. No changes made."
      exit: 0
    default: |
      output: "Invalid choice. Please select 0-4."
      goto Step 2

else:
  route:
    "initiative": goto Step 3
    "lens": goto Step 4
    "phase": goto Step 5
    "size": goto Step 6
    default: |
      output: "Unknown sub-command: ${sub_command}. Use: initiative | lens | phase | size"

      exit: 1
```

---

### Step 3: Switch Initiative

```yaml
# List all initiative configs
initiative_dir = "_bmad-output/lens-work/initiatives/"

if not dir_exists(initiative_dir):
  output: |
    ❌ No initiatives directory found.
    └── Run /new-domain, /new-service, or /new-feature to create your first initiative.
  exit: 1

initiative_files = list_files(initiative_dir, "*.yaml")

if initiative_files.length == 0:
  output: |
    ❌ No initiative configs found in ${initiative_dir}
    └── Run /new-domain, /new-service, or /new-feature to create an initiative.
  exit: 1

if initiative_files.length == 1 AND initiative_files[0].id == initiative.id:
  output: |
    ℹ️  Only one initiative exists, and it's already active.
    └── ${initiative.name} (${initiative.id})
  exit: 0

# Parse each initiative file
initiatives = []
for file in initiative_files:
  init_config = load(file)
  initiatives.append({
    id: init_config.id,
    name: init_config.name,
    layer: init_config.layer,
    phase: init_config.current_phase or "unknown",
    active_branch: init_config.branches.active or "unknown",
    is_current: init_config.id == initiative.id
  })

# Display numbered list
output: |
  🔄 Available Initiatives
  ═══════════════════════════════════════════════════
  ${for i, init in enumerate(initiatives)}
  ${init.is_current ? "▶" : " "} [${i+1}] ${init.name}
       ID: ${init.id}
       Layer: ${init.layer} | Phase: ${init.phase}
       Branch: ${init.active_branch}
  ${endfor}
  ═══════════════════════════════════════════════════
  [0] Cancel

read: init_choice

if init_choice == "0" or init_choice == null:
  output: "Cancelled. Initiative unchanged."
  exit: 0

selected = initiatives[int(init_choice) - 1]

if selected.id == initiative.id:
  output: "Already on this initiative. No change needed."
  exit: 0

# Casey: checkout the selected initiative's active branch
output: "🔀 Switching to initiative: ${selected.name}..."
```

```bash
# Casey integration: branch-status check
target_branch="${selected.active_branch}"

# Fetch latest
git fetch origin

# Check if branch exists locally
if git show-ref --verify --quiet "refs/heads/${target_branch}"; then
  # Branch exists locally — checkout and pull
  git checkout "${target_branch}"
  git pull origin "${target_branch}"
else
  # Branch exists only on remote — fetch and checkout
  if git show-ref --verify --quiet "refs/remotes/origin/${target_branch}"; then
    git checkout -b "${target_branch}" "origin/${target_branch}"
  else
    error "Branch '${target_branch}' not found locally or on remote."
    echo "Available branches for this initiative:"
    git branch -a | grep "${selected.id}/"
    exit 1
  fi
fi
```

```yaml
# Update state.yaml with new active initiative
state.active_initiative = selected.id
state.current.phase = selected.phase
state.current.workflow = null
state.current.workflow_status = null

# Note: size is read from initiative config, NOT stored in personal state

# Continue to Step 7 for state sync
goto: Step 7
```

---

### Step 4: Switch Lens

```yaml
# Change the layer/lens focus within current initiative
output: |
  🔍 Switch Lens — Current: ${current_layer}
  
  Available layers:
  ├── [1] Domain   — Full domain scope (all repos)
  ├── [2] Service  — Single service focus
  ├── [3] Microservice — Sub-service component
  ├── [4] Feature  — Feature-level scope
  └── [0] Cancel

read: lens_choice

lens_map:
  "1": "domain"
  "2": "service"
  "3": "microservice"
  "4": "feature"

if lens_choice == "0" or lens_choice == null:
  output: "Cancelled. Lens unchanged."
  exit: 0

new_layer = lens_map[lens_choice]

if new_layer == null:
  output: "Invalid choice. Please select 0-4."
  goto: Step 4

if new_layer == current_layer:
  output: "Already on ${current_layer} lens. No change needed."
  exit: 0

# Validate lens change is compatible with initiative
if new_layer == "domain" AND initiative.target_repos.length <= 1:
  output: |
    ⚠️  Cannot switch to domain lens — initiative has only one target repo.
    └── Domain lens requires multiple repos. Consider creating a /new-domain initiative.
  exit: 1

# Prompt for scope specifics based on new layer
if new_layer == "service":
  # Show available services from service map or initiative repos
  output: "Select target service repo:"
  for i, repo in enumerate(initiative.target_repos):
    output: "  [${i+1}] ${repo}"
  read: service_choice
  selected_repo = initiative.target_repos[int(service_choice) - 1]

if new_layer == "feature":
  # Prompt for feature scope
  output: "Feature name or scope (will be used for branch naming):"
  read: feature_scope

# Update initiative config with new lens
initiative.layer = new_layer
if selected_repo:
  initiative.active_target_repo = selected_repo
if feature_scope:
  initiative.feature_scope = feature_scope

output: "✅ Lens switched: ${current_layer} → ${new_layer}"

# Continue to Step 7 for state sync
goto: Step 7
```

---

### Step 5: Switch Phase

```yaml
# Show available phases with current position
phase_map = {
  "0": { code: "p0", name: "Pre-Plan",       description: "Discovery & initial analysis" },
  "1": { code: "p1", name: "Analysis",        description: "Deep analysis & product brief" },
  "2": { code: "p2", name: "Planning",        description: "PRD & UX design" },
  "3": { code: "p3", name: "Solutioning",     description: "Architecture & epics/stories" },
  "4": { code: "p4", name: "Implementation",  description: "Sprint planning & development" }
}

current_phase_num = extract_phase_number(current_phase)

output: |
  📐 Switch Phase — Current: ${current_phase} (${current_phase_name})
  
  Available phases:
  ${for num, phase in phase_map}
  ${num == current_phase_num ? "▶" : " "} [${num}] P${num} — ${phase.name}
       ${phase.description}
  ${endfor}
  
  ⚠️  Switching phase will create/checkout the phase branch.
  
  [C] Cancel

read: phase_choice

if phase_choice == "C" or phase_choice == "c" or phase_choice == null:
  output: "Cancelled. Phase unchanged."
  exit: 0

selected_phase = phase_map[phase_choice]

if selected_phase == null:
  output: "Invalid choice. Please select 0-4 or C to cancel."
  goto: Step 5

if phase_choice == current_phase_num:
  output: "Already on P${phase_choice} (${selected_phase.name}). No change needed."
  exit: 0

# Determine target branch for selected phase
# New branch pattern: {Domain}/{InitiativeId}/{size}-{phaseNumber}
target_branch = "${domain_prefix}/${initiative.id}/${current_size}-${phase_choice}"

output: "🔀 Switching to phase P${phase_choice} (${selected_phase.name})..."
```

```bash
# Casey integration: checkout-branch or create-branch-if-missing
target_branch="${target_branch}"

git fetch origin

# Check if branch exists locally
if git show-ref --verify --quiet "refs/heads/${target_branch}"; then
  git checkout "${target_branch}"
  git pull origin "${target_branch}"

# Check if branch exists on remote
elif git show-ref --verify --quiet "refs/remotes/origin/${target_branch}"; then
  git checkout -b "${target_branch}" "origin/${target_branch}"

else
  # Branch doesn't exist — create it from current size branch
  echo "Branch '${target_branch}' does not exist. Creating..."
  
  size_branch="${domain_prefix}/${initiative_id}/${current_size}"
  
  # Ensure size branch exists
  if git show-ref --verify --quiet "refs/heads/${size_branch}"; then
    git checkout "${size_branch}"
  elif git show-ref --verify --quiet "refs/remotes/origin/${size_branch}"; then
    git checkout -b "${size_branch}" "origin/${size_branch}"
  else
    echo "Error: Size branch '${size_branch}' not found."
    exit 1
  fi
  
  git checkout -b "${target_branch}"
  git push -u origin "${target_branch}"
  echo "✅ Created and pushed: ${target_branch}"
fi
```

```yaml
# Update state with new phase
state.current.phase = "P${phase_choice}"
state.current.phase_name = selected_phase.name
state.current.workflow = null
state.current.workflow_status = null

# Update initiative config
initiative.current_phase = "P${phase_choice}"
initiative.branches.active = target_branch

output: "✅ Phase switched: ${current_phase} → P${phase_choice} (${selected_phase.name})"

# Continue to Step 7 for state sync
goto: Step 7
```

---

### Step 6: Switch Size

```yaml
# Available sizes
size_map = {
  "1": { code: "small",  description: "Small team — planning & development track" },
  "2": { code: "medium", description: "Medium team — multi-track coordination" },
  "3": { code: "large",  description: "Large team — review & governance" }
}

output: |
  🛤️  Switch Size — Current: ${current_size}
  
  Available sizes:
  ${for num, size in size_map}
  ${num == current_size_idx ? "▶" : " "} [${num}] ${size.code}
       ${size.description}
  ${endfor}
  
  ⚠️  Switching size will create/checkout the size branch.
  
  [C] Cancel

read: size_choice

if size_choice == "C" or size_choice == "c" or size_choice == null:
  output: "Cancelled. Size unchanged."
  exit: 0

selected_size = size_map[size_choice]

if selected_size == null:
  output: "Invalid choice. Please select 1-3 or C to cancel."
  goto: Step 6

if selected_size.code == current_size:
  output: "Already on ${current_size} size. No change needed."
  exit: 0

# Determine target branch for selected size
# New branch pattern: {Domain}/{InitiativeId}/{size}
size_branch = "${domain_prefix}/${initiative.id}/${selected_size.code}"

# If currently on a phase branch, also create the phase branch under the new size
current_phase_num = extract_phase_number(current_phase)
if current_phase_num != null:
  phase_branch = "${domain_prefix}/${initiative.id}/${selected_size.code}-${current_phase_num}"
  target_branch = phase_branch
else:
  target_branch = size_branch

output: "🔀 Switching to ${selected_size.code} size..."
```

```bash
# Casey integration: checkout-branch or create-branch
target_branch="${target_branch}"
size_branch="${size_branch}"

git fetch origin

# First ensure size branch exists
if git show-ref --verify --quiet "refs/heads/${size_branch}"; then
  : # size branch exists locally
elif git show-ref --verify --quiet "refs/remotes/origin/${size_branch}"; then
  git checkout -b "${size_branch}" "origin/${size_branch}"
  git checkout -  # go back, we'll checkout target below
else
  # Create size branch from base
  base_branch="${domain_prefix}/${initiative_id}/base"
  if git show-ref --verify --quiet "refs/heads/${base_branch}"; then
    git checkout "${base_branch}"
  elif git show-ref --verify --quiet "refs/remotes/origin/${base_branch}"; then
    git checkout -b "${base_branch}" "origin/${base_branch}"
  else
    echo "Error: Base branch '${base_branch}' not found."
    exit 1
  fi
  git checkout -b "${size_branch}"
  git push -u origin "${size_branch}"
  echo "✅ Created size branch: ${size_branch}"
fi

# Now checkout the target branch (size or size+phase)
if [ "${target_branch}" != "${size_branch}" ]; then
  # Need a phase branch under the new size
  if git show-ref --verify --quiet "refs/heads/${target_branch}"; then
    git checkout "${target_branch}"
    git pull origin "${target_branch}"
  elif git show-ref --verify --quiet "refs/remotes/origin/${target_branch}"; then
    git checkout -b "${target_branch}" "origin/${target_branch}"
  else
    # Create phase branch from size branch
    git checkout "${size_branch}"
    git checkout -b "${target_branch}"
    git push -u origin "${target_branch}"
    echo "✅ Created phase branch: ${target_branch}"
  fi
else
  git checkout "${size_branch}"
  git pull origin "${size_branch}" 2>/dev/null || true
fi
```

```yaml
# Update size in initiative config (stored in shared config, not personal state)
initiative.size = selected_size.code

# Update initiative config
initiative.branches.active = target_branch

output: "✅ Size switched: ${current_size} → ${selected_size.code}"

# Continue to Step 7 for state sync
goto: Step 7
```

---

### Step 7: State Sync

```yaml
# Persist state changes
# Update personal state
state.last_switch = {
  timestamp: now_iso(),
  from: {
    initiative: previous_initiative_id or initiative.id,
    phase: previous_phase or current_phase,
    size: previous_size or current_size,
    branch: previous_branch or current_branch
  },
  to: {
    initiative: state.active_initiative or initiative.id,
    phase: state.current.phase,
      size: initiative.size,
    branch: exec("git branch --show-current")
  }
}

save(state, "_bmad-output/lens-work/state.yaml")

# Update initiative config if changed
if initiative_modified:
  if state.active_initiative != null:
    save(initiative, "_bmad-output/lens-work/initiatives/${initiative.id}.yaml")

# Append switch event to event log
event = {
  ts: now_iso(),
  event: "context_switch",
  agent: "compass",
  workflow: "switch",
  details: {
    type: sub_command or menu_choice_label,
    from: state.last_switch.from,
    to: state.last_switch.to
  }
}

append_jsonl(event, "_bmad-output/lens-work/event-log.jsonl")
```

```bash
# Stage and commit state changes
git add _bmad-output/lens-work/state.yaml \
  _bmad-output/lens-work/event-log.jsonl

# Also stage initiative config if modified
if [ -f "_bmad-output/lens-work/initiatives/${initiative_id}.yaml" ]; then
  git add "_bmad-output/lens-work/initiatives/${initiative_id}.yaml"
fi

# Commit only if there are staged changes
if ! git diff --cached --quiet; then
  current_branch=$(git branch --show-current)
  git commit -m "utility(switch): Switch context — ${sub_command_label}"
  git push origin "${current_branch}"
else
  echo "No state changes to commit."
fi
```

---

### Step 8: Confirmation

```yaml
# Determine next suggested command based on new position
phase_commands = {
  "P0": "/pre-plan",
  "P1": "/pre-plan or /spec",
  "P2": "/spec or /plan",
  "P3": "/plan or /review",
  "P4": "/dev"
}

new_branch = exec("git branch --show-current")
next_command = phase_commands[state.current.phase] or "/status"

output: |
  ✅ Context switched
  ├── Initiative: ${initiative.name} (${initiative.id})
  ├── Lens: ${initiative.layer}
  ├── Phase: ${state.current.phase} (${state.current.phase_name})
  ├── Size: ${initiative.size}
  ├── Branch: ${new_branch}
  └── Ready for: ${next_command}
  
  ${if stashed}
  💡 You have stashed changes from the previous branch.
  └── To restore: git stash pop
  ${endif}
```

---

## Error Handling

| Error | Recovery |
|-------|----------|
| Uncommitted changes | Offer stash or abort |
| State file missing | Prompt to create initiative |
| Initiative config not found | Suggest @tracey migrate or check initiatives/ |
| Branch not found locally | Attempt fetch from remote |
| Branch not found on remote | Create from parent (size or base branch) |
| Size branch missing | Create from base branch |
| Phase branch missing | Create from size branch |
| Git fetch/push failure | Check remote connectivity, retry |
| Invalid menu selection | Re-display menu with guidance |
| Legacy state format | Warn and suggest @tracey migrate |

---

## Post-Conditions

- [ ] state.yaml updated with new position (initiative, phase, size)
- [ ] Initiative config updated if layer/lens changed
- [ ] Git branch checked out matching new position
- [ ] event-log.jsonl entry appended for switch event
- [ ] State changes committed and pushed
- [ ] Stash created if dirty working directory was detected
- [ ] Confirmation displayed with next suggested command
