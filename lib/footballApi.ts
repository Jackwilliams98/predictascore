import { NextApiRequest, NextApiResponse } from "next";
import { getGameweekTable } from "./gameweekAPI";

const token = process.env.NEXT_PUBLIC_FOOTBALL_API_TOKEN;
if (!token) {
  throw new Error("API token is not defined");
}

const headers = {
  "X-Auth-Token": token,
  "Content-Type": "application/json",
};

export const getGameweek = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { leagueId, gameweekNumber } = req.query;

  if (!leagueId || !gameweekNumber) {
    return res
      .status(400)
      .json({ error: "Missing leagueId or gameweekNumber" });
  }

  try {
    const response = await getGameweekTable(leagueId, gameweekNumber);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error });
  }
};
