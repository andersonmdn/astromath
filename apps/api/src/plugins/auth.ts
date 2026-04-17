import type { FastifyInstance, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import { verifyToken } from "../lib/jwt.js";
import { prisma } from "../db.js";

declare module "fastify" {
  interface FastifyRequest {
    player: { id: string; name: string; githubLogin: string | null } | null;
  }
}

async function authPlugin(app: FastifyInstance) {
  app.decorateRequest("player", null);

  app.addHook("preHandler", async (request: FastifyRequest) => {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) return;

    const token = authHeader.slice(7);
    const payload = verifyToken(token);
    if (!payload?.playerId) return;

    const player = await prisma.player.findUnique({
      where: { id: payload.playerId },
      select: { id: true, name: true, githubLogin: true },
    });

    request.player = player;
  });
}

export default fp(authPlugin);
