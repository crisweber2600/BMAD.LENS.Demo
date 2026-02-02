---
name: 'step-03-shard-propagate'
description: 'Shard large files and propagate to domain level'
nextStepFile: './step-04-report.md'
---

# Step 3: Shard & Propagate

## Goal
Shard large documentation files to maintain readability, then propagate updates to domain-level summaries. Ensure documentation hierarchy stays synchronized.

## Instructions

### 1. Analyze Document Sizes
```python
def analyze_doc_sizes(docs_path):
    size_analysis = []
    
    for doc_file in find_all_docs(docs_path):
        content = read_file(doc_file)
        lines = content.split("\n")
        
        size_analysis.append({
            "file": doc_file,
            "line_count": len(lines),
            "byte_size": len(content),
            "heading_count": count_headings(content),
            "requires_sharding": len(lines) > 500
        })
    
    return size_analysis
```

### 2. Identify Sharding Candidates
```yaml
sharding_criteria:
  max_lines: 500  # Configurable threshold
  max_bytes: 50000  # ~50KB
  
  shard_on:
    - pattern: "^## "  # H2 headings
      priority: 1
    - pattern: "^### "  # H3 headings (fallback)
      priority: 2
      
  preserve_together:
    - frontmatter
    - overview_section
    - table_of_contents
```

### 3. Shard Large Documents
```python
def shard_document(doc_path, max_lines=500):
    content = read_file(doc_path)
    lines = content.split("\n")
    
    if len(lines) <= max_lines:
        return None  # No sharding needed
    
    # Extract frontmatter
    frontmatter, body = extract_frontmatter(content)
    
    # Find H2 heading positions
    h2_positions = find_heading_positions(body, level=2)
    
    if len(h2_positions) < 2:
        # Not enough sections to shard meaningfully
        return None
    
    # Create shards
    shards = []
    base_name = get_basename(doc_path)
    
    for i, (start, end, heading) in enumerate(section_ranges(h2_positions)):
        shard_content = body[start:end]
        shard_name = slugify(heading)
        
        shard = {
            "index": i,
            "name": f"{base_name}-{shard_name}.md",
            "heading": heading,
            "content": shard_content,
            "line_count": len(shard_content.split("\n"))
        }
        shards.append(shard)
    
    # Create index document
    index_doc = create_shard_index(doc_path, shards, frontmatter)
    
    return {
        "original": doc_path,
        "index": index_doc,
        "shards": shards
    }
```

### 4. Create Shard Index Document
```markdown
---
generated: true
generator: lens-sync
timestamp: {ISO8601}
sharded: true
shard_count: {N}
---

# {Original Title}

> This document has been split into multiple parts for readability.

## Contents

{For each shard}
- [{shard.heading}](./{shard.name})
  - Lines: {shard.line_count}
  - Topics: {key topics in shard}
{End for}

## Quick Navigation

| Section | Description | Link |
|---------|-------------|------|
{Table of all shards}

## Overview
{Preserve original overview section}
```

### 5. Write Shards to Disk
```python
def write_shards(shard_result, output_dir):
    written = []
    
    # Create shards subdirectory
    shard_dir = f"{output_dir}/shards/"
    makedirs(shard_dir)
    
    # Write index document (replaces original)
    index_path = shard_result["original"]
    write_file(index_path, shard_result["index"])
    written.append({"type": "index", "path": index_path})
    
    # Write individual shards
    for shard in shard_result["shards"]:
        shard_path = f"{shard_dir}/{shard['name']}"
        
        # Add shard frontmatter
        shard_content = f"""---
generated: true
generator: lens-sync
parent: {shard_result['original']}
shard_index: {shard['index']}
---

{shard['content']}
"""
        write_file(shard_path, shard_content)
        written.append({"type": "shard", "path": shard_path})
    
    return written
```

### 6. Propagate to Domain Level
For each affected domain, create/update domain summary:

