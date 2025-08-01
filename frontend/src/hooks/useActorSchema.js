import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

export const useActorSchema = (apiKey) => {
  const [schema, setSchema] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSchema = useCallback(async (actorId) => {
    if (!apiKey) {
      setError('API key is required');
      return;
    }

    if (!actorId) {
      setError('Actor ID is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/actors/${actorId}/schema`, {
        headers: {
          'X-API-Key': apiKey
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setSchema(data.data);
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch actor schema';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [apiKey]);

  const clearSchema = useCallback(() => {
    setSchema(null);
    setError(null);
  }, []);

  return {
    schema,
    loading,
    error,
    fetchSchema,
    clearSchema
  };
}; 