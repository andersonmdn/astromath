import { z } from "zod";

// IDs são CUIDs (não UUIDs) — z.string() sem .uuid()
export const PlayerDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  githubLogin: z.string().nullable(),
});

export const AuthResponseSchema = z.object({
  player: PlayerDtoSchema,
  token: z.string(),
});

export const AuthMeResponseSchema = z.object({
  player: PlayerDtoSchema
});

export const RankingEntrySchema = z.object({
  name: z.string(),
  wins: z.number().int().nonnegative(),
  matches: z.number().int().nonnegative(),
});

// startedAt/finishedAt: Prisma retorna Date, Fastify serializa como ISO string.
// z.union aceita ambos sem erros em runtime.
export const MatchSummarySchema = z.object({
  id: z.string(),
  roomId: z.string(),
  startedAt: z.union([z.string(), z.date()]),
  finishedAt: z.union([z.string(), z.date()]).nullable(),
  player1: z.object({ name: z.string() }),
  player2: z.object({ name: z.string() }),
  winner: z.object({ name: z.string() }).nullable(),
});

export const ErrorSchema = z.object({ error: z.string() });

export type PlayerDto = z.infer<typeof PlayerDtoSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
export type RankingEntry = z.infer<typeof RankingEntrySchema>;
export type MatchSummary = z.infer<typeof MatchSummarySchema>;
