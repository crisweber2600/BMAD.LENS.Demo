# DISCOVERY REPORT: bmad-chat

**Domain:** BMAD | **Service:** CHAT  
**Repository:** https://github.com/crisweber2600/bmad-chat.git  
**Default Branch:** main  
**Scan Date:** 2026-02-07  
**Scanner:** Scout (Deep Service Discovery)

---

## TECHNOLOGY STACK

| Dimension | Detail | Evidence |
|-----------|--------|----------|
| **Primary Language** | TypeScript 5.7 | `tsconfig.json` → target ES2020, `package.json` → `typescript: ~5.7.2` |
| **Framework** | React 19 (SPA) | `package.json` → `react: ^19.0.0`, `react-dom: ^19.0.0` |
| **Build System** | Vite 7.2 + SWC | `vite.config.ts` → `@vitejs/plugin-react-swc`, `vite: ^7.2.6` |
| **CSS Framework** | Tailwind CSS 4.1 | `tailwindcss: ^4.1.11`, `@tailwindcss/vite` plugin |
| **Component Library** | shadcn/ui (New York style) | `components.json` → 46 Radix UI primitives in `src/components/ui/` |
| **AI Runtime** | GitHub Spark (gpt-4o) | `@github/spark: >=0.43.1`, `window.spark.llm()`, `window.spark.kv` |
| **State Management** | Custom hooks + Spark KV | `useKV` from `@github/spark/hooks`, React `useState`/`useEffect` |
| **Animation** | Framer Motion 12.6 | `framer-motion: ^12.6.2` |
| **Charts** | Recharts 2.15 | `recharts: ^2.15.1` (MomentumDashboard) |
| **Form Handling** | React Hook Form + Zod | `react-hook-form: ^7.54.2`, `zod: ^3.25.76`, `@hookform/resolvers` |
| **Markdown Rendering** | marked 15 | `marked: ^15.0.7` |
| **3D** | Three.js 0.175 | `three: ^0.175.0` (declared dep, no observed usage in components) |
| **Icons** | Phosphor Icons + Lucide | `@phosphor-icons/react`, `lucide-react` |

### Platform Dependency: GitHub Spark

This app is built **exclusively** on the GitHub Spark platform. All persistence and AI are provided by:

- **`window.spark.kv`** — Key-value store for users, chats, PRs, presence, collaboration events (15 call sites across 4 files)
- **`window.spark.llm(prompt, 'gpt-4o', true)`** — LLM calls for chat responses and role-based translations (3 call sites)
- **`@github/spark/hooks`** → `useKV` — Reactive state hook backed by Spark KV
- **`spark-vite-plugin`** + **`vitePhosphorIconProxyPlugin`** — Build-time integration

**No standalone backend exists.** The `openapi.yaml` is a *specification* for a future backend, not an implemented API.

---

## PROJECT STRUCTURE

