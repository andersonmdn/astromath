"use client";

import type { Board, ShipType, Orientation } from "@astromath/shared";
import { SHIP_CONFIGS, INITIAL_FLEET } from "@astromath/shared";

const FLEET_DISPLAY: { type: ShipType; label: string }[] = [
  { type: "carrier", label: "Carrier" },
  { type: "battleship", label: "Battleship" },
  { type: "cruiser", label: "Cruiser" },
  { type: "destroyer", label: "Destroyer" },
];

interface ShipSelectorProps {
  board: Board;
  selectedShip: ShipType | null;
  orientation: Orientation;
  onSelectShip: (type: ShipType | null) => void;
  onChangeOrientation: (o: Orientation) => void;
}

export function ShipSelector({
  board,
  selectedShip,
  orientation,
  onSelectShip,
  onChangeOrientation,
}: ShipSelectorProps) {
  const remaining = [...INITIAL_FLEET];
  for (const ship of board.ships) {
    const idx = remaining.indexOf(ship.type);
    if (idx !== -1) remaining.splice(idx, 1);
  }

  return (
    <div className="space-y-3">
      {/* Orientation toggle */}
      <div className="flex gap-2">
        {(["radial", "angular"] as Orientation[]).map((o) => (
          <button
            key={o}
            onClick={() => onChangeOrientation(o)}
            className={`flex-1 rounded py-1.5 text-sm font-medium transition-colors ${
              orientation === o
                ? "bg-indigo-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            {o === "radial" ? "↑ Radial" : "↻ Angular"}
          </button>
        ))}
      </div>

      {/* Ship list */}
      <div className="space-y-1">
        {FLEET_DISPLAY.map(({ type, label }) => {
          const total = INITIAL_FLEET.filter((t) => t === type).length;
          const left = remaining.filter((t) => t === type).length;
          const isSelected = selectedShip === type;
          const available = left > 0;

          return (
            <button
              key={type}
              disabled={!available}
              onClick={() => available && onSelectShip(isSelected ? null : type)}
              className={`w-full flex items-center justify-between rounded px-3 py-2 text-sm transition-colors ${
                isSelected
                  ? "bg-indigo-600 text-white"
                  : available
                  ? "bg-gray-800 hover:bg-gray-700 text-white"
                  : "bg-gray-900 text-gray-600 cursor-not-allowed line-through"
              }`}
            >
              <span>{label}</span>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {Array.from({ length: SHIP_CONFIGS[type].size }, (_, i) => (
                    <div
                      key={i}
                      className={`h-2.5 w-2.5 rounded-sm ${
                        isSelected
                          ? "bg-indigo-300"
                          : available
                          ? "bg-indigo-500"
                          : "bg-gray-700"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500">
                  {total - left}/{total}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
