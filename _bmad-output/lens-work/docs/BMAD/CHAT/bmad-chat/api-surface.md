# bmad-chat — API Surface Documentation

> **Generated**: SCOUT Analyze Codebase + Generate Docs Workflow
> **System**: LENS Discovery System
> **Status**: BMAD-Ready Documentation

---

## API Overview

bmad-chat is a **browser-only SPA** running on GitHub Spark — it has **no REST API backend**. The entire API surface is client-side:

- **4 static service classes** — pure logic factories (no network calls except LLM)
- **1 collaboration service** — singleton using Spark KV for real-time presence
- **8 React hooks** — state management wrappers over services + Spark KV
- **1 auth module** — credential storage via Spark KV (no JWT/OAuth)
- **1 OpenAPI spec** (34 endpoints) — future REST blueprint, not yet implemented

All persistence uses `window.spark.kv` (GitHub Spark key-value store). AI features use `window.spark.llm` (Spark LLM gateway to GPT-4o).

---

## Service Layer Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     React Components                            │
│  (ChatArea, PRDialog, CollaborationPanel, Dashboard)            │
└──────────┬──────────┬───────────┬──────────┬────────────────────┘
           │          │           │          │
           ▼          ▼           ▼          ▼
┌──────────────┐┌──────────┐┌──────────┐┌──────────────────────┐
│  useChats    ││ usePull  ││  useAuth ││  useCollaboration    │
│  useChat     ││ Requests ││          ││                      │
│  Actions     ││          ││          ││                      │
└──────┬───────┘└────┬─────┘└────┬─────┘└──────────┬───────────┘
       │             │           │                  │
       ▼             ▼           ▼                  ▼
┌──────────────┐┌──────────┐┌──────────┐┌──────────────────────┐
│ ChatService  ││PRService ││ auth.ts  ││CollaborationService  │
│ AIService    ││LineComm. ││          ││   (singleton)        │
│              ││Service   ││          ││                      │
└──────┬───────┘└──────────┘└────┬─────┘└──────────┬───────────┘
       │                         │                  │
       ▼                         ▼                  ▼
┌──────────────┐          ┌──────────────────────────────────┐
│ window.spark │          │       window.spark.kv             │
│    .llm()    │          │  (GitHub Spark Key-Value Store)   │
│  (GPT-4o)   │          │                                   │
└──────────────┘          └──────────────────────────────────┘
```

---

## Service Inventory

| Service | File | Methods | Dependencies | Lines |
|---------|------|---------|-------------|-------|
| `AIService` | `lib/services/ai.service.ts` | 3 | `window.spark.llm`, Types | 111 |
| `ChatService` | `lib/services/chat.service.ts` | 3 | Types only | 63 |
| `PRService` | `lib/services/pr.service.ts` | 6 | Types only | 76 |
| `LineCommentService` | `lib/services/line-comment.service.ts` | 10 | Types only | 200 |
| `CollaborationService` | `lib/collaboration.ts` | 12 | `window.spark.kv` | 145 |
| Auth utilities | `lib/auth.ts` | 5 | `window.spark.kv` | 62 |
| **Total** | **6 files** | **39** | — | **657** |

---

## Service API Details by Domain

### 1. AIService — AI / LLM Gateway

**File:** `src/lib/services/ai.service.ts` (111 lines)
**Pattern:** Static class, all methods are `static async`
**Dependency:** `window.spark.llm` (GPT-4o)

| Method | Signature | Purpose |
|--------|-----------|---------|
| `generateChatResponse` | `(content: string, currentUser: User) => Promise<AIResponse>` | Generate role-aware AI response with suggested file changes |
| `translateMessage` | `(content: string, currentUserRole: UserRole) => Promise<TranslationResponse>` | Translate technical/business terminology for user role |
| `getRoleGuidance` | `(role: UserRole) => string` | Return role-specific LLM prompt guidance (private) |

**Return Types:**

```typescript
interface AIResponse {
  response: string
  suggestedChanges?: any[]
  routingAssessment?: string        // "correctly routed" | "needs technical" | "needs business"
  momentumIndicator?: string        // "high" | "medium" | "low"
}

