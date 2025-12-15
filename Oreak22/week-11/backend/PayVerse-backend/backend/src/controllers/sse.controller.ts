import { Request, Response } from "express";
import { sseConnections } from "../utils/events";

export class SSEController {
  static stream(req: Request, res: Response) {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    res.write("data: Connected\n\n");

    sseConnections.push(res);

    req.on("close", () => {
      const index = sseConnections.indexOf(res);
      sseConnections.splice(index, 1);
    });
  }
}
