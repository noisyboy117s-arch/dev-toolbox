'use client';

import React, { useState } from 'react';
import { encodeURL, decodeURL, encodeBase64URL, decodeBase64URL } from '@/lib/url-utils';

export default function URLTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode' | 'encode64' | 'decode64'>('encode');
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleProcess = () => {
    try {
      setError(null);
      let result = '';
      
      switch (mode) {
        case 'encode':
          result = encodeURL(input);
          break;
        case 'decode':
          result = decodeURL(input);
          break;
        case 'encode64':
          result = encodeBase64URL(input);
          break;
        case 'decode64':
          result = decodeBase64URL(input);
          break;
      }
      
      setOutput(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred');
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
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">URL Encoder/Decoder</h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
        Encode and decode URLs safely. Perfect for working with query parameters and API endpoints.
      </p>

      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        <button
          onClick={() => setMode('encode')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            mode === 'encode' 
              ? 'bg-black dark:bg-gray-700 text-white' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          URL Encode
        </button>
        <button
          onClick={() => setMode('decode')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            mode === 'decode' 
              ? 'bg-black dark:bg-gray-700 text-white' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          URL Decode
        </button>
        <button
          onClick={() => setMode('encode64')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            mode === 'encode64' 
              ? 'bg-black dark:bg-gray-700 text-white' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Base64URL Encode
        </button>
        <button
          onClick={() => setMode('decode64')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            mode === 'decode64' 
              ? 'bg-black dark:bg-gray-700 text-white' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Base64URL Decode
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {mode.includes('encode') ? 'Input Text' : 'Encoded URL'}
          </label>
          <textarea
            className="w-full h-40 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-gray-400 focus:border-transparent font-mono text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === 'encode' ? 'Enter text to encode...' :
              mode === 'decode' ? 'Enter URL to decode...' :
              mode === 'encode64' ? 'Enter text for Base64URL encoding...' :
              'Enter Base64URL to decode...'
            }
          />
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {mode.includes('encode') ? 'Encoded Result' : 'Decoded Result'}
            </label>
            {output && (
              <button
                onClick={copyToClipboard}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  copySuccess 
                    ? 'bg-green-600 text-white' 
                    : 'bg-black dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600'
                }`}
              >
                {copySuccess ? 'Copied!' : 'Copy'}
              </button>
            )}
          </div>
          <div className="relative">
            <textarea
              className={`w-full h-40 p-3 border rounded-lg font-mono text-sm ${
                error 
                  ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20' 
                  : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
              } text-gray-900 dark:text-gray-100`}
              value={output}
              readOnly
              placeholder="Result will appear here..."
            />
          </div>
          {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={handleProcess}
          className="px-6 py-2 bg-black dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors font-medium"
        >
          {mode.includes('encode') ? 'Encode' : 'Decode'}
        </button>
        <button
          onClick={clearAll}
          className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
        >
          Clear
        </button>
      </div>

      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">What is URL Encoding?</h3>
        <p className="text-blue-800 dark:text-blue-200 text-sm">
          URL encoding converts special characters into a format that can be safely transmitted over the internet. 
          For example, spaces become %20, and special characters like & and ? are encoded to prevent conflicts with URL structure.
        </p>
      </div>

      <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">Base64URL vs Regular Base64</h3>
        <p className="text-yellow-800 dark:text-yellow-200 text-sm">
          Base64URL is a variant of Base64 encoding that's safe for use in URLs and filenames. 
          It replaces '+' with '-', '/' with '_', and removes padding '=' characters to avoid conflicts with URL structure.
        </p>
      </div>
    </div>
  );
}
