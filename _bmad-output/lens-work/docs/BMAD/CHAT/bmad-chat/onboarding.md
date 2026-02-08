# bmad-chat — Developer Onboarding Guide

> **Generated**: SCOUT Analyze Codebase + Generate Docs Workflow  
> **System**: LENS Discovery System  
> **Status**: BMAD-Ready Documentation

---

## Welcome to bmad-chat

bmad-chat is a **Business Model Architecture Design** collaboration platform built as a GitHub Spark application. It bridges technical and business co-founders by providing AI-mediated chat, role-aware document translation, pull request workflows, and momentum tracking — all in a browser-only environment with no traditional backend.

The platform enforces a **commitment hierarchy** (Business → Market → Users → BMAD validation → Technical) ensuring projects always move forward with clarity between stakeholders.

---

## Quick Start

### Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 18.x+ | Runtime for Vite dev server |
| npm | 9.x+ | Package manager |
| Git | 2.x+ | Version control |
| GitHub Spark | Latest | Hosting platform (provides KV + LLM) |
| Browser | Chrome/Edge | Development & runtime |

### Platform Constraints

| Constraint | Detail |
|------------|--------|
| **No backend server** | All logic runs client-side in the browser |
| **No database** | Persistence via GitHub Spark KV (key-value store) |
| **No router** | Single-page app managed via React state |
| **No test framework** | No test files currently exist |
| **No state management lib** | React hooks + Spark KV only |
| **AI model** | GPT-4o via `window.spark.llm()` |

---

## Setup Commands

```bash
# 1. Clone the repository
git clone <repository-url> bmad-chat
cd bmad-chat

# 2. Install dependencies
npm install

# 3. Start development server (Vite 7)
npm run dev

# 4. Lint the codebase
npm run lint

# 5. Build for production
npm run build
# Equivalent to: tsc -b --noCheck && vite build

# 6. Preview production build
npm run preview

# 7. Pre-bundle dependencies
npm run optimize
# Equivalent to: vite optimize
```

> **Note:** The app runs on GitHub Spark infrastructure. `npm run dev` provides a local
> preview, but full functionality (KV persistence, LLM, collaboration) requires the
> Spark runtime environment.

---

## Solution Structure

