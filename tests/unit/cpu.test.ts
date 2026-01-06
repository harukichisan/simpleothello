import { describe, expect, it } from "vitest";
import { selectMove } from "../../src/game/cpu";

const emptyBoard = Array.from({ length: 8 }, () =>
  Array.from({ length: 8 }, () => "empty" as const)
);

describe("CPU difficulty selectors", () => {
  it("weak CPU returns one of the legal moves", () => {
    const legalMoves = [
      { row: 2, col: 3 },
      { row: 3, col: 2 },
      { row: 4, col: 5 },
      { row: 5, col: 4 },
    ];
    const move = selectMove(emptyBoard, "black", "weak", legalMoves);
    expect(move).toBeDefined();
    expect(legalMoves).toContainEqual(move);
  });

  it("medium CPU prefers corners when available", () => {
    const legalMoves = [
      { row: 0, col: 0 },
      { row: 2, col: 3 },
    ];
    const move = selectMove(emptyBoard, "black", "medium", legalMoves);
    expect(move).toEqual({ row: 0, col: 0 });
  });

  it("strong CPU always returns the best available move from the heuristic set", () => {
    const legalMoves = [
      { row: 3, col: 2 },
      { row: 0, col: 7 },
    ];
    const move = selectMove(emptyBoard, "black", "strong", legalMoves);
    expect(move).toEqual({ row: 0, col: 7 });
  });
});
import { describe, expect, it } from 'vitest';
import { createInitialBoard } from '../../src/game/board';
import { selectCpuMove } from '../../src/game/cpu';
import { Board } from '../../src/game/types';

describe('cpu heuristics', () => {
  it('chooses a move on the initial board even at weak difficulty', () => {
    const board = createInitialBoard();
    const move = selectCpuMove(board, 'weak');
    expect(move).not.toBeNull();
    expect(move?.flips.length).toBeGreaterThan(0);
  });

  it('returns null when no legal moves exist', () => {
    const board: Board = Array.from({ length: 8 }, () =>
      Array.from({ length: 8 }, () => 'black' as const)
    );
    const move = selectCpuMove(board, 'strong');
    expect(move).toBeNull();
  });
});
