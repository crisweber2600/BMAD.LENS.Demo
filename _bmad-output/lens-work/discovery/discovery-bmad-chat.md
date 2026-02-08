# Discovery Report: bmad-chat

---
repo: bmad-chat
remote: https://github.com/crisweber2600/bmad-chat.git
branch: main
commit: 726592167a1247c1a75baa0a214a0bca5468aa8f
timestamp: 2026-02-07T12:00:00Z
domain: BMAD
service: CHAT
scanner: SCOUT DS (Deep Brownfield Discovery)
confidence: 0.88
---

## Overview / Business Purpose

bmad-chat is a **React-based collaboration UI** for the BMAD platform. It provides a ChatGPT-like interface backed by the GitHub Copilot SDK, supporting multi-user persistent chat with role-based personas (technical vs. business users). Changes from chats are managed as markdown files in the backend, with an internal pull request workflow for document review and approval. The app supports real-time collaboration, inline commenting, file previews, emoji reactions, document translation, and a momentum dashboard.

This is a **GitHub Spark** application — it uses the `@github/spark` runtime framework.

## Technology Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 19.x | UI framework (via `react-dom`) |
| TypeScript | ES2020 target | Type-safe frontend code |
| Vite | — | Build tool & dev server |
| Tailwind CSS | v4 | Styling (`@tailwindcss/vite`) |
| Radix UI | Multiple packages | Accessible component primitives |
| Framer Motion | ^12.6.2 | Animations |
| TanStack React Query | ^5.83.1 | Server state management |
| D3.js | ^7.9.0 | Data visualization |
| Zod | — | Schema validation |
| react-hook-form | — | Form management |
| marked | ^15.0.7 | Markdown rendering |
| Sonner | — | Toast notifications |
| GitHub Spark | >=0.43.1 | Runtime platform |
| Octokit | ^6.1.4 | GitHub API integration |

## Project Structure Map

```
bmad-chat/
├── src/
│   ├── App.tsx                      # Main application component (monolithic)
│   ├── App.refactored.tsx           # Refactored version (WIP)
│   ├── ErrorFallback.tsx            # Error boundary fallback
│   ├── index.css                    # Global styles
│   ├── components/
│   │   ├── ActiveUsers.tsx          # Real-time presence
│   │   ├── ActivityFeed.tsx         # Activity stream
│   │   ├── AuthForm.tsx             # Sign in/up forms
│   │   ├── ChatInput.tsx            # Chat message input
│   │   ├── ChatList.tsx             # Chat history list
│   │   ├── ChatMessage.tsx          # Message display
│   │   ├── CreatePRDialog.tsx       # PR creation UI
│   │   ├── DocumentTranslationView.tsx # Role-based doc translation
│   │   ├── EmojiReactionPicker.tsx  # Emoji reactions
│   │   ├── FileDiffViewer.tsx       # File diff display
│   │   ├── InlineCommentThread.tsx  # Line-level comments
│   │   ├── MomentumDashboard.tsx    # Project metrics
│   │   ├── NewChatDialog.tsx        # New chat creation
│   │   ├── PRCard.tsx / PRDialog.tsx # Pull request UI
│   │   ├── TranslateButton.tsx      # Document translation trigger
│   │   ├── TypingIndicator.tsx      # Real-time typing
│   │   └── ui/                      # 40+ Radix/shadcn UI primitives
│   ├── hooks/
│   │   ├── use-auth.ts              # Authentication state
│   │   ├── use-chat-actions.ts      # Chat operations
│   │   ├── use-chats.ts             # Chat data management
│   │   ├── use-collaboration.ts     # Real-time collaboration
│   │   ├── use-pending-changes.ts   # Unsaved change tracking
│   │   ├── use-pull-requests.ts     # PR management
│   │   └── use-ui-state.ts          # UI state management
│   └── lib/
│       ├── auth.ts                  # Auth utilities
│       ├── collaboration.ts         # Collaboration logic
│       ├── constants.ts             # App constants
│       ├── types.ts                 # TypeScript type definitions
│       └── services/
│           ├── ai.service.ts        # AI/Copilot integration
│           ├── chat.service.ts      # Chat backend service
│           ├── line-comment.service.ts # Inline commenting service
│           ├── pr.service.ts        # Pull request service
│           └── index.ts             # Service barrel export
├── openapi.yaml                     # OpenAPI schema (generated from frontend)
├── package.json                     # Dependencies & scripts
├── components.json                  # shadcn/ui component config
├── runtime.config.json              # Spark runtime config
├── spark.meta.json                  # Spark metadata
├── PRD.md                           # Product Requirements Document
├── REFACTORING.md                   # Refactoring notes
└── API-README.md                    # API documentation
```

