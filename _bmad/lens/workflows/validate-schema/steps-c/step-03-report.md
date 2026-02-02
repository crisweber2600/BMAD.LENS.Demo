---
name: 'step-03-report'
description: 'Write schema validation report'
outputFile: '{project-root}/_bmad-output/validate-schema-report.md'
---

# Step 3: Report

## Goal
Write a comprehensive schema validation report with actionable findings. Optionally create JIRA issues for validation failures.

## Instructions

### 1. Generate Markdown Report
```markdown
---
generated: true
generator: lens-sync
workflow: validate-schema
timestamp: {ISO8601}
---

# Lens Schema Validation Report

**Generated:** {timestamp}
**Status:** {overall_status_emoji} {overall_status}
**Strict Mode:** {strict_mode}

## Summary

| Metric | Value |
|--------|-------|
| Total Entities | {N} |
| Valid | {N} ({%}) |
| With Errors | {N} |
| With Warnings | {N} |
| Total Errors | {N} |
| Total Warnings | {N} |

## Validation Status by Type

| Type | Total | Valid | Errors | Warnings |
|------|-------|-------|--------|----------|
| Domains | {N} | {N} | {N} | {N} |
| Services | {N} | {N} | {N} | {N} |
| Microservices | {N} | {N} | {N} | {N} |

{If has_errors}
## ❌ Errors

### Domain Errors

{For each domain with errors}
#### {domain.name}
**Source:** `{domain.source}`

| Field | Error Type | Message |
|-------|------------|--------|
{For each error}| `{error.field}` | {error.type} | {error.message} |
{End for}
{End for}

### Service Errors

{For each service with errors}
#### {service.name}
**Domain:** {service.domain}
**Source:** `{service.source}`

| Field | Error Type | Message |
|-------|------------|--------|
{For each error}| `{error.field}` | {error.type} | {error.message} |
{End for}
{End for}

### Microservice Errors

{For each microservice with errors}
#### {ms.name}
**Service:** {ms.service}
**Source:** `{ms.source}`

| Field | Error Type | Message |
|-------|------------|--------|
{For each error}| `{error.field}` | {error.type} | {error.message} |
{End for}
{End for}
{End if}

{If has_warnings}
## ⚠️ Warnings

{Similar structure to errors section}
{End if}

{If cross_reference_issues}
## 🔗 Cross-Reference Issues

| From | To | Issue |
|------|----|-----------|
{For each issue}| {issue.from} | {issue.to} | {issue.message} |
{End for}
{End if}

## Schemas Used

| Schema | Source | Rules |
|--------|--------|-------|
| Domain | {builtin|custom} | {N} rules |
| Service | {builtin|custom} | {N} rules |
| Microservice | {builtin|custom} | {N} rules |

## Remediation Guide

{If errors}
### Required Fixes

{Generate fix suggestions based on error types}

1. **Missing Required Fields**
   {For each missing_required error}
   - Add `{field}` to `{entity_name}` in `{source_file}`
   {End for}

2. **Invalid References**
   {For each invalid_reference error}
   - Check that `{reference}` exists or create it
   {End for}

3. **Pattern Mismatches**
   {For each pattern_mismatch error}
   - Update `{field}` in `{entity}` to match pattern `{pattern}`
   - Current value: `{value}`
   - Example valid value: `{suggested_value}`
   {End for}
{End if}

{If warnings}
### Recommended Improvements

{Generate improvement suggestions}
{End if}

## Validation Details

<details>
<summary>Full Validation Results (click to expand)</summary>

```yaml
{YAML dump of full validation_results}
```

</details>
```

### 2. Write Report File
```python
def write_report(report_content, output_path):
    report_path = f"{project_root}/_bmad-output/validate-schema-report.md"
    
    makedirs(dirname(report_path))
    write_file(report_path, report_content)
    
    return report_path
```

### 3. Create JIRA Issues (if enabled)
```python
def create_jira_issues(config, validation_results):
    if not config.get("enable_jira_integration"):
        return []
    
    jira_items = []
    
    # Create issue for validation failures
    if not validation_results["overall_valid"]:
        issue = create_jira_issue(
            project=config["jira_project_key"],
            issue_type="Bug",
            summary=f"Lens Schema Validation Failed - {date}",
            description=generate_jira_description(validation_results),
            labels=["lens-sync", "schema-validation"]
        )
        jira_items.append(issue)
    
    # Create sub-tasks for each error category
    for error_type in group_errors_by_type(validation_results):
        subtask = create_jira_subtask(
            parent=issue.key,
            summary=f"Fix {error_type} errors",
            description=generate_error_fix_description(error_type)
        )
        jira_items.append(subtask)
    
    return jira_items
```

### 4. Update Sidecar State
```yaml
# _memory/bridge-sidecar/bridge-state.md update
last_validation:
  timestamp: ISO8601
  overall_valid: boolean
  
  summary:
    entities: N
    errors: N
    warnings: N
    
  report_path: string
```

### 5. Output Summary for User
```markdown
## Schema Validation Complete

{If valid}
✅ **All lens metadata is valid!**

- **{N}** entities validated
- **0** errors
- **{N}** warnings (optional fixes)

{Else}
❌ **Validation failed with {N} errors**

- **{N}** entities validated
- **{N}** errors (must fix)
- **{N}** warnings (optional)

### Top Issues

{List top 5 errors with fix suggestions}

### Quick Fixes

```yaml
# Example fix for most common error
{Show example fix}
```
{End if}

### Report
📄 [{report_path}]({report_path})

{If JIRA items}
### JIRA Issues Created
{For each item}
- [{item.key}]({item.url}): {item.summary}
{End for}
{End if}

### Next Steps

{If valid}
1. Review warnings for potential improvements
2. Run `update-lens` workflow to propagate documentation
{Else}
1. Fix the reported errors
2. Re-run `validate-schema` workflow
3. Once valid, run `update-lens` workflow
{End if}
```

## Edge Cases and Failure Modes

| Condition | Action |
|-----------|--------|
| Report write fails | Output to console |
| Very large report | Summarize, link to full details |
| JIRA creation fails | Log error, continue |
| No errors or warnings | Generate success report |
| Mixed results | Clear categorization |

## Output
```yaml
report_output:
  report_path: string
  report_size_bytes: N
  
  validation_summary:
    overall_valid: boolean
    total_entities: N
    errors: N
    warnings: N
    
  jira:
    items_created: N
    items: [list]
    
  recommendations:
    required_fixes: [list]
    optional_improvements: [list]
    
  status: success
```
