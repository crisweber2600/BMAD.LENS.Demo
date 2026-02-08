# bmad-chat → bmadServer Migration Map

> **Generated**: SCOUT Analyze Codebase + Generate Docs Workflow  
> **System**: LENS Discovery System  
> **Status**: BMAD-Ready Documentation

---

## Migration Overview

This document maps the complete migration path from bmad-chat's current GitHub Spark browser-only SPA to a full-stack client-server architecture backed by bmadServer (.NET Aspire). The current system has **zero backend infrastructure** — all data lives in Spark KV (browser-scoped key-value storage), authentication uses plaintext passwords stored client-side, and there is no API layer. The target state implements a proper REST API (27 endpoints defined in `openapi.yaml`), PostgreSQL persistence via EF Core, JWT/OAuth2 authentication via ASP.NET Identity, and real-time collaboration via SignalR.

**Migration Complexity**: High — this is not a lift-and-shift but a **ground-up architectural transformation** from a browser prototype to a production-grade distributed system.

---

## Technology Migration Matrix

### Platform & Infrastructure

| Component | Current (Spark SPA) | Target (bmadServer) | Migration Path |
|-----------|---------------------|---------------------|----------------|
| **Runtime** | GitHub Spark (browser sandbox) | .NET 9 Aspire + React 19 | Platform shift |
| **Backend** | None (zero server) | ASP.NET Core minimal APIs | Greenfield build |
| **Database** | Spark KV (6 keys, browser-local) | PostgreSQL / EF Core 9 | Data export + schema design |
| **Auth** | Plaintext passwords in KV | JWT + ASP.NET Identity | Complete replacement |
| **API Layer** | Static service classes (in-proc) | REST API (27 endpoints) | Service → HTTP client |
| **State Mgmt** | React useState + KV reads | React Query + Zustand | Refactor hooks |
| **Real-time** | Polling / none | SignalR WebSocket hubs | New capability |
| **Build** | Vite 7 + SWC | Vite 7 (preserved) + .NET build | Add backend pipeline |
| **Hosting** | GitHub Spark CDN | Azure Container Apps via Aspire | New deployment |
| **Package Mgr** | npm (package-lock.json) | npm + NuGet (.NET) | Add NuGet layer |
| **TypeScript** | ~5.7 | ~5.7 (preserved) | No change |
| **UI Framework** | Radix UI + Tailwind 4 | Radix UI + Tailwind 4 (preserved) | No change |

### Key Library Versions (Current)

| Library | Version | Migration Impact |
|---------|---------|------------------|
| `react` | ^19.0.0 | Retained |
| `@tanstack/react-query` | ^5.83.1 | Already present — wire to real API |
| `react-hook-form` + `zod` | ^7.54.2 / ^3.25.76 | Retained for form validation |
| `@github/spark` | >=0.43.1 | **Remove** — replace KV with API calls |
| `d3` / `recharts` | ^7.9.0 / ^2.15.1 | Retained for visualizations |
| `framer-motion` | ^12.6.2 | Retained for animations |

---

## Architecture Transformation

