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

### Game modes

| Mode | Value | Behaviour |
|------|-------|-----------|
| Clássico | `"classic"` | Standard play |
| Fácil | `"easy"` | Hit cells reveal the ship's colour; sunk cells darken |
| Matemática | `"math"` | Player must answer a maths question before each shot; wrong answer = lose turn |

### Game phases

`lobby` → `placement` → `battle` → `finished`

### Colyseus rooms

| Room | Name | Purpose |
|------|------|---------|
| `GameRoom` | `"game"` | One instance per match, `maxClients = 2` |
| `MatchmakingRoom` | `"matchmaking"` | Shared queue, `maxClients = 100`, `autoDispose = false`; pairs players by mode and creates a `GameRoom` |

### Colyseus message reference

#### GameRoom (`"game"`)

| Direction | Event | Payload |
|-----------|-------|---------|
| c→s | `ready` | — (toggle) |
| c→s | `screen_ready` | — |
| c→s | `submit_board` | `{ placements: PlacementEntry[] }` |
| c→s | `cancel_board` | — |
| c→s | `fire` | `{ sector: number, ring: number }` |
| c→s | `skip_turn` | — (math mode: wrong answer) |
| s→c | `placement_start` | — |
| s→c | `battle_ready` | `{ firstTurn: string }` |
| s→c | `shot_result` | `{ shooterId, coord, result: ShotResult, hitShipType?: ShipType }` — `hitShipType` only in easy mode on hit |
| s→c | `game_over` | `{ winner: string }` |
| s→c | `opponent_abandoned` | `{ sessionId, name }` |
| s→c | `player_left` | `{ sessionId }` |
| s→c | `error` | `{ code, message }` |

#### MatchmakingRoom (`"matchmaking"`)

| Direction | Event | Payload |
|-----------|-------|---------|
| c→s | join options | `{ name: string, mode: string }` |
| s→c | `match_found` | `{ roomId: string }` |

### Progress tracking

See `docs/progress.md` for completed etapas.
