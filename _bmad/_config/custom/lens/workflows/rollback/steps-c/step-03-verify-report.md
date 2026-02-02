---
name: 'step-03-verify-report'
description: 'Verify integrity and report'
outputFile: '{project-root}/_bmad-output/rollback-report.md'
---

# Step 3: Verify & Report

## Goal
Verify the integrity of lens data after rollback, ensure consistency, and write a comprehensive report documenting the operation.

## Instructions

### 1. Verify Restored Files
```python
def verify_restored_files(rollback_result):
    verification = {
        "files_verified": [],
        "issues": []
    }
    
    for file_path in rollback_result["files_list"]:
        file_check = {
            "path": file_path,
            "exists": exists(file_path),
            "readable": False,
            "valid": False
        }
        
        if file_check["exists"]:
            try:
                content = read_file(file_path)
                file_check["readable"] = True
                
                # Validate based on file type
                if file_path.endswith(".yaml") or file_path.endswith(".yml"):
                    yaml.safe_load(content)
                    file_check["valid"] = True
                elif file_path.endswith(".md"):
                    # Basic markdown validation
                    file_check["valid"] = len(content) > 0
                else:
                    file_check["valid"] = True
                    
            except Exception as e:
                file_check["error"] = str(e)
                verification["issues"].append({
                    "file": file_path,
                    "issue": str(e)
                })
        else:
            verification["issues"].append({
                "file": file_path,
                "issue": "File not found after rollback"
            })
        
        verification["files_verified"].append(file_check)
    
    return verification
```

### 2. Validate Lens Schema Integrity
Run a lightweight schema validation:

```python
def validate_lens_integrity(lens_config_path):
    integrity = {
        "domain_map": None,
        "services": [],
        "microservices": [],
        "issues": []
    }
    
    # Check domain-map.yaml
    domain_map_path = f"{lens_config_path}/domain-map.yaml"
    if exists(domain_map_path):
        try:
            content = read_file(domain_map_path)
            data = yaml.safe_load(content)
            
            # Basic structure check
            if "domains" in data or "services" in data:
                integrity["domain_map"] = {
                    "valid": True,
                    "domains": len(data.get("domains", [])),
                    "services": len(data.get("services", []))
                }
            else:
                integrity["issues"].append({
                    "file": "domain-map.yaml",
                    "issue": "Missing domains or services key"
                })
        except Exception as e:
            integrity["issues"].append({
                "file": "domain-map.yaml",
                "issue": str(e)
            })
    else:
        integrity["issues"].append({
            "file": "domain-map.yaml",
            "issue": "File not found"
        })
    
    return integrity
```

### 3. Check Cross-References
```python
def check_cross_references(lens_data):
    issues = []
    
    # Build reference maps
    domains = set(d["name"] for d in lens_data.get("domains", []))
    services = set(s["name"] for s in lens_data.get("services", []))
    
    # Check service -> domain references
    for service in lens_data.get("services", []):
        if service.get("domain") and service["domain"] not in domains:
            issues.append({
                "type": "broken_reference",
                "from": f"service:{service['name']}",
                "to": f"domain:{service['domain']}"
            })
    
    # Check microservice -> service references
    for ms in lens_data.get("microservices", []):
        if ms.get("service") and ms["service"] not in services:
            issues.append({
                "type": "broken_reference",
                "from": f"microservice:{ms['name']}",
                "to": f"service:{ms['service']}"
            })
    
    return issues
```

### 4. Verify Documentation Consistency
```python
def verify_doc_consistency(docs_path, lens_data):
    consistency = {
        "expected_docs": [],
        "found_docs": [],
        "missing_docs": [],
        "orphan_docs": []
    }
    
    # Build expected doc list from lens data
    for ms in lens_data.get("microservices", []):
        # Extract domain and service from microservice
        expected_path = f"{docs_path}/{ms['domain']}/{ms['service']}/"
        consistency["expected_docs"].append(expected_path)
    
    # Find actual docs
    if exists(f"{docs_path}/"):
        for folder in list_dirs(f"{docs_path}/"):
            folder_path = f"{docs_path}/{folder}/"
            consistency["found_docs"].append(folder_path)
    
    # Calculate missing and orphans
    consistency["missing_docs"] = [
        d for d in consistency["expected_docs"] 
        if d not in consistency["found_docs"]
    ]
    consistency["orphan_docs"] = [
        d for d in consistency["found_docs"] 
        if d not in consistency["expected_docs"]
    ]
    
    return consistency
```

### 5. Calculate Verification Summary
```yaml
verification_summary:
  verified_at: ISO8601
  
  file_verification:
    total_files: N
    verified_ok: N
    issues: N
    
  schema_integrity:
    domain_map_valid: boolean
    domains_count: N
    services_count: N
    microservices_count: N
    
  cross_references:
    checked: N
    broken: N
    
  doc_consistency:
    expected: N
    found: N
    missing: N
    orphan: N
    
  overall_integrity: pass|warn|fail
```

