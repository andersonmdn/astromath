// ─── Coordinates ─────────────────────────────────────────────────────────────

export interface CellCoord {
  sector: number; // 0-based angular segment
  ring: number;   // 0-based radial ring (0 = innermost)
}

export type Orientation = "radial" | "angular";

// ─── Ships ───────────────────────────────────────────────────────────────────

export type ShipType = "destroyer" | "cruiser" | "battleship" | "carrier";

export interface ShipConfig {
  type: ShipType;
  size: number;
}

export const SHIP_CONFIGS: Record<ShipType, ShipConfig> = {
  destroyer:  { type: "destroyer",  size: 2 },
  cruiser:    { type: "cruiser",    size: 3 },
  battleship: { type: "battleship", size: 4 },
  carrier:    { type: "carrier",    size: 5 },
};

// Required fleet: must place all of these before battle starts
export const INITIAL_FLEET: ShipType[] = [
  "carrier",
  "battleship",
  "cruiser",
  "destroyer",
  "destroyer",
];

export interface PlacedShip {
  id: string;
  type: ShipType;
  cells: CellCoord[];
  hits: CellCoord[];
}

// ─── Board ───────────────────────────────────────────────────────────────────

export type CellState = "empty" | "ship" | "hit" | "miss" | "sunk";

export interface BoardCell {
  coord: CellCoord;
  state: CellState;
  shipId?: string;
}

export interface Board {
  sectors: number;
  rings: number;
  cells: BoardCell[][];  // [sector][ring]
  ships: PlacedShip[];
}

// ─── Shot ────────────────────────────────────────────────────────────────────

export type ShotResultType = "hit" | "miss" | "sunk";

export interface ShotResult {
  type: ShotResultType;
  coord: CellCoord;
  sunkShip?: PlacedShip;
}

// ─── Game state ───────────────────────────────────────────────────────────────

export type TurnPhase = "placement" | "battle";

export interface GameState {
  phase: TurnPhase;
  currentPlayerId: string;
  playerIds: [string, string];
  boards: Record<string, Board>;
  winner?: string;
}
