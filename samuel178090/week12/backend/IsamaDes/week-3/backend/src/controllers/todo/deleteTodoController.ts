
import type { Request, Response, NextFunction } from "express";
import Todo from "../../models/Todo.js";


/**
 * @swagger
 * /auth/todos/{id}:
 *   delete:
 *     summary: Delete a todo by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Todo deleted
 */
async function deleteTodo (req: Request, res: Response, next: NextFunction){
  try {
    const todo = await Todo.findByIdAndDelete({_id: req.params.id, userId: req.user._id});
    if (!todo) {
      res.status(404);
      throw new Error("Todo not found");
    }
    res.json({ message: "Todo deleted" });
  } catch (err) {
    next(err);
  }
};

export default deleteTodo;