```
bmad-chat/
├── .github/
│   └── dependabot.yml           # Dependency automation (npm_and_yarn only)
├── src/
│   ├── App.tsx                   # [661 LOC] Monolithic root — ALL app logic
│   ├── App.refactored.tsx        # Refactored version (WIP, not in use)
│   ├── main.tsx                  # Entry point: ErrorBoundary → App
│   ├── ErrorFallback.tsx         # Error boundary fallback UI
│   ├── components/
│   │   ├── [21 feature components]  # Business logic components
│   │   │   ├── AuthForm.tsx         # Sign in/sign up (180 LOC)
│   │   │   ├── MomentumDashboard.tsx # Velocity/trajectory charts (324 LOC)
│   │   │   ├── ChatList.tsx         # Hierarchical chat navigation (246 LOC)
│   │   │   ├── ChatInput.tsx        # Message composition
│   │   │   ├── ChatMessage.tsx      # Message rendering
│   │   │   ├── NewChatDialog.tsx    # Domain/Service/Feature chat creation (176 LOC)
│   │   │   ├── PRDialog.tsx         # PR detail view (226 LOC)
│   │   │   ├── PRCard.tsx           # PR card in list
│   │   │   ├── CreatePRDialog.tsx   # PR creation from pending changes
│   │   │   ├── FileDiffViewer.tsx   # File diff rendering (158 LOC)
│   │   │   ├── FilePreviewDialog.tsx # Full file preview (466 LOC)
│   │   │   ├── AllFilesPreviewDialog.tsx # Multi-file preview
│   │   │   ├── InlineCommentThread.tsx # Line-level comments (255 LOC)
│   │   │   ├── DocumentTranslationView.tsx # Role-based translation (259 LOC)
│   │   │   ├── TranslateButton.tsx  # Translation trigger
│   │   │   ├── TranslatedText.tsx   # Translated segment rendering
│   │   │   ├── EmojiReactionPicker.tsx # Emoji selection
│   │   │   ├── EmojiReactionsDisplay.tsx # Reaction display
│   │   │   ├── ActiveUsers.tsx      # Presence indicator
│   │   │   ├── TypingIndicator.tsx  # Typing status
│   │   │   └── ActivityFeed.tsx     # Collaboration event stream
│   │   └── ui/                   # [46 shadcn/ui primitives]
│   ├── hooks/                    # [8 custom hooks]
│   │   ├── use-auth.ts           # Authentication state
│   │   ├── use-chats.ts          # Chat CRUD + KV persistence (157 LOC)
│   │   ├── use-chat-actions.ts   # Send message, translate, typing
│   │   ├── use-pull-requests.ts  # PR lifecycle (148 LOC)
│   │   ├── use-pending-changes.ts # Staged file changes
│   │   ├── use-collaboration.ts  # Presence + events polling
│   │   ├── use-ui-state.ts       # UI panels, dialogs, navigation
│   │   └── use-mobile.ts         # Responsive breakpoint detection
│   ├── lib/
│   │   ├── auth.ts               # Spark KV-backed auth (signup/signin/signout)
│   │   ├── collaboration.ts      # Presence service (polling-based)
│   │   ├── constants.ts          # App constants, breakpoints, timing
│   │   ├── types.ts              # All TypeScript interfaces (130 LOC)
│   │   ├── utils.ts              # Utility functions (cn helper)
│   │   └── services/
│   │       ├── index.ts          # Barrel export
│   │       ├── ai.service.ts     # LLM prompt engineering (102 LOC)
│   │       ├── chat.service.ts   # Chat/message factory
│   │       ├── pr.service.ts     # PR lifecycle operations
│   │       └── line-comment.service.ts # Inline comment CRUD (200 LOC)
│   └── styles/
│       └── theme.css             # Custom theme variables
├── openapi.yaml                  # Backend API spec (NOT implemented)
├── PRD.md                        # Product requirements document
├── REFACTORING.md                # Refactoring summary
├── API-README.md                 # Backend API documentation
├── SECURITY.md                   # Security policy
├── components.json               # shadcn/ui config (New York style)
├── tailwind.config.js            # Tailwind configuration
├── theme.json                    # Theme configuration
├── runtime.config.json           # Spark runtime config (app ID)
├── spark.meta.json               # Spark metadata (KV db type)
├── vite.config.ts                # Vite build config with Spark plugins
└── tsconfig.json                 # TypeScript config (ES2020 target)
```

---

## GIT ANALYSIS

| Metric | Value |
|--------|-------|
| **Total Commits** | 16 |
| **Active Contributors** | 1 (Cris Weber) |
| **First Commit** | 2026-02-05 17:24 UTC |
| **Latest Commit** | 2026-02-06 00:16 UTC |
| **Active Days** | 2 (Feb 5–6, 2026) |
| **Commit Frequency** | ~8 commits/day (burst) |
| **Branches (total)** | 10 (1 local feature, 5 dependabot, main) |
| **Activity Trend** | Initial burst build, then maintenance |

### Commit Pattern Analysis

The entire codebase was built in a **single ~7-hour session** using **GitHub Spark** as an AI code generation platform:

