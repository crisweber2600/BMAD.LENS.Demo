# Getting Started with SPEC

Learn how to set up constitutional governance for your BMAD workflows.

---

## Prerequisites

- BMAD installed
- LENS module installed
- SPEC extension enabled

---

## Quick Start

### 1. Create Your First Constitution

Start with a Domain constitution that applies enterprise-wide:

```
scribe, constitution
```

Or use the command:
```
/constitution
```

Scribe will guide you through creating articles that define your governance rules.

### 2. Verify It Works

Check that your constitution is recognized:

```
scribe, resolve
```

You should see your domain constitution with its articles.

### 3. Use Familiar Commands

Now use Spec-Kit style commands — they'll automatically include your constitutional context:

```
/specify my-new-feature
```

The PRD will include a Constitutional Compliance section.

---

## Next Steps

- [Create service-level constitutions](constitution-guide.md#service-constitutions)
- [Run compliance checks](command-reference.md#compliance)
- [View examples](examples.md)

---

## Troubleshooting

### Constitution not found

Make sure your constitution is in the correct location:
- Default: `lens/constitutions/`
- Check your `constitution_root` configuration

### Inheritance not working

Ensure the `Inherits From:` path in your constitution points to an existing parent constitution.

---

_Documentation for SPEC extension — 2026-01-31_
