# bmad-chat — Data Model Documentation

> **Generated**: SCOUT Analyze Codebase + Generate Docs Workflow  
> **System**: LENS Discovery System  
> **Status**: BMAD-Ready Documentation

---

## Data Architecture Overview

bmad-chat uses a **schemaless Key-Value store** provided by the GitHub Spark platform (`window.spark.kv`). There is no traditional database, no ORM, and no migration system. All data is persisted as JSON documents in Spark KV keys, with **embedded document patterns** — messages are nested inside chats, line comments are nested inside file changes, and file changes are nested inside pull requests.

The data layer is split across three tiers:

1. **Type Definitions** — `src/lib/types.ts` defines all 14 TypeScript interfaces
2. **Service Layer** — Pure static factory classes in `src/lib/services/` handle entity creation and mutation
3. **Hook Layer** — React hooks in `src/hooks/` bind KV keys to React state via `useKV<T>()`

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     DATA ARCHITECTURE OVERVIEW                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   React Components                                                      │
│        │                                                                │
│        ▼                                                                │
│   ┌──────────────────────────────────────────────────────────┐          │
│   │  HOOKS LAYER (useKV<T> bindings)                         │          │
│   │  ┌──────────┐ ┌──────────────┐ ┌───────────────────┐    │          │
│   │  │ useChats  │ │usePullReqs   │ │ useCollaboration  │    │          │
│   │  │ useAuth   │ │usePending    │ │ useChatActions    │    │          │
│   │  └──────────┘ └──────────────┘ └───────────────────┘    │          │
│   └──────────────────────┬───────────────────────────────────┘          │
│                          │                                              │
│                          ▼                                              │
│   ┌──────────────────────────────────────────────────────────┐          │
│   │  SERVICE LAYER (static factory methods)                  │          │
│   │  ┌─────────────┐ ┌───────────┐ ┌────────────────────┐   │          │
│   │  │ ChatService  │ │ PRService │ │LineCommentService  │   │          │
│   │  │ AIService    │ │           │ │                    │   │          │
│   │  └─────────────┘ └───────────┘ └────────────────────┘   │          │
│   └──────────────────────┬───────────────────────────────────┘          │
│                          │                                              │
│                          ▼                                              │
│   ┌──────────────────────────────────────────────────────────┐          │
│   │  TYPE DEFINITIONS (src/lib/types.ts)                     │          │
│   │  14 interfaces + 2 type aliases                          │          │
│   └──────────────────────┬───────────────────────────────────┘          │
│                          │                                              │
│                          ▼                                              │
│   ┌──────────────────────────────────────────────────────────┐          │
│   │  SPARK KV STORE (window.spark.kv)                        │          │
│   │  ┌────────┐ ┌───────────┐ ┌───────────────┐             │          │
│   │  │ chats  │ │ pull-reqs │ │ user-presence │             │          │
│   │  │ users  │ │ curr-user │ │ collab-events │             │          │
│   │  └────────┘ └───────────┘ └───────────────┘             │          │
│   └──────────────────────────────────────────────────────────┘          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Persistence Statistics

| Metric | Value |
|--------|-------|
| **Total Interfaces** | 14 |
| **Type Aliases** | 2 (`UserRole`, `PRStatus`) |
| **KV Store Keys** | 7 |
| **Storage Engine** | GitHub Spark KV (JSON) |
| **ORM** | None — direct KV read/write |
| **Migrations** | None — schemaless |
| **Schema Validation** | TypeScript compile-time only |
| **Service Classes** | 4 (`ChatService`, `PRService`, `LineCommentService`, `AIService`) |
| **React Hooks** | 7 (`useChats`, `usePullRequests`, `useCollaboration`, `useAuth`, `usePendingChanges`, `useChatActions`, `useUIState`) |

---

## Entity Domain Model

### Domain Categorization

