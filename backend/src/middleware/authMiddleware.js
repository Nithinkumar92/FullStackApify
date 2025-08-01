const validateApiKey = (req, res, next) => {
  // Check for API key in headers
  const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');
  
  if (!apiKey) {
    return res.status(401).json({
      success: false,
      error: 'API key is required. Please provide it in the X-API-Key header or Authorization header.'
    });
  }

  // Basic validation - API key should be a non-empty string
  if (typeof apiKey !== 'string' || apiKey.trim().length === 0) {
    return res.status(401).json({
      success: false,
      error: 'Invalid API key format.'
    });
  }

  // Store the API key in the request object for use in controllers
  req.apifyToken = apiKey.trim();
  
  next();
};

module.exports = {
  validateApiKey
}; 