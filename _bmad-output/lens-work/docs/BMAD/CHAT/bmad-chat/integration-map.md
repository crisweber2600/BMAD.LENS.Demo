# bmad-chat - Integration Map

> **Generated**: SCOUT Analyze Codebase + Generate Docs Workflow  
> **System**: LENS Discovery System  
> **Status**: BMAD-Ready Documentation

---

## Integration Overview

bmad-chat is a React 19 SPA running on GitHub Spark that integrates with platform-provided services for persistence (KV Store), AI inference (LLM), and an external HTTP API (DiceBear) for avatar generation. The application has no traditional backend — all state management and AI orchestration happen client-side through the Spark platform APIs exposed via `window.spark.*`. Three npm dependencies (`@octokit/core`, `d3`, `three`) are declared in `package.json` but have zero source-level imports, indicating unused phantom dependencies.

| Integration | Type | Protocol | Status |
|---|---|---|---|
| Spark KV Store | Platform (Internal) | `window.spark.kv.*` | **Active** — 6 keys |
| Spark LLM | Platform (Internal) | `window.spark.llm()` | **Active** — 3 call sites |
| DiceBear Avatars | External HTTP | HTTPS GET | **Active** — avatar URLs |
| Spark Hosting | Platform (Infra) | Vite Plugin | **Active** — build/deploy |
| `@octokit/core` | npm dependency | — | **Unused** — zero imports |
| `d3` | npm dependency | — | **Unused** — zero imports |
| `three` | npm dependency | — | **Unused** — zero imports |

---

## Integration Architecture

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                           INTEGRATION LANDSCAPE                                  │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌──────────────────────────────────────────────────────────────────────┐        │
│  │                     GITHUB SPARK PLATFORM                           │        │
│  │                                                                      │        │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────────┐    │        │
│  │  │   SPARK KV      │  │   SPARK LLM     │  │  SPARK HOSTING   │    │        │
│  │  │   STORE          │  │   (GPT-4o)      │  │  (Vite Plugin)   │    │        │
│  │  │                  │  │                  │  │                  │    │        │
│  │  │  6 keys:         │  │  3 call sites:   │  │  sparkPlugin()   │    │        │
│  │  │  ├ chats         │  │  ├ chat resp.    │  │  iconProxy()     │    │        │
│  │  │  ├ pull-requests │  │  ├ translation   │  │                  │    │        │
│  │  │  ├ docflow-users │  │  └ doc transl.   │  │                  │    │        │
│  │  │  ├ docflow-user  │  │                  │  │                  │    │        │
│  │  │  ├ user-presence │  │                  │  │                  │    │        │
│  │  │  └ collab-events │  │                  │  │                  │    │        │
│  │  └────────┬─────────┘  └────────┬─────────┘  └──────────────────┘    │        │
│  │           │                     │                                    │        │
│  └───────────┼─────────────────────┼────────────────────────────────────┘        │
│              │                     │                                             │
│              ▼                     ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐        │
│  │                        BMAD-CHAT SPA                                 │        │
│  │                     (React 19 + TypeScript)                          │        │
│  │                                                                      │        │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────────────────┐    │        │
│  │  │  lib/auth.ts  │  │ lib/services │  │  lib/collaboration.ts  │    │        │
│  │  │  (KV auth)    │  │ /ai.service  │  │  (KV presence)         │    │        │
│  │  └──────┬────────┘  └──────┬───────┘  └─────────┬──────────────┘    │        │
│  │         │                  │                     │                   │        │
│  │         ▼                  ▼                     ▼                   │        │
│  │  ┌──────────────────────────────────────────────────────────────┐    │        │
│  │  │                   React Hooks Layer                          │    │        │
│  │  │  useAuth │ useChats │ useCollaboration │ usePullRequests     │    │        │
│  │  └──────────────────────────────────────────────────────────────┘    │        │
│  └──────────────────────────────────────────────────────────────────────┘        │
│              │                                                                   │
│              ▼                                                                   │
│  ┌─────────────────────┐                                                        │
│  │   DICEBEAR API      │                                                        │
│  │   (External HTTP)   │                                                        │
│  │   api.dicebear.com  │                                                        │
│  │   /7.x/initials/svg │                                                        │
│  └─────────────────────┘                                                        │
│                                                                                  │
│  ┌──────────────────────────────────────────────────────────────────────┐        │
│  │                     UNUSED DEPENDENCIES (npm)                        │        │
│  │                                                                      │        │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐                          │        │
│  │  │ octokit  │  │    d3    │  │ three.js │  ← zero source imports   │        │
│  │  └──────────┘  └──────────┘  └──────────┘                          │        │
│  └──────────────────────────────────────────────────────────────────────┘        │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## Internal Integrations

