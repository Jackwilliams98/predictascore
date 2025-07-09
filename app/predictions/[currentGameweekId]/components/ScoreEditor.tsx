import React from "react";
import { Icon } from "@chakra-ui/react";
import { AiOutlinePlus } from "react-icons/ai";
import { AiOutlineMinus } from "react-icons/ai";

import { Button } from "@/components";
import Text from "@/components/Text/Text";

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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-around",
        maxWidth: 200,
      }}
    >
      <Button
        type="button"
        style={{ aspectRatio: "1" }}
        onClick={handleIncrement}
        disabled={value >= max}
      >
        <Icon name="add">
          <AiOutlinePlus />
        </Icon>
      </Button>
      <Text.Header>{value}</Text.Header>
      <Button
        type="button"
        style={{ aspectRatio: "1" }}
        onClick={handleDecrement}
        disabled={value <= min}
      >
        <Icon name="subtract">
          <AiOutlineMinus />
        </Icon>
      </Button>
    </div>
  );
};

export default ScoreEditor;
