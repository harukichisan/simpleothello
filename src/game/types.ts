export type Disc = 'empty' | 'black' | 'white';
export type Player = 'black' | 'white';
export type Difficulty = 'weak' | 'medium' | 'strong';
export type GameMode = 'cpu' | 'local';
export type Actor = 'player' | 'cpu' | 'system';

export interface CellPosition {
  row: number;
  col: number;
}

export interface MoveOption {
  position: CellPosition;
  flips: CellPosition[];
}

export type Board = Disc[][];

export interface SoundSettings {
  soundEnabled: boolean;
  lastInteractionTimestamp?: number;
}

export interface GameState {
  board: Board;
  currentPlayer: Player;
  legalMoves: MoveOption[];
  moveCount: number;
  gameOver: boolean;
  winner: Player | 'draw' | null;
  historyLength: number;
  soundSettings: SoundSettings;
  mode: GameMode;
  cpuDifficulty: Difficulty;
}

export interface Coord {
  row: number;
  col: number;
}