```
┌─────────────────────────────────────────────────────────────────────────┐
│                 BMAD-CHAT DATA MODEL (14 INTERFACES)                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────────────┐  ┌──────────────────────┐                    │
│  │  IDENTITY            │  │  COMMUNICATION       │                    │
│  │  ──────────────────  │  │  ──────────────────  │                    │
│  │  • User              │  │  • Chat              │                    │
│  │  • AuthUser          │  │  • Message            │                    │
│  │  • UserRole (type)   │  │  • MessageTranslation │                    │
│  │                      │  │  • TranslatedSegment  │                    │
│  │                      │  │  • EmojiReaction      │                    │
│  └──────────────────────┘  └──────────────────────┘                    │
│                                                                         │
│  ┌──────────────────────┐  ┌──────────────────────┐                    │
│  │  CODE REVIEW         │  │  COLLABORATION       │                    │
│  │  ──────────────────  │  │  ──────────────────  │                    │
│  │  • PullRequest       │  │  • UserPresence      │                    │
│  │  • FileChange        │  │  • CollaborationEvent│                    │
│  │  • LineComment       │  │                      │                    │
│  │  • PRComment         │  │                      │                    │
│  │  • PRStatus (type)   │  │                      │                    │
│  └──────────────────────┘  └──────────────────────┘                    │
│                                                                         │
│  ┌──────────────────────┐                                              │
│  │  AI / SERVICES       │                                              │
│  │  ──────────────────  │                                              │
│  │  • AIResponse        │                                              │
│  │  • TranslationResp.  │                                              │
│  └──────────────────────┘                                              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Core Type Definitions

All types are defined in `src/lib/types.ts` and `src/lib/services/ai.service.ts`. Below are the **verbatim** TypeScript definitions extracted from source.

### 1. Identity Domain

#### UserRole (Type Alias)

```typescript
// src/lib/types.ts
export type UserRole = 'technical' | 'business'
```

Discriminates user persona. Controls AI response tone, translation behavior, and routing assessment in the BMAD orchestrator.

#### User

```typescript
// src/lib/types.ts
export interface User {
  id: string
  name: string
  avatarUrl: string
  role: UserRole
  email: string
  password?: string
}
```

Runtime user representation after authentication. The optional `password` field is present only during sign-in/sign-up flows and is stripped before storage in React state.

#### AuthUser

```typescript
// src/lib/types.ts
export interface AuthUser {
  id: string
  email: string
  password: string
  name: string
  role: UserRole
  avatarUrl: string
  createdAt: number
}
```

Persisted user record in the `docflow-users` KV key. Contains the plaintext `password` (no hashing — Spark sandbox limitation) and a `createdAt` epoch timestamp.

### 2. Communication Domain

#### Chat

```typescript
// src/lib/types.ts
export interface Chat {
  id: string
  title: string
  createdAt: number
  updatedAt: number
  messages: Message[]
  participants: string[]
  domain?: string
  service?: string
  feature?: string
}
```

Top-level conversation entity. **Embeds** the full `Message[]` array. The optional `domain`, `service`, and `feature` fields enable organizational categorization for the BMAD architecture context.

#### Message

```typescript
// src/lib/types.ts
export interface Message {
  id: string
  chatId: string
  content: string
  role: 'user' | 'assistant'
  timestamp: number
  userId?: string
  fileChanges?: FileChange[]
  translations?: MessageTranslation[]
}
```

Individual message within a chat. AI-generated messages include `fileChanges` (suggested documentation mutations). The `translations` array holds per-role explanations added via the Translate feature.

#### MessageTranslation

```typescript
// src/lib/types.ts
export interface MessageTranslation {
  role: UserRole
  segments: TranslatedSegment[]
}
```

A translation of a message targeted at a specific `UserRole`. Each translation contains multiple annotated segments.

#### TranslatedSegment

```typescript
// src/lib/types.ts
export interface TranslatedSegment {
  originalText: string
  startIndex: number
  endIndex: number
  explanation: string
  context: string
  simplifiedText?: string
}
```

An individual term or phrase within a message annotated with an explanation for the target role. `startIndex`/`endIndex` map to character positions in the original message content.

#### EmojiReaction

```typescript
// src/lib/types.ts
export interface EmojiReaction {
  emoji: string
  userIds: string[]
  userNames: string[]
}
```

Tracks which users have reacted with a specific emoji on a `LineComment`. Stores both IDs and display names for efficient rendering without user lookups.

### 3. Code Review Domain

#### PRStatus (Type Alias)

```typescript
// src/lib/types.ts
export type PRStatus = 'open' | 'merged' | 'closed' | 'draft'
```

#### PullRequest

```typescript
// src/lib/types.ts
export interface PullRequest {
  id: string
  title: string
  description: string
  chatId: string
  author: string
  status: PRStatus
  createdAt: number
  updatedAt: number
  fileChanges: FileChange[]
  comments: PRComment[]
  approvals: string[]
}
```

Pull request entity. **Embeds** both `FileChange[]` (which themselves embed `LineComment[]`) and `PRComment[]`. The `chatId` links back to the originating conversation. `approvals` stores user IDs who have approved.

#### FileChange

```typescript
// src/lib/types.ts
export interface FileChange {
  path: string
  additions: string[]
  deletions: string[]
  status: 'pending' | 'staged' | 'committed'
  lineComments?: LineComment[]
}
```

Represents a single file mutation. `additions` and `deletions` are line-level string arrays. `lineComments` are **embedded** inline review comments anchored to specific lines.

#### LineComment

```typescript
// src/lib/types.ts
export interface LineComment {
  id: string
  fileId: string
  lineNumber: number
  lineType: 'addition' | 'deletion' | 'unchanged'
  author: string
  authorAvatar: string
  content: string
  timestamp: number
  resolved: boolean
  replies?: LineComment[]
  reactions?: EmojiReaction[]
}
```

Inline code review comment anchored to a specific line in a `FileChange`. Supports **self-referential nesting** via `replies` (threaded discussions) and emoji reactions.

#### PRComment

```typescript
// src/lib/types.ts
export interface PRComment {
  id: string
  prId: string
  author: string
  content: string
  timestamp: number
}
```

Top-level pull request comment (not line-anchored). Simpler than `LineComment` — no threading, reactions, or resolve state.

### 4. Collaboration Domain

#### UserPresence

```typescript
// src/lib/types.ts
export interface UserPresence {
  userId: string
  userName: string
  avatarUrl: string
  activeChat: string | null
  lastSeen: number
  isTyping: boolean
  typingChatId: string | null
  cursorPosition?: {
    chatId: string
    messageId: string
  }
}
```

Real-time presence tracking for collaborative editing. Stored in KV as a `Record<string, UserPresence>` keyed by `userId`. The `cursorPosition` object is reserved for future cursor-sharing features.

#### CollaborationEvent

```typescript
// src/lib/types.ts
export interface CollaborationEvent {
  id: string
  type: 'user_join' | 'user_leave' | 'typing_start' | 'typing_stop'
      | 'message_sent' | 'pr_created' | 'pr_updated'
  userId: string
  userName: string
  chatId?: string
  prId?: string
  timestamp: number
  metadata?: Record<string, any>
}
```

Event log entry for the collaboration event bus. Events are appended to a rolling buffer (max 100) in KV. The `type` discriminated union enables filtered subscriptions.

### 5. AI Service Types

#### AIResponse

```typescript
// src/lib/services/ai.service.ts
export interface AIResponse {
  response: string
  suggestedChanges?: any[]
  routingAssessment?: string
  momentumIndicator?: string
}
```

Structured response from the BMAD AI orchestrator. `suggestedChanges` maps to `FileChange[]` for documentation mutations. `routingAssessment` indicates whether the question was directed to the correct user role. `momentumIndicator` tracks project velocity.

#### TranslationResponse

```typescript
// src/lib/services/ai.service.ts
export interface TranslationResponse {
  segments: TranslatedSegment[]
}
```

Response from the AI translation service. Contains annotated segments that explain technical or business terms to the opposite user role.

---

## Entity Relationships

### ASCII ER Diagram

```
┌──────────────┐        ┌──────────────┐        ┌─────────────────┐
│   AuthUser   │        │     User     │        │  UserPresence   │
│──────────────│        │──────────────│        │─────────────────│
│ id           │───────▶│ id           │◀───────│ userId          │
│ email        │        │ name         │        │ userName        │
│ password     │        │ avatarUrl    │        │ avatarUrl       │
│ name         │        │ role         │        │ activeChat ─────┼───┐
│ role         │        │ email        │        │ lastSeen        │   │
│ avatarUrl    │        │ password?    │        │ isTyping        │   │
│ createdAt    │        └──────────────┘        │ typingChatId    │   │
└──────────────┘               │                │ cursorPosition? │   │
                               │                └─────────────────┘   │
                               │ author                               │
                               ▼                                      │
