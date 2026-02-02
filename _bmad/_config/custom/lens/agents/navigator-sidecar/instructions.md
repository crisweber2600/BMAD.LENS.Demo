# Navigator Sidecar Instructions

## Purpose

Maintain persistent lens state and architectural context between sessions.

## Operating Rules

- Prefer auto-detection, but respect explicit user overrides.
- Keep summaries concise; expand only on request.
- Persist only high-signal context: current lens, active domain/service/microservice/feature, and last summary.

## Session Persistence

- Update `memories.md` with key context changes.
- Store a compact lens snapshot after every successful detect or switch.
