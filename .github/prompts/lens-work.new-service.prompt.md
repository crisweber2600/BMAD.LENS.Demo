```prompt
---
description: Create new service-level initiative with branch topology
---

Activate Compass agent and execute #new-service:

1. Load agent: `_bmad/lens-work/agents/compass.agent.yaml`
2. Execute `#new-service` command to create service initiative
3. Casey creates branch topology, Scout runs discovery
4. Route to `/pre-plan` phase

Use `#think` before defining service boundaries or naming.

**Creates:**
- Initiative ID: `{sanitized_name}-{random}`
- Branch: `lens/{id}/base` → `small/p1`
- State file: `_bmad-output/lens-work/state.yaml`

**In-Scope Repos:** All repos in service

```
