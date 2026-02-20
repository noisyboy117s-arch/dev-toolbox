"use client";
import React, { useState } from 'react';

export default function Base64Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('decode');
  const [copySuccess, setCopySuccess] = useState(false);

  const handleProcess = () => {
    try {
      if (mode === 'encode') {
        setOutput(btoa(input));
      } else {
        setOutput(atob(input));
      }
    } catch (e) {
      setOutput('Error: Invalid input for processing.');
    }
  };

  const copyToClipboard = async (text: string, event?: React.MouseEvent<HTMLButtonElement>) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setCopySuccess(false);
  };

  return (
    <div className="px-4 py-6 md:px-8 md:py-8 max-w-6xl mx-auto font-sans">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Modern Base64 {mode === 'encode' ? 'Encoder' : 'Decoder'}
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6 md:mb-8 text-sm md:text-base">
        Secure, client-side Base64 conversion. No data ever leaves your browser.
      </p>
      
      <div className="flex flex-wrap gap-2 md:gap-4 mb-4">
        <button 
          onClick={() => setMode('decode')}
          className={`px-4 py-2 rounded-lg text-sm md:text-base font-medium transition-colors ${
            mode === 'decode' 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Decode
        </button>
        <button 
          onClick={() => setMode('encode')}
          className={`px-4 py-2 rounded-lg text-sm md:text-base font-medium transition-colors ${
            mode === 'encode' 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Encode
        </button>
      </div>

      <textarea 
        className="w-full h-32 md:h-40 p-3 md:p-4 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 font-mono text-sm md:text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder={`Paste your ${mode === 'decode' ? 'Base64 string' : 'text'} here...`}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button 
        onClick={handleProcess}
        className="w-full bg-black dark:bg-gray-700 text-white py-3 rounded-lg font-bold hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors text-sm md:text-base"
      >
        {mode === 'encode' ? 'Encode' : 'Decode'}
      </button>

      {output && (
        <div className="mt-6 md:mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100">Result:</h2>
            <div className="flex gap-2">
              <button
                onClick={() => copyToClipboard(output)}
                className={`px-3 py-1 bg-black dark:bg-gray-700 text-white text-sm rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors ${
                  copySuccess ? 'bg-green-600 hover:bg-green-700' : ''
                }`}
              >
                {copySuccess ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={clearAll}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
          <pre className="p-3 md:p-4 bg-gray-100 dark:bg-gray-800 rounded-lg break-all whitespace-pre-wrap font-mono text-xs md:text-sm text-gray-900 dark:text-gray-100 max-h-64 md:max-h-96 overflow-y-auto">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
