'use client';

import React, { useState } from 'react';
import { formatJSON, validateJSON } from '@/lib/json-utils';

export default function JSONTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="max-w-4xl mx-auto px-4 text-black">
      <h1 className="text-3xl font-bold mb-6 text-center">JSON Formatter & Validator</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Input JSON</label>
          <textarea
            className="w-full h-80 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent font-mono text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Paste your JSON here...'
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Output</label>
          <textarea
            className={`w-full h-80 p-3 border rounded-lg font-mono text-sm bg-gray-50 ${
              error ? 'border-red-300' : 'border-gray-300'
            }`}
            value={output}
            readOnly
            placeholder="Formatted output will appear here..."
          />
          {error && <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4 mt-6 justify-center">
        <button
          onClick={handleFormat}
          className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Format
        </button>
        <button
          onClick={handleMinify}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Minify
        </button>
        <button
          onClick={handleValidate}
          className="px-6 py-2 border border-black text-black rounded-lg hover:bg-gray-100 transition-colors"
        >
          Validate
        </button>
        <button
          onClick={() => { setInput(''); setOutput(''); setError(null); }}
          className="px-6 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
