import { describe, expect, it } from "vitest";
import {
  applyMove,
  countDiscs,
  getLegalMoves,
  initializeBoard,
  isGameOver,
} from "../../src/game/board";
import { Coord } from "../../src/game/types";

describe("board utility", () => {
  it("initializes standard board and exposes four legal moves", () => {
    const board = initializeBoard();
    const legalMoves = getLegalMoves(board, "black");
    expect(board[3][3]).toBe("white");
    expect(board[3][4]).toBe("black");
    expect(board[4][3]).toBe("black");
    expect(board[4][4]).toBe("white");
    expect(legalMoves.length).toBe(4);
  });

  it("flips discs along valid directions when a move is applied", () => {
    const board = initializeBoard();
    const legalMoves = getLegalMoves(board, "black");
    const move: Coord = legalMoves[0];
    const { board: nextBoard } = applyMove(board, "black", move);
    const counts = countDiscs(nextBoard);
    expect(counts.black).toBeGreaterThan(counts.white);
  });

  it("detects game over when no legal moves exist and both players pass", () => {
    const board = Array.from({ length: 8 }, () =>
      Array.from({ length: 8 }, () => "black" as const)
    );
    const passes = 2;
    const legalMoves: Coord[] = [];
    expect(isGameOver(board, legalMoves, passes)).toBe(true);
  });
});
import { describe, expect, it } from 'vitest';
import {
  applyMove,
  countDiscs,
  createInitialBoard,
  getLegalMoves
} from '../../src/game/board';

describe('board rules', () => {
  it('provides four starting moves for black', () => {
    const board = createInitialBoard();
    const moves = getLegalMoves(board, 'black');
    expect(moves).toHaveLength(4);
  });

  it('flips the intervening discs when a legal move is applied', () => {
    const board = createInitialBoard();
    const move = getLegalMoves(board, 'black').find((m) => m.position.row === 2);
    expect(move).toBeDefined();

    if (!move) {
      throw new Error('Initial move not found');
    }

    const next = applyMove(board, 'black', move);
    const discCount = countDiscs(next);
    expect(discCount.black).toBeGreaterThan(discCount.white);
  });
});
