"use client";

import React from "react";
import ScoreEditor from "./ScoreEditor";
import Text from "@/components/Text/Text";
import classes from "../../Predictions.module.css";

type ScorePredictorProps = {
  homeTeam: string;
  homeScore: number;
  awayTeam: string;
  awayScore: number;
  fixtureId: string;
  handleChange: (fixtureId: string, team: string, score: number) => void;
};

const ScorePredictor: React.FC<ScorePredictorProps> = ({
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  fixtureId,
  handleChange,
}) => {
  return (
    <div className={classes.scoreEditors}>
      <div className={classes.scoreEditor}>
        <Text textAlign="center" flex={1}>
          {homeTeam}
        </Text>
        <ScoreEditor
          team="homeScore"
          value={homeScore}
          fixtureId={fixtureId}
          onChange={handleChange}
        />
      </div>
      <Text.Header>vs</Text.Header>
      <div className={classes.scoreEditor}>
        <ScoreEditor
          team="awayScore"
          value={awayScore}
          fixtureId={fixtureId}
          onChange={handleChange}
        />
        <Text textAlign="center" flex={1}>
          {awayTeam}
        </Text>
      </div>
    </div>
  );
};

export default ScorePredictor;
