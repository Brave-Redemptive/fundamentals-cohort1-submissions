//Handles Http request/responses from the client and delegates to services
// Validates incoming data using Zod.

// Sends only safe, parsed data to the service layer.

// Handles HTTP response and error structure (not business logic).

import { Response } from "express";
import { userService } from "../services/user.service.js";
import { AuthenticatedRequest } from "../middlewares/authMiddleware.js";
import { UserSchema } from "../validators/user.validator.js";



/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get current authenticated user's details
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Authenticated user's info
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid user ID
 *       404:
 *         description: User not found
 */
export const getCurrentUser = async(req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?._id;
    if (!userId) return res.status(400).json({ message: "Invalid user ID" });
     const user = await userService.findUserById(userId);
    res.status(200).json(user);
};


/**
 * @swagger
 * /api/users/create:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserInput'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
export const createUser = async(req: AuthenticatedRequest, res: Response) => {
try {
    console.log("Incoming body:", req.body);
    const validated = UserSchema.parse(req.body); // Zod validation
    const user = await userService.createUser(validated);
    res.status(201).json(user);
  } catch (err: any) {
    res.status(400).json({
      message: "Invalid Data",
      error: err.errors ?? err.message,
    });
  }
};


/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Fetch all users
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
export const fetchUsers = async(req: AuthenticatedRequest, res: Response) => {
    const {limit, skip} = (req as any).pagination || {limit: 20, take: 0};
    const result = await userService.getUsers(skip, limit);
    res.status(200).json(result);

};



/**
 * @swagger
 * /api/users/{userId}:
 *   get:
 *     summary: Get a user's details by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           example: "uuid-1234"
 *         description: gets the authenticated user's details
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid user ID supplied
 *       404:
 *         description: User not found
 */
export const getUserById = async(req: AuthenticatedRequest, res: Response) => {
    const userId = req.params.userId;
    if(!userId) throw new Error("Invalid user Id")
     const user = await userService.findUserById(userId);
    res.status(200).json(user);
};
