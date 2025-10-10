import { Avatar } from "@/components";
import { Card } from "@/components/Card";
import classes from "../../Leagues.module.css";

// type LeagueMember = {
//   id: string;
//   userId: string;
//   leagueId: string;
//   user: {
//     id: string;
//     name: string;
//     avatar: string | null;
//   };
//   points: number;
//   correctPredictions: number;
//   goalDifference: number;
// };

export default function LeagueTable({
  leagueMembers,
  session,
}: {
  leagueMembers: any[];
  session: any;
}) {
  if (!leagueMembers.some((m) => m.userId === session.user.id)) {
    return (
      <div style={{ color: "#fff", textAlign: "center", marginTop: "40px" }}>
        You are not a member of this league. Try refreshing the page.
      </div>
    );
  }

  return (
    <Card style={{ paddingTop: 0 }}>
      <table className={classes.leagueTable}>
        <thead>
          <tr>
            <th></th>
            <th>User</th>
            <th>Pts</th>
            <th>CS</th>
            <th>GD</th>
          </tr>
        </thead>
        <tbody>
          {leagueMembers.map((member, index) => {
            const isCurrentUser = member.userId === session.user.id;
            return (
              <tr
                key={member.id}
                style={{
                  backgroundColor: isCurrentUser ? "#f0f8ff" : "transparent",
                  justifyContent: "space-between",
                }}
              >
                <td>{index + 1}</td>
                <td
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <Avatar
                    src={member.user.avatar || ""}
                    height={30}
                    width={30}
                  />
                  <span>{member.user.name}</span>
                </td>
                <td>{member.points}</td>
                <td>{member.correctPredictions}</td>
                <td>{member.goalDifference}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}
