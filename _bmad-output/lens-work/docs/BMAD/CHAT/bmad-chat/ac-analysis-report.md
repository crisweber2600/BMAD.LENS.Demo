# AC Analysis Report: bmad-chat

**Project:** BMAD - Business Model Architecture Design Platform  
**Path:** `TargetProjects/BMAD/CHAT/bmad-chat`  
**Analyzed:** 2026-02-07  
**Phase:** AC (Analyze Codebase)  
**Total Lines:** 10,615 (94 source files)  
**App Code:** ~5,559 lines (excl. shadcn/ui)  

---

## 1. Architecture Analysis

### 1.1 High-Level Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                    GitHub Spark Platform                          │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │                   Browser Runtime                         │    │
│  │                                                           │    │
│  │  ┌─────────────────────────────────────────────────────┐  │    │
│  │  │              App.tsx (661 lines)                     │  │    │
│  │  │         MONOLITHIC ORCHESTRATOR                      │  │    │
│  │  │                                                      │  │    │
│  │  │  ┌────────────┐ ┌──────────────┐ ┌──────────────┐   │  │    │
│  │  │  │ useAuth()  │ │  useChats()  │ │usePullReqs() │   │  │    │
│  │  │  └────┬───────┘ └──────┬───────┘ └──────┬───────┘   │  │    │
│  │  │       │                │                │            │  │    │
│  │  │  ┌────┴───────┐ ┌──────┴───────┐ ┌──────┴───────┐   │  │    │
│  │  │  │ useUIState │ │useChatAction │ │usePendChg()  │   │  │    │
│  │  │  └────────────┘ └──────────────┘ └──────────────┘   │  │    │
│  │  │       │                │                │            │  │    │
│  │  │  ┌────┴───────────────┴────────────────┴─────────┐   │  │    │
│  │  │  │           useCollaboration()                   │   │  │    │
│  │  │  └────────────────────────────────────────────────┘   │  │    │
│  │  └─────────────────────────┬───────────────────────────┘  │    │
│  │                            │                               │    │
│  │  ┌─────────────────────────┴───────────────────────────┐  │    │
│  │  │               Service Layer                          │  │    │
│  │  │  ┌─────────┐ ┌────────┐ ┌────────┐ ┌─────────────┐  │  │    │
│  │  │  │AIService│ │ChatSvc │ │PRSvc   │ │LineCommentSvc│  │  │    │
│  │  │  │(111 ln) │ │(63 ln) │ │(76 ln) │ │ (200 ln)    │  │  │    │
│  │  │  └────┬────┘ └────────┘ └────────┘ └─────────────┘  │  │    │
│  │  │       │                                               │  │    │
│  │  └───────┼───────────────────────────────────────────────┘  │    │
│  │          │                                                   │    │
│  │  ┌───────┴──────────────────────────────────────────────┐   │    │
│  │  │           Platform APIs (window.spark.*)              │   │    │
│  │  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐    │   │    │
│  │  │  │ spark.kv │  │spark.llm │  │ @github/spark    │    │   │    │
│  │  │  │  .get()  │  │ (GPT-4o) │  │  hooks: useKV    │    │   │    │
│  │  │  │  .set()  │  │          │  │  plugins: vite   │    │   │    │
│  │  │  │  .delete │  │          │  │                   │    │   │    │
│  │  │  └──────────┘  └──────────┘  └──────────────────┘    │   │    │
│  │  └──────────────────────────────────────────────────────┘   │    │
│  └──────────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────────┘
```

### 1.2 Component Hierarchy

```
<ErrorBoundary>                    (react-error-boundary)
  <App>                            (661 lines — MONOLITH)
    ├── <AuthForm>                 (if !authenticated, 180 lines)
    ├── <Toaster>                  (sonner)
    ├── HEADER BAR
    │   ├── <Sheet> + <ChatList>   (mobile sidebar, 246 lines)
    │   ├── <ActiveUsers>          (88 lines)
    │   └── <Avatar> + user info
    ├── MAIN AREA
    │   ├── <ChatList>             (desktop sidebar, 246 lines)
    │   ├── <MomentumDashboard>    (if showDashboard, 324 lines)
    │   │   └── momentum metrics, narrative, next-actions
    │   ├── CHAT VIEW (if activeChat)
    │   │   ├── <ChatMessage>*     (103 lines each)
    │   │   │   ├── <TranslateButton>  (61 lines)
    │   │   │   └── <TranslatedText>   (100 lines)
    │   │   ├── <TypingIndicator>  (64 lines)
    │   │   └── <ChatInput>        (93 lines)
    │   └── RIGHT PANEL
    │       ├── TAB: Changes
    │       │   ├── <FileDiffViewer>     (158 lines)
    │       │   │   ├── <FilePreviewDialog>    (466 lines)
    │       │   │   │   └── <InlineCommentThread>  (255 lines)
    │       │   │   │       ├── <EmojiReactionPicker>  (50 lines)
    │       │   │   │       └── <EmojiReactionsDisplay> (52 lines)
    │       │   │   └── <DocumentTranslationView>  (259 lines)
    │       │   └── Create PR button
    │       ├── TAB: PRs
    │       │   └── <PRCard>*      (79 lines)
    │       └── TAB: Activity
    │           └── <ActivityFeed> (88 lines)
    ├── <PRDialog>                 (226 lines)
    │   ├── <FileDiffViewer>
    │   └── <AllFilesPreviewDialog> (57 lines)
    ├── <CreatePRDialog>           (115 lines)
    └── <NewChatDialog>            (176 lines)