### 6. Generate Markdown Report
```markdown
---
generated: true
generator: lens-sync
workflow: rollback
timestamp: {ISO8601}
---

# Lens Rollback Report

**Generated:** {timestamp}
**Status:** {overall_status_emoji} {overall_status}

## Summary

| Metric | Value |
|--------|-------|
| Rollback Point | `{rollback_point.ref}` |
| Type | {rollback_point.type} |
| Original Date | {rollback_point.date} |
| Files Restored | {N} |
| Verification | {pass|warn|fail} |

## Rollback Details

### Selected Point
- **Reference:** `{rollback_point.ref}`
- **Type:** {rollback_point.type}
- **Date:** {rollback_point.date}
- **Description:** {rollback_point.description}

### Impact
- **Commits Reverted:** {N}
- **Files Affected:** {N}
- **Severity:** {severity}

### Backup Created
- **Tag:** `{backup.tag}`
- **To undo this rollback:** `git checkout {backup.tag} -- <lens files>`

## Files Restored

### Configuration Files
{For each config file}
- `{file.path}` ✅
{End for}

### Documentation Files
{For each doc file}
- `{file.path}` ✅
{End for}

**Total:** {N} files restored

## Verification Results

### File Integrity
{If all files ok}
✅ All {N} restored files verified successfully.
{Else}
⚠️ {N} files had issues:
{For each issue}
- `{issue.file}`: {issue.issue}
{End for}
{End if}

### Schema Integrity
{If valid}
✅ Lens schema is valid.
- Domains: {N}
- Services: {N}
- Microservices: {N}
{Else}
❌ Schema integrity issues:
{For each issue}
- {issue.description}
{End for}
{End if}

### Cross-References
{If no broken refs}
✅ All cross-references are valid.
{Else}
⚠️ Broken references detected:
{For each broken}
- {broken.from} → {broken.to}
{End for}
{End if}

### Documentation Consistency
- Expected docs: {N}
- Found docs: {N}
{If missing}
- Missing: {list}
{End if}
{If orphan}
- Orphaned: {list}
{End if}

## Recovery Information

### How to Undo This Rollback

```bash
# Option 1: Use the backup tag
git checkout {backup.tag} -- {lens_config_path}/ {docs_output_folder}/

# Option 2: Reset to the backup tag entirely
git reset --hard {backup.tag}
```

{If stash created}
### Stashed Changes
Uncommitted changes were stashed before rollback:
```bash
git stash pop  # To restore stashed changes
```
{End if}

## Warnings

{For each warning}
- ⚠️ {warning}
{End for}

## Next Steps

1. Review restored lens configuration
2. Run `validate-schema` workflow to ensure full integrity
3. {If analysis cache stale} Consider re-running `analyze-codebase` workflow
4. Update any dependent workflows or documentation

## Audit Trail

| Event | Timestamp |
|-------|----------|
| Rollback initiated | {started_at} |
| Backup created | {backup_created_at} |
| Files restored | {restore_completed_at} |
| Verification completed | {verified_at} |
| Report generated | {report_generated_at} |
```

### 7. Write Report File
```python
def write_report(report_content, output_path):
    report_path = f"{project_root}/_bmad-output/rollback-report.md"
    
    makedirs(dirname(report_path))
    write_file(report_path, report_content)
    
    return report_path
```

### 8. Create JIRA Issue (if enabled)
```python
def create_jira_issue(config, rollback_result, verification):
    if not config.get("enable_jira_integration"):
        return None
    
    issue = create_jira_issue(
        project=config["jira_project_key"],
        issue_type="Task",
        summary=f"Lens Rollback Performed - {date}",
        description=f"""
        A rollback of lens configuration was performed.
        
        **Rollback Point:** {rollback_result['ref']}
        **Files Restored:** {rollback_result['files_count']}
        **Verification:** {verification['overall_integrity']}
        
        **Backup Tag:** {rollback_result['backup_tag']}
        
        See full report: {report_path}
        """,
        labels=["lens-sync", "rollback"]
    )
    
    return issue
```

### 9. Update Sidecar State
```yaml
# _memory/bridge-sidecar/bridge-state.md update
last_rollback:
  timestamp: ISO8601
  rollback_point:
    type: string
    ref: string
  files_restored: N
  verification:
    status: pass|warn|fail
  backup_tag: string
  report_path: string
```

### 10. Output Summary for User
```markdown
## Rollback Complete

{If success}
✅ **Rollback successful!**

- **Restored to:** `{rollback_point.ref}` ({rollback_point.date})
- **Files restored:** {N}
- **Verification:** {status}

{Else}
⚠️ **Rollback completed with warnings**

- {N} files restored
- {N} verification issues

{End if}

### Recovery
To undo this rollback:
```bash
git checkout {backup.tag} -- {lens_paths}
```

### Report
📄 [{report_path}]({report_path})

{If JIRA}
### JIRA
- [{issue.key}]({issue.url}): {issue.summary}
{End if}

### Next Steps
1. Review restored configuration
2. Run `validate-schema` for full integrity check
3. Re-run analysis if needed
```

## Edge Cases and Failure Modes

| Condition | Action |
|-----------|--------|
| Verification finds issues | Report as warnings, don't fail |
| Report write fails | Output to console |
| JIRA creation fails | Log error, continue |
| Schema integrity fails | CRITICAL warning, recommend re-rollback |
| Cross-reference broken | Warn, document fix needed |
| Doc consistency issues | Warn, may need re-sync |

## Output
```yaml
verification_report:
  report_path: string
  
  verification:
    overall_integrity: pass|warn|fail
    files_verified: N
    issues: N
    
  schema:
    valid: boolean
    entities: N
    
  cross_references:
    valid: N
    broken: N
    
  recovery_info:
    backup_tag: string
    undo_command: string
    
  jira_issue: string|null
  
  status: success
```
