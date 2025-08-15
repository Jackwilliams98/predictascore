import prisma from "@/lib/prisma";

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
}: {
  externalId: number;
  homeScore: number;
  awayScore: number;
}) {
  try {
    // 1. Update the Fixture
    const fixture = await prisma.fixture.update({
      where: { externalId },
      data: {
        homeScore: homeScore,
        awayScore: awayScore,
        status: "FINISHED",
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

    // 5. Update LeagueMember points for each user in this fixture
    for (const prediction of predictions) {
      const gwp = prediction.gameweekPrediction;
      if (!gwp) continue;

      const leagueMembers = await prisma.leagueMember.findMany({
        where: {
          // leagueId: gwp.leagueId, update when unique fixtures per league is implemented
          seasonId: gwp.seasonId,
        },
      });

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
    const fixtures = await prisma.fixture.findMany({
      where: { status: "SCHEDULED" },
      select: {
        externalId: true,
      },
    });

    if (!fixtures || fixtures.length === 0) {
      return null;
    }

    const fixtureData = await Promise.all(
      fixtures.map(async (fixture) => {
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
        const data = await response.json();

        const { id, score } = data;

        return {
          externalId: id,
          homeScore: score.fullTime.home,
          awayScore: score.fullTime.away,
        };
      })
    );

    return fixtureData;
  } catch (error) {
    console.error("Error fetching gameweek fixtures:", error);
    throw new Error("Failed to fetch gameweek fixtures.");
  }
}
