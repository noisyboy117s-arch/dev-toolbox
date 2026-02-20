'use client';

import React, { useState } from 'react';
import { formatJSON, validateJSON } from '@/lib/json-utils';

export default function JSONTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleFormat = () => {
    try {
      const formatted = formatJSON(input);
      setOutput(formatted);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON');
      setOutput('');
    }
  };

  const handleMinify = () => {
    try {
      const obj = JSON.parse(input);
      setOutput(JSON.stringify(obj));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON');
      setOutput('');
    }
  };

  const handleValidate = () => {
    const result = validateJSON(input);
    if (result.valid) {
      setError(null);
      setOutput('JSON is valid!');
    } else {
      setError(result.error || 'Invalid JSON');
      setOutput('');
    }
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError(null);
    setCopySuccess(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 text-black dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">JSON Formatter & Validator</h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-8">Format, minify, and validate JSON with instant feedback. All processing happens in your browser.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Input JSON</label>
          <textarea
            className="w-full h-80 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-gray-400 focus:border-transparent font-mono text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Paste your JSON here...'
          />
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Output</label>
            {output && (
              <button
                onClick={() => copyToClipboard(output)}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  copySuccess 
                    ? 'bg-green-600 text-white' 
                    : 'bg-black dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600'
                }`}
              >
                {copySuccess ? 'Copied!' : 'Copy'}
              </button>
            )}
          </div>
          <textarea
            className={`w-full h-80 p-3 border rounded-lg font-mono text-sm ${
              error 
                ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20' 
                : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800'
            } text-gray-900 dark:text-gray-100`}
            value={output}
            readOnly
            placeholder="Formatted output will appear here..."
          />
          {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4 mt-6 justify-center">
        <button
          onClick={handleFormat}
          className="px-6 py-2 bg-black dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
        >
          Format
        </button>
        <button
          onClick={handleMinify}
          className="px-6 py-2 bg-gray-600 dark:bg-gray-600 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-500 transition-colors"
        >
          Minify
        </button>
        <button
          onClick={handleValidate}
          className="px-6 py-2 border border-black dark:border-gray-600 text-black dark:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          Validate
        </button>
        <button
          onClick={clearAll}
          className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