### 1. Spark KV Store

| Aspect | Details |
|--------|---------|
| **API** | `window.spark.kv` / `useKV` hook |
| **Protocol** | Client-side async JS API |
| **Authentication** | Implicit (Spark platform session) |
| **Persistence** | Platform-managed, per-app KV namespace |
| **SDK** | `@github/spark` (hooks + runtime) |

**KV Key Registry:**

| Key | Type | Module | Purpose |
|-----|------|--------|---------|
| `chats` | `Chat[]` | `useKV` hook | All chat conversations + messages |
| `pull-requests` | `PullRequest[]` | `useKV` hook | PR review objects |
| `docflow-users` | `AuthUser[]` | `spark.kv.set/get` | User account store |
| `docflow-current-user` | `AuthUser` | `spark.kv.set/get/delete` | Active session |
| `user-presence` | `Record<string, UserPresence>` | `spark.kv.set/get` | Real-time presence map |
| `collaboration-events` | `CollaborationEvent[]` | `spark.kv.set/get` | Event broadcast queue |

**Hook-based Access (Reactive):**

```typescript
// src/hooks/use-chats.ts — reactive KV binding
import { useKV } from '@github/spark/hooks'

export function useChats() {
  const [chats, setChats] = useKV<Chat[]>('chats', [])
  // ...
}
```

```typescript
// src/hooks/use-pull-requests.ts — reactive KV binding
import { useKV } from '@github/spark/hooks'

export function usePullRequests() {
  const [pullRequests, setPullRequests] = useKV<PullRequest[]>('pull-requests', [])
  // ...
}
```

**Direct KV Access (Imperative):**

```typescript
// src/lib/auth.ts — user account management
const USERS_KEY = 'docflow-users'
const CURRENT_USER_KEY = 'docflow-current-user'

export async function signUp(email: string, password: string, name: string, role: UserRole): Promise<AuthUser> {
  const users = await getAllUsers()
  // ... create user object
  await window.spark.kv.set(USERS_KEY, users)
  return newUser
}

export async function setCurrentUser(user: AuthUser): Promise<void> {
  await window.spark.kv.set(CURRENT_USER_KEY, user)
}

export async function signOut(): Promise<void> {
  await window.spark.kv.delete(CURRENT_USER_KEY)
}
```

```typescript
// src/lib/collaboration.ts — presence and events
const PRESENCE_KEY = 'user-presence'
const EVENTS_KEY = 'collaboration-events'

async updatePresence(updates?: Partial<UserPresence>) {
  const allPresence = await this.getAllPresence()
  allPresence[this.currentUserId] = updatedPresence
  await window.spark.kv.set(PRESENCE_KEY, allPresence)
}

async broadcastEvent(event: CollaborationEvent) {
  const events = await window.spark.kv.get<CollaborationEvent[]>(EVENTS_KEY) || []
  events.push(event)
  if (events.length > 100) { events.shift() }  // ring buffer at 100
  await window.spark.kv.set(EVENTS_KEY, events)
}
```

**Migration Considerations:**
- KV store has no indexing — chat lookup is O(n) scan
- `collaboration-events` uses a 100-item ring buffer; no persistence beyond capacity
- Passwords stored in plaintext in KV (`AuthUser.password` field)
- No transactional guarantees across multiple KV writes
- Replace with server-side database (Cosmos DB, PostgreSQL) for production scale

---

### 2. Spark LLM Integration

| Aspect | Details |
|--------|---------|
| **API** | `window.spark.llm(prompt, model, json)` |
| **Model** | GPT-4o |
| **Response Format** | JSON (3rd parameter = `true`) |
| **Call Sites** | 3 (chat response, message translation, document translation) |

**System Prompts:**

| Purpose | Location | Role Context |
|---------|----------|-------------|
| Chat Response | `ai.service.ts:generateChatResponse()` | BMAD orchestrator — routes by user role |
| Message Translation | `ai.service.ts:translateMessage()` | Technical↔Business jargon translator |
| Document Translation | `DocumentTranslationView.tsx` | Line-by-line document translator |

**Chat Response — AI Service:**

