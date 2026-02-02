# Step 1: Check Compliance

Load artifact and evaluate against constitution.

---

## Get Artifact

**If not provided:**
```
🧾 **Constitutional Compliance Check**

Which artifact should I evaluate?

Options:
1. Enter file path (e.g., docs/prd-checkout.md)
2. Select artifact type:
   - [P] PRD
   - [A] Architecture document
   - [S] Story/Epic
   - [C] Code file

[Enter path or type]
```

**Validate artifact exists:**
- If path: Check file exists
- If type: Search common locations

---

## Load Artifact Content

**Read artifact file:**
```
Loading artifact: {artifact_path}

File size: {size}
Type: {detected_type}
```

**Parse artifact:**
- Extract sections/headers
- Identify key content areas
- Note any existing compliance sections

---

## Resolve Constitution

**Get resolved constitution for context:**
- Use resolve-constitution logic
- Get all applicable articles

```
Resolving constitution for {current_layer}...

Found {constitution_count} constitution(s):
- {constitution_list}

Total articles to check: {article_count}
```

---

## Evaluate Each Article

**For each article in resolved constitution:**

```
Evaluating Article {id}: {title}...
```

**Check artifact for:**
1. Direct mention of the requirement
2. Section addressing the topic
3. Evidence matching required evidence type
4. Implicit compliance through design

**Classification:**
- ✅ **Satisfied** — Clear evidence found
- ⚠️ **Not Verified** — Topic not addressed, may need attention
- ❌ **Violated** — Direct contradiction or explicit non-compliance

---

## Collect Results

**Store evaluation:**
```yaml
results:
  - article: "I"
    title: "{title}"
    status: satisfied | not_verified | violated
    evidence: "{quote or section reference}"
    location: "{line numbers or section}"
    notes: "{additional context}"
```

---

## Calculate Verdict

**Rules:**
- Any ❌ Violated → **FAIL**
- All ✅ Satisfied → **PASS**
- Mix of ✅ and ⚠️ → **CONDITIONAL PASS**

**Store:**
- `{verdict}` = PASS | CONDITIONAL_PASS | FAIL
- `{satisfied_count}`
- `{not_verified_count}`
- `{violated_count}`

---

## Proceed to Report

**LOAD:** `{installed_path}/steps-c/step-02-report.md`
