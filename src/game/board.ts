import { Board, CellPosition, Disc, MoveOption, Player } from './types';

export const BOARD_SIZE = 8;
const DIRECTIONS = [
  { dr: -1, dc: -1 },
  { dr: -1, dc: 0 },
  { dr: -1, dc: 1 },
  { dr: 0, dc: -1 },
  { dr: 0, dc: 1 },
  { dr: 1, dc: -1 },
  { dr: 1, dc: 0 },
  { dr: 1, dc: 1 }
];

export function createInitialBoard(): Board {
  const board: Board = Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => 'empty' as Disc)
  );

  const mid = BOARD_SIZE / 2;
  board[mid - 1][mid - 1] = 'white';
  board[mid][mid] = 'white';
  board[mid - 1][mid] = 'black';
  board[mid][mid - 1] = 'black';

  return board;
}

export function cloneBoard(board: Board): Board {
  return board.map((row) => [...row]);
}

export function getOpponent(player: Player): Player {
  return player === 'black' ? 'white' : 'black';
}

export function withinBounds(row: number, col: number): boolean {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
}

export function getLegalMoves(board: Board, player: Player): MoveOption[] {
  const opponent = getOpponent(player);
  const moves: MoveOption[] = [];

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      if (board[row][col] !== 'empty') {
        continue;
      }

      const collected: CellPosition[] = [];

      for (const direction of DIRECTIONS) {
        const flipped: CellPosition[] = [];
        let r = row + direction.dr;
        let c = col + direction.dc;
        let seenOpponent = false;

        while (withinBounds(r, c) && board[r][c] === opponent) {
          flipped.push({ row: r, col: c });
          seenOpponent = true;
          r += direction.dr;
          c += direction.dc;
        }

        if (
          seenOpponent &&
          withinBounds(r, c) &&
          board[r][c] === player
        ) {
          collected.push(...flipped);
        }
      }

      if (collected.length > 0) {
        moves.push({ position: { row, col }, flips: collected });
      }
    }
  }

  return moves;
}

export function findMoveForPosition(
  moves: MoveOption[],
  position: CellPosition
): MoveOption | undefined {
  return moves.find(
    (move) => move.position.row === position.row && move.position.col === position.col
  );
}

export function applyMove(board: Board, player: Player, move: MoveOption): Board {
  const nextBoard = cloneBoard(board);
  nextBoard[move.position.row][move.position.col] = player;

  for (const flip of move.flips) {
    nextBoard[flip.row][flip.col] = player;
  }

  return nextBoard;
}

export function countDiscs(board: Board): { black: number; white: number } {
  return board.reduce(
    (acc, row) => {
      for (const disc of row) {
        if (disc === 'black') {
          acc.black += 1;
        }
        if (disc === 'white') {
          acc.white += 1;
        }
      }
      return acc;
    },
    { black: 0, white: 0 }
  );
}

export function isBoardFull(board: Board): boolean {
  return board.every((row) => row.every((cell) => cell !== 'empty'));
}
