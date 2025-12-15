import { Request, Response } from "express";
import * as txService from "../services/transaction.service.js" 

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Endpoints for managing transactions
 */

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Create a new transaction
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - productId
 *               - amountCents
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "uuid-user-1234"
 *               productId:
 *                 type: string
 *                 example: "uuid-product-5678"
 *               amountCents:
 *                 type: integer
 *                 example: 1500
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 */
export const processTransaction = async (req: Request, res: Response) => {
   const {userId, productId, amountCents} = req.body;
   const transaction = await txService.createTransaction({userId, productId, amountCents});
   res.status(201).json(transaction);
};

/**
 * @swagger
 * /api/transactions/recent/{userId}:
 *   get:
 *     summary: Get recent transactions for a user (last 1 month)
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           example: "uuid-user-1234"
 *     responses:
 *       200:
 *         description: List of recent transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: User ID is required
 */
export const recentTransactions = async (req: Request, res: Response) => {
   const userId = req.params.userId;
    if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }
   const since = new Date(); //new Date() → creates a JavaScript Date object representing the current date and time
   since.setMonth(since.getMonth() - 1 ); //since.getMonth => gets the current month as a number and months are zero-indexed so i used -1
   const transactions = await txService.getUserRecentTransactions(userId, since)
   res.json(transactions);
};