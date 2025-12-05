import type {Request, Response, NextFunction} from "express"

import Todo from "../../models/Todo.js";

/**
 * @swagger
 * /auth/todos/{id}:
 *   put:
 *     summary: Update a todo by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               completed:
 *                 type: boolean
 *               priority:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Todo updated
 */
async function updateTodo(req: Request, res: Response, next: NextFunction){
  try {
    const { completed, priority } = req.body;
    const todo = await Todo.findByIdAndUpdate(
      {_id: req.params.id, userId: req.user._id},
      { completed, priority },
      { new: true }
    );
    if (!todo) {
      res.status(404);
      throw new Error("Todo not found");
    }
    res.json(todo);
  } catch (err) {
    next(err);
  }
};

export default updateTodo;