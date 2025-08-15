import { Loading } from "@/components";
import Text from "@/components/Text/Text";
import { auth } from "@/lib/auth";
import { getLeagueInfo } from "@/lib/leagueAPI";
import LeaveLeagueButton from "./components/LeaveLeagueButton";
import { Tabs } from "@chakra-ui/react";
import OverallTable from "./components/OverallTable";
import GameweekTable from "./components/GameweekTable";
import { getTotalGameweeks } from "@/lib/gameweekAPI";

export default async function League({
  params,
}: {
  params: { leagueId: string };
}) {
  const session = await auth();
  const league = await getLeagueInfo(params.leagueId);
  const totalGameweeks = await getTotalGameweeks();

  if (!session || !league) {
    return <Loading />;
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
        {league.name}
      </Text.Header>
      <Tabs.Root defaultValue="gameweek">
        <Tabs.List justifyContent="center">
          <Tabs.Trigger value="gameweek" fontSize="xl">
            Gameweek
          </Tabs.Trigger>
          <Tabs.Trigger value="overall" fontSize="xl">
            Overall
          </Tabs.Trigger>
          <Tabs.Indicator />
        </Tabs.List>
        <Tabs.Content value="overall">
          <OverallTable leagueId={params.leagueId} session={session} />
        </Tabs.Content>
        <Tabs.Content value="gameweek">
          <GameweekTable
            leagueId={params.leagueId}
            session={session}
            totalGameweeks={totalGameweeks}
          />
        </Tabs.Content>
      </Tabs.Root>
      <Text style={{ marginTop: "10px", fontSize: "18px" }}>
        League Code: {league.joinCode}
      </Text>
      <LeaveLeagueButton
        leagueName={league.name}
        leagueId={params.leagueId}
        userId={session.user.id}
      />
    </div>
  );
}
