---
name: 'step-02-apply'
description: 'Apply rollback'
nextStepFile: './step-03-verify-report.md'
---

# Step 2: Apply Rollback

## Goal
Restore lens data to the selected rollback point. Ensure atomicity—either the rollback completes fully or state is preserved.

## Instructions

### 1. Prepare Rollback Operation
```python
def prepare_rollback(rollback_point, preflight_status):
    preparation = {
        "rollback_type": rollback_point["type"],
        "target_ref": rollback_point["ref"],
        "backup_ref": preflight_status["backup"]["tag"],
        "files_to_restore": [],
        "strategy": None
    }
    
    if rollback_point["type"] in ["git_tag", "git_commit"]:
        preparation["strategy"] = "git_checkout"
        preparation["files_to_restore"] = get_lens_files_at_ref(rollback_point["ref"])
    else:
        preparation["strategy"] = "file_restore"
        preparation["files_to_restore"] = list_backup_files(rollback_point["ref"])
    
    return preparation
```

### 2. Git-Based Rollback
```python
def apply_git_rollback(rollback_point, lens_paths):
    ref = rollback_point["ref"]
    results = {
        "files_restored": [],
        "errors": []
    }
    
    # Checkout lens files from the target ref
    for path_pattern in lens_paths:
        try:
            # Checkout specific files from the ref
            run_command(f"git checkout {ref} -- {path_pattern}")
            
            # Track restored files
            files = run_command(f"git diff --name-only HEAD {ref} -- {path_pattern}")
            results["files_restored"].extend(files.strip().split("\n"))
            
        except CommandError as e:
            results["errors"].append({
                "pattern": path_pattern,
                "error": str(e)
            })
    
    return results
```

**Lens paths to restore:**
```yaml
lens_paths:
  - "{lens_config_path}/domain-map.yaml"
  - "{lens_config_path}/services/"
  - "{lens_config_path}/microservices/"
  - "{docs_output_folder}/"
```

### 3. File-Based Rollback (Manual Backups)
```python
def apply_file_rollback(backup_path, target_paths):
    results = {
        "files_restored": [],
        "errors": []
    }
    
    # Restore config files
    config_backup = f"{backup_path}/config/"
    if exists(config_backup):
        for file in list_files(config_backup):
            source = f"{config_backup}/{file}"
            dest = f"{target_paths['lens_config']}/{file}"
            
            try:
                copy_file(source, dest)
                results["files_restored"].append(dest)
            except Exception as e:
                results["errors"].append({
                    "file": dest,
                    "error": str(e)
                })
    
    # Restore doc files
    docs_backup = f"{backup_path}/docs/"
    if exists(docs_backup):
        for file in list_files_recursive(docs_backup):
            source = f"{docs_backup}/{file}"
            # Reconstruct domain/service structure from file path
            dest = f"{target_paths['docs_output']}/{file}"
            
            try:
                makedirs(dirname(dest))
                copy_file(source, dest)
                results["files_restored"].append(dest)
            except Exception as e:
                results["errors"].append({
                    "file": dest,
                    "error": str(e)
                })
    
    return results
```

### 4. Atomic Rollback Wrapper
```python
def apply_rollback_atomic(rollback_point, config):
    # Create a transaction-like wrapper
    transaction = {
        "started_at": now(),
        "backup_tag": config["backup_tag"],
        "status": "in_progress"
    }
    
    try:
        # Apply the rollback
        if rollback_point["type"] in ["git_tag", "git_commit"]:
            results = apply_git_rollback(rollback_point, LENS_PATHS)
        else:
            results = apply_file_rollback(rollback_point["ref"], TARGET_PATHS)
        
        # Check for errors
        if results["errors"]:
            raise RollbackError(f"Rollback had {len(results['errors'])} errors")
        
        transaction["status"] = "success"
        transaction["results"] = results
        
    except Exception as e:
        # Rollback failed—attempt to restore from backup
        transaction["status"] = "failed"
        transaction["error"] = str(e)
        
        # Attempt recovery
        try:
            restore_from_backup(transaction["backup_tag"])
            transaction["recovery"] = "success"
        except Exception as recovery_error:
            transaction["recovery"] = "failed"
            transaction["recovery_error"] = str(recovery_error)
    
    transaction["completed_at"] = now()
    return transaction
```

