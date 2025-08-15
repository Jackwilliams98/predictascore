import { NextApiRequest, NextApiResponse } from "next";

import { getGameweekTable } from "@/lib/gameweekAPI";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      return await getGameweekTableHandler(req, res);
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res
        .status(405)
        .json({ error: `Method ${req.method} Not Allowed` });
  }
}

async function getGameweekTableHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { leagueId, gameweekNumber } = req.query;

  console.log("getGameweekTableHandler called with:", {
    leagueId,
    gameweekNumber,
  });

  if (!leagueId || !gameweekNumber) {
    return res
      .status(400)
      .json({ error: "Missing leagueId or gameweekNumber" });
  }

  // Convert gameweekNumber to a number
  const parsedGameweekNumber = Array.isArray(gameweekNumber)
    ? parseInt(gameweekNumber[0], 10)
    : parseInt(gameweekNumber as string, 10);

  if (isNaN(parsedGameweekNumber)) {
    return res.status(400).json({ error: "Invalid gameweekNumber" });
  }

  try {
    const response = await getGameweekTable(
      leagueId as string,
      parsedGameweekNumber
    );
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch gameweek table" });
  }
}
