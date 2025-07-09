import { auth } from "@/lib/auth";
import Text from "@/components/Text/Text";
import { getGameweekPredictions } from "@/lib/predictionAPI";
import PredictionsForm from "./components/PredictionsForm";
import { Card } from "@/components/Card";
import classes from "../Predictions.module.css";

export default async function CurrentGameweek({
  params,
}: {
  params: { currentGameweekId: string };
}) {
  const session = await auth();
  const gameweek = await getGameweekPredictions(
    session?.user?.id,
    params.currentGameweekId
  );

  if (!session || !gameweek) {
    return <Text>Loading...</Text>;
  }

  const now = new Date();
  const deadline = new Date(gameweek.deadline);

  const isGameweekLive = deadline < now;

  return (
    <div>
      <Text.Header
        style={{
          display: "flex",
          marginTop: "-60px",
          justifyContent: "center",
          marginBottom: "20px",
          color: "#fff",
        }}
      >
        Gameweek {gameweek.gameweekNumber}
      </Text.Header>
      {isGameweekLive ? (
        gameweek.fixtures.map((fixture) => {
          const { id, homeTeam, awayTeam, kickoff, points, prediction } =
            fixture;

          if (!prediction) {
            return null;
          }

          const { homeScore, awayScore } = prediction;

          return (
            <Card
              key={id}
              style={{ marginBottom: "16px", position: "relative" }}
            >
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
                  {homeScore || 0}:{awayScore || 0}
                </div>
                <div style={{ flex: 1 }}>{awayTeam}</div>
              </Text.Title>
              {points && (
                <span
                  className={classes.points}
                  style={{
                    backgroundColor: points > 0 ? "#d4edda" : "#f8d7da",
                  }}
                >
                  <Text style={{ marginInlineStart: "2px" }}>{points}</Text>
                </span>
              )}
            </Card>
          );
        })
      ) : (
        <PredictionsForm gameweek={gameweek} />
      )}
    </div>
  );
}
