import { Request, Response, NextFunction } from "express";

export function versionMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const header = req.header("x-api-version");
  const q = req.query.apiVersion as string | undefined;
  const apiVersion = header || q || (req.path.startsWith("/v2") ? "2" : "1");
  req.app.locals.apiVersion = apiVersion;
  next();
}
