# Examples & Use Cases

This section provides practical examples for using Git-Lens.

---

## Example Workflow

**Scenario:** New service "payment-gateway"

1. User runs `#file:new-service "payment-gateway"`
2. Git-Lens creates:
   - `lens/pmt-gateway-a3f2b9/base`
   - `lens/pmt-gateway-a3f2b9/small`
   - `lens/pmt-gateway-a3f2b9/lead`
   - `lens/pmt-gateway-a3f2b9/small/p1`
3. User starts discovery workflow
4. Git-Lens creates `small/p1/w/discovery`
5. User completes workflow → Git-Lens prints PR link to `small/p1`
6. Next workflow is blocked until PR merged (or override)

---

## Common Scenarios

- **Blocked workflow:** Run `@tracey ST` to see blocking PR and merge state.
- **Remote changes missing:** Run `@tracey SY` to fetch and re-validate.
- **State corruption:** Run `@tracey FIX` to recover from event log (mock roster data at `test-data/mock-compass.csv`).

---

## Tips & Tricks

- Use `commit_strategy=prompt` to control commits per workflow.
- Keep `fetch_strategy=background` for fast validation.
- Use `@tracey OVERRIDE` sparingly and always with a reason.

---

## Troubleshooting

### Common Issues

- **No remote configured:** Git-Lens will create branches locally. Set a remote and run `@tracey SY`.
- **Shallow clone:** Run `git fetch --unshallow` or use `@tracey OVERRIDE` if validation fails.
- **Detached HEAD:** Checkout a branch before starting workflows.

---

## Getting More Help

- Review module configuration in module.yaml
- Check agent specs for exact command triggers
- Consult BMAD documentation
