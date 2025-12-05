import { ZodObject } from "zod";
import { Request, Response, NextFunction } from "express";

export default (schema: ZodObject<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err: any) {
      console.log("Validation Error:", err, req.body);
      res.status(400).json({
        success: false,
        message: "Validation error",
        errors: err.errors,
      });
    }
  };
