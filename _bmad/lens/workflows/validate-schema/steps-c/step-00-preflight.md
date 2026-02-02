---
name: 'step-00-preflight'
description: 'Preflight checks and guardrails'
nextStepFile: './step-01-load-schemas.md'
---

# Step 0: Preflight

## Goal
Validate prerequisites and guardrails before schema validation. This workflow validates lens configuration integrity, so ensure all lens files are accessible.

## Instructions

### 1. Load and Validate Configuration
```yaml
required_config:
  target_project_root: string  # workspace root
  lens_config_path: string     # domain-map.yaml location
  docs_output_folder: string   # for validation report
  
optional_config:
  schema_definitions_path: string  # custom schema location
  enable_jira_integration: boolean
  jira_project_key: string
  strict_mode: boolean  # fail on warnings
  validate_references: boolean  # check cross-references
```

**Validation:**
```python
def validate_config(config):
    errors = []
    
    if not config.get("target_project_root"):
        errors.append("target_project_root is required")
    elif not exists(config["target_project_root"]):
        errors.append(f"target_project_root not found")
    
    if not config.get("lens_config_path"):
        errors.append("lens_config_path is required")
    
    return errors
```

### 2. Locate Lens Configuration Files
```yaml
lens_files:
  domain_map:
    path: "{lens_config_path}/domain-map.yaml"
    required: true
    
  service_definitions:
    path: "{lens_config_path}/services/*.yaml"
    required: false  # may be inline in domain-map
    
  microservice_definitions:
    path: "{lens_config_path}/microservices/*.yaml"
    required: false
```

**Discovery:**
```python
def discover_lens_files(lens_config_path):
    files = {
        "domain_map": None,
        "services": [],
        "microservices": []
    }
    
    # Find domain-map.yaml
    domain_map_path = f"{lens_config_path}/domain-map.yaml"
    if exists(domain_map_path):
        files["domain_map"] = domain_map_path
    else:
        # Try alternative locations
        for alt in ["domain-map.yml", "domains.yaml", "lens.yaml"]:
            if exists(f"{lens_config_path}/{alt}"):
                files["domain_map"] = f"{lens_config_path}/{alt}"
                break
    
    # Find service files
    services_path = f"{lens_config_path}/services/"
    if exists(services_path):
        files["services"] = glob(f"{services_path}/*.yaml")
    
    # Find microservice files
    ms_path = f"{lens_config_path}/microservices/"
    if exists(ms_path):
        files["microservices"] = glob(f"{ms_path}/*.yaml")
    
    return files
```

### 3. Validate Path Security
```python
def validate_output_path(docs_output_folder, target_project_root):
    abs_output = os.path.abspath(docs_output_folder)
    abs_root = os.path.abspath(target_project_root)
    
    if not abs_output.startswith(abs_root):
        raise SecurityError("Output folder must be inside project root")
    
    if ".." in docs_output_folder:
        raise SecurityError("Path traversal not allowed")
    
    return abs_output
```

### 4. Locate Schema Definitions
```yaml
schema_sources:
  - name: builtin
    description: "Built-in lens schemas"
    path: "{module_path}/schemas/"
    
  - name: custom
    description: "Project-specific schema overrides"
    path: "{lens_config_path}/schemas/"
    optional: true
```

**Schema discovery:**
```python
def discover_schemas(config):
    schemas = {}
    
    # Load built-in schemas
    builtin_path = get_module_path() + "/schemas/"
    schemas["domain"] = f"{builtin_path}/domain.schema.yaml"
    schemas["service"] = f"{builtin_path}/service.schema.yaml"
    schemas["microservice"] = f"{builtin_path}/microservice.schema.yaml"
    
    # Check for custom overrides
    custom_path = config.get("schema_definitions_path")
    if custom_path and exists(custom_path):
        for schema_type in ["domain", "service", "microservice"]:
            custom_file = f"{custom_path}/{schema_type}.schema.yaml"
            if exists(custom_file):
                schemas[schema_type] = custom_file
                log(f"Using custom schema for {schema_type}")
    
    return schemas
```

### 5. Verify Git Status (optional)
```python
def check_git_status():
    if not command_exists("git"):
        return {"available": False}
    
    status = run_command("git status --porcelain")
    return {
        "available": True,
        "clean": len(status.strip()) == 0,
        "modified_files": status.strip().split("\n") if status.strip() else []
    }
```

### 6. JIRA Integration Check (if enabled)
```yaml
jira_checks:
  enabled: from config.enable_jira_integration
  
  validations:
    - name: credentials_available
    - name: project_accessible
    - name: can_create_issues
```

### 7. Build Preflight Report
```yaml
preflight_status:
  workflow: validate-schema
  checked_at: ISO8601
  
  config_validation:
    status: pass|fail
    errors: [list]
    
  lens_files:
    domain_map:
      found: boolean
      path: string
    services:
      count: N
      paths: [list]
    microservices:
      count: N
      paths: [list]
      
  schemas:
    domain:
      path: string
      source: builtin|custom
    service:
      path: string
      source: builtin|custom
    microservice:
      path: string
      source: builtin|custom
      
  path_security:
    status: pass|fail
    resolved_output_path: string
    
  git_status:
    available: boolean
    clean: boolean
    
  jira_integration:
    enabled: boolean
    status: pass|fail|skipped
    
  overall_status: pass|fail
  blocking_issues: [list]
  warnings: [list]
```

## Edge Cases and Failure Modes

| Condition | Action |
|-----------|--------|
| domain-map.yaml not found | FAIL: "No lens configuration found" |
| Schema files missing | FAIL: "Schema definitions not available" |
| No lens files to validate | WARN: "Nothing to validate" |
| Output path outside project | FAIL: Security violation |
| JIRA enabled but unavailable | WARN, disable JIRA for run |
| Very large number of lens files | Warn about validation time |

## Output
```yaml
preflight_status:
  status: pass|fail
  checked_at: ISO8601
  
  lens_files:
    domain_map: string|null
    services: [list]
    microservices: [list]
    total_files: N
    
  schemas:
    domain: string
    service: string
    microservice: string
    
  resolved_paths:
    output_folder: string
    lens_config: string
    
  blocking_issues: [list]
  warnings: [list]
```
