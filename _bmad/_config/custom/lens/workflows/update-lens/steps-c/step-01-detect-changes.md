---
name: 'step-01-detect-changes'
description: 'Identify changed microservices and docs'
nextStepFile: './step-02-aggregate.md'
---

# Step 1: Detect Changes

## Goal
Identify updated documentation or microservices requiring propagation to higher levels. Use multiple detection strategies to ensure comprehensive change capture.

## Instructions

### 1. Load Previous Sync State
```yaml
# _memory/bridge-sidecar/bridge-state.md
last_sync:
  timestamp: ISO8601
  commit_sha: string
  microservices_synced: [list]
  service_summaries_updated: [list]
  domain_summaries_updated: [list]
```

If no previous state exists, treat all existing docs as "changed".

### 2. Git-Based Change Detection (Primary)
```python
def detect_git_changes(last_sync_sha, docs_path):
    if last_sync_sha:
        # Get changed files since last sync
        diff_output = run_command(
            f"git diff --name-only {last_sync_sha} HEAD -- {docs_path}"
        )
        changed_files = diff_output.strip().split("\n")
    else:
        # No previous sync, get all tracked files
        changed_files = run_command(
            f"git ls-files {docs_path}"
        ).strip().split("\n")
    
    return [f for f in changed_files if f]  # Filter empty
```

**Parse changed files into structure:**
```yaml
changed_files_parsed:
  - file: "docs/lens-sync/user-service/architecture.md"
    microservice: user-service
    doc_type: architecture
    change_type: modified|added|deleted
    
  - file: "docs/lens-sync/auth-service/api-surface.md"
    microservice: auth-service
    doc_type: api-surface
    change_type: modified
```

### 3. Timestamp-Based Change Detection (Fallback)
If git detection unavailable or incomplete:

```python
def detect_timestamp_changes(docs_path, last_sync_time):
    changed = []
    
    for ms_folder in list_dirs(docs_path):
        ms_path = f"{docs_path}/{ms_folder}"
        
        for doc_file in list_files(ms_path, "*.md"):
            mtime = get_mtime(doc_file)
            
            if mtime > last_sync_time:
                changed.append({
                    "file": doc_file,
                    "microservice": ms_folder,
                    "doc_type": parse_doc_type(doc_file),
                    "modified_at": mtime
                })
    
    return changed
```

### 4. Content Hash Change Detection (Deep Check)
For critical files, compare content hashes:

```python
def detect_content_changes(docs_path, previous_hashes):
    changes = []
    current_hashes = {}
    
    for doc_file in find_all_docs(docs_path):
        content = read_file(doc_file)
        current_hash = md5(content)
        current_hashes[doc_file] = current_hash
        
        prev_hash = previous_hashes.get(doc_file)
        
        if prev_hash is None:
            changes.append({"file": doc_file, "change_type": "added"})
        elif prev_hash != current_hash:
            changes.append({"file": doc_file, "change_type": "modified"})
    
    # Detect deletions
    for prev_file in previous_hashes:
        if prev_file not in current_hashes:
            changes.append({"file": prev_file, "change_type": "deleted"})
    
    return changes, current_hashes
```

### 5. Aggregate Changes by Microservice
```yaml
changed_microservices:
  - name: user-service
    domain: platform
    service: identity
    changes:
      - doc: architecture.md
        change_type: modified
        change_summary: "Tech stack updated"
        
      - doc: api-surface.md
        change_type: modified
        change_summary: "3 new endpoints"
        
    impact_level: high  # affects service/domain summaries
    propagation_required: true
    
  - name: auth-service
    domain: platform
    service: identity
    changes:
      - doc: data-model.md
        change_type: modified
        change_summary: "New entity added"
        
    impact_level: medium
    propagation_required: true
```

### 6. Determine Impact Level
```python
def calculate_impact_level(changes):
    # High impact: architecture or API changes
    if any(c["doc"] in ["architecture.md", "api-surface.md"] for c in changes):
        return "high"
    
    # Medium impact: data model or integration changes
    if any(c["doc"] in ["data-model.md", "integration-map.md"] for c in changes):
        return "medium"
    
    # Low impact: onboarding or minor docs
    return "low"
```

### 7. Group by Service for Aggregation
```yaml
changes_by_service:
  identity:  # service name
    domain: platform
    microservices_changed:
      - user-service
      - auth-service
    total_changes: 4
    highest_impact: high
    aggregation_required: true
    
  payments:  # service name
    domain: commerce
    microservices_changed:
      - payment-gateway
    total_changes: 1
    highest_impact: low
    aggregation_required: false  # single MS, no aggregation needed
```

### 8. Group by Domain for Propagation
```yaml
changes_by_domain:
  platform:
    services_affected:
      - identity
    total_microservices_changed: 2
    propagation_required: true
    
  commerce:
    services_affected:
      - payments
    total_microservices_changed: 1
    propagation_required: true
```

### 9. Build Change Summary
```yaml
change_summary:
  detected_at: ISO8601
  detection_method: git|timestamp|content_hash
  
  totals:
    microservices_changed: N
    services_affected: N
    domains_affected: N
    total_file_changes: N
    
  by_change_type:
    added: N
    modified: N
    deleted: N
    
  by_impact_level:
    high: N
    medium: N
    low: N
    
  propagation_plan:
    - level: service
      targets: [list of services needing aggregation]
    - level: domain
      targets: [list of domains needing propagation]
```

### 10. Handle No Changes Scenario
```python
if not changed_microservices:
    return {
        "status": "no_changes",
        "message": "No documentation changes detected since last sync",
        "last_sync": last_sync_state,
        "recommendation": "Skip propagation or force full refresh"
    }
```

## Edge Cases and Failure Modes

| Condition | Action |
|-----------|--------|
| Git history unavailable | Fall back to timestamp detection |
| No previous sync state | Treat all docs as changed |
| Microservice folder deleted | Mark for removal from aggregates |
| Doc file corrupted/unparseable | Skip file, add to warnings |
| Very large number of changes | Warn user, consider batch processing |
| Circular service references | Detect and break cycles |
| Orphan docs (no lens mapping) | Warn, skip propagation |

## Output
```yaml
changed_microservices:
  detected_at: ISO8601
  detection_method: git|timestamp|content_hash
  
  microservices:
    - name: string
      domain: string
      service: string
      changes: [list]
      impact_level: high|medium|low
      
  by_service:
    - service: string
      domain: string
      microservices: [list]
      aggregation_required: boolean
      
  by_domain:
    - domain: string
      services: [list]
      propagation_required: boolean
      
  summary:
    total_microservices: N
    total_services: N
    total_domains: N
    
  warnings: [list]
```
