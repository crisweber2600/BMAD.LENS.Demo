# bmad-chat - Architecture Documentation

> **Generated**: SCOUT Analyze Codebase + Generate Docs Workflow  
> **System**: LENS Discovery System  
> **Status**: BMAD-Ready Documentation

---

## Executive Summary

bmad-chat is a real-time collaboration platform for business model architecture design, built as a browser-only Single Page Application on the GitHub Spark platform. The system uses React 19 with TypeScript, leveraging Spark KV for persistence and Spark LLM (GPT-4o) for AI-assisted conversation bridging between technical and business co-founders. It follows a monolithic component architecture with 91 source files totaling 10,615 lines of code.

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          BROWSER TIER                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│  bmad-chat (React 19.1 SPA)                                                │
│  ├── App.tsx (661 lines — monolithic controller)                           │
│  ├── Components (21 app + 46 UI primitives)                                │
│  ├── Hooks (8)          ├── Services (4 static classes)                    │
│  └── Lib (types, auth, collaboration, constants, utils)                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  Build Pipeline                                                             │
│  ├── Vite 7.2.6 (Dev Server + Bundler)                                     │
│  ├── SWC (React Fast Refresh)                                              │
│  └── Tailwind CSS 4.1.11 (Vite Plugin)                                     │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
┌──────────────────────┐ ┌─────────────────┐ ┌──────────────────────┐
│   Spark KV Store     │ │   Spark LLM     │ │  Spark Hosting       │
│  ┌────────────────┐  │ │  (GPT-4o)       │ │  (Static Assets)     │
│  │ docflow-users  │  │ │  ┌───────────┐  │ │  ┌────────────────┐  │
│  │ docflow-current│  │ │  │ Chat AI   │  │ │  │ index.html     │  │
│  │ chats          │  │ │  │ Translate  │  │ │  │ dist/          │  │
│  │ pull-requests  │  │ │  └───────────┘  │ │  └────────────────┘  │
│  │ user-presence  │  │ └─────────────────┘ └──────────────────────┘
│  │ collab-events  │  │
│  └────────────────┘  │
└──────────────────────┘
                                    │
                                    ▼
                        ┌──────────────────────┐
                        │   External Services   │
                        │  ┌────────────────┐   │
                        │  │ DiceBear API   │   │
                        │  │ (Avatar Gen)   │   │
                        │  └────────────────┘   │
                        └──────────────────────┘
```

### Request Flow

```
┌──────────┐     ┌──────────┐     ┌──────────────┐     ┌─────────────┐
│  User    │────▶│  React   │────▶│  Custom Hook │────▶│  Service    │
│  Action  │     │  Component│     │  (useState/  │     │  (Static    │
│          │     │          │     │   useKV)     │     │   Class)    │
└──────────┘     └──────────┘     └──────────────┘     └─────────────┘
                                         │                    │
                                         ▼                    ▼
                                  ┌──────────────┐    ┌──────────────┐
                                  │  Spark KV    │    │  Spark LLM   │
                                  │  (window.    │    │  (window.    │
                                  │   spark.kv)  │    │   spark.llm) │
                                  └──────────────┘    └──────────────┘
