import { getCurrentSeason, getLeagueMembers } from "@/lib/leagueAPI";
import LeagueTable from "./LeagueTable";

export default async function OverallTable({
  leagueId,
  session,
}: {
  leagueId: string;
  session: any;
}) {
  const season = await getCurrentSeason();
  const leagueMembers = await getLeagueMembers(leagueId, season.id);

  return <LeagueTable leagueMembers={leagueMembers} session={session} />;
}
