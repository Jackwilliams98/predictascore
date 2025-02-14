// pages/api/users/index.ts - For operations on users collection
import { NextApiRequest, NextApiResponse } from "next";
import { sql } from "@vercel/postgres";
import { createUser } from "@/lib/userAPI";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      return await getUsers(req, res);
    case "POST":
      return await createUserHandler(req, res);
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res
        .status(405)
        .json({ error: `Method ${req.method} Not Allowed` });
  }
}

async function getUsers(req: NextApiRequest, res: NextApiResponse) {
  try {
    const users = await sql`SELECT * FROM "User"`;
    return res.status(200).json(users.rows);
  } catch (error) {
    return res.status(500).json({ error });
  }
}

async function createUserHandler(req: NextApiRequest, res: NextApiResponse) {
  const { name, email } = req.body;
  try {
    const user = await createUser(name, email);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
}