┌──────────────────────────────────────────────────────────────────┐   │
│                          Chat                                    │◀──┘
│──────────────────────────────────────────────────────────────────│
│ id                                                               │
│ title                                                            │
│ createdAt / updatedAt                                            │
│ participants: string[]                                           │
│ domain? / service? / feature?                                    │
│                                                                  │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ messages: Message[] (EMBEDDED)                               │ │
│ │ ┌──────────────────────────────────────────────────────────┐ │ │
│ │ │ id, chatId, content, role                                │ │ │
│ │ │ timestamp, userId?                                       │ │ │
│ │ │ fileChanges?: FileChange[] ──────────────────────────────┼─┼─┼──┐
│ │ │ translations?: MessageTranslation[]                      │ │ │  │
│ │ │   └─ role, segments: TranslatedSegment[]                 │ │ │  │
│ │ └──────────────────────────────────────────────────────────┘ │ │  │
│ └──────────────────────────────────────────────────────────────┘ │  │
└──────────────────────────────────────────────────────────────────┘  │
                                                                      │
         ┌────────────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────────┐
│                       PullRequest                                │
│──────────────────────────────────────────────────────────────────│
│ id, title, description                                           │
│ chatId ──────────────────────────────────────────────────────────┼──▶ Chat.id
│ author, status: PRStatus                                         │
│ createdAt / updatedAt                                            │
│ approvals: string[]                                              │
│                                                                  │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ comments: PRComment[] (EMBEDDED)                             │ │
│ │   id, prId, author, content, timestamp                       │ │
│ └──────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ fileChanges: FileChange[] (EMBEDDED)                         │ │
│ │ ┌──────────────────────────────────────────────────────────┐ │ │
│ │ │ path, additions[], deletions[]                           │ │ │
│ │ │ status: pending|staged|committed                         │ │ │
│ │ │                                                          │ │ │
│ │ │ ┌──────────────────────────────────────────────────────┐ │ │ │
│ │ │ │ lineComments: LineComment[]                          │ │ │ │
│ │ │ │  id, fileId, lineNumber                              │ │ │ │
│ │ │ │  lineType, author, content                           │ │ │ │
│ │ │ │  resolved, timestamp                                 │ │ │ │
│ │ │ │  replies?: LineComment[] (SELF-REFERENTIAL)           │ │ │ │
│ │ │ │  reactions?: EmojiReaction[]                          │ │ │ │
│ │ │ │    └─ emoji, userIds[], userNames[]                   │ │ │ │
│ │ │ └──────────────────────────────────────────────────────┘ │ │ │
│ │ └──────────────────────────────────────────────────────────┘ │ │
│ └──────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                    CollaborationEvent                             │
│──────────────────────────────────────────────────────────────────│
│ id                                                               │
│ type: 'user_join' | 'user_leave' | ...                           │
│ userId ──────────────────────────────────────────────────────────┼──▶ User.id
│ userName                                                         │
│ chatId? ─────────────────────────────────────────────────────────┼──▶ Chat.id
│ prId? ───────────────────────────────────────────────────────────┼──▶ PullRequest.id
│ timestamp                                                        │
│ metadata?: Record<string, any>                                   │
└──────────────────────────────────────────────────────────────────┘
```

### Embedding Depth

```
Chat
 └─ Message[]                          (depth 1)
     ├─ FileChange[]                   (depth 2)
     └─ MessageTranslation[]           (depth 2)
         └─ TranslatedSegment[]        (depth 3)