## Architecture Pattern Analysis

- **Pattern:** Single-Page Application (SPA) with service layer
- **State Management:** Custom React hooks pattern (no Redux/Zustand) — `use-auth`, `use-chats`, `use-collaboration`, etc.
- **Service Layer:** Dedicated service files in `lib/services/` for API communication
- **Component Library:** shadcn/ui primitives (40+ Radix-based components) in `components/ui/`
- **Real-time:** Collaboration hooks suggest WebSocket/SSE for typing indicators and active users
- **Auth:** Custom auth form with `use-auth` hook
- **AI Integration:** `ai.service.ts` for Copilot SDK communication
- **PR Workflow:** Internal PR management (create, review, merge) within the app UI

**Key architectural concerns:**
- `App.tsx` is the main monolithic component — `App.refactored.tsx` exists suggesting a refactoring effort is in progress
- No routing library detected — appears to be a single-view app with dialogs/panels
- No test files in the repository

**Key files:**
- `src/App.tsx` — Main application (monolithic)
- `openapi.yaml` — API contract definition
- `src/lib/services/` — Service layer (ai, chat, pr, line-comment)
- `src/hooks/` — State management hooks

## Git Activity Summary

| Metric | Value |
|---|---|
| Total Commits | 16 |
| Commits (6 months) | 16 |
| First Commit | 2026-02-05 |
| Last Commit | 2026-02-06 |
| Active Days | 2 days |
| Contributors | 1 (Cris Weber) |

**Activity Status:** 🟡 NASCENT — All 16 commits in 2 days. This is a brand-new prototype generated largely via GitHub Spark.

### Contributors

| Contributor | Commits | Role |
|---|---|---|
| Cris Weber | 16 | Sole developer (via Spark) |

## Commit Categories

| Category | Count | Percentage |
|---|---|---|
| Generated by Spark | 12 | 75% |
| Other | 4 | 25% |

**Notable:** 75% of commits are "Generated by Spark" — this app was built primarily through AI-assisted code generation prompts. Commit messages describe the desired feature rather than following conventional commit format.

**Key features added via Spark:**
- Chat interface with Copilot SDK backend
- Multi-user authentication (signup/signin)
- Real-time collaboration
- File preview and inline commenting
- Emoji reactions
- Document translation for role-based understanding
- Mobile-friendly responsive design
- Pull request workflow
- Brainstorming session integration

## Key Dependencies

| Package | Purpose |
|---|---|
| `@github/spark` | Runtime platform |
| `@tanstack/react-query` | Async state management |
| `react-hook-form` + `zod` | Form handling & validation |
| `@radix-ui/*` (27 packages) | Accessible UI primitives |
| `framer-motion` | Animation library |
| `d3` | Data visualization |
| `marked` | Markdown rendering |
| `@octokit/core` | GitHub API client |

## Integration Points

1. **bmadServer** — Backend API (same CHAT domain/service)
2. **GitHub Copilot SDK** — AI agent integration via `ai.service.ts`
3. **GitHub Spark** — Runtime platform and deployment
4. **OpenAPI** — Contract defined in `openapi.yaml`
5. **GitHub OAuth** — Authentication via `@octokit/core`

## Technical Debt Signals

| Signal | Severity | Evidence |
|---|---|---|
| No tests | HIGH | Zero test files in the repository |
| Monolithic App.tsx | MEDIUM | Single large component; `App.refactored.tsx` exists but is WIP |
| Spark-generated code | MEDIUM | 75% of commits are AI-generated without conventional structure |
| No routing | MEDIUM | Single-view app — will need router as features grow |
| No CI/CD | HIGH | No GitHub Actions, no build validation |
| 40+ UI primitives | LOW | Large shadcn component surface may include unused components |
| REFACTORING.md exists | LOW | Acknowledged refactoring needs |
| Package name "spark-template" | LOW | Generic template name not renamed |

## Risks and Unknowns

1. **Backend dependency unclear** — This frontend references `bmadServer` but the integration pattern (REST vs SignalR) isn't fully established
2. **Spark platform lock-in** — Depends on `@github/spark` which is a pre-1.0 framework
3. **No offline capability** — Real-time features depend on server connection
4. **Security** — Auth implementation needs review; JWT handling in frontend services
5. **Scalability** — Mock service layer may not handle production load patterns
6. **Code quality** — Spark-generated code may have inconsistencies or dead code

## Confidence Score: 0.88

High confidence on structure and tech stack. Lower confidence on actual functionality completeness given the rapid Spark-generated nature and lack of tests.