```
bmad-chat/
├── index.html                       # SPA entry point
├── package.json                     # Dependencies & scripts
├── vite.config.ts                   # Vite 7 + Spark plugin config
├── tsconfig.json                    # TypeScript 5.7 config
├── tailwind.config.js               # Tailwind CSS 4 config
├── components.json                  # shadcn/ui component registry
├── theme.json                       # Spark theme configuration
├── runtime.config.json              # Spark runtime config
├── spark.meta.json                  # Spark metadata
├── openapi.yaml                     # API specification
│
├── src/
│   ├── main.tsx                     # React root + ErrorBoundary
│   ├── App.tsx                      # Monolithic app (661 lines)
│   ├── App.refactored.tsx           # WIP refactored version
│   ├── ErrorFallback.tsx            # Error boundary fallback UI
│   ├── index.css                    # Global CSS
│   ├── main.css                     # Main stylesheet
│   ├── vite-env.d.ts                # Vite type declarations
│   ├── vite-end.d.ts                # Additional Vite types
│   │
│   ├── components/                  # Application components (21)
│   │   ├── ActiveUsers.tsx          # Real-time presence indicators
│   │   ├── ActivityFeed.tsx         # Collaboration event stream
│   │   ├── AllFilesPreviewDialog.tsx # Multi-file preview modal
│   │   ├── AuthForm.tsx             # Sign-in / sign-up form
│   │   ├── ChatInput.tsx            # Message input with typing indicator
│   │   ├── ChatList.tsx             # Sidebar chat list navigation
│   │   ├── ChatMessage.tsx          # Individual message display
│   │   ├── CreatePRDialog.tsx       # Pull request creation modal
│   │   ├── DocumentTranslationView.tsx # Role-aware document viewer
│   │   ├── EmojiReactionPicker.tsx  # Reaction emoji selector
│   │   ├── EmojiReactionsDisplay.tsx # Reaction badge display
│   │   ├── FileDiffViewer.tsx       # Code diff visualization
│   │   ├── FilePreviewDialog.tsx    # Single file preview modal
│   │   ├── InlineCommentThread.tsx  # Line-level code comments
│   │   ├── MomentumDashboard.tsx    # Project velocity dashboard
│   │   ├── NewChatDialog.tsx        # Chat creation modal
│   │   ├── PRCard.tsx               # Pull request summary card
│   │   ├── PRDialog.tsx             # Pull request detail view
│   │   ├── TranslateButton.tsx      # AI translation trigger
│   │   ├── TranslatedText.tsx       # Translated text overlay
│   │   └── TypingIndicator.tsx      # Typing presence animation
│   │
│   │   └── ui/                      # shadcn/ui primitives (46)
│   │       ├── accordion.tsx        ├── alert.tsx
│   │       ├── avatar.tsx           ├── badge.tsx
│   │       ├── button.tsx           ├── calendar.tsx
│   │       ├── card.tsx             ├── carousel.tsx
│   │       ├── chart.tsx            ├── checkbox.tsx
│   │       ├── collapsible.tsx      ├── command.tsx
│   │       ├── dialog.tsx           ├── drawer.tsx
│   │       ├── dropdown-menu.tsx    ├── form.tsx
│   │       ├── hover-card.tsx       ├── input.tsx
│   │       ├── label.tsx            ├── menubar.tsx
│   │       ├── pagination.tsx       ├── popover.tsx
│   │       ├── progress.tsx         ├── radio-group.tsx
│   │       ├── resizable.tsx        ├── scroll-area.tsx
│   │       ├── select.tsx           ├── separator.tsx
│   │       ├── sheet.tsx            ├── sidebar.tsx
│   │       ├── skeleton.tsx         ├── slider.tsx
│   │       ├── sonner.tsx           ├── switch.tsx
│   │       ├── table.tsx            ├── tabs.tsx
│   │       ├── textarea.tsx         ├── toggle.tsx
│   │       ├── toggle-group.tsx     └── tooltip.tsx
│   │
│   ├── hooks/                       # Custom React hooks (8)
│   │   ├── use-auth.ts              # Authentication state management
│   │   ├── use-chat-actions.ts      # Chat send/translate orchestration
│   │   ├── use-chats.ts             # Chat CRUD via Spark KV
│   │   ├── use-collaboration.ts     # Real-time presence & events
│   │   ├── use-mobile.ts            # Responsive breakpoint detection
│   │   ├── use-pending-changes.ts   # File change staging
│   │   ├── use-pull-requests.ts     # PR lifecycle via Spark KV
│   │   └── use-ui-state.ts          # Panel/dialog state management
│   │
│   ├── lib/                         # Core libraries
│   │   ├── auth.ts                  # Auth operations (Spark KV)
│   │   ├── collaboration.ts         # CollaborationService singleton
│   │   ├── constants.ts             # App constants & breakpoints
│   │   ├── types.ts                 # TypeScript interfaces (135 lines)
│   │   ├── utils.ts                 # cn() Tailwind utility
│   │   │
│   │   └── services/                # Business logic services (4)
│   │       ├── index.ts             # Barrel re-export
│   │       ├── ai.service.ts        # LLM integration (GPT-4o)
│   │       ├── chat.service.ts      # Chat/message factory methods
│   │       ├── pr.service.ts        # Pull request operations
│   │       └── line-comment.service.ts # Inline code comments
│   │
│   └── styles/
│       └── theme.css                # CSS custom properties / theming
│
├── .github/                         # GitHub configuration
├── dist/                            # Build output
└── node_modules/                    # Dependencies
```

---

## Architecture Overview

### Application Bootstrap

```
┌──────────────────────────────────────────────────────────────────┐
│                        index.html                                │
│  <div id="root">                                                 │
│    └──▶ main.tsx                                                 │
│           ├── import @github/spark/spark   (Spark runtime init)  │
│           ├── import main.css + theme.css + index.css             │
│           └── createRoot()                                       │
│                 └── <ErrorBoundary>                               │
│                       └── <App />                                │
└──────────────────────────────────────────────────────────────────┘
```

### Request Flow

