# TODO: LENS: Layered Enterprise Navigation System

Development roadmap for unified LENS module (merged from lens + lens-sync).

---

## Agents to Build

### Navigation & Context
- [x] Navigator (Architectural Context Navigator)
  - Spec: `agents/navigator.spec.md`

### Discovery & Synchronization
- [x] Bridge (The Synchronizer)
  - Spec: `agents/bridge.spec.md`
- [x] Scout (Discovery Specialist)
  - Spec: `agents/scout.spec.md`
- [x] Link (Lens Guardian)
  - Spec: `agents/link.spec.md`

**Status:** All 4 agents built and tested.

---

## Workflows to Build

### Navigation & Context (MVP1)
- [x] lens-detect
  - Spec: `workflows/lens-detect/lens-detect.spec.md`
- [x] lens-switch
  - Spec: `workflows/lens-switch/lens-switch.spec.md`
- [x] context-load
  - Spec: `workflows/context-load/context-load.spec.md`
- [x] lens-restore
  - Spec: `workflows/lens-restore/lens-restore.spec.md`
- [x] lens-configure
  - Spec: `workflows/lens-configure/lens-configure.spec.md`
- [x] workflow-guide
  - Spec: `workflows/workflow-guide/workflow-guide.spec.md`

### Discovery & Synchronization
- [x] bootstrap
  - Spec: `workflows/bootstrap/bootstrap.spec.md`
- [x] discover
  - Spec: `workflows/discover/discover.spec.md`
- [x] analyze-codebase
  - Spec: `workflows/analyze-codebase/analyze-codebase.spec.md`
- [x] generate-docs
  - Spec: `workflows/generate-docs/generate-docs.spec.md`
- [x] sync-status
  - Spec: `workflows/sync-status/sync-status.spec.md`
- [x] reconcile
  - Spec: `workflows/reconcile/reconcile.spec.md`
- [x] update-lens
  - Spec: `workflows/update-lens/update-lens.spec.md`
- [x] validate-schema
  - Spec: `workflows/validate-schema/validate-schema.spec.md`
- [x] rollback
  - Spec: `workflows/rollback/rollback.spec.md`

### Advanced Features
- [x] domain-map
  - Spec: `workflows/domain-map/domain-map.spec.md`
- [x] impact-analysis
  - Spec: `workflows/impact-analysis/impact-analysis.spec.md`
- [x] new-service
  - Spec: `workflows/new-service/new-service.spec.md`
- [x] new-microservice
  - Spec: `workflows/new-microservice/new-microservice.spec.md`
- [x] new-feature
  - Spec: `workflows/new-feature/new-feature.spec.md`
- [x] lens-sync
  - Spec: `workflows/lens-sync/lens-sync.spec.md`
- [x] service-registry
  - Spec: `workflows/service-registry/service-registry.spec.md`
- [x] onboarding
  - Spec: `workflows/onboarding/onboarding.spec.md`

**Status:** All 22 workflows built and tested.

---

## Integration Tasks (Post-Merge)

### Module Structure
- [x] Merge module.yaml configurations (navigation + discovery settings)
- [x] Move lens-sync workflows to lens/workflows/
- [x] Move lens-sync agents to lens/agents/
- [x] Merge lens-sync docs to lens/docs/
- [ ] Update all internal path references (prompts, workflow specs)
- [ ] Verify no broken links between agents and workflows

### Configuration & State
- [x] Unified module.yaml with all settings
- [ ] Merge lens-config.yaml and lens-sync config patterns
- [ ] Update lens-session.yaml schema for both features
- [ ] Document config override precedence

### Documentation
- [x] Update README.md to cover full module scope
- [ ] Update agents.md to document all 4 agents
- [ ] Update workflows.md to organize by feature set
- [ ] Update architecture.md for merged module
- [ ] Verify all doc cross-references are correct
- [ ] Add migration guide for users of separate extension

### Testing
- [ ] Test installation with merged module
- [ ] Verify all workflow handoffs work correctly
- [ ] Test agent interaction across boundaries
- [ ] Run full regression test suite
- [ ] Validate fixture tests still pass

---

## Quality & Review

- [x] Run Party Mode multi-agent review on merged specs
- [x] Run adversarial review on merged documentation
- [ ] Update spec-completeness checklist for all agents/workflows
- [ ] Verify all inputs/outputs documented

---

## Installation Testing

- [x] Test installation with `bmad install lens` 
- [x] Verify module.yaml prompts work correctly
- [x] Test installer.js functionality
- [ ] Test installer with merged module configuration
- [ ] Verify upgrade path from separate extension

---

## Next Steps

1. Update all internal path references in prompts and specs
2. Verify navigation workflows still work correctly
3. Verify discovery workflows still work correctly
4. Run full regression test suite
5. Remove extension folder after validation
6. Update installation documentation

---

## Known Issues

- None at this time

---

## Ongoing Improvements

- Monitor user feedback from merged module
- Optimize workflows based on usage patterns
- Add additional discovery capabilities as needed
- Enhance sync reliability for large codebases

---

_Last updated: 2026-02-01_
_Merged from: lens (2026-01-31) + lens-sync (2026-01-31)_
