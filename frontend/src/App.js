import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import ApiKeyInput from './components/ApiKeyInput';
import ActorSelector from './components/ActorSelector';
import ActorSchemaForm from './components/ActorSchemaForm';
import ResultDisplay from './components/ResultDisplay';
import { useApiKey } from './hooks/useApiKey';
import { useActors } from './hooks/useActors';
import { useActorSchema } from './hooks/useActorSchema';
import { useActorExecution } from './hooks/useActorExecution';

function App() {
  const [selectedActor, setSelectedActor] = useState(null);
  const [formData, setFormData] = useState({});
  const [results, setResults] = useState(null);

  const { apiKey, setApiKey, isApiKeyValid } = useApiKey();
  const { actors, loading: actorsLoading, error: actorsError, fetchActors } = useActors(apiKey);
  const { schema, loading: schemaLoading, error: schemaError, fetchSchema } = useActorSchema(apiKey);
  const { executeActor, loading: executionLoading, error: executionError } = useActorExecution(apiKey);

  // Fetch actors when API key is valid
  useEffect(() => {
    if (isApiKeyValid && apiKey) {
      fetchActors();
    }
  }, [isApiKeyValid, apiKey, fetchActors]);

  // Fetch schema when actor is selected
  useEffect(() => {
    if (selectedActor && apiKey) {
      fetchSchema(selectedActor.id);
      setFormData({});
      setResults(null);
    }
  }, [selectedActor, apiKey, fetchSchema]);

  const handleActorSelect = (actor) => {
    setSelectedActor(actor);
  };

  const handleFormSubmit = async (inputData) => {
    if (!selectedActor) return;

    try {
      const result = await executeActor(selectedActor.id, inputData);
      setResults(result);
    } catch (error) {
      console.error('Execution failed:', error);
    }
  };

  const handleReset = () => {
    setSelectedActor(null);
    setFormData({});
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1f2937',
            color: '#fff',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '14px',
          },
        }}
      />
      
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Apify Integration
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Execute powerful web automation actors with custom parameters. 
            Transform your data extraction and web scraping workflows.
          </p>
        </header>

        <div className="max-w-7xl mx-auto space-y-8">
          {/* API Key Input */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
            <ApiKeyInput 
              apiKey={apiKey}
              onApiKeyChange={setApiKey}
              isValid={isApiKeyValid}
            />
          </div>

          {/* Main Content */}
          {isApiKeyValid && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Left Column - Actor Selection */}
              <div className="xl:col-span-1">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                  <ActorSelector
                    actors={actors}
                    loading={actorsLoading}
                    error={actorsError}
                    selectedActor={selectedActor}
                    onActorSelect={handleActorSelect}
                    onRefresh={fetchActors}
                  />
                </div>
              </div>

              {/* Center Column - Schema Form */}
              <div className="xl:col-span-1">
                {selectedActor && schema && (
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                    <ActorSchemaForm
                      schema={schema}
                      loading={schemaLoading}
                      error={schemaError}
                      onSubmit={handleFormSubmit}
                      executionLoading={executionLoading}
                      executionError={executionError}
                    />
                  </div>
                )}
                
                {!selectedActor && (
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Select an Actor
                    </h3>
                    <p className="text-gray-600">
                      Choose an actor from the list to configure and execute it.
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column - Results */}
              <div className="xl:col-span-1">
                {results && (
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                    <ResultDisplay
                      results={results}
                      actorName={selectedActor?.name}
                      onReset={handleReset}
                    />
                  </div>
                )}

                {!results && selectedActor && (
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Ready to Execute
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Configure the parameters and click "Execute Actor" to run {selectedActor.name}.
                      </p>
                      <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                          💡 <strong>Tip:</strong> Start with small values for testing, then scale up for production runs.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Welcome Message */}
          {!isApiKeyValid && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12 text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Welcome to Apify Integration
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Get started by entering your Apify API key. This will unlock access to powerful web automation actors 
                for data extraction, web scraping, and more.
              </p>
              <div className="bg-blue-50 rounded-xl p-6 max-w-md mx-auto">
                <h3 className="font-semibold text-blue-900 mb-2">Need an API key?</h3>
                <p className="text-blue-800 mb-4 text-sm">
                  You can find your API key in the Apify Console under Account Settings.
                </p>
                <a 
                  href="https://console.apify.com/account/integrations" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Get API Key
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App; 