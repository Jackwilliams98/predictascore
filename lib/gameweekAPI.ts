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

export const updateCurrentGameweek = async () => {
  const currentGameweek = await prisma.gameweek.findFirst({
    where: {
      status: "ACTIVE",
    },
  });

  if (currentGameweek) {
    // Check all fixtures in the current gameweek are completed
    const fixtures = await prisma.gameweekFixture.findMany({
      where: {
        gameweekId: currentGameweek.id,
        fixture: {
          homeScore: { not: null },
          awayScore: { not: null },
        },
      },
      include: {
        fixture: true,
      },
    });

    if (fixtures.length < FIXTURES_PER_GAMEWEEK) {
      console.log(
        `Current gameweek ${currentGameweek.id} has only ${fixtures.length} fixtures. Not updating to completed.`
      );
      return {
        incomplete: true,
        id: currentGameweek.id,
        number: currentGameweek.number,
        seasonId: currentGameweek.seasonId,
      };
    }

    await prisma.gameweek.update({
      where: {
        id: currentGameweek.id,
      },
      data: {
        status: "COMPLETED",
        isComplete: true,
      },
    });
    console.log(`Updated current gameweek ${currentGameweek.id} to completed.`);
    return {
      incomplete: false,
      id: currentGameweek.id,
      number: currentGameweek.number,
      seasonId: currentGameweek.seasonId,
    };
  }
  console.log("No active gameweek found to update.");
  return null;
};

export const createNewGameweek = async (
  currentGameweek: {
    id: string;
    number: number;
    seasonId: string;
  } | null
) => {
  const newGameweekNumber = currentGameweek ? currentGameweek.number + 1 : 1;
  const seasonId = currentGameweek
    ? currentGameweek.seasonId
    : await prisma.season
        .findFirst({
          where: { isActive: true },
          select: { id: true },
        })
        .then((season) => season?.id);
  const leagues = await prisma.league.findMany({});
  const { saturday, sunday } = getUpcomingWeekendDates();

  if (!seasonId) {
    throw new Error("No active season found");
  }

  if (!saturday || !sunday) {
    throw new Error("Could not determine the upcoming weekend dates");
  }

  const deadline = new Date(saturday + "T11:00:00.000Z").toISOString();

  const newGameweek = await prisma.gameweek.create({
    data: {
      number: newGameweekNumber,
      status: "ACTIVE",
      deadline: deadline,
      isComplete: false,
      startDate: new Date(saturday + "T00:00:00.000Z"),
      endDate: new Date(sunday + "T23:59:59.999Z"),
      season: { connect: { id: seasonId } },
      leagues: {
        connect: leagues.map((league) => ({ id: league.id })),
      },
    },
  });

  await Promise.all(
    leagues.map((league) =>
      prisma.gameweekLeague.create({
        data: {
          gameweekId: newGameweek.id,
          leagueId: league.id,
        },
      })
    )
  );

  console.log(
    `Created new gameweek ${newGameweek.id} with number ${newGameweek.number}.`
  );
  return newGameweek;
};

export const createNewFixtures = async () => {
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

      gameweekFixtures = [
        ...gameweekFixtures,
        ...championshipMatches.slice(0, remainingFixtures),
      ];
    }

    const fixtures = gameweekFixtures.map((match: ApiFixture) => ({
      externalId: match.id,
      homeTeam: match.homeTeam.name,
      awayTeam: match.awayTeam.name,
      kickoff: match.utcDate,
      homeScore: match.score.fullTime.home,
      awayScore: match.score.fullTime.away,
    }));

    const fixtureUpsert = await Promise.all(
      fixtures.map(async (fixture) => {
        if (!fixture.homeTeam || !fixture.awayTeam || !fixture.kickoff) {
          throw new Error(
            "Fixture data is incomplete. Ensure all required fields are present."
          );
        }

        return await prisma.fixture.upsert({
          where: {
            kickoff_homeTeam_awayTeam: {
              kickoff: new Date(fixture.kickoff),
              homeTeam: fixture.homeTeam,
              awayTeam: fixture.awayTeam,
            },
          },
          update: {},
          create: {
            externalId: fixture.externalId,
            homeTeam: fixture.homeTeam,
            awayTeam: fixture.awayTeam,
            kickoff: new Date(fixture.kickoff),
            homeScore: fixture.homeScore ?? null,
            awayScore: fixture.awayScore ?? null,
          },
        });
      })
    ).finally(() => {
      console.log("Fixtures upserted successfully.");
    });

    console.log(`Created ${fixtures.length} fixtures for gameweek`);
    return fixtureUpsert;
  } catch (error) {
    console.error("Error creating gameweek:", error);
    throw new Error(
      `Failed to create fixtures: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};

export const createGameweekFixtures = async (
  fixtures: any[],
  gameweek: { id: string }
) => {
  if (!gameweek || !gameweek.id) {
    throw new Error("Gameweek ID is required to create gameweek fixtures");
  }

  const gameweekFixtures = await Promise.all(
    fixtures.map(async (fixture) => {
      return await prisma.gameweekFixture.create({
        data: {
          fixture: {
            connect: {
              id: fixture.id,
            },
          },
          gameweek: {
            connect: {
              id: gameweek.id,
            },
          },
        },
      });
    })
  );

  console.log(`Created ${gameweekFixtures.length} gameweek fixtures.`);
  return gameweekFixtures;
};

export const getGameweekTable = async (
  leagueId: string,
  gameweekNumber: number
) => {
  console.log(
    `Fetching gameweek table for leagueId: ${leagueId}, gameweekNumber: ${gameweekNumber}`
  );

  // 1. Get all league members
  const leagueMembers = await prisma.leagueMember.findMany({
    where: { leagueId },
    include: {
      user: { select: { id: true, name: true, avatar: true } },
    },
  });

  // 2. Get the gameweek
  const gameweek = await prisma.gameweek.findFirst({
    where: { number: gameweekNumber },
    select: {
      id: true,
      predictions: {
        select: {
          userId: true,
          points: true,
          correctPredictions: true,
          goalDifference: true,
        },
      },
    },
  });

  if (!gameweek) {
    throw new Error(`Gameweek ${gameweekNumber} not found`);
  }

  const predictionsByUserId = Object.fromEntries(
    gameweek.predictions.map((p) => [p.userId, p])
  );

  const members = leagueMembers.map((member) => {
    const prediction = predictionsByUserId[member.userId];
    return {
      userId: member.userId,
      leagueId,
      user: member.user,
      points: prediction?.points ?? 0,
      correctPredictions: prediction?.correctPredictions ?? 0,
      goalDifference: prediction?.goalDifference ?? 0,
    };
  });

  const sortedMembers = members.slice().sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.correctPredictions !== a.correctPredictions)
      return b.correctPredictions - a.correctPredictions;
    return Math.abs(a.goalDifference) - Math.abs(b.goalDifference);
  });

  return {
    members: sortedMembers,
  };
};

export const getTotalGameweeks = async () => {
  const currentSeason = await prisma.season.findFirst({
    where: {
      isActive: true,
    },
    select: {
      id: true,
    },
  });

  const totalGameweeks = await prisma.gameweek.count({
    where: {
      seasonId: currentSeason?.id,
    },
  });

  return totalGameweeks;
};
