import { LeagueTableType } from "@/app/types";
import { Card } from "../Card";

import classes from "./LeagueTable.module.css";
import { useScreenSize } from "@/utils/useScreenSize";

interface LeageTableProps {
  table: LeagueTableType[];
}

export const LeagueTable: React.FC<LeageTableProps> = ({ table }) => {
  const { isDesktop } = useScreenSize();

  const tableHeader = (
    <div className={classes.table}>
      <div
        style={{ flex: isDesktop ? 0.5 : 0.2, fontWeight: 700, maxWidth: 80 }}
      >
        {isDesktop ? "Position" : "Pos"}
      </div>
      <div style={{ flex: isDesktop ? 1 : 0.5, fontWeight: 700 }}>Team</div>
      {isDesktop && (
        <>
          <div style={{ flex: 0.2, fontWeight: 700 }}>Played</div>
          <div style={{ flex: 0.2, fontWeight: 700 }}>Won</div>
          <div style={{ flex: 0.2, fontWeight: 700 }}>Draw</div>
          <div style={{ flex: 0.2, fontWeight: 700 }}>Lost</div>
        </>
      )}
      <div style={{ flex: 0.2, fontWeight: 700 }}>Points</div>
      <div style={{ flex: 0.1, fontWeight: 700 }}>GD</div>
    </div>
  );

  const tableRows = table.map((row) => (
    <div key={row.team.id} className={classes.table}>
      <div style={{ flex: isDesktop ? 0.5 : 0.2, maxWidth: 80 }}>
        {row.position}
      </div>
      <div style={{ flex: isDesktop ? 1 : 0.5 }}>
        {isDesktop ? row.team.name : row.team.shortName}
      </div>
      {isDesktop && (
        <>
          <div style={{ flex: 0.2 }}>{row.playedGames}</div>
          <div style={{ flex: 0.2 }}>{row.won}</div>
          <div style={{ flex: 0.2 }}>{row.draw}</div>
          <div style={{ flex: 0.2 }}>{row.lost}</div>
        </>
      )}
      <div style={{ flex: 0.2 }}>{row.points}</div>
      <div style={{ flex: 0.1 }}>{row.goalDifference}</div>
    </div>
  ));

  return (
    <Card>
      {tableHeader}
      {tableRows}
    </Card>
  );
};
