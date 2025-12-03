/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: User registration
 *     tags: 
 *     - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserInput'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
import type { Request, Response, NextFunction } from "express";
import { UserSchema } from "../../validators/user.validator.js";
import { userService } from "../../services/user.service.js";


const registerController = async (req: Request, res: Response, next: NextFunction) => {
   try {
        const validated = UserSchema.parse(req.body); // Zod validation
        const user = await userService.createUser(validated);

        res.status(201).json(user);
  }catch (error: any) {
    console.error("Registration error:", error.message);
    res.status(400).json({ message: error.message });
    next(error);
  }
};

export default registerController;