```

### 1.3 State Management Pattern

**No centralized state store.** All state is managed through:

| Mechanism | Used By | Persistence |
|-----------|---------|-------------|
| `useKV<T>()` (Spark hook) | chats, pullRequests | Spark KV (cloud-persistent) |
| `useState()` (React local) | pendingChanges, UI state | In-memory only (lost on refresh) |
| `window.spark.kv` (raw KV) | auth users, presence, events | Spark KV (cloud-persistent) |

**Critical observation:** `pendingChanges` uses `useState` — all pending file changes are lost on page refresh. This is a data loss risk.

### 1.4 Data Flow

```
User Input → ChatInput.onSend()
  → App.handleSendMessage()
    → useChatActions.handleSendMessage()
      → sendMessage() (use-chats.ts)
        → ChatService.createMessage() → addMessage() → setChats (KV)
        → AIService.generateChatResponse() → window.spark.llm()
        → AI response parsed → addMessage() + addPendingChanges()
        → broadcastEvent() → collaborationService → KV events store
```

---

## 2. API Surface Analysis

### 2.1 Service Layer (Static Class Methods)

#### AIService (111 lines)
```typescript
class AIService {
  static async generateChatResponse(content: string, currentUser: User): Promise<AIResponse>
  static async translateMessage(content: string, currentUserRole: UserRole): Promise<TranslationResponse>
  private static getRoleGuidance(role: UserRole): string
}

interface AIResponse {
  response: string
  suggestedChanges?: any[]           // ⚠️ untyped — uses `any[]`
  routingAssessment?: string
  momentumIndicator?: string
}

interface TranslationResponse {
  segments: TranslatedSegment[]
}
```

#### ChatService (63 lines)
```typescript
class ChatService {
  static createChat(title, domain, service, feature, currentUserId): Chat
  static createMessage(chatId, content, userId, role, fileChanges?): Message
  static extractOrganization(chats: Chat[]): { domains: string[], services: string[], features: string[] }
}
```

#### PRService (76 lines)
```typescript
class PRService {
  static createPR(title, description, chatId, currentUser, pendingChanges): PullRequest
  static mergePR(pr: PullRequest): PullRequest
  static closePR(pr: PullRequest): PullRequest
  static approvePR(pr: PullRequest, userId: string): PullRequest
  static addComment(pr: PullRequest, content: string, author: string): PullRequest
  static filterByStatus(prs: PullRequest[], status: PRStatus): PullRequest[]
}
```

#### LineCommentService (200 lines)
```typescript
class LineCommentService {
  static createLineComment(fileId, lineNumber, lineType, content, currentUser): LineComment
  static addReplyToComment(comment: LineComment, reply: LineComment): LineComment
  static resolveComment(comment: LineComment): LineComment
  static toggleReaction(comment: LineComment, emoji: string, user: User): LineComment
  static addCommentToFile(file: FileChange, comment: LineComment, parentId?: string): FileChange
  static resolveCommentInFile(file: FileChange, commentId: string): FileChange
  static toggleReactionInFile(file: FileChange, commentId: string, emoji: string, user: User): FileChange
  static addCommentToPR(pr: PullRequest, fileId: string, comment: LineComment, parentId?: string): PullRequest
  static resolveCommentInPR(pr: PullRequest, commentId: string): PullRequest
  static toggleReactionInPR(pr: PullRequest, commentId: string, emoji: string, user: User): PullRequest
}
```

#### CollaborationService (145 lines) — **Singleton instance**
```typescript
class CollaborationService {
  async initialize(userId: string): void
  async cleanup(): void
  async updatePresence(updates?: Partial<UserPresence>): void
  async getAllPresence(): Promise<Record<string, UserPresence>>
  async getActiveUsers(chatId?: string): Promise<UserPresence[]>
  async setTyping(chatId: string, isTyping: boolean): void
  async setActiveChat(chatId: string | null): void
  async removePresence(userId: string): void
  async cleanupStalePresence(): void
  async broadcastEvent(event: CollaborationEvent): void
  async getRecentEvents(since: number): Promise<CollaborationEvent[]>
  subscribe(eventType: string, callback: (event: CollaborationEvent) => void): () => void
  notifyListeners(event: CollaborationEvent): void
}

