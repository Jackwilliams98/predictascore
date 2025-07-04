import { auth } from "@/lib/auth";
import { Card } from "@/components/Card";
import Text from "@/components/Text/Text";
import { Button } from "@/components";
import Link from "next/link";
import { getGameweekPredictions } from "@/lib/predictionAPI";
import ScorePredictor from "./components/ScorePredictor";
import PredictionsForm from "./components/PredictionsForm";

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
      <PredictionsForm gameweek={gameweek} />
    </div>
  );
}
