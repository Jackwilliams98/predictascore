import { getGameweekFixtureData, updateFixtureResults } from "@/lib/scoresAPI";
import type { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest, res: NextResponse) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  try {
    // const gameweekFixtures = await getGameweekFixtureData();

    // if (!gameweekFixtures) {
    //   return Response.json({ success: false, message: "No fixtures found." });
    // }

    const gameweekFixtures = [
      {
        externalId: 537787,
        homeScore: 2,
        awayScore: 1,
      },
      {
        externalId: 537786,
        homeScore: 1,
        awayScore: 1,
      },
      {
        externalId: 537792,
        homeScore: 3,
        awayScore: 0,
      },
      {
        externalId: 537789,
        homeScore: 0,
        awayScore: 2,
      },
      { externalId: 540730, homeScore: 1, awayScore: 1 },
      { externalId: 537791, homeScore: 2, awayScore: 2 },
      { externalId: 537793, homeScore: 3, awayScore: 1 },
      { externalId: 537788, homeScore: 0, awayScore: 0 },
      { externalId: 540726, homeScore: 0, awayScore: 0 },
      { externalId: 537790, homeScore: 0, awayScore: 0 },
    ];

    await Promise.all(
      gameweekFixtures.map(async (fixture) => {
        const { externalId, homeScore, awayScore } = fixture; // full time scores

        if (homeScore === null || awayScore === null) {
          console.warn(
            `Skipping fixture with externalId ${externalId} due to missing scores.`
          );
          return;
        }
        await updateFixtureResults({
          externalId,
          homeScore,
          awayScore,
        });
      })
    );
    console.log("Fixture results updated successfully.");
    return Response.json({ success: true });
  } catch (error) {
    console.error("Error creating gameweek:", error);

    return Response.json({ success: false, error });
  }
}
