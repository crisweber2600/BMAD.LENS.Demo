---
name: init-initiative
description: User-facing initiative creation with two-file state architecture
agent: compass
trigger: "/new-domain, /new-service, /new-feature (canonical); #new-* accepted"
category: router
---

# Init Initiative Router

**Purpose:** Accept user input, resolve target repos, delegate git ops to Casey, and write the two-file state architecture for a new initiative.

---

## Input Parameters

```yaml
initiative_name: string    # User-provided name (e.g., "Rate Limiting Feature")
layer: enum                # domain | service | microservice | feature
domain: string | null      # Domain context (required for service/microservice layers)
service: string | null      # Service context (required for microservice layer)
```

---

## Execution Sequence

### 0. Verify Git State (Pre-flight Check)

```bash
# Ensure we're in BMAD control repo
if [ ! -d ".git" ] || [ ! -d "_bmad" ]; then
  error "Must run from BMAD control repo root"
  exit 1
fi

# Ensure clean working directory
if ! git diff-index --quiet HEAD --; then
  error "Uncommitted changes detected. Please commit or stash before creating initiative."
  exit 1
fi

# Sync with remote
git fetch origin main
```

### 1. Gather Initiative Details

```
🧭 New Initiative Setup

Please provide the following details:

**Name:** (descriptive name for this initiative)
**Layer:** [1] Domain  [2] Service  [3] Microservice  [4] Feature

${if layer == "service" || layer == "microservice"}
**Domain:** (parent domain for this ${layer})
${endif}

${if layer == "microservice"}
**Service:** (parent service for this microservice)
${endif}
```

### 1a. Choose Question Mode

```
How would you like to answer phase questions?

**[1] Interactive (chat)** — Current guided flow
**[2] Batch MD** — Single file per phase, filled in one shot

Select mode: [1] or [2]
```

```yaml
question_mode = selection == "2" ? "batch" : "interactive"
```

### 2. Generate Initiative ID

```bash
# Format: {sanitized_name}-{random_6char}
# Example: rate-limit-x7k2m9
initiative_id=$(echo "${initiative_name}" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | sed 's/[^a-z0-9-]//g' | cut -c1-20)-$(openssl rand -hex 3)
```

### 3. Resolve Target Repos

```yaml
service_map = load("{project-root}/_bmad/lens-work/service-map.yaml")

# Resolve based on layer
if layer == "domain":
  # Let user select multiple repos from service map
  prompt: |
    Select target repos for this domain initiative:
    ${for repo in service_map.repos}
    [${index}] ${repo.name}
    ${endfor}
    [A] All repos
  target_repos = selected_repos

elif layer == "service" || layer == "microservice":
  # Single repo selection
  prompt: |
    Select target repo:
    ${for repo in service_map.repos}
    [${index}] ${repo.name}
    ${endfor}
  target_repos = [selected_repo]

elif layer == "feature":
  # Single repo + optional dependencies from service map
  prompt: |
    Select primary repo:
    ${for repo in service_map.repos}
    [${index}] ${repo.name}
    ${endfor}
  target_repos = [selected_repo]
```

### 4. Resolve Domain Prefix

```yaml
# Domain prefix for branch naming
# Determines the {Domain} segment of branch names: {Domain}/{InitiativeId}/{size}-{N}-{workflow}
normalize_domain_prefix(input):
  token = input or ""
  if token contains "/":
    token = token.split("/").last_non_empty()
  token = token.to_lower()
  token = token.replace(/[^a-z0-9-]/g, "-")
  token = token.replace(/-+/g, "-").trim("-")
  return token

selected_repo = find(service_map.repos, repo => repo.name == target_repos[0])

if layer == "domain" || layer == "service" || layer == "microservice":
  # Domain/service flows must resolve from explicit domain input.
  domain_prefix = normalize_domain_prefix(domain)
elif layer == "feature":
  # Feature flows resolve from explicit domain first, then repo metadata.
  domain_prefix = normalize_domain_prefix(domain)
  if domain_prefix == "":
    domain_prefix = normalize_domain_prefix(selected_repo.domain_prefix)
  if domain_prefix == "":
    domain_prefix = normalize_domain_prefix(selected_repo.domain)
  if domain_prefix == "":
    # Expected local_path: TargetProjects/{Org}/{Domain}/{Repo}
    path_parts = split_path(selected_repo.local_path)
    domain_candidate = path_parts[2] or path_parts[1]
    domain_prefix = normalize_domain_prefix(domain_candidate)

if domain_prefix == "":
  error: "Unable to resolve domain prefix for ${initiative_name}. Provide domain or add repo domain metadata to service-map.yaml."
  exit: 1
```

