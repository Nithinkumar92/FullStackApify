import React, { useState } from 'react';
import { Download, Copy, RefreshCw, CheckCircle, AlertCircle, FileText, Code } from 'lucide-react';
import toast from 'react-hot-toast';

const ResultDisplay = ({ results, actorName, onReset }) => {
  const [viewMode, setViewMode] = useState('table'); // 'table', 'json', 'raw'
  const [expandedItems, setExpandedItems] = useState(new Set());

  const toggleItemExpansion = (index) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const downloadResults = () => {
    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${actorName || 'actor'}-results.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Results downloaded');
  };

  const renderValue = (value, depth = 0) => {
    if (value === null) return <span className="text-gray-500 italic">null</span>;
    if (value === undefined) return <span className="text-gray-500 italic">undefined</span>;
    
    if (typeof value === 'string') {
      return <span className="text-green-700">"{value}"</span>;
    }
    
    if (typeof value === 'number') {
      return <span className="text-blue-600">{value}</span>;
    }
    
    if (typeof value === 'boolean') {
      return <span className="text-purple-600">{value.toString()}</span>;
    }
    
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return <span className="text-gray-500 italic">[]</span>;
      }
      
      return (
        <div className="ml-4">
          <span className="text-gray-600">[</span>
          {value.map((item, index) => (
            <div key={index} className="ml-2">
              {renderValue(item, depth + 1)}
              {index < value.length - 1 && <span className="text-gray-600">,</span>}
            </div>
          ))}
          <span className="text-gray-600">]</span>
        </div>
      );
    }
    
    if (typeof value === 'object') {
      const keys = Object.keys(value);
      if (keys.length === 0) {
        return <span className="text-gray-500 italic">{'{}'}</span>;
      }
      
      return (
        <div className="ml-4">
          <span className="text-gray-600">{'{'}</span>
          {keys.map((key, index) => (
            <div key={key} className="ml-2">
              <span className="text-blue-600">"{key}"</span>
              <span className="text-gray-600">: </span>
              {renderValue(value[key], depth + 1)}
              {index < keys.length - 1 && <span className="text-gray-600">,</span>}
            </div>
          ))}
          <span className="text-gray-600">{'}'}</span>
        </div>
      );
    }
    
    return <span className="text-gray-900">{String(value)}</span>;
  };

  const renderTableRow = (item, index) => {
    const isExpanded = expandedItems.has(index);
    const hasComplexData = typeof item === 'object' && item !== null;
    
    return (
      <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
        <td className="px-4 py-3 text-sm text-gray-900 font-medium">
          {index + 1}
        </td>
        <td className="px-4 py-3">
          {hasComplexData ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {Object.keys(item).length} properties
                </span>
                <button
                  onClick={() => toggleItemExpansion(index)}
                  className="text-primary-600 hover:text-primary-700 text-sm"
                >
                  {isExpanded ? 'Collapse' : 'Expand'}
                </button>
              </div>
              {isExpanded && (
                <div className="bg-gray-50 p-3 rounded text-sm font-mono">
                  {renderValue(item)}
                </div>
              )}
            </div>
          ) : (
            <span className="text-sm text-gray-900">{String(item)}</span>
          )}
        </td>
        <td className="px-4 py-3 text-right">
          <button
            onClick={() => copyToClipboard(JSON.stringify(item, null, 2))}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Copy item"
          >
            <Copy className="w-4 h-4" />
          </button>
        </td>
      </tr>
    );
  };

  if (!results || results.length === 0) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Execution Results</h2>
              <p className="text-gray-600">Actor completed successfully</p>
            </div>
          </div>
          <button 
            onClick={onReset} 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </button>
        </div>
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Execution Completed</h3>
          <p className="text-gray-600">No results returned from the actor execution.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Execution Results</h2>
            <p className="text-gray-600">{results.length} results returned</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={downloadResults}
            className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            title="Download results"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </button>
          <button
            onClick={() => copyToClipboard(JSON.stringify(results, null, 2))}
            className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            title="Copy all results"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy All
          </button>
          <button
            onClick={onReset}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            title="Reset and start over"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </button>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center space-x-4 mb-4">
        <span className="text-sm font-medium text-gray-700">View:</span>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              viewMode === 'table'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileText className="w-4 h-4 inline mr-1" />
            Table
          </button>
          <button
            onClick={() => setViewMode('json')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              viewMode === 'json'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Code className="w-4 h-4 inline mr-1" />
            JSON
          </button>
        </div>
        <span className="text-sm text-gray-500">
          {results.length} result{results.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Results Content */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {viewMode === 'table' ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((item, index) => renderTableRow(item, index))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4">
            <pre className="text-sm text-gray-800 overflow-x-auto whitespace-pre-wrap">
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center">
          <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
          <span className="text-sm text-green-800">
            Successfully executed {actorName} and retrieved {results.length} result{results.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay; 