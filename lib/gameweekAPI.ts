import { ApiFixture } from "@/app/types";
import prisma from "./prisma";
import { getUpcomingWeekendDates } from "@/utils/upcomingWeekend";

const token = process.env.NEXT_PUBLIC_FOOTBALL_API_TOKEN;
if (!token) {
  throw new Error("API token is not defined");
}

const headers = {
  "X-Auth-Token": token,
  "Content-Type": "application/json",
};

const FIXTURES_PER_GAMEWEEK = 10;

export const createNewFixtures = async (gameweek: number) => {
  const { saturday, sunday } = getUpcomingWeekendDates();
  if (!saturday || !sunday) {
    throw new Error("Could not determine the upcoming weekend dates");
  }

  const premierLeagueURL = `https://api.football-data.org/v4/competitions/PL/matches?&dateFrom=${saturday}&dateTo=${sunday}`;

  try {
    const premierLeagueResponse = await fetch(premierLeagueURL, {
      method: "GET",
      headers,
    });

    if (!premierLeagueResponse.ok) {
      throw new Error(`HTTP error! status: ${premierLeagueResponse.status}`);
    }

    const { matches: premierLeagueMatches }: { matches: ApiFixture[] } =
      await premierLeagueResponse.json();

    let gameweekFixtures: ApiFixture[] = premierLeagueMatches;

    const isGameweekFull =
      premierLeagueMatches.length === FIXTURES_PER_GAMEWEEK;

    if (!isGameweekFull) {
      const remainingFixtures =
        FIXTURES_PER_GAMEWEEK - premierLeagueMatches.length;

      const championshipURL = `https://api.football-data.org/v4/competitions/ELC/matches?&dateFrom=${saturday}&dateTo=${sunday}&limit=${remainingFixtures}`;

      const championshipResponse = await fetch(championshipURL, {
        method: "GET",
        headers,
      });

      if (!championshipResponse.ok) {
        throw new Error(`HTTP error! status: ${championshipResponse.status}`);
      }

      const { matches: championshipMatches }: { matches: ApiFixture[] } =
        await championshipResponse.json();

      console.log({ championshipMatches });

      gameweekFixtures = [
        ...gameweekFixtures,
        ...championshipMatches.slice(0, remainingFixtures),
      ];
    }

    const fixtures = gameweekFixtures.map((match: ApiFixture) => ({
      homeTeam: match.homeTeam.name,
      awayTeam: match.awayTeam.name,
      kickoff: match.utcDate,
      homeScore: match.score.fullTime.home,
      awayScore: match.score.fullTime.away,
    }));

    fixtures.forEach(async (fixture) => {
      if (!fixture.homeTeam || !fixture.awayTeam || !fixture.kickoff) {
        throw new Error(
          "Fixture data is incomplete. Ensure all required fields are present."
        );
      }

      await prisma.fixture.upsert({
        where: {
          kickoff_homeTeam_awayTeam: {
            kickoff: new Date(fixture.kickoff),
            homeTeam: fixture.homeTeam,
            awayTeam: fixture.awayTeam,
          },
        },
        update: {},
        create: {
          homeTeam: fixture.homeTeam,
          awayTeam: fixture.awayTeam,
          kickoff: new Date(fixture.kickoff),
          homeScore: fixture.homeScore ?? null,
          awayScore: fixture.awayScore ?? null,
        },
      });
    });

    console.log(`Created ${fixtures.length} fixtures for gameweek ${gameweek}`);
  } catch (error) {
    console.error("Error creating gameweek:", error);
    return {
      error,
    };
  }
};

/* 
- Check if there is an existing active gameweek
  - update status to completed
  - update isComplete to true
- Get the fixture information and create new fixtures
- Create a new gameweek with status "active"
  - apply current season
  - increment gameweek number
  - set the deadline to saturday at 11:00 UTC
  - link gameweek to leagues
- Create a gameweekFixture row to link the gameweek to the fixtures
- Update the league's current gameweek to the new gameweek
*/
