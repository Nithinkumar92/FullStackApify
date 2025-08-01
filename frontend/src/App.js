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
    <div className="min-h-screen bg-gray-50">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Apify Integration Web App
          </h1>
          <p className="text-gray-600">
            Execute Apify actors with custom parameters
          </p>
        </header>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* API Key Input */}
          <ApiKeyInput 
            apiKey={apiKey}
            onApiKeyChange={setApiKey}
            isValid={isApiKeyValid}
          />

          {/* Main Content */}
          {isApiKeyValid && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Actor Selection and Schema */}
              <div className="space-y-6">
                {/* Actor Selector */}
                <ActorSelector
                  actors={actors}
                  loading={actorsLoading}
                  error={actorsError}
                  selectedActor={selectedActor}
                  onActorSelect={handleActorSelect}
                  onRefresh={fetchActors}
                />

                {/* Schema Form */}
                {selectedActor && schema && (
                  <ActorSchemaForm
                    schema={schema}
                    loading={schemaLoading}
                    error={schemaError}
                    onSubmit={handleFormSubmit}
                    executionLoading={executionLoading}
                    executionError={executionError}
                  />
                )}
              </div>

              {/* Right Column - Results */}
              <div className="space-y-6">
                {/* Results Display */}
                {results && (
                  <ResultDisplay
                    results={results}
                    actorName={selectedActor?.name}
                    onReset={handleReset}
                  />
                )}

                {/* Instructions */}
                {!results && selectedActor && (
                  <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Ready to Execute
                    </h3>
                    <p className="text-gray-600">
                      Fill out the form on the left with your desired parameters and click "Execute Actor" to run {selectedActor.name}.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Welcome Message */}
          {!isApiKeyValid && (
            <div className="card text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Welcome to Apify Integration
              </h2>
              <p className="text-gray-600 mb-4">
                Enter your Apify API key above to get started. You can find your API key in the 
                <a 
                  href="https://console.apify.com/account/integrations" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 underline ml-1"
                >
                  Apify Console
                </a>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App; 