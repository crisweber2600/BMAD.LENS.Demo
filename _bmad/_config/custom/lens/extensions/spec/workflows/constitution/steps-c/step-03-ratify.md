# Step 3: Ratify Constitution

Finalize and write the constitution file.

---

## Generate Constitution Document

**Using template and gathered data:**

```markdown
# {layer_type} Constitution: {constitution_name}

**Inherits From:** {parent_path | "None (root constitution)"}  
**Version:** 1.0.0  
**Ratified:** {today_date}  
**Last Amended:** {today_date}

---

## Preamble

{preamble}

---

## Articles

{for each article:}
### Article {roman_numeral}: {article_title}

{article_rule}

**Rationale:** {article_rationale}

**Evidence Required:** {article_evidence}

---

## Governance

### Amendment Process

Amendments to this constitution require:
1. Proposal with rationale
2. Impact assessment on child constitutions
3. Stakeholder review
4. Ratification by governance authority

### Inheritance

{if not Domain:}
This constitution inherits all articles from:
- {parent_constitution_path}

Child constitutions may:
- Add new articles
- Narrow scope of inherited articles (without contradiction)
- NOT contradict or remove inherited articles

{if Domain:}
As the root constitution, these articles apply to all child constitutions.
Child constitutions may add but not contradict these articles.

---

_Ratified on {today_date} by Scribe (Cornelius)_
```

---

## Preview

**Display to user:**
```
📜 **Constitution Ready for Ratification**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{show generated constitution}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Target Location:** {constitution_root}/{layer_path}/constitution.md

Ratify this constitution? [Y/N/Edit]
```

---

## Handle Response

**IF "Y" or "yes":**
- Write file to `{constitution_root}/{layer_path}/constitution.md`
- Update sidecar with operation log
- Display success message

**IF "N" or "no":**
- Discard draft
- Return to menu

**IF "Edit":**
- Ask what to change
- Loop back to appropriate step

---

## Success

```
✅ **Constitution Ratified**

📜 {layer_type} Constitution: {constitution_name}

Written to: {constitution_root}/{layer_path}/constitution.md

Articles: {count}
Inherits from: {parent_count} constitution(s)
Total governance: {total_article_count} articles

"We the engineers have established governance for {constitution_name}."

---

What's next?
- View resolved constitution → /scribe, resolve
- Check compliance → /scribe, compliance
- Return to menu → /scribe
```

---

## Update Sidecar

**Append to scribe-state.md:**
```yaml
- operation: create_constitution
  date: {today_date}
  constitution: {constitution_name}
  layer: {layer_type}
  articles: {count}
  path: {constitution_root}/{layer_path}/constitution.md
```
