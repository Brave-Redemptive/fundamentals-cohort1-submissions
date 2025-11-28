const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const taskRoutes = require('./routes/taskRoutes');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'success',
    message: 'SyncForge API is running',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/v1/tasks', taskRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 SyncForge Backend running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;