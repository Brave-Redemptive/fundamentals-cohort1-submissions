import { Request, Response } from "express";
import TransactionService from "../services/transactionService";

export const sendMoney = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const result = await TransactionService.sendMoney(userId, req.body);

    return res.status(201).json(result);
  } catch (err: any) {
    console.error("Transaction error:", err);
    return res.status(400).json({ error: err.message });
  }
};
