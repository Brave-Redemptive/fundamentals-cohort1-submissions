import pool from "../config/database";
import { CreateTransactionDTO } from "../models/transactionModel";

class TransactionService {
  async sendMoney(userId: string, data: CreateTransactionDTO) {
    const { toAccountNumber, amount, description } = data;

    if (amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const senderAccountResult = await client.query(
        `SELECT * FROM accounts WHERE user_id = $1`,
        [userId]
      );

      if (senderAccountResult.rows.length === 0) {
        throw new Error("Sender account not found");
      }

      const sender = senderAccountResult.rows[0];

      if (sender.balance < amount) {
        throw new Error("Insufficient balance");
      }

      const receiverAccountResult = await client.query(
        `SELECT * FROM accounts WHERE account_number = $1`,
        [toAccountNumber]
      );

      if (receiverAccountResult.rows.length === 0) {
        throw new Error("Recipient account not found");
      }

      const receiver = receiverAccountResult.rows[0];

      await client.query(
        `UPDATE accounts SET balance = balance - $1 WHERE id = $2`,
        [amount, sender.id]
      );

      await client.query(
        `UPDATE accounts SET balance = balance + $1 WHERE id = $2`,
        [amount, receiver.id]
      );

      // Add transaction record
      const txResult = await client.query(
        `INSERT INTO transactions 
          (from_account_id, to_account_id, amount, description, status) 
         VALUES ($1, $2, $3, $4, 'completed')
         RETURNING *`,
        [sender.id, receiver.id, amount, description || null]
      );

      await client.query("COMMIT");

      return {
        message: "Transaction successful",
        transaction: txResult.rows[0],
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}

export default new TransactionService();

export { TransactionService };
