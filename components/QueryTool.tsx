'use client';

import React, { useState, useEffect } from 'react';
import { parseQueryParams, jsonToQueryParams, formatJSON, validateJSON } from '@/lib/query-utils';

export default function QueryTool() {
  const [queryInput, setQueryInput] = useState('');
  const [jsonInput, setJsonInput] = useState('');
  const [queryResult, setQueryResult] = useState<Record<string, any> | null>(null);
  const [jsonResult, setJsonResult] = useState<string>('');
  const [queryError, setQueryError] = useState('');
  const [jsonError, setJsonError] = useState('');
  const [copySuccess, setCopySuccess] = useState<string>('');

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(type);
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Parse query string to JSON
  useEffect(() => {
    if (queryInput) {
      const result = parseQueryParams(queryInput);
      if (result.success && result.data) {
        setQueryResult(result.data);
        setQueryError('');
        setJsonResult(formatJSON(result.data));
      } else {
        setQueryResult(null);
        setQueryError(result.error || 'Invalid query string');
        setJsonResult('');
      }
    } else {
      setQueryResult(null);
      setQueryError('');
      setJsonResult('');
    }
  }, [queryInput]);

  // Parse JSON to query string
  useEffect(() => {
    if (jsonInput) {
      const validation = validateJSON(jsonInput);
      if (validation.valid && validation.data) {
        try {
          const queryString = jsonToQueryParams(validation.data);
          setJsonResult(queryString);
          setJsonError('');
        } catch (error) {
          setJsonError('Failed to convert to query string');
          setJsonResult('');
        }
      } else {
        setJsonError(validation.error || 'Invalid JSON');
        setJsonResult('');
      }
    } else {
      setJsonResult('');
      setJsonError('');
    }
  }, [jsonInput]);

  const clearAll = () => {
    setQueryInput('');
    setJsonInput('');
    setQueryResult(null);
    setJsonResult('');
    setQueryError('');
    setJsonError('');
    setCopySuccess('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 text-black dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">Query Parameters ↔ JSON Converter</h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
        Convert between URL query parameters and JSON format with automatic parsing and formatting.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Query Parameters Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Query Parameters
            </label>
            {queryResult && (
              <button
                onClick={() => copyToClipboard(queryInput, 'query')}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  copySuccess === 'query'
                    ? 'bg-green-600 text-white'
                    : 'bg-black dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600'
                }`}
              >
                {copySuccess === 'query' ? 'Copied!' : 'Copy'}
              </button>
            )}
          </div>
          <textarea
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            placeholder="Enter query parameters (e.g., name=John&age=25&tags=dev&tags=js)"
            className="w-full h-48 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-gray-400 focus:border-transparent font-mono text-sm resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
          
          {queryError && (
            <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-red-800 dark:text-red-200 text-sm">{queryError}</p>
            </div>
          )}

          {queryResult && (
            <div className="mt-4">
              <h3 className="font-semibold text-sm mb-2 text-gray-900 dark:text-gray-100">Parsed Result</h3>
              <div className="relative">
                <pre className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-sm overflow-x-auto text-gray-900 dark:text-gray-100">
                  {formatJSON(queryResult)}
                </pre>
                <button
                  onClick={() => copyToClipboard(formatJSON(queryResult), 'queryResult')}
                  className={`absolute top-2 right-2 px-2 py-1 text-xs rounded transition-colors ${
                    copySuccess === 'queryResult'
                      ? 'bg-green-600 text-white'
                      : 'bg-black dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600'
                  }`}
                >
                  {copySuccess === 'queryResult' ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* JSON Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              JSON
            </label>
            {jsonInput && (
              <button
                onClick={() => copyToClipboard(jsonInput, 'json')}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  copySuccess === 'json'
                    ? 'bg-green-600 text-white'
                    : 'bg-black dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600'
                }`}
              >
                {copySuccess === 'json' ? 'Copied!' : 'Copy'}
              </button>
            )}
          </div>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder='Enter JSON (e.g., {"name": "John", "age": 25, "tags": ["dev", "js"]})'
            className="w-full h-48 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-gray-400 focus:border-transparent font-mono text-sm resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
          
          {jsonError && (
            <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-red-800 dark:text-red-200 text-sm">{jsonError}</p>
            </div>
          )}

          {jsonResult && (
            <div className="mt-4">
              <h3 className="font-semibold text-sm mb-2 text-gray-900 dark:text-gray-100">Query String Result</h3>
              <div className="relative">
                <pre className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-sm overflow-x-auto text-gray-900 dark:text-gray-100">
                  {jsonResult}
                </pre>
                <button
                  onClick={() => copyToClipboard(jsonResult, 'jsonResult')}
                  className={`absolute top-2 right-2 px-2 py-1 text-xs rounded transition-colors ${
                    copySuccess === 'jsonResult'
                      ? 'bg-green-600 text-white'
                      : 'bg-black dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600'
                  }`}
                >
                  {copySuccess === 'jsonResult' ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center mt-8">
        <button
          onClick={clearAll}
          className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
        >
          Clear All
        </button>
        
        {/* Sample Data Buttons */}
        <button
          onClick={() => {
            setQueryInput('name=John%20Doe&age=25&email=john%40example.com&tags=developer&tags=javascript&active=true&score=95.5');
            setJsonInput('');
          }}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Load Sample Query
        </button>
        
        <button
          onClick={() => {
            setJsonInput('{\n  "name": "John Doe",\n  "age": 25,\n  "email": "john@example.com",\n  "tags": ["developer", "javascript"],\n  "active": true,\n  "score": 95.5\n}');
            setQueryInput('');
          }}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Load Sample JSON
        </button>
      </div>

      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Query Parameters ↔ JSON Tips</h3>
        <div className="text-blue-800 dark:text-blue-200 text-sm space-y-1">
          <p><strong>Query to JSON:</strong> Automatically detects arrays (duplicate keys) and parses numbers/booleans</p>
          <p><strong>JSON to Query:</strong> Converts arrays to multiple parameters and objects to JSON strings</p>
          <p><strong>URL Encoding:</strong> Handles URL-encoded characters automatically</p>
          <p><strong>Nested Objects:</strong> Converted to JSON strings in query parameters</p>
        </div>
      </div>
    </div>
  );
}
