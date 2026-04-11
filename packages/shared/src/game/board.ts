import type { Board, BoardCell, CellCoord } from "./types.js";
import { INITIAL_FLEET } from "./types.js";

export const BOARD_CONFIG = { sectors: 8, rings: 6 } as const;

export function createBoard(
  sectors = BOARD_CONFIG.sectors,
  rings = BOARD_CONFIG.rings,
): Board {
  const cells: BoardCell[][] = Array.from({ length: sectors }, (_, s) =>
    Array.from({ length: rings }, (_, r) => ({
      coord: { sector: s, ring: r },
      state: "empty",
    }))
  );
  return { sectors, rings, cells, ships: [] };
}

export function getCell(board: Board, coord: CellCoord): BoardCell | null {
  const { sector, ring } = coord;
  if (sector < 0 || sector >= board.sectors) return null;
  if (ring < 0 || ring >= board.rings) return null;
  return board.cells[sector][ring] ?? null;
}

export function cellKey(coord: CellCoord): string {
  return `${coord.sector}:${coord.ring}`;
}

export function coordsEqual(a: CellCoord, b: CellCoord): boolean {
  return a.sector === b.sector && a.ring === b.ring;
}

/** Returns true if the board has all required ships placed. */
export function isFleetComplete(board: Board): boolean {
  const required = [...INITIAL_FLEET].sort();
  const placed = board.ships.map((s) => s.type).sort();
  if (required.length !== placed.length) return false;
  return required.every((t, i) => t === placed[i]);
}

/** Validates the fleet is complete and returns the board ready for battle. */
export function registerBoard(board: Board): Board | null {
  return isFleetComplete(board) ? board : null;
}
