import fs from "fs";
import path from "path";
const TASKS_FILE_PATH = path.join(__dirname, "../src/data/tasks.test.json");

process.env.DATA_FILE_PATH = TASKS_FILE_PATH

beforeEach(() => {
  const emptyData = { tasks: [] };
  fs.writeFileSync(TASKS_FILE_PATH, JSON.stringify(emptyData, null, 2));
});
