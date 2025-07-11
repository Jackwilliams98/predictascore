import { Avatar, Loading } from "@/components";
import { Card } from "@/components/Card";
import Text from "@/components/Text/Text";
import { auth } from "@/lib/auth";
import { getLeagueInfo, getLeagueMembers, leaveLeague } from "@/lib/leagueAPI";
import LeaveLeagueButton from "./components/LeaveLeagueButton";

export default async function League({
  params,
}: {
  params: { leagueId: string };
}) {
  const session = await auth();
  const league = await getLeagueInfo(params.leagueId);
  const leagueMembers = await getLeagueMembers(params.leagueId);

  if (!session || !league || !leagueMembers) {
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
        {league?.name}
      </Text.Header>
      <Card>
        <div style={{ display: "flex", gap: "10px" }}>
          <div style={{ width: 50, fontSize: 20 }}>Rank</div>
          <div style={{ width: 250, fontSize: 20, paddingLeft: 10 }}>User</div>
          <div style={{ fontSize: 20 }}>Points</div>
        </div>
        {leagueMembers.map((member, index) => {
          return (
            <div
              key={member.id}
              style={{
                display: "flex",
                gap: "10px",
                padding: "10px",
                borderBottom: "1px solid #ccc",
              }}
            >
              <div style={{ width: 50 }}>{index + 1}</div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "10px",
                  width: 250,
                }}
              >
                <Avatar src={member.user.avatar || ""} />
                <div style={{ display: "flex", alignItems: "center" }}>
                  {member.user.name}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                {member.points}
              </div>
            </div>
          );
        })}
      </Card>
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
