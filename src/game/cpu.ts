import { Board, Difficulty, MoveOption, Player } from './types';
import {
  applyMove,
  countDiscs,
  getLegalMoves,
  getOpponent,
  isBoardFull
} from './board';

const POSITION_WEIGHTS = [
  [120, -20, 20, 5, 5, 20, -20, 120],
  [-20, -40, -5, -5, -5, -5, -40, -20],
  [20, -5, 15, 3, 3, 15, -5, 20],
  [5, -5, 3, 3, 3, 3, -5, 5],
  [5, -5, 3, 3, 3, 3, -5, 5],
  [20, -5, 15, 3, 3, 15, -5, 20],
  [-20, -40, -5, -5, -5, -5, -40, -20],
  [120, -20, 20, 5, 5, 20, -20, 120]
];

const MINIMAX_DEPTH = 3;

export function selectCpuMove(
  board: Board,
  difficulty: Difficulty,
  player: Player = 'white'
): MoveOption | null {
  const moves = getLegalMoves(board, player);
  if (moves.length === 0) {
    return null;
  }

  if (difficulty === 'weak') {
    return selectWorstCaseMove(moves);
  }

  if (difficulty === 'medium') {
    return selectHeuristicMove(board, moves);
  }

  return selectStrongMove(board, player);
}

function selectWorstCaseMove(moves: MoveOption[]): MoveOption {
  return moves.reduce((best, current) =>
    current.flips.length > best.flips.length ? current : best
  );
}

function selectHeuristicMove(board: Board, moves: MoveOption[]): MoveOption {
  return moves.reduce((best, current) => {
    const currentScore = evaluatePosition(current.position) + current.flips.length;
    const bestScore = evaluatePosition(best.position) + best.flips.length;
    return currentScore > bestScore ? current : best;
  });
}

function selectStrongMove(board: Board, player: Player): MoveOption {
  const { move } = minimax(board, player, MINIMAX_DEPTH, -Infinity, Infinity);
  return move ?? getLegalMoves(board, player)[0];
}

function evaluatePosition(position: MoveOption['position']): number {
  return POSITION_WEIGHTS[position.row][position.col];
}

function evaluateBoard(board: Board): number {
  let score = 0;
  for (let r = 0; r < board.length; r += 1) {
    for (let c = 0; c < board[r].length; c += 1) {
      const cell = board[r][c];
      if (cell === 'white') {
        score += POSITION_WEIGHTS[r][c];
      }
      if (cell === 'black') {
        score -= POSITION_WEIGHTS[r][c];
      }
    }
  }

  const discCount = countDiscs(board);
  score += (discCount.white - discCount.black) * 2;
  return score;
}

function minimax(
  board: Board,
  player: Player,
  depth: number,
  alpha: number,
  beta: number
): { score: number; move?: MoveOption } {
  if (depth === 0 || isBoardFull(board)) {
    return { score: evaluateBoard(board) };
  }

  const moves = getLegalMoves(board, player);
  if (moves.length === 0) {
    const opponent = getOpponent(player);
    const opponentMoves = getLegalMoves(board, opponent);
    if (opponentMoves.length === 0) {
      return { score: evaluateBoard(board) };
    }
    return minimax(board, opponent, depth - 1, alpha, beta);
  }

  const maximizing = player === 'white';
  let bestScore = maximizing ? -Infinity : Infinity;
  let bestMove: MoveOption | undefined;

  for (const move of moves) {
    const nextBoard = applyMove(board, player, move);
    const { score } = minimax(nextBoard, getOpponent(player), depth - 1, alpha, beta);

    if (maximizing) {
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
      alpha = Math.max(alpha, bestScore);
    } else {
      if (score < bestScore) {
        bestScore = score;
        bestMove = move;
      }
      beta = Math.min(beta, bestScore);
    }

    if (beta <= alpha) {
      break;
    }
  }

  return { score: bestScore, move: bestMove };
}
