"use client";

import type { Coord, Disc } from "@/src/game/types";

interface BoardProps {
  board: Disc[][];
  legalMoves: Coord[];
  onCellClick: (coord: Coord) => void;
}

const isLegalMove = (legalMoves: Coord[], coord: Coord) =>
  legalMoves.some((move) => move.row === coord.row && move.col === coord.col);

export default function Board({ board, legalMoves, onCellClick }: BoardProps) {
  return (
    <div className="board-grid">
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const coord = { row: rowIndex, col: colIndex };
          const legal = isLegalMove(legalMoves, coord);
          return (
            <button
              key={`${rowIndex}-${colIndex}`}
              className={`board-cell ${legal ? "legal" : ""}`}
              onClick={() => onCellClick(coord)}
              disabled={!legal}
              type="button"
              data-disc={cell === "empty" ? "" : cell}
            >
              <span className="disc" aria-hidden="true" />
            </button>
          );
        })
      )}
    </div>
  );
}

