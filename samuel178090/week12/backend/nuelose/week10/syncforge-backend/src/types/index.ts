export interface Task {
  id: string;
  message: string;
  createdAt: string;
}

export interface CreateTask {
  message: string;
}

export class DuplicateTaskError extends Error {
  statusCode: number;
  code: string;

  constructor(message: string) {
    super(message);
    this.name = "DuplicateTaskError";
    this.statusCode = 409;
    this.code = "DUPLICATE_MESSAGE";
  }
}
