import type { FastifyInstance } from "fastify";
import { prisma } from "../db.js";

export async function rankingRoutes(app: FastifyInstance) {
  app.get("/ranking", async () => {
    const players = await prisma.player.findMany({
      include: {
        _count: {
          select: { wins: true, matchesAsP1: true, matchesAsP2: true },
        },
      },
      orderBy: { wins: { _count: "desc" } },
    });

    return players.map((p: (typeof players)[number]) => ({
      name: p.name,
      wins: p._count.wins,
      matches: p._count.matchesAsP1 + p._count.matchesAsP2,
    }));
  });
}
