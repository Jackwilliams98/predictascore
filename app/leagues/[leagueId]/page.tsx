import { Loading } from "@/components";
import Text from "@/components/Text/Text";
import { auth } from "@/lib/auth";
import { getCurrentSeason, getLeagueInfo } from "@/lib/leagueAPI";
import LeaveLeagueButton from "./components/LeaveLeagueButton";
import { Tabs } from "@chakra-ui/react";
import OverallTable from "./components/OverallTable";
import GameweekTable from "./components/GameweekTable";
import { getTotalGameweeks } from "@/lib/gameweekAPI";
import classes from "../Leagues.module.css";

export default async function League({
  params,
}: {
  params: { leagueId: string };
}) {
  const session = await auth();
  const league = await getLeagueInfo(params.leagueId);
  const season = await getCurrentSeason();
  const totalGameweeks = await getTotalGameweeks();

  if (!session || !league) {
    return <Loading />;
  }

  return (
    <div>
      <div className={classes.leagueNameHeader}>
        <Text.Header>{league.name}</Text.Header>
      </div>
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
        <Tabs.Content value="gameweek">
          <GameweekTable
            leagueId={params.leagueId}
            seasonId={season.id}
            session={session}
            totalGameweeks={totalGameweeks}
          />
        </Tabs.Content>
        <Tabs.Content value="overall">
          <OverallTable leagueId={params.leagueId} session={session} />
        </Tabs.Content>
      </Tabs.Root>
      <Text className={classes.leagueCode}>League Code: {league.joinCode}</Text>
      <LeaveLeagueButton
        leagueName={league.name}
        leagueId={params.leagueId}
        userId={session.user.id}
      />
    </div>
  );
}
