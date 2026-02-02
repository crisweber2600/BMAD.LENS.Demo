# Constitutional Context Extension

SPEC extends LENS context with constitutional governance data.

---

## Extended Context Variables

When SPEC is installed, these variables are added to `lens_context`:

```yaml
# Constitutional Context Extension
constitutional_context:
  resolved_constitution:
    description: "Accumulated constitutional rules for current context"
    type: object
    source: runtime
    properties:
      summary: "Brief governance summary"
      articles: "Array of all applicable articles"
      total_count: "Number of articles"
      sources: "Constitution files contributing"

  constitution_chain:
    description: "Inheritance-ordered constitution file paths"
    type: array
    source: runtime
    items: "File paths from Domain to current layer"
    
  constitution_article_count:
    description: "Total articles (own + inherited)"
    type: integer
    source: runtime
    default: 0

  constitution_last_amended:
    description: "Most recent amendment date across all constitutions"
    type: string
    source: runtime
    format: "YYYY-MM-DD"
    default: null

  constitution_depth:
    description: "Number of constitutions in inheritance chain"
    type: integer
    source: runtime
    default: 0
```

---

## Resolution Algorithm

### On Context Load

1. Get current LENS layer from Navigator
2. Determine constitution root path: `{constitution_root}/{layer_path}`
3. Walk inheritance chain (current → Domain)
4. For each layer with constitution:
   - Parse constitution file
   - Extract articles
   - Record metadata (version, dates)
5. Merge articles (parent-first order)
6. Return `constitutional_context`

### Resolution Order

```
Domain Constitution (root)
    ↓ inherit
Service Constitution
    ↓ inherit
Microservice Constitution
    ↓ inherit
Feature Constitution (most specific)
```

---

## Context Injection Points

SPEC injects `constitutional_context` into these BMAD workflows:

| Workflow | Injection Point | Purpose |
|----------|-----------------|---------|
| `create-prd` | Template context | Compliance section in PRD |
| `create-architecture` | Template context | Architecture constraints |
| `create-epics-stories` | Step context | Story governance |
| `create-story` | Template context | Acceptance criteria governance |
| `dev-story` | Pre-check | Compliance validation |
| `code-review` | Review context | Constitutional requirements |

---

## Template Variables

Templates can access constitutional context:

```handlebars
{{#if constitutional_context}}
## Constitutional Governance

This work is governed by {{constitutional_context.constitution_depth}} constitution(s).

**Articles in Effect:** {{constitutional_context.constitution_article_count}}

{{#each constitutional_context.resolved_constitution.articles}}
- Article {{this.id}}: {{this.title}} (from {{this.source}})
{{/each}}
{{/if}}
```

---

## Null-Safe Handling

When no constitution exists:

```yaml
constitutional_context:
  resolved_constitution: null
  constitution_chain: []
  constitution_article_count: 0
  constitution_last_amended: null
  constitution_depth: 0
```

Templates should check: `{{#if constitutional_context.resolved_constitution}}`

---

## Performance

- Constitution resolution cached per session
- Cache invalidated on:
  - Constitution file changes
  - LENS layer switch
  - Explicit refresh request

---

_Context extension defined for SPEC module_
