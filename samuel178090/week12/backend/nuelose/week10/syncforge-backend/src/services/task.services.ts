import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { Task, CreateTask, DuplicateTaskError } from "../types";

const DATA_PATH =
  process.env.DATA_FILE_PATH ||
  path.join(__dirname, "..", "data", "tasks.json");

interface TaskData {
  tasks: Task[];
}

const readTasks = (): Task[] => {
  const data = fs.readFileSync(DATA_PATH, "utf-8");
  const parsed: TaskData = JSON.parse(data);
  return parsed.tasks;
};

const writeTasks = (tasks: Task[]): void => {
  const data: TaskData = { tasks };
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
};

export const getAllTasks = (): Task[] => {
  return readTasks();
};

export const saveTasks = (tasks: Task[]): void => {
  writeTasks(tasks);
};

export const createTask = (task: CreateTask): Task => {
  const tasks = readTasks();

  const normalized = task.message.trim().toLowerCase();
  const isDuplicate = tasks.some(
    (t) => t.message.trim().toLowerCase() === normalized
  );

  if (isDuplicate) {
    throw new DuplicateTaskError(
      "A task with this exact message already exists"
    );
  }

  const newTask: Task = {
    id: uuidv4(),
    message: task.message,
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);
  writeTasks(tasks);

  return newTask;
};
