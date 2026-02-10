import { auth } from "@/lib/auth";
import Text from "@/components/Text/Text";
import { getGameweekPredictions } from "@/lib/predictionAPI";
import { DateTime } from "luxon";
import CurrentGameweekClient from "./components/CurrentGameweekClient";

export default async function CurrentGameweek({
  params,
}: {
  params: { currentGameweekId: string };
}) {
  const session = await auth();
  const gameweek = await getGameweekPredictions(
    session?.user?.id,
    params.currentGameweekId,
  );

  if (!session || !gameweek) {
    return <Text>Loading...</Text>;
  }
  const role = session.user.role;
  const isSubmitted = gameweek.isSubmitted;
  const now = DateTime.now().setZone("Europe/London");
  const deadline = DateTime.fromISO(gameweek.deadline).setZone("Europe/London");

  const isGameweekLive = deadline < now;
  const sortedFixtures = gameweek.fixtures.sort((a, b) => {
    return new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime();
  });

  const textDeadline = deadline.toLocaleString({
    month: "long",
    year: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div style={{ marginBottom: 40 }}>
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
      <div style={{ marginBottom: "12px", marginTop: "-12px" }}>
        <Text.Title color="white" textAlign="center">
          Deadline {textDeadline}
        </Text.Title>
      </div>
      <CurrentGameweekClient
        isGameweekLive={isGameweekLive}
        isSubmitted={isSubmitted}
        sortedFixtures={sortedFixtures}
        deadline={gameweek.deadline}
        gameweekId={gameweek.gameweekId}
        role={role}
      />
    </div>
  );
}
