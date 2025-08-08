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
    const gameweekFixtures = await getGameweekFixtureData();

    if (!gameweekFixtures) {
      return Response.json({ success: false, message: "No fixtures found." });
    }

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
