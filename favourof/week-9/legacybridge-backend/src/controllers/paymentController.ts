import { Request, Response } from "express";
import paymentService from "../services/paymentService";

export const getPayments = async (req: Request, res: Response) => {
  try {
    const data = await paymentService.fetchPayments();
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching payments",
    });
  }
};
