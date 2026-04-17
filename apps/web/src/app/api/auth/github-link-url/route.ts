import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
const COOKIE_NAME = "astromath_token";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}/auth/github`, {
    headers,
    redirect: "manual",
  });

  const location = res.headers.get("location");
  if (!location) {
    return NextResponse.json({ error: "Falha ao obter URL do GitHub" }, { status: 500 });
  }

  return NextResponse.json({ url: location });
}
