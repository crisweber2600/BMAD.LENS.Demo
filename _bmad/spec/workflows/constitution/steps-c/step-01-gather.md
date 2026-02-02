# Step 1: Gather Constitution Requirements

Collect articles for a new constitution.

---

## Context Check

**Confirm with user:**
- Current LENS layer: `{current_layer}` 
- Constitution root: `{constitution_root}`
- Target path: `{constitution_root}/{layer_path}/constitution.md`

---

## Layer Selection

**Ask:**
```
📜 Creating a new constitution.

What layer is this constitution for?

1. **Domain** — Enterprise-wide rules (applies to everything)
2. **Service** — Service boundary rules (applies to service + all microservices)
3. **Microservice** — API/component rules (applies to microservice + features)
4. **Feature** — Feature-specific rules (narrowest scope)

[Enter 1-4 or layer name]
```

**Based on selection, set:**
- `{layer_type}` = Domain | Service | Microservice | Feature
- `{template_path}` = `{module_root}/data/constitution-templates/{layer_type}-constitution-template.md`

---

## Name the Constitution

**Ask:**
```
What name for this constitution?

Examples:
- "Acme Corp" (Domain)
- "ecommerce" (Service)  
- "checkout-api" (Microservice)
- "express-checkout" (Feature)
```

**Store as:** `{constitution_name}`

---

## Show Template

**Load:** `{template_path}`

**Display:**
```
📜 Here's the template structure for a {layer_type} constitution:

[Show template structure - Preamble, Articles, Governance]

I'll help you fill in each section.
```

---

## Gather Preamble

**Ask:**
```
**Preamble**

What is the purpose of this constitution? 
What should it ensure across all governed work?

(2-4 sentences describing the "why")
```

**Store as:** `{preamble}`

---

## Gather Articles

**Loop until user signals done:**

```
📋 **Article {n}: {title}**

1. What rule should this article establish?
2. What's the rationale? (Why does this rule exist?)
3. What evidence is required to satisfy this article?

[Enter article content, or "done" when finished]
```

**For each article, store:**
- `{article_title}`
- `{article_rule}`
- `{article_rationale}`
- `{article_evidence}`

---

## Minimum Articles Check

**IF article count < 3:**
```
⚠️ Constitutional best practice: At least 3 articles for meaningful governance.

Current: {count} articles

Add more articles? [Y/N]
```

---

## Proceed to Validation

**When complete:**
```
✅ Constitution draft ready:
- Name: {constitution_name}
- Layer: {layer_type}
- Articles: {count}

Proceeding to inheritance validation...
```

**LOAD:** `{installed_path}/steps-c/step-02-validate.md`
