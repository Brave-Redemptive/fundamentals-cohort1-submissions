import db from '../config/database.js';
import { generateId, getCurrentTimestamp } from '../utils/helpers.js';
import { AppError } from '../middleware/errorHandler.js';

export class TaskService {
  getAllTasks() {
    return db.tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  getTaskById(id) {
    const task = db.tasks.find(t => t.id === id);
    if (!task) {
      throw new AppError('Task not found', 404);
    }
    return task;
  }

  createTask(taskData) {
    const newTask = {
      id: generateId(),
      title: taskData.title,
      description: taskData.description || '',
      status: taskData.status || 'todo',
      priority: taskData.priority || 'medium',
      assignee: taskData.assignee || 'Unassigned',
      dueDate: taskData.dueDate || null,
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp()
    };

    db.tasks.push(newTask);
    return newTask;
  }

  updateTask(id, updates) {
    const task = this.getTaskById(id);

    const updatedTask = {
      ...task,
      ...updates,
      updatedAt: getCurrentTimestamp()
    };

    const index = db.tasks.findIndex(t => t.id === id);
    db.tasks[index] = updatedTask;

    return updatedTask;
  }

  deleteTask(id) {
    const task = this.getTaskById(id);
    const index = db.tasks.findIndex(t => t.id === id);
    db.tasks.splice(index, 1);
    return task;
  }

  getTasksByStatus(status) {
    return db.tasks.filter(t => t.status === status);
  }

  getTasksByAssignee(assignee) {
    return db.tasks.filter(t => t.assignee === assignee);
  }
}

export default new TaskService();
