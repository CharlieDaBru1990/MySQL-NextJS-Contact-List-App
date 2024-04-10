// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { pool } from "../../config/db";

export default async function handler(req, res) {
  try {
    const [results] = await pool.query("SHOW TABLES");
    // Ensuring consistency by using res.json() for sending back JSON data
    res.status(200).json({ tableName: results[1]["Tables_in_ci_crud"] });
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
