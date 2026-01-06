import { Board, CellPosition, Difficulty, GameMode, MoveOption, SoundSettings, Actor, Player, GameState } from './types';
import {
  applyMove,
  cloneBoard,
  createInitialBoard,
  getLegalMoves,
  getOpponent,
  isBoardFull,
  countDiscs
} from './board';
import { selectCpuMove } from './cpu';

interface GameSnapshot {
  board: Board;
  currentPlayer: Player;
  legalMoves: MoveOption[];
  lastMove: MoveOption | null;
  actor: Actor;
  moveCount: number;
}

export interface GameSessionOptions {
  mode?: GameMode;
  difficulty?: Difficulty;
  soundSettings?: SoundSettings;
  cpuMoveResolver?: (board: Board, difficulty: Difficulty, player: Player) => MoveOption | null;
}

export interface MoveResult {
  success: boolean;
  message?: string;
  actor?: Actor;
  flips?: number;
}

const DEFAULT_SOUND: SoundSettings = { soundEnabled: true };

export class GameSession {
  private board: Board;
  private currentPlayer: Player;
  private legalMoves: MoveOption[];
  private difficulty: Difficulty;
  private mode: GameMode;
  private history: GameSnapshot[] = [];
  private gameOver = false;
  private winner: Player | 'draw' | null = null;
  private moveCount = 0;
  private soundSettings: SoundSettings;
  private readonly cpuMoveResolver: (
    board: Board,
    difficulty: Difficulty,
    player: Player
  ) => MoveOption | null;

  constructor(options?: GameSessionOptions) {
    this.mode = options?.mode ?? 'cpu';
    this.difficulty = options?.difficulty ?? 'weak';
    this.soundSettings = options?.soundSettings ?? { ...DEFAULT_SOUND };
    this.cpuMoveResolver = options?.cpuMoveResolver ?? selectCpuMove;

    this.board = createInitialBoard();
    this.currentPlayer = 'black';
    this.legalMoves = getLegalMoves(this.board, this.currentPlayer);
    this.pushSnapshot('system', null);
  }

  public getState(): GameState {
    return {
      board: cloneBoard(this.board),
      currentPlayer: this.currentPlayer,
      legalMoves: this.cloneMoves(this.legalMoves),
      moveCount: this.moveCount,
      gameOver: this.gameOver,
      winner: this.winner,
      historyLength: this.history.length,
      soundSettings: { ...this.soundSettings },
      mode: this.mode,
      cpuDifficulty: this.difficulty
    };
  }

  public setSoundEnabled(enabled: boolean, timestamp?: number): void {
    this.soundSettings = {
      soundEnabled: enabled,
      lastInteractionTimestamp: timestamp ?? Date.now()
    };
  }

  public playerMove(position: CellPosition): MoveResult {
    if (this.gameOver) {
      return { success: false, message: 'The game is already over.' };
    }

    this.resolvePasses();
    if (this.gameOver) {
      return { success: false, message: 'No legal moves remain.' };
    }

    if (this.mode === 'cpu' && this.currentPlayer !== 'black') {
      return { success: false, message: 'It is not the player turn.' };
    }

    const target = this.findMove(position);
    if (!target) {
      return { success: false, message: 'Illegal move.' };
    }

    this.applyMove(target, 'player');

    if (this.mode === 'cpu' && !this.gameOver) {
      this.runCpuTurn();
    }

    return { success: true, actor: 'player', flips: target.flips.length };
  }

  public undo(): boolean {
    if (this.history.length <= 1) {
      return false;
    }

    let entry = this.history.pop();
    if (!entry) {
      return false;
    }

    if (this.mode === 'cpu') {
      while (entry && entry.actor !== 'player' && this.history.length > 1) {
        entry = this.history.pop();
      }
    }

    const last = this.history[this.history.length - 1];
    this.restoreSnapshot(last);
    this.gameOver = this.checkGameOverState();
    this.winner = this.gameOver ? this.computeWinner() : null;
    return true;
  }

