import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET ?? "dev_secret_change_me";
const EXPIRY = "30d";
const EXPIRY_SHORT = "15m";

export interface TokenPayload {
  playerId: string | null;
}

export function signToken(payload: TokenPayload, expiresIn = EXPIRY): string {
  return jwt.sign(payload, SECRET, { expiresIn } as jwt.SignOptions);
}

export function signStateToken(payload: TokenPayload): string {
  return signToken(payload, EXPIRY_SHORT);
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, SECRET) as TokenPayload;
  } catch {
    return null;
  }
}
