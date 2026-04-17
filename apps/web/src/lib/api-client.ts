const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export interface PlayerDto {
  id: string;
  name: string;
  githubLogin: string | null;
}

async function post<T>(path: string, body: unknown, token?: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Erro desconhecido");
  return data as T;
}

async function get<T>(path: string, token: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Erro desconhecido");
  return data as T;
}

export function register(nickname: string, pin: string) {
  return post<{ player: PlayerDto; token: string }>("/auth/register", { nickname, pin });
}

export function login(nickname: string, pin: string) {
  return post<{ player: PlayerDto; token: string }>("/auth/login", { nickname, pin });
}

export function getMe(token: string) {
  return get<{ player: PlayerDto }>("/auth/me", token);
}

export function getGithubAuthUrl() {
  return `${API_URL}/auth/github`;
}
