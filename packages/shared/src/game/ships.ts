import type { Board, CellCoord, Orientation, PlacedShip, ShipType } from "./types.js";
import { SHIP_CONFIGS } from "./types.js";
import { getCell, cellKey, coordsEqual } from "./board.js";

/**
 * Computes the cells a ship would occupy.
 * - radial: extends along rings (outward), same sector.
 * - angular: extends along sectors (clockwise), same ring. Wraps around.
 * Returns null if any cell is out of bounds (radial never wraps).
 */
export function getShipCells(
  board: Board,
  origin: CellCoord,
  type: ShipType,
  orientation: Orientation,
): CellCoord[] | null {
  const size = SHIP_CONFIGS[type].size;
  const cells: CellCoord[] = [];

  for (let i = 0; i < size; i++) {
    const coord: CellCoord =
      orientation === "radial"
        ? { sector: origin.sector, ring: origin.ring + i }
        : { sector: (origin.sector + i) % board.sectors, ring: origin.ring };

    if (getCell(board, coord) === null) return null;
    cells.push(coord);
  }
  return cells;
}

/** Returns true if the given cells are all empty on the board. */
export function validatePlacement(board: Board, cells: CellCoord[]): boolean {
  const occupied = new Set(board.ships.flatMap((s) => s.cells.map(cellKey)));
  return cells.every((c) => getCell(board, c) !== null && !occupied.has(cellKey(c)));
}

/**
 * Places a ship on the board.
 * Returns a new Board with the ship placed, or null if placement is invalid.
 */
export function placeShip(
  board: Board,
  origin: CellCoord,
  type: ShipType,
  orientation: Orientation,
  id: string,
): Board | null {
  const cells = getShipCells(board, origin, type, orientation);
  if (!cells || !validatePlacement(board, cells)) return null;

  const ship: PlacedShip = { id, type, cells, hits: [] };

  const newCells = board.cells.map((row) =>
    row.map((cell) =>
      cells.some((c) => coordsEqual(c, cell.coord))
        ? { ...cell, state: "ship" as const, shipId: id }
        : cell
    )
  );

  return { ...board, cells: newCells, ships: [...board.ships, ship] };
}
