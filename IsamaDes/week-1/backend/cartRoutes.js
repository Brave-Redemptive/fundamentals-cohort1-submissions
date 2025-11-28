const express = require("express");
const router = express.Router();
const cartController = require("./CartController");

/**
 * @swagger
 * /cart/add-to-cart:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               productId:
 *                 type: string
 *               productName:
 *                 type: string
 *               productQuantity:
 *                 type: integer
 *               manufactureDate:
 *                 type: string
 *                 format: date
 *               expiryDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Item added to cart
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /cart/get-cart/{userId}:
 *   get:
 *     summary: Get items in a user's cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: Cart items retrieved successfully
 *       404:
 *         description: Cart not found
 */

router.post("/add-to-cart", cartController.addToCArt);
router.get("/get-cart/:userId", cartController.getCart);

module.exports = router;
