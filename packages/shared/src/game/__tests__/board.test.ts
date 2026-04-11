import { describe, it, expect } from "vitest";
import { createBoard, getCell, cellKey, coordsEqual, isFleetComplete, registerBoard, BOARD_CONFIG } from "../board.js";
import { placeShip } from "../ships.js";
import { INITIAL_FLEET } from "../types.js";

describe("createBoard", () => {
  it("creates board with correct dimensions", () => {
    const board = createBoard();
    expect(board.sectors).toBe(BOARD_CONFIG.sectors);
    expect(board.rings).toBe(BOARD_CONFIG.rings);
    expect(board.cells).toHaveLength(BOARD_CONFIG.sectors);
    expect(board.cells[0]).toHaveLength(BOARD_CONFIG.rings);
  });

  it("all cells start empty", () => {
    const board = createBoard();
    board.cells.flat().forEach((c) => expect(c.state).toBe("empty"));
  });
});

describe("getCell", () => {
  it("returns cell within bounds", () => {
    const board = createBoard();
    expect(getCell(board, { sector: 0, ring: 0 })).not.toBeNull();
  });

  it("returns null out of bounds", () => {
    const board = createBoard();
    expect(getCell(board, { sector: -1, ring: 0 })).toBeNull();
    expect(getCell(board, { sector: 0, ring: 99 })).toBeNull();
    expect(getCell(board, { sector: 99, ring: 0 })).toBeNull();
  });
});

describe("cellKey", () => {
  it("produces unique keys per coord", () => {
    const keys = new Set([
      cellKey({ sector: 0, ring: 0 }),
      cellKey({ sector: 0, ring: 1 }),
      cellKey({ sector: 1, ring: 0 }),
    ]);
    expect(keys.size).toBe(3);
  });
});

describe("coordsEqual", () => {
  it("returns true for same coords", () => {
    expect(coordsEqual({ sector: 2, ring: 3 }, { sector: 2, ring: 3 })).toBe(true);
  });
  it("returns false for different coords", () => {
    expect(coordsEqual({ sector: 2, ring: 3 }, { sector: 2, ring: 2 })).toBe(false);
  });
});

describe("isFleetComplete / registerBoard", () => {
  it("returns false for empty board", () => {
    expect(isFleetComplete(createBoard())).toBe(false);
  });

  it("returns true after placing full fleet", () => {
    let board = createBoard();
    const configs: Array<{ type: (typeof INITIAL_FLEET)[number]; sector: number; ring: number }> = [
      { type: "patrol", sector: 0, ring: 0 },
      { type: "patrol", sector: 1, ring: 0 },
      { type: "patrol", sector: 2, ring: 0 },
      { type: "patrol", sector: 3, ring: 0 },
      { type: "patrol", sector: 4, ring: 0 },
      { type: "recon",  sector: 5, ring: 0 }, // radial: {5,0},{5,1}
      { type: "recon",  sector: 6, ring: 0 }, // radial: {6,0},{6,1}
      { type: "multi",  sector: 7, ring: 0 }, // radial: {7,0},{7,1},{7,2}
      { type: "combat", sector: 0, ring: 2 }, // radial: {0,2},{0,3},{0,4},{0,5}
    ];
    configs.forEach(({ type, sector, ring }, i) => {
      const result = placeShip(board, { sector, ring }, type, "radial", `ship-${i}`);
      expect(result).not.toBeNull();
      board = result!;
    });
    expect(isFleetComplete(board)).toBe(true);
    expect(registerBoard(board)).not.toBeNull();
  });
});