PullRequest
 ├─ PRComment[]                        (depth 1)
 └─ FileChange[]                       (depth 1)
     └─ LineComment[]                  (depth 2)
         ├─ LineComment[] (replies)     (depth 3 — self-referential)
         └─ EmojiReaction[]            (depth 3)
```

Maximum nesting depth: **4 levels** (PullRequest → FileChange → LineComment → replies/reactions). This deep embedding is a consequence of the schemaless KV model.

---

## KV Storage Schema

### Store Key Map

| KV Key | Type | Structure | Access Pattern | Hook / Service |
|--------|------|-----------|----------------|----------------|
| `chats` | `Chat[]` | Array of chats with embedded messages | Read-all, update-by-id, prepend-new | `useChats` → `useKV<Chat[]>('chats', [])` |
| `pull-requests` | `PullRequest[]` | Array of PRs with embedded file changes and comments | Read-all, update-by-id, prepend-new | `usePullRequests` → `useKV<PullRequest[]>('pull-requests', [])` |
| `docflow-users` | `AuthUser[]` | Array of registered users with plaintext passwords | Read-all (for login lookup), append-new | `auth.ts` → `window.spark.kv.get/set` |
| `docflow-current-user` | `AuthUser` | Single authenticated user object | Read (session restore), set (login), delete (logout) | `auth.ts` → `window.spark.kv.get/set/delete` |
| `user-presence` | `Record<string, UserPresence>` | Dictionary keyed by userId | Read-all, update-by-userId, delete-by-userId | `CollaborationService` → `window.spark.kv.get/set` |
| `collaboration-events` | `CollaborationEvent[]` | Rolling buffer (max 100 events) | Append + shift, filter-by-timestamp | `CollaborationService` → `window.spark.kv.get/set` |
| *(React state only)* | `FileChange[]` | Pending changes in local state | Not persisted to KV — lives in `useState` | `usePendingChanges` |

### Storage Constants

```typescript
// src/lib/auth.ts
const USERS_KEY = 'docflow-users'
const CURRENT_USER_KEY = 'docflow-current-user'