### Current Architecture (Browser-Only)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CURRENT: GitHub Spark Browser Sandbox                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                        React 19 SPA                                   │   │
│  │                                                                       │   │
│  │  App.tsx ──▶ Components ──▶ Service Classes ──▶ Spark KV Store       │   │
│  │     │            │              │                    │                │   │
│  │     │     ┌──────┴──────┐  ┌───┴────────┐    ┌─────┴──────┐        │   │
│  │     │     │ ChatList    │  │ ChatService│    │ KV Keys:   │        │   │
│  │     │     │ ChatMessage │  │ PRService  │    │ docflow-   │        │   │
│  │     │     │ PRCard      │  │ AIService  │    │  users     │        │   │
│  │     │     │ AuthForm    │  │ LineComment│    │  current-  │        │   │
│  │     │     │ PRDialog    │  │  Service   │    │  user      │        │   │
│  │     │     │ ActiveUsers │  └────────────┘    │  chats     │        │   │
│  │     │     │ FileDiff    │                    │  pull-reqs │        │   │
│  │     │     │ Momentum    │                    │  collab    │        │   │
│  │     │     └─────────────┘                    │  presence  │        │   │
│  │     │                                        └────────────┘        │   │
│  │  ┌──┴────────────────┐                                              │   │
│  │  │ auth.ts           │  ◀── Plaintext password comparison           │   │
│  │  │ signUp/signIn     │      Users array in single KV key            │   │
│  │  └───────────────────┘                                              │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ⚠ NO SERVER  ⚠ NO DATABASE  ⚠ NO AUTH SERVER  ⚠ NO API                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Target Architecture (Full-Stack Client-Server)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    TARGET: .NET Aspire + React 19                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────┐    ┌──────────────────────────────────┐   │
│  │     FRONTEND (React 19)     │    │      BACKEND (bmadServer)        │   │
│  │                             │    │                                  │   │
│  │  Components ◀──▶ Hooks      │    │  ┌────────────────────────────┐ │   │
│  │       │            │        │    │  │    API Controllers         │ │   │
│  │       │     ┌──────┴─────┐  │    │  │  AuthController           │ │   │
│  │       │     │ React Query│  │    │  │  ChatController           │ │   │
│  │       │     │ useChats() │──┼──▶─┼──│  UsersController          │ │   │
│  │       │     │ usePRs()   │  │HTTP│  │  TranslationsController   │ │   │
│  │       │     │ useAuth()  │  │REST│  │  DecisionsController      │ │   │
│  │       │     └────────────┘  │    │  │  WorkflowsController      │ │   │
│  │       │                     │    │  └───────────┬────────────────┘ │   │
│  │  ┌────┴──────────────┐      │    │              │                  │   │
│  │  │ Zustand Store     │      │    │  ┌───────────┴────────────────┐ │   │
│  │  │ • auth state      │      │    │  │    Services / EF Core      │ │   │
│  │  │ • UI state        │      │    │  │  ChatService               │ │   │
│  │  │ • optimistic      │      │    │  │  PRService                 │ │   │
│  │  └───────────────────┘      │    │  │  CollaborationService      │ │   │
│  │                             │    │  │  TranslationService        │ │   │
│  │  ┌───────────────────┐      │    │  └───────────┬────────────────┘ │   │
│  │  │ SignalR Client    │◀─────┼─WS─┼──▶ SignalR Hub                 │   │
│  │  │ • typing events   │      │    │                                  │   │
│  │  │ • presence        │      │    │  ┌────────────────────────────┐ │   │
│  │  │ • live messages   │      │    │  │    PostgreSQL (EF Core)    │ │   │
│  │  └───────────────────┘      │    │  │  Users, Chats, Messages   │ │   │
│  └─────────────────────────────┘    │  │  PullRequests, Events     │ │   │
│                                      │  └────────────────────────────┘ │   │
│                                      └──────────────────────────────────┘   │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                    .NET Aspire Orchestration                          │   │
│  │  AppHost ──▶ ApiService (8080) + Frontend (5173) + PostgreSQL       │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Backend Layer Mapping

### KV Service → REST API Controller Mapping

| Spark Service Class | KV Key | Target Controller | Target Entity |
|---------------------|--------|-------------------|---------------|
| `auth.ts` → `signUp()` | `docflow-users` | `AuthController.SignUp()` | `User` |
| `auth.ts` → `signIn()` | `docflow-users` | `AuthController.SignIn()` | JWT token |
| `auth.ts` → `getCurrentUser()` | `docflow-current-user` | `AuthController.GetMe()` | `User` |
| `auth.ts` → `signOut()` | `docflow-current-user` | `AuthController.SignOut()` | Session |
| `ChatService.createChat()` | `docflow-chats` | `ChatController.Create()` | `Chat` |
| `ChatService.createMessage()` | `docflow-chats` | `ChatController.SendMessage()` | `Message` |
| `pr.service.ts` | `docflow-pull-requests` | `DecisionsController` | `PullRequest` |
| `ai.service.ts` | (in-memory) | `TranslationsController` | `Translation` |
| `line-comment.service.ts` | `docflow-pull-requests` | `DecisionsController` | `LineComment` |
| `collaboration.ts` | `docflow-presence` | `UsersController/Hubs` | `Presence` |

### Current KV Storage Schema

```typescript
// Current: All data packed into 6 Spark KV keys
// ──────────────────────────────────────────────
// KEY: "docflow-users"        → AuthUser[] (all users, passwords in plain text)
// KEY: "docflow-current-user" → AuthUser   (logged-in user, full object with password)
// KEY: "docflow-chats"        → Chat[]     (all chats with embedded messages[])
// KEY: "docflow-pull-requests" → PullRequest[] (all PRs with embedded fileChanges[])
// KEY: "docflow-collab-events" → CollaborationEvent[] (activity feed)
// KEY: "docflow-presence"      → UserPresence[] (who's online)

// Example KV write — entire users array rewritten on every signup:
const users = await window.spark.kv.get<AuthUser[]>('docflow-users')
users.push(newUser)      // ← password stored as plaintext string
await window.spark.kv.set('docflow-users', users)
```

