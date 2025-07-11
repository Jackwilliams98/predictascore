import { auth } from "@/lib/auth";
import Text from "@/components/Text/Text";
import { getGameweekPredictions } from "@/lib/predictionAPI";
import PredictionsForm from "./components/PredictionsForm";
import PredictionsLive from "./components/PredictionsLive";
import { getUserById } from "@/lib/userAPI";

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
  const user = await getUserById(session?.user?.id);

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
        <PredictionsLive gameweek={gameweek} user={user} />
      ) : (
        <PredictionsForm gameweek={gameweek} />
      )}
    </div>
  );
}
