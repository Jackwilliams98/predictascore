import { getActiveUserLeagues } from "./leagueAPI";
import prisma from "./prisma";

import {
  GameweekFixture,
  GameweekInfo,
  UserPredictionLeagueInfo,
  UserPredictions,
} from "@/app/types";

export const getUserPredictionLeagues = async (
  userId: string
): Promise<UserPredictionLeagueInfo[]> => {
  if (!userId) {
    console.error("Error: userId is undefined");
    return [];
  }

  const userLeagues = await getActiveUserLeagues(userId);

  const leaguesWithInfo = await Promise.all(
    userLeagues.map(async (leagueMember) => {
      const league = await prisma.league.findUnique({
        where: { id: leagueMember.leagueId },
        include: {
          currentGameweek: { select: { id: true, deadline: true } },
        },
      });

      if (!league || !league.currentGameweek) {
        return {
          id: leagueMember.leagueId,
          name: leagueMember.league.name,
          deadline: "", // No current gameweek
          isSubmitted: false,
        };
      }

      const currentGameweekId = league.currentGameweek.id;

      // Check if the user has submitted predictions for the current gameweek
      const userGameweekPrediction = await prisma.gameweekPrediction.findFirst({
        where: {
          userId,
          gameweekId: currentGameweekId,
        },
      });
      const isSubmitted = !!userGameweekPrediction;

      return {
        id: league.id,
        name: league.name,
        currentGameweekId,
        deadline: league.currentGameweek.deadline.toISOString(),
        isSubmitted,
      };
    })
  );

  return leaguesWithInfo;
};

export const getGameweekPredictions = async (
  userId: string,
  gameweekId: string
): Promise<GameweekInfo | null> => {
  if (!userId || !gameweekId) {
    console.error("Error: userId or gameweekId is undefined");
    return null;
  }

  const gameweekInfo = await prisma.gameweek.findUnique({
    where: { id: gameweekId },
    include: {
      fixtures: {
        include: {
          fixture: {
            select: {
              id: true,
              homeTeam: true,
              awayTeam: true,
              kickoff: true,
              homeScore: true,
              awayScore: true,
            },
          },
        },
      },
      predictions: {
        where: { userId },
        include: {
          predictions: {
            select: {
              fixtureId: true,
              homeScore: true,
              awayScore: true,
              points: true,
            },
          },
        },
      },
    },
  });

  if (!gameweekInfo) {
    console.error("Error: Gameweek not found");
    return null;
  }

  const fixturesWithPredictions = gameweekInfo?.fixtures.map((fixture) => {
    const prediction = gameweekInfo?.predictions.find((pred) =>
      pred.predictions.some((p) => p.fixtureId === fixture.fixture.id)
    );
    const predictionDetails = prediction
      ? prediction.predictions.find((p) => p.fixtureId === fixture.fixture.id)
      : null;

    return {
      id: fixture.fixture.id,
      homeTeam: fixture.fixture.homeTeam,
      homeScore: fixture.fixture.homeScore,
      awayTeam: fixture.fixture.awayTeam,
      awayScore: fixture.fixture.awayScore,
      kickoff: fixture.fixture.kickoff.toISOString(),
      points: predictionDetails ? predictionDetails.points : null,
      prediction: predictionDetails
        ? {
            homeScore: predictionDetails.homeScore,
            awayScore: predictionDetails.awayScore,
          }
        : null,
    };
  });

  return {
    gameweekId,
    gameweekNumber: gameweekInfo.number,
    startDate: gameweekInfo.startDate.toISOString(),
    endDate: gameweekInfo.endDate.toISOString(),
    deadline: gameweekInfo.deadline.toISOString(),
    fixtures: fixturesWithPredictions,
  };
};

export const upsertGameweekPredictions = async (
  userId: string,
  gameweekId: string,
  predictions: UserPredictions,
  deadline: string
): Promise<GameweekFixture | null> => {
  if (!userId || !gameweekId || !predictions) {
    console.error("Error: userId, gameweekId, or prediction is undefined");
    return null;
  }

  const deadlineDate = new Date(deadline);
  const currentDate = new Date();

  if (deadlineDate < currentDate) {
    console.error("Error: Deadline has already passed");
    throw new Error("Deadline has already passed");
  }

  const league = await prisma.leagueMember.findFirst({
    where: {
      userId,
      league: {
        currentGameweek: {
          id: gameweekId,
        },
      },
    },
    select: {
      seasonId: true,
      leagueId: true,
    },
  });

  if (!league) {
    console.error("Error: League not found for user and gameweek");
    return null;
  }

  const { seasonId, leagueId } = league;

  const gwPrediction = await prisma.gameweekPrediction.upsert({
    where: {
      userId_gameweekId: {
        userId,
        gameweekId,
      },
    },
    update: {},
    create: {
      userId,
      leagueId,
      gameweekId,
      seasonId,
    },
  });

  for (const [fixtureId, prediction] of Object.entries(predictions)) {
    await prisma.prediction.upsert({
      where: {
        gameweekPredictionId_fixtureId: {
          gameweekPredictionId: gwPrediction.id,
          fixtureId,
        },
      },
      update: {
        homeScore: prediction.homeScore,
        awayScore: prediction.awayScore,
      },
      create: {
        userId,
        fixtureId,
        gameweekPredictionId: gwPrediction.id,
        homeScore: prediction.homeScore,
        awayScore: prediction.awayScore,
      },
    });
  }

  return null;
};
