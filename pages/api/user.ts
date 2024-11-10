// pages/api/users/index.ts - For operations on users collection
import { NextApiRequest, NextApiResponse } from "next";
import { sql } from "@vercel/postgres";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    case "GET":
      return await getUsers(req, res);
    case "POST":
      return await createUser(req, res);
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

async function createUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email required" });
    }

    const user = await sql`
      INSERT INTO "User" (name, email) 
      VALUES (${name}, ${email}) 
      RETURNING *
    `;
    return res.status(201).json(user.rows[0]);
  } catch (error) {
    return res.status(500).json({ error });
  }
}