// src/lib/collaboration.ts
const PRESENCE_KEY = 'user-presence'
const EVENTS_KEY = 'collaboration-events'
const PRESENCE_TIMEOUT = 30000  // 30 seconds stale threshold

// src/hooks/use-chats.ts (via useKV)
// Key: 'chats', Default: []

// src/hooks/use-pull-requests.ts (via useKV)
// Key: 'pull-requests', Default: []
```

---

## Data Access Patterns

### Pattern 1: useKV Hook (Reactive Binding)

The primary data access pattern uses Spark's `useKV<T>()` hook, which provides reactive state + persistence in a single call:

```typescript
// src/hooks/use-chats.ts
import { useKV } from '@github/spark/hooks'

export function useChats() {
  const [chats, setChats] = useKV<Chat[]>('chats', [])

  const createChat = (domain, service, feature, title, currentUserId) => {
    const newChat = ChatService.createChat(title, domain, service, feature, currentUserId)
    setChats((current) => [newChat, ...(current || [])])    // Prepend pattern
    return newChat
  }

  const addMessage = (chatId: string, message: Message) => {
    setChats((current) =>
      (current || []).map((chat) =>                         // Update-by-id pattern
        chat.id === chatId
          ? { ...chat, messages: [...chat.messages, message], updatedAt: Date.now() }
          : chat
      )
    )
  }
}
```

**Key behaviors:**
- `setChats()` accepts a callback with the current value, enabling optimistic updates
- All mutations are **immutable** — spread operators create new objects
- New entities are **prepended** to arrays (most recent first)
- Updates use `.map()` to find and replace by ID

### Pattern 2: Direct KV Access (Imperative)

Services that need fine-grained control bypass `useKV` and call `window.spark.kv` directly:

```typescript
// src/lib/collaboration.ts
async getAllPresence(): Promise<Record<string, UserPresence>> {
  const presence = await window.spark.kv.get<Record<string, UserPresence>>(PRESENCE_KEY)
  return presence || {}
}

async updatePresence(updates?: Partial<UserPresence>) {
  const allPresence = await this.getAllPresence()
  allPresence[this.currentUserId] = { ...currentPresence, ...updates, lastSeen: Date.now() }
  await window.spark.kv.set(PRESENCE_KEY, allPresence)
}
```

```typescript
// src/lib/auth.ts
export async function signUp(email, password, name, role): Promise<AuthUser> {
  const users = await window.spark.kv.get<AuthUser[]>(USERS_KEY) || []
  const newUser: AuthUser = { id: `user-${Date.now()}`, email, password, name, role, ... }
  users.push(newUser)
  await window.spark.kv.set(USERS_KEY, users)
  return newUser
}
```

### Pattern 3: Static Factory Methods (Entity Creation)

All entity creation goes through static service methods that produce type-safe objects with generated IDs:

```typescript
// src/lib/services/chat.service.ts
static createChat(title, domain, service, feature, currentUserId): Chat {
  return {
    id: `chat-${Date.now()}`,      // Timestamp-based ID generation
    title,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    messages: [],                   // Empty embedded array
    participants: [currentUserId],
    domain, service, feature,
  }
}

