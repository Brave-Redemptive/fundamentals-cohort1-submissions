import {
  createTaskService,
  getTasksService
} from '../services/tasks.service.js';

import {validateTaskInput} from '../validators/task.validators.js';

export const createTask = (req, res) => {
  const {error} = validateTaskInput(req.body);
  if (error) {
    return res.status(400).json({error: error.message});
  }

  const task = createTaskService(req.body);
  return res.status(201).json(task);
};

export const getTasks = (req, res) => {
  const tasks = getTasksService();
  return res.status(200).json(tasks);
};
