# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install all dependencies (run from root)
pnpm install

# Dev — all apps in parallel
pnpm dev

# Dev — individual app
pnpm --filter @astromath/web dev
pnpm --filter @astromath/api dev
pnpm --filter @astromath/game-server dev

# Build — all (respects Turborepo dependency order)
pnpm build

# Build — single package
pnpm --filter @astromath/shared build

# Clean
pnpm clean

# Lint — all packages
pnpm lint

# Tests (packages/shared only — Vitest)
pnpm --filter @astromath/shared test
pnpm --filter @astromath/shared test:watch

# Database (apps/api)
pnpm --filter @astromath/api db:generate   # regenerate Prisma client
pnpm --filter @astromath/api db:migrate    # run migrations (dev)
pnpm --filter @astromath/api db:push       # push schema without migration

# Validate game-server (spins up 2 test clients)
pnpm --filter @astromath/game-server validate
```

## Architecture

Monorepo managed by **pnpm workspaces** + **Turborepo**.

```
apps/web          Next.js 15 (App Router) + Tailwind — port 3000
apps/api          Fastify HTTP server — port 3001
apps/game-server  Colyseus game server — port 2567
packages/shared   Shared TypeScript types (Player, RoomState, etc.)
packages/config   Base tsconfig files (base, node, nextjs)
```

### Key architectural rules

- **No Socket.IO.** Real-time is exclusively via Colyseus (`apps/game-server`).
- `packages/shared` is the single source of truth for types used across apps. Build it before other packages (`pnpm --filter @astromath/shared build`).
- `apps/api` handles HTTP concerns only (REST, DB access via Prisma). Game state lives in `apps/game-server`.
- `apps/web` communicates with `apps/game-server` via the Colyseus JS client and with `apps/api` via HTTP fetch.

### tsconfig resolution

`tsconfig.json` files use **relative `extends`** paths (not package-name paths) because pnpm does not hoist internal workspace packages into the root `node_modules/@astromath/`:

```json
// packages/shared/tsconfig.json
{ "extends": "../config/tsconfig/node.json" }

// apps/api, apps/game-server
{ "extends": "../../packages/config/tsconfig/node.json" }

// apps/web
{ "extends": "../../packages/config/tsconfig/nextjs.json" }
```

### Environment variables

| File | Variable | Default |
|------|----------|---------|
| `apps/api/.env` | `DATABASE_URL` | — (required) |
| `apps/game-server/.env` | `API_URL` | `http://localhost:3001` |
| `apps/game-server/.env` | `RECONNECTION_TIMEOUT` | `30` (seconds) |

### Game phases

`lobby` → `placement` → `battle` → `finished`

### Colyseus message reference

| Direction | Event | Payload |
|-----------|-------|---------|
| c→s | `ready` | — |
| c→s | `submit_board` | `{ placements: PlacementEntry[] }` |
| c→s | `fire` | `{ sector: number, ring: number }` |
| c→s | `skip_turn` | — |
| s→c | `game_start` | `{ firstTurn: string }` |
| s→c | `battle_ready` | `{ firstTurn: string }` |
| s→c | `shot_result` | `{ shooterId, coord, result: ShotResult }` |
| s→c | `game_over` | `{ winner: string }` |
| s→c | `opponent_abandoned` | — |

### Progress tracking

See `docs/progress.md` for completed and upcoming etapas. Next: Etapa 10 — authentication, player profile, persistent sessions.
