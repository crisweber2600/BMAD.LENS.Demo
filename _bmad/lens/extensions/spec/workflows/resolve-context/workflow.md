---
name: resolve-context
description: Resolve constitutional context for current LENS layer
web_bundle: true
installed_path: '{project-root}/_bmad/lens/workflows/resolve-context'
---

# Resolve Constitutional Context

Internal workflow to resolve constitutional governance for the current LENS context.

## Purpose

This workflow is called automatically when LENS context is loaded. It extends the base `lens_context` with `constitutional_context`.

---

## EXECUTION

### 1. Get LENS Context

**Required from Navigator:**
```yaml
current_layer: {Domain | Service | Microservice | Feature}
layer_path: {path to current layer}
project_root: {project root}
```

### 2. Determine Constitution Root

**From SPEC config:**
```yaml
constitution_root: {config.constitution_root}
# Default: {project_root}/lens/constitutions
```

### 3. Build Inheritance Chain

**Walk from current to Domain:**

```
current_layer_path = layer_path
chain = []

WHILE current_layer_path:
  constitution_path = {constitution_root}/{current_layer_path}/constitution.md
  
  IF constitution exists at constitution_path:
    chain.push({
      layer: detect_layer_type(current_layer_path),
      path: constitution_path,
      content: parse_constitution(constitution_path)
    })
  
  current_layer_path = parent_path(current_layer_path)
  
# Reverse to get Domain-first order
chain = chain.reverse()
```

### 4. Parse Each Constitution

**Extract from each constitution file:**

```yaml
constitution:
  name: {from header}
  version: {from metadata}
  ratified: {from metadata}
  last_amended: {from metadata}
  inherits_from: {from metadata}
  articles:
    - id: "I"
      title: {article title}
      rule: {article text}
      rationale: {rationale text}
      evidence: {evidence requirement}
```

### 5. Merge Articles

**Merge order:** Domain articles first, then Service, then Microservice, then Feature.

```yaml
merged_articles: []

FOR each constitution IN chain:
  FOR each article IN constitution.articles:
    merged_articles.push({
      id: article.id,
      title: article.title,
      rule: article.rule,
      source: constitution.name,
      source_layer: constitution.layer
    })
```

### 6. Build Constitutional Context

**Output:**
```yaml
constitutional_context:
  resolved_constitution:
    summary: "{article_count} articles from {chain_count} constitution(s)"
    articles: {merged_articles}
    total_count: {merged_articles.length}
    sources:
      - name: {constitution_name}
        layer: {layer_type}
        articles: {count}
        path: {file_path}
  
  constitution_chain:
    - {domain_constitution_path}
    - {service_constitution_path}
    - {microservice_constitution_path}
    - {feature_constitution_path}
  
  constitution_article_count: {merged_articles.length}
  
  constitution_last_amended: {most_recent_date from all constitutions}
  
  constitution_depth: {chain.length}
```

---

## Error Handling

### No Constitution Found

```yaml
constitutional_context:
  resolved_constitution: null
  constitution_chain: []
  constitution_article_count: 0
  constitution_last_amended: null
  constitution_depth: 0
  status: "no_constitution"
```

### Partial Chain (Gaps)

If some layers have constitutions but others don't:
- Include only layers WITH constitutions
- Note gaps in `constitution_chain_gaps`

```yaml
constitutional_context:
  # ... normal fields ...
  constitution_chain_gaps:
    - layer: Service
      expected_path: {path}
      status: "missing"
```

### Parse Error

If constitution file is malformed:
```yaml
constitutional_context:
  status: "parse_error"
  error_details:
    file: {path}
    error: {message}
```

---

## Integration

This workflow is invoked by:
- LENS context-load workflow (automatic)
- Scribe agent (on demand)
- SPEC command router (before workflow execution)

---

_Internal workflow for SPEC constitutional context resolution_
