import { NextApiRequest, NextApiResponse } from "next";

import { getMatchesByMatchday } from "@/lib/footballApi";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    case "GET":
      return await getMatchesByMatchday(req, res);
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res
        .status(405)
        .json({ error: `Method ${req.method} Not Allowed` });
  }
}
