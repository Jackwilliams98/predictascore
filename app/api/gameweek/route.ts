import {
  createGameweekFixtures,
  createNewFixtures,
  createNewGameweek,
  updateCurrentGameweek,
} from "@/lib/gameweekAPI";
import type { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  try {
    const currentGameweek = await updateCurrentGameweek();
    const newGameweek = await createNewGameweek(currentGameweek);
    const fixtures = await createNewFixtures();
    await createGameweekFixtures(fixtures, newGameweek);

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error creating gameweek:", error);

    return Response.json({ success: false, error });
  }
}
