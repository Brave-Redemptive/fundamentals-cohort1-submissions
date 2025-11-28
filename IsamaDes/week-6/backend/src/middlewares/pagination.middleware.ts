//simplifies querry by automatically attaching consistent pagination parameters(limit,skip, page) to each request
//thereby preventing excessive data load that can hurt performance during API data retrieval

import { Request, Response, NextFunction } from 'express';

export const paginate = (defaultLimit = 20) => (req: Request, res: Response, next: NextFunction) => {
  const limit = Math.min(Number(req.query.limit ?? defaultLimit), 100);
  const page = Math.max(Number(req.query.page ?? 1), 1);
  (req as any).pagination = { limit, skip: (page - 1) * limit, page };
  next();
};
