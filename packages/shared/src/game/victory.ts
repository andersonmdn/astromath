import type { Board, GameState } from "./types.js";

export function isAllSunk(board: Board): boolean {
  return board.ships.length > 0 && board.ships.every((s) => s.hits.length === s.cells.length);
}

/**
 * Checks if either player's board is fully sunk and marks a winner.
 * Must be called after each shot against a player's board.
 * The opponent's board being sunk = the other player wins.
 */
export function checkVictory(state: GameState): GameState {
  const [p1, p2] = state.playerIds;
  if (isAllSunk(state.boards[p2])) return { ...state, winner: p1 };
  if (isAllSunk(state.boards[p1])) return { ...state, winner: p2 };
  return state;
}
