"use client";

import React, { useState } from "react";
import { Card } from "@/components/Card";
import Text from "@/components/Text/Text";
import { Button } from "@/components";
import Link from "next/link";
import { GameweekInfo } from "@/app/types";
import ScorePredictor from "./ScorePredictor";

type Prediction = {
  home?: number;
  away?: number;
};

type PredictionsState = {
  [fixtureId: string]: Prediction;
};

export default function PredictionsForm({
  gameweek,
}: {
  gameweek: GameweekInfo;
}) {
  const initialPredictions: PredictionsState = {};
  gameweek.fixtures.forEach((fixture) => {
    initialPredictions[fixture.id] = {
      home: fixture.prediction?.homeScore || 0,
      away: fixture.prediction?.awayScore || 0,
    };
  });
  const [predictions, setPredictions] =
    useState<PredictionsState>(initialPredictions);

  const handleChange = (fixtureId: string, team: string, score: number) => {
    setPredictions((prev) => ({
      ...prev,
      [fixtureId]: {
        ...prev[fixtureId],
        [team]: score,
      },
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted: ", predictions);
  };

  return (
    <form onSubmit={handleSubmit} id="predictions-form">
      {gameweek.fixtures.map((fixture) => {
        const { id, homeTeam, awayTeam, kickoff } = fixture;

        return (
          <Card key={id}>
            <Text.Title>
              {homeTeam} vs {awayTeam}
            </Text.Title>
            <Text>
              {new Date(kickoff).toLocaleString("en-GB", {
                month: "long",
                year: "numeric",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
            <ScorePredictor
              homeTeam={homeTeam}
              homeScore={predictions[id]?.home || 0}
              awayScore={predictions[id]?.away || 0}
              awayTeam={awayTeam}
              fixtureId={id}
              handleChange={handleChange}
            />
          </Card>
        );
      })}
      <Button id="predictions-form" type="submit" style={{ marginTop: "20px" }}>
        Submit Predictions
      </Button>
    </form>
  );
}
