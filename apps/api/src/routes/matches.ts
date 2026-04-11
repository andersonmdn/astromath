import type { FastifyInstance } from "fastify";
import { prisma } from "../db.js";

export async function matchesRoutes(app: FastifyInstance) {
  app.post("/matches", async (req, reply) => {
    const { roomId, player1Name, player2Name, winnerName } = req.body as {
      roomId: string;
      player1Name: string;
      player2Name: string;
      winnerName?: string;
    };

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

    const winner = winnerName === player1Name
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
        player1: true,
        player2: true,
        winner: true,
      },
    });

    return match;
  });

  app.get("/matches", async (req) => {
    const { limit = "20" } = req.query as { limit?: string };
    return prisma.match.findMany({
      take: Math.min(Number(limit), 100),
      orderBy: { startedAt: "desc" },
      include: {
        player1: { select: { name: true } },
        player2: { select: { name: true } },
        winner: { select: { name: true } },
      },
    });
  });
}
