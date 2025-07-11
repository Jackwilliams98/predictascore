import { auth } from "@/lib/auth";
import { Card } from "@/components/Card";
import Text from "@/components/Text/Text";
import { getUserPredictionLeagues } from "@/lib/predictionAPI";

export default async function Predictions() {
  const session = await auth();
  const leagues = await getUserPredictionLeagues(session?.user?.id);

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
          {leagues.map((league) => {
            const isSubmittedIcon = league.isSubmitted ? "✅" : "❌";
            return (
              <li key={league.id}>
                <a href={`/predictions/${league.currentGameweekId}`}>
                  <Card>
                    <Text.Title>{league.name}</Text.Title>
                    {league.deadline ? (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          gap: 20,
                        }}
                      >
                        <div>
                          <Text>PredictaScore</Text>
                          {isSubmittedIcon}
                        </div>
                        <div>
                          <Text>Deadline</Text>
                          <Text>
                            {new Date(league.deadline).toLocaleString("en-GB", {
                              timeZone: "UTC",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </Text>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <Text>No current gameweek</Text>
                      </div>
                    )}
                  </Card>
                </a>
              </li>
            );
          })}
        </ul>
      ) : (
        <div>No leagues found</div>
      )}
    </div>
  );
}
