"use client";

interface ControlsProps {
  onUndo: () => void;
  onRestart: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export default function Controls({
  onUndo,
  onRestart,
  soundEnabled,
  onToggleSound
}: ControlsProps) {
  return (
    <div className="controls">
      <button type="button" className="undo" onClick={onUndo}>
        Undo
      </button>
      <button type="button" className="restart" onClick={onRestart}>
        Restart
      </button>
      <button type="button" className="sound" onClick={onToggleSound}>
        サウンド {soundEnabled ? "ON" : "OFF"}
      </button>
    </div>
  );
}

