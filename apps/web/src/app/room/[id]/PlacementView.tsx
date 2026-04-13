"use client";

import { useState, useCallback } from "react";
import type { Room } from "@colyseus/sdk";
import type { Board, CellCoord, ShipType, Orientation } from "@astromath/shared";
import {
  createBoard,
  placeShip,
  getShipCells,
  validatePlacement,
  isFleetComplete,
  INITIAL_FLEET,
} from "@astromath/shared";

const FLEET_ORDER: ShipType[] = ["patrol", "recon", "multi", "combat"];
import { RadialBoard } from "@/components/RadialBoard";
import { ShipSelector } from "@/components/ShipSelector";
import { gameStore } from "@/lib/gameStore";

interface PlacementEntry {
  shipId: string;
  type: ShipType;
  sector: number;
  ring: number;
  orientation: Orientation;
}

interface PlacementViewProps {
  room: Room;
  boardReady: boolean;
  waitingForOpponent: boolean;
}

export function PlacementView({ room, boardReady, waitingForOpponent }: PlacementViewProps) {
  const [localBoard, setLocalBoard] = useState<Board>(createBoard);
  const [placements, setPlacements] = useState<PlacementEntry[]>([]);
  const [selectedShip, setSelectedShip] = useState<ShipType | null>(null);
  const [orientation, setOrientation] = useState<Orientation>("radial");

  function handleSelectShip(type: ShipType | null) {
    setSelectedShip(type);
    if (type === "combat") setOrientation("angular");
  }
  const [previewCells, setPreviewCells] = useState<CellCoord[]>([]);
  const [previewValid, setPreviewValid] = useState(false);

  const handleCellHover = useCallback(
    (coord: CellCoord | null) => {
      if (!coord || !selectedShip) {
        setPreviewCells([]);
        return;
      }
      const cells = getShipCells(localBoard, coord, selectedShip, orientation);
      setPreviewCells(cells ?? []);
      setPreviewValid(cells !== null && validatePlacement(localBoard, cells));
    },
    [localBoard, selectedShip, orientation]
  );

  const handleCellClick = useCallback(
    (coord: CellCoord) => {
      if (!selectedShip) return;
      const id = `${selectedShip}-${Date.now()}`;
      const newBoard = placeShip(localBoard, coord, selectedShip, orientation, id);
      if (!newBoard) return;
      setLocalBoard(newBoard);

      const entry: PlacementEntry = { shipId: id, type: selectedShip, sector: coord.sector, ring: coord.ring, orientation };
      const newPlacements = [...placements, entry];
      setPlacements(newPlacements);
      setPreviewCells([]);

      const totalCounts = FLEET_ORDER.reduce(
        (acc, t) => ({ ...acc, [t]: INITIAL_FLEET.filter((f) => f === t).length }),
        {} as Record<ShipType, number>
      );
      const placedCounts = FLEET_ORDER.reduce(
        (acc, t) => ({ ...acc, [t]: newPlacements.filter((p) => p.type === t).length }),
        {} as Record<ShipType, number>
      );

      const currentIdx = FLEET_ORDER.indexOf(selectedShip);
      const ordered = [...FLEET_ORDER.slice(currentIdx), ...FLEET_ORDER.slice(0, currentIdx)];
      const next = ordered.find((t) => placedCounts[t] < totalCounts[t]) ?? null;
      handleSelectShip(next);
    },
    [localBoard, selectedShip, orientation, placements]
  );

  function handleReset() {
    setLocalBoard(createBoard());
    setPlacements([]);
    setSelectedShip(null);
    setPreviewCells([]);
  }

  function handleSubmit() {
    gameStore.setMyBoard(localBoard);
    room.send("submit_board", { placements });
  }

  if (boardReady) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <p className="text-green-400 font-semibold text-lg">Board confirmado!</p>
        <p className="text-sm text-gray-400">
          {waitingForOpponent
            ? "Aguardando adversário posicionar as naves..."
            : "Ambos prontos! Iniciando batalha..."}
        </p>
      </div>
    );
  }

  const fleetComplete = isFleetComplete(localBoard);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold">Posicionar Naves</h2>
        <p className="text-xs text-gray-400">
          Selecione a nave, escolha a orientação e clique no tabuleiro.
        </p>
      </div>

      <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start">
        <RadialBoard
          board={localBoard}
          previewCells={previewCells}
          previewValid={previewValid}
          interactive
          onCellClick={handleCellClick}
          onCellHover={handleCellHover}
        />

        <div className="w-full max-w-xs space-y-4">
          <ShipSelector
            board={localBoard}
            selectedShip={selectedShip}
            orientation={orientation}
            onSelectShip={handleSelectShip}
            onChangeOrientation={setOrientation}
          />

          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="flex-1 rounded border border-gray-600 py-2 text-sm text-gray-400 hover:bg-gray-800 transition-colors"
            >
              Limpar
            </button>
            <button
              onClick={handleSubmit}
              disabled={!fleetComplete}
              className="flex-1 rounded bg-green-700 py-2 text-sm font-semibold text-white hover:bg-green-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Confirmar Tabuleiro
            </button>
          </div>

          {!fleetComplete && (
            <p className="text-center text-xs text-gray-600">
              Posicione todas as naves para confirmar o tabuleiro.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
