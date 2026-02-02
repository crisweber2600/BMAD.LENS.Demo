---
name: 'step-01-load-schemas'
description: 'Load lens schema definitions'
nextStepFile: './step-02-validate.md'
---

# Step 1: Load Schemas

## Goal
Load and parse all schema definitions for lens data validation. Support both built-in schemas and custom project overrides.

## Instructions

### 1. Load Built-in Schema Definitions
```yaml
builtin_schemas:
  domain:
    description: "Domain-level configuration schema"
    file: "domain.schema.yaml"
    
  service:
    description: "Service-level configuration schema"
    file: "service.schema.yaml"
    
  microservice:
    description: "Microservice-level configuration schema"
    file: "microservice.schema.yaml"
    
  domain_map:
    description: "Full domain-map.yaml schema"
    file: "domain-map.schema.yaml"
```

**Domain Schema (domain.schema.yaml):**
```yaml
type: object
required:
  - name
  - description
properties:
  name:
    type: string
    pattern: "^[a-z][a-z0-9-]*$"
    description: "Domain identifier (lowercase, hyphenated)"
    
  description:
    type: string
    minLength: 10
    description: "Human-readable domain description"
    
  services:
    type: array
    items:
      $ref: "#/definitions/service_ref"
    description: "Services belonging to this domain"
    
  owner:
    type: string
    description: "Team or individual owning this domain"
    
  status:
    type: string
    enum: [active, deprecated, planned, archived]
    default: active
    
  tags:
    type: array
    items:
      type: string
    description: "Categorization tags"
    
  metadata:
    type: object
    additionalProperties: true
    description: "Additional domain metadata"
```

**Service Schema (service.schema.yaml):**
```yaml
type: object
required:
  - name
  - domain
properties:
  name:
    type: string
    pattern: "^[a-z][a-z0-9-]*$"
    
  domain:
    type: string
    description: "Parent domain reference"
    
  description:
    type: string
    
  microservices:
    type: array
    items:
      $ref: "#/definitions/microservice_ref"
      
  git_repo:
    type: string
    format: uri
    
  docs_path:
    type: string
    
  status:
    type: string
    enum: [active, deprecated, planned, archived]
    
  dependencies:
    type: array
    items:
      type: string
    description: "Other services this depends on"
```

**Microservice Schema (microservice.schema.yaml):**
```yaml
type: object
required:
  - name
  - service
  - path
properties:
  name:
    type: string
    pattern: "^[a-z][a-z0-9-]*$"
    
  service:
    type: string
    description: "Parent service reference"
    
  domain:
    type: string
    description: "Parent domain (can be inferred from service)"
    
  path:
    type: string
    description: "Relative path to microservice code"
    
  description:
    type: string
    
  git_repo:
    type: string
    format: uri
    
  branch:
    type: string
    default: main
    
  language:
    type: string
    enum: [typescript, javascript, python, java, go, csharp, rust, other]
    
  framework:
    type: string
    
  status:
    type: string
    enum: [active, deprecated, planned, archived]
    
  port:
    type: integer
    minimum: 1
    maximum: 65535
    
  healthcheck:
    type: string
    description: "Health check endpoint"
```

### 2. Load Custom Schema Overrides
```python
def load_custom_schemas(custom_path, builtin_schemas):
    merged_schemas = dict(builtin_schemas)
    
    if not custom_path or not exists(custom_path):
        return merged_schemas
    
    for schema_type in ["domain", "service", "microservice", "domain_map"]:
        custom_file = f"{custom_path}/{schema_type}.schema.yaml"
        
        if exists(custom_file):
            custom_schema = load_yaml(custom_file)
            
            # Merge custom into builtin (custom wins)
            merged_schemas[schema_type] = deep_merge(
                builtin_schemas.get(schema_type, {}),
                custom_schema
            )
            
            log(f"Loaded custom schema override: {schema_type}")
    
    return merged_schemas
```

### 3. Parse and Validate Schemas
```python
def parse_schemas(schema_paths):
    parsed = {}
    errors = []
    
    for schema_type, path in schema_paths.items():
        try:
            content = read_file(path)
            schema = yaml.safe_load(content)
            
            # Validate schema structure
            if not isinstance(schema, dict):
                errors.append(f"{schema_type}: Schema must be an object")
                continue
            
            if "type" not in schema and "properties" not in schema:
                errors.append(f"{schema_type}: Missing type or properties")
                continue
            
            parsed[schema_type] = {
                "schema": schema,
                "path": path,
                "required_fields": schema.get("required", []),
                "properties": schema.get("properties", {})
            }
            
        except yaml.YAMLError as e:
            errors.append(f"{schema_type}: YAML parse error - {e}")
        except Exception as e:
            errors.append(f"{schema_type}: Load error - {e}")
    
    return parsed, errors
```

