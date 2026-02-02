# TODO: Git-Lens

Development roadmap for git-lens module.

---

## Agents to Build

- [ ] Casey (Git Branch Orchestrator)
  - Use: `bmad:bmb:agents:agent-builder`
  - Spec: `agents/casey.spec.md`
- [ ] Tracey (State & Diagnostics Specialist)
  - Use: `bmad:bmb:agents:agent-builder`
  - Spec: `agents/tracey.spec.md`

---

## Workflows to Build

- [ ] init-initiative
  - Use: `bmad:bmb:workflows:workflow`
  - Spec: `workflows/init-initiative/init-initiative.spec.md`
- [ ] start-workflow
  - Use: `bmad:bmb:workflows:workflow`
  - Spec: `workflows/start-workflow/start-workflow.spec.md`
- [ ] finish-workflow
  - Use: `bmad:bmb:workflows:workflow`
  - Spec: `workflows/finish-workflow/finish-workflow.spec.md`
- [ ] start-phase
  - Use: `bmad:bmb:workflows:workflow`
  - Spec: `workflows/start-phase/start-phase.spec.md`
- [ ] finish-phase
  - Use: `bmad:bmb:workflows:workflow`
  - Spec: `workflows/finish-phase/finish-phase.spec.md`
- [ ] open-lead-review
  - Use: `bmad:bmb:workflows:workflow`
  - Spec: `workflows/open-lead-review/open-lead-review.spec.md`
- [ ] open-final-pbr
  - Use: `bmad:bmb:workflows:workflow`
  - Spec: `workflows/open-final-pbr/open-final-pbr.spec.md`
- [ ] status
  - Use: `bmad:bmb:workflows:workflow`
  - Spec: `workflows/status/status.spec.md`
- [ ] resume
  - Use: `bmad:bmb:workflows:workflow`
  - Spec: `workflows/resume/resume.spec.md`
- [ ] sync
  - Use: `bmad:bmb:workflows:workflow`
  - Spec: `workflows/sync/sync.spec.md`
- [ ] fix-state
  - Use: `bmad:bmb:workflows:workflow`
  - Spec: `workflows/fix-state/fix-state.spec.md`
- [ ] override
  - Use: `bmad:bmb:workflows:workflow`
  - Spec: `workflows/override/override.spec.md`
- [ ] reviewers
  - Use: `bmad:bmb:workflows:workflow`
  - Spec: `workflows/reviewers/reviewers.spec.md`
- [ ] recreate-branches
  - Use: `bmad:bmb:workflows:workflow`
  - Spec: `workflows/recreate-branches/recreate-branches.spec.md`
- [ ] archive
  - Use: `bmad:bmb:workflows:workflow`
  - Spec: `workflows/archive/archive.spec.md`

---

## Installation Testing

- [ ] Test installation with `bmad install lens`
- [ ] Verify module.yaml prompts work correctly
- [ ] Test installer.js

---

## Documentation

- [ ] Add troubleshooting section
- [ ] Document validation cascade examples
- [ ] Add branch topology diagram

---

## Next Steps

1. Build agents using create-agent workflow
2. Build workflows using create-workflow workflow
3. Test installation and functionality
4. Iterate based on testing

---

_Last updated: 2026-02-01_
