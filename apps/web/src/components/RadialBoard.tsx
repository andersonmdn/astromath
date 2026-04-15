"use client";

import type { Board, CellCoord } from "@astromath/shared";
import { BOARD_CONFIG, SHIP_CONFIGS, coordsEqual } from "@astromath/shared";

const SVG_SIZE = 380;
const CX = 190;
const CY = 190;
const INNER_RADIUS = 30;
const RING_WIDTH = 25;

function polarToCart(r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}

function describeCellPath(sector: number, ring: number): string {
  const innerR = INNER_RADIUS + ring * RING_WIDTH;
  const outerR = innerR + RING_WIDTH;
  const degPerSector = 360 / BOARD_CONFIG.sectors;
  const startDeg = -90 + sector * degPerSector;
  const endDeg = startDeg + degPerSector;

  const os = polarToCart(outerR, startDeg);
  const oe = polarToCart(outerR, endDeg);
  const ie = polarToCart(innerR, endDeg);
  const is_ = polarToCart(innerR, startDeg);

  const fmt = (n: number) => n.toFixed(3);
  return [
    `M ${fmt(os.x)} ${fmt(os.y)}`,
    `A ${outerR} ${outerR} 0 0 1 ${fmt(oe.x)} ${fmt(oe.y)}`,
    `L ${fmt(ie.x)} ${fmt(ie.y)}`,
    `A ${innerR} ${innerR} 0 0 0 ${fmt(is_.x)} ${fmt(is_.y)}`,
    "Z",
  ].join(" ");
}

interface RadialBoardProps {
  board: Board;
  previewCells?: CellCoord[];
  previewValid?: boolean;
  interactive?: boolean;
  onCellClick?: (coord: CellCoord) => void;
  onCellHover?: (coord: CellCoord | null) => void;
  cellColors?: Map<string, string>;
}

export function RadialBoard({
  board,
  previewCells = [],
  previewValid = false,
  interactive = false,
  onCellClick,
  onCellHover,
  cellColors,
}: RadialBoardProps) {
  return (
    <svg
      width={SVG_SIZE}
      height={SVG_SIZE}
      viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
      className="select-none shrink-0"
      onMouseLeave={() => onCellHover?.(null)}
    >
      {Array.from({ length: BOARD_CONFIG.sectors }, (_, s) =>
        Array.from({ length: BOARD_CONFIG.rings }, (_, r) => {
          const coord: CellCoord = { sector: s, ring: r };
          const cell = board.cells[s][r];
          const isPreview = previewCells.some((c) => coordsEqual(c, coord));

          let fill = "#1f2937";
          if (isPreview) {
            fill = previewValid ? "#14532d" : "#7f1d1d";
          } else {
            if (cell.state === "ship") {
              const ship = cell.shipId ? board.ships.find((s) => s.id === cell.shipId) : null;
              fill = ship ? SHIP_CONFIGS[ship.type].color : "#4338ca";
            } else if (cell.state === "hit") fill = cellColors?.get(`${s},${r}`) ?? "#dc2626";
            else if (cell.state === "miss") fill = "#4b5563";
            else if (cell.state === "sunk") fill = cellColors?.get(`${s},${r}`) ?? "#7f1d1d";
          }

          return (
            <path
              key={`${s}-${r}`}
              d={describeCellPath(s, r)}
              fill={fill}
              stroke="#030712"
              strokeWidth="1.5"
              style={{ cursor: interactive ? "pointer" : "default" }}
              onClick={() => interactive && onCellClick?.(coord)}
              onMouseEnter={() => interactive && onCellHover?.(coord)}
            />
          );
        })
      )}
    </svg>
  );
}
