# Command Reference

All SPEC commands and their BMAD workflow mappings.

---

## Scribe Agent Commands

### [CN] Constitution

Create or amend a constitution at the current LENS layer.

```
scribe, constitution
```

**Modes:**
- `[C] Create` — New constitution
- `[A] Amend` — Modify existing

---

### [RS] Resolve

Display the resolved constitution for current context.

```
scribe, resolve
```

Shows all inherited articles merged from Domain to current layer.

---

### [CC] Compliance

Run compliance check against an artifact.

```
scribe, compliance
```

Evaluates a PRD, architecture doc, or story against constitutional rules.

---

### [AN] Ancestry

Display constitution inheritance chain.

```
scribe, ancestry
```

Shows heritage tree with ratification dates and article counts.

---

## Spec-Kit Compatible Commands

These commands route to BMAD workflows with constitutional context injected.

### /specify

```
/specify {feature-name}
```

**Routes to:** `create-prd`
**Injects:** constitutional_context, lens_context

Creates a PRD with constitutional compliance section.

---

### /plan

```
/plan {feature-name}
```

**Routes to:** `create-architecture`
**Injects:** constitutional_context, lens_context

Creates architecture documentation with governance considerations.

---

### /tasks

```
/tasks {feature-name}
```

**Routes to:** `create-epics-stories` → `create-story × N`
**Injects:** constitutional_context, lens_context

Full feature population:
1. Generate epics
2. Generate stories for each epic
3. Output `epics-and-stories.md` + story files

---

### /story

```
/story {story-name}
```

**Routes to:** `create-story`
**Injects:** constitutional_context, lens_context

Creates a single story with constitutional context.

---

### /implement

```
/implement {story-name}
```

**Routes to:** `dev-story`
**Injects:** constitutional_context, lens_context

Runs compliance pre-check before implementation.

---

### /review

```
/review {artifact-path}
```

**Routes to:** `code-review`
**Injects:** constitutional_context

Reviews code against constitutional rules.

---

## Configuration

### constitution_root

Where constitutions are stored.

**Default:** `lens/constitutions`

### auto_compliance_check

Run compliance check before workflow execution.

**Default:** `true`

### strict_mode

Block execution if no constitution exists.

**Default:** `false`

---

_Command Reference for SPEC — 2026-01-31_