```

---

## Project Structure

### Solution Composition

| Directory | Type | File Count | Lines of Code | Purpose |
|-----------|------|------------|---------------|---------|
| **src/App.tsx** | Root Component | 1 | 661 | Monolithic controller: routing, state, layout |
| **src/components/** | App Components | 21 | 3,240 | Feature UI components |
| **src/components/ui/** | UI Primitives | 46 | 5,056 | shadcn/ui component library |
| **src/hooks/** | Custom Hooks | 8 | 738 | State management & side effects |
| **src/lib/services/** | Service Layer | 5 | 454 | Business logic (static classes) |
| **src/lib/** | Core Library | 5 | 371 | Types, auth, collaboration, utils |
| **src/ (root)** | App Bootstrap | 5 | 95 | main.tsx, ErrorFallback, env |
| **src/styles/** | Stylesheets | — | 540 | CSS / Tailwind |
| **Total** | — | **91** | **10,615** | — |

### Source Tree

```
src/
├── App.tsx                    ← Monolithic root (661 lines)
├── main.tsx                   ← ReactDOM entry point
├── ErrorFallback.tsx          ← Error boundary fallback
├── components/
│   ├── AuthForm.tsx           (180 lines — sign-in/sign-up form)
│   ├── MomentumDashboard.tsx  (324 lines — metrics dashboard)
│   ├── ChatList.tsx           (246 lines — chat sidebar)
│   ├── ChatMessage.tsx        (103 lines — message rendering)
│   ├── ChatInput.tsx          (93 lines — message composition)
│   ├── PRDialog.tsx           (226 lines — PR review dialog)
│   ├── PRCard.tsx             (79 lines — PR summary card)
│   ├── CreatePRDialog.tsx     (115 lines — new PR wizard)
│   ├── FileDiffViewer.tsx     (158 lines — diff display)
│   ├── FilePreviewDialog.tsx  (466 lines — file preview)
│   ├── InlineCommentThread.tsx (255 lines — line comments)
│   ├── DocumentTranslationView.tsx (259 lines — tech↔biz translation)
│   ├── ActiveUsers.tsx        (88 lines — presence indicators)
│   ├── ActivityFeed.tsx       (88 lines — collab event log)
│   ├── NewChatDialog.tsx      (176 lines — new chat wizard)
│   ├── TypingIndicator.tsx    (64 lines — typing animation)
│   ├── TranslateButton.tsx    (61 lines — trigger AI translation)
│   ├── TranslatedText.tsx     (100 lines — rendered translation)
│   ├── EmojiReactionPicker.tsx (50 lines — emoji selector)
│   ├── EmojiReactionsDisplay.tsx (52 lines — reaction display)
│   ├── AllFilesPreviewDialog.tsx (57 lines — multi-file preview)
│   └── ui/                    ← 46 shadcn/ui primitives (5,056 lines)
├── hooks/
│   ├── use-auth.ts            (91 lines)
│   ├── use-chats.ts           (157 lines — Spark KV backed)
│   ├── use-pull-requests.ts   (148 lines — Spark KV backed)
│   ├── use-collaboration.ts   (116 lines)
│   ├── use-ui-state.ts        (80 lines)
│   ├── use-pending-changes.ts (74 lines)
│   ├── use-chat-actions.ts    (53 lines)
│   └── use-mobile.ts          (19 lines)
├── lib/
│   ├── types.ts               (134 lines — all TypeScript interfaces)
│   ├── collaboration.ts       (145 lines — CollaborationService class)
│   ├── auth.ts                (62 lines — KV-backed auth functions)
│   ├── constants.ts           (24 lines — app constants)
│   ├── utils.ts               (6 lines — cn() helper)
│   └── services/
│       ├── ai.service.ts      (111 lines — GPT-4o integration)
│       ├── line-comment.service.ts (200 lines — inline comments)
│       ├── pr.service.ts      (76 lines — PR lifecycle)
│       ├── chat.service.ts    (63 lines — chat factory)
│       └── index.ts           (4 lines — barrel export)
└── styles/
    ├── index.css              ← Tailwind base
    └── main.css               ← Custom styles
