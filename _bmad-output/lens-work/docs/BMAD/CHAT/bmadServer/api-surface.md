---
repo: bmadServer
remote: https://github.com/crisweber2600/bmadServer.git
default_branch: main
generated_at: 2026-02-09T00:00:00Z
domain: BMAD
service: CHAT
generator: adversarial-fix (scout-verified)
confidence: 0.95
---

# bmadServer — API Surface (Verified)

> **This file replaces the original api-surface.md which had fabricated endpoints.**
> See [adversarial-fix-report.md](../../adversarial-fix-report.md) for details.

**Total Endpoints:** 63 REST + SignalR Hub
**Auth:** JWT Bearer tokens (`Authorization: Bearer <token>`)
**Error Format:** RFC 7807 ProblemDetails
**Documentation:** Swagger/OpenAPI at `/swagger`

## Controllers (11) — Verified from Source

### AuthController
**Route:** `api/v1/auth`

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `api/v1/auth/register` | Anonymous | Create user (bcrypt hash) → JWT + refresh token |
| POST | `api/v1/auth/login` | Anonymous | Validate credentials → JWT + refresh token (HttpOnly cookie) |
| POST | `api/v1/auth/refresh` | Anonymous | Rotate refresh token → New JWT + new refresh token |
| GET | `api/v1/auth/me` | JWT | Return current user from JWT claims |
| POST | `api/v1/auth/logout` | JWT | Revoke refresh token |

### ChatController
**Route:** `api/chat`

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `api/chat/history` | JWT | Get chat message history |
| GET | `api/chat/recent` | JWT | Get recent chat messages |

**NOTE:** Previous api-surface.md listed 7 fabricated endpoints (sessions, messages, stream). The actual controller has only these 2 endpoints.

### WorkflowsController
**Route:** `api/v1/workflows` (1,196 lines)

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `api/v1/workflows/definitions` | JWT | List workflow definitions |
| GET | `api/v1/workflows` | JWT | List workflow instances |
| POST | `api/v1/workflows` | JWT | Create new workflow instance |
| GET | `api/v1/workflows/{id}` | JWT | Get workflow by ID |
| POST | `api/v1/workflows/{id}/start` | JWT | Start workflow execution |
| POST | `api/v1/workflows/{id}/steps/execute` | JWT | Execute current workflow step |
| POST | `api/v1/workflows/{id}/pause` | JWT | Pause workflow |
| POST | `api/v1/workflows/{id}/resume` | JWT | Resume paused workflow |
| POST | `api/v1/workflows/{id}/cancel` | JWT | Cancel workflow |
| POST | `api/v1/workflows/{id}/steps/current/skip` | JWT | Skip current step |
| POST | `api/v1/workflows/{id}/steps/{stepId}/goto` | JWT | Jump to specific step |
| POST | `api/v1/workflows/{id}/participants` | JWT | Add participant |
| GET | `api/v1/workflows/{id}/participants` | JWT | List participants |
| DELETE | `api/v1/workflows/{id}/participants` | JWT | Remove participant |
| GET | `api/v1/workflows/{id}/contributions` | JWT | Get contribution metrics |

### DecisionsController
**Route:** `api/v1` (1,423 lines)

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `api/v1/workflows/{id}/decisions` | JWT | List decisions for workflow |
| POST | `api/v1/decisions` | JWT | Create decision |
| GET | `api/v1/decisions/{id}` | JWT | Get decision by ID |
| PUT | `api/v1/decisions/{id}` | JWT | Update decision |
| GET | `api/v1/decisions/{id}/history` | JWT | Get decision version history |
| POST | `api/v1/decisions/{id}/revert` | JWT | Revert to previous version |
| GET | `api/v1/decisions/{id}/diff` | JWT | Compare decision versions |
| POST | `api/v1/decisions/{id}/lock` | JWT | Lock decision for editing |
| POST | `api/v1/decisions/{id}/unlock` | JWT | Unlock decision |
| POST | `api/v1/decisions/{id}/request-review` | JWT | Request decision review |
| POST | `api/v1/reviews/{id}/respond` | JWT | Respond to review request |
| GET | `api/v1/decisions/{id}/review` | JWT | Get review for decision |
| POST | `api/v1/decisions/{id}/review-response` | JWT | Submit review response |
| GET | `api/v1/workflows/{workflowId}/conflicts` | JWT | List conflicts for workflow decisions |
| GET | `api/v1/workflows/{workflowId}/conflicts/{conflictId}` | JWT | Get specific conflict |
| POST | `api/v1/workflows/{workflowId}/conflicts` | JWT | Create conflict |
| GET | `api/v1/conflict-rules` | JWT | List conflict rules |
| POST | `api/v1/conflict-rules` | JWT | Create conflict rule |
| DELETE | `api/v1/conflict-rules/{id}` | JWT | Delete conflict rule |

