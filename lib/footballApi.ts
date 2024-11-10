import { transformStandings } from "@/utils";
import { NextApiRequest, NextApiResponse } from "next";

const token = process.env.NEXT_PUBLIC_FOOTBALL_API_TOKEN;
if (!token) {
  throw new Error("API token is not defined");
}

const headers = {
  "X-Auth-Token": token,
  "Content-Type": "application/json",
};

export const getMatchesByMatchday = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const matchday = req.query.matchday as string;
  console.log("Matchday:", matchday);
  const url = `https://api.football-data.org/v4/competitions/PL/matches?matchday=${matchday}`;

  try {
    const matches = await fetch(url, {
      method: "GET",
      headers,
    });
    const data = await matches.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error });
  }
};