```typescript
// src/lib/services/ai.service.ts
static async generateChatResponse(content: string, currentUser: User): Promise<AIResponse> {
  const roleGuidance = this.getRoleGuidance(currentUser.role)
  
  const promptText = `You are BMAD, an intelligent orchestrator for business model architecture design.
Your role is to bridge technical and non-technical co-founders by:
1. Routing technical questions to technical users and business questions to business users
2. Protecting engineers from ambiguous requirements (Requirements Firewall)
3. Enforcing commitment hierarchy: Sarah → Market → Users → BMAD → Marcus
4. Maintaining momentum - projects must always move forward

Current User: ${currentUser.name} (${currentUser.role} role)
User message: ${content}

Format your response as JSON with this structure:
{
  "response": "your conversational response here",
  "suggestedChanges": [...],
  "routingAssessment": "correctly routed",
  "momentumIndicator": "high"
}`

  const response = await window.spark.llm(promptText, 'gpt-4o', true)
  return JSON.parse(response)
}
```

**Message Translation — AI Service:**

```typescript
// src/lib/services/ai.service.ts
static async translateMessage(content: string, currentUserRole: UserRole): Promise<TranslationResponse> {
  const roleDescription = currentUserRole === 'business'
    ? 'a business user who needs plain language explanations'
    : 'a technical user who needs detailed implementation specifics'

  const promptText = `You are a translator that helps ${roleDescription} understand content.
Analyze the following text and identify segments that need explanation:
"${content}"

Return JSON: { "segments": [{ "originalText", "startIndex", "endIndex", "explanation", "context" }] }`

  const response = await window.spark.llm(promptText, 'gpt-4o', true)
  return JSON.parse(response)
}
```

**Document Translation — Component-level:**

```typescript
// src/components/DocumentTranslationView.tsx
const response = await window.spark.llm(promptText, 'gpt-4o', true)
const parsed = JSON.parse(response)
setTranslations(parsed.translations || [])
```

**Migration Considerations:**
- All LLM calls are client-side with no rate limiting or cost controls
- Prompts contain inline system instructions (not externalized or versioned)
- No retry logic, timeout handling, or fallback on LLM failures
- JSON parsing of LLM response can throw — wrapped in try/catch but recovery is minimal
- Move to server-side LLM proxy with rate limiting, prompt management, and structured output validation

---

## External Integrations

### 1. DiceBear Avatar API

| Aspect | Details |
|--------|---------|
| **Endpoint** | `https://api.dicebear.com/7.x/initials/svg` |
| **Protocol** | HTTPS GET |
| **Authentication** | None (public API) |
| **Usage** | User avatar generation at signup |
| **Rate Limits** | Undocumented (public tier) |

**Integration Code:**

```typescript
// src/lib/auth.ts — avatar URL generation during signup
const newUser: AuthUser = {
  id: `user-${Date.now()}`,
  email,
  password,
  name,
  role,
  avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
  createdAt: Date.now(),
}
```

**Avatar Display (6 components):**

```
src/App.tsx                         → <AvatarImage src={currentUser.avatarUrl} />
src/components/ActiveUsers.tsx      → <AvatarImage src={user.avatarUrl} />
src/components/ChatMessage.tsx      → <AvatarImage src={user?.avatarUrl} />
src/components/InlineCommentThread.tsx → <AvatarImage src={currentUser.avatarUrl} />  (×2)
src/components/TypingIndicator.tsx  → <AvatarImage src={user.avatarUrl} />
```

**Migration Considerations:**
- External dependency on third-party API for core user identity visual
- No caching — each render fetches from DiceBear CDN
- Avatar URL baked into user record at signup time (immutable unless re-signed up)
- Consider self-hosted avatar generation or Azure Blob Storage for uploaded photos

---

### 2. Potential: GitHub API (Octokit)

| Aspect | Details |
|--------|---------|
| **Package** | `@octokit/core` v6.1.4, `octokit` v4.1.2 |
| **Status** | **UNUSED** — zero imports in source |

```json
// package.json — declared but not imported
"@octokit/core": "^6.1.4",
"octokit": "^4.1.2",
```

**Verification:** `grep -rn "octokit\|Octokit" src/` returns zero results. No source file references either package. Likely scaffolded by the Spark template or planned for future GitHub integration.

---

## API Integration Points

### Current Service → Platform API Surface

bmad-chat has no REST API of its own. All data flows through Spark platform APIs:

