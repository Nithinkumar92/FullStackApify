import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

export const useActors = (apiKey) => {
  const [actors, setActors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchActors = useCallback(async () => {
    if (!apiKey) {
      setError('API key is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/actors', {
        headers: {
          'X-API-Key': apiKey
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setActors(data.data || []);
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch actors';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [apiKey]);

  const refreshActors = useCallback(async () => {
    await fetchActors();
  }, [fetchActors]);

  return {
    actors,
    loading,
    error,
    fetchActors,
    refreshActors
  };
}; 