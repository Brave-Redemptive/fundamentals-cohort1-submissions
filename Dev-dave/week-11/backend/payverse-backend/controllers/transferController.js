import { db } from "../db.js";

export const transferMoney = async (req, res) => {
  const { fromId, toId, amount } = req.body;

  const client = await db.connect();
  try {
    await client.query("BEGIN");

    const from = await client.query(
      "SELECT balance FROM accounts WHERE id=$1",
      [fromId]
    );

    if (from.rows[0].balance < amount) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Insufficient balance" });
    }

    await client.query(
      "UPDATE accounts SET balance = balance - $1 WHERE id=$2",
      [amount, fromId]
    );

    await client.query(
      "UPDATE accounts SET balance = balance + $1 WHERE id=$2",
      [amount, toId]
    );

    await client.query("COMMIT");
    res.json({ message: "Transfer successful" });
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).json({ message: "Transfer failed" });
  } finally {
    client.release();
  }
};
