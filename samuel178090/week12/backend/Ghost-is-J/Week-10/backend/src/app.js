import express from 'express';
import cors from 'cors';
import tasksRouter from './routes/tasks.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({status: 'ok'});
});

// Routes
app.use('/tasks', tasksRouter);

// Fallback
app.use((req, res) => {
  res.status(404).json({error: 'Not Found'});
});

export default app;
