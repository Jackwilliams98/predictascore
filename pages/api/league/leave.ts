import { leaveLeague } from "@/lib/leagueAPI";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      return await leaveLeagueHandler(req, res);
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res
        .status(405)
        .json({ error: `Method ${req.method} Not Allowed` });
  }
}

async function leaveLeagueHandler(req: NextApiRequest, res: NextApiResponse) {
  const { leagueId, userId } = req.body;

  if (!leagueId) {
    return res.status(400).json({ error: "League ID is required" });
  }
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const league = await leaveLeague(leagueId, userId);
    res.status(201).json(league);
  } catch (error) {
    res.status(500).json({ error: "Failed to leave league" });
  }
}