```

---

## Technology Stack

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| React | ^19.0.0 | UI Framework (latest with concurrent features) |
| TypeScript | ~5.7.2 | Type-safe JavaScript superset |
| Vite | ^7.2.6 | Build tool + dev server |
| Tailwind CSS | ^4.1.11 | Utility-first CSS framework (Vite plugin) |
| @github/spark | >=0.43.1 <1 | Platform SDK (KV, LLM, hosting) |

### UI Libraries

| Library | Version | Purpose |
|---------|---------|---------|
| Radix UI | various ^1.x–^2.x | 22 headless UI primitives |
| Phosphor Icons | ^2.1.7 | Icon system (with Spark proxy plugin) |
| Lucide React | ^0.484.0 | Secondary icon set |
| shadcn/ui | (via Radix) | 46 styled component primitives |
| Framer Motion | ^12.6.2 | Animation library |
| Recharts | ^2.15.1 | Dashboard charts/graphs |
| D3.js | ^7.9.0 | Data visualization primitives |
| Three.js | ^0.175.0 | 3D rendering (dashboard effects) |
| Embla Carousel | ^8.5.2 | Carousel component |
| cmdk | ^1.1.1 | Command palette |
| Vaul | ^1.1.2 | Drawer component |
| Sonner | ^2.0.1 | Toast notifications |
| React Day Picker | ^9.6.7 | Date picker |

### Form & Validation

| Library | Version | Purpose |
|---------|---------|---------|
| React Hook Form | ^7.54.2 | Form state management |
| @hookform/resolvers | ^4.1.3 | Validation resolver adapters |
| Zod | ^3.25.76 | Schema validation |
| input-otp | ^1.4.2 | OTP input component |

### Utilities

| Library | Version | Purpose |
|---------|---------|---------|
| marked | ^15.0.7 | Markdown rendering |
| date-fns | ^3.6.0 | Date formatting |
| uuid | ^11.1.0 | Unique ID generation |
| clsx | ^2.1.1 | Conditional class names |
| tailwind-merge | ^3.0.2 | Tailwind class deduplication |
| class-variance-authority | ^0.7.1 | Variant-based component styling |
| Octokit | ^4.1.2/^6.1.4 | GitHub API client (unused currently) |
| react-resizable-panels | ^2.1.7 | Resizable panel layout |
| react-error-boundary | ^6.0.0 | Error boundary component |

### Development Tools

| Tool | Version | Purpose |
|------|---------|---------|
| @vitejs/plugin-react-swc | ^4.2.2 | SWC-powered React compilation |
| ESLint | ^9.28.0 | Code linting |
| eslint-plugin-react-hooks | ^5.2.0 | React hooks lint rules |
| eslint-plugin-react-refresh | ^0.4.19 | Fast Refresh lint rules |
| typescript-eslint | ^8.38.0 | TypeScript ESLint integration |
| @tailwindcss/vite | ^4.1.11 | Tailwind Vite integration |
| @tailwindcss/postcss | ^4.1.8 | PostCSS adapter |
| @tailwindcss/container-queries | ^0.1.1 | Container query support |
| tw-animate-css | ^1.2.4 | Tailwind CSS animations |

---

## Authentication Architecture

### Auth Flow Diagram

```
┌──────────────┐     ┌─────────────────────┐     ┌───────────────────┐
│  AuthForm    │────▶│  auth.ts             │────▶│  Spark KV Store   │
│  Component   │     │  signUp() / signIn() │     │                   │
│  (180 lines) │◀────│  setCurrentUser()    │◀────│  docflow-users    │
└──────────────┘     │  getCurrentUser()    │     │  docflow-current  │
                     │  signOut()           │     │    -user          │
                     └─────────────────────┘     └───────────────────┘
                              │
                              ▼
                     ┌─────────────────────┐
                     │  use-auth.ts Hook   │
                     │  ├── currentUser    │
                     │  ├── isAuthenticated│
                     │  └── isLoadingAuth  │
                     └─────────────────────┘
```

### Auth Implementation (src/lib/auth.ts)

```typescript
// Plaintext password storage — SECURITY RISK
const USERS_KEY = 'docflow-users'
const CURRENT_USER_KEY = 'docflow-current-user'

export async function signUp(
  email: string,
  password: string,         // ⚠️ Stored in plaintext
  name: string,
  role: 'technical' | 'business'
): Promise<AuthUser> {
  const users = await getAllUsers()
  const existingUser = users.find((u) => u.email === email)
  if (existingUser) {
    throw new Error('User with this email already exists')
  }

  const newUser: AuthUser = {
    id: `user-${Date.now()}`,
    email,
    password,                // ⚠️ No hashing
    name,
    role,
    avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
    createdAt: Date.now(),
  }

  users.push(newUser)
  await window.spark.kv.set(USERS_KEY, users)
  return newUser
}

