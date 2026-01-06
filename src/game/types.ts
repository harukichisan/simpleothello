export type Disc = "empty" | "black" | "white";
export type Player = "black" | "white";
export type Difficulty = "weak" | "medium" | "strong";

export interface Coord {
  row: number;
  col: number;
}

export interface GameState {
  board: Disc[][];
  turn: Player;
  mode: "cpu" | "local";
  legalMoves: Coord[];
  undoHistory: Array<{
    board: Disc[][];
    turn: Player;
    mode: "cpu" | "local";
    legalMoves: Coord[];
  }>;
  gameOver: boolean;
  winner: Player | "draw" | null;
  soundEnabled: boolean;
}
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
