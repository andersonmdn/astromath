import type { GameState } from "./types.js";

export function switchTurn(state: GameState): GameState {
  const [p1, p2] = state.playerIds;
  const next = state.currentPlayerId === p1 ? p2 : p1;
  return { ...state, currentPlayerId: next };
}

export function isCurrentPlayer(state: GameState, playerId: string): boolean {
  return state.currentPlayerId === playerId;
}