```
┌─────────────┐     ┌────────────────┐     ┌──────────────────┐
│   Browser   │────▶│   App.tsx      │────▶│   Custom Hooks   │
│  (User UI)  │     │  (Monolithic   │     │  use-chats.ts    │
│             │     │   661 lines)   │     │  use-auth.ts     │
└─────────────┘     └────────┬───────┘     │  use-pull-reqs   │
                             │             │  use-collab      │
                             │             └────────┬─────────┘
                    ┌────────▼───────┐     ┌────────▼─────────┐
                    │  Components    │     │  Service Layer    │
                    │  ChatMessage   │     │  ChatService      │
                    │  PRCard        │     │  AIService         │
                    │  Dashboard     │     │  PRService         │
                    │  AuthForm      │     │  LineCommentSvc    │
                    └────────────────┘     └────────┬─────────┘
                                                    │
                                           ┌────────▼─────────┐
                                           │  Spark Platform   │
                                           │  ┌─────────────┐ │
                                           │  │ spark.kv.*   │ │
                                           │  │ (KV Store)   │ │
                                           │  ├─────────────┤ │
                                           │  │ spark.llm()  │ │
                                           │  │ (GPT-4o)     │ │
                                           │  └─────────────┘ │
                                           └──────────────────┘
```

### Data Flow: Sending a Message

```
┌──────────┐  handleSend()  ┌──────────────┐  sendMessage()  ┌─────────────┐
│ChatInput │───────────────▶│useChatActions│───────────────▶│  use-chats   │
│  .tsx    │                │    .ts       │                │    .ts       │
└──────────┘                └──────┬───────┘                └──────┬──────┘
                                   │                               │
                          onMessageCreated()               ChatService
                                   │                     .createMessage()
                                   ▼                               │
                           addMessage()                            ▼
                           (state update)              ┌───────────────────┐
                                   │                   │  AIService        │
                                   │                   │  .generateChat    │
                                   │                   │   Response()      │
                                   │                   └─────────┬─────────┘
                                   │                             │
                                   │                    spark.llm(prompt,
                                   │                      'gpt-4o', true)
                                   │                             │
                                   ▼                             ▼
                           ┌──────────────┐            ┌──────────────┐
                           │  Spark KV    │            │  AI Response │
                           │  setChats()  │            │  + suggested │
                           │  (persist)   │            │    changes   │
                           └──────────────┘            └──────────────┘
```

### Layer Responsibilities

| Layer | Location | Responsibility |
|-------|----------|----------------|
| **Entry** | `main.tsx` | React root, ErrorBoundary, CSS imports |
| **App Shell** | `App.tsx` | Layout, routing (state-based), hook composition |
| **Components** | `components/*.tsx` | UI rendering, user interaction events |
| **UI Primitives** | `components/ui/*.tsx` | shadcn/ui + Radix — accessible base components |
| **Hooks** | `hooks/*.ts` | State management, side effects, KV persistence |
| **Services** | `lib/services/*.ts` | Pure business logic — factory methods, data transforms |
| **Auth** | `lib/auth.ts` | Sign-in/up/out via Spark KV |
| **Collaboration** | `lib/collaboration.ts` | Presence polling, event broadcasting via KV |
| **Types** | `lib/types.ts` | All TypeScript interfaces and type aliases |
| **Platform** | `@github/spark` | KV store, LLM access, hooks (`useKV`) |

---

## Key Concepts

### 1. GitHub Spark KV Persistence Pattern

bmad-chat has **no database or backend**. All persistence uses the Spark KV store via the `useKV` hook from `@github/spark/hooks`. This hook provides a reactive state that automatically syncs with the platform's key-value storage.

```typescript
// src/hooks/use-chats.ts — KV-backed state
import { useKV } from '@github/spark/hooks'
import { Chat } from '@/lib/types'

export function useChats() {
  // useKV<T>(key, defaultValue) — persistent reactive state
  const [chats, setChats] = useKV<Chat[]>('chats', [])

  const createChat = (domain: string, service: string, ...) => {
    const newChat = ChatService.createChat(title, domain, service, feature, currentUserId)
    // setChats accepts an updater function — immutable updates
    setChats((current) => [newChat, ...(current || [])])
    return newChat
  }

  return { chats: chats || [], createChat, ... }
}
```

**KV Keys in use across the application:**

| KV Key | Type | Used In |
|--------|------|---------|
| `chats` | `Chat[]` | `use-chats.ts` |
| `pull-requests` | `PullRequest[]` | `use-pull-requests.ts` |
| `docflow-users` | `AuthUser[]` | `lib/auth.ts` |
| `docflow-current-user` | `AuthUser` | `lib/auth.ts` |
| `user-presence` | `Record<string, UserPresence>` | `lib/collaboration.ts` |
| `collaboration-events` | `CollaborationEvent[]` | `lib/collaboration.ts` |

**Direct KV API access** is also used for auth (non-reactive operations):