// Exported as singleton:
export const collaborationService = new CollaborationService()
```

#### Auth Module (62 lines) — **Raw functions, NOT a class**
```typescript
async function signUp(email, password, name, role): Promise<AuthUser>
async function signIn(email: string, password: string): Promise<AuthUser>
async function setCurrentUser(user: AuthUser): Promise<void>
async function getCurrentUser(): Promise<AuthUser | null>
async function signOut(): Promise<void>
// private:
async function getAllUsers(): Promise<AuthUser[]>
```

### 2.2 Hook APIs

#### useAuth() → auth state + actions
```typescript
{
  currentUser: User | null
  isAuthenticated: boolean
  isLoadingAuth: boolean
  handleSignIn: (email: string, password: string) => Promise<void>
  handleSignUp: (email: string, password: string, name: string, role: UserRole) => Promise<void>
  handleSignOut: () => Promise<void>
}
```

#### useChats() → chat CRUD + KV persistence
```typescript
{
  chats: Chat[]
  createChat: (domain, service, feature, title, currentUserId) => Chat
  addMessage: (chatId: string, message: Message) => void
  addTranslation: (chatId: string, messageId: string, translation: MessageTranslation) => void
  getChatById: (chatId: string | null) => Chat | undefined
  getOrganization: () => { domains: string[], services: string[], features: string[] }
}
```

#### usePullRequests() → PR lifecycle + KV persistence
```typescript
{
  pullRequests: PullRequest[]
  createPR: (title, description, chatId, currentUser, pendingChanges, onBroadcast?) => PullRequest
  mergePR: (prId: string, onBroadcast?) => void
  closePR: (prId: string) => void
  approvePR: (prId: string, userId: string) => void
  commentOnPR: (prId: string, content: string, author: string) => void
  addLineComment: (prId, fileId, lineNumber, lineType, content, currentUser, parentId?, onBroadcast?) => void
  resolveLineComment: (prId: string, commentId: string) => void
  toggleLineCommentReaction: (prId, commentId, emoji, currentUser) => void
  getOpenPRs: () => PullRequest[]
  getMergedPRs: () => PullRequest[]
  getClosedPRs: () => PullRequest[]
}
```

#### usePendingChanges() → local-only staging area
```typescript
{
  pendingChanges: FileChange[]
  addChanges: (changes: FileChange[]) => void
  clearChanges: () => void
  addLineComment: (fileId, lineNumber, lineType, content, currentUser, parentId?) => void
  resolveLineComment: (commentId: string) => void
  toggleLineCommentReaction: (commentId, emoji, currentUser) => void
  hasChanges: boolean
}
```

#### useUIState() → all UI panel/dialog state
```typescript
{
  isMobile: boolean
  activeChat: string | null
  selectedPR: PullRequest | null
  prDialogOpen: boolean; setPRDialogOpen
  createPRDialogOpen: boolean; setCreatePRDialogOpen
  newChatDialogOpen: boolean; setNewChatDialogOpen
  isTyping: boolean; setIsTyping
  chatListOpen: boolean; setChatListOpen
  rightPanelOpen: boolean; setRightPanelOpen
  rightPanelCollapsed: boolean; setRightPanelCollapsed
  showDashboard: boolean
  handleSelectChat: (chatId: string) => void
  handleViewPR: (pr: PullRequest) => void
  handleGoHome: () => void
  handleNewChat: () => void
}
```

#### useCollaboration(currentUser, activeChat) → presence + events
```typescript
{
  activeUsers: UserPresence[]
  typingUsers: UserPresence[]
  recentEvents: CollaborationEvent[]
  setTyping: (isTyping: boolean) => Promise<void>
  broadcastEvent: (type: CollaborationEvent['type'], metadata?: Record<string, any>) => Promise<void>
  subscribeToEvent: (eventType: string, callback: (event: CollaborationEvent) => void) => () => void
}
```

#### useChatActions(activeChat, currentUser, ...deps) → message sending
```typescript
{
  handleSendMessage: (content: string) => Promise<void>
  handleTranslateMessage: (messageId: string, content: string) => Promise<void>
  handleTypingChange: (isTyping: boolean) => Promise<void>
}
```

#### useIsMobile() → responsive breakpoint
```typescript
(): boolean   // true when window.innerWidth < 768
```

### 2.3 OpenAPI Spec (Backend Blueprint — 1,804 lines)

The `openapi.yaml` defines 27 endpoints across 9 tags that represent the target backend API:

| Tag | Endpoints | Operations |
|-----|-----------|------------|
| **Authentication** | `/auth/signup`, `/auth/signin`, `/auth/signout`, `/auth/me` | POST, POST, POST, GET |
| **Users** | `/users/{userId}`, `/users/{userId}/presence` | GET, PUT |
| **Chats** | `/chats`, `/chats/{chatId}` | GET, POST, GET, PATCH, DELETE |
| **Messages** | `/chats/{chatId}/messages` | GET, POST |
| **AI** | `/chats/{chatId}/messages/{messageId}/translate`, `/ai/defaults` | POST, POST |
| **Pull Requests** | `/pull-requests`, `/pull-requests/{prId}`, `…/merge`, `…/close`, `…/approve`, `…/comments` | GET, POST, GET, PATCH, POST, POST, POST, GET, POST |
| **File Changes** | `/pull-requests/{prId}/files/{fileId}/comments`, `…/resolve`, `…/reactions` | POST, POST, POST |
| **Collaboration** | `/presence`, `/collaboration/events` | GET, GET, POST |
| **Organization** | `/organization/domains`, `/organization/services`, `/organization/features` | GET, GET, GET |
| **System** | `/health` | GET |

**Security:** Bearer JWT + Cookie auth (defined but NOT implemented in frontend — see Security section)

---

## 3. Data Model Analysis

### 3.1 Complete Type Inventory (134 lines in types.ts)

```typescript
// === ENUMS / UNIONS ===
type UserRole = 'technical' | 'business'
type PRStatus = 'open' | 'merged' | 'closed' | 'draft'

