```prompt
---
description: Create new domain-level initiative with full branch topology
---

Activate Compass agent and execute #new-domain:

1. Load agent: `_bmad/lens-work/agents/compass.agent.yaml`
2. Execute `#new-domain` command to create domain initiative
3. Casey creates branch topology, Scout runs discovery
4. Route to `/pre-plan` phase

Use `#think` before defining domain boundaries or scope.

**Creates:**
- Initiative ID: `{sanitized_name}-{random}`
- Branch: `lens/{id}/base` → `small/p1`
- State file: `_bmad-output/lens-work/state.yaml`

**In-Scope Repos:** All repos in domain (or prompt "all vs subset")

```