export async function signIn(email: string, password: string): Promise<AuthUser> {
  const users = await getAllUsers()
  const user = users.find((u) => u.email === email && u.password === password)
  if (!user) {
    throw new Error('Invalid email or password')
  }
  return user
}
```

### Auth State Machine

```
┌────────────┐    signUp()/     ┌─────────────────┐    signOut()    ┌────────────┐
│  Loading   │───signIn()──────▶│  Authenticated  │───────────────▶│  Signed    │
│  (init)    │                  │  currentUser ≠  │                │  Out       │
│            │◀──getCurrentUser─│  null           │◀──signIn()─────│            │
└────────────┘   (on mount)     └─────────────────┘                └────────────┘
```

---

## Data Architecture

### Spark KV Store Schema

| Key | Type | Description | Used By |
|-----|------|-------------|---------|
| `docflow-users` | `AuthUser[]` | All registered users with plaintext passwords | `auth.ts` |
| `docflow-current-user` | `AuthUser` | Currently logged-in user session | `auth.ts` |
| `chats` | `Chat[]` | All chat conversations with messages | `use-chats.ts` (via `useKV`) |
| `pull-requests` | `PullRequest[]` | All pull requests with file changes | `use-pull-requests.ts` (via `useKV`) |
| `user-presence` | `Record<string, UserPresence>` | Active user presence map | `collaboration.ts` |
| `collaboration-events` | `CollaborationEvent[]` | Real-time collaboration event log | `collaboration.ts` |

### Entity Model

```
┌─────────────────────┐       ┌──────────────────────┐
│      AuthUser       │       │        Chat          │
├─────────────────────┤       ├──────────────────────┤
│ id: string          │       │ id: string           │
│ email: string       │       │ title: string        │
│ password: string    │──┐    │ messages: Message[]   │
│ name: string        │  │    │ participants: string[]│
│ role: UserRole      │  │    │ domain?: string      │
│ avatarUrl: string   │  │    │ service?: string     │
│ createdAt: number   │  │    │ feature?: string     │
└─────────────────────┘  │    │ createdAt: number    │
                         │    │ updatedAt: number    │
┌─────────────────────┐  │    └──────────────────────┘
│       User          │  │              │
├─────────────────────┤  │              │ contains
│ id: string          │◀─┘              ▼
│ name: string        │       ┌──────────────────────┐
│ email: string       │       │       Message        │
│ role: UserRole      │       ├──────────────────────┤
│ avatarUrl: string   │       │ id: string           │
│ password?: string   │       │ chatId: string       │
└─────────────────────┘       │ content: string      │
                              │ role: 'user'|'asst'  │
┌─────────────────────┐       │ timestamp: number    │
│   UserPresence      │       │ userId?: string      │
├─────────────────────┤       │ fileChanges?:        │
│ userId: string      │       │   FileChange[]       │
│ userName: string    │       │ translations?:       │
│ avatarUrl: string   │       │   MessageTranslation│
│ activeChat: string? │       └──────────────────────┘
│ lastSeen: number    │
│ isTyping: boolean   │       ┌──────────────────────┐
│ typingChatId?: str  │       │   PullRequest        │
│ cursorPosition?:    │       ├──────────────────────┤
│   { chatId, msgId } │       │ id: string           │
└─────────────────────┘       │ title: string        │
                              │ description: string  │
┌─────────────────────┐       │ chatId: string       │
│ CollaborationEvent  │       │ author: string       │
├─────────────────────┤       │ status: PRStatus     │
│ id: string          │       │ fileChanges:         │
│ type: EventType     │       │   FileChange[]       │
│ userId: string      │       │ comments: PRComment[]│
│ userName: string    │       │ approvals: string[]  │
│ chatId?: string     │       │ createdAt: number    │
│ prId?: string       │       │ updatedAt: number    │
│ timestamp: number   │       └──────────────────────┘
│ metadata?: Record   │
└─────────────────────┘       ┌──────────────────────┐
                              │    LineComment       │
┌─────────────────────┐       ├──────────────────────┤
│    FileChange       │       │ id: string           │
├─────────────────────┤       │ fileId: string       │
│ path: string        │       │ lineNumber: number   │
│ additions: string[] │       │ lineType: add|del|uc │
│ deletions: string[] │       │ author: string       │
│ status: pending|    │       │ content: string      │
│   staged|committed  │       │ timestamp: number    │
│ lineComments?:      │       │ resolved: boolean    │
│   LineComment[]     │──────▶│ replies?: Comment[]  │
└─────────────────────┘       │ reactions?:          │
                              │   EmojiReaction[]    │
                              └──────────────────────┘
