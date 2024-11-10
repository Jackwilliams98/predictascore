import prisma from "./prisma";

// Get league standings for a specific gameweek
const getGameweekStandings = async (gameweekId: number) => {
  return await prisma.gameweekPrediction.findMany({
    where: {
      gameweekId,
      submitted: true,
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      points: "desc",
    },
  });
};

// Get all predictions for a user in a specific gameweek
const getUserGameweekPredictions = async (
  userId: number,
  gameweekId: number,
) => {
  return await prisma.prediction.findMany({
    where: {
      userId,
      gameweekPredictionId: {
        equals: gameweekId,
      },
    },
    include: {
      fixture: true,
    },
  });
};

// Get league table (cumulative points)
const getLeagueTable = async (leagueId: number) => {
  return await prisma.gameweekPrediction.groupBy({
    by: ["userId"],
    where: {
      gameweek: {
        leagueId,
      },
      submitted: true,
    },
    _sum: {
      points: true,
    },
    orderBy: {
      _sum: {
        points: "desc",
      },
    },
  });
};

// Get upcoming fixtures for a gameweek
const getUpcomingFixtures = async (gameweekId: number) => {
  return await prisma.fixture.findMany({
    where: {
      gameweekId,
      status: "SCHEDULED",
      kickoff: {
        gte: new Date(),
      },
    },
    orderBy: {
      kickoff: "asc",
    },
  });
};

// Check if user has submitted all predictions for a gameweek
const hasSubmittedAllPredictions = async (
  userId: number,
  gameweekId: number,
) => {
  const predictions = await prisma.prediction.count({
    where: {
      userId,
      gameweekPredictionId: gameweekId,
    },
  });

  const fixtures = await prisma.fixture.count({
    where: {
      gameweekId,
    },
  });

  return predictions === fixtures; // Should be 10
};
