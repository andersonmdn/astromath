import { describe, it, expect } from "vitest";
import { createBoard } from "../board.js";
import { getShipCells, validatePlacement, placeShip } from "../ships.js";

describe("getShipCells — radial", () => {
  it("returns cells extending outward in same sector", () => {
    const board = createBoard();
    const cells = getShipCells(board, { sector: 0, ring: 0 }, "destroyer", "radial");
    expect(cells).toEqual([
      { sector: 0, ring: 0 },
      { sector: 0, ring: 1 },
    ]);
  });

  it("returns null when ship goes out of bounds", () => {
    const board = createBoard(); // rings: 6 → max ring index 5
    const cells = getShipCells(board, { sector: 0, ring: 5 }, "destroyer", "radial");
    expect(cells).toBeNull();
  });
});

describe("getShipCells — angular", () => {
  it("returns cells along the same ring across sectors", () => {
    const board = createBoard();
    const cells = getShipCells(board, { sector: 0, ring: 0 }, "destroyer", "angular");
    expect(cells).toEqual([
      { sector: 0, ring: 0 },
      { sector: 1, ring: 0 },
    ]);
  });

  it("wraps around sectors", () => {
    const board = createBoard(); // sectors: 8
    const cells = getShipCells(board, { sector: 7, ring: 0 }, "destroyer", "angular");
    expect(cells).toEqual([
      { sector: 7, ring: 0 },
      { sector: 0, ring: 0 },
    ]);
  });
});

describe("validatePlacement", () => {
  it("allows placement on empty board", () => {
    const board = createBoard();
    expect(validatePlacement(board, [{ sector: 0, ring: 0 }, { sector: 0, ring: 1 }])).toBe(true);
  });

  it("rejects placement on occupied cells", () => {
    const board = createBoard();
    const placed = placeShip(board, { sector: 0, ring: 0 }, "destroyer", "radial", "s1")!;
    expect(validatePlacement(placed, [{ sector: 0, ring: 0 }])).toBe(false);
  });
});

describe("placeShip", () => {
  it("returns updated board with ship state", () => {
    const board = createBoard();
    const result = placeShip(board, { sector: 0, ring: 0 }, "destroyer", "radial", "s1");
    expect(result).not.toBeNull();
    expect(result!.ships).toHaveLength(1);
    expect(result!.cells[0][0].state).toBe("ship");
    expect(result!.cells[0][1].state).toBe("ship");
  });

  it("returns null on collision", () => {
    let board = createBoard();
    board = placeShip(board, { sector: 0, ring: 0 }, "destroyer", "radial", "s1")!;
    const result = placeShip(board, { sector: 0, ring: 0 }, "cruiser", "radial", "s2");
    expect(result).toBeNull();
  });

  it("does not mutate the original board", () => {
    const board = createBoard();
    placeShip(board, { sector: 0, ring: 0 }, "destroyer", "radial", "s1");
    expect(board.ships).toHaveLength(0);
  });
});