```

---

## API Architecture

### Service Inventory

| Service | Type | Lines | Methods | Persistence |
|---------|------|-------|---------|-------------|
| **AIService** | Static class | 111 | `generateChatResponse()`, `translateContent()`, `getRoleGuidance()` | Spark LLM |
| **ChatService** | Static class | 63 | `createChat()`, `createMessage()`, `extractOrganization()` | None (factory) |
| **PRService** | Static class | 76 | `createPR()`, `mergePR()`, `closePR()`, `approvePR()`, `commentOnPR()` | None (factory) |
| **LineCommentService** | Static class | 200 | `addComment()`, `resolveComment()`, `replyToComment()`, `toggleReaction()` | None (factory) |
| **CollaborationService** | Instance class | 145 | `initialize()`, `cleanup()`, `updatePresence()`, `emitEvent()` | Spark KV |

### Hook Inventory

| Hook | Lines | State Source | Purpose |
|------|-------|-------------|---------|
| **useAuth** | 91 | `useState` + KV | Auth state, sign-in/sign-up/sign-out |
| **useChats** | 157 | `useKV('chats')` | Chat CRUD, message management, AI responses |
| **usePullRequests** | 148 | `useKV('pull-requests')` | PR lifecycle, approvals, comments |
| **useCollaboration** | 116 | `useState` + KV | Presence tracking, event feed |
| **useUIState** | 80 | `useState` | Panel visibility, dialog state, navigation |
| **usePendingChanges** | 74 | `useState` | Uncommitted file changes buffer |
| **useChatActions** | 53 | (delegates) | Composed chat + AI + PR actions |
| **useMobile** | 19 | `matchMedia` | Viewport breakpoint detection |

### Hook-to-Service Data Flow

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   useChats       │────▶│  ChatService     │     │  Spark KV        │
│   (useKV hook)   │     │  (factory only)  │     │  key: 'chats'    │
│                  │─────┼──────────────────┼────▶│                  │
│                  │     │  AIService       │     │                  │
│                  │────▶│  (Spark LLM)     │     │                  │
└──────────────────┘     └──────────────────┘     └──────────────────┘

┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│ usePullRequests  │────▶│  PRService       │     │  Spark KV        │
│   (useKV hook)   │     │  (factory only)  │     │  key: 'pull-     │
│                  │─────┼──────────────────┼────▶│   requests'      │
│                  │     │ LineCommentSvc   │     │                  │
│                  │────▶│  (factory only)  │     │                  │
└──────────────────┘     └──────────────────┘     └──────────────────┘
```

---

## Frontend Architecture

### Component Hierarchy

```
<App>                                          (661 lines — monolithic)
├── {isLoadingAuth}  → <Spinner />
├── {!isAuthenticated}  → <AuthForm />          (180 lines)
│
├── {isAuthenticated}
│   ├── <Toaster />                             (sonner notifications)
│   │
│   ├── [MOBILE LAYOUT: isMobile=true]
│   │   ├── <Sheet>
│   │   │   └── <ChatList />                    (246 lines)
│   │   ├── <MomentumDashboard />               (324 lines)
│   │   ├── Chat View
│   │   │   ├── <ChatMessage />                 (103 lines × N)
│   │   │   ├── <TypingIndicator />             (64 lines)
│   │   │   └── <ChatInput />                   (93 lines)
│   │   └── <PRCard /> × N                      (79 lines each)
│   │
│   ├── [DESKTOP LAYOUT: isMobile=false]
│   │   ├── Left Sidebar
│   │   │   ├── Navigation Icons
│   │   │   └── User Menu (sign-out)
│   │   ├── Chat List Panel (320px)
│   │   │   └── <ChatList />                    (246 lines)
│   │   ├── Main Content Area
│   │   │   ├── <MomentumDashboard />           (324 lines)
│   │   │   ├── Chat View
│   │   │   │   ├── <ChatMessage />             (103 lines × N)
│   │   │   │   │   ├── <TranslateButton />     (61 lines)
│   │   │   │   │   └── <TranslatedText />      (100 lines)
│   │   │   │   ├── <TypingIndicator />         (64 lines)
│   │   │   │   └── <ChatInput />               (93 lines)
│   │   │   └── PR View
│   │   │       └── <PRCard /> × N              (79 lines each)
│   │   └── Right Panel (384px / 48px collapsed)
│   │       ├── <ActiveUsers />                 (88 lines)
│   │       └── <ActivityFeed />                (88 lines)
│   │
│   └── [DIALOGS]
│       ├── <NewChatDialog />                   (176 lines)
│       ├── <CreatePRDialog />                  (115 lines)
│       ├── <PRDialog />                        (226 lines)
│       │   ├── <FileDiffViewer />              (158 lines)
│       │   ├── <InlineCommentThread />         (255 lines)
│       │   └── <EmojiReactionPicker />         (50 lines)
│       ├── <FilePreviewDialog />               (466 lines)
│       ├── <AllFilesPreviewDialog />           (57 lines)
│       └── <DocumentTranslationView />         (259 lines)
```

