"use client";

import type { Board, ShipType, Orientation } from "@astromath/shared";
import { SHIP_CONFIGS, INITIAL_FLEET } from "@astromath/shared";

const FLEET_ORDER: ShipType[] = ["patrol", "recon", "multi", "combat"];

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
  const placedCounts = FLEET_ORDER.reduce<Record<ShipType, number>>(
    (acc, t) => ({ ...acc, [t]: board.ships.filter((s) => s.type === t).length }),
    {} as Record<ShipType, number>
  );

  return (
    <div className="space-y-3">
      {/* Orientation toggle */}
      <div className="flex gap-2">
        {(["radial", "angular"] as Orientation[]).map((o) => {
          const disabled = selectedShip === "combat" && o === "radial";
          return (
            <button
              key={o}
              onClick={() => !disabled && onChangeOrientation(o)}
              disabled={disabled}
              className={`flex-1 rounded py-1.5 text-sm font-medium transition-colors ${
                orientation === o
                  ? "bg-indigo-600 text-white"
                  : disabled
                  ? "bg-gray-900 text-gray-700 cursor-not-allowed"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {o === "radial" ? "↑ Radial" : "↻ Angular"}
            </button>
          );
        })}
      </div>

      {/* Ship list */}
      <div className="space-y-1">
        {FLEET_ORDER.map((type) => {
          const config = SHIP_CONFIGS[type];
          const total = INITIAL_FLEET.filter((t) => t === type).length;
          const placed = placedCounts[type];
          const left = total - placed;
          const isSelected = selectedShip === type;
          const available = left > 0;

          const countLabel =
            type === "patrol"
              ? `${placed}/${total}`
              : `${placed}/${total} ${total === 1 ? "grupo" : "grupos"}`;

          return (
            <button
              key={type}
              disabled={!available}
              onClick={() => available && onSelectShip(isSelected ? null : type)}
              style={
                isSelected
                  ? { backgroundColor: config.color + "cc" }
                  : available
                  ? { borderLeft: `3px solid ${config.color}` }
                  : undefined
              }
              className={`w-full flex items-center justify-between rounded px-3 py-2 text-sm transition-colors ${
                isSelected
                  ? "text-white"
                  : available
                  ? "bg-gray-800 hover:bg-gray-700 text-white"
                  : "bg-gray-900 text-gray-600 cursor-not-allowed line-through"
              }`}
            >
              <span>{config.label}</span>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {Array.from({ length: config.size }, (_, i) => (
                    <div
                      key={i}
                      className="h-2.5 w-2.5 rounded-sm"
                      style={{
                        backgroundColor: available ? config.color : "#374151",
                        opacity: isSelected ? 1 : 0.8,
                      }}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500">{countLabel}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
