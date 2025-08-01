import React, { useState } from 'react';
import { Eye, EyeOff, Key, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ApiKeyInput = ({ apiKey, onApiKeyChange, isValid }) => {
  const [showKey, setShowKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const handleApiKeyChange = (e) => {
    const value = e.target.value;
    onApiKeyChange(value);
  };

  const validateApiKey = async () => {
    if (!apiKey.trim()) {
      toast.error('Please enter an API key');
      return;
    }

    setIsValidating(true);
    try {
      const response = await fetch('/api/actors', {
        headers: {
          'X-API-Key': apiKey.trim()
        }
      });

      if (response.ok) {
        toast.success('API key is valid!');
      } else {
        toast.error('Invalid API key. Please check and try again.');
      }
    } catch (error) {
      toast.error('Failed to validate API key. Please check your connection.');
    } finally {
      setIsValidating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    toast.success('API key copied to clipboard');
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <Key className="w-5 h-5 mr-2 text-primary-600" />
          API Key Configuration
        </h2>
        {isValid && (
          <div className="flex items-center text-green-600">
            <CheckCircle className="w-5 h-5 mr-1" />
            <span className="text-sm font-medium">Valid</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="relative">
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
            Apify API Key
          </label>
          <div className="relative">
            <input
              id="apiKey"
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={handleApiKeyChange}
              placeholder="Enter your Apify API key"
              className="input-field pr-20"
              disabled={isValidating}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 space-x-1">
              {apiKey && (
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  title={showKey ? 'Hide API key' : 'Show API key'}
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              )}
              {apiKey && (
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Copy API key"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={validateApiKey}
              disabled={!apiKey.trim() || isValidating}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isValidating ? (
                <>
                  <div className="loading-spinner w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                  Validating...
                </>
              ) : (
                'Validate Key'
              )}
            </button>
          </div>

          <div className="text-sm text-gray-500">
            <a
              href="https://console.apify.com/account/integrations"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 underline"
            >
              Get API key from Apify Console
            </a>
          </div>
        </div>

        {apiKey && !isValid && (
          <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
            <span className="text-sm text-yellow-800">
              Please validate your API key to continue
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiKeyInput; 