1. `17:24` — Initial commit
2. `17:31` — Core chat interface (Spark-generated from natural language prompt)
3. `17:39` — Mobile responsiveness + AI/data backends
4. `17:48` — Real-time collaboration
5. `18:15` — File preview for doc changes
6. `18:33` — Inline commenting on file previews
7. `18:50` — Emoji reactions on line comments
8. `20:13` — Role-based document translation
9. `20:30` — Sign in/sign up + hierarchical chat organization
10. `21:27` — Brainstorming session (100+ ideas generated)
11. `21:36–21:58` — Brainstorming changes + Spark config + OpenAPI schema generation
12. `22:35` — Major refactoring into services/hooks
13. `00:16` — Error fixes

**Pattern:** AI-generated scaffold → iterative feature addition → refactoring → stabilization. All commits authored via Spark ("Generated by Spark: …").

---

## ARCHITECTURE

### Pattern: **Monolithic SPA on GitHub Spark Platform**

```
┌─────────────────────────────────────────────┐
│  Browser (React 19 SPA)                     │
│  ┌───────────────────────────────────────┐  │
│  │  App.tsx (661 LOC — God Component)    │  │
│  │  ┌──────────┐ ┌──────────┐ ┌───────┐ │  │
│  │  │ Auth     │ │ Chat     │ │ PR    │ │  │
│  │  │ Module   │ │ Module   │ │Module │ │  │
│  │  └──────────┘ └──────────┘ └───────┘ │  │
│  │  ┌──────────┐ ┌──────────┐ ┌───────┐ │  │
│  │  │ Collab   │ │ UI State │ │ Files │ │  │
│  │  │ Module   │ │ Module   │ │Module │ │  │
│  │  └──────────┘ └──────────┘ └───────┘ │  │
│  └───────────────────────────────────────┘  │
│  ┌─────────────────────────────────────┐    │
│  │  Services Layer                     │    │
│  │  AI | Chat | PR | LineComment       │    │
│  └─────────────────────────────────────┘    │
│  ┌─────────────────────────────────────┐    │
│  │  Custom Hooks (8)                   │    │
│  │  auth | chats | actions | PRs |     │    │
│  │  changes | collab | ui | mobile     │    │
│  └─────────────────────────────────────┘    │
├─────────────────────────────────────────────┤
│  GitHub Spark Runtime                       │
│  ┌──────────────┐  ┌──────────────────┐     │
│  │ spark.kv     │  │ spark.llm        │     │
│  │ (KV Storage) │  │ (GPT-4o)         │     │
│  └──────────────┘  └──────────────────┘     │
└─────────────────────────────────────────────┘
```

### Component Organization
- **Feature components** (21): Domain-specific UI — auth, chat, PR review, file diffs, collaboration, translation
- **UI primitives** (46): shadcn/ui Radix wrappers — standard component library
- **Service classes** (4): Static factory/lifecycle methods — no instances, no DI
- **Custom hooks** (8): State + side effects — `useKV` for persistence, `useState`/`useEffect` for local

### State Management
- **Persistence**: `useKV` (Spark KV) — chats, PRs, users, presence, events
- **Local state**: React `useState` — UI panels, dialogs, typing indicators
- **No global store**: No Redux, Zustand, or Context providers
- **Collaboration**: Polling-based presence (5s interval) via `CollaborationService`

### API Integration
- **No REST API**: All data through `window.spark.kv` (key-value)
- **AI**: `window.spark.llm(prompt, 'gpt-4o', true)` for chat responses and translations
- **Auth**: Custom implementation over Spark KV (plaintext passwords in KV store)

---

## API SURFACE

### Frontend Routes (Implicit — No Router)

The app uses **conditional rendering** in App.tsx, not a router:

| View | Condition | Components |
|------|-----------|------------|
| **Auth** | `!isAuthenticated` | `AuthForm` |
| **Dashboard** | `showDashboard` | `MomentumDashboard` |
| **Chat** | `activeChat` selected | `ChatList` + `ChatMessage` + `ChatInput` |
| **PR Review** | `selectedPR` | `PRDialog`, `PRCard` |

### Spark KV Keys (Data Store)

