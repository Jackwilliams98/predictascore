import { getGameweekFixtureData, updateFixtureResults } from "@/lib/scoresAPI";
import type { NextRequest, NextResponse } from "next/server";

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
        const { id, homeScore, awayScore, status } = fixture; // full time scores

        console.log(
          `Processing fixture with id: ${id}, homeScore: ${homeScore}, awayScore: ${awayScore}, status: ${status}`
        );

        if (
          homeScore === null ||
          awayScore === null ||
          (status !== "FINISHED" && status !== "IN_PLAY" && status !== "PAUSED")
        ) {
          console.warn(`Skipping fixture with id ${id} due to missing scores.`);
          return;
        }
        await updateFixtureResults({
          id,
          homeScore,
          awayScore,
          status,
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
