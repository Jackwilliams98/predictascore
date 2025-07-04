import React from "react";

interface ScoreEditorProps {
  team: string;
  fixtureId: string;
  value: number;
  onChange: (fixtureId: string, team: string, score: number) => void;
}

const ScoreEditor: React.FC<ScoreEditorProps> = ({
  value,
  onChange,
  fixtureId,
  team,
}) => {
  const min = 0;
  const max = 10;
  const step = 1;

  const handleDecrement = () => {
    if (value > min) onChange(fixtureId, team, value - step);
  };

  const handleIncrement = () => {
    if (value < max) onChange(fixtureId, team, value + step);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <button type="button" onClick={handleDecrement} disabled={value <= min}>
        -
      </button>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => {
          const newValue = Number(e.target.value);
          if (newValue >= min && newValue <= max) {
            onChange(fixtureId, team, newValue);
          }
        }}
        style={{ width: 50, textAlign: "center" }}
      />
      <button type="button" onClick={handleIncrement} disabled={value >= max}>
        +
      </button>
    </div>
  );
};

export default ScoreEditor;
