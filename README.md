# AstroMath

Jogo de batalha naval matemático multiplayer em tempo real.

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
