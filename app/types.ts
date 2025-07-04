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

export type League = {
  league: {
    id: string;
    name: string;
  };
  id: string;
  userId: string;
  leagueId: string;
  seasonId: string;
  joinedAt: Date;
  leftAt: Date | null;
  points: number;
};

export type GameweekFixture = {
  id: string;
  homeTeam: string;
  awayTeam: string;
  kickoff: string;
  prediction: GameweekPrediction | null;
};

export type GameweekPrediction = {
  homeScore: number;
  awayScore: number;
};

export type UserLeagueInfo = {
  id: string;
  name: string;
  overallRank: number;
  overallPoints: number;
  gameweekRank: string | number;
};

export type UserPredictionLeagueInfo = {
  id: string;
  name: string;
  currentGameweekId?: string;
  deadline: string;
  isSubmitted: boolean;
};

export type GameweekInfo = {
  gameweekNumber: number;
  startDate: string;
  endDate: string;
  deadline: string;
  fixtures: GameweekFixture[];
};