// src/lib/services/pr.service.ts
static createPR(title, description, chatId, currentUser, pendingChanges): PullRequest {
  return {
    id: `pr-${Date.now()}`,
    title, description, chatId,
    author: currentUser.name,
    status: 'open',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    fileChanges: pendingChanges.map((c) => ({ ...c, status: 'staged' as const })),
    comments: [],
    approvals: [],
  }
}
```

### Pattern 4: Immutable Update Chains (LineCommentService)

The `LineCommentService` demonstrates deep immutable updates through nested embedded documents:

```typescript
// src/lib/services/line-comment.service.ts
static addCommentToPR(pr: PullRequest, fileId: string, comment: LineComment, parentId?: string): PullRequest {
  return {
    ...pr,
    fileChanges: pr.fileChanges.map((file) =>
      file.path === fileId
        ? this.addCommentToFile(file, comment, parentId)
        : file
    ),
    updatedAt: Date.now(),
  }
}

static toggleReaction(comment: LineComment, emoji: string, user: User): LineComment {
  const reactions = comment.reactions || []
  const existingReaction = reactions.find((r) => r.emoji === emoji)
  // ... toggle logic with immutable array operations
}
```

### ID Generation Strategy

| Prefix | Entity | Example |
|--------|--------|---------|
| `chat-` | Chat | `chat-1738900000000` |
| `msg-` | Message | `msg-1738900001234` |
| `pr-` | PullRequest | `pr-1738900002000` |
| `comment-` | PRComment | `comment-1738900003000` |
| `line-comment-` | LineComment | `line-comment-1738900004000` |
| `user-` | AuthUser | `user-1738900005000` |
| `event-` | CollaborationEvent | `event-1738900006000` |

All IDs use `${prefix}${Date.now()}` — millisecond timestamps. This is **not collision-safe** under concurrent writes but is acceptable in the Spark single-user/low-concurrency model.

---

## Serialization & Document Embedding

### JSON Storage Format

All KV values are serialized as JSON. The Spark KV API handles serialization/deserialization transparently:

```typescript
// Write: object → JSON string (handled by Spark)
await window.spark.kv.set('chats', chatArray)

