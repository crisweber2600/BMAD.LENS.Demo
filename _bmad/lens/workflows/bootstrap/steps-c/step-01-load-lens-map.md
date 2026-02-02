---
name: 'step-01-load-lens-map'
description: 'Load lens domain map and service definitions'
nextStepFile: './step-02-scan-target.md'
---

# Step 1: Load Lens Map

## Goal
Load `domain-map.yaml` and related service definitions to establish the authoritative target structure. Build a complete in-memory representation of the expected domain → service → microservice hierarchy.

## Instructions

### 1. Load Domain Map
**File location:** `{lens_root}/domain-map.yaml`

**Expected structure:**
```yaml
version: "1.0"
metadata:
  project_name: string
  last_updated: ISO8601
  maintainer: string (optional)

domains:
  - name: string                    # e.g., "Platform", "Business"
    description: string (optional)
    path: string                    # relative path, e.g., "platform/"
    service_file: string            # defaults to "service.yaml"
    tags: [string] (optional)       # for filtering/grouping
```

**Parsing procedure:**
1. Read file with UTF-8 encoding
2. Parse YAML with strict mode (reject duplicate keys)
3. Validate required fields exist: `domains`, each domain has `name` and `path`
4. Normalize paths: strip trailing slashes, ensure no leading `/`

### 2. Load Service Definitions Per Domain
For each domain in `domain_map.domains`:

**File location:** `{lens_root}/{domain.path}/{domain.service_file}`

**Expected structure:**
```yaml
domain: string                      # must match parent domain.name
services:
  - name: string                    # e.g., "auth-service"
    description: string (optional)
    path: string                    # relative to domain, e.g., "auth/"
    microservices:
      - name: string                # e.g., "auth-api"
        path: string                # relative to service
        git_repo: string (optional) # full clone URL
        branch: string              # defaults to "main"
        tech_stack: [string]        # e.g., ["typescript", "express"]
        status: active|deprecated|planned
```

**Parsing procedure:**
1. Verify file exists; if missing, record as `missing_service_file` error
2. Parse YAML
3. Validate `domain` field matches expected domain name (case-insensitive)
4. For each service, normalize paths
5. Collect all `git_repo` URLs into `repos_to_clone` list
6. Track status distribution (active vs deprecated vs planned)

### 3. Build In-Memory Map Structure
Construct a nested data structure:

```yaml
lens_map:
  metadata:
    project_name: string
    load_timestamp: ISO8601
    source_files:
      domain_map: path
      service_files: [paths]
  
  domains:
    - name: string
      path: string
      absolute_path: string         # resolved from target_project_root
      services:
        - name: string
          path: string
          absolute_path: string
          microservices:
            - name: string
              path: string
              absolute_path: string
              git_repo: string|null
              branch: string
              tech_stack: [string]
              status: string
  
  summary:
    total_domains: N
    total_services: N
    total_microservices: N
    repos_to_clone: N
    active_count: N
    deprecated_count: N
    planned_count: N
```

### 4. Validate Cross-References
**Check for:**
- Duplicate domain names (FAIL)
- Duplicate service names within a domain (FAIL)
- Duplicate microservice names within a service (FAIL)
- Path collisions (different items resolving to same absolute path) (FAIL)
- Empty domains (services array empty) (WARN)
- Empty services (microservices array empty) (WARN)
- Invalid git URLs (malformed syntax) (WARN, mark for skip)

### 5. Record Load State
Update `_memory/bridge-sidecar/bridge-state.md`:
```yaml
last_lens_map_load: ISO8601
lens_map_hash: sha256(domain-map.yaml + all service.yamls)
domains_loaded: N
services_loaded: N
microservices_loaded: N
```

## Edge Cases and Failure Modes

| Condition | Action |
|-----------|--------|
| domain-map.yaml missing | FAIL: "No domain map found at {expected_path}" |
| service.yaml missing for domain | FAIL: "Missing service file: {path} for domain {name}" |
| YAML parse error | FAIL with line number, column, and snippet |
| Domain name collision | FAIL: "Duplicate domain name: {name}" |
| Path collision | FAIL: "Path collision: {path1} and {path2} resolve to {absolute}" |
| Circular reference (domain refs itself) | FAIL: "Circular reference detected in {domain}" |
| Empty project (0 microservices) | WARN: "No microservices defined - bootstrap will only create folder structure" |
| Git repo URL is relative | WARN: "Relative git URL not supported: {url}, will skip clone" |

## Output
```yaml
lens_map:
  metadata: {...}
  domains: [...]
  summary:
    total_domains: N
    total_services: N
    total_microservices: N
    repos_to_clone: N
    git_urls: [unique URLs]
    
load_errors: [list]
load_warnings: [list]
```
