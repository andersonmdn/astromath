# AstroMath — Progress

## Etapa 1 — Base do Monorepo ✅

**Status:** Concluída

### Entregáveis

| Item | Status |
|------|--------|
| Monorepo pnpm + Turborepo | ✅ |
| `apps/web` (Next.js + Tailwind) | ✅ |
| `apps/api` (Fastify + /health) | ✅ |
| `apps/game-server` (Colyseus + /health) | ✅ |
| `packages/shared` (tipos compartilhados) | ✅ |
| `packages/config` (tsconfig base) | ✅ |
| Scripts dev/build | ✅ |

### Portas

| Serviço | Porta |
|---------|-------|
| web | 3000 |
| api | 3001 |
| game-server | 2567 |

---

## Etapa 2 — Núcleo do jogo (lógica pura) ✅

**Status:** Concluída

### Entregáveis

| Item | Status |
|------|--------|
| Tipos do tabuleiro radial (sectors × rings) | ✅ |
| Tipos de nave (`ShipType`, `PlacedShip`) | ✅ |
| Configuração inicial da frota (`INITIAL_FLEET`) | ✅ |
| Validação de posicionamento (`validatePlacement`) | ✅ |
| Registro do board (`registerBoard`, `isFleetComplete`) | ✅ |
| Função de disparo (`fireAt`) | ✅ |
| Resultado do disparo: hit / miss / sunk | ✅ |
| Troca de turno (`switchTurn`) | ✅ |
| Condição de vitória (`checkVictory`, `isAllSunk`) | ✅ |
| Testes unitários — 33 testes, 5 arquivos | ✅ |

### Board config

`sectors: 8 × rings: 6` = 48 células. Frota ocupa 16 células (33%).

---

## Etapa 3 — Servidor Colyseus inicial ✅

**Status:** Concluída

### Entregáveis

| Item | Status |
|------|--------|
| Schema `PlayerState` + `GameRoomState` | ✅ |
| Criar sala (`client.create("game", { name })`) | ✅ |
| Entrar por código (`client.joinById(roomId, { name })`) | ✅ |
| Lista de jogadores no estado da sala | ✅ |
| Status de ready por jogador | ✅ |
| Início automático quando 2 players prontos | ✅ |
| Broadcast `game_start` com `firstTurn` | ✅ |
| Rota `/health` | ✅ |
| Script de validação com 2 clientes | ✅ |

### Mensagens

| Direção | Evento | Payload |
|---------|--------|---------|
| client → server | `ready` | — (toggle) |
| server → client | `game_start` | `{ firstTurn: string }` |
| server → client | `player_left` | `{ sessionId: string }` |

---

## Etapa 4 — Lobby web ✅

**Status:** Concluída

### Entregáveis

| Item | Status |
|------|--------|
| Tela inicial com campo de nickname | ✅ |
| Botão "Criar Sala" | ✅ |
| Campo + botão "Entrar por código" | ✅ |
| Tela da sala com código para compartilhar | ✅ |
| Lista de jogadores + status de ready | ✅ |
| Botão de ready (toggle) | ✅ |
| Banner de partida iniciada | ✅ |
| Conexão web ↔ Colyseus via `colyseus.js` | ✅ |

### Rotas web

| Rota | Descrição |
|------|-----------|
| `/` | Home — nickname + criar/entrar |
| `/room/[id]` | Sala — players, ready, status |

---

## Etapa 5 — Posicionamento de Naves ✅

**Status:** Concluída

### Entregáveis

| Item | Status |
|------|--------|
| Tabuleiro radial SVG (8 sectors × 6 rings) | ✅ |
| Seleção de nave + toggle de orientação | ✅ |
| Preview visual (verde = válido, vermelho = inválido) | ✅ |
| Posicionamento local com `placeShip` do shared | ✅ |
| Botão Reset | ✅ |
| Envio do board para o servidor (`submit_board`) | ✅ |
| Validação server-side com `placeShip` + `registerBoard` | ✅ |
| Confirmação de board por jogador (`boardReady`) | ✅ |
| Transição para fase `"battle"` quando ambos confirmam | ✅ |
| BattleView placeholder com indicação de turno | ✅ |

### Mensagens adicionadas

| Direção | Evento | Payload |
|---------|--------|---------|
| client → server | `submit_board` | `{ placements: PlacementEntry[] }` |
| client → server | `cancel_board` | — |
| server → client | `placement_start` | — |
| server → client | `battle_ready` | `{ firstTurn: string }` |
| server → client | `board_error` | `{ message: string }` |

### Fases do GameRoom

`lobby` → (ambos isReady) → `placement` → (ambos boardReady) → `battle`

---

## Etapa 6 — MVP Jogável (Batalha) ✅

**Status:** Concluída

### Entregáveis

