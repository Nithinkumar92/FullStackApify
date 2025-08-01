import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

export const useActorExecution = (apiKey) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeActor = useCallback(async (actorId, inputData) => {
    if (!apiKey) {
      throw new Error('API key is required');
    }

    if (!actorId) {
      throw new Error('Actor ID is required');
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/actors/${actorId}/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey
        },
        body: JSON.stringify({ input: inputData })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        toast.success('Actor executed successfully!');
        return data.data.results || [];
      } else {
        throw new Error(data.error || 'Execution failed');
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to execute actor';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiKey]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    executeActor,
    loading,
    error,
    clearError
  };
}; 