import { createLeague } from "@/lib/leagueAPI";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      return await createLeagueHandler(req, res);
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res
        .status(405)
        .json({ error: `Method ${req.method} Not Allowed` });
  }
}

async function createLeagueHandler(req: NextApiRequest, res: NextApiResponse) {
  const { leagueName, userId } = req.body;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (!leagueName) {
    return res.status(400).json({ error: "League name is required" });
  }

  try {
    const league = await createLeague(leagueName, userId);
    res.status(201).json(league);
  } catch (error) {
    res.status(500).json(error);
  }
}
