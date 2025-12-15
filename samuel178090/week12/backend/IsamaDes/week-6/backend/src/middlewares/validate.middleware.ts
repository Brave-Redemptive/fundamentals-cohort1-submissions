//why zod
//lightweight, composeable, framework independent 
//typescript first schema validation
//ensures runtime data validation remains in sync with static type validation

import { AnyZodObject } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validate = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = schema.parse(req.body); 
    req.body = parsed;    
    next();
  } catch (err: any) {
    return res.status(400).json({
        message: "Invalid Data",
        error: err.errors ?? err.message });
  }
};
