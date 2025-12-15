import Todo from "../../models/Todo.js";
import type { Request, Response, NextFunction } from "express";

/**
 * @swagger
 * /auth/todos:
 *   get:
 *     summary: Get all todos for the logged-in user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user todos
 */
async function getTodos (req: Request, res: Response, next: NextFunction){
    try {
      const todos = await Todo.find({userId: req.user._id}) || [];
      res.json(todos);
    } catch (err) {
      next(err);
    }
  };
export default getTodos;