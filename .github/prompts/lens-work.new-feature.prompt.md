```prompt
---
description: Create new feature-level initiative with branch topology
---

Activate Compass agent and execute #new-feature:

1. Load agent: `_bmad/lens-work/agents/compass.agent.yaml`
2. Execute `#new-feature` command to create feature initiative
3. Casey creates branch topology, Scout runs discovery
4. Route to `/pre-plan` phase

Use `#think` before defining feature scope or dependencies.

**Creates:**
- Initiative ID: `{sanitized_name}-{random}`
- Branch: `lens/{id}/base` → `small/p1`
- State file: `_bmad-output/lens-work/state.yaml`

**In-Scope Repos:** Target repo + declared deps from service map

```