### 4a. Resolve Docs Path (Docs/{Domain}/{Service}/{Repo}/{Feature})

```yaml
normalize_docs_segment(input):
  token = input or ""
  token = token.trim()
  token = token.replace(/[\\/:*?"<>|]/g, "-")
  token = token.replace(/\s+/g, "-")
  token = token.replace(/-+/g, "-").trim("-")
  return token

docs_domain = normalize_docs_segment(domain)
if docs_domain == "":
  docs_domain = normalize_docs_segment(domain_prefix)
if docs_domain == "":
  docs_domain = normalize_docs_segment(selected_repo.domain)

docs_service = normalize_docs_segment(service)
if docs_service == "":
  docs_service = normalize_docs_segment(selected_repo.service)

docs_repo = normalize_docs_segment(selected_repo.name)
docs_feature = normalize_docs_segment(initiative_id)

if layer == "domain":
  docs_service = ""
  docs_repo = ""

docs_segments = [docs_domain, docs_service, docs_repo, docs_feature].filter(seg => seg != "")
docs_path = "docs/" + docs_segments.join("/")
```

### 5. Delegate Branch Creation to Casey

```yaml
# Hand off to Casey for git operations
invoke: casey.init-initiative
params:
  initiative_id: ${initiative_id}
  initiative_name: "${initiative_name}"
  layer: ${layer}
  domain_prefix: ${domain_prefix}
  target_repos: ${target_repos}
  
# Casey creates (ALL pushed immediately to remote):
# - ${domain_prefix}/${initiative_id}/base
# - ${domain_prefix}/${initiative_id}/small
# - ${domain_prefix}/${initiative_id}/large
# - ${domain_prefix}/${initiative_id}/small-1
```

### 6. Write Initiative Config (Git-Committed)

Create directory and file at `{project-root}/_bmad-output/lens-work/initiatives/${initiative_id}.yaml`:

```yaml
id: ${initiative_id}
name: "${initiative_name}"
layer: ${layer}
size: small                    # Size is stored in shared config — canonical for all collaborators
domain: ${domain}
domain_prefix: ${domain_prefix}
service: ${service}
question_mode: ${question_mode}
created_at: "${ISO_TIMESTAMP}"
created_by: ${git_user}
target_repos:
${for repo in target_repos}
  - ${repo}
${endfor}
docs:
  root: "docs"
  domain: "${docs_domain}"
  service: "${docs_service}"
  repo: "${docs_repo}"
  feature: "${docs_feature}"
  path: "${docs_path}"
gates:
  - name: tests-pass
    status: open
blocks: []
branches:
  base: "${domain_prefix}/${initiative_id}/base"
  active: "${domain_prefix}/${initiative_id}/small-1"
```

> **Note:** This file is committed to the repo and shared across collaborators. It holds the canonical initiative definition, configuration, and **size assignment**. Size is always read from this file, never from personal state.

### 7. Write Personal State (Git-Ignored)

Write to `{project-root}/_bmad-output/lens-work/state.yaml`:

```yaml
active_initiative: ${initiative_id}
current:
  phase: p1
  phase_name: "Analysis"
  workflow: null
  workflow_status: pending
```

> **Note:** This file is git-ignored. It tracks the individual user's current position in the initiative. Each collaborator has their own local copy. Lane is NOT stored here — read from initiative config instead.

### 7. Log Event

Append to `{project-root}/_bmad-output/lens-work/event-log.jsonl`:

```json
{"ts":"${ISO_TIMESTAMP}","event":"init-initiative","id":"${initiative_id}","layer":"${layer}","target_repos":${JSON.stringify(target_repos)},"domain":"${domain}","service":"${service}","question_mode":"${question_mode}","docs_path":"${docs_path}"}
```

### 8. Commit Initiative Config