### Target PostgreSQL Schema (EF Core)

```csharp
// Target: Normalized relational schema with proper identity
// ──────────────────────────────────────────────────────────
public class User {
    public Guid Id { get; set; }
    public string Email { get; set; }      // Unique index
    public string PasswordHash { get; set; } // BCrypt, never plaintext
    public string Name { get; set; }
    public UserRole Role { get; set; }      // enum: Technical, Business
    public DateTime CreatedAt { get; set; }
}

public class Chat {
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string? Domain { get; set; }
    public string? Service { get; set; }
    public string? Feature { get; set; }
    public List<Message> Messages { get; set; }       // Navigation
    public List<ChatParticipant> Participants { get; set; } // Join table
}

public class Message {
    public Guid Id { get; set; }
    public Guid ChatId { get; set; }        // FK → Chat
    public string Content { get; set; }
    public MessageRole Role { get; set; }   // User | Assistant
    public Guid? UserId { get; set; }       // FK → User (null for AI)
    public DateTime Timestamp { get; set; }
    public List<FileChange> FileChanges { get; set; }
}
```

---

## Frontend Layer Mapping

### Service Class → API Client Hook Migration

| Current Service | Current Pattern | Target Hook | Target Pattern |
|-----------------|-----------------|-------------|----------------|
| `auth.ts` `signUp()` | `spark.kv.set(USERS_KEY, users)` | `useSignUp()` | `POST /auth/signup` → JWT |
| `auth.ts` `signIn()` | `spark.kv.get` + plaintext compare | `useSignIn()` | `POST /auth/signin` → JWT |
| `auth.ts` `signOut()` | `spark.kv.delete(CURRENT_USER_KEY)` | `useSignOut()` | `POST /auth/signout` + clear token |
| `ChatService.createChat()` | Return in-memory object | `useCreateChat()` | `POST /chats` |
| `ChatService.createMessage()` | Return in-memory object | `useSendMessage()` | `POST /chats/{id}/messages` |
| `ChatService.extractOrganization()` | Iterate chats in memory | `useDomains()` | `GET /organization/domains` |
| `pr.service.ts` | KV read/write PRs array | `usePullRequests()` | `GET /pull-requests` |
| `ai.service.ts` | Direct AI call | `useTranslate()` | `POST /chats/{id}/messages/{id}/translate` |
| `line-comment.service.ts` | Mutate PR in KV | `useLineComments()` | `POST /pull-requests/{id}/files/{id}/comments` |

### State Management Transformation

```typescript
// ═══════════════════════════════════════════════════════════
// BEFORE: Direct KV reads in components (no caching, no sync)
// ═══════════════════════════════════════════════════════════
const [chats, setChats] = useState<Chat[]>([])
const [loading, setLoading] = useState(true)

useEffect(() => {
  spark.kv.get<Chat[]>('docflow-chats').then(data => {
    setChats(data || [])
    setLoading(false)
  })
}, [])

// ═══════════════════════════════════════════════════════════
// AFTER: React Query with server state + optimistic updates
// ═══════════════════════════════════════════════════════════
const { data: chats, isLoading } = useQuery({
  queryKey: ['chats', { domain, service }],
  queryFn: () => chatApi.list({ domain, service, limit: 50 }),
  staleTime: 30_000,
})

const createChat = useMutation({
  mutationFn: chatApi.create,
  onMutate: async (newChat) => {
    await queryClient.cancelQueries({ queryKey: ['chats'] })
    const previous = queryClient.getQueryData(['chats'])
    queryClient.setQueryData(['chats'], (old) => [...old, newChat])
    return { previous }
  },
  onError: (err, vars, context) => {
    queryClient.setQueryData(['chats'], context.previous)
  },
  onSettled: () => queryClient.invalidateQueries({ queryKey: ['chats'] }),
})
```

---

## API Endpoint Migration

### Complete Endpoint Inventory (27 endpoints from openapi.yaml)

#### Authentication (4 endpoints)

| # | Method | Endpoint | Current Implementation | Target Controller |
|---|--------|----------|------------------------|-------------------|
| 1 | `POST` | `/auth/signup` | `auth.ts` → KV array append | `AuthController.SignUp` |
| 2 | `POST` | `/auth/signin` | `auth.ts` → plaintext match | `AuthController.SignIn` |
| 3 | `POST` | `/auth/signout` | `auth.ts` → KV delete key | `AuthController.SignOut` |
| 4 | `GET` | `/auth/me` | `auth.ts` → KV get user | `AuthController.GetMe` |

