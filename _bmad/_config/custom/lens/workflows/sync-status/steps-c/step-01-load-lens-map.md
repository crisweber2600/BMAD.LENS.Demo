---
name: 'step-01-load-lens-map'
description: 'Load lens domain map and service definitions'
nextStepFile: './step-02-scan-target.md'
---

# Step 1: Load Lens Map

## Goal
Load the lens domain map and establish the expected structure. This creates the authoritative "source of truth" that target will be compared against.

## Instructions

### 1. Load and Parse Domain Map
**File:** `{lens_root}/domain-map.yaml`

```yaml
# Expected structure
version: "1.0"
metadata:
  project_name: string
  last_updated: ISO8601
  
domains:
  - name: string
    path: string          # relative path
    service_file: string  # default: service.yaml
```

**Parsing requirements:**
- UTF-8 encoding
- Strict YAML (reject duplicate keys)
- Normalize paths (strip trailing slashes)

### 2. Load Service Definitions
For each domain, load `{lens_root}/{domain.path}/{domain.service_file}`:

```yaml
# Expected structure
domain: string  # must match parent domain.name
services:
  - name: string
    path: string
    microservices:
      - name: string
        path: string
        git_repo: string|null
        branch: string        # default: main
        tech_stack: [string]
        status: active|deprecated|planned
        docs_generated: ISO8601|null   # NEW: track doc freshness
        last_analyzed: ISO8601|null    # NEW: track analysis freshness
```

### 3. Build Expected Structure Map
Construct the structure lens expects to find:

```yaml
lens_map:
  load_timestamp: ISO8601
  source_hash: sha256(all lens files concatenated)
  
  expected_paths:
    # Flat list of all expected paths
    - path: "platform/"
      type: domain
      lens_entry: reference
    - path: "platform/auth/"
      type: service
      lens_entry: reference
    - path: "platform/auth/auth-api/"
      type: microservice
      lens_entry: reference
      expected_git_remote: string|null
      expected_branch: string
  
  domains:
    - name: string
      expected_path: string
      expected_absolute_path: string
      services: [...]
  
  summary:
    total_domains: N
    total_services: N
    total_microservices: N
    with_git_repos: N
    by_status:
      active: N
      deprecated: N
      planned: N
```

### 4. Track Freshness Metadata
For drift detection, note:
- When each microservice was last analyzed
- When docs were last generated
- How this compares to git commit timestamps (to detect stale docs)

```yaml
freshness_context:
  microservices_never_analyzed: [list]
  microservices_docs_stale: [list]  # >30 days since generation
  microservices_analysis_stale: [list]
```

### 5. Validate Internal Consistency
Check lens data for issues:
- **Duplicate names:** Same name at same level
- **Path collisions:** Different items with same resolved path
- **Missing references:** service_file doesn't exist
- **Schema violations:** Required fields missing

```yaml
validation_issues:
  errors: [list]     # blocks sync-status
  warnings: [list]   # informational
```

### 6. Cache Lens Map Hash
Store for comparison on next run:
```yaml
# In _memory/bridge-sidecar/bridge-state.md
lens_map_hash: sha256
lens_map_loaded: ISO8601
```

## Edge Cases and Failure Modes

| Condition | Action |
|-----------|--------|
| domain-map.yaml parse error | FAIL with line/column |
| Service file missing | FAIL: "Missing {path} for domain {name}" |
| Domain name collision | FAIL: "Duplicate domain: {name}" |
| Invalid git URL format | WARN, mark as `git_repo: invalid` |
| Empty domains array | WARN: "No domains defined" |
| All microservices deprecated | WARN: "All services deprecated" |

## Output
```yaml
lens_map:
  load_timestamp: ISO8601
  source_hash: string
  
  expected_paths: [...]
  domains: [...]
  
  summary:
    total_domains: N
    total_services: N
    total_microservices: N
    with_git_repos: N
  
  freshness_context:
    never_analyzed: N
    docs_stale: N
    analysis_stale: N
  
  validation:
    errors: [list]
    warnings: [list]
```
