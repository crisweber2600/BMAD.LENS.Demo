# Step 2: Compliance Report

Generate and display the compliance report.

---

## Report Header

```
🧾 **Constitutional Compliance Review**

**Artifact:** {artifact_path}
**Type:** {artifact_type}
**Context:** {layer_path} ({layer_type})

**Checking against:** {constitution_count} constitution(s), {article_count} articles

**Date:** {today_date}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Verdict Banner

**IF PASS:**
```
✅ **VERDICT: COMPLIANT**

All {article_count} articles satisfied.
This artifact is cleared for implementation.
```

**IF CONDITIONAL_PASS:**
```
⚠️ **VERDICT: CONDITIONAL PASS**

{satisfied_count} satisfied, {not_verified_count} not verified, 0 violations.
Review unverified items before proceeding.
```

**IF FAIL:**
```
❌ **VERDICT: NON-COMPLIANT**

{violated_count} violation(s) detected.
This artifact requires remediation before implementation.
```

---

## Detailed Results

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Results by Article

{for each article:}

{status_icon} **Article {id}: {title}** — {status}

{if satisfied:}
   **Evidence:** {evidence_quote}
   **Location:** {location}

{if not_verified:}
   **Expected:** {expected_evidence}
   **Found:** No mention of {topic}
   **Recommendation:** Add section addressing {requirement}

{if violated:}
   **Issue:** {violation_description}
   **Location:** {location}
   **Required Action:** {remediation}

---
```

---

## Summary by Constitution

```
## Compliance by Source

**Domain Constitution ({domain_name}):**
- ✅ {satisfied}/{total} articles satisfied
- ⚠️ {not_verified} not verified
- ❌ {violated} violations

**Service Constitution ({service_name}):**
- ✅ {satisfied}/{total} articles satisfied
- ...

**Local Constitution ({local_name}):**
- ✅ {satisfied}/{total} articles satisfied
- ...
```

---

## Recommendations

**IF not_verified > 0:**
```
## Recommendations

The following items were not explicitly addressed in the artifact:

{for each not_verified:}
{n}. **{article_title}**
   - Add: {suggested_content}
   - Section: {suggested_location}
```

**IF violated > 0:**
```
## Required Remediations

The following violations must be resolved:

{for each violated:}
{n}. **{article_title}**
   - Issue: {issue}
   - Fix: {remediation}
   - Priority: {High | Medium}
```

---

## Save Report Option

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Save this report?

1. [Y] Save to {artifact_path}.compliance.md
2. [N] Don't save
3. [C] Save to custom location

[Enter selection]
```

**IF save:**
- Write report to file
- Add timestamp and artifact reference

---

## Audit Trail

Log `compliance-evaluated` through Tracey with:
- timestamp
- artifact_path
- artifact_type
- constitution_resolved
- pass_count
- warn_count
- fail_count
- initiative_id (required)

---

## Completion

```
Compliance check complete.

What's next?
{if violations:}
- Fix violations and re-check -> /compliance
{endif}
- View full constitution -> /resolve
- Return to menu -> H
```
