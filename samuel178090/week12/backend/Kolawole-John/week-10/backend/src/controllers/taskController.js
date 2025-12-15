const Task = require('../models/Task');
const { validationResult } = require('express-validator');

let tasks = [];

const getAllTasks = (req, res) => {
  const { status, priority, assignee } = req.query;
  
  let filteredTasks = [...tasks];
  
  if (status) {
    filteredTasks = filteredTasks.filter(task => task.status === status);
  }
  
  if (priority) {
    filteredTasks = filteredTasks.filter(task => task.priority === priority);
  }
  
  if (assignee) {
    filteredTasks = filteredTasks.filter(task => 
      task.assignee.toLowerCase().includes(assignee.toLowerCase())
    );
  }
  
  res.status(200).json({
    status: 'success',
    results: filteredTasks.length,
    data: { tasks: filteredTasks }
  });
};

const getTaskById = (req, res) => {
  const { id } = req.params;
  const task = tasks.find(t => t.id === id);
  
  if (!task) {
    return res.status(404).json({
      status: 'error',
      message: 'Task not found'
    });
  }
  
  res.status(200).json({
    status: 'success',
    data: { task }
  });
};

const createTask = (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      errors: errors.array()
    });
  }
  
  const { title, description, assignee, priority } = req.body;
  
  const newTask = new Task(title, description, assignee, priority);
  tasks.push(newTask);
  
  res.status(201).json({
    status: 'success',
    message: 'Task created successfully',
    data: { task: newTask }
  });
};

const updateTask = (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      errors: errors.array()
    });
  }
  
  const { id } = req.params;
  const task = tasks.find(t => t.id === id);
  
  if (!task) {
    return res.status(404).json({
      status: 'error',
      message: 'Task not found'
    });
  }
  
  task.update(req.body);
  
  res.status(200).json({
    status: 'success',
    message: 'Task updated successfully',
    data: { task }
  });
};

const deleteTask = (req, res) => {
  const { id } = req.params;
  const taskIndex = tasks.findIndex(t => t.id === id);
  
  if (taskIndex === -1) {
    return res.status(404).json({
      status: 'error',
      message: 'Task not found'
    });
  }
  
  tasks.splice(taskIndex, 1);
  
  res.status(204).send();
};

const getTaskStats = (req, res) => {
  const stats = {
    total: tasks.length,
    byStatus: {
      todo: tasks.filter(t => t.status === 'todo').length,
      'in-progress': tasks.filter(t => t.status === 'in-progress').length,
      review: tasks.filter(t => t.status === 'review').length,
      done: tasks.filter(t => t.status === 'done').length
    },
    byPriority: {
      low: tasks.filter(t => t.priority === 'low').length,
      medium: tasks.filter(t => t.priority === 'medium').length,
      high: tasks.filter(t => t.priority === 'high').length,
      urgent: tasks.filter(t => t.priority === 'urgent').length
    }
  };
  
  res.status(200).json({
    status: 'success',
    data: { stats }
  });
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats
};