import { getCompetitionStandings, StandingsResponse } from "@/lib/tableAPI";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StandingsResponse>,
) {
  try {
    const data = await getCompetitionStandings();

    if (!data) {
      res.status(404).json({ error: "Data not found" });
      return;
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data", details: error });
  }
}
