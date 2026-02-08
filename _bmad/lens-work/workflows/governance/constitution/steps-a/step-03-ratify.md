# Step 3: Ratify Amendment

Validate and apply the amendment.

---

## Inheritance Validation

**For Add/Modify operations:**

Same validation as create mode:
- Check against parent articles
- Flag contradictions
- Require resolution before proceeding

**For Clarify/Deprecate:**
- No inheritance check needed (doesn't change rule substance)

---

## Impact Assessment

**Check for child constitutions:**

```
🔍 **Impact Assessment**

Checking for child constitutions that may be affected...

{if children found:}
Found {count} child constitution(s):
- {child_path_1} ({child_articles_1} articles)
- {child_path_2} ({child_articles_2} articles)

This amendment may affect inherited governance in these constitutions.

{if no children:}
No child constitutions found. Amendment affects only this layer.
```

---

## Version Increment

**Calculate new version:**
- Add article: Minor version bump (1.0.0 → 1.1.0)
- Modify rule: Minor version bump
- Clarify: Patch version bump (1.0.0 → 1.0.1)
- Deprecate: Minor version bump

**New version:** `{new_version}`

---

## Preview Amendment

```
📜 **Amendment Preview**

**Constitution:** {constitution_name}
**Amendment Type:** {type}
**Version:** {old_version} → {new_version}

---

**Change:**

{show diff or new content}

---

**Amendment Record:**
```yaml
amendment:
  date: {today_date}
  type: {Add | Modify | Clarify | Deprecate}
  article: {article_title}
  version: {old_version} → {new_version}
  author: Scribe
```

---

Ratify this amendment? [Y/N/Edit]
```

---

## Handle Response

**IF "Y":**
1. Update constitution file
2. Increment version
3. Update "Last Amended" date
4. Add amendment record to governance section
5. Log `constitution-amended` via Tracey
6. Request Casey commit with governance-prefixed message

**IF "N":**
- Discard changes
- Return to menu

**IF "Edit":**
- Return to step-02-modify.md

---

## Apply Amendment

**Update constitution file:**
- Apply the change
- Update version header
- Update "Last Amended" header
- Append to Amendment History section:

```markdown
## Amendment History

### Amendment {n} ({today_date})
- **Type:** {type}
- **Article:** {article_title}
- **Change:** {description}
- **Version:** {old_version} → {new_version}
```

---

## Success

```
✅ **Amendment Ratified**

📜 {layer_type} Constitution: {constitution_name}

Amendment applied:
- Type: {type}
- Article: {article_title}
- New Version: {new_version}

"Let the record show this amendment was duly ratified on {today_date}."

---

What's next?
- View resolved constitution -> /resolve
- Make another amendment -> /constitution
- Return to menu -> H
```

---

## Audit Trail

Record amendment using governance event type `constitution-amended` with:
- timestamp
- layer
- name
- amendment_summary
- articles_added
- articles_modified
- git_commit_sha
