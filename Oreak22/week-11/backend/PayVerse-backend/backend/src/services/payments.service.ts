import { pool } from "../db/index";

export class PaymentsService {
  static async createPayment(from: number, to: number, amount: number) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const sender = await client.query(
        "SELECT balance FROM accounts WHERE id = $1",
        [from]
      );
      console.log("Sender:", sender);

      if (sender.rows[0].balance < amount) {
        throw new Error("INSUFFICIENT_FUNDS");
      }

      await client.query(
        "UPDATE accounts SET balance = balance - $1 WHERE id = $2",
        [amount, from]
      );

      await client.query(
        "UPDATE accounts SET balance = balance + $1 WHERE id = $2",
        [amount, to]
      );

      const result = await client.query(
        "INSERT INTO payments(from_account, to_account, amount, status) VALUES($1,$2,$3,'SUCCESS') RETURNING *",
        [from, to, amount]
      );

      await client.query("COMMIT");
      return result.rows[0];
    } catch (err: any) {
      await client.query("ROLLBACK");
      if (err.message === "INSUFFICIENT_FUNDS") {
        throw { code: 409, message: err.message };
      }
      console.error(err);
      throw { code: 500, message: "Payment failed" };
    } finally {
      client.release();
    }
  }

  static async getAllPayments() {
    try {
      const query = `
      SELECT id, fromAccountId, toAccountId, amount, status, createdAt
      FROM payments
      ORDER BY createdAt DESC
    `;

      const result = await pool.query(query);
      return result.rows;
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch payments");
    }
  }

  static async getPayment(id: number) {
    const result = await pool.query("SELECT * FROM payments WHERE id=$1", [id]);
    return result.rows[0];
  }
}
