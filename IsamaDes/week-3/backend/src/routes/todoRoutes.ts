const express = require("express");
const getTodos = require("../controllers/todo/getTodoController");
const createTodo = require("../controllers/todo/createTodoController");
const updateTodo = require("../controllers/todo/updateTodoController");
const deleteTodo = require("../controllers/todo/deleteTodoController");

const auth = require("../middleware/auth")

const router = express.Router();

router.route("/")
  .get(auth, getTodos)
  .post(auth, createTodo);

router.route("/:id")
  .put(auth, updateTodo)
  .delete(auth, deleteTodo);

export default router;
