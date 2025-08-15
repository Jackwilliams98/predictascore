import { getLeagueMembers } from "@/lib/leagueAPI";
import LeagueTable from "./LeagueTable";

export default async function OverallTable({
  leagueId,
  session,
}: {
  leagueId: string;
  session: any;
}) {
  const leagueMembers = await getLeagueMembers(leagueId);

  return <LeagueTable leagueMembers={leagueMembers} session={session} />;
}
