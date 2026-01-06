"use client";

import type { Player } from "@/src/game/types";

interface HUDProps {
  turn: Player;
  blackScore: number;
  whiteScore: number;
  status: string;
  difficulty: string;
  mode: "cpu" | "local";
}

export default function HUD({
  turn,
  blackScore,
  whiteScore,
  status,
  difficulty,
  mode
}: HUDProps) {
  return (
    <div className="hud">
      <div>
        <p className="turn-indicator">手番: {turn === "black" ? "黒" : "白"}</p>
        <p>モード: {mode === "cpu" ? "CPU" : "ローカル"} ({difficulty})</p>
      </div>
      <div className="scores">
        <div>黒: {blackScore}</div>
        <div>白: {whiteScore}</div>
      </div>
      <p>{status}</p>
    </div>
  );
}

