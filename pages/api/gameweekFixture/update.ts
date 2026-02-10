import {
  getCurrentGameweek,
  upsertManualGameweekFixture,
} from "@/lib/gameweekAPI";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    case "POST":
      return await upsertFixtureHandler(req, res);
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res
        .status(405)
        .json({ error: `Method ${req.method} Not Allowed` });
  }
}

async function upsertFixtureHandler(req: NextApiRequest, res: NextApiResponse) {
  const { fixture } = req.body;

  if (!fixture) {
    return res.status(400).json({ error: "Fixture data is required" });
  }

  const gameweek = await getCurrentGameweek();
  if (!gameweek) {
    throw new Error("No active gameweek found");
  }

  const {
    id,
    homeTeam,
    awayTeam,
    kickoff,
    homeScore,
    awayScore,
    status,
    externalId,
  } = fixture;

  try {
    const fixture = await upsertManualGameweekFixture(gameweek.id, {
      id,
      homeTeam,
      awayTeam,
      kickoff,
      homeScore,
      awayScore,
      status,
      externalId,
    });
    res.status(201).json(fixture);
  } catch (error) {
    res.status(500).json(error);
  }
}
