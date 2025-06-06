export type LeagueTableType = {
  position: number;
  team: TeamType;
  playedGames: number;
  form: null;
  won: number;
  draw: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
};

export type TeamType = {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
};

export type UserLeagueInfo = {
  id: string;
  name: string;
  overallRank: number;
  overallPoints: number;
  gameweekRank: string | number;
};
