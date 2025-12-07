import express, { Application } from 'express';
import cors from 'cors';
import helloRoutes from './routes/hello.route';
import userRoutes from './routes/user.route';
import errorHandler from './middlewares/errorHandler';

const app: Application = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/hello', helloRoutes);
app.use('/api/users', userRoutes);

app.get('/', (_req, res) => {
  res.status(200).json({ message: 'welcome to syncforge server' });
});

// Error handler
app.use(errorHandler);

export default app;
