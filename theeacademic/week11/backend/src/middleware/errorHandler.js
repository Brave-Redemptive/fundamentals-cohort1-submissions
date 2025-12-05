export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error
  let error = {
    statusCode: err.statusCode || 500,
    message: err.message || 'Internal Server Error'
  };

  // Validation error
  if (err.name === 'ValidationError') {
    error.statusCode = 400;
    error.message = Object.values(err.errors).map(val => val.message).join(', ');
  }

  // Duplicate key error (PostgreSQL)
  if (err.code === '23505') {
    error.statusCode = 400;
    error.message = 'Duplicate field value entered';
  }

  // Foreign key constraint error (PostgreSQL)
  if (err.code === '23503') {
    error.statusCode = 400;
    error.message = 'Invalid reference to related data';
  }

  // Check constraint error (PostgreSQL)
  if (err.code === '23514') {
    error.statusCode = 400;
    error.message = 'Data validation failed';
  }

  res.status(error.statusCode).json({
    error: 'Request failed',
    message: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};