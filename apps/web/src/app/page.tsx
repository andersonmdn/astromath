"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { gameClient } from "@/lib/gameClient";
import { gameStore } from "@/lib/gameStore";

export default function Home() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [code, setCode] = useState("");
  const [mode, setMode] = useState<"classic" | "math">("classic");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function createRoom() {
    if (!nickname.trim()) return setError("Informe um nickname.");
    setLoading(true);
    setError("");
    try {
      const room = await gameClient.create("game", { name: nickname.trim(), mode });
      gameStore.setNickname(nickname.trim());
      gameStore.setRoom(room);
      router.push(`/room/${room.id}`);
    } catch (e) {
      setError("Erro ao criar sala.");
      setLoading(false);
    }
  }

  async function joinRoom() {
    if (!nickname.trim()) return setError("Informe um nickname.");
    if (!code.trim()) return setError("Informe o código da sala.");
    setLoading(true);
    setError("");
    try {
      const room = await gameClient.joinById(code.trim(), { name: nickname.trim() });
      gameStore.setNickname(nickname.trim());
      gameStore.setRoom(room);
      router.push(`/room/${room.id}`);
    } catch (e) {
      setError("Sala não encontrada ou já está cheia.");
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-950 text-white p-4">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-3xl font-bold text-center tracking-tight">AstroMath</h1>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Nickname</label>
          <input
            className="w-full rounded bg-gray-800 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Seu nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && createRoom()}
            maxLength={20}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Modo de jogo</label>
          <div className="flex rounded overflow-hidden border border-gray-700">
            <button
              type="button"
              onClick={() => setMode("classic")}
              className={`flex-1 py-2 text-sm font-semibold transition-colors ${
                mode === "classic"
                  ? "bg-indigo-700 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              Clássico
            </button>
            <button
              type="button"
              onClick={() => setMode("math")}
              className={`flex-1 py-2 text-sm font-semibold transition-colors ${
                mode === "math"
                  ? "bg-indigo-700 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              Matemática
            </button>
          </div>
          {mode === "math" && (
            <p className="mt-1 text-xs text-gray-500">
              Antes de disparar, responda uma pergunta. Erro = perde a vez.
            </p>
          )}
        </div>

        <button
          onClick={createRoom}
          disabled={loading}
          className="w-full rounded bg-indigo-600 py-2 font-semibold hover:bg-indigo-500 disabled:opacity-50 transition-colors"
        >
          Criar Sala
        </button>

        <div className="flex items-center gap-2 text-gray-600">
          <hr className="flex-1 border-gray-700" />
          <span className="text-xs">ou entrar por código</span>
          <hr className="flex-1 border-gray-700" />
        </div>

        <div className="space-y-2">
          <input
            className="w-full rounded bg-gray-800 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder="Código da sala"
            value={code}
            onChange={(e) => setCode(e.target.value.trim())}
          />
          <button
            onClick={joinRoom}
            disabled={loading}
            className="w-full rounded border border-indigo-600 py-2 font-semibold text-indigo-400 hover:bg-indigo-900/30 disabled:opacity-50 transition-colors"
          >
            Entrar na Sala
          </button>
        </div>

        {error && <p className="text-sm text-red-400 text-center">{error}</p>}

        <div className="text-center">
          <Link href="/ranking" className="text-xs text-gray-600 hover:text-gray-400">
            Ver ranking e histórico
          </Link>
        </div>
      </div>
    </main>
  );
}
