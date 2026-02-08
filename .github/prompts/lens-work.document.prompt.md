```prompt
---
description: Regenerate docs from existing analysis results (generate-docs workflow)
---

Activate Scout agent and execute generate-docs:

1. Load agent: `_bmad/lens-work/agents/scout.agent.yaml`
2. Execute workflow `generate-docs`
3. Use prior analysis (`_memory/scout-sidecar/analysis/*.yaml`) as input
4. Render docs to canonical path with frontmatter

**Prerequisites:**
- `discover` (deep) should have produced analysis results
- If analysis missing, rerun discover

**Output Path:**
`{docs_output_path}/{domain}/{service}/`
- `architecture.md`
- `api-surface.md`
- `data-model.md`
- `integration-map.md`
- `onboarding.md`

**Decision Logic:**
- If docs exist: follow overwrite/merge/abort policy from preflight
- If analysis stale (>7 days): warn and suggest re-analyze
- If no API/model signals: write placeholders with "Not detected"

```
