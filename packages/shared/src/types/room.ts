export type RoomStatus = "waiting" | "playing" | "finished";

export interface RoomState {
  id: string;
  status: RoomStatus;
  players: string[];
  maxPlayers: number;
}