// Read: JSON string → typed object (handled by Spark)
const chats = await window.spark.kv.get<Chat[]>('chats')
```

### Embedded Document Pattern

bmad-chat uses a **document embedding** strategy rather than normalization:

```
┌────────────────────────────────────────────────────────────────┐
│ KV Key: "chats"                                                │
│                                                                │
│  [                                                             │
│    {                                                           │
│      "id": "chat-1738900000000",                               │
│      "title": "API Design Discussion",                         │
│      "messages": [                          ◀── EMBEDDED       │
│        {                                                       │
│          "id": "msg-1738900001000",                             │
│          "content": "Let's discuss the REST API...",            │
│          "fileChanges": [                   ◀── NESTED EMBED   │
│            {                                                   │
│              "path": ".bmad/api-spec.md",                      │
│              "additions": ["# API Spec", "..."],               │
│              "lineComments": [              ◀── DEEP EMBED     │
│                {                                               │
│                  "id": "line-comment-...",                      │
│                  "replies": [               ◀── SELF-REF       │
│                    { "id": "line-comment-...", ... }            │
│                  ]                                             │
│                }                                               │
│              ]                                                 │
│            }                                                   │
│          ],                                                    │
│          "translations": [                  ◀── NESTED EMBED   │
│            { "role": "business", "segments": [...] }           │
│          ]                                                     │
│        }                                                       │
│      ]                                                         │
│    }                                                           │
│  ]                                                             │
└────────────────────────────────────────────────────────────────┘
```

**Trade-offs of embedding:**

| Benefit | Drawback |
|---------|----------|
| Single read fetches entire conversation | Document size grows unbounded |
| No joins or multi-key lookups needed | Every update rewrites the full array |
| Simple mental model for developers | No cross-entity querying capability |
| Natural fit for KV storage | Potential data duplication (author names vs IDs) |

---

## Data Validation

### Current State

Data validation is **compile-time only** via TypeScript interfaces. There is no runtime validation at the KV boundary.

| Validation Layer | Status | Details |
|-----------------|--------|---------|
| TypeScript compile-time | ✅ Active | All types enforce shape at build time |
| Runtime schema validation | ❌ Missing | No Zod, Yup, or io-ts schemas |
| KV write validation | ❌ Missing | `window.spark.kv.set()` accepts any JSON |
| Input sanitization | ❌ Missing | User content stored as raw strings |
| Email format validation | ❌ Missing | `auth.ts` does email lookup, not format validation |
| Password strength | ❌ Missing | No minimum length or complexity check |
| ID uniqueness guarantees | ⚠️ Weak | Timestamp-based — collision possible under concurrent writes |

### Recommendations

1. **Add Zod schemas** mirroring each TypeScript interface for runtime validation
2. **Validate at KV boundaries** — wrap `window.spark.kv.set()` with schema checks
3. **Sanitize user input** — HTML-escape message content and comment text
4. **Add email format validation** — regex check in `signUp()` before KV write
5. **Hash passwords** — replace plaintext storage with bcrypt or Spark-compatible hashing

---

## Performance Considerations

### KV Store Limitations

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PERFORMANCE RISK MATRIX                           │
├──────────────────────┬──────────┬────────────────────────────────────┤
│ Risk                 │ Severity │ Trigger Condition                  │
├──────────────────────┼──────────┼────────────────────────────────────┤
│ Chat document bloat  │ HIGH     │ >100 messages with file changes    │
│ Full-array rewrite   │ MEDIUM   │ Every setChats() call              │
│ User list scan       │ LOW      │ >1000 registered users             │
│ Presence polling     │ LOW      │ 2-second interval, small payload   │
│ Event buffer overflow│ LOW      │ Capped at 100 events               │
│ PR with many files   │ MEDIUM   │ >50 file changes with comments     │
│ Deep comment threads │ LOW      │ >10 reply levels (recursive)       │
└──────────────────────┴──────────┴────────────────────────────────────┘
```

### Read/Write Amplification

Every mutation to the `chats` KV key requires:
1. **Read** the entire `Chat[]` array from KV
2. **Find** the target chat by ID (O(n) scan)
3. **Clone** the chat object with spread operator (deep copy of messages)
4. **Write** the entire `Chat[]` array back to KV

For a workspace with 50 chats averaging 100 messages each, a single message send writes ~5000 message objects back to KV, even though only one was added.

### Mitigation Strategies

| Strategy | Impact | Complexity |
|----------|--------|------------|
| Paginate messages (lazy load) | Reduces read payload by 90%+ | Medium |
| Separate message KV key per chat | Eliminates cross-chat rewrite | High (breaking change) |
| Index KV key for chat metadata | Fast list without message payload | Medium |
| Archive old chats to cold storage | Bounds active dataset | Low |
| Debounce presence updates | Reduces write frequency | Already done (5s interval) |

---

## Migration to Backend Database

The bmadServer (.NET Aspire) backend is providing SparkCompat API endpoints. The following table maps client-side types to planned backend entities:

### Type → Entity Migration Map

