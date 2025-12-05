import app from './app.js';
import { logger } from './utils/logger.js';

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  logger.info(`FlowServe API listening on port ${PORT}`);
});