#### Users & Presence (3 endpoints)

| # | Method | Endpoint | Current Implementation | Target Controller |
|---|--------|----------|------------------------|-------------------|
| 5 | `GET` | `/users/{userId}` | N/A (inline lookup) | `UsersController.GetById` |
| 6 | `PUT` | `/users/{userId}/presence` | `collaboration.ts` | `UsersController.UpdatePresence` |
| 7 | `GET` | `/presence` | KV `docflow-presence` | `UsersController.GetActive` |

#### Chats (4 endpoints)

| # | Method | Endpoint | Current Implementation | Target Controller |
|---|--------|----------|------------------------|-------------------|
| 8 | `GET` | `/chats` | KV `docflow-chats` | `ChatController.List` |
| 9 | `POST` | `/chats` | `ChatService.createChat()` | `ChatController.Create` |
| 10 | `GET` | `/chats/{chatId}` | Array.find in KV data | `ChatController.GetById` |
| 11 | `PATCH` | `/chats/{chatId}` | Mutate KV array | `ChatController.Update` |
| 12 | `DELETE` | `/chats/{chatId}` | Filter KV array | `ChatController.Delete` |

#### Messages (2 endpoints)

| # | Method | Endpoint | Current Implementation | Target Controller |
|---|--------|----------|------------------------|-------------------|
| 13 | `GET` | `/chats/{chatId}/messages` | Embedded in Chat.messages[] | `ChatController.ListMessages` |
| 14 | `POST` | `/chats/{chatId}/messages` | `ChatService.createMessage()` | `ChatController.SendMessage` |

#### AI / Translation (2 endpoints)

| # | Method | Endpoint | Current Implementation | Target Controller |
|---|--------|----------|------------------------|-------------------|
| 15 | `POST` | `/chats/{id}/messages/{id}/translate` | `ai.service.ts` inline | `TranslationsController` |
| 16 | `POST` | `/ai/defaults` | `ai.service.ts` inline | `TranslationsController` |

#### Pull Requests (7 endpoints)

| # | Method | Endpoint | Current Implementation | Target Controller |
|---|--------|----------|------------------------|-------------------|
| 17 | `GET` | `/pull-requests` | KV `docflow-pull-requests` | `DecisionsController.List` |
| 18 | `POST` | `/pull-requests` | `pr.service.ts` | `DecisionsController.Create` |
| 19 | `GET` | `/pull-requests/{prId}` | Array.find | `DecisionsController.GetById` |
| 20 | `PATCH` | `/pull-requests/{prId}` | Mutate KV array | `DecisionsController.Update` |
| 21 | `POST` | `/pull-requests/{prId}/merge` | Status flip in KV | `DecisionsController.Merge` |
| 22 | `POST` | `/pull-requests/{prId}/close` | Status flip in KV | `DecisionsController.Close` |
| 23 | `POST` | `/pull-requests/{prId}/approve` | Push userId to approvals[] | `DecisionsController.Approve` |

#### PR Comments & Line Comments (4 endpoints)

| # | Method | Endpoint | Current Implementation | Target Controller |
|---|--------|----------|------------------------|-------------------|
| 24 | `GET` | `/pull-requests/{prId}/comments` | Embedded in PR | `DecisionsController` |
| 25 | `POST` | `/pull-requests/{prId}/comments` | `pr.service.ts` | `DecisionsController` |
| 26 | `POST` | `/pull-requests/{prId}/files/{fId}/comments` | `line-comment.service.ts` | `DecisionsController` |
| 27 | `POST` | `/pull-requests/{prId}/files/{fId}/comments/{cId}/resolve` | Toggle in KV | `DecisionsController` |

#### Collaboration & Organization (5 endpoints)

| # | Method | Endpoint | Current Implementation | Target Controller |
|---|--------|----------|------------------------|-------------------|
| 28 | `GET` | `/collaboration/events` | KV `docflow-collab-events` | `WorkflowsController` |
| 29 | `POST` | `/collaboration/events` | KV append | `WorkflowsController` |
| 30 | `GET` | `/organization/domains` | `ChatService.extractOrg()` | `ChatController` |
| 31 | `GET` | `/organization/services` | `ChatService.extractOrg()` | `ChatController` |
| 32 | `GET` | `/organization/features` | `ChatService.extractOrg()` | `ChatController` |

#### System (1 endpoint)

| # | Method | Endpoint | Current | Target |
|---|--------|----------|---------|--------|
| 33 | `GET` | `/health` | N/A | `Program.cs` health check |

