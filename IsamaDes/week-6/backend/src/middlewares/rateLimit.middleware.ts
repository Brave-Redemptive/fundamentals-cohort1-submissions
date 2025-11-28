//protects api from abuse and denial of service attack by 
//restricting the number of request a user can make within a specific a time window.
//ensures reliability of application by preventing a single user from taking over the whole application
import rateLimit from 'express-rate-limit';

const rateLimitMiddleware = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60000),
  max: Number(process.env.RATE_LIMIT_MAX ?? 100),
  message: { error: 'Too many requests, try again later' }
});

export default rateLimitMiddleware;