```typescript
// src/lib/auth.ts — Direct KV access (no useKV hook)
export async function signUp(
  email: string, password: string, name: string, role: UserRole
): Promise<AuthUser> {
  const users = await window.spark.kv.get<AuthUser[]>('docflow-users')
  // ... validate uniqueness, create new user
  await window.spark.kv.set('docflow-users', users)
  return newUser
}

export async function signIn(email: string, password: string): Promise<AuthUser> {
  const users = await window.spark.kv.get<AuthUser[]>('docflow-users')
  const user = users.find((u) => u.email === email && u.password === password)
  if (!user) throw new Error('Invalid email or password')
  return user
}
```

### 2. Static Service Layer Pattern

Services are **stateless static classes** — pure factory methods with no instances, no constructors, no dependency injection. They encapsulate business logic and data transformations:

```typescript
// src/lib/services/chat.service.ts
export class ChatService {
  // Factory method — creates new Chat with generated ID and timestamps
  static createChat(title: string, domain: string, service: string,
                    feature: string, currentUserId: string): Chat {
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

  // Factory method — creates new Message
  static createMessage(chatId: string, content: string,
                       userId: string, role: 'user' | 'assistant',
                       fileChanges?: FileChange[]): Message {
    return {
      id: `msg-${Date.now()}`,
      chatId, content, role,
      timestamp: Date.now(),
      userId: role === 'user' ? userId : undefined,
      fileChanges,
    }
  }

  // Query method — aggregates organization data from chats
  static extractOrganization(chats: Chat[]) {
    const domains = new Set<string>()
    const services = new Set<string>()
    const features = new Set<string>()
    chats.forEach((chat) => {
      if (chat.domain) domains.add(chat.domain)
      if (chat.service) services.add(chat.service)
      if (chat.feature) features.add(chat.feature)
    })
    return {
      domains: Array.from(domains),
      services: Array.from(services),
      features: Array.from(features),
    }
  }
}
```

**All four services follow this pattern:**

| Service | File | Methods |
|---------|------|---------|
| `ChatService` | `chat.service.ts` | `createChat`, `createMessage`, `extractOrganization` |
| `AIService` | `ai.service.ts` | `generateChatResponse`, `translateMessage`, `getRoleGuidance` |
| `PRService` | `pr.service.ts` | `createPR`, `mergePR`, `closePR`, `approvePR`, `addComment` |
| `LineCommentService` | `line-comment.service.ts` | `createLineComment`, `addCommentToFile`, `resolveCommentInFile`, `toggleReactionInFile` |

### 3. Custom Hook Composition Pattern

Hooks separate concerns from the monolithic `App.tsx`. Each hook owns one domain of state:

```typescript
// src/hooks/use-auth.ts — Authentication domain
export function useAuth() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoadingAuth, setIsLoadingAuth] = useState(true)

  useEffect(() => { loadCurrentUser() }, [])

  const handleSignIn = async (email: string, password: string) => {
    const authUser = await signIn(email, password)
    await saveCurrentUser(authUser)
    const user: User = {
      id: authUser.id,
      name: authUser.name,
      avatarUrl: authUser.avatarUrl,
      email: authUser.email,
      role: authUser.role,
    }
    setCurrentUser(user)
    setIsAuthenticated(true)
    toast.success('Welcome back!')
  }

  return { currentUser, isAuthenticated, isLoadingAuth, handleSignIn, handleSignUp, handleSignOut }
}
```

**Hook composition in App.tsx:**

```tsx
// src/App.tsx — All hooks composed at root level
function App() {
  const { currentUser, isAuthenticated, ... } = useAuth()
  const { chats, createChat, addMessage, ... }  = useChats()
  const { pullRequests, createPR, mergePR, ... } = usePullRequests()
  const { pendingChanges, addChanges, ... }      = usePendingChanges()
  const { isMobile, activeChat, ... }            = useUIState()
  const { handleSendMessage, ... }               = useChatActions(...)
  const { activeUsers, broadcastEvent, ... }     = useCollaboration(currentUser, activeChat)
  // ... 661 lines of layout and event wiring
}
```

### 4. AI Integration Pattern (Spark LLM)

The AI service uses `window.spark.llm()` to call GPT-4o with structured JSON prompts:

```typescript
// src/lib/services/ai.service.ts
export class AIService {
  static async generateChatResponse(
    content: string, currentUser: User
  ): Promise<AIResponse> {
    const roleGuidance = this.getRoleGuidance(currentUser.role)

    const promptText = `You are BMAD, an intelligent orchestrator...
    Current User: ${currentUser.name} (${currentUser.role} role)
    User message: ${content}
    ...
    Format your response as JSON with this structure:
    {
      "response": "...",
      "suggestedChanges": [...],
      "routingAssessment": "...",
      "momentumIndicator": "..."
    }`

    // window.spark.llm(prompt, model, jsonMode)
    const response = await window.spark.llm(promptText, 'gpt-4o', true)
    return JSON.parse(response)
  }
}
```

**Key AI behaviors:**
- **Role-aware routing**: Technical questions to technical users, business to business
- **Requirements Firewall**: Protects engineers from ambiguous requirements
- **Momentum tracking**: Every response includes a momentum indicator
- **Suggested changes**: AI proposes `.bmad/` file changes as `FileChange[]`

### 5. Real-Time Collaboration via KV Polling

Since Spark has no WebSocket support, collaboration uses **KV-based polling**:

```typescript
// src/lib/collaboration.ts
export class CollaborationService {
  private presenceInterval: number | null = null

  async initialize(userId: string) {
    this.currentUserId = userId
    await this.updatePresence()
    // Poll every 5 seconds for presence updates
    this.presenceInterval = window.setInterval(() => {
      this.updatePresence()
    }, 5000)
    await this.cleanupStalePresence()
  }

  async getActiveUsers(chatId?: string): Promise<UserPresence[]> {
    const allPresence = await this.getAllPresence()
    const now = Date.now()
    // Filter users not seen in last 30 seconds
    return Object.values(allPresence).filter(
      (presence) => now - presence.lastSeen < PRESENCE_TIMEOUT
    )
  }
}
```

**Collaboration architecture:**

```
┌──────────────┐  updatePresence()   ┌──────────────┐
│   User A     │────────────────────▶│  Spark KV    │
│  (Browser)   │                     │ "user-pres"  │
└──────────────┘                     │ "collab-evts"│
                                     └──────┬───────┘
┌──────────────┐  getActiveUsers()          │
│   User B     │◀───────────────────────────┘
│  (Browser)   │  poll every 5s
└──────────────┘
```

---

## Frontend Development Guide

### Adding a New Application Component

Follow the existing pattern in `src/components/`:

**Step 1: Define the interface**

```tsx
// src/components/MyFeature.tsx
import { Chat, User } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface MyFeatureProps {
  chats: Chat[]
  currentUser: User
  onAction: (chatId: string) => void
}
```

**Step 2: Implement the component with animation**

```tsx
export function MyFeature({ chats, currentUser, onAction }: MyFeatureProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <Card className="p-4">
        <h3 className="text-lg font-semibold">My Feature</h3>
        {chats.map((chat) => (
          <div key={chat.id} className="flex items-center gap-2">
            <Badge variant="outline">{chat.domain}</Badge>
            <span className="text-sm">{chat.title}</span>
            <Button size="sm" onClick={() => onAction(chat.id)}>
              Action
            </Button>
          </div>
        ))}
      </Card>
    </motion.div>
  )
}
```

**Step 3: Wire into App.tsx**

```tsx
// src/App.tsx — Add import
import { MyFeature } from '@/components/MyFeature'

// Inside the render, add where appropriate
<MyFeature
  chats={chats}
  currentUser={currentUser}
  onAction={(chatId) => handleSelectChat(chatId)}
/>
```

### Component Conventions

| Convention | Example |
|------------|---------|
| **Named exports** | `export function ChatMessage(...)` |
| **Props interface** | `interface ChatMessageProps { ... }` |
| **shadcn/ui primitives** | `<Card>`, `<Button>`, `<Badge>`, `<Dialog>` |
| **Framer Motion** | `<motion.div initial={...} animate={...}>` |
| **Phosphor Icons** | `<PaperPlaneRight size={16} weight="duotone" />` |
| **Tailwind classes** | `className="flex items-center gap-2 text-sm"` |
| **cn() utility** | `cn('base-class', conditional && 'active-class')` |
| **Sonner toasts** | `toast.success('Created!')` |

---

## Service Development Guide

### Adding a New Service

**Step 1: Create the service file**

```typescript
// src/lib/services/decision.service.ts
import { User } from '@/lib/types'

// Define the domain type
export interface Decision {
  id: string
  title: string
  status: 'proposed' | 'accepted' | 'rejected'
  proposedBy: string
  createdAt: number
}

// Static class — no constructor, no state
export class DecisionService {
  static createDecision(title: string, user: User): Decision {
    return {
      id: `decision-${Date.now()}`,
      title,
      status: 'proposed',
      proposedBy: user.name,
      createdAt: Date.now(),
    }
  }

  static acceptDecision(decision: Decision): Decision {
    return { ...decision, status: 'accepted' }
  }
}
```