interface TranslationResponse {
  segments: TranslatedSegment[]     // per-term explanations with positions
}
```

**Code Example — LLM Prompt Construction:**

```typescript
static async generateChatResponse(
  content: string,
  currentUser: User
): Promise<AIResponse> {
  const roleGuidance = this.getRoleGuidance(currentUser.role)
  const promptText = `You are BMAD, an intelligent orchestrator...
    Current User: ${currentUser.name} (${currentUser.role} role)
    User message: ${content}
    ...`
  const response = await window.spark.llm(promptText, 'gpt-4o', true)
  return JSON.parse(response)
}
```

---

### 2. ChatService — Chat Factory

**File:** `src/lib/services/chat.service.ts` (63 lines)
**Pattern:** Static class, pure synchronous factory methods
**Dependency:** None (types only)

| Method | Signature | Purpose |
|--------|-----------|---------|
| `createChat` | `(title, domain, service, feature, currentUserId) => Chat` | Factory: create new Chat object with timestamp ID |
| `createMessage` | `(chatId, content, userId, role, fileChanges?) => Message` | Factory: create new Message object |
| `extractOrganization` | `(chats: Chat[]) => { domains, services, features }` | Extract unique Domain/Service/Feature taxonomy from chat list |

**Code Example — Chat Creation:**

```typescript
static createChat(
  title: string, domain: string,
  service: string, feature: string,
  currentUserId: string
): Chat {
  return {
    id: `chat-${Date.now()}`,
    title,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    messages: [],
    participants: [currentUserId],
    domain, service, feature,
  }
}
```

---

### 3. PRService — Pull Request Factory

**File:** `src/lib/services/pr.service.ts` (76 lines)
**Pattern:** Static class, immutable update pattern (spread + override)
**Dependency:** None (types only)

| Method | Signature | Purpose |
|--------|-----------|---------|
| `createPR` | `(title, description, chatId, currentUser, pendingChanges) => PullRequest` | Factory: create PR from pending file changes |
| `mergePR` | `(pr: PullRequest) => PullRequest` | Return PR copy with status `merged` |
| `closePR` | `(pr: PullRequest) => PullRequest` | Return PR copy with status `closed` |
| `approvePR` | `(pr, userId) => PullRequest` | Add userId to approvals list (idempotent) |
| `addComment` | `(pr, content, author) => PullRequest` | Append PRComment to PR |
| `filterByStatus` | `(prs, status) => PullRequest[]` | Filter PR array by status value |

**Code Example — Immutable PR Update:**

```typescript
static approvePR(pr: PullRequest, userId: string): PullRequest {
  if (pr.approvals.includes(userId)) return pr
  return {
    ...pr,
    approvals: [...pr.approvals, userId],
    updatedAt: Date.now(),
  }
}
```

---

### 4. LineCommentService — Code Review Comments

**File:** `src/lib/services/line-comment.service.ts` (200 lines)
**Pattern:** Static class, deeply nested immutable updates
**Dependency:** None (types only)

| Method | Signature | Purpose |
|--------|-----------|---------|
| `createLineComment` | `(fileId, lineNumber, lineType, content, currentUser) => LineComment` | Factory: create line-level code comment |
| `addReplyToComment` | `(comment, reply) => LineComment` | Append reply to comment thread |
| `resolveComment` | `(comment) => LineComment` | Mark comment as resolved |
| `toggleReaction` | `(comment, emoji, user) => LineComment` | Add/remove emoji reaction (toggle) |
| `addCommentToFile` | `(file, comment, parentId?) => FileChange` | Attach comment to file diff (top-level or reply) |
| `resolveCommentInFile` | `(file, commentId) => FileChange` | Resolve comment within file context |
| `toggleReactionInFile` | `(file, commentId, emoji, user) => FileChange` | Toggle reaction within file context |
| `addCommentToPR` | `(pr, fileId, comment, parentId?) => PullRequest` | Add comment at PR > file > line level |
| `resolveCommentInPR` | `(pr, commentId) => PullRequest` | Resolve comment across all PR files |
| `toggleReactionInPR` | `(pr, commentId, emoji, user) => PullRequest` | Toggle reaction across all PR files |

**Code Example — Nested Immutable Reaction Toggle:**

```typescript
static toggleReaction(
  comment: LineComment, emoji: string, user: User
): LineComment {
  const reactions = comment.reactions || []
  const existingReaction = reactions.find((r) => r.emoji === emoji)
  if (existingReaction) {
    const hasReacted = existingReaction.userIds.includes(user.id)
    if (hasReacted) {
      const updatedUserIds = existingReaction.userIds.filter((id) => id !== user.id)
      if (updatedUserIds.length === 0) {
        return { ...comment, reactions: reactions.filter((r) => r.emoji !== emoji) }
      }
      return { ...comment, reactions: reactions.map((r) =>
        r.emoji === emoji ? { ...r, userIds: updatedUserIds } : r) }
    }
    // ... add user to existing reaction
  }
  // ... create new reaction
}
```

---

### 5. CollaborationService — Real-Time Presence

**File:** `src/lib/collaboration.ts` (145 lines)
**Pattern:** Singleton instance (`collaborationService`), async methods via Spark KV
**Dependency:** `window.spark.kv` (presence + events store)

| Method | Signature | Purpose |
|--------|-----------|---------|
| `initialize` | `(userId: string) => void` | Start presence heartbeat (5s interval) |
| `cleanup` | `() => void` | Stop heartbeat, remove presence |
| `updatePresence` | `(updates?: Partial<UserPresence>) => void` | Upsert presence record in KV |
| `getAllPresence` | `() => Record<string, UserPresence>` | Read full presence map from KV |
| `getActiveUsers` | `(chatId?: string) => UserPresence[]` | Filter users active within 30s timeout |
| `setTyping` | `(chatId, isTyping) => void` | Update typing state + broadcast event |
| `setActiveChat` | `(chatId: string or null) => void` | Update active chat in presence |
| `removePresence` | `(userId) => void` | Delete user from presence map |
| `cleanupStalePresence` | `() => void` | Remove entries older than 30s |
| `broadcastEvent` | `(event: CollaborationEvent) => void` | Append event to KV (max 100) |
| `getRecentEvents` | `(since: number) => CollaborationEvent[]` | Fetch events after timestamp |
| `subscribe` | `(eventType, callback) => unsubscribe` | Register local event listener |

**KV Keys:**

| Key | Type | Purpose |
|-----|------|---------|
| `user-presence` | `Record<string, UserPresence>` | All active user presence records |
| `collaboration-events` | `CollaborationEvent[]` | Circular buffer of recent events (max 100) |

**Code Example — Presence Heartbeat:**

```typescript
async initialize(userId: string) {
  this.currentUserId = userId
  await this.updatePresence()
  this.presenceInterval = window.setInterval(() => {
    this.updatePresence()
  }, 5000)
  await this.cleanupStalePresence()
}
```

---

## Hook Layer

### Hook Inventory

| Hook | File | Returns | Dependencies | Lines |
|------|------|---------|-------------|-------|
| `useAuth` | `hooks/use-auth.ts` | `currentUser, isAuthenticated, handleSignIn/Up/Out` | `auth.ts` | 91 |
| `useChats` | `hooks/use-chats.ts` | `chats, createChat, addMessage, addTranslation` | `ChatService, AIService, useKV` | 157 |
| `useChatActions` | `hooks/use-chat-actions.ts` | `handleSendMessage, handleTranslateMessage` | `useChats` exports | 53 |
| `usePullRequests` | `hooks/use-pull-requests.ts` | `pullRequests, createPR, mergePR, closePR, approvePR` | `PRService, LineCommentService, useKV` | 148 |
| `useCollaboration` | `hooks/use-collaboration.ts` | `activeUsers, typingUsers, broadcastEvent` | `CollaborationService` | 116 |
| `usePendingChanges` | `hooks/use-pending-changes.ts` | `pendingChanges, addChanges, clearChanges` | `LineCommentService` | 74 |
| `useUIState` | `hooks/use-ui-state.ts` | `activeChat, selectedPR, panels, dialogs` | `useIsMobile` | 80 |
| `useIsMobile` | `hooks/use-mobile.ts` | `boolean` | `window.matchMedia` | 19 |
| **Total** | **8 hooks** | — | — | **738** |

### Hook Detail: useChats

**Persistence:** `useKV<Chat[]>('chats', [])` — Spark KV auto-sync

```typescript
export function useChats() {
  const [chats, setChats] = useKV<Chat[]>('chats', [])

  const createChat = (domain, service, feature, title, currentUserId) => {
    const newChat = ChatService.createChat(title, domain, service, feature, currentUserId)
    setChats((current) => [newChat, ...(current || [])])
    return newChat
  }
  // addMessage, addTranslation, getChatById, getOrganization
}
```

### Hook Detail: usePullRequests

**Persistence:** `useKV<PullRequest[]>('pull-requests', [])` — Spark KV auto-sync

```typescript
export function usePullRequests() {
  const [pullRequests, setPullRequests] = useKV<PullRequest[]>('pull-requests', [])

  const createPR = (title, description, chatId, currentUser, pendingChanges, onBroadcast?) => {
    const newPR = PRService.createPR(title, description, chatId, currentUser, pendingChanges)
    setPullRequests((current) => [newPR, ...(current || [])])
    if (onBroadcast) onBroadcast('pr_created', { prId: newPR.id, title })
    toast.success('Pull request created')
    return newPR
  }
  // mergePR, closePR, approvePR, commentOnPR, addLineComment,
  // resolveLineComment, toggleLineCommentReaction, getOpenPRs, getMergedPRs, getClosedPRs
}
```

### Hook Detail: useCollaboration

**Polling:** 2-second interval for presence and event updates

```typescript
export function useCollaboration(currentUser: User | null, activeChat: string | null) {
  const [activeUsers, setActiveUsers] = useState<UserPresence[]>([])
  const [typingUsers, setTypingUsers] = useState<UserPresence[]>([])
  const [recentEvents, setRecentEvents] = useState<CollaborationEvent[]>([])

  // Polls collaborationService.getActiveUsers() every 2s
  // Filters typing users by current chat
  // Forwards new events to local listeners
}
```

---

## OpenAPI Blueprint (34 Future Endpoints)

The `openapi.yaml` (1,804 lines) defines the REST API target for server migration. **None of these endpoints are implemented yet** — they represent the architecture goal when bmad-chat migrates from Spark KV to a REST backend (bmadServer).

### Endpoint Summary by Domain

| Domain | Endpoints | Current Client Equivalent |
|--------|-----------|--------------------------|
| Authentication | 4 | `auth.ts` functions |
| Users | 2 | Part of `useAuth` hook |
| Chats | 5 | `ChatService` + `useChats` |
| Messages | 3 | `ChatService.createMessage` + `AIService` |
| Pull Requests | 8 | `PRService` + `usePullRequests` |
| File Changes | 3 | `LineCommentService` |
| Collaboration | 3 | `CollaborationService` |
| Organization | 3 | `ChatService.extractOrganization` |
| AI | 1 | `AIService.generateChatResponse` |
| System | 1 | N/A |
| **Total** | **34** | — |

### Authentication (4 endpoints)

```
POST   /auth/signup         signUp          [public]
POST   /auth/signin         signIn          [public]
POST   /auth/signout        signOut         [authenticated]
GET    /auth/me             getCurrentUser  [authenticated]
```

### Users (2 endpoints)

```
GET    /users/{userId}             getUserById       [authenticated]
PUT    /users/{userId}/presence    updatePresence    [authenticated]
```

### Chats (5 endpoints)

```
GET    /chats                listChats    [filters: domain, service, feature]
POST   /chats                createChat   [body: title, domain, service, feature]
GET    /chats/{chatId}       getChatById
PATCH  /chats/{chatId}       updateChat
DELETE /chats/{chatId}       deleteChat
```

### Messages (3 endpoints)

```
GET    /chats/{chatId}/messages                         listMessages      [pagination: limit, before, after]
POST   /chats/{chatId}/messages                         sendMessage       [AI response included]
POST   /chats/{chatId}/messages/{messageId}/translate   translateMessage  [role-based translation]
```

### Pull Requests (8 endpoints)

```
GET    /pull-requests                    listPullRequests   [filters: status, chatId, author]
POST   /pull-requests                    createPullRequest  [body: title, description, fileChanges]
GET    /pull-requests/{prId}             getPullRequestById
PATCH  /pull-requests/{prId}             updatePullRequest
POST   /pull-requests/{prId}/merge       mergePullRequest
POST   /pull-requests/{prId}/close       closePullRequest
POST   /pull-requests/{prId}/approve     approvePullRequest
GET    /pull-requests/{prId}/comments    listPRComments
POST   /pull-requests/{prId}/comments    addPRComment
```

### File Changes (3 endpoints)

```
POST   /pull-requests/{prId}/files/{fileId}/comments                          addLineComment
POST   /pull-requests/{prId}/files/{fileId}/comments/{commentId}/resolve      resolveLineComment
POST   /pull-requests/{prId}/files/{fileId}/comments/{commentId}/reactions    toggleReaction
```

### Collaboration (3 endpoints)

```
GET    /presence                  getActiveUsers       [filter: chatId]
GET    /collaboration/events      getCollaborationEvents [filter: since, chatId]
POST   /collaboration/events      broadcastEvent
```

### Organization (3 endpoints)

```
GET    /organization/domains     listDomains
GET    /organization/services    listServices    [filter: domain]
GET    /organization/features    listFeatures    [filter: domain, service]
```

### AI and System (2 endpoints)

```
POST   /ai/generate-defaults    generateAIDefaults   [auto-fill domain/service/feature]
GET    /health                   healthCheck          [public]
```

---

## Data Flow Patterns

### Message Send Flow

```
┌──────────┐     ┌────────────┐     ┌──────────────┐     ┌──────────┐
│   User   │────▶│useChatAct. │────▶│ ChatService  │────▶│ useChats │
│  types   │     │handleSend  │     │createMessage │     │addMessage│
│ message  │     │  Message   │     │  (factory)   │     │ (KV set) │
└──────────┘     └──────┬─────┘     └──────────────┘     └──────────┘
                        │
                        ▼
                 ┌──────────────┐     ┌──────────────┐
                 │  AIService   │────▶│window.spark  │
                 │generateChat  │     │  .llm()      │
                 │  Response    │     │  (GPT-4o)    │
                 └──────┬───────┘     └──────────────┘
                        │
                        ▼
                 ┌──────────────┐     ┌──────────────┐
                 │  AI Message  │────▶│  Pending     │
                 │  + suggested │     │  Changes     │
                 │    changes   │     │  (useState)  │
                 └──────────────┘     └──────────────┘
