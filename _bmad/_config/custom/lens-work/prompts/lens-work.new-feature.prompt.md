```prompt
---
description: Create new feature-level initiative with branch topology
---

Activate Compass agent and execute /new-feature:

1. Load agent: `_bmad/lens-work/agents/compass.agent.yaml`
2. Execute `/new-feature` command to create feature initiative
3. Router dispatches to `workflows/router/init-initiative/` workflow
4. Casey creates branch topology, Scout runs discovery
5. Route to `/pre-plan` phase

Use `#think` before defining feature scope or dependencies.

**Creates:**
- Initiative ID: `{sanitized_name}-{random}`
- Branch: `{domain_prefix}/{id}/base` → `{domain_prefix}/{id}/small-1`
- Two-file state:
  - `_bmad-output/lens-work/state.yaml` (active initiative pointer)
  - `_bmad-output/lens-work/initiatives/{initiative_id}.yaml` (initiative config)

**In-Scope Repos:** Target repo + declared deps from service map

```
