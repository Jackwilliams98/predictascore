import type { NextApiRequest, NextApiResponse } from "next";
import * as footballApi from "../../lib/footballApi";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method, ...params } = req.query;

  if (!method || typeof method !== "string" || !(method in footballApi)) {
    return res
      .status(400)
      .json({ error: "Invalid or missing method parameter" });
  }

  try {
    const apiMethod = footballApi[method as keyof typeof footballApi];

    // Convert params to the correct types
    const typedParams = Object.keys(params).reduce((acc, key) => {
      const value = params[key];
      if (value !== undefined) {
        acc[key] = Array.isArray(value) ? value[0] : value;
      }
      return acc;
    }, {} as Record<string, any>);

    // Convert matchday to a number if it exists
    if (typedParams.matchday) {
      typedParams.matchday = Number(typedParams.matchday);
    }

    // Use type assertion to inform TypeScript that typedParams has the required properties
    const data = await apiMethod(typedParams as any);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
}
