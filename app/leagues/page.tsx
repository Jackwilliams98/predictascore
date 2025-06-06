import { getUserLeagues } from "@/lib/leagueAPI";
import { auth } from "@/lib/auth";
import { Card } from "@/components/Card";
import Text from "@/components/Text/Text";
import { Button } from "@/components";
import Link from "next/link";

export default async function Leagues() {
  const session = await auth();

  const leagues = await getUserLeagues(session?.user?.id);

  return (
    <div>
      {leagues.length > 0 ? (
        <ul
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 20,
          }}
        >
          {leagues.map((league) => (
            <li key={league.id}>
              <a href={`/leagues/${league.id}`}>
                <Card>
                  <Text.Header>{league.name}</Text.Header>
                  <div
                    style={{ display: "flex", flexDirection: "row", gap: 20 }}
                  >
                    <div>
                      <Text>{league.gameweekRank}</Text>
                      <Text>Weekly rank</Text>
                    </div>
                    <div>
                      <Text>{league.overallPoints}</Text>
                      <Text>Overall Points</Text>
                    </div>
                    <div>
                      <Text>{league.overallRank}</Text>
                      <Text>Overall rank</Text>
                    </div>
                  </div>
                </Card>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <div>No leagues found</div>
      )}
      <div
        style={{
          gap: 20,
          display: "flex",
          flexDirection: "row",
          marginTop: 20,
          flexWrap: "wrap",
        }}
      >
        <Link href="/leagues/create-a-league" passHref>
          <Button fontSize={24}>Create a league</Button>
        </Link>
        <Link href="/leagues/join-a-league" passHref>
          <Button fontSize={24}>Join a league</Button>
        </Link>
      </div>
    </div>
  );
}