```

### PR Lifecycle Flow

```
┌──────────┐     ┌──────────────┐     ┌──────────┐     ┌──────────┐
│ Pending  │────▶│ usePullReq.  │────▶│PRService │────▶│ Spark KV │
│ Changes  │     │  createPR    │     │createPR  │     │  (set)   │
└──────────┘     └──────────────┘     └──────────┘     └──────────┘
                                            │
                  ┌─────────────────────────┼─────────────────────┐
                  ▼                         ▼                     ▼
           ┌──────────┐            ┌──────────────┐       ┌──────────┐
           │ approve  │            │  addComment  │       │  merge   │
           │  PR      │            │  / addLine   │       │   PR     │
           │          │            │   Comment    │       │          │
           └──────────┘            └──────────────┘       └──────────┘
```

### Collaboration Presence Flow

```
┌──────────┐  5s heartbeat  ┌──────────────────┐  KV write  ┌──────────┐
│  User A  │───────────────▶│Collaboration     │───────────▶│ Spark KV │
│ (init)   │                │Service.update    │            │ presence │
└──────────┘                │  Presence()      │            │   key    │
                            └──────────────────┘            └────┬─────┘
                                                                 │
┌──────────┐  2s poll       ┌──────────────────┐  KV read   ┌────┘
│  User B  │◀───────────────│useCollaboration  │◀───────────┘
│(renders) │                │ pollForUpdates() │
└──────────┘                └──────────────────┘
```

---

## Error Handling Patterns

All service and hook files follow a consistent error handling pattern:

| Layer | Pattern | Example |
|-------|---------|---------|
| **Services** | Throw on failure, no internal catch | `AIService` — raw `JSON.parse()` may throw |
| **Hooks** | `try/catch` with `toast.error()` + `console.error()` | `useAuth.handleSignIn` |
| **Standalone functions** | `try/catch` with `toast.error()` + `console.error()` | `sendMessage()`, `translateMessage()` |

**Code Example — Hook Error Pattern:**

```typescript
const handleSignIn = async (email: string, password: string) => {
  try {
    const authUser = await signIn(email, password)
    await saveCurrentUser(authUser)
    setCurrentUser(user)
    setIsAuthenticated(true)
    toast.success('Welcome back!')
  } catch (error) {
    toast.error(error instanceof Error ? error.message : 'Sign in failed')
    throw error   // re-throw for caller
  }
}
```

**Gaps:**
- No global error boundary integration (ErrorFallback.tsx exists but not wired to services)
- No retry logic on KV operations
- No structured error codes — error messages are freeform strings
- LLM responses parsed with raw `JSON.parse()` — malformed AI output causes unhandled crash

---

## Authentication API

**File:** `src/lib/auth.ts` (62 lines)
**Storage:** `window.spark.kv` with keys `docflow-users` and `docflow-current-user`

| Function | Signature | Purpose |
|----------|-----------|---------|
| `signUp` | `(email, password, name, role) => Promise<AuthUser>` | Create user in KV store; throws if email exists |
| `signIn` | `(email, password) => Promise<AuthUser>` | Lookup user by email+password; throws if not found |
| `setCurrentUser` | `(user: AuthUser) => Promise<void>` | Persist session to KV |
| `getCurrentUser` | `() => Promise<AuthUser or null>` | Read session from KV |
| `signOut` | `() => Promise<void>` | Delete session key from KV |

**Security Notes:**
- Passwords stored in **plaintext** in Spark KV (no hashing)
- No session tokens — entire AuthUser object stored as session
- No rate limiting, no CSRF protection
- Acceptable for Spark prototype; must be replaced for production

**KV Keys:**

| Key | Type | Purpose |
|-----|------|---------|
| `docflow-users` | `AuthUser[]` | User registry (all accounts) |
| `docflow-current-user` | `AuthUser` | Active session |

---

## Migration Considerations

### Client Service to REST API Mapping

| Client Service | Method | REST Equivalent | OpenAPI operationId |
|---------------|--------|-----------------|---------------------|
| `auth.signUp` | KV-based | `POST /auth/signup` | `signUp` |
| `auth.signIn` | KV-based | `POST /auth/signin` | `signIn` |
| `auth.signOut` | KV delete | `POST /auth/signout` | `signOut` |
| `auth.getCurrentUser` | KV get | `GET /auth/me` | `getCurrentUser` |
| `ChatService.createChat` | Factory | `POST /chats` | `createChat` |
| `ChatService.createMessage` | Factory | `POST /chats/{id}/messages` | `sendMessage` |
| `AIService.generateChatResponse` | Spark LLM | `POST /chats/{id}/messages` | `sendMessage` (server-side AI) |
| `AIService.translateMessage` | Spark LLM | `POST /.../translate` | `translateMessage` |
| `PRService.createPR` | Factory | `POST /pull-requests` | `createPullRequest` |
| `PRService.mergePR` | Factory | `POST /.../merge` | `mergePullRequest` |
| `PRService.approvePR` | Factory | `POST /.../approve` | `approvePullRequest` |
| `LineCommentService.createLineComment` | Factory | `POST /.../comments` | `addLineComment` |
| `CollaborationService.updatePresence` | KV write | `PUT /users/{id}/presence` | `updatePresence` |
| `CollaborationService.broadcastEvent` | KV append | `POST /collaboration/events` | `broadcastEvent` |

### Migration Priority

```
┌─────────────────────────────────────────────────────────────┐
│ Phase 1: Auth (replace plaintext KV with JWT/OAuth)         │
│  ► auth.ts -> POST /auth/signup, /signin, /signout, GET /me │
├─────────────────────────────────────────────────────────────┤
│ Phase 2: Chats + Messages (KV -> database + REST)           │
│  ► ChatService -> /chats CRUD + /messages                   │
│  ► AIService -> server-side LLM orchestration               │
├─────────────────────────────────────────────────────────────┤
│ Phase 3: Pull Requests (KV -> Git-backed REST)              │
│  ► PRService -> /pull-requests CRUD + merge/approve         │
│  ► LineCommentService -> /files/{id}/comments               │
├─────────────────────────────────────────────────────────────┤
│ Phase 4: Collaboration (KV polling -> WebSocket/SSE)        │
│  ► CollaborationService -> /presence + /events              │
│  ► Replace 2s polling with real-time push                   │
└─────────────────────────────────────────────────────────────┘
```

---

## Type System Summary

### Core Domain Types

| Type | Fields | Used By |
|------|--------|---------|
| `User` | `id, name, avatarUrl, role, email` | All services |
| `AuthUser` | `User + password, createdAt` | `auth.ts` only |
| `UserRole` | `'technical' or 'business'` | AI routing, translation |
| `Chat` | `id, title, messages[], domain, service, feature` | ChatService, useChats |
| `Message` | `id, chatId, content, role, userId, fileChanges[], translations[]` | ChatService, AIService |
| `PullRequest` | `id, title, description, chatId, author, status, fileChanges[], comments[], approvals[]` | PRService, usePullRequests |
| `FileChange` | `path, additions[], deletions[], status, lineComments[]` | PRService, LineCommentService |
| `LineComment` | `id, fileId, lineNumber, lineType, author, content, resolved, replies[], reactions[]` | LineCommentService |
| `PRComment` | `id, prId, author, content, timestamp` | PRService |
| `UserPresence` | `userId, userName, activeChat, lastSeen, isTyping, typingChatId` | CollaborationService |
| `CollaborationEvent` | `id, type, userId, userName, chatId, timestamp, metadata` | CollaborationService |
| `MessageTranslation` | `role, segments: TranslatedSegment[]` | AIService |
| `EmojiReaction` | `emoji, userIds[], userNames[]` | LineCommentService |

---

## Related Documentation

- [architecture.md](architecture.md) — System architecture and component relationships
- [data-model.md](data-model.md) — Entity definitions and persistence patterns
- [integration-map.md](integration-map.md) — External dependency mapping (Spark KV, Spark LLM)
- [onboarding.md](onboarding.md) — Developer setup and codebase navigation guide

---

*Auto-generated by LENS Discovery System — SCOUT agent*
*Source: `TargetProjects/BMAD/CHAT/bmad-chat/` | Control: `NorthStarET.BMAD`*
