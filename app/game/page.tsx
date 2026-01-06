"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Board from "@/components/Board";
import Controls from "@/components/Controls";
import HUD from "@/components/HUD";
import { Coord, Disc, Difficulty, Player } from "@/src/game/types";

const createInitialBoard = (): Disc[][] =>
  Array.from({ length: 8 }, () =>
    Array.from({ length: 8 }, () => "empty" as Disc)
  ).map((row, rowIndex) =>
    row.map((_, colIndex) => {
      if ((rowIndex === 3 && colIndex === 3) || (rowIndex === 4 && colIndex === 4)) {
        return "white";
      }
      if ((rowIndex === 3 && colIndex === 4) || (rowIndex === 4 && colIndex === 3)) {
        return "black";
      }
      return "empty";
    })
  );

const initialLegalMoves: Coord[] = [
  { row: 2, col: 3 },
  { row: 3, col: 2 },
  { row: 4, col: 5 },
  { row: 5, col: 4 }
];

const storageKey = "simpleothello-sound";

function GameContent() {
  const searchParams = useSearchParams();
  const difficultyParam = searchParams.get("difficulty");
  const knownDifficulties: Difficulty[] = ["weak", "medium", "strong"];
  const difficulty = knownDifficulties.includes(difficultyParam as Difficulty)
    ? (difficultyParam as Difficulty)
    : "weak";
  const modeParam = searchParams.get("mode");
  const mode = modeParam === "local" ? "local" : "cpu";

  const [board, setBoard] = useState<Disc[][]>(() => createInitialBoard());
  const [legalMoves, setLegalMoves] = useState<Coord[]>(initialLegalMoves);
  const [turn, setTurn] = useState<Player>("black");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [status, setStatus] = useState("合法手をクリックしてください");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(storageKey);
    if (raw) {
      setSoundEnabled(raw === "true");
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(storageKey, soundEnabled ? "true" : "false");
  }, [soundEnabled]);

  const { black: blackScore, white: whiteScore } = useMemo(() => {
    const counts = { black: 0, white: 0 };
    board.forEach((row) =>
      row.forEach((cell) => {
        if (cell === "black") {
          counts.black += 1;
        } else if (cell === "white") {
          counts.white += 1;
        }
      })
    );
    return counts;
  }, [board]);

  const handleMove = (coord: Coord) => {
    const isLegal = legalMoves.some(
      (move) => move.row === coord.row && move.col === coord.col
    );
    if (!isLegal) {
      setStatus("選べる位置をタップしてください");
      return;
    }

    setBoard((prev) =>
      prev.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          if (rowIndex === coord.row && colIndex === coord.col) {
            return turn;
          }
          return cell;
        })
      )
    );
    setLegalMoves((prev) =>
      prev.filter((move) => move.row !== coord.row || move.col !== coord.col)
    );
    setTurn((prev) => (prev === "black" ? "white" : "black"));
    setStatus(`${turn === "black" ? "黒" : "白"} が着手しました`);

    if (mode === "cpu" && turn === "black") {
      setStatus("CPU（白）思考中...");
      setTimeout(() => {
        setStatus("CPU（白）がパスしました");
        setTurn("black");
      }, 1200);
    }
  };

  const handleUndo = () => {
    setBoard(createInitialBoard());
    setTurn("black");
    setLegalMoves(initialLegalMoves);
    setStatus("Undo: 初期状態に戻りました");
  };

  const handleRestart = () => {
    setBoard(createInitialBoard());
    setTurn("black");
    setLegalMoves(initialLegalMoves);
    setStatus("リスタートしました");
  };

  const handleToggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  return (
    <section className="game-panel">
      <HUD
        turn={turn}
        blackScore={blackScore}
        whiteScore={whiteScore}
        status={status}
        difficulty={difficulty}
        mode={mode}
      />
      <Board board={board} legalMoves={legalMoves} onCellClick={handleMove} />
      <Controls
        onUndo={handleUndo}
        onRestart={handleRestart}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />
    </section>
  );
}

export default function GamePage() {
  return (
    <main className="page-shell">
      <Suspense fallback={<div>Loading game...</div>}>
        <GameContent />
      </Suspense>
    </main>
  );
}
