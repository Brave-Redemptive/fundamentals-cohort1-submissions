import { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/ApiError';

interface User {
  id: number;
  name: string;
  email: string;
}


const users: User[] = [];

export const getUsers = (req: Request, res: Response) => {
  res.json({
    success: true,
    data: users,
  });
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return next(new ApiError(400, 'Name and email are required'));
  }

  const newUser = {
    id: Date.now(),
    name,
    email,
  };

  users.push(newUser);

  res.status(201).json({
    success: true,
    data: newUser,
  });
};