| Key | Type | Purpose |
|-----|------|---------|
| `docflow-users` | `AuthUser[]` | All registered users |
| `docflow-current-user` | `AuthUser` | Current session |
| `chats` | `Chat[]` | All chat threads |
| `pull-requests` | `PullRequest[]` | All PRs |
| `user-presence` | `Record<string, UserPresence>` | Active user presence |
| `collaboration-events` | `CollaborationEvent[]` | Activity feed events |

### OpenAPI Spec (Aspirational — NOT Implemented)

The `openapi.yaml` defines a comprehensive REST API with these endpoint groups, but **none are implemented**:
- `/auth/*` — Authentication (4 endpoints)
- `/chats/*` — Chat CRUD + messages (5 endpoints)
- `/pull-requests/*` — PR lifecycle (7 endpoints)
- `/presence` — Collaboration (2 endpoints)
- `/organization` — Domain/Service/Feature taxonomy (1 endpoint)
- `/ai/*` — Translation, routing assessment (2 endpoints)

---

## DATA MODELS

### Core Types (from `src/lib/types.ts`)

| Type | Fields | Purpose |
|------|--------|---------|
| **User** | id, name, avatarUrl, role (`technical`\|`business`), email | Runtime user |
| **AuthUser** | extends User + password, createdAt | Stored credentials |
| **Chat** | id, title, messages[], participants[], domain?, service?, feature? | Conversation thread |
| **Message** | id, chatId, content, role (`user`\|`assistant`), timestamp, fileChanges?, translations? | Chat message |
| **PullRequest** | id, title, description, chatId, author, status, fileChanges[], comments[], approvals[] | Review workflow |
| **FileChange** | path, additions[], deletions[], status (`pending`\|`staged`\|`committed`), lineComments? | Diff unit |
| **LineComment** | id, fileId, lineNumber, lineType, author, content, resolved, replies?, reactions? | Inline review comment |
| **UserPresence** | userId, userName, activeChat, lastSeen, isTyping, typingChatId | Real-time presence |
| **CollaborationEvent** | id, type (7 variants), userId, chatId?, prId?, timestamp | Activity log |
| **MessageTranslation** | role, segments[] | Role-based explanation of technical/business content |
| **TranslatedSegment** | originalText, startIndex, endIndex, explanation, context, simplifiedText? | Individual translated term |
| **EmojiReaction** | emoji, userIds[], userNames[] | Reaction on comments |
| **PRComment** | id, prId, author, content, timestamp | PR-level comment |
| **PRStatus** | `open` \| `merged` \| `closed` \| `draft` | PR lifecycle state |

---

## INTEGRATION POINTS

### Backend Dependencies
- **GitHub Spark Runtime** — The ONLY backend. Provides KV storage, LLM access, and auth context
- **No external API calls** — All data is local to Spark KV
- **Octokit SDK** — Declared as dependency (`octokit: ^4.1.2`, `@octokit/core: ^6.1.4`) but no observed usage in source code

### External Services
- **DiceBear API** — User avatar generation: `https://api.dicebear.com/7.x/initials/svg?seed={name}`
- **GPT-4o** — Via `window.spark.llm()` for chat AI and document translation

### Planned Backend (from openapi.yaml + API-README)
- REST API at `api.bmad.example.com/v1`
- Bearer token / cookie auth
- Would replace Spark KV with proper database
- Not yet built

---

## TECHNICAL DEBT SIGNALS

### Critical

1. **App.tsx is a God Component (661 LOC)**  
   All application routing, state orchestration, event handlers, and layout logic lives in one file. An `App.refactored.tsx` exists but is NOT wired in.  
   *Evidence:* `wc -l src/App.tsx` → 661, `main.tsx` imports `App` not `App.refactored`

2. **Plaintext Passwords in KV Store**  
   `auth.ts` stores `password` field directly in Spark KV with no hashing. The `AuthUser` type includes `password: string`.  
   *Evidence:* `src/lib/auth.ts:30` → `window.spark.kv.set(USERS_KEY, users)` with raw password

