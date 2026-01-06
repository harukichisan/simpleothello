import { describe, expect, it } from "vitest";
import {
  applyPlayerMove,
  createInitialState,
  restartGame,
  undoLastPair,
} from "../../src/game/session";

describe("game session orchestration", () => {
  it("initializes a CPU session with black as the first player", () => {
    const state = createInitialState("weak");
    expect(state.turn).toBe("black");
    expect(state.mode).toBe("cpu");
    expect(state.gameOver).toBe(false);
  });

  it("records history and switches turn after a player move", () => {
    const state = createInitialState("medium");
    const next = applyPlayerMove(state, { row: 2, col: 3 });
    expect(next.undoHistory.length).toBe(state.undoHistory.length + 1);
    expect(next.turn).toBe("white");
  });

  it("undo returns the state before the player-CPU pair completed", () => {
    const state = createInitialState("strong");
    const next = applyPlayerMove(state, { row: 2, col: 3 });
    const undone = undoLastPair(next);
    expect(undone.turn).toBe("black");
    expect(undone.undoHistory.length).toBe(state.undoHistory.length);
  });

  it("restart resets history and winner flag", () => {
    const state = createInitialState("weak");
    const withMove = applyPlayerMove(state, { row: 2, col: 3 });
    const restarted = restartGame(withMove);
    expect(restarted.undoHistory.length).toBe(state.undoHistory.length);
    expect(restarted.winner).toBe(null);
    expect(restarted.gameOver).toBe(false);
  });
});
import { describe, expect, it } from 'vitest';
import { getLegalMoves } from '../../src/game/board';
import { GameSession } from '../../src/game/session';
import { Board, Difficulty, Player } from '../../src/game/types';

const pickFirstMove = () => (board: Board, _difficulty: Difficulty, player: Player) =>
  getLegalMoves(board, player)[0] ?? null;

describe('GameSession', () => {
  it('records a player move, a CPU response, and rewinds via undo', () => {
    const session = new GameSession({ cpuMoveResolver: pickFirstMove() });
    const initial = session.getState();

    expect(initial.legalMoves).toHaveLength(4);

    const moveAttempt = initial.legalMoves[0];
    const result = session.playerMove(moveAttempt.position);
    expect(result.success).toBe(true);

    const intermediate = session.getState();
    expect(intermediate.historyLength).toBeGreaterThan(initial.historyLength);
    expect(intermediate.moveCount).toBeGreaterThan(0);

    const undone = session.undo();
    expect(undone).toBe(true);

    const afterUndo = session.getState();
    expect(afterUndo.historyLength).toBe(1);
    expect(afterUndo.moveCount).toBe(0);
    expect(afterUndo.currentPlayer).toBe('black');
  });

  it('supports local two-player alternation, undo, and restart', () => {
    const session = new GameSession({ mode: 'local' });
    const initial = session.getState();

    expect(initial.currentPlayer).toBe('black');
    const firstMove = initial.legalMoves[0];
    expect(session.playerMove(firstMove.position).success).toBe(true);

    const afterFirst = session.getState();
    expect(afterFirst.currentPlayer).toBe('white');
    expect(afterFirst.historyLength).toBe(2);

    const whiteMove = afterFirst.legalMoves[0];
    expect(session.playerMove(whiteMove.position).success).toBe(true);

    const afterWhite = session.getState();
    expect(afterWhite.currentPlayer).toBe('black');
    expect(afterWhite.moveCount).toBe(2);

    expect(session.undo()).toBe(true);
    const afterUndo = session.getState();
    expect(afterUndo.currentPlayer).toBe('white');
    expect(afterUndo.moveCount).toBe(1);

    session.restart();
    const restarted = session.getState();
    expect(restarted.moveCount).toBe(0);
    expect(restarted.currentPlayer).toBe('black');
    expect(restarted.historyLength).toBe(1);
  });
});
