import { Request, Response, NextFunction } from "express";

interface ApiError extends Error {
  status?: number;
}

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error("❌ Error:", err.message);

  const statusCode = err.status || 500;
  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message || "Internal Server Error",
      status: statusCode,
      path: req.originalUrl,
    },
  });
};
