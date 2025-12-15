const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};

const currentLevel = logLevels[process.env.LOG_LEVEL || 'info'];

const writeStdout = (text) => {
  try {
    process.stdout.write(`${text}\n`);
  } catch (e) {
    // fallback to console if stdout isn't writable
    // eslint-disable-next-line no-console
    console.log(text);
  }
};

const writeStderr = (text) => {
  try {
    process.stderr.write(`${text}\n`);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(text);
  }
};

const logger = {
  error: (message, data) => {
    if (currentLevel >= logLevels.error) {
      writeStderr(`[ERROR] ${new Date().toISOString()}: ${message} ${data || ''}`);
    }
  },
  warn: (message, data) => {
    if (currentLevel >= logLevels.warn) {
      writeStdout(`[WARN] ${new Date().toISOString()}: ${message} ${data || ''}`);
    }
  },
  info: (message, data) => {
    if (currentLevel >= logLevels.info) {
      writeStdout(`[INFO] ${new Date().toISOString()}: ${message} ${data || ''}`);
    }
  },
  debug: (message, data) => {
    if (currentLevel >= logLevels.debug) {
      writeStdout(`[DEBUG] ${new Date().toISOString()}: ${message} ${data || ''}`);
    }
  }
};

export default logger;
