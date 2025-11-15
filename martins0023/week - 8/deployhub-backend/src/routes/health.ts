import { Router, Request, Response } from 'express';
import { client } from '../lib/metrics';

const router = Router();

router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'UP',
    timestamp: new Date(),
    uptime: process.uptime(),
    service: 'deployhub-backend'
  });
});

router.get('/metrics', async (req: Request, res: Response) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

export default router;