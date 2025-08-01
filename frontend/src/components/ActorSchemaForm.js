import React, { useState, useEffect } from 'react';
import { Play, Settings, AlertCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ActorSchemaForm = ({ 
  schema, 
  loading, 
  error, 
  onSubmit, 
  executionLoading, 
  executionError 
}) => {
  const [formData, setFormData] = useState({});
  const [validationErrors, setValidationErrors] = useState({});

  // Initialize form data when schema changes
  useEffect(() => {
    if (schema && schema.properties) {
      const initialData = {};
      Object.keys(schema.properties).forEach(key => {
        const property = schema.properties[key];
        if (property.default !== undefined) {
          initialData[key] = property.default;
        } else if (property.type === 'array') {
          initialData[key] = [];
        } else if (property.type === 'object') {
          initialData[key] = {};
        } else if (property.type === 'boolean') {
          initialData[key] = false;
        } else {
          initialData[key] = '';
        }
      });
      setFormData(initialData);
      setValidationErrors({});
    }
  }, [schema]);

  const handleInputChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
    
    // Clear validation error for this field
    if (validationErrors[key]) {
      setValidationErrors(prev => ({
        ...prev,
        [key]: null
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!schema || !schema.properties) return errors;

    Object.keys(schema.properties).forEach(key => {
      const property = schema.properties[key];
      const value = formData[key];

      // Check required fields
      if (schema.required && schema.required.includes(key) && !value) {
        errors[key] = 'This field is required';
        return;
      }

      // Check minimum length for strings
      if (property.type === 'string' && property.minLength && value.length < property.minLength) {
        errors[key] = `Minimum length is ${property.minLength} characters`;
      }

      // Check maximum length for strings
      if (property.type === 'string' && property.maxLength && value.length > property.maxLength) {
        errors[key] = `Maximum length is ${property.maxLength} characters`;
      }

      // Check minimum value for numbers
      if (property.type === 'number' && property.minimum !== undefined && value < property.minimum) {
        errors[key] = `Minimum value is ${property.minimum}`;
      }

      // Check maximum value for numbers
      if (property.type === 'number' && property.maximum !== undefined && value > property.maximum) {
        errors[key] = `Maximum value is ${property.maximum}`;
      }
    });

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      toast.error('Please fix the validation errors');
      return;
    }

    onSubmit(formData);
  };

  const renderInputField = (key, property) => {
    const value = formData[key] || '';
    const error = validationErrors[key];
    const isRequired = schema.required && schema.required.includes(key);

    const baseClasses = "input-field";
    const errorClasses = error ? "border-red-500 focus:ring-red-500" : "";

    switch (property.type) {
      case 'string':
        if (property.enum) {
          return (
            <select
              value={value}
              onChange={(e) => handleInputChange(key, e.target.value)}
              className={`${baseClasses} ${errorClasses}`}
            >
              <option value="">Select an option</option>
              {property.enum.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          );
        }
        
        if (property.format === 'textarea' || property.maxLength > 100) {
          return (
            <textarea
              value={value}
              onChange={(e) => handleInputChange(key, e.target.value)}
              placeholder={property.description || `Enter ${key}`}
              rows={4}
              className={`${baseClasses} ${errorClasses}`}
            />
          );
        }
        
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(key, e.target.value)}
            placeholder={property.description || `Enter ${key}`}
            className={`${baseClasses} ${errorClasses}`}
          />
        );

      case 'number':
      case 'integer':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleInputChange(key, parseFloat(e.target.value) || '')}
            placeholder={property.description || `Enter ${key}`}
            min={property.minimum}
            max={property.maximum}
            step={property.type === 'integer' ? 1 : 'any'}
            className={`${baseClasses} ${errorClasses}`}
          />
        );

      case 'boolean':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              id={key}
              checked={value}
              onChange={(e) => handleInputChange(key, e.target.checked)}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor={key} className="ml-2 text-sm text-gray-700">
              {property.description || key}
            </label>
          </div>
        );

      case 'array':
        return (
          <textarea
            value={Array.isArray(value) ? value.join('\n') : ''}
            onChange={(e) => handleInputChange(key, e.target.value.split('\n').filter(item => item.trim()))}
            placeholder={property.description || `Enter ${key} (one per line)`}
            rows={3}
            className={`${baseClasses} ${errorClasses}`}
          />
        );

      case 'object':
        return (
          <textarea
            value={typeof value === 'object' ? JSON.stringify(value, null, 2) : ''}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                handleInputChange(key, parsed);
              } catch {
                handleInputChange(key, e.target.value);
              }
            }}
            placeholder={property.description || `Enter ${key} as JSON`}
            rows={4}
            className={`${baseClasses} ${errorClasses}`}
          />
        );

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(key, e.target.value)}
            placeholder={property.description || `Enter ${key}`}
            className={`${baseClasses} ${errorClasses}`}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center mb-4">
          <Settings className="w-5 h-5 mr-2 text-primary-600" />
          <h2 className="text-xl font-semibold text-gray-900">Input Schema</h2>
          <div className="loading-spinner w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full ml-auto" />
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="flex items-center mb-4">
          <Settings className="w-5 h-5 mr-2 text-primary-600" />
          <h2 className="text-xl font-semibold text-gray-900">Input Schema</h2>
        </div>
        <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
          <span className="text-sm text-red-800">Failed to load schema: {error}</span>
        </div>
      </div>
    );
  }

  if (!schema || !schema.properties) {
    return (
      <div className="card">
        <div className="flex items-center mb-4">
          <Settings className="w-5 h-5 mr-2 text-primary-600" />
          <h2 className="text-xl font-semibold text-gray-900">Input Schema</h2>
        </div>
        <div className="text-center py-8 text-gray-500">
          No input schema available for this actor
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Settings className="w-5 h-5 mr-2 text-primary-600" />
          <h2 className="text-xl font-semibold text-gray-900">Input Parameters</h2>
        </div>
        {executionLoading && (
          <div className="flex items-center text-primary-600">
            <div className="loading-spinner w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full mr-2" />
            <span className="text-sm">Executing...</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.keys(schema.properties).map(key => {
          const property = schema.properties[key];
          const isRequired = schema.required && schema.required.includes(key);
          const error = validationErrors[key];

          return (
            <div key={key} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {property.title || key}
                {isRequired && <span className="text-red-500 ml-1">*</span>}
              </label>
              
              {renderInputField(key, property)}
              
              {property.description && (
                <p className="text-xs text-gray-500">{property.description}</p>
              )}
              
              {error && (
                <p className="text-xs text-red-600 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {error}
                </p>
              )}
            </div>
          );
        })}

        {executionError && (
          <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-sm text-red-800">{executionError}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={executionLoading}
          className="btn-primary w-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {executionLoading ? (
            <>
              <div className="loading-spinner w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
              Executing Actor...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Execute Actor
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ActorSchemaForm; 