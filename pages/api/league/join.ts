import { joinLeague } from "@/lib/leagueAPI";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      return await joinLeagueHandler(req, res);
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res
        .status(405)
        .json({ error: `Method ${req.method} Not Allowed` });
  }
}

async function joinLeagueHandler(req: NextApiRequest, res: NextApiResponse) {
  const { joinCode, userId } = req.body;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (!joinCode) {
    return res.status(400).json({ error: "Join code is required" });
  }

  try {
    const league = await joinLeague(joinCode, userId);
    res.status(201).json(league);
  } catch (error) {
    res.status(500).json({ error: "Failed to join league" });
  }
}
