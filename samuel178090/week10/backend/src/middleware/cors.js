import cors from 'cors';

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // In development, allow all localhost origins (handles port changes like 5173, 5174, 5175, etc.)
    if (process.env.NODE_ENV !== 'production') {
      if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
        return callback(null, true);
      }
    }

    // Build allowed origins list from environment variables (preferred)
    // ALLOWED_ORIGINS can be a comma-separated list.
    const envAllowed = process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    // Support a single FRONTEND_URL for backward compatibility
    if (process.env.FRONTEND_URL) {
      envAllowed.push(process.env.FRONTEND_URL);
    }

    // Add a sensible default to avoid accidental blocks (safe default for this project)
    const defaultAllowed = ['https://syncforg.netlify.app'];

    const allowedOrigins = Array.from(new Set([...envAllowed, ...defaultAllowed]));

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Reject if none of the above conditions match
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

export const corsMiddleware = cors(corsOptions);
