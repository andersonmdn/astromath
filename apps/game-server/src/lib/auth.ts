import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET ?? "dev_secret_change_me";

export function verifyPlayerToken(token: string): { playerId: string } | null {
  try {
    const payload = jwt.verify(token, SECRET) as { playerId?: unknown };
    if (typeof payload.playerId !== "string") return null;
    return { playerId: payload.playerId };
  } catch {
    return null;
  }
}
