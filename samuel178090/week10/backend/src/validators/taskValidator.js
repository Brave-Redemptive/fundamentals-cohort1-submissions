import { AppError } from '../middleware/errorHandler.js';

export const validateCreateTask = (data) => {
  const errors = [];

  if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
    errors.push('Title is required and must be a non-empty string');
  }

  if (data.title && data.title.length > 200) {
    errors.push('Title must be less than 200 characters');
  }

  if (data.description && data.description.length > 1000) {
    errors.push('Description must be less than 1000 characters');
  }

  if (data.priority && !['low', 'medium', 'high'].includes(data.priority)) {
    errors.push('Priority must be one of: low, medium, high');
  }

  if (data.status && !['todo', 'in-progress', 'completed'].includes(data.status)) {
    errors.push('Status must be one of: todo, in-progress, completed');
  }

  if (errors.length > 0) {
    throw new AppError(errors.join('; '), 400);
  }
};

export const validateUpdateTask = (data) => {
  const updates = {};

  if (data.title !== undefined) {
    if (typeof data.title !== 'string' || data.title.trim().length === 0) {
      throw new AppError('Title must be a non-empty string', 400);
    }
    updates.title = data.title;
  }

  if (data.description !== undefined) {
    if (data.description.length > 1000) {
      throw new AppError('Description must be less than 1000 characters', 400);
    }
    updates.description = data.description;
  }

  if (data.status !== undefined) {
    if (!['todo', 'in-progress', 'completed'].includes(data.status)) {
      throw new AppError('Status must be one of: todo, in-progress, completed', 400);
    }
    updates.status = data.status;
  }

  if (data.priority !== undefined) {
    if (!['low', 'medium', 'high'].includes(data.priority)) {
      throw new AppError('Priority must be one of: low, medium, high', 400);
    }
    updates.priority = data.priority;
  }

  if (data.assignee !== undefined) {
    updates.assignee = data.assignee;
  }

  if (data.dueDate !== undefined) {
    updates.dueDate = data.dueDate;
  }

  return updates;
};