```python
def propagate_to_domain(domain_name, services, docs_path):
    # Load service summaries
    service_docs = {}
    for service in services:
        service_path = f"{docs_path}/services/{service}/"
        service_docs[service] = load_service_docs(service_path)
    
    # Generate domain summary
    domain_summary = generate_domain_summary(domain_name, service_docs)
    
    # Write domain summary
    domain_path = f"{docs_path}/domains/{domain_name}/"
    makedirs(domain_path)
    
    write_file(f"{domain_path}/overview.md", domain_summary["overview"])
    write_file(f"{domain_path}/services.md", domain_summary["services"])
    write_file(f"{domain_path}/architecture.md", domain_summary["architecture"])
    
    return domain_path
```

### 7. Generate Domain Overview
```markdown
---
generated: true
generator: lens-sync
timestamp: {ISO8601}
aggregation_type: domain
domain: {domain_name}
---

# {domain_name} Domain

## Overview
{domain.description from domain-map.yaml}

## Services

{For each service in domain}
### {service_name}
{service.description}

- **Microservices:** {count}
- **Total Endpoints:** {sum}
- **Key Technologies:** {list}

[Service Documentation](./services/{service}/)
{End for}

## Domain Architecture

```mermaid
graph TB
{Generate domain-level architecture diagram}
    subgraph {domain_name}
{For each service}        subgraph {service}
{For each MS}            {ms}[{ms}]
{End for}        end
{End for}    end
```

## Cross-Service Concerns
{Document shared patterns, data flows, etc.}

## Domain Metrics
| Metric | Value |
|--------|-------|
| Services | {N} |
| Microservices | {N} |
| Total Endpoints | {N} |
| Total Entities | {N} |
```

### 8. Update Domain Map References
If domain-map.yaml needs updates:

```yaml
domain_map_updates:
  - domain: platform
    updates:
      - field: docs_path
        value: "docs/lens-sync/domains/platform/"
      - field: last_sync
        value: ISO8601
```

### 9. Track Propagation Results
```yaml
propagation_results:
  propagated_at: ISO8601
  
  sharding:
    documents_analyzed: N
    documents_sharded: N
    shards_created: N
    shards:
      - original: string
        shard_count: N
        index_path: string
        shard_paths: [list]
        
  domain_propagation:
    domains_updated: N
    domains:
      - name: string
        services_included: [list]
        docs_generated:
          - overview.md
          - services.md
          - architecture.md
        output_path: string
        
  hierarchy_status:
    microservices: N docs
    services: N summaries
    domains: N summaries
    fully_synchronized: boolean
```

### 10. Validate Hierarchy Consistency
```python
def validate_hierarchy(docs_path):
    issues = []
    
    # Check all microservices have service parents
    for ms in find_microservice_docs(docs_path):
        service = get_service_for_ms(ms)
        if not exists_service_summary(service, docs_path):
            issues.append({
                "type": "orphan_microservice",
                "microservice": ms,
                "expected_service": service
            })
    
    # Check all services have domain parents
    for service in find_service_summaries(docs_path):
        domain = get_domain_for_service(service)
        if not exists_domain_summary(domain, docs_path):
            issues.append({
                "type": "orphan_service",
                "service": service,
                "expected_domain": domain
            })
    
    # Check cross-references are valid
    for doc in find_all_docs(docs_path):
        broken_links = find_broken_links(doc)
        for link in broken_links:
            issues.append({
                "type": "broken_link",
                "document": doc,
                "link": link
            })
    
    return issues
```

## Edge Cases and Failure Modes

| Condition | Action |
|-----------|--------|
| Doc too small to shard meaningfully | Skip sharding, keep as-is |
| No H2 headings for sharding | Try H3, or skip |
| Shard would break code blocks | Extend shard to include full block |
| Domain has no services | Create placeholder summary |
| Circular service references | Document, don't propagate circularly |
| Very deep hierarchy | Limit propagation depth |
| Shard links break | Update all references to old paths |

## Output
```yaml
propagation_results:
  propagated_at: ISO8601
  
  sharding:
    analyzed: N
    sharded: N
    details: [list]
    
  domains:
    updated: N
    details: [list]
    
  hierarchy:
    valid: boolean
    issues: [list]
    
  files_written: [list]
  files_modified: [list]
  
  warnings: [list]
```
