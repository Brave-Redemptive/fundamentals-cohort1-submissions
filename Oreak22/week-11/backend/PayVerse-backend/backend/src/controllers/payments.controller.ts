import { Request, Response } from "express";
import { PaymentsService } from "../services/payments.service";

export class PaymentsController {
  static async create(req: Request, res: Response) {
    try {
      const { fromAccountId, toAccountId, amount } = req.body;

      if (!fromAccountId || !toAccountId || !amount) {
        return res.status(400).json({
          error: "fromAccountId, toAccountId and amount are required",
        });
      }

      const payment = await PaymentsService.createPayment(
        Number(fromAccountId),
        Number(toAccountId),
        Number(amount)
      );

      return res.status(201).json(payment);
    } catch (err: any) {
      return res.status(err.code || 500).json({
        error: err.message || "Internal Server Error",
      });
    }
  }

  static async getOne(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const payment = await PaymentsService.getPayment(Number(id));

      if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
      }

      return res.json(payment);
    } catch (err: any) {
      return res.status(err.code || 500).json({
        error: err.message || "Internal Server Error",
      });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const payments = await PaymentsService.getAllPayments();

      return res.json(payments);
    } catch (err: any) {
      return res.status(err.code || 500).json({
        error: err.message || "Internal Server Error",
      });
    }
  }
}
