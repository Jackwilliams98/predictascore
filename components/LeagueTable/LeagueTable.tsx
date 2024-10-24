import { LeagueTableType } from "@/app/types";

interface LeageTableProps {
  table: LeagueTableType[];
}

export const LeagueTable: React.FC<LeageTableProps> = ({ table }) => {
  const tableHeader = (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <div style={{ flex: 0.2 }}>Position</div>
      <div style={{ flex: 1 }}>Team</div>
      <div style={{ flex: 0.2 }}>Played</div>
      <div style={{ flex: 0.2 }}>Won</div>
      <div style={{ flex: 0.2 }}>Draw</div>
      <div style={{ flex: 0.2 }}>Lost</div>
      <div style={{ flex: 0.2 }}>Points</div>
      <div style={{ flex: 0.2 }}>GF</div>
      <div style={{ flex: 0.2 }}>GA</div>
      <div style={{ flex: 0.2 }}>GD</div>
    </div>
  );

  const tableRows = table.map((row) => (
    <div
      key={row.team.id}
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <div style={{ flex: 0.2 }}>{row.position}</div>
      <div style={{ flex: 1 }}>{row.team.name}</div>
      <div style={{ flex: 0.2 }}>{row.playedGames}</div>
      <div style={{ flex: 0.2 }}>{row.won}</div>
      <div style={{ flex: 0.2 }}>{row.draw}</div>
      <div style={{ flex: 0.2 }}>{row.lost}</div>
      <div style={{ flex: 0.2 }}>{row.points}</div>
      <div style={{ flex: 0.2 }}>{row.goalsFor}</div>
      <div style={{ flex: 0.2 }}>{row.goalsAgainst}</div>
      <div style={{ flex: 0.2 }}>{row.goalDifference}</div>
    </div>
  ));

  return (
    <div style={{ width: "100%" }}>
      {tableHeader}
      {tableRows}
    </div>
  );
};
