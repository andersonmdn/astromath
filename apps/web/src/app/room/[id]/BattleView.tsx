"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import type { Room } from "@colyseus/sdk";
import type { Board, CellCoord, ShotResult } from "@astromath/shared";
import { createBoard, coordsEqual } from "@astromath/shared";
import { gameStore } from "@/lib/gameStore";
import { RadialBoard } from "@/components/RadialBoard";
import { MathQuestion } from "@/components/MathQuestion";

interface PlayerInfo {
  id: string;
  name: string;
}

interface BattleViewProps {
  room: Room;
  myId: string;
  currentTurn: string;
  winner: string;
  players: PlayerInfo[];
  mode: "classic" | "math";
  onReturnToLobby: () => void;
}

function applyResult(board: Board, result: ShotResult): Board {
  const { type, coord, sunkShip } = result;

  if (type === "miss") {
    return {
      ...board,
      cells: board.cells.map((row) =>
        row.map((c) => (coordsEqual(c.coord, coord) ? { ...c, state: "miss" as const } : c))
      ),
    };
  }

  if (type === "hit") {
    return {
      ...board,
      cells: board.cells.map((row) =>
        row.map((c) => (coordsEqual(c.coord, coord) ? { ...c, state: "hit" as const } : c))
      ),
    };
  }

  if (type === "sunk" && sunkShip) {
    const sunkSet = new Set(sunkShip.cells.map((c) => `${c.sector},${c.ring}`));
    return {
      ...board,
      cells: board.cells.map((row) =>
        row.map((c) =>
          sunkSet.has(`${c.coord.sector},${c.coord.ring}`) ? { ...c, state: "sunk" as const } : c
        )
      ),
    };
  }

  return board;
}

function generateQuestion(): string {
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  if (Math.random() < 0.5) return `${a} + ${b}`;
  const big = Math.max(a, b), small = Math.min(a, b);
  return `${big} - ${small}`;
}

export function BattleView({
  room,
  myId,
  currentTurn,
  winner,
  players,
  mode,
  onReturnToLobby,
}: BattleViewProps) {
  const [attackBoard, setAttackBoard] = useState<Board>(createBoard);
  const [defenseBoard, setDefenseBoard] = useState<Board>(() => {
    return gameStore.getMyBoard() ?? createBoard();
  });
  const [lastResult, setLastResult] = useState<(ShotResult & { shooterId: string }) | null>(null);
  const [pendingTarget, setPendingTarget] = useState<CellCoord | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);
  const [localTurn, setLocalTurn] = useState<string>(currentTurn);

  // Sync prop changes (e.g. skip_turn in math mode, or initial setup)
  useEffect(() => {
    setLocalTurn(currentTurn);
  }, [currentTurn]);

  // Keep a ref to players to avoid stale closure in the shot_result handler
  const playersRef = useRef(players);
  useEffect(() => { playersRef.current = players; });

  useEffect(() => {
    const unsub = room.onMessage(
      "shot_result",
      (data: { shooterId: string; coord: CellCoord; result: ShotResult }) => {
        if (data.shooterId === myId) {
          setAttackBoard((prev) => applyResult(prev, data.result));
        } else {
          setDefenseBoard((prev) => applyResult(prev, data.result));
        }
        setLastResult({ ...data.result, shooterId: data.shooterId });
        // Update turn immediately without waiting for onStateChange patch
        console.log(`shot_result recebido: ${data.shooterId} atirou em (${data.coord.sector}, ${data.coord.ring}) com resultado ${data.result.type}`);
        const nextTurn = playersRef.current.find((p) => p.id !== data.shooterId)?.id;
        console.log(players)
        console.log(playersRef)
        console.log(data)
        console.log(`próximo turno: ${nextTurn}`);
        if (nextTurn) setLocalTurn(nextTurn);
      }
    );
    return () => unsub();
  }, [room, myId]);

  const handleAttackCell = useCallback(
    (coord: CellCoord) => {
      if (localTurn !== myId) return;
      const cell = attackBoard.cells[coord.sector][coord.ring];
      if (cell.state !== "empty") return;

      if (mode === "math") {
        // Show question before firing
        setPendingTarget(coord);
        setActiveQuestion(generateQuestion());
      } else {
        room.send("fire", { sector: coord.sector, ring: coord.ring });
      }
    },
    [localTurn, myId, attackBoard, room, mode]
  );

  function handleMathAnswer(correct: boolean) {
    if (!pendingTarget) return;
    if (correct) {
      room.send("fire", { sector: pendingTarget.sector, ring: pendingTarget.ring });
    } else {
      // Wrong answer: lose the turn
      room.send("skip_turn");
    }
    setPendingTarget(null);
    setActiveQuestion(null);
  }

  const isMyTurn = localTurn === myId;
  const me = players.find((p) => p.id === myId);
  const opponent = players.find((p) => p.id !== myId);
  const winnerName =
    winner === myId ? me?.name ?? "Você" : opponent?.name ?? "Adversário";

  if (winner) {
    const iWon = winner === myId;
    return (
      <div className="flex flex-col items-center gap-6 py-16 text-center">
        <h2 className={`text-4xl font-bold ${iWon ? "text-yellow-400" : "text-red-400"}`}>
          {iWon ? "Vitória!" : "Derrota"}
        </h2>
        <p className="text-gray-300 text-lg">
          {iWon ? "Você destruiu toda a frota adversária." : `${winnerName} destruiu sua frota.`}
        </p>
        <button
          onClick={onReturnToLobby}
          className="mt-4 rounded bg-indigo-700 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-600 transition-colors"
        >
          Voltar ao Lobby
        </button>
      </div>
    );
  }

  return (
    <>
      {activeQuestion && (
        <MathQuestion question={activeQuestion} onAnswer={handleMathAnswer} />
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold">Batalha</h2>
            {mode === "math" && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-900 text-indigo-300 border border-indigo-700">
                ÷ Matemática
              </span>
            )}
          </div>
          <span
            className={`text-sm font-semibold px-3 py-1 rounded-full ${
              isMyTurn ? "bg-green-800 text-green-200" : "bg-gray-700 text-gray-400"
            }`}
          >
            {isMyTurn
              ? mode === "math" ? "Sua vez — responda para atirar" : "Sua vez"
              : `Vez de ${opponent?.name ?? "adversário"}`}
          </span>
        </div>

        {lastResult && (
          <div
            className={`text-center text-sm py-1 rounded ${
              lastResult.type === "miss"
                ? "text-gray-400"
                : lastResult.type === "sunk"
                ? "text-red-400 font-bold"
                : "text-orange-400"
            }`}
          >
            {lastResult.shooterId === myId ? "Você" : opponent?.name ?? "Adversário"}
            {lastResult.type === "miss" && " errou."}
            {lastResult.type === "hit" && " acertou!"}
            {lastResult.type === "sunk" && " afundou uma nave!"}
          </div>
        )}

        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8 items-center lg:items-start justify-center">
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
              Ataque {isMyTurn ? "— clique para atirar" : ""}
            </p>
            <RadialBoard
              board={attackBoard}
              interactive={isMyTurn && !activeQuestion}
              onCellClick={handleAttackCell}
            />
          </div>

          <div className="flex flex-col items-center gap-2">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
              Sua defesa
            </p>
            <RadialBoard board={defenseBoard} />
          </div>
        </div>
      </div>
    </>
  );
}
