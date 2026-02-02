---
name: 'step-02-aggregate'
description: 'Aggregate microservice docs to service level'
nextStepFile: './step-03-shard-propagate.md'
---

# Step 2: Aggregate

## Goal
Roll up microservice documentation into service-level summaries. Combine related microservice docs while preserving traceability and avoiding information loss.

## Instructions

### 1. Load Service Definitions
```yaml
# From domain-map.yaml or service.yaml
service_definitions:
  - name: identity
    domain: platform
    microservices:
      - user-service
      - auth-service
      - session-service
    description: "Identity and authentication services"
    
  - name: payments
    domain: commerce
    microservices:
      - payment-gateway
      - billing-service
    description: "Payment processing services"
```

### 2. Identify Services Requiring Aggregation
From Step 1's `changed_microservices.by_service`:

```python
def filter_services_for_aggregation(changes_by_service):
    services_to_aggregate = []
    
    for service in changes_by_service:
        if service["aggregation_required"]:
            # Get all microservices in this service (not just changed ones)
            all_ms = get_service_microservices(service["name"])
            services_to_aggregate.append({
                "service": service["name"],
                "domain": service["domain"],
                "microservices": all_ms,
                "changed_microservices": service["microservices"]
            })
    
    return services_to_aggregate
```

### 3. Load Microservice Docs for Each Service
```python
def load_microservice_docs(service_name, microservices, docs_path):
    ms_docs = {}
    
    for ms in microservices:
        ms_path = f"{docs_path}/{ms}/"
        ms_docs[ms] = {
            "architecture": read_file_or_none(f"{ms_path}/architecture.md"),
            "api_surface": read_file_or_none(f"{ms_path}/api-surface.md"),
            "data_model": read_file_or_none(f"{ms_path}/data-model.md"),
            "integration_map": read_file_or_none(f"{ms_path}/integration-map.md"),
            "onboarding": read_file_or_none(f"{ms_path}/onboarding.md")
        }
    
    return ms_docs
```

### 4. Generate Service Architecture Summary
```markdown
---
generated: true
generator: lens-sync
timestamp: {ISO8601}
aggregation_type: service
service: {service_name}
domain: {domain_name}
---

# {service_name} Service Architecture

## Overview
{service.description}

## Microservices

{For each microservice}
### {ms_name}
{Extract overview section from ms architecture.md}

- **Tech Stack:** {summarize tech stack}
- **Pattern:** {architecture pattern}
- **Status:** {from lens metadata}

[Full Documentation](./{ms_name}/architecture.md)
{End for}

## Combined Technology Stack

| Technology | Used By | Version(s) |
|------------|---------|------------|
{Aggregate tech stacks from all microservices}
| Node.js | user-service, auth-service | 18.x, 20.x |
| PostgreSQL | user-service | 15 |
| Redis | auth-service, session-service | 7.x |

## Inter-Service Communication

```mermaid
graph LR
{Generate diagram showing microservice interactions}
    subgraph {service_name}
        MS1[user-service]
        MS2[auth-service]
        MS3[session-service]
    end
    
    MS1 --> MS2
    MS2 --> MS3
```

## Shared Patterns
{Identify common patterns across microservices}

## Service-Level Concerns
{Aggregate technical debt, quality signals, etc.}
```

### 5. Generate Service API Summary
```markdown
# {service_name} API Surface

## Overview
- **Total Microservices:** {N}
- **Total Endpoints:** {sum of all MS endpoints}

## API by Microservice

{For each microservice with API}
### {ms_name}
- **Base Path:** `{base_path}`
- **Endpoints:** {count}

#### Key Endpoints
{List top 5 endpoints or summary}

[Full API Documentation](./{ms_name}/api-surface.md)
{End for}

## Cross-Microservice Flows
{Document key API flows that span microservices}

### User Authentication Flow
1. `POST /auth/login` (auth-service)
2. `GET /users/{id}` (user-service)
3. `POST /sessions` (session-service)
```

