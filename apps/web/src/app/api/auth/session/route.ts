import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
const COOKIE_NAME = "astromath_token";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const apiRes = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!apiRes.ok) {
    return NextResponse.json({ error: "Sessão inválida" }, { status: 401 });
  }

  const { player } = (await apiRes.json()) as { player: unknown };
  // token is returned for client-side use in Colyseus join options only
  return NextResponse.json({ player, token });
}
