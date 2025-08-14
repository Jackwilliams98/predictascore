import Text from "@/components/Text/Text";
import { Card } from "@/components/Card";
import classes from "../../Predictions.module.css";
import { GameweekFixture } from "@/app/types";

export default function PredictionsLive({
  fixtures,
}: {
  fixtures: GameweekFixture[];
}) {
  return fixtures.map((fixture) => {
    const {
      id,
      homeTeam,
      homeScore,
      awayTeam,
      awayScore,
      kickoff,
      points,
      prediction,
    } = fixture;

    if (!prediction) {
      return null;
    }

    return (
      <div key={id}>
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
                {`${homeScore && homeScore}:${awayScore && awayScore}`}
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