**Step 2: Register in barrel export**

```typescript
// src/lib/services/index.ts
export * from './ai.service'
export * from './chat.service'
export * from './pr.service'
export * from './line-comment.service'
export * from './decision.service'   // ← Add new service
```

**Step 3: Create the companion hook**

```typescript
// src/hooks/use-decisions.ts
import { useKV } from '@github/spark/hooks'
import { DecisionService, Decision } from '@/lib/services'
import { User } from '@/lib/types'
import { toast } from 'sonner'

export function useDecisions() {
  const [decisions, setDecisions] = useKV<Decision[]>('decisions', [])

  const createDecision = (title: string, user: User) => {
    const newDecision = DecisionService.createDecision(title, user)
    setDecisions((current) => [newDecision, ...(current || [])])
    toast.success('Decision proposed')
    return newDecision
  }

  return { decisions: decisions || [], createDecision }
}
```

### Service Conventions

| Convention | Detail |
|------------|--------|
| **Static methods only** | No `new`, no instance state |
| **Pure transforms** | Input → Output, no side effects |
| **ID generation** | `` `${type}-${Date.now()}` `` pattern |
| **Immutable updates** | Spread operator: `{ ...entity, field: newValue }` |
| **No KV access** | Services never call `spark.kv.*` — hooks do that |
| **Barrel export** | Always add to `services/index.ts` |

---

## Hook Development Guide

### Creating a New Custom Hook

All hooks follow the pattern: **KV state + service methods + toast feedback**.

```typescript
// src/hooks/use-{domain}.ts
import { useKV } from '@github/spark/hooks'           // For persisted state
import { useState } from 'react'                       // For ephemeral state
import { MyService, MyEntity } from '@/lib/services'
import { toast } from 'sonner'

export function useMyDomain() {
  // ── Persisted state (survives refresh) ──
  const [items, setItems] = useKV<MyEntity[]>('my-items', [])

  // ── Ephemeral state (resets on refresh) ──
  const [isLoading, setIsLoading] = useState(false)

  // ── Actions (delegate to service, update state, show toast) ──
  const createItem = (name: string) => {
    const newItem = MyService.createItem(name)
    setItems((current) => [newItem, ...(current || [])])
    toast.success('Item created')
    return newItem
  }

  const deleteItem = (id: string) => {
    setItems((current) => (current || []).filter((item) => item.id !== id))
    toast.info('Item deleted')
  }

  // ── Queries ──
  const getItemById = (id: string | null) => {
    if (!id) return undefined
    return items?.find((item) => item.id === id)
  }

  return {
    items: items || [],     // Always return non-null
    isLoading,
    createItem,
    deleteItem,
    getItemById,
  }
}
```

### Hook Pattern Summary

```
┌──────────────────────────────────────────────────────────┐
│                    Custom Hook                           │
│                                                          │
│  ┌─────────────┐   ┌─────────────┐   ┌──────────────┐  │
│  │  useKV<T>   │   │  useState   │   │  useEffect   │  │
│  │ (persisted) │   │ (ephemeral) │   │ (side effects│  │
│  └──────┬──────┘   └──────┬──────┘   └──────┬───────┘  │
│         │                 │                  │           │
│         ▼                 ▼                  ▼           │
│  ┌─────────────────────────────────────────────────┐    │
│  │         Action Methods                          │    │
│  │  • Delegate to Service (pure logic)             │    │
│  │  • Update state (setItems updater fn)           │    │
│  │  • Show feedback (toast)                        │    │
│  └─────────────────────────────────────────────────┘    │
│                         │                                │
│                         ▼                                │
│                   return { state, actions, queries }      │
└──────────────────────────────────────────────────────────┘
```

### Hook vs Service Responsibilities

| Responsibility | Hook | Service |
|---------------|------|---------|
| State management | ✅ | ❌ |
| KV persistence | ✅ | ❌ |
| Toast notifications | ✅ | ❌ |
| Side effects | ✅ | ❌ |
| Entity creation | ❌ | ✅ |
| Data transforms | ❌ | ✅ |
| Business rules | ❌ | ✅ |
| Pure functions | ❌ | ✅ |

---

## Common Development Tasks

### Adding a New Feature End-to-End

