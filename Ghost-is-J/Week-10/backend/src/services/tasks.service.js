import {v4 as uuid} from 'uuid';
import tasks from '../models/task.model.js';

export const createTaskService = ({title, description}) => {
  const task = {
    id: uuid(),
    title,
    description,
    createdAt: new Date().toISOString()
  };

  tasks.push(task);
  return task;
};

export const getTasksService = () => tasks;