// === CORE ENTITIES ===
interface User {
  id: string                    // Format: "user-{timestamp}"
  name: string
  avatarUrl: string             // DiceBear API URL
  role: UserRole
  email: string
  password?: string             // ⚠️ SECURITY: Optional but present in runtime
}

interface AuthUser {
  id: string                    // Format: "user-{timestamp}"
  email: string
  password: string              // ⚠️ SECURITY: PLAINTEXT in KV store
  name: string
  role: UserRole
  avatarUrl: string
  createdAt: number             // Unix timestamp (ms)
}

interface Chat {
  id: string                    // Format: "chat-{timestamp}"
  title: string
  createdAt: number
  updatedAt: number
  messages: Message[]           // Embedded (not referenced)
  participants: string[]        // User IDs
  domain?: string               // Taxonomy level 1
  service?: string              // Taxonomy level 2
  feature?: string              // Taxonomy level 3
}

interface Message {
  id: string                    // Format: "msg-{timestamp}"
  chatId: string
  content: string
  role: 'user' | 'assistant'
  timestamp: number
  userId?: string               // Only for user messages
  fileChanges?: FileChange[]    // AI-suggested doc changes
  translations?: MessageTranslation[]
}

interface PullRequest {
  id: string                    // Format: "pr-{timestamp}"
  title: string
  description: string
  chatId: string
  author: string                // User name (not ID) — ⚠️ inconsistency
  status: PRStatus
  createdAt: number
  updatedAt: number
  fileChanges: FileChange[]
  comments: PRComment[]
  approvals: string[]           // User IDs
}

// === SUPPORTING TYPES ===
interface FileChange {
  path: string                  // e.g., ".bmad/decisions/auth.md"
  additions: string[]           // Lines to add
  deletions: string[]           // Lines to remove
  status: 'pending' | 'staged' | 'committed'
  lineComments?: LineComment[]
}

interface LineComment {
  id: string                    // Format: "line-comment-{timestamp}"
  fileId: string
  lineNumber: number
  lineType: 'addition' | 'deletion' | 'unchanged'
  author: string
  authorAvatar: string
  content: string
  timestamp: number
  resolved: boolean
  replies?: LineComment[]       // Recursive (tree structure)
  reactions?: EmojiReaction[]
}

interface PRComment {
  id: string                    // Format: "comment-{timestamp}"
  prId: string
  author: string
  content: string
  timestamp: number
}

interface MessageTranslation {
  role: UserRole
  segments: TranslatedSegment[]
}

interface TranslatedSegment {
  originalText: string
  startIndex: number
  endIndex: number
  explanation: string
  context: string
  simplifiedText?: string
}

interface EmojiReaction {
  emoji: string
  userIds: string[]
  userNames: string[]
}

interface UserPresence {
  userId: string
  userName: string
  avatarUrl: string
  activeChat: string | null
  lastSeen: number
  isTyping: boolean
  typingChatId: string | null
  cursorPosition?: { chatId: string; messageId: string }
}

interface CollaborationEvent {
  id: string                    // Format: "event-{timestamp}"
  type: 'user_join' | 'user_leave' | 'typing_start' | 'typing_stop' |
        'message_sent' | 'pr_created' | 'pr_updated'
  userId: string
  userName: string
  chatId?: string
  prId?: string
  timestamp: number
  metadata?: Record<string, any>
}
```

### 3.2 Entity Relationship Diagram

```
┌──────────┐     1:N    ┌──────────┐     1:N    ┌──────────┐
│   User   │◄───────────│   Chat   │◄───────────│ Message  │
│          │participants│          │  messages   │          │
│ id       │            │ id       │             │ id       │
│ email    │            │ title    │             │ content  │
│ password │            │ domain   │             │ role     │
│ name     │            │ service  │             │ userId   │
│ role     │            │ feature  │             │ fileChgs │
│ avatar   │            │ created  │             │ translns │
└──────────┘            └──────────┘             └──────────┘
      │                       │                       │
      │ 1:N                   │ 1:N                   │ 0:N
      ▼                       ▼                       ▼
