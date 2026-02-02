---
name: 'step-02-generate'
description: 'Generate documentation artifacts'
nextStepFile: './step-03-report.md'
---

# Step 2: Generate Docs

## Goal
Create documentation artifacts from `analysis_inputs`, producing production-quality markdown documentation with diagrams, tables, and cross-references.

## Instructions

### 1. Initialize Generation Context
```yaml
generation_context:
  target: from analysis_inputs.target
  doc_scope: from analysis_inputs.doc_scope
  output_dir: "{target.path}/"  # docs inline with source
  
  style_config:
    heading_style: atx  # # not underlines
    list_style: dashes  # - not *
    code_fence_style: triple-backtick
    max_line_width: 120
    
  generation_timestamp: ISO8601
```

### 2. Generate architecture.md
Primary architectural overview document.

**Structure:**
```markdown
---
generated: true
generator: lens-sync
timestamp: {ISO8601}
target: {target.name}
doc_type: architecture
---

# {target.name} Architecture

## Overview
{2-3 sentence summary from context or inference}

## Technology Stack

### Primary Stack
- **Language:** {tech_stack.language} {tech_stack.version}
- **Framework:** {tech_stack.framework} {tech_stack.framework_version}
- **Runtime:** {tech_stack.runtime}

### Key Dependencies
| Dependency | Version | Purpose |
|------------|---------|---------|
| {name} | {version} | {purpose} |

## Architecture Pattern
{architecture.pattern with expanded description}

### Detected Patterns
{List patterns_detected with descriptions}

## Related Documentation
- [API Surface](./api-surface.md)
- [Data Model](./data-model.md)
- [Integration Map](./integration-map.md)
- [Onboarding Guide](./onboarding.md)
```

### 3. Generate api-surface.md
API endpoint documentation.

**Skip if:** `analysis_inputs.api_surface` missing or empty.

```markdown
# {target.name} API Surface

## Overview
- **Base Path:** `{api_surface.base_path}`
- **Total Endpoints:** {api_surface.total_endpoints}

## Endpoint Groups

{For each group}
### {group.prefix}
{group.purpose}

#### `{method}` `{path}`
- **Handler:** `{handler}` ([{file}:{line}](link))
- **Auth Required:** {auth_required}

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
```

### 4. Generate data-model.md
Entity and data structure documentation with ER diagrams.

**Skip if:** `analysis_inputs.data_models` missing or empty.

```markdown
# {target.name} Data Model

## Entity Relationship Diagram

```mermaid
erDiagram
    {entities and relationships}
```

## Entities
{For each entity: fields table, validations, source links}

## DTOs
{For each dto: fields table}

## Enumerations
{For each enum: values table}
```

### 5. Generate integration-map.md
External and internal integration documentation.

**Skip if:** `analysis_inputs.integrations` mostly empty.

```markdown
# {target.name} Integration Map

## Integration Diagram

```mermaid
graph LR
    subgraph Target
        SERVICE[{target.name}]
    end
    
    {http_clients, message_queues, internal_services}
```

## External Services
{For each: base URL, usage, auth method}

## Message Queues / Event Streams
{For each: type, direction, topic}

## Internal Service Dependencies
{For each: purpose, communication method}
```

### 6. Generate onboarding.md
Developer quick-start guide.

```markdown
# {target.name} Onboarding Guide

## Quick Start

### Prerequisites
{Inferred from tech_stack}

### Setup
```bash
{install commands}
{config steps}
{run command}
```

## Development Workflow
{test, build, lint commands}

## Key Concepts
{From context.key_themes if available}
```

### 7. Apply Overwrite Policy
```yaml
overwrite_modes:
  overwrite: Replace file entirely
  merge: Preserve manual sections, update generated
  preserve: Only create if file doesn't exist
```

**Merge logic:**
```python
def merge_preserving_manual_sections(existing, generated):
    manual_sections = find_sections_without_generated_marker(existing)
    merged = generated
    for section in manual_sections:
        merged = append_section(merged, section)
    return merged
```

### 8. Track Results
```yaml
generation_results:
  target: string
  generated_at: ISO8601
  
  docs_generated:
    - doc: architecture.md
      path: string
      status: success
      
  docs_skipped:
    - doc: data-model.md
      reason: "No data models detected"
      
  warnings: [list]
```

## Edge Cases and Failure Modes

| Condition | Action |
|-----------|--------|
| Output dir not writable | FAIL with clear error |
| Partial data for doc | Generate with placeholders + warning |
| Mermaid diagram too complex | Simplify to top-level |
| Merge conflict | Keep both versions with markers |
| Very large API surface | Paginate or summarize |

## Output
```yaml
doc_outputs:
  target: string
  generated_at: ISO8601
  
  summary:
    docs_generated: N
    docs_skipped: N
    warnings_count: N
    
  files:
    - doc: string
      path: string
      status: success|skipped|error
      
  warnings: [list]
```
