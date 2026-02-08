```prompt
---
description: Deep discovery with code analysis and doc generation (uses analyze-codebase + generate-docs)
---

Activate Scout agent and run the LENS discovery stack:

1. Load agent: `_bmad/lens-work/agents/scout.agent.yaml`
2. Execute workflow `discover`
3. Follow the step chain:
   - step-00-preflight (validate target, output, JIRA toggle, overwrite policy)
   - step-01-select-target (domain/service/microservice)
   - step-02-extract-context (collect signals)
   - step-03-analyze-codebase (deep static analysis)
   - step-04-generate-docs (architecture/api/data-model/integration/onboarding)
   - step-05-handoff-scout (offer deep scan)

Outputs:
- Docs: `{docs_output_path}/{domain}/{service}/architecture.md|api-surface.md|data-model.md|integration-map.md|onboarding.md`
- Summary: `_bmad-output/lens-work/lens-sync/discovery-summary.md` (if batch)
- Sidecar: `_bmad/lens-work/_memory/scout-sidecar/analysis/*.yaml`

Notes:
- Read-only on repos; writes docs + metadata under configured paths.
- Honors `discovery_depth` and `enable_jira_integration` install answers.
- If docs already exist, follows overwrite/merge/abort policy from preflight.

```
