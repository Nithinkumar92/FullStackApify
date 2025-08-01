const API_BASE_URL = process.env.REACT_APP_API_URL || '';

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

const makeRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { error: response.statusText };
      }
      
      throw new ApiError(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network or other errors
    throw new ApiError(
      error.message || 'Network error occurred',
      0,
      null
    );
  }
};

export const api = {
  // Actors
  getActors: (apiKey) => 
    makeRequest('/api/actors', {
      headers: { 'X-API-Key': apiKey }
    }),

  getActorDetails: (actorId, apiKey) =>
    makeRequest(`/api/actors/${actorId}`, {
      headers: { 'X-API-Key': apiKey }
    }),

  getActorSchema: (actorId, apiKey) =>
    makeRequest(`/api/actors/${actorId}/schema`, {
      headers: { 'X-API-Key': apiKey }
    }),

  runActor: (actorId, inputData, apiKey) =>
    makeRequest(`/api/actors/${actorId}/run`, {
      method: 'POST',
      headers: { 'X-API-Key': apiKey },
      body: JSON.stringify({ input: inputData })
    }),

  getRunResults: (actorId, runId, apiKey) =>
    makeRequest(`/api/actors/${actorId}/runs/${runId}`, {
      headers: { 'X-API-Key': apiKey }
    }),

  // Health check
  healthCheck: () => makeRequest('/health'),
};

export { ApiError }; 