> **Note**: The openapi.yaml defines 27 unique path operations plus the emoji reaction toggle and health check, totaling 33 addressable endpoints across 8 domains.

---

## Data Model Migration

### KV Document → PostgreSQL Entity Mapping

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    KV DOCUMENTS → RELATIONAL ENTITIES                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  KV: "docflow-users" (AuthUser[])                                           │
│  ┌─────────────────────┐         ┌──────────────────────────────┐           │
│  │ { id, email,        │         │ TABLE: Users                 │           │
│  │   password, ← PLAIN │───▶     │ Id (Guid PK)                │           │
│  │   name, role,       │         │ Email (unique index)         │           │
│  │   avatarUrl,        │         │ PasswordHash (bcrypt)        │           │
│  │   createdAt }       │         │ Name, Role, AvatarUrl        │           │
│  └─────────────────────┘         │ CreatedAt (DateTimeOffset)   │           │
│                                  └──────────────────────────────┘           │
│                                                                              │
│  KV: "docflow-chats" (Chat[] with embedded Messages[])                      │
│  ┌─────────────────────┐         ┌──────────────────────────────┐           │
│  │ { id, title,        │         │ TABLE: Chats                 │           │
│  │   messages: [...],  │───▶     │ Id, Title, Domain, Service   │           │
│  │   participants,     │         │ Feature, CreatedAt, UpdatedAt│           │
│  │   domain, service,  │         └──────────────────────────────┘           │
│  │   feature }         │                     │ 1:N                          │
│  └─────────────────────┘         ┌──────────────────────────────┐           │
│                                  │ TABLE: Messages              │           │
│                                  │ Id, ChatId (FK), Content     │           │
│                                  │ Role, UserId (FK), Timestamp │           │
│                                  └──────────────────────────────┘           │
│                                              │ 1:N                          │
│                                  ┌──────────────────────────────┐           │
│                                  │ TABLE: FileChanges           │           │
│                                  │ Id, MessageId (FK), Path     │           │
│                                  │ Additions, Deletions, Status │           │
│                                  └──────────────────────────────┘           │
│                                                                              │
│  KV: "docflow-pull-requests" (PullRequest[] with embedded all)              │
│  ┌─────────────────────┐         ┌──────────────────────────────┐           │
│  │ { id, title,        │         │ TABLE: PullRequests          │           │
│  │   fileChanges: [...],│───▶    │ Id, Title, Description       │           │
│  │   comments: [...],  │         │ ChatId (FK), AuthorId (FK)   │           │
│  │   approvals: [...] }│         │ Status, CreatedAt, UpdatedAt │           │
│  └─────────────────────┘         └──────────────────────────────┘           │
│                                              │ 1:N                          │
│                                  ┌──────────────────────────────┐           │
│                                  │ TABLE: PRComments            │           │
│                                  │ Id, PrId (FK), AuthorId (FK) │           │
│                                  │ Content, Timestamp           │           │
│                                  └──────────────────────────────┘           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Type System Changes

