const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats
} = require('../controllers/taskController');

const taskValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10, max: 500 }).withMessage('Description must be between 10 and 500 characters'),
  body('assignee')
    .trim()
    .notEmpty().withMessage('Assignee is required'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority value')
];

const updateValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 }).withMessage('Description must be between 10 and 500 characters'),
  body('assignee')
    .optional()
    .trim()
    .notEmpty().withMessage('Assignee cannot be empty'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority value'),
  body('status')
    .optional()
    .isIn(['todo', 'in-progress', 'review', 'done']).withMessage('Invalid status value')
];

router.get('/stats', getTaskStats);

router.get('/', getAllTasks);

router.get('/:id', getTaskById);

router.post('/', taskValidation, createTask);

router.put('/:id', updateValidation, updateTask);

router.delete('/:id', deleteTask);

module.exports = router;