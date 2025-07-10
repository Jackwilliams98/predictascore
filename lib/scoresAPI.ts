import prisma from "@/lib/prisma";

/**
 * Updates fixture results, scores predictions, updates gameweek and league points.
 * @param fixtureResults Array of objects: { fixtureId, homeScore, awayScore }
 */
export async function updateFixtureResults({
  fixtureId,
  homeScore,
  awayScore,
}: {
  fixtureId: string;
  homeScore: number;
  awayScore: number;
}) {
  try {
    // 1. Update the Fixture
    await prisma.fixture.update({
      where: { id: fixtureId },
      data: {
        homeScore: homeScore,
        awayScore: awayScore,
        status: "FINISHED",
      },
    });

    // 2. Get all predictions for this fixture
    const predictions = await prisma.prediction.findMany({
      where: { fixtureId: fixtureId },
      include: { gameweekPrediction: true },
    });

    // 3. Score each prediction and update
    for (const prediction of predictions) {
      let points = 0;

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

      await prisma.prediction.update({
        where: { id: prediction.id },
        data: { points },
      });
    }

    // 4. For each GameweekPrediction, update total points
    const gameweekPredictionIds = Array.from(
      new Set(predictions.map((p) => p.gameweekPredictionId))
    );
    for (const gwpId of gameweekPredictionIds) {
      const totalPoints = await prisma.prediction.aggregate({
        where: { gameweekPredictionId: gwpId },
        _sum: { points: true },
      });
      await prisma.gameweekPrediction.update({
        where: { id: gwpId },
        data: { points: totalPoints._sum.points ?? 0 },
      });
    }

    // 5. (Optional) Update LeagueMember points for each user in this fixture
    for (const prediction of predictions) {
      const gwp = prediction.gameweekPrediction;
      if (!gwp) continue;

      const leagueMembers = await prisma.leagueMember.findMany({
        where: {
          leagueId: gwp.leagueId,
          seasonId: gwp.seasonId,
        },
      });

      for (const member of leagueMembers) {
        // Sum all GameweekPrediction points for this user/league/season
        const totalPoints = await prisma.gameweekPrediction.aggregate({
          where: {
            userId: member.userId,
            leagueId: member.leagueId,
            seasonId: member.seasonId,
          },
          _sum: { points: true },
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
