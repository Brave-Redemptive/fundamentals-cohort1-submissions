import { ServerResponse } from "http";

export const sseConnections: ServerResponse[] = [];

export const broadcast = (data: any) => {
  sseConnections.forEach((res) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  });
};