| Service Layer | Platform API | Operations | Direction |
|--|--|--|--|
| `lib/auth.ts` | `spark.kv` | `get`, `set`, `delete` | Read/Write |
| `lib/collaboration.ts` | `spark.kv` | `get`, `set` | Read/Write |
| `hooks/use-chats.ts` | `useKV` (hook) | Reactive read/write | Bidirectional |
| `hooks/use-pull-requests.ts` | `useKV` (hook) | Reactive read/write | Bidirectional |
| `lib/services/ai.service.ts` | `spark.llm` | Prompt → JSON | Request/Response |
| `components/DocumentTranslationView.tsx` | `spark.llm` | Prompt → JSON | Request/Response |

### Spark Platform API Signatures

```typescript
// KV Store API
window.spark.kv.get<T>(key: string): Promise<T | null>
window.spark.kv.set(key: string, value: any): Promise<void>
window.spark.kv.delete(key: string): Promise<void>

// LLM API
window.spark.llm(prompt: string, model: string, jsonMode: boolean): Promise<string>

// Hook API (from @github/spark/hooks)
useKV<T>(key: string, defaultValue: T): [T, (updater: T | ((current: T) => T)) => void]
```

---

## Data Flow Diagrams

### Chat Message Flow

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────────┐
│    USER      │     │   ChatInput      │     │   useChats       │
│  (Browser)   │────▶│   Component      │────▶│   Hook           │
└──────────────┘     └──────────────────┘     └────────┬─────────┘
                                                        │
                        ┌───────────────────────────────┤
                        │                               │
                        ▼                               ▼
              ┌──────────────────┐          ┌──────────────────────┐
              │  ChatService     │          │  Spark KV Store      │
              │  .createMessage()│          │  key: 'chats'        │
              └──────────────────┘          │  useKV reactive bind │
                        │                   └──────────────────────┘
                        ▼
              ┌──────────────────┐
              │  AIService       │
              │  .generateChat   │
              │   Response()     │
              └────────┬─────────┘
                       │
                       ▼
              ┌──────────────────┐
              │  window.spark    │
              │  .llm(prompt,    │
              │   'gpt-4o', true)│
              └────────┬─────────┘
                       │
                       ▼
              ┌──────────────────┐          ┌──────────────────────┐
              │  Parse JSON      │────▶     │  ChatMessage         │
              │  AIResponse      │          │  Component (render)  │
              │  { response,     │          │  + FileChange cards  │
              │    suggestedChgs, │          │  + Routing toast     │
              │    routing,      │          └──────────────────────┘
              │    momentum }    │
              └──────────────────┘
```

### PR Review & Collaboration Flow

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────────┐
│    USER      │     │  CreatePRDialog  │     │   PRService      │
│  (Author)    │────▶│  Component       │────▶│   .createPR()    │
└──────────────┘     └──────────────────┘     └────────┬─────────┘
                                                        │
                                                        ▼
                                              ┌──────────────────────┐
                                              │  Spark KV Store      │
                                              │  key: 'pull-requests'│
                                              │  useKV reactive bind │
                                              └──────────┬───────────┘
                                                         │
                     ┌───────────────────────────────────────────────────┐
                     │                       │                           │
                     ▼                       ▼                           ▼
          ┌──────────────────┐    ┌──────────────────┐       ┌──────────────────┐
          │  PRDialog        │    │  FileDiffViewer  │       │  PRCard          │
          │  (review view)   │    │  (line diffs)    │       │  (list view)     │
          └────────┬─────────┘    └────────┬─────────┘       └──────────────────┘
                   │                       │
                   ▼                       ▼
          ┌──────────────────┐    ┌──────────────────────┐
          │  PRService       │    │  LineCommentService   │
          │  .addComment()   │    │  .createLineComment() │
          │  .approvePR()    │    │  .toggleReaction()     │
          │  .mergePR()      │    │  .resolveComment()     │
          └──────────────────┘    └──────────────────────┘
                   │                       │
                   ▼                       ▼
          ┌──────────────────────────────────────────┐
          │         CollaborationService             │
          │  broadcastEvent('pr_created' | ...)      │
          │  KV key: 'collaboration-events'          │
          │  (100-item ring buffer)                  │
          └──────────────────────────────────────────┘
```

### Presence & Collaboration Polling Flow

