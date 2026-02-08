# bmad-chat — Deep Technical Analysis
> SCOUT AC Workflow | Generated: 2026-02-07 | Confidence: HIGH (85%)

## 1. Technology Stack

| Component | Technology | Version | Source |
|-----------|-----------|---------|--------|
| Runtime | Node.js | Latest | `package.json` |
| Framework | React | 19.0.0 | `package.json` |
| Build | Vite | 7.2.6 | `package.json` |
| Language | TypeScript | ~5.7.2 | `package.json` |
| Styling | Tailwind CSS | 4.1.11 | `package.json` |
| UI Library | Radix UI | Multiple | 27 `@radix-ui/*` packages |
| Forms | React Hook Form + Zod | 7.54.2 / 3.25.76 | `package.json` |
| Data Fetching | TanStack React Query | 5.83.1 | `package.json` |
| Animation | Framer Motion | 12.6.2 | `package.json` |
| Charts | Recharts + D3 | 2.15.1 / 7.9.0 | `package.json` |
| 3D | Three.js | 0.175.0 | `package.json` |
| Platform | GitHub Spark | >=0.43.1 | `@github/spark` |

**Total Source Files:** 91 TypeScript/TSX files

## 2. API Surface

bmad-chat is a **frontend-only React SPA**. It does NOT expose an API.

### Client-Side API Consumption
| Pattern | Evidence |
|---------|----------|
| TanStack React Query | `@tanstack/react-query` in deps |
| Octokit | `@octokit/core` + `octokit` packages |
| Zod validation | Schema validation on API responses |
| Auth | `src/lib/auth.ts` with avatar URL generation |

### External Services Consumed
- **GitHub API** via Octokit (GitHub Spark platform)
- **bmadServer API** (assumed — backend counterpart)
- **DiceBear API** for avatar generation

## 3. Data Models

### Client-Side Types (`src/lib/types.ts`)
Key type domains (inferred from architecture):
- Chat sessions, messages, participants
- User profiles, authentication state
- Workflow state, checkpoints
- Theme/preferences

### Form Schemas (Zod)
- Request validation schemas via `@hookform/resolvers` + `zod`
- Structured form state management

## 4. Architecture Pattern

**Primary: Component-Based SPA with Feature Modules**

```
App → Pages → Feature Components → UI Primitives (Radix)
              ↘ Hooks (React Query) → API Client
              ↘ Context Providers (Auth, Theme)
              ↘ Lib (types, utils, auth)
```

### Key Directories
| Directory | Purpose |
|-----------|---------|
| `src/components/ui/` | Radix-based UI primitives (carousel, etc.) |
| `src/lib/` | Shared utilities, types, auth |
| `src/hooks/` | Custom React hooks |

### UI Component Library
**27 Radix UI primitives** including: Accordion, AlertDialog, AspectRatio, Avatar, Checkbox, Collapsible, ContextMenu, Dialog, DropdownMenu, HoverCard, Label, Menubar, NavigationMenu, Popover, Progress, RadioGroup, ScrollArea, Select, Separator, Slider, Slot, Switch, Tabs, Toggle, ToggleGroup, Tooltip, Colors

### Additional UI
- `class-variance-authority` + `clsx` + `tailwind-merge` for styling
- `cmdk` for command palette (Ctrl+K-style)
- `embla-carousel-react` for carousels
- `lucide-react` + `@phosphor-icons/react` + `@heroicons/react` for icons
- `vaul` for drawer components
- `sonner` for toast notifications
- `react-resizable-panels` for panel layouts
- `react-day-picker` for date selection
- `input-otp` for OTP input
- `marked` for markdown rendering

## 5. Dependencies

### Production Dependencies (50+)
| Category | Packages | Count |
|----------|----------|-------|
| UI Primitives | `@radix-ui/*` | 27 |
| Icons | `@heroicons/react`, `@phosphor-icons/react`, `lucide-react` | 3 |
| Data | `@tanstack/react-query`, `d3`, `recharts` | 3 |
| Forms | `react-hook-form`, `@hookform/resolvers`, `zod` | 3 |
| Platform | `@github/spark`, `octokit`, `@octokit/core` | 3 |
| Animation | `framer-motion`, `tw-animate-css` | 2 |
| 3D | `three` | 1 |
| Utilities | `date-fns`, `uuid`, `marked`, `clsx` | 4 |

### Dev Dependencies
- ESLint 9.28 + TypeScript ESLint
- Vite 7.2.6 + `@vitejs/plugin-react-swc`
- Tailwind CSS 4.1.11 + `@tailwindcss/postcss` + `@tailwindcss/vite`

## 6. Integration Points

| Integration | Type | Evidence |
|-------------|------|----------|
| GitHub API | REST | `octokit` + `@octokit/core` packages |
| GitHub Spark | Platform | `@github/spark` dependency |
| bmadServer | Backend API | React Query hooks (assumed) |
| DiceBear | Avatar service | URL in `auth.ts` |

## 7. Testing Coverage

**Test Files: 0**

No test files found (`.test.*` or `.spec.*`). 

**Testing Maturity: NONE** — Critical gap for a frontend application.

## 8. Configuration & Infrastructure

### Build System
- Vite 7.2.6 with React SWC plugin
- Tailwind CSS 4 with PostCSS and Vite integration
- TypeScript strict mode
- ESLint with React hooks and refresh rules
- Workspace packages support (`packages/*`)

### Scripts
| Script | Command |
|--------|---------|
| `dev` | `vite` |
| `build` | `tsc -b --noCheck && vite build` |
| `lint` | `eslint .` |
| `preview` | `vite preview` |
| `optimize` | `vite optimize` |
| `kill` | `fuser -k 5000/tcp` |

## 9. Security Considerations

- No authentication implementation visible (may rely on GitHub Spark platform auth)
- Octokit integration requires proper token scoping
- `--noCheck` in build command skips TypeScript type checking — potential risk
- No CSP headers visible in config

## 10. Technical Debt Signals

1. **ZERO test coverage** — No test files exist for 91 source files
2. **`--noCheck` in build** — TypeScript checking disabled in production build
3. **Massive dependency count** — 50+ production dependencies increase bundle size and attack surface
4. **Three.js dependency** — Heavy 3D library included; verify it's actively used
5. **No error boundary evidence** — `react-error-boundary` imported but unclear if deployed consistently
6. **Package name `spark-template`** — Suggests this started as a template; may have leftover/unused code

## 11. Confidence Score

| Dimension | Score | Notes |
|-----------|-------|-------|
| Completeness | 85% | package.json and directory structure analyzed |
| Accuracy | 85% | Evidence from package.json, src structure |
| Currency | 80% | Active with latest React 19, Vite 7 |
| **Overall** | **85%** | |