### 5. Handle Uncommitted Changes
```python
def handle_uncommitted_changes(config):
    status = run_command("git status --porcelain")
    if not status.strip():
        return {"action": "none_needed"}
    
    # Options:
    # 1. Stash changes
    # 2. Commit changes
    # 3. Discard changes (with backup)
    
    if config.get("stash_uncommitted", True):
        stash_name = f"lens-rollback-{datetime.now().strftime('%Y%m%d-%H%M%S')}"
        run_command(f"git stash push -m '{stash_name}'")
        return {
            "action": "stashed",
            "stash_name": stash_name
        }
    else:
        # Backup and discard
        backup_uncommitted_to_file()
        run_command("git checkout -- .")
        return {
            "action": "discarded_with_backup"
        }
```

### 6. Track Restored Files
```yaml
restoration_tracking:
  config_files:
    - file: domain-map.yaml
      restored_from: {ref}
      previous_hash: {hash}
      restored_hash: {hash}
      status: success
      
    - file: services/identity.yaml
      restored_from: {ref}
      previous_hash: {hash}
      restored_hash: {hash}
      status: success
      
  doc_files:
    - file: {domain}/{service}/architecture.md
      restored_from: {ref}
      status: success
      
  totals:
    config_files: N
    doc_files: N
    total_restored: N
```

### 7. Post-Rollback Cleanup
```python
def post_rollback_cleanup(rollback_results):
    cleanup = {
        "actions": [],
        "warnings": []
    }
    
    # Clear any cached analysis data
    cache_path = "_memory/scout-sidecar/analysis/"
    if exists(cache_path):
        # Don't delete, but mark as potentially stale
        cleanup["warnings"].append(
            "Analysis cache may be stale after rollback. Consider re-running analyze-codebase."
        )
    
    # Update sidecar state
    update_bridge_state({
        "last_rollback": {
            "timestamp": now(),
            "ref": rollback_results["target_ref"],
            "files_restored": rollback_results["files_restored"]
        }
    })
    
    return cleanup
```

### 8. Build Rollback Result
```yaml
rollback_result:
  applied_at: ISO8601
  duration_ms: N
  
  rollback_point:
    type: git_tag|git_commit|manual_backup
    ref: string
    date: ISO8601
    
  backup_used:
    tag: string
    recovery_available: true
    
  restoration:
    strategy: git_checkout|file_restore
    
    files_restored:
      config: N
      docs: N
      total: N
      
    files_list: [list]
    
  uncommitted_handling:
    action: none_needed|stashed|discarded_with_backup
    stash_name: string|null
    
  status: success|partial|failed
  
  errors: [list]
  warnings: [list]
  
  cleanup:
    actions: [list]
    recommendations: [list]
```

## Edge Cases and Failure Modes

| Condition | Action |
|-----------|--------|
| Git checkout fails | Attempt file-based restore |
| Partial restore | Track what succeeded, report gaps |
| Disk full during restore | Abort, restore from backup |
| File permission errors | Report specific files, continue |
| Backup tag missing | FAIL: "Cannot proceed without backup" |
| Recovery fails | CRITICAL: Manual intervention required |
| Merge conflicts | Use --force for lens files |

## Output
```yaml
rollback_result:
  status: success|partial|failed
  applied_at: ISO8601
  
  files_restored:
    total: N
    list: [paths]
    
  backup:
    tag: string
    can_undo: true
    
  errors: [list]
  warnings: [list]
```
