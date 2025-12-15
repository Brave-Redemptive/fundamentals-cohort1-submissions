import { test } from 'node:test';
import assert from 'node:assert';
import taskService from '../src/services/taskService.js';

test('TaskService - getAllTasks returns array', () => {
  const tasks = taskService.getAllTasks();
  assert(Array.isArray(tasks), 'getAllTasks should return an array');
  assert(tasks.length > 0, 'Should have tasks in database');
});

test('TaskService - getTaskById returns correct task', () => {
  const tasks = taskService.getAllTasks();
  if (tasks.length > 0) {
    const task = taskService.getTaskById(tasks[0].id);
    assert.strictEqual(task.id, tasks[0].id, 'Should return correct task');
  }
});

test('TaskService - createTask adds new task', () => {
  const initialCount = taskService.getAllTasks().length;
  const newTask = taskService.createTask({
    title: 'Test Task',
    description: 'A test task',
    priority: 'high'
  });
  assert(newTask.id, 'New task should have an ID');
  assert.strictEqual(newTask.title, 'Test Task', 'Task title should match');
  assert(taskService.getAllTasks().length > initialCount, 'Task count should increase');
});
