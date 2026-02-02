---
name: 'step-02-validate'
description: 'Validate lens metadata against schemas'
nextStepFile: './step-03-report.md'
---

# Step 2: Validate Metadata

## Goal
Validate all lens data files against their schemas. Perform structural validation, constraint checking, and cross-reference validation.

## Instructions

### 1. Initialize Validation Context
```yaml
validation_context:
  schema_set: from Step 1
  lens_data: from Step 1
  strict_mode: from config (default: false)
  validate_references: from config (default: true)
  
  results:
    domains: []
    services: []
    microservices: []
    cross_references: []
```

### 2. Validate Domain Entries
```python
def validate_domains(domains, schema):
    results = []
    
    for domain in domains:
        domain_result = {
            "name": domain.get("name", "<unnamed>"),
            "source": domain.get("_source_file", "domain-map.yaml"),
            "errors": [],
            "warnings": []
        }
        
        # Required field check
        for required_field in schema["required_fields"]:
            if required_field not in domain:
                domain_result["errors"].append({
                    "type": "missing_required",
                    "field": required_field,
                    "message": f"Required field '{required_field}' is missing"
                })
        
        # Type validation
        for field, value in domain.items():
            if field.startswith("_"):
                continue  # Skip internal fields
            
            field_schema = schema["properties"].get(field)
            if field_schema:
                type_errors = validate_type(value, field_schema)
                domain_result["errors"].extend(type_errors)
            else:
                domain_result["warnings"].append({
                    "type": "unknown_field",
                    "field": field,
                    "message": f"Field '{field}' not defined in schema"
                })
        
        # Constraint validation
        for rule in schema["validation_rules"]:
            constraint_errors = validate_constraints(domain.get(rule["field"]), rule)
            domain_result["errors"].extend(constraint_errors)
        
        results.append(domain_result)
    
    return results
```

### 3. Validate Service Entries
```python
def validate_services(services, schema, domains):
    results = []
    domain_names = {d["name"] for d in domains}
    
    for service in services:
        service_result = {
            "name": service.get("name", "<unnamed>"),
            "domain": service.get("domain"),
            "source": service.get("_source_file", "inline"),
            "errors": [],
            "warnings": []
        }
        
        # Required field check
        for required_field in schema["required_fields"]:
            if required_field not in service:
                service_result["errors"].append({
                    "type": "missing_required",
                    "field": required_field,
                    "message": f"Required field '{required_field}' is missing"
                })
        
        # Domain reference validation
        if service.get("domain") and service["domain"] not in domain_names:
            service_result["errors"].append({
                "type": "invalid_reference",
                "field": "domain",
                "value": service["domain"],
                "message": f"Domain '{service['domain']}' does not exist"
            })
        
        # Type and constraint validation
        for field, value in service.items():
            if field.startswith("_"):
                continue
            
            field_schema = schema["properties"].get(field)
            if field_schema:
                type_errors = validate_type(value, field_schema)
                service_result["errors"].extend(type_errors)
        
        results.append(service_result)
    
    return results
```

### 4. Validate Microservice Entries
```python
def validate_microservices(microservices, schema, services, domains):
    results = []
    service_names = {s["name"] for s in services}
    domain_names = {d["name"] for d in domains}
    
    for ms in microservices:
        ms_result = {
            "name": ms.get("name", "<unnamed>"),
            "service": ms.get("service"),
            "domain": ms.get("domain"),
            "source": ms.get("_source_file", "inline"),
            "errors": [],
            "warnings": []
        }
        
        # Required field check
        for required_field in schema["required_fields"]:
            if required_field not in ms:
                ms_result["errors"].append({
                    "type": "missing_required",
                    "field": required_field,
                    "message": f"Required field '{required_field}' is missing"
                })
        
        # Service reference validation
        if ms.get("service") and ms["service"] not in service_names:
            ms_result["errors"].append({
                "type": "invalid_reference",
                "field": "service",
                "value": ms["service"],
                "message": f"Service '{ms['service']}' does not exist"
            })
        
        # Domain reference validation (if explicit)
        if ms.get("domain") and ms["domain"] not in domain_names:
            ms_result["errors"].append({
                "type": "invalid_reference",
                "field": "domain",
                "value": ms["domain"],
                "message": f"Domain '{ms['domain']}' does not exist"
            })
        
        # Path validation
        if ms.get("path"):
            if not exists(ms["path"]):
                ms_result["warnings"].append({
                    "type": "path_not_found",
                    "field": "path",
                    "value": ms["path"],
                    "message": f"Path '{ms['path']}' does not exist"
                })
        
        results.append(ms_result)
    
    return results
```

### 5. Type Validation Helper
```python
def validate_type(value, field_schema):
    errors = []
    expected_type = field_schema.get("type")
    
    type_map = {
        "string": str,
        "integer": int,
        "number": (int, float),
        "boolean": bool,
        "array": list,
        "object": dict
    }
    
    if expected_type and expected_type in type_map:
        expected = type_map[expected_type]
        if not isinstance(value, expected):
            errors.append({
                "type": "type_mismatch",
                "expected": expected_type,
                "actual": type(value).__name__,
                "message": f"Expected {expected_type}, got {type(value).__name__}"
            })
    
    return errors
```