| Field | Current (TypeScript) | Target (C# / PostgreSQL) | Rationale |
|-------|----------------------|--------------------------|-----------|
| `id` | `string` (`"user-${Date.now()}"`) | `Guid` (NEWSEQUENTIALID) | Distributed-safe, no collisions |
| `password` | `string` (plaintext) | `string` (BCrypt hash) | Security requirement |
| `createdAt` | `number` (epoch ms) | `DateTimeOffset` | Timezone awareness |
| `role` | `'technical' \| 'business'` | `enum UserRole` | Type safety |
| `status` (PR) | `'open' \| 'merged' \| ...` | `enum PRStatus` | Database enum column |
| `messages` | Embedded `Message[]` in Chat | Separate `Messages` table | Normalization, pagination |
| `fileChanges` | Embedded array in Message | Separate `FileChanges` table | Normalization |
| `approvals` | `string[]` in PR | Join table `PullRequestApprovals` | Relational integrity |
| `participants` | `string[]` in Chat | Join table `ChatParticipants` | Relational integrity |

---

## Authentication Migration

### Current → Target Auth Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│              CURRENT AUTH: Plaintext KV (⚠ INSECURE)                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  AuthForm.tsx                        auth.ts                                │
│  ┌──────────┐     email/password    ┌─────────────────┐                     │
│  │ <form>   │─────────────────────▶ │ signIn()        │                     │
│  │ email    │                       │                 │                     │
│  │ password │                       │ users = await   │                     │
│  └──────────┘                       │   spark.kv.get  │                     │
│                                     │   ('docflow-    │                     │
│          ┌──────────────────────────│    users')      │                     │
│          │  if email === u.email    │                 │                     │
│          │  && password === u.pass  │ ← PLAINTEXT!    │                     │
│          ▼                          └─────────────────┘                     │
│  setCurrentUser(user)   ← Full AuthUser object stored in KV                │
│                           including password field                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼ MIGRATION
┌─────────────────────────────────────────────────────────────────────────────┐
│              TARGET AUTH: JWT + ASP.NET Identity (✓ SECURE)                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  React SPA                          bmadServer API                          │
│  ┌──────────┐     POST /auth/signin ┌─────────────────┐                     │
│  │ AuthForm │──────────────────────▶│ AuthController   │                    │
│  │          │     { email, pass }   │                  │                    │
│  └──────────┘                       │ 1. Find user     │                    │
│       │                             │ 2. BCrypt.Verify │                    │
│       │         JWT token           │ 3. Generate JWT  │                    │
│       │◀────────────────────────────│ 4. Set HttpOnly  │                    │
│       │     { user, token }         │    cookie        │                    │
│       │                             └──────┬───────────┘                    │
│       ▼                                    │                                │
│  Store JWT in memory                       ▼                                │
│  (NOT localStorage)              ┌─────────────────┐                        │
│       │                          │ PostgreSQL       │                        │
│       │    Authorization: Bearer │ Users table      │                        │
│       │──────────────────────────│ PasswordHash     │                        │
│       │    (every API request)   │ RefreshTokens    │                        │
│                                  └─────────────────┘                        │
│  ┌─────────────────────────────────────────────────────────────────┐        │
│  │ Token Refresh Flow:                                              │        │
│  │ JWT expires (15min) → refresh token (7d) → new JWT              │        │
│  │ Refresh token stored as HttpOnly cookie, rotated on use         │        │
│  └─────────────────────────────────────────────────────────────────┘        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Auth Code Transformation

```typescript
// ══════════════════════════════════════════════════════
// BEFORE: auth.ts — plaintext password in KV
// ══════════════════════════════════════════════════════
export async function signIn(email: string, password: string): Promise<AuthUser> {
  const users = await window.spark.kv.get<AuthUser[]>('docflow-users')
  const user = users.find(u => u.email === email && u.password === password)
  if (!user) throw new Error('Invalid email or password')
  return user  // ← returns object with password field!
}

// ══════════════════════════════════════════════════════
// AFTER: useAuth hook → REST API → JWT
// ══════════════════════════════════════════════════════
export function useSignIn() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ email, password }: SignInRequest) => {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',  // HttpOnly cookie
      })
      if (!res.ok) throw new ApiError(await res.json())
      return res.json() as Promise<{ user: User; token: string }>
    },
    onSuccess: ({ user, token }) => {
      setAuthToken(token)  // In-memory only, never localStorage
      queryClient.setQueryData(['auth', 'me'], user)
    },
  })
}
```

---

## Frontend Component Migration

### Component → API Integration Requirements

| Component | Current Data Source | API Endpoints Needed | Migration Effort |
|-----------|-------------------|----------------------|------------------|
| `AuthForm.tsx` | `auth.ts` → KV | `/auth/signup`, `/auth/signin` | Medium |
| `ChatList.tsx` | KV `docflow-chats` | `GET /chats` | Low |
| `ChatMessage.tsx` | Inline from Chat.messages[] | `GET /chats/{id}/messages` | Low |
| `ChatInput.tsx` | `ChatService.createMessage()` | `POST /chats/{id}/messages` | Medium |
| `NewChatDialog.tsx` | `ChatService.createChat()` | `POST /chats` | Low |
| `PRCard.tsx` | KV `docflow-pull-requests` | `GET /pull-requests` | Low |
| `PRDialog.tsx` | Deep KV reads | `GET /pull-requests/{id}` | Medium |
| `CreatePRDialog.tsx` | `pr.service.ts` | `POST /pull-requests` | Medium |
| `FileDiffViewer.tsx` | Embedded in PR | `GET /pull-requests/{id}` | Low |
| `InlineCommentThread.tsx` | `line-comment.service.ts` | `POST .../comments` | Medium |
| `ActiveUsers.tsx` | KV `docflow-presence` | `GET /presence` + SignalR | High |
| `TypingIndicator.tsx` | KV polling | SignalR hub events | High |
| `ActivityFeed.tsx` | KV `docflow-collab-events` | `GET /collaboration/events` | Medium |
| `MomentumDashboard.tsx` | Computed from KV data | New aggregate API endpoint | High |
| `TranslateButton.tsx` | `ai.service.ts` | `POST .../translate` | Low |
| `DocumentTranslationView.tsx` | `ai.service.ts` | `POST .../translate` | Low |
| `EmojiReactionPicker.tsx` | Mutate PR in KV | `POST .../reactions` | Low |
| `AllFilesPreviewDialog.tsx` | Inline from Message | `GET /pull-requests/{id}` | Low |

### Components Requiring NO Migration (UI-Only)

These components use only props/local state and need no data source changes:

- `ui/*` — shadcn/ui primitives (Button, Dialog, Card, etc.)
- `ErrorFallback.tsx` — React error boundary

---

## Migration Phases

### Phase 1: Foundation & Auth (Weeks 1-4)

```
┌──────────────────────────────────────────────────────────────────┐
│ PHASE 1: Backend Foundation + Auth                                │
├──────────────────────────────────────────────────────────────────┤
│                                                                    │
│  Week 1-2: Backend skeleton                                       │
│  ├── EF Core DbContext + PostgreSQL migrations                    │
│  ├── User, Chat, Message entities                                 │
│  ├── AuthController (signup, signin, signout, me)                 │
│  └── JWT generation + refresh token rotation                      │
│                                                                    │
│  Week 3-4: Frontend auth integration                              │
│  ├── Remove @github/spark dependency                              │
│  ├── Create API client layer (fetch wrapper with JWT)             │
│  ├── useAuth() hook + AuthProvider context                        │
│  └── AuthForm.tsx wired to real endpoints                         │
│                                                                    │
└──────────────────────────────────────────────────────────────────┘
```

| Task | Priority | Effort | Dependencies |
|------|----------|--------|--------------|
| EF Core DbContext + User entity | P0 | 3 days | None |
| AuthController (4 endpoints) | P0 | 3 days | DbContext |
| JWT + refresh token service | P0 | 2 days | AuthController |
| API client fetch wrapper | P0 | 2 days | None |
| `useAuth()` hook + provider | P0 | 2 days | API client |
| AuthForm.tsx integration | P0 | 1 day | useAuth hook |
| Remove `@github/spark` stubs | P1 | 1 day | API client |

### Phase 2: Core Features — Chat & Messages (Weeks 5-10)

| Task | Priority | Effort | Dependencies |
|------|----------|--------|--------------|
| Chat + Message entities + migrations | P0 | 2 days | Phase 1 |
| ChatController (5 endpoints) | P0 | 4 days | Entities |
| Message endpoints (list, send) | P0 | 3 days | ChatController |
| `useChats()` / `useMessages()` hooks | P0 | 3 days | Endpoints |
| ChatList.tsx + ChatMessage.tsx wiring | P0 | 2 days | Hooks |
| ChatInput.tsx + NewChatDialog.tsx | P0 | 2 days | Hooks |
| Organization endpoints (domains/services/features) | P1 | 2 days | ChatController |
| AI translation endpoint integration | P1 | 3 days | Messages |

### Phase 3: PR Workflow & Collaboration (Weeks 11-16)

| Task | Priority | Effort | Dependencies |
|------|----------|--------|--------------|
| PullRequest + FileChange entities | P0 | 2 days | Phase 2 |
| PR controller (7 endpoints) | P0 | 5 days | Entities |
| Line comments + reactions endpoints | P0 | 3 days | PR controller |
| SignalR hub (presence, typing, events) | P0 | 5 days | Phase 2 |
| `usePullRequests()` hook suite | P1 | 3 days | Endpoints |
| PRCard, PRDialog, CreatePRDialog wiring | P1 | 3 days | Hooks |
| ActiveUsers + TypingIndicator → SignalR | P1 | 3 days | SignalR hub |
| ActivityFeed.tsx → collaboration events | P2 | 2 days | SignalR hub |

### Phase 4: Polish, Testing & Cutover (Weeks 17-20)

| Task | Priority | Effort | Dependencies |
|------|----------|--------|--------------|
| MomentumDashboard → aggregate APIs | P1 | 3 days | All endpoints |
| End-to-end Playwright tests | P0 | 5 days | All features |
| Data migration script (KV → PostgreSQL) | P0 | 3 days | All entities |
| Performance optimization (pagination, caching) | P1 | 3 days | All features |
| Aspire deployment config (Container Apps) | P0 | 3 days | All features |
| Security audit (OWASP, auth flows) | P0 | 2 days | Auth complete |
| Go-live cutover | P0 | 1 day | All above |

---

## Risk Assessment

### Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| KV data loss during migration | Medium | High | Export KV data to JSON before any changes; write idempotent import script |
| Auth token incompatibility during transition | Medium | High | Implement dual-mode auth (KV fallback + JWT) during Phase 1 |
| Real-time feature regression (presence/typing) | High | Medium | SignalR hub tested in isolation; graceful degradation to polling |
| Embedded message arrays cause N+1 queries | High | Medium | Use EF Core `.Include()` with pagination; add query projections |
| OpenAPI spec drift vs actual controller implementation | Medium | Medium | Generate TypeScript client from OpenAPI; CI validation |
| `@github/spark` removal breaks build | Low | High | Stub `window.spark.kv` with API-backed implementation first |
| Cold-start latency on Container Apps | Medium | Low | Configure min replicas = 1 for API service |

### Business Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Feature parity gap (missing Spark behaviors) | High | Medium | Document all implicit Spark behaviors before migration |
| User data migration errors | Medium | High | Run migration in staging with validation checksums |
| Extended timeline (>20 weeks) | Medium | Medium | Phase 1-2 deliver usable product; Phase 3-4 are incremental |
| Multi-user conflicts (new with server) | Medium | Medium | Optimistic concurrency with ETag/version columns |

---

## Strangler Fig Strategy

### Progressive Backend Attachment

The migration follows a **strangler fig pattern** where the React frontend progressively replaces KV service calls with REST API calls, one domain at a time.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     STRANGLER FIG: KV → REST API                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Phase 1:    [======= Spark KV 100% ========]                               │
│  (Weeks 1-2)  Auth, Chats, PRs, Collab — all KV                            │
│                                                                              │
│  Phase 1:    [==== KV 75% ====][== API 25% ==]                              │
│  (Weeks 3-4)  Auth migrated to JWT/REST                                     │
│                                                                              │
│  Phase 2:    [= KV 30% =][======= API 70% ========]                        │
│  (Weeks 5-10) Auth + Chats + Messages on REST API                           │
│                                                                              │
│  Phase 3:    [5%][=========== API 95% ============]                         │
│  (Weeks 11-16) PRs + Collab on REST + SignalR                               │
│                                                                              │
│  Phase 4:    [============ API 100% ==============]                         │
│  (Weeks 17-20) KV removed, @github/spark deleted                            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Feature Flag Implementation

```typescript
// Feature flags to enable gradual migration per domain
const migrationFlags = {
  auth: {
    useServerAuth: true,        // Phase 1: first to migrate
    useRefreshTokens: true,
  },
  chats: {
    useServerChats: false,      // Phase 2: flip when ready
    useServerMessages: false,
  },
  pullRequests: {
    useServerPRs: false,        // Phase 3: flip when ready
    useServerComments: false,
  },
  collaboration: {
    useSignalR: false,          // Phase 3: flip when ready
    useServerPresence: false,
  },
}

// Adapter pattern — data source abstraction
export function getChatsProvider(): ChatsProvider {
  return migrationFlags.chats.useServerChats
    ? new RestChatsProvider('/api/chats')    // NEW: REST API
    : new SparkKVChatsProvider()             // OLD: Spark KV
}
```

---

## Success Metrics

| Metric | Current (Spark KV) | Target (bmadServer) | Measurement |
|--------|-------------------|-----------------------|-------------|
| Auth Security | ⛔ Plaintext passwords | ✅ BCrypt + JWT | Security audit |
| Data Persistence | Browser-local KV | PostgreSQL (durable) | Data retention |
| Multi-user Support | ⚠ Single browser only | ✅ Concurrent users | Load test |
| API Response Time | N/A (in-proc) | < 100ms p95 | APM metrics |
| Page Load (LCP) | ~2s (Spark overhead) | < 1s | Lighthouse |
| Bundle Size | ~1.8MB (incl. Spark) | < 800KB | Build output |
| Test Coverage | 0% | > 80% | Jest + Playwright |
| Real-time Latency | Polling (5s delay) | < 200ms (SignalR) | WebSocket metrics |
| Concurrent Users | 1 (browser-only) | 100+ | Load test |
| Data Recovery | ⛔ None (browser clear = data loss) | ✅ Full backup/restore | DR test |
| Uptime SLA | N/A | 99.9% | Azure Monitor |

---

## Related Documentation

- [Architecture](architecture.md) — System architecture and component diagrams
- [API Surface](api-surface.md) — REST API endpoint documentation
- [Data Model](data-model.md) — Entity relationships and schema
- [Integration Map](integration-map.md) — Service dependencies and data flows
- [Onboarding](onboarding.md) — Developer setup and contribution guide

---

*Generated by LENS System — SCOUT Discovery Workflow*
