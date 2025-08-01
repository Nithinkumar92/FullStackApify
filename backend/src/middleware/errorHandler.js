const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error response
  let statusCode = 500;
  let message = 'Internal server error';

  // Handle different types of errors
  if (err.response) {
    // Axios error (API call failed)
    const { status, data } = err.response;
    
    switch (status) {
      case 401:
        statusCode = 401;
        message = 'Invalid API key or unauthorized access';
        break;
      case 403:
        statusCode = 403;
        message = 'Access forbidden - insufficient permissions';
        break;
      case 404:
        statusCode = 404;
        message = 'Resource not found';
        break;
      case 429:
        statusCode = 429;
        message = 'Rate limit exceeded - too many requests';
        break;
      default:
        statusCode = status || 500;
        message = data?.message || data?.error || 'External API error';
    }
  } else if (err.code === 'ECONNABORTED') {
    // Request timeout
    statusCode = 408;
    message = 'Request timeout - the operation took too long';
  } else if (err.code === 'ENOTFOUND') {
    // Network error
    statusCode = 503;
    message = 'Service unavailable - network error';
  } else if (err.name === 'ValidationError') {
    // Joi validation error
    statusCode = 400;
    message = err.message || 'Validation error';
  } else if (err.message) {
    // Custom error with message
    message = err.message;
    
    // Check for specific error types
    if (err.message.includes('API key')) {
      statusCode = 401;
    } else if (err.message.includes('not found')) {
      statusCode = 404;
    } else if (err.message.includes('timeout')) {
      statusCode = 408;
    }
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: message,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method
  });
};

module.exports = errorHandler; 