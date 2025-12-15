import request from 'supertest';
import app from '../src/app.js';

describe('Tasks API', () => {
  it('GET /tasks → should return array', async () => {
    const res = await request(app).get('/tasks');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /tasks → should validate input', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('POST /tasks → should create task', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({title: 'Test Task', description: 'Demo'});

    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.title).toBe('Test Task');
  });
});
