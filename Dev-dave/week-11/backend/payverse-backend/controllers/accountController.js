import { db } from "../db.js";

export const getAccount = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await db.query(
      "SELECT id, owner, balance FROM accounts WHERE id=$1",
      [id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Account not found" });

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