### 4. Build Schema Dependency Graph
```python
def build_schema_dependencies(schemas):
    # Track references between schemas
    dependencies = {
        "domain": [],
        "service": ["domain"],  # service references domain
        "microservice": ["service", "domain"],  # ms references both
        "domain_map": ["domain", "service", "microservice"]
    }
    
    # Validate reference chains exist
    for schema_type, deps in dependencies.items():
        for dep in deps:
            if dep not in schemas:
                raise SchemaError(f"{schema_type} depends on missing schema: {dep}")
    
    return dependencies
```

### 5. Extract Validation Rules
```python
def extract_validation_rules(schema):
    rules = []
    
    for field, field_schema in schema.get("properties", {}).items():
        rule = {
            "field": field,
            "type": field_schema.get("type"),
            "required": field in schema.get("required", []),
            "constraints": []
        }
        
        # Extract constraints
        if "pattern" in field_schema:
            rule["constraints"].append({"type": "pattern", "value": field_schema["pattern"]})
        if "minLength" in field_schema:
            rule["constraints"].append({"type": "minLength", "value": field_schema["minLength"]})
        if "maxLength" in field_schema:
            rule["constraints"].append({"type": "maxLength", "value": field_schema["maxLength"]})
        if "minimum" in field_schema:
            rule["constraints"].append({"type": "minimum", "value": field_schema["minimum"]})
        if "maximum" in field_schema:
            rule["constraints"].append({"type": "maximum", "value": field_schema["maximum"]})
        if "enum" in field_schema:
            rule["constraints"].append({"type": "enum", "value": field_schema["enum"]})
        if "format" in field_schema:
            rule["constraints"].append({"type": "format", "value": field_schema["format"]})
        
        rules.append(rule)
    
    return rules
```

### 6. Load Lens Data Files
```python
def load_lens_data(preflight_status):
    lens_data = {
        "domain_map": None,
        "domains": [],
        "services": [],
        "microservices": []
    }
    
    # Load domain-map.yaml
    if preflight_status["lens_files"]["domain_map"]:
        domain_map_content = read_file(preflight_status["lens_files"]["domain_map"])
        lens_data["domain_map"] = yaml.safe_load(domain_map_content)
        
        # Extract domains from domain-map
        if "domains" in lens_data["domain_map"]:
            lens_data["domains"] = lens_data["domain_map"]["domains"]
    
    # Load standalone service files
    for service_file in preflight_status["lens_files"]["services"]:
        service_content = read_file(service_file)
        service_data = yaml.safe_load(service_content)
        service_data["_source_file"] = service_file
        lens_data["services"].append(service_data)
    
    # Load standalone microservice files
    for ms_file in preflight_status["lens_files"]["microservices"]:
        ms_content = read_file(ms_file)
        ms_data = yaml.safe_load(ms_content)
        ms_data["_source_file"] = ms_file
        lens_data["microservices"].append(ms_data)
    
    return lens_data
```

### 7. Build Schema Set Output
```yaml
schema_set:
  loaded_at: ISO8601
  
  schemas:
    domain:
      path: string
      source: builtin|custom
      required_fields: [list]
      total_properties: N
      validation_rules: [list]
      
    service:
      path: string
      source: builtin|custom
      required_fields: [list]
      total_properties: N
      validation_rules: [list]
      
    microservice:
      path: string
      source: builtin|custom
      required_fields: [list]
      total_properties: N
      validation_rules: [list]
      
    domain_map:
      path: string
      source: builtin|custom
      
  lens_data:
    domain_map_loaded: boolean
    domains_count: N
    services_count: N
    microservices_count: N
    
  dependencies:
    domain: []
    service: [domain]
    microservice: [service, domain]
    
  load_errors: [list]
  load_warnings: [list]
```

## Edge Cases and Failure Modes

| Condition | Action |
|-----------|--------|
| Schema file unparseable | FAIL with parse error details |
| Custom schema invalid | Fall back to builtin, warn |
| Lens data file unparseable | Skip file, add to errors |
| Circular schema references | Detect and fail |
| Empty lens data | Warn, continue with empty validation |
| Very large lens data | Log warning about validation time |

## Output
```yaml
schema_set:
  loaded_at: ISO8601
  
  schemas:
    - type: domain
      path: string
      source: builtin|custom
      rules_count: N
      
  lens_data:
    domains: N
    services: N
    microservices: N
    
  errors: [list]
  warnings: [list]
```