┌──────────┐            ┌──────────┐            ┌──────────┐
│Presence  │            │PullReq   │            │FileChange│
│          │            │          │  1:N        │          │
│ userId   │            │ id       │◄───────────│ path     │
│ userName │            │ title    │ fileChanges │ adds     │
│ activeChat│           │ status   │             │ deletes  │
│ isTyping │            │ author   │             │ status   │
│ lastSeen │            │ chatId   │             │ lineCmts │
└──────────┘            │ apprvls  │             └──────────┘
                        │ comments │                  │
                        └──────────┘                  │ 0:N
                              │                       ▼
                              │ 1:N             ┌──────────┐
                              ▼                 │LineCmnt  │
                        ┌──────────┐            │          │
                        │PRComment │            │ id       │
                        │          │            │ lineNum  │
                        │ id       │            │ author   │
                        │ author   │            │ content  │
                        │ content  │            │ resolved │
                        │ timestamp│            │ replies  │◄─┐
                        └──────────┘            │ reactions│   │ recursive
                                                └──────────┘───┘
```

### 3.3 KV Store Schema

| Key | Type | Scope |
|-----|------|-------|
| `docflow-users` | `AuthUser[]` | All registered users (with passwords) |
| `docflow-current-user` | `AuthUser` | Currently authenticated user |
| `chats` | `Chat[]` | All chat conversations with embedded messages |
| `pull-requests` | `PullRequest[]` | All PRs with embedded file changes |
| `user-presence` | `Record<string, UserPresence>` | Active user presence map |
| `collaboration-events` | `CollaborationEvent[]` | Event log (max 100 entries) |

---

## 4. Integration Analysis

### 4.1 GitHub Spark Platform Integration

| Integration Point | Usage | Location |
|-------------------|-------|----------|
| `window.spark.kv.get<T>(key)` | Read from KV store | auth.ts, collaboration.ts |
| `window.spark.kv.set(key, value)` | Write to KV store | auth.ts, collaboration.ts |
| `window.spark.kv.delete(key)` | Delete from KV store | auth.ts (signOut) |
| `window.spark.llm(prompt, model, json)` | AI inference (GPT-4o) | ai.service.ts |
| `useKV<T>(key, default)` | React hook for KV state | use-chats.ts, use-pull-requests.ts |
| `@github/spark/spark` | Platform initialization | main.tsx |
| `@github/spark/hooks` | Hook imports (useKV) | use-chats.ts, use-pull-requests.ts |
| `sparkPlugin()` | Vite plugin | vite.config.ts |
| `createIconImportProxy()` | Phosphor icon proxy | vite.config.ts |

### 4.2 AI Integration (GPT-4o)

Two AI operations, both via `window.spark.llm()`:

1. **Chat Response Generation** (`AIService.generateChatResponse`)
   - Model: `gpt-4o`
   - JSON mode: `true`
   - Input: User message + role context + system prompt
   - Output: `{ response, suggestedChanges[], routingAssessment, momentumIndicator }`
   - System prompt: 560+ characters with role-specific guidance

2. **Message Translation** (`AIService.translateMessage`)
   - Model: `gpt-4o`
   - JSON mode: `true`
   - Input: Message content + target role
   - Output: `{ segments: TranslatedSegment[] }`
   - Identifies jargon and provides role-appropriate explanations

### 4.3 External Dependencies (No Backend APIs)

The app has **ZERO HTTP API calls**. Everything runs in-browser:
- No `fetch()` or `axios` calls to external APIs
- No WebSocket connections
- No REST client usage
- The `@octokit/core` and `octokit` packages are in `package.json` but **never imported** in app code
- The `@tanstack/react-query` package is unused — no `useQuery`/`useMutation` calls found

### 4.4 Avatar Generation

External service call (non-API): DiceBear avatars via URL construction:
```
https://api.dicebear.com/7.x/initials/svg?seed={name}
```

---

## 5. Dependency Analysis

### 5.1 Production Dependencies (56 total)

| Category | Packages | Notes |
|----------|----------|-------|
| **Core Framework** | react ^19, react-dom ^19 | React 19 (latest) |
| **Build** | vite ^7.2.6, @vitejs/plugin-react-swc ^4.2.2 | Vite 7 + SWC |
| **Styling** | tailwindcss ^4.1.11, @tailwindcss/vite, tailwind-merge, clsx, tw-animate-css | Tailwind 4 + utilities |
| **UI Components** | 22× @radix-ui/* packages, class-variance-authority | shadcn/ui foundation |
| **Icons** | @phosphor-icons/react, lucide-react, @heroicons/react | 3 icon libraries (⚠️ redundant) |
| **Platform** | @github/spark >=0.43.1 | Spark runtime + KV + LLM |
| **Animation** | framer-motion ^12.6.2 | Motion animations |
| **3D/Viz** | three ^0.175.0, d3 ^7.9.0, recharts ^2.15.1 | Heavy viz libs (⚠️ usage unclear) |
| **Forms** | react-hook-form ^7.54.2, @hookform/resolvers ^4.1.3, zod ^3.25.76 | RHF + Zod validation |
| **Markdown** | marked ^15.0.7 | MD rendering |
| **Date** | date-fns ^3.6.0, react-day-picker ^9.6.7 | Date utilities |
| **GitHub** | octokit ^4.1.2, @octokit/core ^6.1.4 | ⚠️ Imported but UNUSED |
| **Layout** | react-resizable-panels ^2.1.7, vaul ^1.1.2, cmdk ^1.1.1 | Panels, drawer, command |
| **Carousel** | embla-carousel-react ^8.5.2 | Carousel |
| **OTP** | input-otp ^1.4.2 | OTP input |
| **Theming** | next-themes ^0.4.6, @radix-ui/colors | Theme switching |
| **Errors** | react-error-boundary ^6.0.0 | Error boundary |
| **Toast** | sonner ^2.0.1 | Toast notifications |
| **Utils** | uuid ^11.1.0 | UUID generation |

### 5.2 Dev Dependencies (13 total)

| Package | Version | Purpose |
|---------|---------|---------|
| typescript | ~5.7.2 | TypeScript compiler |
| eslint | ^9.28.0 | Linting |
| eslint-plugin-react-hooks | ^5.2.0 | React hooks lint rules |
| eslint-plugin-react-refresh | ^0.4.19 | Fast refresh lint |
| typescript-eslint | ^8.38.0 | TS ESLint integration |
| globals | ^16.0.0 | Global types |
| @types/react | ^19.0.10 | React type defs |
| @types/react-dom | ^19.0.4 | ReactDOM type defs |
| @tailwindcss/postcss | ^4.1.8 | PostCSS plugin |

### 5.3 Unused/Questionable Dependencies

| Package | Status | Evidence |
|---------|--------|----------|
| `three` | Likely unused | No `import` from `three` found in src/ |
| `d3` | Likely unused | No `import` from `d3` found in src/ |
| `octokit` | Unused | Package present, no imports in app code |
| `@octokit/core` | Unused | Package present, no imports in app code |
| `input-otp` | Used by shadcn only | UI component installed but not used in app |
| `embla-carousel-react` | Used by shadcn only | UI component installed but not used in app |
| `@heroicons/react` | Minimal use | Only in ErrorFallback (lucide used there too) |

---

## 6. Component Inventory

### 6.1 Application Components (21 files, ~3,435 lines)

| Component | Lines | Props Interface | Key Responsibility |
|-----------|-------|-----------------|-------------------|
| App.tsx | 661 | — (root) | Orchestrates everything, all event handlers |
| MomentumDashboard.tsx | 324 | MomentumDashboardProps | Narrative dashboard with momentum metrics |
| FilePreviewDialog.tsx | 466 | — | Full file diff preview with inline commenting |
| DocumentTranslationView.tsx | 259 | — | Role-based document translation viewer |
| InlineCommentThread.tsx | 255 | — | Threaded line comments with reactions |
| ChatList.tsx | 246 | — | Chat sidebar with search/filter |
| PRDialog.tsx | 226 | PRDialogProps | PR review dialog with comments/approval |
| AuthForm.tsx | 180 | AuthFormProps | Sign in/up form with role selection |
| NewChatDialog.tsx | 176 | — | Chat creation with domain/service/feature |
| FileDiffViewer.tsx | 158 | FileDiffViewerProps | File change accordion with diff display |
| CreatePRDialog.tsx | 115 | — | PR creation from pending changes |
| ChatMessage.tsx | 103 | ChatMessageProps | Message bubble with translation support |
| TranslatedText.tsx | 100 | — | Inline translated text with highlights |
| ChatInput.tsx | 93 | ChatInputProps | Message input with typing detection |
| ActiveUsers.tsx | 88 | — | Active users avatar row |
| ActivityFeed.tsx | 88 | — | Collaboration event timeline |
| PRCard.tsx | 79 | — | PR summary card |
| TypingIndicator.tsx | 64 | — | Who-is-typing indicator |
| TranslateButton.tsx | 61 | — | Translate toggle button |
| EmojiReactionsDisplay.tsx | 52 | — | Emoji reaction badges |
| EmojiReactionPicker.tsx | 50 | — | Emoji picker popup |
| AllFilesPreviewDialog.tsx | 57 | — | Multi-file preview |
| ErrorFallback.tsx | 40 | — | Error boundary fallback UI |

### 6.2 UI Components (shadcn/ui — 46 files, ~5,056 lines)

Standard shadcn/ui components. Largest:  
`sidebar.tsx` (726), `chart.tsx` (351), `menubar.tsx` (276), `dropdown-menu.tsx` (259), `context-menu.tsx` (254), `carousel.tsx` (242)

---

## 7. Code Quality Analysis

### 7.1 Complexity Hotspots

| File | Lines | Cyclomatic Concern | Issue |
|------|-------|--------------------|-------|
| **App.tsx** | 661 | **CRITICAL** | Single component with 15+ event handlers, 7 hook calls, 4 dialog states, 2 panel states. God component. |
| **FilePreviewDialog.tsx** | 466 | HIGH | Complex diff rendering with inline comment overlay |
| **MomentumDashboard.tsx** | 324 | MEDIUM | Multiple conditional rendering paths in momentum calculation |
| **InlineCommentThread.tsx** | 255 | MEDIUM | Recursive comment tree with reaction management |

### 7.2 Anti-Patterns Detected

| Anti-Pattern | Severity | Location | Description |
|-------------|----------|----------|-------------|
| **God Component** | 🔴 CRITICAL | App.tsx | 661 lines, all state + event handlers + layout in one component |
| **Prop Drilling** | 🟠 HIGH | App.tsx → children | 10+ callback props drilled through 3-4 levels |
| **Timestamp-Based IDs** | 🟠 HIGH | All services | `Date.now()` for IDs — collision risk under concurrency |
| **Untyped AI Responses** | 🟡 MEDIUM | ai.service.ts:11 | `suggestedChanges?: any[]` bypasses type safety |
| **Mixed Persistence** | 🟡 MEDIUM | Hooks layer | useState vs useKV inconsistency (pendingChanges lost on refresh) |
| **Redundant Icon Libraries** | 🟡 MEDIUM | package.json | 3 icon libraries: phosphor, lucide, heroicons |
| **Unused Dependencies** | 🟡 MEDIUM | package.json | three, d3, octokit installed but unused |
| **String Comparisons** | 🟢 LOW | Multiple | Status checks use magic strings, not enum constants |
| **Missing Loading States** | 🟢 LOW | Service calls | No loading indicators for AI calls, PR operations |

### 7.3 Technical Debt Inventory

| Debt Item | Severity | Effort | Description |
|-----------|----------|--------|-------------|
| Decompose App.tsx | 🔴 CRITICAL | L | Extract layout, route management, panel management into sub-components |
| Add state management | 🔴 CRITICAL | XL | Replace prop drilling with context/store (React Context, Zustand, or Jotai) |
| Implement auth properly | 🔴 CRITICAL | L | Replace plaintext password KV storage with proper auth |
| Add routing | 🟠 HIGH | M | Add react-router for deep linking (dashboard, chat/:id, pr/:id) |
| Add tests | 🟠 HIGH | XL | Zero tests exist — need unit + integration + e2e |
| Type AI responses | 🟡 MEDIUM | S | Replace `any[]` with proper FileChange[] typing |
| Fix ID generation | 🟡 MEDIUM | S | Use UUID or nanoid instead of Date.now() |
| Persist pending changes | 🟡 MEDIUM | S | Move from useState to useKV |
| Remove unused deps | 🟢 LOW | S | Remove three, d3, octokit, heroicons |
| Add error boundaries | 🟢 LOW | S | Per-feature error boundaries (chat, PR, dashboard) |

---

## 8. Security Analysis

### 8.1 Critical Security Findings

| Finding | Severity | Location | Details |
|---------|----------|----------|---------|
| **Plaintext Passwords** | 🔴 CRITICAL | auth.ts:4,31 | Passwords stored as plaintext in Spark KV under key `docflow-users`. No hashing. |
| **Password in User Object** | 🔴 CRITICAL | types.ts:10 | `User.password?: string` — password leaks into runtime User objects and potentially React state |
| **No Input Sanitization** | 🟠 HIGH | All services | User input passed directly to AI prompts (prompt injection risk) |
| **No Rate Limiting** | 🟠 HIGH | AIService | No throttling on AI calls — abuse potential |
| **Client-Side Auth** | 🟠 HIGH | auth.ts | Entire auth logic is client-side; any user can read KV store |
| **No CSRF Protection** | 🟡 MEDIUM | — | No CSRF tokens (less relevant for SPA but notable) |
| **No Auth Token Expiry** | 🟡 MEDIUM | auth.ts | User session persists indefinitely in KV |
| **Event Log Exposure** | 🟢 LOW | collaboration.ts | All collaboration events readable by any authenticated user |

### 8.2 Auth Flow Detail

```
SIGN UP:
  1. User enters email + plaintext password
  2. auth.ts reads ALL users from KV: spark.kv.get('docflow-users')
  3. Checks for duplicate email
  4. Stores new AuthUser WITH PLAINTEXT PASSWORD to KV array
  5. Sets current user in KV: spark.kv.set('docflow-current-user', authUser)

