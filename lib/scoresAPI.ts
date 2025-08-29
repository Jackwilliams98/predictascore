import { ApiFixture } from "@/app/types";
import prisma from "@/lib/prisma";
import { FixtureStatus } from "@prisma/client";

const token = process.env.NEXT_PUBLIC_FOOTBALL_API_TOKEN;
if (!token) {
  throw new Error("API token is not defined");
}

const headers = {
  "X-Auth-Token": token,
  "Content-Type": "application/json",
};

/**
 * Updates fixture results, scores predictions, updates gameweek and league points.
 * @param fixtureResults Array of objects: { fixtureId, homeScore, awayScore }
 */
export async function updateFixtureResults({
  externalId,
  homeScore,
  awayScore,
  status,
}: {
  externalId: number;
  homeScore: number;
  awayScore: number;
  status: FixtureStatus;
}) {
  try {
    // 1. Update the Fixture
    const fixture = await prisma.fixture.update({
      where: { externalId },
      data: {
        homeScore: homeScore,
        awayScore: awayScore,
        status,
      },
      select: {
        id: true,
      },
    });

    // 2. Get all predictions for this fixture
    const predictions = await prisma.prediction.findMany({
      where: { fixtureId: fixture.id },
      include: { gameweekPrediction: true },
    });

    // 3. Score each prediction and update
    for (const prediction of predictions) {
      let points = 0;
      let correctScore = false;

      // No score submitted
      if (prediction.homeScore === null || prediction.awayScore === null) {
        points = 0;
      } else if (homeScore === awayScore) {
        // Draw
        if (prediction.homeScore === prediction.awayScore) {
          if (
            homeScore === prediction.homeScore &&
            awayScore === prediction.awayScore
          ) {
            // Exact draw score
            points = 6;
            correctScore = true;
          } else if (
            homeScore !== prediction.homeScore ||
            awayScore !== prediction.awayScore
          ) {
            // Correct draw result
            points = 3;
          }
        } else {
          // Incorrect guess for draw
          points = -1;
        }
      } else if (homeScore > awayScore) {
        // Home win
        if (prediction.homeScore > prediction.awayScore) {
          if (
            homeScore === prediction.homeScore &&
            awayScore === prediction.awayScore
          ) {
            // Exact home win score
            points = 5;
            correctScore = true;
          } else if (
            homeScore !== prediction.homeScore ||
            awayScore !== prediction.awayScore
          ) {
            // Correct home win result
            points = 2;
          }
        } else {
          // Incorrect guess for home win
          points = -1;
        }
      } else if (homeScore < awayScore) {
        // Away win
        if (prediction.awayScore > prediction.homeScore) {
          if (
            homeScore === prediction.homeScore &&
            awayScore === prediction.awayScore
          ) {
            // Exact away win score
            points = 5;
            correctScore = true;
          } else if (
            homeScore !== prediction.homeScore ||
            awayScore !== prediction.awayScore
          ) {
            // Correct away win result
            points = 2;
          }
        } else {
          // Incorrect guess for away win
          points = -1;
        }
      } else {
        // Incorrect guess
        points = -1;
      }

      const goalDifference =
        prediction.homeScore + prediction.awayScore - (homeScore + awayScore);

      await prisma.prediction.update({
        where: { id: prediction.id },
        data: { points, correctScore, goalDifference },
      });
    }

    // 4. For each GameweekPrediction, update total points, correct predictions and goal difference
    const gameweekPredictionIds = Array.from(
      new Set(predictions.map((p) => p.gameweekPredictionId))
    );
    for (const gwpId of gameweekPredictionIds) {
      const totalPoints = await prisma.prediction.aggregate({
        where: { gameweekPredictionId: gwpId },
        _sum: { points: true },
      });
      const correctPredictions = await prisma.prediction.count({
        where: { gameweekPredictionId: gwpId, correctScore: true },
      });
      const goalDifference = await prisma.prediction.aggregate({
        where: { gameweekPredictionId: gwpId },
        _sum: { goalDifference: true },
      });
      await prisma.gameweekPrediction.update({
        where: { id: gwpId },
        data: {
          points: totalPoints._sum.points ?? 0,
          correctPredictions,
          goalDifference: goalDifference._sum.goalDifference ?? 0,
        },
      });
    }

    // 5. Apply -10 penalty to users with no GameweekPredictions
    const currentGameweek = await prisma.gameweek.findFirst({
      where: {
        status: "ACTIVE",
      },
      select: {
        id: true,
      },
    });
    const season = await prisma.season.findFirst({
      where: {
        isActive: true,
      },
      select: {
        id: true,
      },
    });

    if (!currentGameweek || !season) {
      console.warn("No active gameweek or season found.");
      return {
        success: true,
        message: "Fixture results applied successfully.",
      };
    }

    const leagueMembers = await prisma.leagueMember.findMany({
      where: {
        // leagueId: gwp.leagueId, update when unique fixtures per league is implemented
        seasonId: season.id,
      },
    });

    const usersWithPrediction = await prisma.gameweekPrediction.findMany({
      where: {
        gameweekId: currentGameweek.id,
      },
      select: {
        userId: true,
      },
    });

    const userIdsWithPrediction = new Set(
      usersWithPrediction.map((p) => p.userId)
    );

    // For each user, if they haven't submitted, create a penalty GameweekPrediction
    for (const member of leagueMembers) {
      if (!userIdsWithPrediction.has(member.userId)) {
        await prisma.gameweekPrediction.upsert({
          where: {
            userId_gameweekId: {
              userId: member.userId,
              gameweekId: currentGameweek.id,
            },
          },
          update: {}, // No update if it exists (or you can update points if you want)
          create: {
            userId: member.userId,
            seasonId: member.seasonId,
            gameweekId: currentGameweek.id,
            points: -10,
            correctPredictions: 0,
            goalDifference: 0,
          },
        });
      }
    }

    // 6. Update LeagueMember points for each user in this fixture
    for (const member of leagueMembers) {
      // Sum all GameweekPrediction points for this user/league/season
      const totalPoints = await prisma.gameweekPrediction.aggregate({
        where: {
          userId: member.userId,
          // leagueId: member.leagueId, update when unique fixtures per league is implemented
          seasonId: member.seasonId,
        },
        _sum: {
          points: true,
          correctPredictions: true,
          goalDifference: true,
        },
      });

      await prisma.leagueMember.update({
        where: {
          userId_leagueId_seasonId: {
            userId: member.userId,
            leagueId: member.leagueId,
            seasonId: member.seasonId,
          },
        },
        data: {
          points: totalPoints._sum.points ?? 0,
          correctPredictions: totalPoints._sum.correctPredictions ?? 0,
          goalDifference: totalPoints._sum.goalDifference ?? 0,
        },
      });
    }

    return { success: true, message: "Fixture results applied successfully." };
  } catch (error) {
    console.error("Error applying fixture results:", error);
    return {
      success: false,
      message: "Failed to apply fixture results.",
      error,
    };
  }
}

