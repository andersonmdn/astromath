import { describe, it, expect } from "vitest";
import { createBoard } from "../board.js";
import { placeShip } from "../ships.js";
import { fireAt } from "../fire.js";

function boardWithDestroyer() {
  const board = createBoard();
  return placeShip(board, { sector: 0, ring: 0 }, "destroyer", "radial", "d1")!;
}

describe("fireAt — miss", () => {
  it("returns miss on empty cell", () => {
    const board = boardWithDestroyer();
    const res = fireAt(board, { sector: 1, ring: 0 });
    expect(res).not.toBeNull();
    expect(res!.result.type).toBe("miss");
    expect(res!.board.cells[1][0].state).toBe("miss");
  });

  it("returns null when firing on already-fired cell", () => {
    const board = boardWithDestroyer();
    const after = fireAt(board, { sector: 1, ring: 0 })!.board;
    expect(fireAt(after, { sector: 1, ring: 0 })).toBeNull();
  });
});

describe("fireAt — hit", () => {
  it("marks cell as hit and tracks hits on ship", () => {
    const board = boardWithDestroyer();
    const res = fireAt(board, { sector: 0, ring: 0 });
    expect(res!.result.type).toBe("hit");
    expect(res!.board.cells[0][0].state).toBe("hit");
    expect(res!.board.ships[0].hits).toHaveLength(1);
  });
});

describe("fireAt — sunk", () => {
  it("marks all ship cells as sunk after last hit", () => {
    const board = boardWithDestroyer();
    const after1 = fireAt(board, { sector: 0, ring: 0 })!.board;
    const res = fireAt(after1, { sector: 0, ring: 1 });
    expect(res!.result.type).toBe("sunk");
    expect(res!.result.sunkShip).toBeDefined();
    expect(res!.board.cells[0][0].state).toBe("sunk");
    expect(res!.board.cells[0][1].state).toBe("sunk");
  });
});

describe("fireAt — bounds", () => {
  it("returns null for out-of-bounds coord", () => {
    const board = createBoard();
    expect(fireAt(board, { sector: -1, ring: 0 })).toBeNull();
    expect(fireAt(board, { sector: 0, ring: 99 })).toBeNull();
  });
});