  public restart(options?: GameSessionOptions): void {
    this.mode = options?.mode ?? this.mode;
    this.difficulty = options?.difficulty ?? this.difficulty;
    this.soundSettings = options?.soundSettings ?? { ...DEFAULT_SOUND };
    this.currentPlayer = 'black';
    this.board = createInitialBoard();
    this.moveCount = 0;
    this.gameOver = false;
    this.history = [];
    this.legalMoves = getLegalMoves(this.board, this.currentPlayer);
    this.winner = null;
    this.pushSnapshot('system', null);
  }

  private runCpuTurn(): void {
    this.resolvePasses();
    if (this.gameOver || this.currentPlayer !== 'white') {
      return;
    }

    const move = this.cpuMoveResolver(this.board, this.difficulty, 'white');
    if (!move) {
      this.handleAutoPass();
      return;
    }

    this.applyMove(move, 'cpu');
  }

  private applyMove(move: MoveOption, actor: Actor): void {
    this.board = applyMove(this.board, this.currentPlayer, move);
    this.moveCount += 1;
    this.currentPlayer = getOpponent(this.currentPlayer);
    this.pushSnapshot(actor, move);
    this.legalMoves = getLegalMoves(this.board, this.currentPlayer);
    this.updateGameOverStatus();
    if (!this.gameOver) {
      this.resolvePasses();
    }
  }

  private findMove(position: CellPosition): MoveOption | undefined {
    return this.legalMoves.find(
      (move) => move.position.row === position.row && move.position.col === position.col
    );
  }

  private resolvePasses(): void {
    let guard = 0;
    while (!this.gameOver && this.legalMoves.length === 0 && guard < 2) {
      this.handleAutoPass();
      guard += 1;
    }
  }

  private handleAutoPass(): void {
    const opponent = getOpponent(this.currentPlayer);
    const opponentMoves = getLegalMoves(this.board, opponent);
    this.pushSnapshot('system', null);

    if (opponentMoves.length === 0) {
      this.gameOver = true;
      this.winner = this.computeWinner();
      return;
    }

    this.currentPlayer = opponent;
    this.legalMoves = opponentMoves;
  }

  private updateGameOverStatus(): void {
    const blackMoves = getLegalMoves(this.board, 'black');
    const whiteMoves = getLegalMoves(this.board, 'white');

    if (isBoardFull(this.board) || (blackMoves.length === 0 && whiteMoves.length === 0)) {
      this.gameOver = true;
      this.winner = this.computeWinner();
    } else {
      this.gameOver = false;
      this.winner = null;
    }
  }

  private computeWinner(): Player | 'draw' {
    const discs = countDiscs(this.board);
    if (discs.black === discs.white) {
      return 'draw';
    }
    return discs.black > discs.white ? 'black' : 'white';
  }

  private checkGameOverState(): boolean {
    const blackMoves = getLegalMoves(this.board, 'black');
    const whiteMoves = getLegalMoves(this.board, 'white');
    return isBoardFull(this.board) || (blackMoves.length === 0 && whiteMoves.length === 0);
  }

  private cloneMoves(moves: MoveOption[]): MoveOption[] {
    return moves.map((move) => ({
      position: { ...move.position },
      flips: move.flips.map((flip) => ({ ...flip }))
    }));
  }

  private pushSnapshot(actor: Actor, lastMove: MoveOption | null): void {
    this.history.push({
      board: cloneBoard(this.board),
      currentPlayer: this.currentPlayer,
      legalMoves: this.cloneMoves(this.legalMoves),
      lastMove,
      actor,
      moveCount: this.moveCount
    });
  }

  private restoreSnapshot(snapshot: GameSnapshot): void {
    this.board = cloneBoard(snapshot.board);
    this.currentPlayer = snapshot.currentPlayer;
    this.legalMoves = this.cloneMoves(snapshot.legalMoves);
    this.moveCount = snapshot.moveCount;
  }
}
