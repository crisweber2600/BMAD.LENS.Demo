# Workflows Reference

Git-Lens includes 15 workflows:

---

## Core (Auto-Triggered)

- **init-initiative** — Create branch topology and state
- **start-workflow** — Create workflow branch with validation
- **finish-workflow** — Smart commit, push, and PR link output
- **start-phase** — Create/checkout phase branch
- **finish-phase** — Push phase branch and output PR link
- **open-lead-review** — PR link for small → lead review
- **open-final-pbr** — PR link for lead → base final PBR

---

## Diagnostics (Tracey)

- **status** — Display state + topology
- **resume** — Rehydrate session and checkout branch
- **sync** — Fetch and re-validate
- **fix-state** — Recovery cascade
- **override** — Manual override with reason
- **reviewers** — Suggest reviewers from Compass
- **recreate-branches** — Recreate missing branches
- **archive** — Archive completed initiative

---

Each workflow is currently a spec placeholder to be implemented via workflow-builder.
