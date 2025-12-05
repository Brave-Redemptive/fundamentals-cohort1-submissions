import database, { getNextTaskId } from '../config/database.js';

// Get all tasks
export const getAllTasks = (req, res) => {
  try {
    const { status, assignee } = req.query;
    let tasks = database.tasks;

    if (status) {
      tasks = tasks.filter(t => t.status === status);
    }
    if (assignee) {
      tasks = tasks.filter(t => t.assignee === assignee);
    }

    res.status(200).json({
      success: true,
      message: 'Tasks retrieved successfully',
      data: tasks,
      count: tasks.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get task by ID
export const getTaskById = (req, res) => {
  try {
    const task = database.tasks.find(t => t.id === parseInt(req.params.id));
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Task retrieved successfully',
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create new task
export const createTask = (req, res) => {
  try {
    const {
      title,
      description = '',
      status = 'todo',
      priority = 'medium',
      assignee = 'Unassigned',
      dueDate
    } = req.body;

    const newTask = {
      id: getNextTaskId(),
      title,
      description,
      status,
      priority,
      assignee,
      dueDate: dueDate || null,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    database.tasks.push(newTask);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: newTask
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update task
export const updateTask = (req, res) => {
  try {
    const task = database.tasks.find(t => t.id === parseInt(req.params.id));
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    const { title, description, status, priority, assignee, dueDate } = req.body;
    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (assignee) task.assignee = assignee;
    if (dueDate !== undefined) task.dueDate = dueDate;

    task.updatedAt = new Date().toISOString().split('T')[0];

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete task
export const deleteTask = (req, res) => {
  try {
    const index = database.tasks.findIndex(t => t.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    const deletedTask = database.tasks.splice(index, 1);
    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: deletedTask[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
