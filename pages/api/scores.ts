import { NextApiRequest, NextApiResponse } from "next";

import { updateFixtureResults } from "@/lib/scoresAPI";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      return await updateFixtureResultHandler(req, res);
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res
        .status(405)
        .json({ error: `Method ${req.method} Not Allowed` });
  }
}

async function updateFixtureResultHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { fixtureId, homeScore, awayScore } = req.body;

  try {
    const result = await updateFixtureResults({
      fixtureId,
      homeScore,
      awayScore,
    });
    res.status(201).json(result);
  } catch (error) {
    console.log("Error updating fixtures:", error);

    res.status(500).json({ error: "Failed to update fixtures" });
  }
}
