import { describe, it, expect } from "vitest";
import { switchTurn, isCurrentPlayer } from "../turn.js";
import type { GameState } from "../types.js";
import { createBoard } from "../board.js";

function makeState(): GameState {
  return {
    phase: "battle",
    currentPlayerId: "p1",
    playerIds: ["p1", "p2"],
    boards: { p1: createBoard(), p2: createBoard() },
  };
}

describe("switchTurn", () => {
  it("switches from p1 to p2", () => {
    const state = makeState();
    expect(switchTurn(state).currentPlayerId).toBe("p2");
  });

  it("switches from p2 back to p1", () => {
    const state = { ...makeState(), currentPlayerId: "p2" };
    expect(switchTurn(state).currentPlayerId).toBe("p1");
  });

  it("does not mutate original state", () => {
    const state = makeState();
    switchTurn(state);
    expect(state.currentPlayerId).toBe("p1");
  });
});

describe("isCurrentPlayer", () => {
  it("returns true for current player", () => {
    expect(isCurrentPlayer(makeState(), "p1")).toBe(true);
  });
  it("returns false for other player", () => {
    expect(isCurrentPlayer(makeState(), "p2")).toBe(false);
  });
});
