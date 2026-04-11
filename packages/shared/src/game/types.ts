// ─── Coordinates ─────────────────────────────────────────────────────────────

export interface CellCoord {
  sector: number; // 0-based angular segment
  ring: number;   // 0-based radial ring (0 = innermost)
}

export type Orientation = "radial" | "angular";

// ─── Ships ───────────────────────────────────────────────────────────────────

export type ShipType = "patrol" | "recon" | "multi" | "combat";

export interface ShipConfig {
  type: ShipType;
  label: string;
  size: number;
  totalGroups: number;
  allowedOrientations: Orientation[] | null; // null = both; restricted list otherwise
  color: string;
}

export const SHIP_CONFIGS: Record<ShipType, ShipConfig> = {
  patrol: { type: "patrol", label: "Patrulha",       size: 1, totalGroups: 5, allowedOrientations: null,         color: "#0891b2" },
  recon:  { type: "recon",  label: "Reconhecimento", size: 2, totalGroups: 2, allowedOrientations: null,         color: "#ea580c" },
  multi:  { type: "multi",  label: "Multifunção",    size: 3, totalGroups: 1, allowedOrientations: null,         color: "#7c3aed" },
  combat: { type: "combat", label: "Combate",        size: 4, totalGroups: 1, allowedOrientations: ["angular"],  color: "#15803d" },
};

// Required fleet: must place all of these before battle starts
export const INITIAL_FLEET: ShipType[] = [
  "patrol", "patrol", "patrol", "patrol", "patrol",
  "recon", "recon",
  "multi",
  "combat",
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
