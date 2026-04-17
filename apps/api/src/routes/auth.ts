import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "../db.js";
import { signToken, signStateToken, verifyToken } from "../lib/jwt.js";
import { RegisterBodySchema, LoginBodySchema, GithubCallbackQuerySchema } from "../schemas/auth.js";
import { AuthResponseSchema, PlayerDtoSchema, ErrorSchema, AuthMeResponseSchema } from "@astromath/shared";

function playerDto(p: { id: string; name: string; githubLogin: string | null }) {
  return { id: p.id, name: p.name, githubLogin: p.githubLogin };
}

const RedirectSchema = z.object({}).describe("Redirect");

export async function authRoutes(app: FastifyInstance) {
  const r = app.withTypeProvider<ZodTypeProvider>();

  // POST /auth/register
  r.post(
    "/auth/register",
    {
      schema: {
        tags: ["auth"],
        summary: "Registrar conta com nickname e PIN",
        body: RegisterBodySchema,
        response: {
          200: AuthResponseSchema,
          400: ErrorSchema,
          409: ErrorSchema,
        },
      },
    },
    async (req, reply) => {
      const { nickname, pin } = req.body;

      const existing = await prisma.player.findUnique({ where: { name: nickname } });
      if (existing) {
        return reply.status(409).send({ error: "Nickname já está em uso" });
      }

      const hashed = await bcrypt.hash(pin, 10);
      const player = await prisma.player.create({
        data: { name: nickname, pin: hashed },
      });

      const token = signToken({ playerId: player.id });
      return { player: playerDto(player), token };
    },
  );

  // POST /auth/login
  r.post(
    "/auth/login",
    {
      schema: {
        tags: ["auth"],
        summary: "Login com nickname e PIN",
        body: LoginBodySchema,
        response: {
          200: AuthResponseSchema,
          401: ErrorSchema,
        },
      },
    },
    async (req, reply) => {
      const { nickname, pin } = req.body;

      const player = await prisma.player.findUnique({ where: { name: nickname } });
      if (!player || !player.pin) {
        return reply.status(401).send({ error: "Credenciais inválidas" });
      }

      const valid = await bcrypt.compare(pin, player.pin);
      if (!valid) {
        return reply.status(401).send({ error: "Credenciais inválidas" });
      }

      const token = signToken({ playerId: player.id });
      return { player: playerDto(player), token };
    },
  );

  // GET /auth/me
  r.get(
    "/auth/me",
    {
      schema: {
        tags: ["auth"],
        summary: "Retorna o player autenticado",
        security: [{ bearerAuth: [] }],
        response: {
          200: AuthMeResponseSchema,
          401: ErrorSchema,
        },
      },
    },
    async (req, reply) => {
      if (!req.player) {
        return reply.status(401).send({ error: "Token ausente ou inválido" });
      }
      return { player: req.player };
    },
  );

  // GET /auth/github
  r.get(
    "/auth/github",
    {
      schema: {
        tags: ["auth"],
        summary: "Inicia o fluxo OAuth do GitHub — redireciona para o GitHub",
        security: [{ bearerAuth: [] }],
        response: { 302: RedirectSchema, 500: ErrorSchema },
      },
    },
    async (req, reply) => {
      const clientId = process.env.GITHUB_CLIENT_ID;
      if (!clientId) {
        return reply.status(500).send({ error: "GITHUB_CLIENT_ID não configurado" });
      }

      const playerId = req.player?.id ?? null;
      const state = signStateToken({ playerId });

      const params = new URLSearchParams({
        client_id: clientId,
        scope: "read:user",
        state,
      });

      return reply.redirect(`https://github.com/login/oauth/authorize?${params}`);
    },
  );

  // GET /auth/github/callback
  r.get(
    "/auth/github/callback",
    {
      schema: {
        tags: ["auth"],
        summary: "Callback OAuth do GitHub — troca code por token e redireciona para o frontend",
        querystring: GithubCallbackQuerySchema,
        response: { 302: RedirectSchema },
      },
    },
    async (req, reply) => {
      const { code, state } = req.query;
      const frontendUrl = process.env.FRONTEND_URL ?? "http://localhost:3000";

      const statePayload = verifyToken(state);
      if (statePayload === null) {
        return reply.redirect(`${frontendUrl}/auth/callback?error=invalid_state`);
      }

      // Trocar code por access_token
      const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        }),
      });
      const tokenData = (await tokenRes.json()) as { access_token?: string; error?: string };

      if (!tokenData.access_token) {
        return reply.redirect(`${frontendUrl}/auth/callback?error=github_token_failed`);
      }

      // Buscar dados do usuário GitHub
      const userRes = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          "User-Agent": "astromath",
        },
      });
      const ghUser = (await userRes.json()) as { id?: number; login?: string };

      if (!ghUser.id || !ghUser.login) {
        return reply.redirect(`${frontendUrl}/auth/callback?error=github_user_failed`);
      }

      const githubId = String(ghUser.id);
      const githubLogin = ghUser.login;

      // Fluxo de vinculação (state tem playerId)
      if (statePayload.playerId) {
        const conflict = await prisma.player.findUnique({ where: { githubId } });
        if (conflict && conflict.id !== statePayload.playerId) {
          return reply.redirect(`${frontendUrl}/auth/callback?error=github_already_linked`);
        }

        await prisma.player.update({
          where: { id: statePayload.playerId },
          data: { githubId, githubLogin },
        });

        const token = signToken({ playerId: statePayload.playerId });
        return reply.redirect(`${frontendUrl}/auth/callback?token=${token}`);
      }

      // Fluxo de login/registro via GitHub
      let player = await prisma.player.findUnique({ where: { githubId } });

      if (!player) {
        let name = githubLogin;
        const taken = await prisma.player.findUnique({ where: { name } });
        if (taken) name = `${githubLogin}_gh`;

        player = await prisma.player.create({
          data: { name, githubId, githubLogin },
        });
      }

      const token = signToken({ playerId: player.id });
      return reply.redirect(`${frontendUrl}/auth/callback?token=${token}`);
    },
  );
}
