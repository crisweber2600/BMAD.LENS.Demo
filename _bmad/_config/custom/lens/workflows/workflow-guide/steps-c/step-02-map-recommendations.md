---
name: 'step-02-map-recommendations'
description: 'Map lens to recommended workflows'
nextStepFile: './step-03-present-guidance.md'
---

# Step 2: Map Recommendations

## Goal
Map the lens and phase to recommended workflows.

---

## SKIP IF SETUP INCOMPLETE

**IF `setup_complete` is false:**
- Skip this step
- Pass control to step-03 to display setup-only guidance

---

## Instructions

**IF setup is complete:**

Use lens and phase mapping to recommend workflows:

### Lens-Based Recommendations

| Lens | Recommended Workflows |
|------|----------------------|
| **Domain** | onboarding, domain-map, lens-configure, discovery workflows |
| **Service** | service-registry, new-service, architecture planning |
| **Microservice** | new-microservice, impact-analysis, implementation workflows |
| **Feature** | new-feature, context-load, QA/testing workflows |
| **Unknown** | lens-detect, onboarding, lens-configure |

### Phase-Based Recommendations

Prioritize workflows aligned to detected BMAD phase:
- **Analysis** → Discovery, domain mapping, context research
- **Planning** → Architecture, PRD, epic/story creation
- **Implementation** → New feature/microservice, coding workflows
- **QA** → Testing, compliance-check, validation workflows

### Output

Generate prioritized list:
```
recommendations = [
  { workflow: "workflow-name", priority: "high|medium|low", reason: "why relevant" },
  ...
]
```

## Output
- `recommendations`: Array of workflow objects
