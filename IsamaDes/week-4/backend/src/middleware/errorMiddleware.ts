import type { Request, Response, NextFunction } from "express";

/**
 * Middleware for handling 404 Not Found errors
 */
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Middleware for handling invalid credentials (401)
 */
export const invalidCredentials = (res: Response, message = "Invalid Credentials") => {
  return res.status(401).json({
    success: false,
    message,
  });
};

/**
 * Middleware for handling bad request (400)
 */
export const badRequest = (req: Request, res: Response, message = "Bad Request") => {
   return res.status(400).json({
    success: false,
    message,
  });
};

/**
 * Global error handler middleware
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message || "Something went wrong",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};


