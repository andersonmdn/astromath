import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../db.js";
import { RankingEntrySchema } from "@astromath/shared";

export async function rankingRoutes(app: FastifyInstance) {
  const r = app.withTypeProvider<ZodTypeProvider>();

  r.get(
    "/ranking",
    {
      schema: {
        tags: ["ranking"],
        summary: "Ranking de jogadores por vitórias",
        response: { 200: z.array(RankingEntrySchema) },
      },
    },
    async () => {
      const players = await prisma.player.findMany({
        include: {
          _count: {
            select: { wins: true, matchesAsP1: true, matchesAsP2: true },
          },
        },
        orderBy: { wins: { _count: "desc" } },
      });

      return players.map((p) => ({
        name: p.name,
        wins: p._count.wins,
        matches: p._count.matchesAsP1 + p._count.matchesAsP2,
      }));
    },
  );
}
