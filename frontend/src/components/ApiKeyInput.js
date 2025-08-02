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
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `HTTP ${response.status}: ${response.statusText}`;
        
        if (response.status === 401) {
          toast.error('Invalid API key. Please check your Apify API key and try again.');
        } else if (response.status === 404) {
          toast.error('Backend service not found. Please ensure the backend is running.');
        } else {
          toast.error(`Validation failed: ${errorMessage}`);
        }
      }
    } catch (error) {
      console.error('API key validation error:', error);
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        toast.error('Cannot connect to backend. Please ensure the backend server is running on port 5002.');
      } else {
        toast.error('Failed to validate API key. Please check your connection.');
      }
    } finally {
      setIsValidating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    toast.success('API key copied to clipboard');
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-4">
            <Key className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              API Key Configuration
            </h2>
            <p className="text-gray-600">Connect to your Apify account</p>
          </div>
        </div>
        {isValid && (
          <div className="flex items-center bg-green-50 text-green-700 px-4 py-2 rounded-full">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span className="font-medium">Valid</span>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="relative">
          <label htmlFor="apiKey" className="block text-sm font-semibold text-gray-700 mb-3">
            Apify API Key
          </label>
          <div className="relative">
            <input
              id="apiKey"
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={handleApiKeyChange}
              placeholder="apify_api_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-20 bg-white/50 backdrop-blur-sm"
              disabled={isValidating}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-2">
              {apiKey && (
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                  title={showKey ? 'Hide API key' : 'Show API key'}
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              )}
              {apiKey && (
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                  title="Copy API key"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Your API key is stored locally and never sent to our servers.
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={validateApiKey}
            disabled={!apiKey.trim() || isValidating}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {isValidating ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Validating...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Validate Key
              </>
            )}
          </button>

          <a
            href="https://console.apify.com/account/integrations"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Get API Key
          </a>
        </div>

        {apiKey && !isValid && (
          <div className="flex items-center p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <AlertCircle className="w-5 h-5 text-amber-600 mr-3" />
            <div>
              <span className="text-sm font-medium text-amber-800">
                Please validate your API key to continue
              </span>
              <p className="text-xs text-amber-700 mt-1">
                Click "Validate Key" to verify your API key and unlock the application.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiKeyInput; 