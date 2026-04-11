import type { Board, CellCoord, PlacedShip, ShotResult } from "./types.js";
import { cellKey, coordsEqual } from "./board.js";

/**
 * Fires at a coordinate on the target board.
 * Returns null if the coord is invalid or already fired upon.
 * Returns { board, result } with an immutable updated board and the shot result.
 */
export function fireAt(
  board: Board,
  coord: CellCoord,
): { board: Board; result: ShotResult } | null {
  const { sector, ring } = coord;
  if (sector < 0 || sector >= board.sectors) return null;
  if (ring < 0 || ring >= board.rings) return null;

  const cell = board.cells[sector][ring];
  if (!cell || cell.state === "hit" || cell.state === "miss" || cell.state === "sunk") {
    return null;
  }

  const hitShip = board.ships.find((s) => s.cells.some((c) => coordsEqual(c, coord)));

  if (!hitShip) {
    const newCells = board.cells.map((row) =>
      row.map((c) => (coordsEqual(c.coord, coord) ? { ...c, state: "miss" as const } : c))
    );
    return { board: { ...board, cells: newCells }, result: { type: "miss", coord } };
  }

  const updatedHits = [...hitShip.hits, coord];
  const isSunk = updatedHits.length === hitShip.cells.length;
  const updatedShip: PlacedShip = { ...hitShip, hits: updatedHits };
  const updatedShips = board.ships.map((s) => (s.id === hitShip.id ? updatedShip : s));

  const sunkKeys = isSunk ? new Set(hitShip.cells.map(cellKey)) : new Set<string>();
  const newCells = board.cells.map((row) =>
    row.map((c) => {
      if (isSunk && sunkKeys.has(cellKey(c.coord))) return { ...c, state: "sunk" as const };
      if (!isSunk && coordsEqual(c.coord, coord)) return { ...c, state: "hit" as const };
      return c;
    })
  );

  return {
    board: { ...board, cells: newCells, ships: updatedShips },
    result: {
      type: isSunk ? "sunk" : "hit",
      coord,
      sunkShip: isSunk ? updatedShip : undefined,
    },
  };
}