### State Management Pattern

The application uses **no state management library**. All state lives in the monolithic `App.tsx` via hooks:

```typescript
// App.tsx — All state orchestrated at root level
function App() {
  // Auth state
  const { currentUser, isAuthenticated, isLoadingAuth, handleSignIn, handleSignUp, handleSignOut } = useAuth()

  // Data state (Spark KV-backed)
  const { chats, createChat, addMessage, addTranslation, getChatById, getOrganization } = useChats()
  const { pullRequests, createPR, mergePR, closePR, approvePR, ... } = usePullRequests()
  const { pendingChanges, addChanges, clearChanges, ... } = usePendingChanges()

  // UI state
  const { isMobile, activeChat, selectedPR, prDialogOpen, ... } = useUIState()

  // Collaboration state
  const { ... } = useCollaboration()

  // Everything is prop-drilled to child components
}
```

### Navigation Model

No router is installed. Navigation is handled via manual state toggles in `App.tsx`:

```
┌─────────────────────────────────────┐
│        App.tsx Navigation           │
├─────────────────────────────────────┤
│ showDashboard: boolean              │
│ activeChat: string | null           │
│ selectedPR: string | null           │
│ rightPanelOpen: boolean             │
│ rightPanelCollapsed: boolean        │
│ chatListOpen: boolean               │
│                                     │
│  if (!isAuthenticated) → AuthForm   │
│  if (showDashboard) → Dashboard     │
│  if (activeChat) → Chat View        │
│  if (selectedPR) → PR View          │
└─────────────────────────────────────┘
```

---

## Technical Debt Assessment

### Critical Issues

| Issue | Severity | Impact | Remediation |
|-------|----------|--------|-------------|
| Monolithic App.tsx (661 lines) | 🔴 Critical | Unmaintainable, untestable, all state at root | Extract route-level components, add React Router |
| Plaintext password storage | 🔴 Critical | Passwords stored raw in Spark KV | Hash with bcrypt/argon2, migrate to OAuth |
| No client-side routing | 🔴 Critical | No deep linking, no history, no URL state | Add React Router or TanStack Router |
| No test coverage | 🔴 Critical | Zero tests (no test framework installed) | Add Vitest + React Testing Library |
| Client-only authentication | 🟡 Medium | No server-side validation, trivially bypassable | Implement backend auth (SparkCompat migration) |
| No state management library | 🟡 Medium | Prop-drilling through 8 hook layers | Add Zustand or TanStack Store |
| No error boundaries | 🟡 Medium | Single `ErrorFallback.tsx` at root only | Add granular error boundaries per feature |
| Static service classes | 🟡 Medium | Global singletons, no dependency injection | Convert to hooks or context providers |
| Unused dependencies | 🟢 Low | Three.js, D3, Octokit imported but minimally used | Audit and tree-shake |
| No build optimization | 🟢 Low | No code-splitting, no lazy loading | Add `React.lazy()` + `Suspense` for routes |

### Code Quality Metrics

