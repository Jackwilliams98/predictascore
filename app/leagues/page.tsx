import { getUserLeagues } from "@/lib/leagueAPI";
import { auth } from "@/lib/auth";
import { Card } from "@/components/Card";
import Text from "@/components/Text/Text";

export default async function Leagues() {
  const session = await auth();

  const leagues = await getUserLeagues(session?.user?.id);

  return (
    <div>
      {leagues.length > 0 ? (
        <ul
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)", // 3 equal columns
            gap: 20, // Space between items
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
    </div>
  );
}
