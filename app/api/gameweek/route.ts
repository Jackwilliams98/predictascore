import { createNewFixtures } from "@/lib/gameweekAPI";
import type { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  try {
    // const currentGameweek = updateCurrentGameweek();
    // const result = await createNewGameweek();
    const fixtures = await createNewFixtures(1);
    // const gameweekFixtures = await createGameweekFixtures(result.fixtures);
    // const updatedLeagues = await updateLeaguesCurrentGameweek(currentGameweek);

    return Response.json({ success: true, fixtures });
  } catch (error) {
    console.error("Error creating gameweek:", error);

    return Response.json({ success: false, error });
  }
}

/* 
- Check if there is an existing active gameweek
  - update status to completed
  - update isComplete to true
- Create a new gameweek with status "active"
  - apply current season
  - increment gameweek number
  - set the deadline to saturday at 11:00 UTC
  - link gameweek to leagues
- Get the fixture information and create new fixtures
- Create a gameweekFixture row to link the gameweek to the fixtures
- Update the league's current gameweek to the new gameweek
*/