| Metric | Value | Assessment |
|--------|-------|------------|
| Total source files | 91 | Moderate complexity |
| Total lines of code | 10,615 | Small-to-medium application |
| App code lines | 5,559 | Core application logic |
| UI primitive lines | 5,056 | shadcn/ui (generated, low maintenance) |
| Largest file | App.tsx (661 lines) | 🔴 God component anti-pattern |
| Avg component size | 154 lines | Acceptable |
| Type coverage | Full (TypeScript strict) | 🟢 Good |
| Test coverage | 0% | 🔴 No tests exist |

---

## Security Considerations

### Current Security Model

```
┌─────────────────────────────────────────────────────┐
│                SECURITY BOUNDARY                     │
│  ┌───────────────────────────────────────────────┐   │
│  │           CLIENT-SIDE ONLY                    │   │
│  │                                               │   │
│  │  ┌──────────┐    ┌────────────────────────┐   │   │
│  │  │ AuthForm │───▶│ auth.ts                │   │   │
│  │  │          │    │ ⚠️ plaintext passwords  │   │   │
│  │  └──────────┘    │ ⚠️ client-side check   │   │   │
│  │                  │ ⚠️ no token/session     │   │   │
│  │                  └────────────────────────┘   │   │
│  │                           │                   │   │
│  │                           ▼                   │   │
│  │                  ┌────────────────────────┐   │   │
│  │                  │ Spark KV Store         │   │   │
│  │                  │ ALL data accessible    │   │   │
│  │                  │ to ALL users           │   │   │
│  │                  └────────────────────────┘   │   │
│  └───────────────────────────────────────────────┘   │
│  NO SERVER VALIDATION — NO AUTHORIZATION LAYER       │
└─────────────────────────────────────────────────────┘
```

### Security Risks

| Risk | Level | Description |
|------|-------|-------------|
| Plaintext passwords | 🔴 Critical | Passwords stored as-is in `docflow-users` KV key |
| No session tokens | 🔴 Critical | User object stored in KV, no signed JWT/session |
| No authorization | 🔴 Critical | All KV data readable/writable by any client |
| Client-side auth only | 🔴 Critical | Auth checks trivially bypassable via console |
| Shared KV namespace | 🟡 Medium | All users share same KV keys, no isolation |
| External avatar loading | 🟢 Low | DiceBear avatars loaded over HTTP (SSRF risk minimal) |
| `Date.now()` IDs | 🟡 Medium | Predictable, non-unique IDs under concurrency |

---

## Deployment Architecture

### GitHub Spark Deployment Model

```
┌───────────────────────────────────────────────────────────────┐
│                   GitHub Spark Platform                        │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────┐    ┌──────────────────────────────────┐  │
│  │  Spark CLI /    │    │  Spark Runtime                   │  │
│  │  GitHub UI      │    │  ┌───────────────────────────┐   │  │
│  │  ┌───────────┐  │    │  │  KV Store (6 keys)        │   │  │
│  │  │ vite build│──┼───▶│  │  docflow-users            │   │  │
│  │  │ tsc -b    │  │    │  │  docflow-current-user     │   │  │
│  │  └───────────┘  │    │  │  chats                    │   │  │
│  │       │         │    │  │  pull-requests             │   │  │
│  │       ▼         │    │  │  user-presence             │   │  │
│  │  ┌───────────┐  │    │  │  collaboration-events      │   │  │
│  │  │ dist/     │──┼───▶│  └───────────────────────────┘   │  │
│  │  │ (static)  │  │    │  ┌───────────────────────────┐   │  │
│  │  └───────────┘  │    │  │  LLM (GPT-4o)             │   │  │
│  └─────────────────┘    │  │  window.spark.llm          │   │  │
│                         │  └───────────────────────────┘   │  │
│                         └──────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────┘
```

### Build Configuration (vite.config.ts)

```typescript
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, PluginOption } from "vite";
import sparkPlugin from "@github/spark/spark-vite-plugin";
import createIconImportProxy from "@github/spark/vitePhosphorIconProxyPlugin";
import { resolve } from 'path'

const projectRoot = process.env.PROJECT_ROOT || import.meta.dirname

export default defineConfig({
  plugins: [
    react(),                                    // SWC-powered React
    tailwindcss(),                              // Tailwind v4 Vite plugin
    createIconImportProxy() as PluginOption,    // Phosphor icon proxy
    sparkPlugin() as PluginOption,              // Spark platform integration
  ],
  resolve: {
    alias: { '@': resolve(projectRoot, 'src') } // Path alias for imports
  },
});
```