export async function getGameweekFixtureData() {
  try {
    const latestUpdate = await prisma.fixture.findFirst({
      orderBy: { updatedAt: "desc" },
      select: { updatedAt: true },
    });

    const now = new Date();
    const THRESHOLD_MINUTES = 10;

    if (
      latestUpdate &&
      now.getTime() - latestUpdate.updatedAt.getTime() <
        THRESHOLD_MINUTES * 60 * 1000
    ) {
      console.log("Skipping fixture update: updated recently.");
      return null;
    }

    const fixtures = await prisma.fixture.findMany({
      where: {
        kickoff: {
          lte: now,
        },
        OR: [
          { status: "SCHEDULED" },
          { status: "IN_PLAY" }, // LIVE
          { status: "PAUSED" }, // LIVE
        ],
      },
      select: {
        externalId: true,
      },
    });

    if (!fixtures || fixtures.length === 0) {
      console.log("No fixtures to update.");
      return null;
    }

    const fixtureData = [];
    for (const fixture of fixtures) {
      try {
        console.log(
          `Fetching fixture data for externalId: ${fixture.externalId}`
        );
        const response = await fetch(
          `https://api.football-data.org/v4/matches/${fixture.externalId}`,
          {
            method: "GET",
            headers,
          }
        );

        if (!response.ok) {
          console.warn(`No response for fixture ${fixture.externalId}`);
          throw new Error(`Bad response: ${response.statusText}`);
        }

        const data: ApiFixture = await response.json();

        if (!data || !data.id || !data.score || !data.status) {
          console.warn(`No data for fixture ${fixture.externalId}`);
          throw new Error(`Missing fixture data: ${response.statusText}`);
        }

        const { id, score, status } = data;
        const { halfTime, fullTime } = score;

        const homeScore =
          fullTime.home !== null ? fullTime.home : halfTime.home;
        const awayScore =
          fullTime.away !== null ? fullTime.away : halfTime.away;

        fixtureData.push({
          externalId: id,
          homeScore,
          awayScore,
          status,
        });
      } catch (error) {
        console.error(`Failed to fetch fixture ${fixture.externalId}:`, error);
      }
    }

    return fixtureData;
  } catch (error) {
    console.error("Error fetching gameweek fixtures:", error);
    throw new Error("Failed to fetch gameweek fixtures.");
  }
}