```
1. Define types          →  src/lib/types.ts
2. Create service        →  src/lib/services/{feature}.service.ts
3. Export from barrel     →  src/lib/services/index.ts
4. Create hook           →  src/hooks/use-{feature}.ts
5. Create component      →  src/components/{Feature}.tsx
6. Wire into App.tsx     →  Import hook, pass props to component
7. Add KV key            →  Choose unique key for useKV
```

### Adding a New shadcn/ui Component

```bash
# shadcn/ui components live in src/components/ui/
# 46 components are already installed.

# To add a new primitive:
# 1. Check https://ui.shadcn.com/docs/components for available components
# 2. Create src/components/ui/{component-name}.tsx
# 3. Follow the Radix UI + cn() + cva() pattern:
```

```typescript
import * as React from 'react'
import * as PrimitiveName from '@radix-ui/react-{primitive}'
import { cn } from '@/lib/utils'

const MyComponent = React.forwardRef<
  React.ComponentRef<typeof PrimitiveName.Root>,
  React.ComponentPropsWithoutRef<typeof PrimitiveName.Root>
>(({ className, ...props }, ref) => (
  <PrimitiveName.Root
    ref={ref}
    className={cn('base-tailwind-classes', className)}
    {...props}
  />
))
MyComponent.displayName = 'MyComponent'

export { MyComponent }
```

### Debugging Tips

| Scenario | Approach |
|----------|----------|
| **KV data corruption** | Browser DevTools → Console → `window.spark.kv.get('key')` |
| **State not updating** | Check that `setItems` uses updater function `(current) => ...` |
| **LLM response parse error** | Check `AIService` prompt — ensure `jsonMode: true` in `spark.llm()` |
| **Presence not syncing** | Verify `PRESENCE_TIMEOUT` (30s) and poll interval (5s) |
| **Component not rendering** | Ensure imported and rendered in `App.tsx` return block |
| **Auth session lost** | Check `docflow-current-user` KV key in DevTools |
| **TypeScript errors** | Run `npm run build` (uses `tsc -b --noCheck`) |
| **Styling issues** | Check `cn()` for class conflicts — `tailwind-merge` resolves |

---

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| `useKV` returns `undefined` on first render | KV is async; value hasn't loaded yet | Always default: `items \|\| []` |
| `spark.llm()` is not a function | Running outside Spark runtime | Use Spark dev environment, not plain `npm run dev` |
| `window.spark` is undefined | Missing runtime import | Ensure `main.tsx` imports `@github/spark/spark` first |
| Duplicate messages appearing | `Date.now()` ID collision on fast clicks | Debounce or use `uuid` package (already installed) |
| Stale presence data | Users not cleaned up on tab close | `cleanupStalePresence()` runs on init, 30s timeout |
| PR file changes empty | Pending changes not staged | Check `usePendingChanges.addChanges()` is called |
| Mobile layout broken | Panel state not responsive | Use `useIsMobile()` and conditionally render panels |
| AI response invalid JSON | LLM occasionally returns malformed JSON | Wrap `JSON.parse()` in try/catch; retry on failure |
| Theme not applying | Missing CSS import | Verify `main.tsx` imports `theme.css` + `index.css` |
| Icons not rendering | Wrong import source | Use `@phosphor-icons/react` with Spark proxy plugin |

---

## Type System

### Core Domain Types

```typescript
// src/lib/types.ts — Complete type hierarchy

export type UserRole = 'technical' | 'business'

export interface User {
  id: string
  name: string
  avatarUrl: string          // DiceBear-generated
  role: UserRole
  email: string
  password?: string          // Excluded from runtime user
}

export interface Chat {
  id: string                 // 'chat-{timestamp}'
  title: string
  createdAt: number
  updatedAt: number
  messages: Message[]        // Embedded, not referenced
  participants: string[]     // User IDs
  domain?: string            // Organization taxonomy
  service?: string
  feature?: string
}

export interface Message {
  id: string                 // 'msg-{timestamp}'
  chatId: string
  content: string
  role: 'user' | 'assistant'
  timestamp: number
  userId?: string
  fileChanges?: FileChange[] // AI-suggested file changes
  translations?: MessageTranslation[]
}

export interface PullRequest {
  id: string                 // 'pr-{timestamp}'
  title: string
  description: string
  chatId: string             // Links PR to originating chat
  author: string
  status: PRStatus           // 'open' | 'merged' | 'closed' | 'draft'
  fileChanges: FileChange[]
  comments: PRComment[]
  approvals: string[]        // User IDs who approved
}

export interface CollaborationEvent {
  id: string
  type: 'user_join' | 'user_leave' | 'typing_start' | 'typing_stop'
       | 'message_sent' | 'pr_created' | 'pr_updated'
  userId: string
  userName: string
  chatId?: string
  timestamp: number
  metadata?: Record<string, any>
}
```

