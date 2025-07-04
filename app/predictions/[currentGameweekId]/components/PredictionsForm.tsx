"use client";

import React, { useState } from "react";
import { Card } from "@/components/Card";
import Text from "@/components/Text/Text";
import { Button } from "@/components";
import Link from "next/link";
import { GameweekInfo, UserPredictions } from "@/app/types";
import ScorePredictor from "./ScorePredictor";
import { upsertGameweekPredictions } from "@/lib/predictionAPI";
import { useSession } from "next-auth/react";

export default function PredictionsForm({
  gameweek,
}: {
  gameweek: GameweekInfo;
}) {
  const { data: session } = useSession();
  const initialPredictions: UserPredictions = {};
  gameweek.fixtures.forEach((fixture) => {
    initialPredictions[fixture.id] = {
      homeScore: fixture.prediction?.homeScore || 0,
      awayScore: fixture.prediction?.awayScore || 0,
    };
  });
  const [predictions, setPredictions] =
    useState<UserPredictions>(initialPredictions);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!session) {
    return (
      <Text>
        You must be{" "}
        <Link href="/login" className="text-blue-500">
          logged in
        </Link>{" "}
        to submit predictions.
      </Text>
    );
  }

  const handleChange = (fixtureId: string, team: string, score: number) => {
    console.log(`Updating ${team} score for fixture ${fixtureId} to ${score}`);

    setPredictions((prev) => ({
      ...prev,
      [fixtureId]: {
        ...prev[fixtureId],
        [team]: score,
      },
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted: ", predictions);
    const body = JSON.stringify({
      userId: session?.user.id,
      gameweekId: gameweek.gameweekId,
      predictions,
    });

    try {
      const response = await fetch("/api/predictions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      console.log("Response from API:", response);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed submit predictions");
      }

      setSuccess(`Predictions submitted successfully!`);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
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
              homeScore={predictions[id]?.homeScore || 0}
              awayScore={predictions[id]?.awayScore || 0}
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