### Build Pipeline

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Source   │────▶│  TSC     │────▶│  Vite    │────▶│  dist/   │
│  (.tsx)   │     │  Type    │     │  Bundle  │     │  Static  │
│           │     │  Check   │     │  + SWC   │     │  Assets  │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
                                       │
                              ┌────────┼────────┐
                              │        │        │
                              ▼        ▼        ▼
                         Tailwind  Spark    Phosphor
                         CSS v4   Plugin   Icon Proxy
```

---

## Integration Points

### External Dependencies

| Integration | Type | Protocol | Usage |
|-------------|------|----------|-------|
| GitHub Spark KV | Key-Value Store | `window.spark.kv` API | All data persistence (6 keys) |
| GitHub Spark LLM | AI Model (GPT-4o) | `window.spark.llm` API | Chat responses, content translation |
| DiceBear API | Avatar Generator | HTTPS (api.dicebear.com) | User avatar generation on signup |
| GitHub Spark Hosting | Static Hosting | HTTPS | SPA deployment and serving |

### Internal Communication Pattern

- **No network calls** to external APIs from application code (all via Spark SDK)
- **No backend server** — purely client-side with platform-provided services
- **No WebSocket / SSE** — polling-based presence via `setInterval(5000ms)`
- **Synchronous state flow** — React state + Spark KV, no async message queues

### Presence Polling Architecture

```typescript
// collaboration.ts — Polling-based presence (no real-time)
async initialize(userId: string) {
  this.currentUserId = userId
  await this.updatePresence()

  // Poll every 5 seconds for presence updates
  this.presenceInterval = window.setInterval(() => {
    this.updatePresence()
  }, 5000)

  await this.cleanupStalePresence()  // Remove users idle > 30s
}
```

---

## Recommendations

### Phase 1: Security Stabilization (Immediate)
- [ ] Hash passwords with bcrypt before storing in KV
- [ ] Add signed session tokens (JWT or equivalent)
- [ ] Implement server-side auth via SparkCompat backend migration
- [ ] Remove password field from `User` type exposure
- [ ] Replace `Date.now()` IDs with `uuid` (already installed)

### Phase 2: Architecture Modernization (Short-term)
- [ ] Extract App.tsx into route-level components (Dashboard, Chat, PR)
- [ ] Add React Router or TanStack Router for client-side routing
- [ ] Introduce Zustand or TanStack Store for state management
- [ ] Add granular error boundaries per feature area
- [ ] Convert static service classes to hooks/context providers

### Phase 3: Quality & Testing (Medium-term)
- [ ] Add Vitest + React Testing Library
- [ ] Write unit tests for services (AIService, PRService, ChatService)
- [ ] Write integration tests for hooks (useAuth, useChats)
- [ ] Add component tests for critical flows (AuthForm, ChatInput)
- [ ] Target 80%+ code coverage on non-UI code

### Phase 4: Backend Migration (Long-term)
- [ ] Migrate to SparkCompat backend (.NET Aspire API on port 8080)
- [ ] Replace Spark KV with proper database
- [ ] Replace Spark LLM with backend-proxied AI service
- [ ] Implement proper RBAC authorization
- [ ] Add OpenAPI-driven API layer (27 endpoints defined in openapi.yaml)

### Phase 5: Performance & Polish
- [ ] Add `React.lazy()` + `Suspense` for code splitting
- [ ] Audit/remove unused dependencies (Three.js, D3, Octokit)
- [ ] Replace polling presence with WebSocket/SSE
- [ ] Add progressive loading for chat history
- [ ] Implement virtual scrolling for large chat lists

---

## Related Documentation

- [API Surface](api-surface.md) — Complete API endpoint inventory
- [Data Model](data-model.md) — Entity relationship documentation
- [Integration Map](integration-map.md) — System integration points
- [Migration Map](migration-map.md) — Modernization pathway to SparkCompat backend
- [Onboarding Guide](onboarding.md) — Developer onboarding

---

*Generated by LENS System — SCOUT Discovery Workflow*
