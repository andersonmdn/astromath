"use client";

import type { Room } from "colyseus.js";

interface PlayerInfo {
  id: string;
  name: string;
  isReady: boolean;
}

interface LobbyViewProps {
  room: Room;
  roomId: string;
  players: PlayerInfo[];
  myId: string;
}

export function LobbyView({ room, roomId, players, myId }: LobbyViewProps) {
  const me = players.find((p) => p.id === myId);
  const isReady = me?.isReady ?? false;

  return (
    <div className="space-y-6">
      <div className="rounded bg-gray-800 px-4 py-3">
        <p className="text-xs text-gray-400 mb-1">Código da sala</p>
        <p className="font-mono text-lg tracking-widest">{roomId}</p>
        <button
          onClick={() => navigator.clipboard.writeText(roomId)}
          className="mt-1 text-xs text-indigo-400 hover:text-indigo-300"
        >
          Copiar
        </button>
      </div>

      <div>
        <p className="text-sm text-gray-400 mb-2">Jogadores ({players.length}/2)</p>
        <ul className="space-y-2">
          {players.map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between rounded bg-gray-800 px-4 py-3"
            >
              <span>
                {p.name}
                {p.id === myId && (
                  <span className="ml-2 text-xs text-gray-500">(você)</span>
                )}
              </span>
              <span
                className={`text-xs font-semibold ${
                  p.isReady ? "text-green-400" : "text-gray-500"
                }`}
              >
                {p.isReady ? "Pronto" : "Aguardando"}
              </span>
            </li>
          ))}
          {players.length < 2 && (
            <li className="flex items-center rounded border border-dashed border-gray-700 px-4 py-3 text-gray-600 text-sm">
              Aguardando outro jogador...
            </li>
          )}
        </ul>
      </div>

      <button
        onClick={() => room.send("ready")}
        className={`w-full rounded py-2 font-semibold transition-colors ${
          isReady
            ? "bg-green-700 hover:bg-green-600"
            : "bg-indigo-600 hover:bg-indigo-500"
        }`}
      >
        {isReady ? "Cancelar Ready" : "Estou Pronto"}
      </button>

      <p className="text-center text-xs text-gray-600">
        Ambos prontos → fase de posicionamento
      </p>
    </div>
  );
}