3. **No Tests**  
   Zero test files in the entire repository. No test runner configured. No CI pipeline.  
   *Evidence:* `find -name "*.test.*" -o -name "*.spec.*"` returns empty

4. **No Router**  
   All navigation is via conditional rendering in App.tsx. No URL-based routing, no deep linking, no back/forward navigation support.  
   *Evidence:* No `react-router` in dependencies, App.tsx uses `showDashboard`/`activeChat` state variables

### High

5. **Polling-Based Collaboration (Not Real-Time)**  
   Presence updates every 5 seconds via `setInterval` + KV reads. This won't scale with users.  
   *Evidence:* `collaboration.ts:20` → `window.setInterval(() => this.updatePresence(), 5000)`

6. **Three.js Dependency with No Usage**  
   `three: ^0.175.0` declared in dependencies but no `.tsx`/`.ts` file imports it.  
   *Evidence:* `grep -rn "three" src/` returns no import statements

7. **Stale Refactored App**  
   `App.refactored.tsx` exists alongside `App.tsx` but is unused. Unclear if it's ahead or behind current.  
   *Evidence:* `main.tsx` imports `./App.tsx`, not `./App.refactored.tsx`

8. **Undifferentiated Package Name**  
   `package.json` → `"name": "spark-template"` — still using scaffold name.  
   *Evidence:* `package.json:2`

### Medium

9. **No Error Handling on LLM Calls**  
   `AIService` calls `JSON.parse(response)` on raw LLM output with no try/catch or validation.  
   *Evidence:* `ai.service.ts:56` → `return JSON.parse(response)` without error handling

10. **Dependabot PRs Accumulating**  
    5 open dependabot branches for `framer-motion`, `globals`, `lucide-react`, `marked`, `react-dom` — not being merged.  
    *Evidence:* `git branch -a` shows 5 `remotes/origin/dependabot/` branches

11. **No Environment Configuration**  
    No `.env` files, no environment variable handling, hard-coded Spark runtime config.  
    *Evidence:* `runtime.config.json` has hard-coded app ID

---

## RISKS & UNKNOWNS

| Risk | Severity | Detail |
|------|----------|--------|
| **Platform Lock-In** | **CRITICAL** | 100% dependent on GitHub Spark. `window.spark.kv` and `window.spark.llm` are the only data layer. Migration to standalone requires building entire backend. |
| **Security** | **CRITICAL** | Plaintext passwords. No RBAC enforcement (role is UI-only, not validated server-side). No CSRF/XSS protections beyond React defaults. |
| **Scalability** | **HIGH** | KV store is a flat list (e.g., all chats in one key). No pagination, indexing, or query capability. Collaboration via 5s polling. |
| **Data Loss** | **HIGH** | Single KV store, no backup, no versioning, no conflict resolution for concurrent writes. |
| **Spark Platform Stability** | **MEDIUM** | `@github/spark` is versioned `>=0.43.1 <1` — pre-1.0 with potential breaking changes. |
| **Backend Gap** | **MEDIUM** | OpenAPI spec defines a full REST API that doesn't exist. PRD commits to features requiring server-side enforcement (commitment hierarchy, routing validation) that are currently client-side only. |
| **No CI/CD** | **MEDIUM** | No GitHub Actions, no build verification, no deployment automation. Only Dependabot for deps. |
| **Three.js Unknown** | **LOW** | Large dependency (Three.js) with no visible usage. May be planned for future 3D visualization or was added speculatively. |

---

## METRICS SUMMARY

| Metric | Value |
|--------|-------|
| Total Files | 114 |
| Source Files (TS/TSX) | 92 |
| Total Lines of Code | 10,615 |
| Feature Components | 21 |
| UI Primitives (shadcn) | 46 |
| Custom Hooks | 8 |
| Service Classes | 4 |
| TypeScript Types/Interfaces | 14 |
| Spark KV Keys | 6 |
| LLM Call Sites | 3 |
| Test Files | 0 |
| CI Pipelines | 0 |

---

*Report generated by Scout — BMAD Deep Service Discovery*  
*All claims traced to actual files and git history*
