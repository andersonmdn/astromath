import { z } from "zod";

export const CreateMatchBodySchema = z.object({
  roomId: z.string().min(1),
  player1Name: z.string().min(1),
  player2Name: z.string().min(1),
  winnerName: z.string().optional(),
  player1Id: z.string().optional(),
  player2Id: z.string().optional(),
  winnerId: z.string().optional(),
});

export const GetMatchesQuerySchema = z.object({
  limit: z.string().regex(/^\d+$/).optional(),
});
