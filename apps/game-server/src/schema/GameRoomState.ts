import { Schema, type, MapSchema } from "@colyseus/schema";

export class PlayerState extends Schema {
  @type("string") id: string = "";
  @type("string") name: string = "";
  @type("boolean") isReady: boolean = false;
  @type("boolean") boardReady: boolean = false;
}

export type GamePhase = "lobby" | "placement" | "battle" | "finished";

export type RoomMode = "classic" | "math";

export class GameRoomState extends Schema {
  @type({ map: PlayerState }) players = new MapSchema<PlayerState>();
  @type("string") phase: GamePhase = "lobby";
  @type("string") currentTurn: string = "";
  @type("string") winner: string = "";
  @type("string") mode: RoomMode = "classic";
}
