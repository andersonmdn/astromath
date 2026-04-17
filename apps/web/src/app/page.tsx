"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Room } from "@colyseus/sdk";
import { gameClient } from "@/lib/gameClient";
import { gameStore } from "@/lib/gameStore";
import { TutorialModal } from "@/components/TutorialModal";
import { GitHubConnectButton } from "@/components/GitHubConnectButton";
import { useSession } from "@/contexts/SessionContext";

export default function Home() {
  const router = useRouter();
  const { player, token, logout } = useSession();
  const [nickname, setNickname] = useState("");
  const [code, setCode] = useState("");
  const [mode, setMode] = useState<"classic" | "math" | "easy">("classic");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [queuing, setQueuing] = useState(false);
  const matchmakingRoomRef = useRef<Room | null>(null);
  const [tutorialOpen, setTutorialOpen] = useState(false);

  useEffect(() => {
    if (player) setNickname(player.name);
  }, [player]);

  useEffect(() => {
    if (!localStorage.getItem("astromath_tutorial_seen")) {
      setTutorialOpen(true);
    }
  }, []);

  function closeTutorial() {
    localStorage.setItem("astromath_tutorial_seen", "1");
    setTutorialOpen(false);
  }

  async function createRoom() {
    if (!nickname.trim()) return setError("Informe um nickname.");
    setLoading(true);
    setError("");
    try {
      const room = await gameClient.create("game", { name: nickname.trim(), mode, token });
      gameStore.setNickname(nickname.trim());
      gameStore.setRoom(room);
      router.push(`/room/${room.roomId}`);
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
      const room = await gameClient.joinById(code.trim(), { name: nickname.trim(), token });
      gameStore.setNickname(nickname.trim());
      gameStore.setRoom(room);
      router.push(`/room/${room.roomId}`);
    } catch (e) {
      setError("Sala não encontrada ou já está cheia.");
      setLoading(false);
    }
  }

  async function joinMatchmaking() {
    if (!nickname.trim()) return setError("Informe um nickname.");
    setLoading(true);
    setError("");
    try {
      const mqRoom = await gameClient.joinOrCreate("matchmaking", {
        name: nickname.trim(),
        mode,
        token,
      });
      matchmakingRoomRef.current = mqRoom;
      setQueuing(true);
      setLoading(false);

      mqRoom.onMessage("match_found", async ({ roomId }: { roomId: string }) => {
        try {
          const gameRoom = await gameClient.joinById(roomId, { name: nickname.trim(), token });
          gameStore.setNickname(nickname.trim());
          gameStore.setRoom(gameRoom);
          mqRoom.leave();
          matchmakingRoomRef.current = null;
          router.push(`/room/${roomId}`);
        } catch {
          setError("Erro ao entrar na partida. Tente novamente.");
          setQueuing(false);
          matchmakingRoomRef.current = null;
        }
      });
    } catch {
      setError("Erro ao entrar na fila.");
      setLoading(false);
    }
  }

  function cancelMatchmaking() {
    matchmakingRoomRef.current?.leave();
    matchmakingRoomRef.current = null;
    setQueuing(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-950 text-white p-4">
      <TutorialModal open={tutorialOpen} onClose={closeTutorial} />

      <div className="w-full max-w-sm space-y-6">
        {player && (
          <div className="flex items-center justify-between rounded bg-gray-800/60 px-3 py-2">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-white">{player.name}</span>
              <GitHubConnectButton githubLogin={player.githubLogin} />
            </div>
            <button
              onClick={logout}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              Sair
            </button>
          </div>
        )}

        <div className="flex items-center justify-center relative">
          <h1 className="text-3xl font-bold tracking-tight">AstroMath</h1>
          <button
            onClick={() => setTutorialOpen(true)}
            className="absolute right-0 w-7 h-7 rounded-full border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 text-sm font-bold transition-colors"
            title="Como jogar"
          >
            ?
          </button>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Nickname</label>
          <input
            className="w-full rounded bg-gray-800 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Seu nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && createRoom()}
            maxLength={20}
            disabled={queuing}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Modo de jogo</label>
          <div className="flex rounded overflow-hidden border border-gray-700">
            <button
              type="button"
              onClick={() => setMode("classic")}
              disabled={queuing}
              className={`flex-1 py-2 text-sm font-semibold transition-colors ${
                mode === "classic"
                  ? "bg-indigo-700 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              } disabled:opacity-50`}
            >
              Clássico
            </button>
            <button
              type="button"
              onClick={() => setMode("easy")}
              disabled={queuing}
              className={`flex-1 py-2 text-sm font-semibold transition-colors ${
                mode === "easy"
                  ? "bg-green-700 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              } disabled:opacity-50`}
            >
              Fácil
            </button>
            <button
              type="button"
              onClick={() => setMode("math")}
              disabled={queuing}
              className={`flex-1 py-2 text-sm font-semibold transition-colors ${
                mode === "math"
                  ? "bg-indigo-700 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              } disabled:opacity-50`}
            >
              Matemática
            </button>
          </div>
          {mode === "easy" && (
            <p className="mt-1 text-xs text-gray-500">
              Ao acertar uma nave, sua cor é revelada. Ideal para quem está aprendendo.
            </p>
          )}
          {mode === "math" && (
            <p className="mt-1 text-xs text-gray-500">
              Antes de disparar, responda uma pergunta. Erro = perde a vez.
            </p>
          )}
        </div>

        {queuing ? (
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 py-3 rounded bg-gray-800 text-gray-300 text-sm">
              <span className="animate-pulse">●</span>
              Aguardando oponente na fila...
            </div>
            <button
              onClick={cancelMatchmaking}
              className="w-full rounded border border-gray-600 py-2 font-semibold text-gray-400 hover:bg-gray-800 transition-colors"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={joinMatchmaking}
              disabled={loading}
              className="w-full rounded bg-green-700 py-2 font-semibold hover:bg-green-600 disabled:opacity-50 transition-colors"
            >
              Jogar Agora
            </button>

            <div className="flex items-center gap-2 text-gray-600">
              <hr className="flex-1 border-gray-700" />
              <span className="text-xs">ou criar / entrar por código</span>
              <hr className="flex-1 border-gray-700" />
            </div>

            <button
              onClick={createRoom}
              disabled={loading}
              className="w-full rounded bg-indigo-600 py-2 font-semibold hover:bg-indigo-500 disabled:opacity-50 transition-colors"
            >
              Criar Sala
            </button>

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
          </>
        )}

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
