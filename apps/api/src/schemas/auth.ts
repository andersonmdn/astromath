import { z } from "zod";

export const RegisterBodySchema = z.object({
  nickname: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9_]{3,20}$/, "Nickname deve ter 3–20 caracteres (letras, números, _)"),
  pin: z
    .string()
    .regex(/^\d{4,}$/, "PIN deve ter pelo menos 4 dígitos numéricos"),
});

export const LoginBodySchema = z.object({
  nickname: z.string().min(1),
  pin: z.string().min(1),
});

export const GithubCallbackQuerySchema = z.object({
  code: z.string(),
  state: z.string(),
});