---

## Deployment

### GitHub Spark Deployment

bmad-chat is designed exclusively for the **GitHub Spark** platform. There is no traditional server deployment.

```
┌──────────────────────────────────────────────────────┐
│                   GitHub Spark                        │
│                                                      │
│  ┌────────────┐  ┌────────────┐  ┌──────────────┐   │
│  │  Vite Build │  │  KV Store  │  │  GPT-4o LLM  │   │
│  │  (Static)   │  │ (Per-user) │  │  (Per-call)  │   │
│  └────────────┘  └────────────┘  └──────────────┘   │
│                                                      │
│  Runtime APIs:                                       │
│  • window.spark.kv.get/set/delete                    │
│  • window.spark.llm(prompt, model, jsonMode)         │
│  • useKV() hook from @github/spark/hooks             │
│                                                      │
│  Plugins (vite.config.ts):                           │
│  • sparkPlugin()           — Runtime injection       │
│  • createIconImportProxy() — Phosphor icon proxying  │
└──────────────────────────────────────────────────────┘
```

**Build process:**

```bash
# Production build
npm run build
# Runs: tsc -b --noCheck && vite build
# Output: dist/ directory
```

**Configuration files:**

| File | Purpose |
|------|---------|
| `spark.meta.json` | Spark app metadata (name, version) |
| `runtime.config.json` | Runtime environment configuration |
| `theme.json` | Spark theme customization |
| `vite.config.ts` | Build config with Spark + Tailwind plugins |

---

## Migration Context

bmad-chat exists within the broader BMAD ecosystem that includes legacy systems being modernized. Related migration documentation may be found in:

- **Architecture documentation** — System design and component relationships
- **API Surface documentation** — Available interfaces and integration points
- **Integration Map** — How bmad-chat connects with bmadServer and other services
- **Data Model documentation** — Entity relationships and storage patterns

### Current Technical Debt

| Area | Issue | Priority |
|------|-------|----------|
| `App.tsx` (661 lines) | Monolithic — should be split into route-level components | High |
| No test coverage | Zero test files — needs Vitest integration | High |
| No router | State-based "routing" — should use React Router or TanStack Router | Medium |
| Password in KV | `auth.ts` stores plaintext passwords in KV | High (security) |
| `Date.now()` IDs | Risk of collision under rapid operations | Medium |
| No error boundaries | Only root-level ErrorBoundary exists | Low |
| `App.refactored.tsx` | Partial refactor exists but unused | Medium |

---

## Support Resources

### Key Files to Know

| When you need to... | Look at... |
|---------------------|-----------|
| Understand the full app | `src/App.tsx` (661 lines — the entire UI) |
| See all domain types | `src/lib/types.ts` (135 lines) |
| Understand AI behavior | `src/lib/services/ai.service.ts` (112 lines) |
| Debug auth issues | `src/lib/auth.ts` (65 lines) |
| Add a new hook | Copy pattern from `src/hooks/use-chats.ts` |
| Modify collaboration | `src/lib/collaboration.ts` (146 lines) |
| Update app constants | `src/lib/constants.ts` (breakpoints, timing) |
| Check build config | `vite.config.ts` (Spark plugins, path aliases) |

### External Documentation

| Resource | URL |
|----------|-----|
| React 19 Docs | https://react.dev |
| Vite 7 Guide | https://vite.dev |
| shadcn/ui Components | https://ui.shadcn.com |
| Radix UI Primitives | https://radix-ui.com |
| Tailwind CSS 4 | https://tailwindcss.com |
| Phosphor Icons | https://phosphoricons.com |
| Framer Motion | https://motion.dev |
| Sonner (Toasts) | https://sonner.emilkowal.dev |

---

## Related Documentation

- [Architecture](architecture.md) — System architecture and design patterns
- [API Surface](api-surface.md) — Platform APIs and service interfaces
- [Data Model](data-model.md) — Entity relationships and KV schema
- [Integration Map](integration-map.md) — Cross-service connections

---

*Auto-generated by LENS Discovery System — SCOUT Agent*  
*Part of the BMAD Method v6 framework*
