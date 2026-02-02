# Getting Started with Git-Lens

Welcome to Git-Lens! This guide will help you get up and running.

---

## What This Module Does

Git-Lens automates git branching, merge gating, and PR routing for LENS planning workflows. It enforces sequential workflow completion, creates predictable branch topology, and provides clear PR links and reviewer suggestions.

---

## Installation

```bash
bmad install lens
```

Enable the Git-Lens extension when prompted and configure its settings.

---

## First Steps

1. Start a LENS workflow (`#file:new-service`, `#file:new-feature`, or `#file:new-microservice`).
2. Git-Lens initializes the initiative branch topology.
3. Run your LENS workflows as usual; Git-Lens manages workflow branches and PR gating.
4. Use Tracey (State Manager) for status (`ST`), sync (`SY`), or recovery (`FIX`).

---

## Common Use Cases

- Enforce "one workflow at a time" discipline with merge validation
- Provide clear PR routing for phases and reviews
- Recover state after interruptions or errors

---

## What's Next?

- Check out the [Agents Reference](agents.md) to meet Casey and Tracey
- Browse the [Workflows Reference](workflows.md) to see Git-Lens capabilities
- See [Examples](examples.md) for real-world usage patterns

---

## Need Help?

If you run into issues:
1. Run `@tracey ST` to view current status
2. Run `@tracey SY` to sync and re-validate
3. Run `@tracey FIX` to recover state