### CheckpointsController
**Route:** `api/v1/workflows/{workflowId}/checkpoints`

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `api/v1/workflows/{workflowId}/checkpoints` | JWT | List checkpoints |
| GET | `api/v1/workflows/{workflowId}/checkpoints/{id}` | JWT | Get checkpoint by ID |
| POST | `api/v1/workflows/{workflowId}/checkpoints` | JWT | Create checkpoint |
| POST | `api/v1/workflows/{workflowId}/checkpoints/{id}/restore` | JWT | Restore from checkpoint |
| POST | `api/v1/workflows/{workflowId}/inputs/queue` | JWT | Queue input for workflow |

### ConflictsController
**Route:** `api/v1/workflows/{workflowId}/conflicts`

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `api/v1/workflows/{workflowId}/conflicts` | JWT | List conflicts |
| GET | `api/v1/workflows/{workflowId}/conflicts/{id}` | JWT | Get conflict details |
| POST | `api/v1/workflows/{workflowId}/conflicts/{id}/resolve` | JWT | Resolve conflict |

### UsersController
**Route:** `api/v1/users`

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `api/v1/users/me` | JWT | Get current user profile |
| PATCH | `api/v1/users/me/persona` | JWT | Update user persona |
| GET | `api/v1/users/{id}/profile` | JWT | Get user profile by ID |

### RolesController
**Route:** `api/v1/users/{userId}/roles`

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `api/v1/users/{userId}/roles` | JWT | List user roles |
| POST | `api/v1/users/{userId}/roles` | JWT | Assign role to user |
| DELETE | `api/v1/users/{userId}/roles/{role}` | JWT | Remove role from user |

### TranslationsController
**Route:** `api/v1/translations`

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `api/v1/translations/mappings` | JWT | List translation mappings |
| POST | `api/v1/translations/mappings` | JWT | Create translation mapping |
| PUT | `api/v1/translations/mappings/{id}` | JWT | Update translation mapping |
| DELETE | `api/v1/translations/mappings/{id}` | JWT | Delete translation mapping |

### BmadSettingsController
**Route:** `api/bmad`

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `api/bmad/settings` | JWT | Get BMAD settings |
| PUT | `api/bmad/settings` | JWT | Update BMAD settings |

### CopilotTestController
**Route:** `api/copilottest`

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `api/copilottest/test` | JWT | Test Copilot SDK integration |
| GET | `api/copilottest/health` | JWT | Check Copilot SDK health |

## Real-Time API (SignalR)

### ChatHub
**Route:** `/hubs/chat`
**Auth:** JWT via `access_token` query string parameter
**Protocol:** WebSocket (with fallback)

| Method | Direction | Purpose |
|--------|-----------|---------|
| `SendMessage` | Client → Server | Send chat message |
| `JoinSession` | Client → Server | Join a session |
| `LeaveSession` | Client → Server | Leave a session |
| `TypingIndicator` | Client → Server | Typing state |

## Route Summary (Verified)

| Controller | Route Prefix | Endpoints | Auth |
|-----------|-------------|-----------|------|
| AuthController | `api/v1/auth` | 5 | Mixed |
| ChatController | `api/chat` | 2 | JWT |
| WorkflowsController | `api/v1/workflows` | 15 | JWT |
| DecisionsController | `api/v1` | 19 | JWT |
| CheckpointsController | `api/v1/workflows/{wid}/checkpoints` | 5 | JWT |
| ConflictsController | `api/v1/workflows/{wid}/conflicts` | 3 | JWT |
| UsersController | `api/v1/users` | 3 | JWT |
| RolesController | `api/v1/users/{uid}/roles` | 3 | JWT |
| TranslationsController | `api/v1/translations` | 4 | JWT |
| BmadSettingsController | `api/bmad` | 2 | JWT |
| CopilotTestController | `api/copilottest` | 2 | JWT |
| **TOTAL** | | **63** | |

## Authentication / Authorization

| Aspect | Implementation |
|--------|---------------|
| Scheme | JWT Bearer (v10.0.2) |
| Token issuance | `JwtTokenService` |
| Password hashing | BCrypt via `PasswordHasher` |
| Refresh tokens | `RefreshTokenService` (rotation, HttpOnly cookies) |
| RBAC | Role-based via `RolesController` + `UserRole` entity |
| Validation | FluentValidation (assembly scanning) |
| Rate Limiting | AspNetCoreRateLimit (IP-based) |
| Error Format | RFC 7807 ProblemDetails |