SIGN IN:
  1. User enters email + password
  2. auth.ts reads ALL users from KV (including all passwords)
  3. Compares email AND password via simple string match
  4. Sets current user in KV

SESSION:
  - No tokens, no expiry, no refresh
  - Session = the AuthUser object stored in KV
  - Any Spark user can technically read the KV store
```

---

## 9. Configuration Analysis

### 9.1 TypeScript Configuration

```jsonc
{
  "target": "ES2020",
  "module": "ESNext",
  "moduleResolution": "bundler",
  "jsx": "react-jsx",
  "strictNullChecks": true,        // ✅ Enabled
  "noFallthroughCasesInSwitch": true,
  "noUncheckedSideEffectImports": true,
  "skipLibCheck": true,
  "noEmit": true,
  "paths": { "@/*": ["./src/*"] }  // Path alias
}
// ⚠️ Missing: "strict": true (only strictNullChecks)
// ⚠️ Missing: "noImplicitAny", "noUnusedLocals", "noUnusedParameters"
```

### 9.2 Build Configuration

```typescript
// vite.config.ts
plugins: [react(), tailwindcss(), createIconImportProxy(), sparkPlugin()]
resolve: { alias: { '@': resolve(projectRoot, 'src') } }
```

### 9.3 App Constants

```typescript
APP_CONSTANTS = { TITLE: 'BMAD', SUBTITLE: 'Momentum-First Platform' }
ROUTE_KEYS = { DASHBOARD: 'dashboard', CHAT: 'chat', PR: 'pr' }
PANEL_BREAKPOINTS = { MOBILE: 768, CHAT_LIST: 320, RIGHT_PANEL: 384, COLLAPSED: 48 }
TIMING = { TYPING_DEBOUNCE: 300, PRESENCE_UPDATE: 5000, ANIMATION_DURATION: 300 }
```

### 9.4 Spark Configuration

```json
// spark.meta.json
{ "templateVersion": 1, "dbType": "kv" }

