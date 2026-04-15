# AstroMath

Jogo **inspirado em batalha naval**, ambientado no espaço, multiplayer em tempo real para 2 jogadores. Cada jogador posiciona sua frota num tabuleiro radial (grade circular) e tenta afundar as naves do adversário. Suporte a múltiplas partidas simultâneas via matchmaking automático.

## Funcionalidades

- **Matchmaking automático** — botão "Jogar Agora" enfileira o jogador e cria a partida automaticamente ao encontrar um oponente
- **Criar/entrar por código** — fluxo manual para partidas privadas
- **3 modos de jogo:** Clássico, Fácil (cores das naves reveladas ao acertar) e Matemática (responda uma conta para atirar)
- **Tabuleiro radial SVG** — grade circular 8 setores × 6 anéis, orientações radial e angular
- **Contador de progresso** — barra de naves restantes de cada lado durante a batalha
- **Reconexão automática** — queda de rede ou refresh de página não encerram a partida
- **Ranking e histórico** — partidas persistidas em PostgreSQL via Prisma
- **Tutorial integrado** — modal passo a passo na primeira visita, reacessível pelo botão "?"

## Stack

| Camada | Tecnologia | Porta |
|---|---|---|
| Frontend | Next.js 15 (App Router) + Tailwind | 3000 |
| HTTP API | Fastify + Prisma | 3001 |
| Game Server | Colyseus | 2567 |
| Banco de dados | PostgreSQL 16 (Docker) | 5432 |

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) >= 20
- [pnpm](https://pnpm.io/) >= 9 (`npm install -g pnpm`)
- [Docker](https://docs.docker.com/get-docker/) com Docker Compose v2

---

## Primeira vez

Execute os passos abaixo **na ordem** a partir da raiz do repositório.

### 1. Instalar dependências

```bash
pnpm install
```

### 2. Configurar variáveis de ambiente

```bash
cp apps/api/.env.example apps/api/.env
```

> O arquivo `.env` já vem com os valores corretos para o banco Docker. Edite apenas se precisar mudar porta ou credenciais.

### 3. Subir o banco de dados

```bash
docker compose up -d
```

Aguarde o container `astromath-db` estar `healthy` antes de continuar:

```bash
docker compose ps
```

### 4. Gerar o Prisma Client

```bash
pnpm --filter @astromath/api db:generate
```

### 5. Criar as tabelas (migration)

```bash
pnpm --filter @astromath/api db:migrate
```

> Na primeira execução o Prisma pedirá um nome para a migration. Sugestão: `init`.

### 6. Build do pacote compartilhado

```bash
pnpm --filter @astromath/shared build
```

### 7. Iniciar os apps

```bash
pnpm dev
```

Isso sobe os três apps em paralelo via Turborepo:
- `http://localhost:3000` — Web
- `http://localhost:3001` — API
- `ws://localhost:2567` — Game Server

---

## Próximas execuções

```bash
# Garantir que o banco está rodando
docker compose up -d

# Iniciar os apps
pnpm dev
```

---

## Comandos úteis

| Comando | O que faz |
|---|---|
| `docker compose up -d` | Sobe o PostgreSQL em background |
| `docker compose down` | Para e remove os containers (dados preservados no volume) |
| `docker compose down -v` | Para e **apaga** os dados do banco |
| `pnpm --filter @astromath/api db:migrate` | Aplica novas migrations |
| `pnpm --filter @astromath/api db:generate` | Regenera o Prisma Client após alterar o schema |
| `pnpm --filter @astromath/shared build` | Rebulda os tipos compartilhados |
| `pnpm --filter @astromath/shared test` | Roda os testes unitários (Vitest) |
| `pnpm lint` | Lint em todos os pacotes |
| `pnpm build` | Build de produção (todos os pacotes) |
| `pnpm clean` | Remove artefatos de build |

---

## Variáveis de ambiente

| Arquivo | Variável | Padrão |
|---|---|---|
| `apps/api/.env` | `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/astromath?schema=public` |
| `apps/game-server/.env` | `API_URL` | `http://localhost:3001` |
| `apps/game-server/.env` | `RECONNECTION_TIMEOUT` | `30` |
