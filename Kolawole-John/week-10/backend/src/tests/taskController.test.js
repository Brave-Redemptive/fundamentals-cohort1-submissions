const request = require('supertest');
const app = require('../src/app');

describe('Task API Endpoints', () => {
  let createdTaskId;

  describe('GET /health', () => {
    it('should return health check status', async () => {
      const response = await request(app)
        .get('/health')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('POST /api/v1/tasks', () => {
    it('should create a new task with valid data', async () => {
      const newTask = {
        title: 'Test Task',
        description: 'This is a test task description with enough characters',
        assignee: 'Test User',
        priority: 'high'
      };

      const response = await request(app)
        .post('/api/v1/tasks')
        .send(newTask)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body.status).toBe('success');
      expect(response.body.data.task).toHaveProperty('id');
      expect(response.body.data.task.title).toBe(newTask.title);
      expect(response.body.data.task.status).toBe('todo');

      createdTaskId = response.body.data.task.id;
    });

    it('should fail with missing title', async () => {
      const invalidTask = {
        description: 'Missing title field test',
        assignee: 'Test User'
      };

      const response = await request(app)
        .post('/api/v1/tasks')
        .send(invalidTask)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.status).toBe('error');
      expect(response.body.errors).toBeDefined();
    });

    it('should fail with title too short', async () => {
      const invalidTask = {
        title: 'AB',
        description: 'Title is too short for validation',
        assignee: 'Test User'
      };

      const response = await request(app)
        .post('/api/v1/tasks')
        .send(invalidTask)
        .expect(400);

      expect(response.body.status).toBe('error');
    });
  });

  describe('GET /api/v1/tasks', () => {
    it('should return all tasks', async () => {
      const response = await request(app)
        .get('/api/v1/tasks')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.tasks).toBeInstanceOf(Array);
      expect(response.body.results).toBeGreaterThan(0);
    });

    it('should filter tasks by status', async () => {
      const response = await request(app)
        .get('/api/v1/tasks?status=todo')
        .expect(200);

      expect(response.body.data.tasks.every(task => task.status === 'todo')).toBe(true);
    });

    it('should filter tasks by priority', async () => {
      const response = await request(app)
        .get('/api/v1/tasks?priority=high')
        .expect(200);

      expect(response.body.data.tasks.every(task => task.priority === 'high')).toBe(true);
    });
  });

  describe('GET /api/v1/tasks/:id', () => {
    it('should return a single task by id', async () => {
      const response = await request(app)
        .get(`/api/v1/tasks/${createdTaskId}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.task.id).toBe(createdTaskId);
    });

    it('should return 404 for non-existent task', async () => {
      const response = await request(app)
        .get('/api/v1/tasks/nonexistent-id')
        .expect(404);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('Task not found');
    });
  });

  describe('PUT /api/v1/tasks/:id', () => {
    it('should update task status', async () => {
      const updates = {
        status: 'in-progress'
      };

      const response = await request(app)
        .put(`/api/v1/tasks/${createdTaskId}`)
        .send(updates)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.task.status).toBe('in-progress');
    });

    it('should update task priority', async () => {
      const updates = {
        priority: 'urgent'
      };

      const response = await request(app)
        .put(`/api/v1/tasks/${createdTaskId}`)
        .send(updates)
        .expect(200);

      expect(response.body.data.task.priority).toBe('urgent');
    });

    it('should fail with invalid status', async () => {
      const updates = {
        status: 'invalid-status'
      };

      const response = await request(app)
        .put(`/api/v1/tasks/${createdTaskId}`)
        .send(updates)
        .expect(400);

      expect(response.body.status).toBe('error');
    });
  });

  describe('GET /api/v1/tasks/stats', () => {
    it('should return task statistics', async () => {
      const response = await request(app)
        .get('/api/v1/tasks/stats')
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.stats).toHaveProperty('total');
      expect(response.body.data.stats).toHaveProperty('byStatus');
      expect(response.body.data.stats).toHaveProperty('byPriority');
    });
  });

  describe('DELETE /api/v1/tasks/:id', () => {
    it('should delete a task', async () => {
      await request(app)
        .delete(`/api/v1/tasks/${createdTaskId}`)
        .expect(204);

      // Verify task is deleted
      await request(app)
        .get(`/api/v1/tasks/${createdTaskId}`)
        .expect(404);
    });

    it('should return 404 when deleting non-existent task', async () => {
      await request(app)
        .delete('/api/v1/tasks/nonexistent-id')
        .expect(404);
    });
  });
});