"use client";

import { useState } from "react";
import Text from "@/components/Text/Text";
import { Card } from "@/components/Card";
import classes from "../../Predictions.module.css";
import { Button } from "@/components";
import { GameweekInfo } from "@/app/types";
import { Role, User } from "@prisma/client";

const SCORES = [
  { homeTeam: "Blackpool", awayTeam: "Chelsea", homeScore: 1, awayScore: 5 },
  {
    homeTeam: "Burnley",
    awayTeam: "Man United",
    homeScore: 6,
    awayScore: 1,
  },
  {
    homeTeam: "Fulham",
    awayTeam: "Ipswich",
    homeScore: 10,
    awayScore: 1,
  },
  {
    homeTeam: "Leicester",
    awayTeam: "Everton",
    homeScore: 2,
    awayScore: 0,
  },
  {
    homeTeam: "Liverpool",
    awayTeam: "Stoke",
    homeScore: 6,
    awayScore: 1,
  },
  {
    homeTeam: "Nottingham Forest",
    awayTeam: "Sheffield United",
    homeScore: 3,
    awayScore: 3,
  },
  {
    homeTeam: "Sheffield Wednesday",
    awayTeam: "Bolton",
    homeScore: 3,
    awayScore: 0,
  },
  {
    homeTeam: "West Brom",
    awayTeam: "Tottenham",
    homeScore: 4,
    awayScore: 4,
  },
  {
    homeTeam: "West Ham",
    awayTeam: "Blackburn",
    homeScore: 2,
    awayScore: 8,
  },
  {
    homeTeam: "Wolves",
    awayTeam: "Aston Villa",
    homeScore: 3,
    awayScore: 3,
  },
];

export default function PredictionsLive({
  gameweek,
  user,
}: {
  gameweek: GameweekInfo;
  user: User | null;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const updateFixtureScore = async (
    fixtureId: string,
    homeScore: number,
    awayScore: number
  ) => {
    const body = JSON.stringify({
      fixtureId,
      homeScore,
      awayScore,
    });

    try {
      const response = await fetch("/api/scores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update fixtures");
      }
      setSuccess(`Fixtures updated successfully!`);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return gameweek.fixtures.map((fixture) => {
    const { id, homeTeam, awayTeam, kickoff, points, prediction } = fixture;

    const score = SCORES.find(
      (s) =>
        s.homeTeam.toLowerCase() === homeTeam.toLowerCase() &&
        s.awayTeam.toLowerCase() === awayTeam.toLowerCase()
    );

    if (!prediction) {
      return null;
    }

    return (
      <div key={id}>
        {user?.role === Role.ADMIN && (
          <Button
            onClick={() =>
              score !== undefined &&
              updateFixtureScore(id, score.homeScore, score.awayScore)
            }
          >
            Update Score
          </Button>
        )}
        <Card key={id} style={{ marginBottom: "16px", position: "relative" }}>
          <Text>
            {new Date(kickoff).toLocaleString("en-GB", {
              month: "long",
              year: "numeric",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
          <Text.Title
            style={{
              gap: "8px",
              display: "flex",
              justifyContent: "space-between",
              textAlign: "center",
              alignItems: "center",
            }}
          >
            <div style={{ flex: 1 }}>{homeTeam}</div>
            <div style={{ flex: 1 }}>
              {prediction.homeScore || 0}:{prediction.awayScore || 0}
            </div>
            <div style={{ flex: 1 }}>{awayTeam}</div>
          </Text.Title>
          {points !== null && (
            <>
              <Text style={{ textAlign: "center", marginTop: "8px" }}>
                Actual Score:{" "}
                {`${score && score.homeScore}:${score && score.awayScore}`}
              </Text>
              <span
                className={classes.points}
                style={{
                  backgroundColor:
                    points === 0
                      ? "#fff9c4"
                      : points > 0
                      ? "#d4edda"
                      : "#f8d7da",
                }}
              >
                <Text style={{ marginInlineStart: "2px" }}>{points}</Text>
              </span>
            </>
          )}
        </Card>
      </div>
    );
  });
}
