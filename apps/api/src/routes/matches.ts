import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../db.js";
import { CreateMatchBodySchema, GetMatchesQuerySchema } from "../schemas/matches.js";
import { MatchSummarySchema, ErrorSchema } from "@astromath/shared";

export async function matchesRoutes(app: FastifyInstance) {
  const r = app.withTypeProvider<ZodTypeProvider>();

  r.post(
    "/matches",
    {
      schema: {
        tags: ["matches"],
        summary: "Registrar resultado de uma partida",
        body: CreateMatchBodySchema,
        response: {
          200: MatchSummarySchema,
          400: ErrorSchema,
        },
      },
    },
    async (req, reply) => {
      const { roomId, player1Name, player2Name, winnerName } = req.body;

      if (!roomId || !player1Name || !player2Name) {
        return reply.status(400).send({ error: "Missing required fields" });
      }

      const [player1, player2] = await Promise.all([
        prisma.player.upsert({
          where: { name: player1Name },
          update: {},
          create: { name: player1Name },
        }),
        prisma.player.upsert({
          where: { name: player2Name },
          update: {},
          create: { name: player2Name },
        }),
      ]);

      const winner =
        winnerName === player1Name
          ? player1
          : winnerName === player2Name
            ? player2
            : null;

      const match = await prisma.match.create({
        data: {
          roomId,
          player1Id: player1.id,
          player2Id: player2.id,
          winnerId: winner?.id ?? null,
          finishedAt: new Date(),
        },
        include: {
          player1: { select: { name: true } },
          player2: { select: { name: true } },
          winner: { select: { name: true } },
        },
      });

      return match;
    },
  );

  r.get(
    "/matches",
    {
      schema: {
        tags: ["matches"],
        summary: "Listar partidas recentes",
        querystring: GetMatchesQuerySchema,
        response: { 200: z.array(MatchSummarySchema) },
      },
    },
    async (req) => {
      const { limit = "20" } = req.query;
      return prisma.match.findMany({
        take: Math.min(Number(limit), 100),
        orderBy: { startedAt: "desc" },
        include: {
          player1: { select: { name: true } },
          player2: { select: { name: true } },
          winner: { select: { name: true } },
        },
      });
    },
  );
}