```bash
# Ensure on small-1 branch (phase 1)
git checkout "${domain_prefix}/${initiative_id}/small-1"

# Stage initiative config and event log (NOT state.yaml — it's git-ignored)
git add "_bmad-output/lens-work/initiatives/${initiative_id}.yaml"
git add "_bmad-output/lens-work/event-log.jsonl"

# Create targeted commit
git commit -m "init(${initiative_id}): Create ${layer} initiative '${initiative_name}'

Initiative: ${initiative_id}
Layer: ${layer}
Domain: ${domain}
Lane: small
Target repos: ${target_repos}

Creates:
- Branch topology: base, small, large, small-1
- Initiative config: initiatives/${initiative_id}.yaml (includes size)
- Event log entry

Branch pattern: {Domain}/{InitiativeId}/{size}-{phaseNumber}-{workflow}
State architecture: two-file (personal state + shared initiative config)
Ready for /pre-plan workflow."

# Push to small-1 branch
git push -u origin "${domain_prefix}/${initiative_id}/small-1"
```

### 9. Ensure .gitignore for Personal State

```bash
# Ensure state.yaml is git-ignored (personal state should not be committed)
if ! grep -q "_bmad-output/lens-work/state.yaml" .gitignore 2>/dev/null; then
  echo "_bmad-output/lens-work/state.yaml" >> .gitignore
  git add .gitignore
  git commit -m "chore: gitignore personal lens-work state"
  git push origin "${domain_prefix}/${initiative_id}/small-1"
fi
```

### 10. Return Control to Compass

Output to Compass:

```
✅ Initiative created: ${initiative_id}
├── Name: ${initiative_name}
├── Layer: ${layer}
├── Domain: ${domain}
├── Question mode: ${question_mode}
├── Docs path: ${docs_path}
├── Lane: small (stored in initiative config)
├── Target repos: ${target_repos}
├──
├── Branch Topology:
│   ├── Base: ${domain_prefix}/${initiative_id}/base
│   ├── Small: ${domain_prefix}/${initiative_id}/small
│   ├── Large: ${domain_prefix}/${initiative_id}/large
│   └── Phase: ${domain_prefix}/${initiative_id}/small-1 (committed & pushed)
├──
├── State Architecture:
│   ├── Personal state: _bmad-output/lens-work/state.yaml (git-ignored)
│   └── Initiative config: _bmad-output/lens-work/initiatives/${initiative_id}.yaml (committed, includes size)
├──
└── Ready for /pre-plan

State loading pattern:
  state = load("_bmad-output/lens-work/state.yaml")
  initiative = load("_bmad-output/lens-work/initiatives/${state.active_initiative}.yaml")
  size = initiative.size   # Always read size from initiative config
```

---

## State Architecture Reference

The two-file state architecture separates concerns:

| File | Scope | Git Status | Contents |
|------|-------|------------|----------|
| `state.yaml` | Personal | git-ignored | Active initiative pointer, current phase/workflow position |
| `initiatives/{id}.yaml` | Shared | committed | Initiative definition, **size**, gates, blocks, branches, target repos |

**Loading pattern used by all downstream workflows:**

```yaml
# Step 1: Load personal state to find active initiative
state = load("_bmad-output/lens-work/state.yaml")

# Step 2: Load initiative config using the active_initiative pointer
initiative = load("_bmad-output/lens-work/initiatives/${state.active_initiative}.yaml")

# Step 3: Use both for workflow logic
current_phase = state.current.phase
initiative_layer = initiative.layer
size = initiative.size           # ALWAYS read size from shared initiative config
target_repos = initiative.target_repos
gates = initiative.gates
domain_prefix = initiative.domain_prefix
```

---

## Error Handling

| Error | Recovery |
|-------|----------|
| Branch already exists | Prompt: "Initiative ID collision. Regenerate?" |
| Push failed | Check remote connectivity, retry with backoff |
| Service map not found | Error: "service-map.yaml missing. Run bootstrap first." |
| initiatives/ dir creation failed | Ensure _bmad-output/lens-work/ exists and is writable |
| Casey delegation failed | Output Casey error, allow retry |
| state.yaml already exists | Warn: "Active initiative found. Switch or archive first." |

---

## Post-Conditions

- [ ] Initiative ID generated and unique
- [ ] All 4 branches created and pushed (via Casey)
- [ ] `initiatives/{id}.yaml` created and committed
- [ ] `state.yaml` written locally (git-ignored)
- [ ] `.gitignore` updated for `state.yaml`
- [ ] `event-log.jsonl` entry appended and committed
- [ ] Control returned to Compass for /pre-plan routing
