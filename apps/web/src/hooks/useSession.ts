"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import * as apiClient from "@/lib/api-client";
import type { PlayerDto } from "@/lib/api-client";

const PLAYER_KEY = "astromath_player";

export interface SessionState {
  player: PlayerDto | null;
  token: string | null;
  isLoading: boolean;
  login: (nickname: string, pin: string) => Promise<void>;
  register: (nickname: string, pin: string) => Promise<void>;
  logout: () => void;
  saveSession: (token: string) => Promise<void>;
}

export function useSessionState(): SessionState {
  const router = useRouter();
  const [player, setPlayer] = useState<PlayerDto | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then(({ player, token }: { player: PlayerDto; token: string }) => {
        setPlayer(player);
        setToken(token);
        localStorage.setItem(PLAYER_KEY, JSON.stringify(player));
      })
      .catch(() => {
        localStorage.removeItem(PLAYER_KEY);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const saveSession = useCallback(async (rawToken: string) => {
    const res = await fetch("/api/auth/set-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: rawToken }),
    });
    if (!res.ok) throw new Error("Falha ao salvar sessão");
    const { player } = (await res.json()) as { player: PlayerDto };
    setPlayer(player);
    setToken(rawToken);
    localStorage.setItem(PLAYER_KEY, JSON.stringify(player));
  }, []);

  const login = useCallback(
    async (nickname: string, pin: string) => {
      const { token } = await apiClient.login(nickname, pin);
      await saveSession(token);
    },
    [saveSession]
  );

  const register = useCallback(
    async (nickname: string, pin: string) => {
      const { token } = await apiClient.register(nickname, pin);
      await saveSession(token);
    },
    [saveSession]
  );

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem(PLAYER_KEY);
    setPlayer(null);
    setToken(null);
    router.push("/login");
  }, [router]);

  return { player, token, isLoading, login, register, logout, saveSession };
}