| Item | Status |
|------|--------|
| Turno atual visível (banner "Sua vez" / "Vez de X") | ✅ |
| Tabuleiro de ataque interativo (clique para atirar) | ✅ |
| Tabuleiro de defesa (suas naves + hits recebidos) | ✅ |
| Disparo via mensagem `fire` → `shot_result` | ✅ |
| Resultado: hit / miss / sunk com feedback visual | ✅ |
| Troca de turno automática no servidor | ✅ |
| Detecção de fim de jogo (`isAllSunk`) | ✅ |
| Campo `winner` no schema Colyseus | ✅ |
| Tela de vitória / derrota | ✅ |
| Botão "Voltar ao Lobby" | ✅ |
| Board persistido no gameStore entre fases | ✅ |

### Mensagens adicionadas

| Direção | Evento | Payload |
|---------|--------|---------|
| client → server | `fire` | `{ sector: number, ring: number }` |
| server → client | `shot_result` | `{ shooterId, coord, result: ShotResult }` |
| server → client | `game_over` | `{ winner: string }` |

### Fases do GameRoom

`lobby` → `placement` → `battle` → `finished`

---

## Etapa 7 — Persistência (Histórico e Ranking) ✅

**Status:** Concluída

### Entregáveis

| Item | Status |
|------|--------|
| Prisma configurado em `apps/api` | ✅ |
| PostgreSQL datasource + schema mínimo | ✅ |
| Model `Player` (nome único, guest) | ✅ |
| Model `Match` (roomId, player1, player2, winner, timestamps) | ✅ |
| `POST /matches` — salva partida ao fim do jogo | ✅ |
| `GET /matches` — lista histórico recente | ✅ |
| `GET /ranking` — jogadores ordenados por vitórias | ✅ |
| GameRoom chama API via HTTP ao fim da partida | ✅ |
| Página `/ranking` no web com ranking + histórico | ✅ |
| Link para ranking na home | ✅ |

### Variáveis de ambiente

| Arquivo | Variável |
|---------|----------|
| `apps/api/.env` | `DATABASE_URL` |
| `apps/game-server/.env` | `API_URL` (default: http://localhost:3001) |

---

## Etapa 8 — Robustez e Estabilidade ✅

**Status:** Concluída

### Entregáveis

| Item | Status |
|------|--------|
| Reconexão simples via `allowReconnection` (Colyseus) | ✅ |
| Token de reconexão persistido em `sessionStorage` | ✅ |
| Reconexão automática no cliente (queda de rede) | ✅ |
| Reconexão após refresh de página | ✅ |
| Tela "Reconectando..." no cliente | ✅ |
| Timeout de reconexão configurável (`RECONNECTION_TIMEOUT=30`) | ✅ |
| Tratamento de abandono: broadcast `opponent_abandoned` ao timeout | ✅ |
| Saída intencional limpa sessionStorage (sem reconexão indesejada) | ✅ |
| Cleanup de salas órfãs via `autoDispose` (padrão Colyseus) | ✅ |
| Erros padronizados com `code` + `message` (evento `"error"`) | ✅ |
| Códigos: `INVALID_PHASE`, `NOT_YOUR_TURN`, `INVALID_PLACEMENT`, `INCOMPLETE_FLEET`, `INVALID_TARGET` | ✅ |
| Notificações no cliente (banner amarelo, sem `alert()`) | ✅ |
| Logs estruturados: `[ISO][roomId][phase] msg` | ✅ |

### Variáveis de ambiente

| Arquivo | Variável | Default |
|---------|----------|---------|
| `apps/game-server/.env` | `RECONNECTION_TIMEOUT` | `30` (segundos) |

---

## Etapa 9 — Modo Matemática ✅

**Status:** Concluída

### Entregáveis

| Item | Status |
|------|--------|
| Seletor de modo (Clássico / Matemática) na criação de sala | ✅ |
| Campo `mode` no schema Colyseus (sincronizado com todos) | ✅ |
| Modo clássico inalterado | ✅ |
| Em modo matemática: pergunta exibida antes do disparo | ✅ |
| Resposta correta → disparo normal | ✅ |
| Resposta errada → perde a vez (`skip_turn`) | ✅ |
| Pergunta desaparece após resposta | ✅ |
| Badge "÷ Matemática" visível durante a batalha | ✅ |
| Tabuleiro de ataque bloqueado enquanto pergunta está aberta | ✅ |
| Perguntas geradas no cliente (adição e subtração, 1–10) | ✅ |

### Mensagens adicionadas

| Direção | Evento | Payload |
|---------|--------|---------|
| client → server | `skip_turn` | — |

### Regra implementada

Resposta errada = perde a vez. O turno avança para o adversário sem disparar.

### Próxima etapa

Etapa 10 — Autenticação, perfil de jogador e sessões persistentes.
