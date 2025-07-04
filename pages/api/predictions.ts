import { upsertGameweekPredictions } from "@/lib/predictionAPI";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      return await submitPredictionsHandler(req, res);
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res
        .status(405)
        .json({ error: `Method ${req.method} Not Allowed` });
  }
}

async function submitPredictionsHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId, gameweekId, predictions } = req.body;

  try {
    const result = await upsertGameweekPredictions(
      userId,
      gameweekId,
      predictions
    );
    res.status(201).json(result);
  } catch (error) {
    console.log("Error submitting predictions:", error);

    res.status(500).json({ error: "Failed to submit predictions" });
  }
}