```
┌──────────────┐     ┌──────────────────┐     ┌────────────────────────┐
│  App Mount   │────▶│  useCollaboration│────▶│  CollaborationService  │
│  (useEffect) │     │  Hook            │     │  .initialize(userId)   │
└──────────────┘     └────────┬─────────┘     └────────────┬───────────┘
                              │                            │
                              │  setInterval(2000ms)       │  setInterval(5000ms)
                              ▼                            ▼
                     ┌──────────────────┐     ┌────────────────────────┐
                     │  pollForUpdates  │────▶│  spark.kv.get          │
                     │  (every 2s)      │     │  ('user-presence')     │
                     └────────┬─────────┘     │  ('collab-events')     │
                              │               └────────────────────────┘
                              ▼
                     ┌──────────────────┐     ┌────────────────────────┐
                     │  Filter active   │────▶│  ActiveUsers component │
                     │  users & typing  │     │  TypingIndicator       │
                     │  (30s timeout)   │     │  ActivityFeed          │
                     └──────────────────┘     └────────────────────────┘
```

---

## Configuration Dependencies

### Spark Platform Configuration

```json
// spark.meta.json — Spark platform descriptor
{
  "templateVersion": 1,
  "dbType": "kv"           // Enables window.spark.kv.* API
}
```

```json
// runtime.config.json — Spark app identity
{
  "app": "839ccf25c4bddabf1a49"   // Spark app ID (immutable)
}
```

### Vite Build Configuration

```typescript
// vite.config.ts — build pipeline with Spark plugins
import sparkPlugin from "@github/spark/spark-vite-plugin"
import createIconImportProxy from "@github/spark/vitePhosphorIconProxyPlugin"

export default defineConfig({
  plugins: [
    react(),             // React 19 SWC transform
    tailwindcss(),       // Tailwind CSS v4
    createIconImportProxy() as PluginOption,  // Phosphor icon tree-shaking
    sparkPlugin() as PluginOption,            // Spark runtime injection
  ],
  resolve: {
    alias: { '@': resolve(projectRoot, 'src') }
  },
})
```

### Application Constants

```typescript
// src/lib/constants.ts — hardcoded config values
export const TIMING = {
  TYPING_DEBOUNCE: 300,      // ms before typing event fires
  PRESENCE_UPDATE: 5000,     // ms between presence heartbeats
  ANIMATION_DURATION: 300,   // ms for UI transitions
} as const

export const PANEL_BREAKPOINTS = {
  MOBILE: 768,               // px mobile breakpoint
  CHAT_LIST_WIDTH: 320,      // px sidebar width
  RIGHT_PANEL_WIDTH: 384,    // px right panel width
} as const
```

### KV Key Constants (Scattered)

| Constant | File | Value |
|--|--|--|
| `USERS_KEY` | `lib/auth.ts` | `'docflow-users'` |
| `CURRENT_USER_KEY` | `lib/auth.ts` | `'docflow-current-user'` |
| `PRESENCE_KEY` | `lib/collaboration.ts` | `'user-presence'` |
| `EVENTS_KEY` | `lib/collaboration.ts` | `'collaboration-events'` |
| *(inline)* | `hooks/use-chats.ts` | `'chats'` |
| *(inline)* | `hooks/use-pull-requests.ts` | `'pull-requests'` |

**Migration Consideration:** KV keys are split between named constants and inline strings. Consolidate to a single `KV_KEYS` enum or constants file for consistency.

---

## Unused Dependencies Analysis

### Confirmed Unused

| Package | Version | Evidence | Recommendation |
|---------|---------|----------|----------------|
| `@octokit/core` | ^6.1.4 | `grep -rn "octokit" src/` → 0 results | **Remove** — bloats bundle |
| `octokit` | ^4.1.2 | `grep -rn "octokit" src/` → 0 results | **Remove** — duplicate of above |
| `d3` | ^7.9.0 | `grep -rn "from 'd3'" src/` → 0 results | **Remove** — 500KB+ unused |
| `three` | ^0.175.0 | `grep -rn "from 'three'" src/` → 0 results | **Remove** — 600KB+ unused |

### Impact Assessment

```
Current bundle impact of unused dependencies:
┌──────────────┬────────────┬───────────────────────────────────┐
│ Package      │ Size (est) │ Status                            │
├──────────────┼────────────┼───────────────────────────────────┤
│ three        │ ~600 KB    │ Tree-shaken out (no imports)      │
│ d3           │ ~500 KB    │ Tree-shaken out (no imports)      │
│ octokit      │ ~200 KB    │ Tree-shaken out (no imports)      │
│ @octokit/core│ ~50 KB     │ Tree-shaken out (no imports)      │
├──────────────┼────────────┼───────────────────────────────────┤
│ TOTAL        │ ~1.35 MB   │ Not in runtime bundle, but bloat  │
│              │            │ node_modules and slow installs     │
└──────────────┴────────────┴───────────────────────────────────┘
```