| Client Type (TS) | Backend Entity (C#) | SparkCompat Controller | Migration Notes |
|-------------------|--------------------|-----------------------|-----------------|
| `User` | `SparkUser` | `AuthCompat` | Add password hashing, remove plaintext |
| `AuthUser` | `SparkUser` | `AuthCompat` | Merge with `User`, add `PasswordHash` field |
| `Chat` | `SparkChat` | `ChatsCompat` | Extract messages to separate `SparkMessage` table |
| `Message` | `SparkMessage` | `ChatsCompat` | Add `ChatId` FK, remove embedding |
| `PullRequest` | `SparkPullRequest` | `PullRequestsCompat` | Extract file changes to separate table |
| `FileChange` | `SparkFileChange` | `PullRequestsCompat` | Add `PullRequestId` FK |
| `LineComment` | `SparkLineComment` | `PullRequestsCompat` | Add `FileChangeId` FK, `ParentCommentId` for replies |
| `PRComment` | `SparkPRComment` | `PullRequestsCompat` | Add `PullRequestId` FK |
| `EmojiReaction` | `SparkReaction` | `PullRequestsCompat` | Normalize to junction table (User ↔ Comment ↔ Emoji) |
| `UserPresence` | `SparkPresence` | `PresenceCompat` | Move to Redis/SignalR for real-time |
| `CollaborationEvent` | `SparkCollabEvent` | `CollabEventsCompat` | Move to event streaming (SignalR) |
| `MessageTranslation` | `SparkTranslation` | `ChatsCompat` | Add `MessageId` FK |
| `TranslatedSegment` | `SparkTranslationSegment` | `ChatsCompat` | Add `TranslationId` FK |

### Schema Normalization Recommendations

```
┌─────────────────────────────────────────────────────────────────────┐
│            CURRENT (EMBEDDED)  →  TARGET (NORMALIZED)               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  chats KV key                    SparkChats table                   │
│  ┌───────────┐                   ┌───────────────┐                  │
│  │ Chat      │                   │ SparkChat     │                  │
│  │  messages[]│─── EXTRACT ────▶ │ Id (PK)       │                  │
│  │           │                   │ Title         │                  │
│  └───────────┘                   │ CreatedAt     │                  │
│                                  └───────┬───────┘                  │
│                                          │ 1:N                      │
│                                          ▼                          │
│                                  ┌───────────────┐                  │
│                                  │ SparkMessage  │                  │
│                                  │ Id (PK)       │                  │
│                                  │ ChatId (FK) ──┼──▶ SparkChat    │
│                                  │ Content       │                  │
│                                  │ Role          │                  │
│                                  └───────────────┘                  │
│                                                                     │
│  pull-requests KV key            SparkPullRequests table            │
│  ┌───────────┐                   ┌───────────────┐                  │
│  │ PR        │                   │ SparkPR       │                  │
│  │ files[]   │─── EXTRACT ────▶ │ Id (PK)       │                  │
│  │ comments[]│                   │ ChatId (FK)   │                  │
│  └───────────┘                   └───────┬───────┘                  │
│                                      1:N │   │ 1:N                  │
│                              ┌───────────┘   └──────────┐           │
│                              ▼                          ▼           │
│                     ┌───────────────┐          ┌───────────────┐    │
│                     │SparkFileChange│          │ SparkPRComment│    │
│                     │ Id (PK)       │          │ Id (PK)       │    │
│                     │ PRId (FK)     │          │ PRId (FK)     │    │
│                     └───────┬───────┘          └───────────────┘    │
│                             │ 1:N                                   │
│                             ▼                                       │
│                    ┌────────────────┐                                │
│                    │SparkLineComment│                                │
│                    │ Id (PK)        │                                │
│                    │ FileChangeId   │                                │
│                    │ ParentId (FK)  │──▶ self (threading)            │
│                    └────────────────┘                                │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Migration Priority

| Phase | Action | Entities | API Impact |
|-------|--------|----------|------------|
| **Phase 1** | Auth migration | `User`, `AuthUser` → `SparkUser` | `/v1/auth/*` endpoints (DONE) |
| **Phase 2** | Chat persistence | `Chat`, `Message` → normalized tables | `/v1/chats/*` endpoints |
| **Phase 3** | PR persistence | `PullRequest`, `FileChange`, `LineComment` | `/v1/pull-requests/*` endpoints |
| **Phase 4** | Real-time layer | `UserPresence`, `CollaborationEvent` → SignalR | `/v1/presence/*` + WebSocket |
| **Phase 5** | AI integration | `AIResponse` → server-side orchestration | `/v1/ai/*` endpoints |

---

## Related Documentation

- [architecture.md](architecture.md) — System architecture and component overview
- [api-surface.md](api-surface.md) — API endpoints and service interfaces
- [integration-map.md](integration-map.md) — External dependencies and integration points
- [onboarding.md](onboarding.md) — Developer setup and contribution guide

---

*Auto-generated by LENS Discovery System — SCOUT Analyze Codebase + Generate Docs Workflow*
