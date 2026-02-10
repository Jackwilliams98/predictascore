import {
  deleteManualGameweekFixture,
  getCurrentGameweek,
  upsertManualGameweekFixture,
} from "@/lib/gameweekAPI";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      return await deleteFixtureHandler(req, res);
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res
        .status(405)
        .json({ error: `Method ${req.method} Not Allowed` });
  }
}

async function deleteFixtureHandler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Fixture ID is required" });
  }

  const gameweek = await getCurrentGameweek();

  if (!gameweek) {
    throw new Error("No active gameweek found");
  }

  try {
    await deleteManualGameweekFixture(gameweek.id, id);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json(error);
  }
}
