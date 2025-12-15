const { v4: uuidv4 } = require('uuid');

class Task {
  constructor(title, description, assignee, priority = 'medium') {
    this.id = uuidv4();
    this.title = title;
    this.description = description;
    this.assignee = assignee;
    this.priority = priority;
    this.status = 'todo';
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  update(updates) {
    const allowedUpdates = ['title', 'description', 'assignee', 'priority', 'status'];
    
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        this[key] = updates[key];
      }
    });
    
    this.updatedAt = new Date().toISOString();
    return this;
  }

  static validatePriority(priority) {
    const validPriorities = ['low', 'medium', 'high', 'urgent'];
    return validPriorities.includes(priority);
  }

  static validateStatus(status) {
    const validStatuses = ['todo', 'in-progress', 'review', 'done'];
    return validStatuses.includes(status);
  }
}

module.exports = Task;