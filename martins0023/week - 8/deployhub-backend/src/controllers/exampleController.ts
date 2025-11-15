import { Request, Response, NextFunction } from 'express';

interface ExampleData {
  id: number;
  name: string;
  status: string;
}

export const getExampleData = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const data: ExampleData = { id: 1, name: 'Microservice Item', status: 'Active' };
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const triggerError = (req: Request, res: Response, next: NextFunction): void => {
  const error: any = new Error('Intentional Test Error');
  error.statusCode = 400;
  next(error);
};