### 6. Generate Service Data Model Summary
```markdown
# {service_name} Data Model

## Overview
- **Total Entities:** {sum across MS}
- **Shared Entities:** {entities used by multiple MS}

## Entity Distribution

| Entity | Microservice | Purpose |
|--------|--------------|----------|
{List all entities with their owning MS}

## Cross-Microservice Relationships

```mermaid
erDiagram
{Show relationships between entities in different MS}
    USER ||--o{ SESSION : "has"
    USER ||--o{ AUTH_TOKEN : "owns"
```

## Data Ownership
{Document which MS owns which data}
```

### 7. Generate Service Integration Summary
```markdown
# {service_name} Integration Map

## Overview
{Service-level integration summary}

## Combined Integration Diagram

```mermaid
graph TD
{Aggregate all integrations from MS}
    subgraph {service_name}
        MS1[user-service]
        MS2[auth-service]
    end
    
    subgraph External
        EXT1[Email Service]
        EXT2[SMS Gateway]
    end
    
    MS1 --> EXT1
    MS2 --> EXT2
```

## External Dependencies
{Consolidated list of external services}

## Internal Dependencies
{Dependencies on other services in the domain}
```

### 8. Preserve Traceability
Ensure all aggregated content links back to source:

```yaml
traceability:
  service: identity
  sources:
    - microservice: user-service
      docs_used:
        - architecture.md (lines 1-50)
        - api-surface.md (full)
      last_modified: ISO8601
      
    - microservice: auth-service
      docs_used:
        - architecture.md (lines 1-45)
        - api-surface.md (full)
      last_modified: ISO8601
```

### 9. Handle Aggregation Conflicts
```python
def resolve_aggregation_conflicts(ms_docs):
    conflicts = []
    
    # Detect version conflicts in shared dependencies
    dep_versions = {}
    for ms, docs in ms_docs.items():
        for dep, version in docs.get("dependencies", {}).items():
            if dep in dep_versions and dep_versions[dep] != version:
                conflicts.append({
                    "type": "version_conflict",
                    "dependency": dep,
                    "versions": {ms: version, **dep_versions}
                })
            dep_versions[dep] = version
    
    # Detect naming conflicts
    entity_names = {}
    for ms, docs in ms_docs.items():
        for entity in docs.get("entities", []):
            if entity["name"] in entity_names:
                conflicts.append({
                    "type": "naming_conflict",
                    "entity": entity["name"],
                    "microservices": [entity_names[entity["name"]], ms]
                })
            entity_names[entity["name"]] = ms
    
    return conflicts
```

### 10. Write Service Summaries
```yaml
output_paths:
  architecture: "{docs_output_folder}/{domain}/{service}/architecture.md"
  api_surface: "{docs_output_folder}/{domain}/{service}/api-surface.md"
  data_model: "{docs_output_folder}/{domain}/{service}/data-model.md"
  integration_map: "{docs_output_folder}/{domain}/{service}/integration-map.md"
```

### 11. Build Aggregation Results
```yaml
service_summaries:
  aggregated_at: ISO8601
  
  services:
    - name: identity
      domain: platform
      microservices_aggregated: [user-service, auth-service, session-service]
      docs_generated:
        - architecture.md
        - api-surface.md
        - data-model.md
        - integration-map.md
      conflicts_detected: N
      conflicts: [list]
      output_path: "{path}"
      
  totals:
    services_aggregated: N
    docs_generated: N
    conflicts_detected: N
```

## Edge Cases and Failure Modes

| Condition | Action |
|-----------|--------|
| Single microservice in service | Skip aggregation, link directly |
| Microservice doc missing | Aggregate available docs, warn about gaps |
| Conflicting versions | Document conflict, don't resolve |
| Very large aggregation | Consider sharding (next step) |
| Circular dependencies detected | Document, don't fail |
| Service definition missing | Warn, skip aggregation |

## Output
```yaml
service_summaries:
  aggregated_at: ISO8601
  
  services:
    - name: string
      domain: string
      microservices: [list]
      docs_generated: [list]
      output_path: string
      
  conflicts:
    - service: string
      type: version_conflict|naming_conflict
      details: {...}
      
  warnings: [list]
  
  propagation_needed:
    domains: [list of domains needing updates]
```