While Vite tree-shakes unused imports from the production bundle, these packages still:
- Increase `npm install` time and `node_modules` size
- Create false dependency audit alerts
- Mislead developers about the application's actual integration surface

---

## Integration Migration Checklist

### High Priority

- [ ] **KV → Database**: Replace `window.spark.kv` with server-side persistence (Cosmos DB / PostgreSQL) via REST API
- [ ] **Auth Overhaul**: Remove plaintext password storage; implement proper authentication (Azure AD B2C, JWT tokens)
- [ ] **LLM Proxy**: Move `window.spark.llm` calls behind a server-side proxy with rate limiting, cost tracking, and prompt versioning
- [ ] **Remove Spark SDK**: Replace `@github/spark` hooks with standard React state + REST API calls to bmadServer

### Medium Priority

- [ ] **Avatar Self-hosting**: Replace DiceBear HTTP dependency with self-hosted avatar generation or uploaded profile photos
- [ ] **Presence System**: Replace KV polling (2s interval) with WebSocket/SignalR for real-time presence
- [ ] **Event System**: Replace 100-item KV ring buffer with proper event streaming (SignalR, Server-Sent Events)
- [ ] **Remove Unused Deps**: Delete `@octokit/core`, `octokit`, `d3`, `three` from `package.json`

### Low Priority

- [ ] **KV Key Consolidation**: Move all 6 KV key strings to a centralized constants file
- [ ] **Prompt Externalization**: Extract 3 LLM system prompts to versioned configuration files
- [ ] **Error Boundaries**: Add integration-specific error handling for KV failures and LLM timeouts
- [ ] **Offline Support**: Add local caching layer for KV data to handle Spark platform outages

---

## Security Considerations

### Per-Integration Security Assessment

| Integration | Current Security | Risk Level | Recommendation |
|---|---|---|---|
| Spark KV Store | Platform session (implicit) | **HIGH** — plaintext passwords in `docflow-users` | Hash passwords; move auth server-side |
| Spark LLM | Platform session (implicit) | **MEDIUM** — no rate limiting, prompt injection risk | Server-side proxy with input sanitization |
| DiceBear API | None (public API) | **LOW** — no auth needed, but external dependency | Cache avatars or self-host |
| Spark Hosting | GitHub auth (Spark platform) | **LOW** — platform-managed | No action needed pre-migration |

### Key Security Findings

**Critical — Plaintext Password Storage:**

```typescript
// src/lib/auth.ts — passwords stored in KV as plaintext
const newUser: AuthUser = {
  id: `user-${Date.now()}`,
  email,
  password,              // ← plaintext! No hashing
  name,
  role,
  avatarUrl: '...',
  createdAt: Date.now(),
}
await window.spark.kv.set(USERS_KEY, users)  // persisted to KV
```

**Medium — Client-side LLM with No Guard Rails:**
- System prompts are visible in client-side JavaScript (inspectable)
- No server-side validation of LLM responses before rendering
- JSON.parse on LLM responses can throw on malformed output

**Low — Predictable ID Generation:**

```typescript
// Multiple services use Date.now() for IDs
id: `chat-${Date.now()}`      // ChatService
id: `msg-${Date.now()}`       // ChatService
id: `pr-${Date.now()}`        // PRService
id: `comment-${Date.now()}`   // PRService
id: `user-${Date.now()}`      // auth.ts
id: `line-comment-${Date.now()}`  // LineCommentService
id: `event-${Date.now()}`     // CollaborationService
```

All IDs are timestamp-based and predictable. Concurrent operations could produce collisions. Replace with UUID v4 (already available — `uuid` package is in `package.json`).

---

## Related Documentation

- [Architecture](architecture.md) — System architecture and component design
- [API Surface](api-surface.md) — Service layer and hook API documentation
- [Data Model](data-model.md) — Entity definitions and KV schema
- [Onboarding](onboarding.md) — Developer setup and contribution guide
- [Migration Map](migration-map.md) — Migration strategy and phased plan

---

*Generated by LENS System — SCOUT Discovery Workflow*
