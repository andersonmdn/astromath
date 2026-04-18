"use client";

import { useEffect, useState, useRef, use } from "react";
import { useParams, useRouter } from "next/navigation";
import { gameClient } from "@/lib/gameClient";
import { gameStore } from "@/lib/gameStore";
import type { Room } from "@colyseus/sdk";
import { LobbyView } from "./LobbyView";
import { PlacementView } from "./PlacementView";
import { BattleView } from "./BattleView";

const reconnectKey = (roomId: string) => `astromath:reconnect:${roomId}`;

interface PlayerInfo {
  id: string;
  name: string;
  isReady: boolean;
  boardReady: boolean;
}

interface RoomState {
  players: PlayerInfo[];
  phase: string;
  currentTurn: string;
  winner: string;
  mode: "classic" | "math" | "easy";
}

export default function RoomPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const roomRef = useRef<Room | null>(null);
  
  const [state, setState] = useState<RoomState>({
    players: [],
    phase: "lobby",
    currentTurn: "",
    winner: "",
    mode: "classic" as "classic" | "math" | "easy",
  });
  const [myId, setMyId] = useState("");
  const [mounted, setMounted] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);
  const [notification, setNotification] = useState<string>("");

  function showNotification(msg: string, durationMs = 5000) {
    setNotification(msg);
    if (durationMs > 0) setTimeout(() => setNotification(""), durationMs);
  }

  function syncState(newState: RoomState) {
    const players: PlayerInfo[] = [];
    
    newState.players.forEach((p) => {
      players.push({
        id: p.id,
        name: p.name,
        isReady: p.isReady,
        boardReady: p.boardReady,
      });
    });
    
    setState({
      players,
      phase: newState.phase ?? "lobby",
      currentTurn: newState.currentTurn ?? "",
      winner: newState.winner ?? "",
      mode: (newState.mode === "math" ? "math" : newState.mode === "easy" ? "easy" : "classic") as "classic" | "math" | "easy",
    });
  }

  useEffect(() => {
    let active = true;

    function setupRoom(room: Room) {
      if (!active) return;

      roomRef.current = room;
      setMyId(room.sessionId);

      // Persist reconnection token across page refreshes
      if (room.reconnectionToken) sessionStorage.setItem(reconnectKey(id), room.reconnectionToken);

      syncState(room.state);
      room.onStateChange(syncState);

      room.onMessage("error", (data: { code: string; message: string }) => {
        showNotification(`[${data.code}] ${data.message}`);
      });

      room.onMessage("player_joined", (data: { playerId: string; name: string }) => {
        setState((prev) => ({
          ...prev,
          players: [...prev.players, { id: data.playerId, name: data.name, isReady: false, boardReady: false }],
        }));
      });

      // legacy compat — server still used board_error before Etapa 8
      room.onMessage("board_error", (data: { message: string }) => {
        showNotification(data.message);
      });

      room.onMessage("opponent_abandoned", (data: { name: string }) => {
        showNotification(`${data.name} abandonou a partida.`, 0);
      });

      room.onMessage("placement_start", () => {
        setState((prev) => ({ ...prev, phase: "placement" }));
      });

      room.onMessage("battle_ready", (data: { firstTurn: string }) => {
        setState((prev) => ({ ...prev, phase: "battle", currentTurn: data.firstTurn }));
      });

      room.onMessage("shot_result", (data: { shooterId: string }) => {
        setState((prev) => {
          const nextTurn = prev.players.find((p) => p.id !== data.shooterId)?.id ?? prev.currentTurn;
          return { ...prev, currentTurn: nextTurn };
        });
      });

      room.onMessage("game_over", (data: { winner: string }) => {
        setState((prev) => ({ ...prev, phase: "finished", winner: data.winner }));
      });

      room.onLeave((code) => {
        if (!active) return;
        if (code === 1000) {
          // Intentional leave
          sessionStorage.removeItem(reconnectKey(id));
          gameStore.clearRoom();
          return;
        }

        // Unexpected disconnect — attempt reconnection
        const storedToken = sessionStorage.getItem(reconnectKey(id));
        if (!storedToken) {
          gameStore.clearRoom();
          router.replace("/");
          return;
        }

        setReconnecting(true);
        gameClient
          .reconnect(storedToken)
          .then((newRoom: Room) => {
            if (!active) return;
            gameStore.setRoom(newRoom);
            setupRoom(newRoom);
            setReconnecting(false);
          })
          .catch((e: unknown) => {
            console.error("[reconnect onLeave]", e);
            if (!active) return;
            sessionStorage.removeItem(reconnectKey(id));
            gameStore.clearRoom();
            setReconnecting(false);
            router.replace("/");
          });
      });

      setMounted(true);
      setReconnecting(false);
    }

    const existingRoom = gameStore.getRoom();
    if (existingRoom && existingRoom.roomId === id) {
      setupRoom(existingRoom);
      existingRoom.send("screen_ready");
      return () => { active = false; };
    }

    // No room in memory — try reconnect from sessionStorage (e.g. after page refresh)
    const storedToken = sessionStorage.getItem(reconnectKey(id));
    if (!storedToken) {
      router.replace("/");
      return () => { active = false; };
    }

    setReconnecting(true);
    gameClient
      .reconnect(storedToken)
      .then((room: Room) => {
        if (!active) return;
        gameStore.setRoom(room);
        setupRoom(room);
      })
      .catch((e: unknown) => {
        console.error("[reconnect init]", e);
        if (!active) return;
        sessionStorage.removeItem(reconnectKey(id));
        router.replace("/");
      });

    return () => { active = false; };
  }, [id, router]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleLeave() {
    roomRef.current?.leave();
    sessionStorage.removeItem(reconnectKey(id));
    gameStore.clearRoom();
    router.push("/");
  }

  if (reconnecting) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
        <div className="text-center space-y-2">
          <p className="text-gray-300">Reconectando...</p>
          <p className="text-xs text-gray-600">Aguarde ou feche para sair.</p>
        </div>
      </main>
    );
  }

  if (!mounted) return null;

  const room = roomRef.current!;
  const me = state.players.find((p) => p.id === myId);
  const { phase, players, currentTurn, winner, mode } = state;

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-950 text-white p-4">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold">AstroMath - {state.players.map(p => p.name).join(", ")}</h1>
          <button
            onClick={handleLeave}
            className="text-sm text-gray-500 hover:text-gray-300"
          >
            Sair
          </button>
        </div>

        {notification && (
          <div className="mb-4 rounded bg-yellow-900/40 border border-yellow-700/60 px-4 py-2 text-sm text-yellow-300">
            {notification}
          </div>
        )}

        {phase === "lobby" && (
          <LobbyView room={room} roomId={id} players={players} myId={myId} />
        )}

        {phase === "placement" && (
          <PlacementView
            room={room}
            boardReady={me?.boardReady ?? false}
            waitingForOpponent={
              (me?.boardReady ?? false) && !players.every((p) => p.boardReady)
            }
          />
        )}

        {(phase === "battle" || phase === "finished") && (
          <BattleView
            room={room}
            myId={myId}
            currentTurn={currentTurn}
            winner={winner}
            players={players}
            mode={mode}
            onReturnToLobby={handleLeave}
          />
        )}
      </div>
    </main>
  );
}