### 6. Constraint Validation Helper
```python
def validate_constraints(value, rule):
    errors = []
    
    if value is None:
        return errors  # Skip if no value (required check handles this)
    
    for constraint in rule.get("constraints", []):
        c_type = constraint["type"]
        c_value = constraint["value"]
        
        if c_type == "pattern" and isinstance(value, str):
            if not re.match(c_value, value):
                errors.append({
                    "type": "pattern_mismatch",
                    "field": rule["field"],
                    "pattern": c_value,
                    "value": value,
                    "message": f"Value '{value}' does not match pattern '{c_value}'"
                })
        
        elif c_type == "minLength" and isinstance(value, str):
            if len(value) < c_value:
                errors.append({
                    "type": "minLength_violation",
                    "field": rule["field"],
                    "minimum": c_value,
                    "actual": len(value),
                    "message": f"Value length {len(value)} is less than minimum {c_value}"
                })
        
        elif c_type == "enum":
            if value not in c_value:
                errors.append({
                    "type": "enum_violation",
                    "field": rule["field"],
                    "allowed": c_value,
                    "value": value,
                    "message": f"Value '{value}' not in allowed values: {c_value}"
                })
        
        elif c_type == "minimum" and isinstance(value, (int, float)):
            if value < c_value:
                errors.append({
                    "type": "minimum_violation",
                    "field": rule["field"],
                    "minimum": c_value,
                    "value": value,
                    "message": f"Value {value} is less than minimum {c_value}"
                })
    
    return errors
```

### 7. Cross-Reference Validation
```python
def validate_cross_references(lens_data, validate_refs=True):
    if not validate_refs:
        return []
    
    issues = []
    
    # Build reference maps
    domains = {d["name"]: d for d in lens_data["domains"]}
    services = {s["name"]: s for s in lens_data["services"]}
    microservices = {m["name"]: m for m in lens_data["microservices"]}
    
    # Check service -> domain references
    for service_name, service in services.items():
        domain_ref = service.get("domain")
        if domain_ref and domain_ref not in domains:
            issues.append({
                "type": "broken_reference",
                "from": f"service:{service_name}",
                "to": f"domain:{domain_ref}",
                "message": f"Service '{service_name}' references non-existent domain '{domain_ref}'"
            })
    
    # Check microservice -> service references
    for ms_name, ms in microservices.items():
        service_ref = ms.get("service")
        if service_ref and service_ref not in services:
            issues.append({
                "type": "broken_reference",
                "from": f"microservice:{ms_name}",
                "to": f"service:{service_ref}",
                "message": f"Microservice '{ms_name}' references non-existent service '{service_ref}'"
            })
    
    # Check for orphans (microservices/services not referenced)
    services_with_ms = set()
    for ms in microservices.values():
        if ms.get("service"):
            services_with_ms.add(ms["service"])
    
    for service_name in services:
        if service_name not in services_with_ms:
            issues.append({
                "type": "orphan",
                "entity": f"service:{service_name}",
                "message": f"Service '{service_name}' has no microservices"
            })
    
    return issues
```

### 8. Aggregate Validation Results
```yaml
validation_results:
  validated_at: ISO8601
  
  summary:
    total_entities: N
    valid_entities: N
    entities_with_errors: N
    entities_with_warnings: N
    total_errors: N
    total_warnings: N
    
  by_type:
    domains:
      total: N
      valid: N
      errors: N
      warnings: N
      
    services:
      total: N
      valid: N
      errors: N
      warnings: N
      
    microservices:
      total: N
      valid: N
      errors: N
      warnings: N
      
  cross_references:
    checked: boolean
    issues: N
    
  details:
    domains: [list of domain results]
    services: [list of service results]
    microservices: [list of ms results]
    cross_refs: [list of ref issues]
    
  overall_valid: boolean
  strict_mode_pass: boolean
```

### 9. Determine Overall Validity
```python
def determine_validity(results, strict_mode):
    total_errors = sum(
        len(r["errors"]) 
        for r in results["domains"] + results["services"] + results["microservices"]
    )
    total_warnings = sum(
        len(r["warnings"]) 
        for r in results["domains"] + results["services"] + results["microservices"]
    )
    
    # Basic validity: no errors
    basic_valid = total_errors == 0
    
    # Strict mode: no errors AND no warnings
    strict_valid = basic_valid and total_warnings == 0
    
    return {
        "overall_valid": basic_valid,
        "strict_mode_pass": strict_valid if strict_mode else None,
        "total_errors": total_errors,
        "total_warnings": total_warnings
    }
```

## Edge Cases and Failure Modes

| Condition | Action |
|-----------|--------|
| Malformed YAML in lens data | Skip entry, log as error |
| Circular references | Detect and report |
| Unknown field in data | Warn (not error) |
| Missing optional field | Ignore |
| Path doesn't exist | Warn (not error) |
| Very large validation set | Process in batches |
| Schema mismatch | Report detailed diff |

## Output
```yaml
validation_results:
  validated_at: ISO8601
  
  summary:
    total: N
    valid: N
    errors: N
    warnings: N
    
  overall_valid: boolean
  
  details:
    domains: [results]
    services: [results]
    microservices: [results]
    
  cross_references:
    issues: [list]
```
