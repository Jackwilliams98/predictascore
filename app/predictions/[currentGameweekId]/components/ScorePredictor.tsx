"use client";

import React, { useState } from "react";
import ScoreEditor from "./ScoreEditor";

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
    <div>
      <div className="score-editors">
        <div className="score-editor">
          <label>
            {homeTeam}
            <ScoreEditor
              team="home"
              value={homeScore}
              fixtureId={fixtureId}
              onChange={handleChange}
            />
          </label>
        </div>
        <span className="vs">vs</span>
        <div className="score-editor">
          <label>
            {awayTeam}
            <ScoreEditor
              team="away"
              value={awayScore}
              fixtureId={fixtureId}
              onChange={handleChange}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default ScorePredictor;
