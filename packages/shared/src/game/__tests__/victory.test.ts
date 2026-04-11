import { describe, it, expect } from "vitest";
import { isAllSunk, checkVictory } from "../victory.js";
import { createBoard } from "../board.js";
import { placeShip } from "../ships.js";
import { fireAt } from "../fire.js";
import type { GameState } from "../types.js";

function sunkDestroyerBoard() {
  let board = createBoard();
  board = placeShip(board, { sector: 0, ring: 0 }, "destroyer", "radial", "d1")!;
  board = fireAt(board, { sector: 0, ring: 0 })!.board;
  board = fireAt(board, { sector: 0, ring: 1 })!.board;
  return board;
}

describe("isAllSunk", () => {
  it("returns false on empty board (no ships)", () => {
    expect(isAllSunk(createBoard())).toBe(false);
  });

  it("returns false when ship is still alive", () => {
    const board = placeShip(createBoard(), { sector: 0, ring: 0 }, "destroyer", "radial", "d1")!;
    expect(isAllSunk(board)).toBe(false);
  });

  it("returns true when all ships are sunk", () => {
    expect(isAllSunk(sunkDestroyerBoard())).toBe(true);
  });
});

describe("checkVictory", () => {
  function makeState(p2Board = createBoard()): GameState {
    return {
      phase: "battle",
      currentPlayerId: "p1",
      playerIds: ["p1", "p2"],
      boards: { p1: createBoard(), p2: p2Board },
    };
  }

  it("returns no winner when boards are alive", () => {
    const state = checkVictory(makeState());
    expect(state.winner).toBeUndefined();
  });

  it("sets p1 as winner when p2 board is fully sunk", () => {
    const state = checkVictory(makeState(sunkDestroyerBoard()));
    expect(state.winner).toBe("p1");
  });
});
