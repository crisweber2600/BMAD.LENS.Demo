# Party Mode Adversarial Review — Sprint S001-S012

## Participants
- **PM** — scope, milestones, risk, and acceptance-criteria coverage
- **Architect** — data flow, integration contracts, consistency, patterns
- **Dev** — implementation quality, edge cases, error handling, performance
- **QA** — testability, validation gaps, missing coverage

## Summary

This is a structurally competent first pass that ships a functional CRUD layer across 6 controllers with feature-flag gating, collaboration event auto-emission, and a frontend service/hook migration. However, it contains at least one **critical security vulnerability** (refresh token plaintext leak), several **major data-integrity and performance issues** (unbounded queries, N+1 eager-loads, soft-delete leaks, vote-race conditions), and a concerning gap between the test coverage claimed (137 OpenAPI annotations, 8 feature-flag tests) and the actual depth of those tests (no negative-path, no concurrency, no data-integrity tests whatsoever). The implementation is consistent in style but consistently repeats the same anti-patterns across every controller.

---

## Findings

### Finding 1: Refresh Token Plaintext Stored in Cookie During Rotation

**Severity:** :red_circle: Critical  
**Reporter:** Dev  
**File(s):** [AuthCompatController.cs](TargetProjects/BMAD/CHAT/bmadServer/src/bmadServer.ApiService/Controllers/SparkCompat/AuthCompatController.cs#L270)  
**Issue:** In the `Refresh()` endpoint, after `ValidateAndRotateAsync` returns a new `RefreshToken` entity, the code sets the cookie value to `newToken.TokenHash`:

```csharp
Response.Cookies.Append("refreshToken", newToken.TokenHash, GetRefreshTokenCookieOptions());
```

During `SignUp` and `SignIn`, the cookie is set to `plainRefreshToken` (the raw value before hashing). But during refresh/rotation, the **hash** is sent back to the client as the cookie value. This means either:

1. The next refresh call will fail because the server will hash-the-hash and not find a match, or  
2. If it somehow works, the **hash itself** is being treated as the token, which defeats the purpose of hashing (an attacker who reads the DB now has the cookie value directly).

This is a **token-handling logic bug that breaks refresh rotation or leaks hash material**.

**Recommendation:** Return the new plaintext token from `ValidateAndRotateAsync` (as a second return value) and set that in the cookie, exactly as `SignUp`/`SignIn` do. The hash should never leave the server.

---

### Finding 2: Unbounded Query in Collaboration Events — 500 Row Hard Limit is Still Dangerous

**Severity:** :red_circle: Critical  
**Reporter:** Architect  
**File(s):** [CollaborationEventsCompatController.cs](TargetProjects/BMAD/CHAT/bmadServer/src/bmadServer.ApiService/Controllers/SparkCompat/CollaborationEventsCompatController.cs#L55-L63)  
**Issue:** The `GetEvents` endpoint has a `.Take(500)` ceiling with no offset/pagination parameters exposed to the client. If the `since` parameter is omitted, the query scans the **entire events table** (which grows with every auth, chat, PR, and decision action), applies a LINQ `StartsWith` filter via `typePrefixes.Any(...)` which **cannot be translated to SQL efficiently** by EF Core (it will likely pull all rows into memory), then takes the first 500.

Furthermore, the `typePrefixes.Any(prefix => evt.Type.StartsWith(prefix))` pattern generates a WHERE clause with a correlated subquery or client-side evaluation, depending on the EF provider — PostgreSQL's `npgsql` may or may not translate this.

**Recommendation:**  
1. Require `since` or default it to `DateTime.UtcNow.AddHours(-24)`.  
2. Add proper `limit`/`offset` pagination like every other controller.  
3. Replace the `typePrefixes.Any(...)` LINQ with a manual `OR` chain or use `EF.Functions.Like`.

---

### Finding 3: N+1 Query Pattern — Every PR Query Eager-Loads All Related Data

**Severity:** :yellow_circle: Major  
**Reporter:** Dev  
**File(s):** [PullRequestsCompatController.cs](TargetProjects/BMAD/CHAT/bmadServer/src/bmadServer.ApiService/Controllers/SparkCompat/PullRequestsCompatController.cs#L788-L797)  
**Issue:** `BuildPullRequestQuery()` always includes `.Include(pr => pr.FileChanges).Include(pr => pr.Comments).Include(pr => pr.LineComments).ThenInclude(line => line.Reactions)`. This is used for **every** endpoint — including `ListPullRequests` which returns a paginated list.

For a list of 50 PRs, this means EF generates JOINs against file changes, comments, line comments, AND reactions — a Cartesian explosion. A single PR with 20 files, 30 comments, and 50 line comments with reactions produces thousands of rows in the SQL result set.

**Recommendation:** Create separate query methods: `BuildListQuery()` (no includes) and `BuildDetailQuery()` (full includes). The list endpoint only needs `FilesChangedCount` which can be computed via a subquery `.Select(pr => new { pr, FileCount = pr.FileChanges.Count })`.

---

### Finding 4: Decision Vote Race Condition — Read-Modify-Write Without Concurrency Control

**Severity:** :yellow_circle: Major  
**Reporter:** Architect  
**File(s):** [decision.service.ts](TargetProjects/BMAD/CHAT/bmad-chat/src/lib/services/decision.service.ts#L96-L120)  
**Issue:** `voteOnOption` reads the current decision value from the client-side `DecisionRecord`, modifies the `options` array (toggling a vote), then PATCHes the entire `value` JSON back. If two users vote simultaneously:

1. User A reads value with `{votes: 3, voters: [a,b,c]}`  
2. User B reads the same value  
3. User A writes `{votes: 4, voters: [a,b,c,A]}`  
4. User B writes `{votes: 4, voters: [a,b,c,B]}` — **User A's vote is lost**

The backend `UpdateDecision` endpoint has no optimistic concurrency check (no `If-Match` / ETag / version comparison). The `CurrentVersion` is incremented server-side but never validated against the client's known version.

**Recommendation:**  
1. Send the expected `version` in the PATCH request.  
2. Backend should reject updates where `request.Version != decision.CurrentVersion` with 409 Conflict.  
3. Alternatively, implement voting as a dedicated atomic endpoint (`POST /v1/decisions/:id/vote`) that handles the toggle server-side.

---

### Finding 5: Soft-Delete Leaks in Chat Messages and List Queries

**Severity:** :yellow_circle: Major  
**Reporter:** QA  
**File(s):** [ChatsCompatController.cs](TargetProjects/BMAD/CHAT/bmadServer/src/bmadServer.ApiService/Controllers/SparkCompat/ChatsCompatController.cs#L66-L68), [ChatsCompatController.cs](TargetProjects/BMAD/CHAT/bmadServer/src/bmadServer.ApiService/Controllers/SparkCompat/ChatsCompatController.cs#L242-L245)  
**Issue:** Multiple soft-delete inconsistencies:

1. **ListChats** fetches `Include(chat => chat.Messages)` but does NOT filter `IsDeleted` on messages — if messages ever get soft-deleted, they leak through.  
2. **ListMessages** queries `SparkCompatMessages` directly but SparkCompatMessage has no `IsDeleted` field, so there's no mechanism to soft-delete individual messages.  
3. **DeleteChat** soft-deletes the chat, but the **messages remain queryable** via direct DB queries or if someone constructs the URL `GET /v1/chats/{id}/messages` — the `ListMessages` endpoint checks `chatExists` using `!c.IsDeleted`, so this is actually fine. However, any other code that queries `SparkCompatMessages` by `ChatId` directly would find orphaned messages.

4. More critically: The `ListChats` query does `Include(Messages)` + `Where(!IsDeleted)` but the `Include` is placed BEFORE the `Where`, and both are on the same entity. The `.Include` loads ALL messages eagerly for every chat in the paginated result. Combined with a 50-chat page size, this is a data explosion.

**Recommendation:**  
1. Remove `.Include(chat => chat.Messages)` from `ListChats` — the `MapChat` method shouldn't need full message history for a list view.  
2. Create a lightweight `MapChatSummary` that only includes message count and last message timestamp.  
3. Add a global query filter for soft-delete: `modelBuilder.Entity<SparkCompatChat>().HasQueryFilter(c => !c.IsDeleted)`.

---

### Finding 6: No Password Strength Validation

**Severity:** :yellow_circle: Major  
**Reporter:** PM  
**File(s):** [AuthCompatController.cs](TargetProjects/BMAD/CHAT/bmadServer/src/bmadServer.ApiService/Controllers/SparkCompat/AuthCompatController.cs#L65-L72)  
**Issue:** The SignUp endpoint validates that email, password, and name are non-empty, but imposes **zero password strength requirements**. A single-character password like `"a"` is accepted. The test file confirms this — tests use `"SecurePass123!"` but the code doesn't enforce minimum length, complexity, or any rules.

This is a fundamental security gap that the PM should have caught in AC review — "auth endpoints" AC presumably includes basic credential hygiene.

**Recommendation:** Add minimum password length (8+), and optionally complexity requirements. Use `DataAnnotations` or FluentValidation on the request DTO, or validate inline before hashing.

---

### Finding 7: Decision ListDecisions Has No Pagination and No Total Count

**Severity:** :yellow_circle: Major  
**Reporter:** PM  
**File(s):** [DecisionCenterCompatController.cs](TargetProjects/BMAD/CHAT/bmadServer/src/bmadServer.ApiService/Controllers/SparkCompat/DecisionCenterCompatController.cs#L56-L63)  
**Issue:** `ListDecisions` loads **all** decisions for a chat with no `limit`/`offset` parameters, and the response DTO (`DecisionListDto`) has no `Total`, `Limit`, or `Offset` fields. Every other list endpoint (chats, PRs, messages, events) follows the pagination pattern. Decisions break the contract.

As the DecisionCenter accumulates decisions over a chat's lifetime, this unbounded query will degrade. The frontend polls this endpoint every 7 seconds — so this is 7-second recurring full-table scans per active chat.

**Recommendation:** Add `limit`/`offset` query parameters matching the established pattern. Add `Total` to the response DTO. Consider `status` filter (open/locked/closed) to reduce payload.

---

### Finding 8: Frontend Polling Without Cleanup Race in useDecisions

**Severity:** :yellow_circle: Major  
**Reporter:** Dev  
**File(s):** [use-decisions.ts](TargetProjects/BMAD/CHAT/bmad-chat/src/hooks/use-decisions.ts#L39-L50)  
**Issue:** The `useEffect` in `useDecisions` sets up a 7-second interval that calls `DecisionService.listDecisions(chatId)` directly (bypassing the `loadDecisions` callback), then calls `setDecisions`. Problems:

1. **Stale closure on `chatId`:** The interval captures `chatId` from render. If `chatId` changes rapidly, old intervals fire with stale IDs before cleanup runs.  
2. **No abort controller:** If the component unmounts mid-fetch, the `.then(setDecisions)` fires on an unmounted component — React 18+ batch may swallow this silently, but in React 19 strict mode this could trigger warnings.  
3. **Double-fetch on mount:** `loadDecisions(chatId)` is called at the top, then the interval starts immediately. If the interval fires before the initial load completes, you get concurrent fetches that race to `setDecisions`.
4. **Silent error swallowing:** The poll catch block `() => {/* silent poll failure */}` hides network errors indefinitely. A broken auth token means the user sees no feedback while decisions silently stop updating.

**Recommendation:**  
1. Use `AbortController` with `signal` passed to fetch.  
2. Add a `useRef` for the latest `chatId` to avoid stale closures.  
3. Delay the first interval tick or deduplicate with the initial load.  
4. After N consecutive silent failures, show a toast or degrade gracefully.

---

### Finding 9: Integration Tests Are Shallow — Only Feature Flag Gating, No CRUD Paths

**Severity:** :yellow_circle: Major  
**Reporter:** QA  
**File(s):** [SparkCompatFeatureFlagTests.cs](TargetProjects/BMAD/CHAT/bmadServer/src/bmadServer.Tests/Integration/SparkCompatFeatureFlagTests.cs)  
**Issue:** The 8 integration tests cover exactly one thing: "when a feature flag is off, the endpoint returns 404." Plus one presence happy-path test. There are **zero** integration tests for:

- Chat CRUD lifecycle (create → update → delete → verify soft-delete)
- Message send/receive flow
- PR create → approve → merge lifecycle with status transition validation
- Decision create → vote → lock → conflict → resolve flow
- Line comment threading (parent-child relationships)
- Auth refresh token rotation
- Error paths (invalid input, 409 conflicts, 403 forbidden)
- Concurrent vote/update scenarios

The claim of "137 OpenAPI annotations" is annotations, not tests. Annotations make Swagger pretty; they don't validate behavior.

**Recommendation:** Add lifecycle integration tests for each controller: at minimum a happy-path CRUD test and a negative-path test per controller (6×2 = 12 tests minimum). Prioritize the auth refresh-token rotation test given Finding 1.

---

### Finding 10: Frontend-Backend Type Contract Mismatch on Decision Value

**Severity:** :yellow_circle: Major  
**Reporter:** Architect  
**File(s):** [decision.service.ts](TargetProjects/BMAD/CHAT/bmad-chat/src/lib/services/decision.service.ts#L56-L72), [DecisionCenterCompatController.cs](TargetProjects/BMAD/CHAT/bmadServer/src/bmadServer.ApiService/Controllers/SparkCompat/DecisionCenterCompatController.cs#L109-L113)  
**Issue:** The frontend `DecisionService.createDecision` sends a structured `DecisionValue` object as the `value` field:

```typescript
const value: DecisionValue = {
  question, options: [...], decisionType, context, stage: 'proposed', resolvedOptionId: null
}
body: { chatId, title: question, value, reason: 'ui-create' }
```

The backend `CreateDecisionRequest` declares `Value` as `JsonElement` and stores it via `request.Value.GetRawText()`. This means the backend is a **dumb JSON blob store** with zero validation of the value's schema. If the frontend sends a malformed value (missing `options`, wrong types), the backend happily persists it, and the frontend will crash when it tries to render it later.

There's no shared schema, no validation, no contract enforcement. The frontend's `DecisionValue` type is the only guard, and TypeScript types evaporate at runtime.

**Recommendation:**  
1. Define a server-side `DecisionValueDto` with proper deserialization and validation.  
2. Validate `options.length >= 2`, `question` is non-empty, `decisionType` is in the allowed set.  
3. Return 400 for malformed value JSON.

---

### Finding 11: Missing Authorization on Close PR and Resolve Line Comment

**Severity:** :yellow_circle: Major  
**Reporter:** Dev  
**File(s):** [PullRequestsCompatController.cs](TargetProjects/BMAD/CHAT/bmadServer/src/bmadServer.ApiService/Controllers/SparkCompat/PullRequestsCompatController.cs#L336-L360), [PullRequestsCompatController.cs](TargetProjects/BMAD/CHAT/bmadServer/src/bmadServer.ApiService/Controllers/SparkCompat/PullRequestsCompatController.cs#L450-L472)  
**Issue:**  
1. `ClosePullRequest` does **not** call `GetCurrentUserAsync()` or check any role. Any authenticated user can close any PR.  
2. `ResolveLineComment` similarly does not verify the caller — any authenticated user can resolve any comment on any PR.

Compare with `ApprovePullRequest` and `MergePullRequest` which both enforce `CanReviewAsync`. The inconsistency means a viewer-role user who can't comment or approve CAN close the PR or resolve comments.

**Recommendation:** Add `GetCurrentUserAsync()` + authorization checks to both endpoints. At minimum, close should require author or admin. Resolve should require author-of-comment or admin.

---

### Finding 12: EmitCollaborationEvent Duplicated Across 3 Controllers

**Severity:** :green_circle: Minor  
**Reporter:** Architect  
**File(s):** [AuthCompatController.cs](TargetProjects/BMAD/CHAT/bmadServer/src/bmadServer.ApiService/Controllers/SparkCompat/AuthCompatController.cs#L280-L310), [ChatsCompatController.cs](TargetProjects/BMAD/CHAT/bmadServer/src/bmadServer.ApiService/Controllers/SparkCompat/ChatsCompatController.cs#L420-L453), [PullRequestsCompatController.cs](TargetProjects/BMAD/CHAT/bmadServer/src/bmadServer.ApiService/Controllers/SparkCompat/PullRequestsCompatController.cs#L800-L835)  
**Issue:** The `EmitCollaborationEventAsync` / `BroadcastPullRequestEventAsync` / `PublishDecisionEventAsync` methods are copy-pasted across Auth, Chats, PR, and Decision controllers. Each has slight variations in the SignalR payload shape. This violates DRY and makes the event contract fragile — a field name change in one copy won't propagate to others.

**Recommendation:** Extract a shared `ICollaborationEventPublisher` service. Inject it into each controller. Single source of truth for event structure and SignalR broadcasting.

---

### Finding 13: DecisionCenterPanel Hardcodes `currentUserId = 'current-user'`

**Severity:** :green_circle: Minor  
**Reporter:** QA  
**File(s):** [DecisionCenterPanel.tsx](TargetProjects/BMAD/CHAT/bmad-chat/src/components/DecisionCenterPanel.tsx#L651)  
**Issue:** The `DecisionCenterPanel` component accepts a `currentUserId` prop with a default value of `'current-user'`. If the parent component doesn't pass the actual user ID (which depends on how `App.tsx` wires it), votes will be recorded as `'current-user'` — a string literal that won't match any real user ID. The vote toggle logic checks `opt.voters.includes(userId)`, so with a fake ID, un-voting would never work.

Checking App.tsx: the `useDecisions` hook is called only with `activeChat`, and the `currentUserId` is not explicitly passed to `DecisionCenterPanel` in the rendered JSX — confirming this is likely using the default.

**Recommendation:** Ensure `currentUserId` is passed from `currentUser.id` in App.tsx. Remove the default value or make the prop required.

---

### Finding 14: ListChats Loads All Messages Eagerly For Pagination

**Severity:** :green_circle: Minor  
**Reporter:** Dev  
**File(s):** [ChatsCompatController.cs](TargetProjects/BMAD/CHAT/bmadServer/src/bmadServer.ApiService/Controllers/SparkCompat/ChatsCompatController.cs#L66-L68)  
**Issue:** The `ListChats` endpoint includes `.Include(chat => chat.Messages)` on a paginated query. For 50 chats with 100 messages each, this loads 5,000 message rows just to render a chat list. The `MapChat` method uses messages to build `participantIds` and the full message array — but a list view doesn't need the full message array.

**Recommendation:** Remove the eager load from the list endpoint. Use a projection query that calculates participant count and last-message timestamp server-side.

---

### Finding 15: Presence Cleanup Runs On Every Request

**Severity:** :green_circle: Minor  
**Reporter:** Dev  
**File(s):** [PresenceCompatController.cs](TargetProjects/BMAD/CHAT/bmadServer/src/bmadServer.ApiService/Controllers/SparkCompat/PresenceCompatController.cs#L115-L127)  
**Issue:** `CleanupStalePresenceAsync()` runs on BOTH `UpdatePresence` AND `ListPresence`. On every presence list request, it queries for stale entries, loads them into memory, then deletes them. Under high concurrency (many users polling presence), this creates redundant cleanup work and potential deadlocks on the presence table.

**Recommendation:** Move cleanup to a background service (`IHostedService`) running on a timer, or use a flag/timestamp to debounce cleanup to at most once per minute.

---

### Finding 16: No Input Length Validation — XSS and Storage Abuse Vectors

**Severity:** :green_circle: Minor  
**Reporter:** QA  
**File(s):** Multiple controllers  
**Issue:** While the DB schema defines `HasMaxLength(300)` on titles and `HasMaxLength(200)` on names, the controllers don't validate input length before attempting to save. Oversized input will throw a DB exception that surfaces as a 500 error (unhandled by the controller). Additionally:

- `Content` fields on messages, comments, and line comments have **no max length** in schema or validation — a single message could be megabytes.
- `Description` on PRs is `IsRequired()` with no max length.
- Decision `ValueJson` is unbounded — a client could send a 10MB JSON blob.

**Recommendation:** Add `[MaxLength]` attributes or explicit validation on request DTOs. Return 400 for oversized input. Cap content fields at sensible limits (e.g., 50KB for message content, 1MB for decision value).

---

## Cross-Agent Discussion

**PM vs. QA:** PM notes that 12 stories were "completed" but QA points out there are only 8 feature-flag tests and 1 happy-path test. The testing AC for S012 claims "8 feature flag integration tests" — technically true, but this is the bare minimum gating test, not behavioral coverage. PM should have required at least one CRUD lifecycle test per story.

**Architect vs. Dev:** Architect flags the duplicated event-emission code as a design debt that Dev should have caught during implementation. Dev responds that the pattern was established in S001 scaffolding and replicated for consistency — but that's exactly the problem. The initial pattern should have been a service, not inline code. Both agree the `BuildPullRequestQuery` eager-load-everything pattern needs splitting.

**Dev vs. QA on Finding 1 (refresh token):** Dev identifies the hash-vs-plaintext bug; QA confirms there is zero test coverage for the refresh flow. This is the highest-risk finding because it's both a security vulnerability AND completely untested. If the refresh flow silently fails in production, users get logged out every time their access token expires.

**Architect vs. PM on Finding 4 (vote race):** Architect argues this is Critical because it's a data-corruption vector. PM argues it's Major because the user count is small during early rollout. The compromise: it's Major now, but must be fixed before any multi-user acceptance testing, or the Decision Center feature is DOA.

---

## Action Items

Ordered by severity and impact:

1. **[CRITICAL]** Fix refresh token rotation — return plaintext, not hash, in cookie (Finding 1)
2. **[CRITICAL]** Add `since` default and proper pagination to collaboration events (Finding 2)
3. **[MAJOR]** Add optimistic concurrency (version check) to decision updates/votes (Finding 4)
4. **[MAJOR]** Add authorization checks to ClosePR and ResolveLineComment (Finding 11)
5. **[MAJOR]** Split `BuildPullRequestQuery` into list vs. detail variants (Finding 3)
6. **[MAJOR]** Remove eager message loading from ListChats (Finding 5/14)
7. **[MAJOR]** Add password strength validation to SignUp (Finding 6)
8. **[MAJOR]** Add pagination to ListDecisions, match DTO pattern (Finding 7)
9. **[MAJOR]** Fix useDecisions polling race conditions and add AbortController (Finding 8)
10. **[MAJOR]** Add lifecycle integration tests — at least CRUD + negative path per controller (Finding 9)
11. **[MAJOR]** Validate decision value JSON schema server-side (Finding 10)
12. **[MINOR]** Extract shared `ICollaborationEventPublisher` service (Finding 12)
13. **[MINOR]** Wire real `currentUserId` to DecisionCenterPanel (Finding 13)
14. **[MINOR]** Move presence cleanup to background service (Finding 15)
15. **[MINOR]** Add input length validation across all request DTOs (Finding 16)
