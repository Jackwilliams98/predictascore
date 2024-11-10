import { sql } from "@vercel/postgres";
import { NextApiResponse, NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query;

  switch (req.method) {
    case "GET":
      return await getUser(req, res, id as string);
    case "PUT":
    case "PATCH":
      return await updateUser(req, res, id as string);
    case "DELETE":
      return await deleteUser(req, res, id as string);
    default:
      res.setHeader("Allow", ["GET", "PUT", "PATCH", "DELETE"]);
      return res
        .status(405)
        .json({ error: `Method ${req.method} Not Allowed` });
  }
}

async function getUser(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    const user = await sql`SELECT * FROM "User" WHERE id = ${id}`;
    return res.status(200).json(user.rows[0]);
  } catch (error) {
    return res.status(500).json({ error });
  }
}

async function updateUser(
  req: NextApiRequest,
  res: NextApiResponse,
  id: string,
) {
  try {
    const { name, email } = req.body;
    const user = await sql`
      UPDATE "User" 
      SET name = ${name}, email = ${email} 
      WHERE id = ${id} 
      RETURNING *
    `;
    return res.status(200).json(user.rows[0]);
  } catch (error) {
    return res.status(500).json({ error });
  }
}

async function deleteUser(
  req: NextApiRequest,
  res: NextApiResponse,
  id: string,
) {
  try {
    await sql`DELETE FROM "User" WHERE id = ${id}`;
    return res.status(204).end();
  } catch (error) {
    return res.status(500).json({ error });
  }
}
