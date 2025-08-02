import { useState, useEffect } from 'react';

export const useApiKey = () => {
  const [apiKey, setApiKey] = useState('');
  const [isApiKeyValid, setIsApiKeyValid] = useState(false);

  // Load API key from localStorage on mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('apify_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      // Note: We don't auto-validate on load for security reasons
    }
  }, []);

  // Save API key to localStorage when it changes
  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('apify_api_key', apiKey);
    } else {
      localStorage.removeItem('apify_api_key');
    }
  }, [apiKey]);

  // Validate API key by making a test request
  const validateApiKey = async (key) => {
    if (!key.trim()) {
      setIsApiKeyValid(false);
      return false;
    }

    try {
      const response = await fetch('/api/actors', {
        headers: {
          'X-API-Key': key.trim()
        }
      });

      const isValid = response.ok;
      setIsApiKeyValid(isValid);
      
      return isValid;
    } catch (error) {
      setIsApiKeyValid(false);
      return false;
    }
  };

  // Update API key and validate
  const updateApiKey = async (newApiKey) => {
    setApiKey(newApiKey);
    
    if (newApiKey.trim()) {
      const isValid = await validateApiKey(newApiKey);
      setIsApiKeyValid(isValid);
    } else {
      setIsApiKeyValid(false);
    }
  };

  // Clear API key
  const clearApiKey = () => {
    setApiKey('');
    setIsApiKeyValid(false);
    localStorage.removeItem('apify_api_key');
  };

  return {
    apiKey,
    setApiKey: updateApiKey,
    isApiKeyValid,
    validateApiKey,
    clearApiKey
  };
}; 