// runtime.config.json
{ "app": "839ccf25c4bddabf1a49" }
```

---

## 10. File Inventory Summary

### 10.1 By Category

| Category | Files | Lines | % of Total |
|----------|-------|-------|------------|
| App root (App.tsx, main.tsx, ErrorFallback) | 3 | 718 | 6.8% |
| Application Components | 21 | 3,435 | 32.4% |
| Hooks | 8 | 746 | 7.0% |
| Services | 4+1 | 454 | 4.3% |
| Lib (auth, types, utils, constants, collab) | 5 | 372 | 3.5% |
| UI Components (shadcn/ui) | 46 | 5,056 | 47.6% |
| Config (vite, tsconfig, etc.) | — | — | — |
| **TOTAL** | **88** | **10,615** | **100%** |

### 10.2 Top 15 Files by Size

| # | File | Lines | Role |
|---|------|-------|------|
| 1 | components/ui/sidebar.tsx | 726 | shadcn/ui |
| 2 | **App.tsx** | **661** | **Root orchestrator** |
| 3 | components/FilePreviewDialog.tsx | 466 | File diff preview |
| 4 | components/ui/chart.tsx | 351 | shadcn/ui |
| 5 | components/MomentumDashboard.tsx | 324 | Dashboard |
| 6 | components/ui/menubar.tsx | 276 | shadcn/ui |
| 7 | components/DocumentTranslationView.tsx | 259 | Translation |
| 8 | components/ui/dropdown-menu.tsx | 259 | shadcn/ui |
| 9 | components/InlineCommentThread.tsx | 255 | Comment threads |
| 10 | components/ui/context-menu.tsx | 254 | shadcn/ui |
| 11 | components/ChatList.tsx | 246 | Chat sidebar |
| 12 | components/ui/carousel.tsx | 242 | shadcn/ui |
| 13 | components/PRDialog.tsx | 226 | PR review |
| 14 | services/line-comment.service.ts | 200 | Line comments |
| 15 | components/ui/select.tsx | 185 | shadcn/ui |

---

## 11. Migration Readiness Assessment

### 11.1 Frontend-to-Backend Migration Map

The `openapi.yaml` defines the target backend contract. Current state vs target:

| Domain | Current (Frontend-Only) | Target (Backend) | Gap |
|--------|------------------------|-------------------|-----|
| **Auth** | Plaintext KV storage | JWT Bearer + session cookies | Complete rewrite |
| **Users** | KV array scan | REST endpoints with proper storage | Complete rewrite |
| **Chats** | useKV hook (single KV key) | Paginated REST with domain/service/feature filters | Migration + refactor |
| **Messages** | Embedded in Chat objects | Separate endpoint with cursor pagination | Data model split |
| **AI** | Direct window.spark.llm | Server-side with routing assessment | API wrapper |
| **PRs** | useKV hook | REST with status filtering | Migration |
| **Line Comments** | Embedded in FileChange | REST endpoint per file | Data model split |
| **Collaboration** | KV polling (2s interval) | Server events endpoint | Architecture change |
| **Organization** | Computed from chats | Dedicated endpoints | New feature |

### 11.2 Migration Complexity

- **Low:** PRService, ChatService, LineCommentService → already structured as stateless service classes
- **Medium:** Hook layer → replace useKV with React Query + fetch calls
- **High:** Auth → requires complete security overhaul
- **High:** Collaboration → replace KV polling with WebSocket/SSE

---

## 12. Key Observations for GD Phase

1. **The codebase is architecturally a prototype** — functional but with significant structural debt
2. **Services are cleanly separated** from hooks — good extraction point for backend migration
3. **The OpenAPI spec is comprehensive** (1,804 lines, 27 endpoints) — serves as the backend blueprint
4. **All data lives in 6 KV keys** — the entire app state fits in a key-value store
5. **Three icon libraries** installed with overlapping coverage — vendor consolidation needed
6. **Heavy unused deps** (three.js, d3, octokit) inflate the bundle
7. **Zero tests** — no unit, integration, or e2e tests anywhere
8. **The collaboration system** uses polling (2-second intervals) via KV store reads
9. **TypeScript strictness is partial** — only `strictNullChecks` enabled, not full `strict`
10. **All entity IDs use `Date.now()`** — collision risk with concurrent operations
