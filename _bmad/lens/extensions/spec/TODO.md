# TODO: SPEC Module

Development roadmap for SPEC (Specification-Driven Enterprise Compass).

---

## Phase 1: Constitution + LENS Integration

### Agent to Build

- [x] Scribe (Constitutional Guardian)
  - Use: `bmad:bmb:agents:agent-builder`
  - Spec: `agents/scribe.spec.md`
  - Output: `agents/scribe/scribe.agent.yaml`

### Workflows to Build

- [x] constitution
  - Use: `bmad:bmb:workflows:workflow`
  - Spec: `workflows/constitution/constitution.spec.md`
  - Steps: `steps-c/` (create), `steps-a/` (amend)
- [x] resolve-constitution
  - Use: `bmad:bmb:workflows:workflow`
  - Spec: `workflows/resolve-constitution/resolve-constitution.spec.md`
  - Steps: `steps-c/step-01-resolve.md`
- [x] compliance-check
  - Use: `bmad:bmb:workflows:workflow`
  - Spec: `workflows/compliance-check/compliance-check.spec.md`
  - Steps: `steps-c/step-01-check.md`, `step-02-report.md`
- [x] ancestry
  - Use: `bmad:bmb:workflows:workflow`
  - Spec: `workflows/ancestry/ancestry.spec.md`
  - Steps: `steps-c/step-01-display.md`

### Templates to Create

- [x] domain-constitution-template.md
- [x] service-constitution-template.md
- [x] microservice-constitution-template.md
- [x] feature-constitution-template.md

### LENS Integration

- [x] Add `resolved_constitution` to LENS context exports
- [x] Add `constitution_chain` to LENS context exports
- [x] Add `constitution_article_count` to LENS context exports
- [x] Add `constitution_last_amended` to LENS context exports
- [x] Implement inheritance resolution logic
  - `data/context-extension.md` — Context variable definitions
  - `workflows/resolve-context/` — Resolution workflow

---

## Phase 2: Command Router + Orchestration

### Command Routing

- [ ] `/specify` → `create-prd` with constitution injection
- [ ] `/plan` → `create-architecture` with constitution injection
- [ ] `/tasks` → orchestrated epic/story generation
- [ ] `/story` → `create-story` with constitution injection
- [ ] `/implement` → `dev-story` with compliance pre-check
- [ ] `/review` → `code-review` with constitution injection

### Orchestration

- [ ] `/tasks` full feature population workflow
- [ ] Compliance pre-checks before workflow execution

---

## Phase 3: Template Enhancement (Optional)

- [ ] Add compliance sections to PRD templates
- [ ] Add compliance sections to architecture templates
- [ ] Null-safe handling for missing constitutions
- [ ] JIRA integration for spec linkage

---

## Documentation

- [ ] Complete getting-started.md
- [ ] Complete constitution-guide.md
- [ ] Complete command-reference.md
- [ ] Complete examples.md

---

## Testing & QA

- [ ] Test installation with `bmad install lens`
- [ ] Test constitution CRUD operations
- [ ] Test inheritance resolution
- [ ] Test command routing
- [ ] Test compliance checks

---

## Next Steps

1. ~~Build Scribe agent using agent-builder workflow~~ ✅ DONE
2. ~~Build core workflows (constitution, resolve, compliance, ancestry)~~ ✅ DONE
3. ~~Create constitution templates~~ ✅ DONE
4. ~~Implement LENS context exports~~ ✅ DONE
5. Test installation and functionality

---

_Last updated: 2026-01-31_
