# API Reference

This reference documents Git-Lens runtime data formats and integration touchpoints used by workflows and hooks.

---

## Storage Locations

Git-Lens stores state and event logs under the configured `state_folder`.

**Default:**
- `{output_folder}/git-lens`

**Files:**
- `state.yaml` — current initiative state
- `event-log.jsonl` — append-only event log for recovery/audit

---

## `state.yaml` (Recommended Schema)

> This schema is the current recommended shape used by workflows. Fields may evolve, but these keys are the stable contract for Git-Lens workflows and diagnostics.

```yaml
version: 1
initiative:
  name: "payment-gateway"
  slug: "pmt-gateway-a3f2b9"
  created_at: "2026-02-01T00:00:00Z"
  base_ref: "main"
  remote_name: "origin"

config:
  auto_push: true
  fetch_strategy: "background"
  fetch_ttl: 60
  commit_strategy: "prompt"
  validation_cascade: "ancestry_only"
  pr_api_enabled: false

current:
  lane: "small"
  phase: "p1"
  workflow: "discovery"
  status: "in_progress" # in_progress | blocked | complete | archived

blocked:
  is_blocked: false
  reason: null
  workflow: null
  phase: null
  required_action: null

branches:
  base: "lens/pmt-gateway-a3f2b9/base"
  lanes:
    small: "lens/pmt-gateway-a3f2b9/small"
    lead: "lens/pmt-gateway-a3f2b9/lead"
  phases:
    p1: "lens/pmt-gateway-a3f2b9/small/p1"
    p2: "lens/pmt-gateway-a3f2b9/small/p2"
  workflows:
    p1:
      discovery: "lens/pmt-gateway-a3f2b9/small/p1/w/discovery"
      requirements: "lens/pmt-gateway-a3f2b9/small/p1/w/requirements"

workflow_status:
  p1:
    - name: "discovery"
      branch: "lens/pmt-gateway-a3f2b9/small/p1/w/discovery"
      status: "merged" # in_progress | merged | blocked
      pr_url: null
      merged_at: "2026-02-01T00:20:00Z"
    - name: "requirements"
      branch: "lens/pmt-gateway-a3f2b9/small/p1/w/requirements"
      status: "in_progress"
      pr_url: null
      merged_at: null

phase_status:
  p1:
    status: "in_progress" # in_progress | complete
    pr_url: null
    merged_at: null

reviews:
  lead_review:
    status: "pending" # pending | merged
    pr_url: null
    merged_at: null
  final_review:
    status: "pending" # pending | merged
    pr_url: null
    merged_at: null

last_event:
  id: "evt-000123"
  timestamp: "2026-02-01T00:20:00Z"
```

**Notes:**
- `current.status = blocked` must be accompanied by `blocked.is_blocked = true` and a reason.
- `workflow_status` is ordered by merge time to infer previous workflow gating.
- `branches` provides a canonical map for reconstruction and recovery.

---

## `event-log.jsonl` (Event Format)

Each line is a JSON object. The file is append-only.

**Minimal Fields:**
- `id` — unique event id (e.g., `evt-000123`)
- `timestamp` — ISO 8601 UTC
- `event` — event type
- `initiative` — initiative slug
- `lane` / `phase` / `workflow` — context (nullable)
- `details` — free-form object for additional metadata

**Example:**
```json
{"id":"evt-000123","timestamp":"2026-02-01T00:20:00Z","event":"finish-workflow","initiative":"pmt-gateway-a3f2b9","lane":"small","phase":"p1","workflow":"discovery","details":{"pr_url":null,"branch":"lens/pmt-gateway-a3f2b9/small/p1/w/discovery"}}
```

**Common Event Types:**
- `init-initiative`
- `start-workflow`
- `finish-workflow`
- `start-phase`
- `finish-phase`
- `open-lead-review`
- `open-final-pbr`
- `override`
- `sync`
- `fix-state`
- `recreate-branches`
- `archive`

---

## Validation + Blocking Contract

When merge validation fails:
- Set `blocked.is_blocked = true`
- Set `current.status = blocked`
- Populate `blocked.reason`, `blocked.workflow`, and `blocked.phase`
- Write state immediately, then append an `override` or `blocked` event

Overrides must:
- Record `override_reason`
- Clear `blocked.*`
- Set `current.status = in_progress`
- Append an `override` event with reason

---

## Compass Integration

Git-Lens can suggest reviewers by role from a Compass roster file.

**Module Config:**
- `compass_enabled` (boolean)
- `compass_roster_file` (CSV or YAML file path)

**Roster Format (CSV):**
```csv
username,role,initiative
alice,implementer,pmt-gateway-a3f2b9
bob,tech-lead,pmt-gateway-a3f2b9
cora,architect,pmt-gateway-a3f2b9
dana,pm,pmt-gateway-a3f2b9
```

**Roster Format (YAML):**
```yaml
- username: alice
  role: implementer
  initiative: pmt-gateway-a3f2b9
- username: bob
  role: tech-lead
  initiative: pmt-gateway-a3f2b9
```

**Fallbacks:**
If no roster file is configured or found, Git-Lens falls back to:
- `{project-root}/_bmad/lens/extensions/git-lens/test-data/mock-compass.csv`
- `{project-root}/src/modules/lens/extensions/git-lens/test-data/mock-compass.csv`

---

## Branch Naming Pattern

```
lens/<initiative>/<lane>/<phase>/w/<workflow>
```

Examples:
- `lens/pmt-gateway-a3f2b9/base`
- `lens/pmt-gateway-a3f2b9/small/p1`
- `lens/pmt-gateway-a3f2b9/small/p1/w/discovery`
