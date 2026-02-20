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
    <div className="p-8 max-w-4xl mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-4">Modern Base64 {mode === 'encode' ? 'Encoder' : 'Decoder'}</h1>
      <p className="text-gray-600 mb-8">Secure, client-side Base64 conversion. No data ever leaves your browser.</p>
      
      <div className="flex gap-4 mb-4">
        <button 
          onClick={() => setMode('decode')}
          className={`px-4 py-2 rounded ${mode === 'decode' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Decode
        </button>
        <button 
          onClick={() => setMode('encode')}
          className={`px-4 py-2 rounded ${mode === 'encode' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Encode
        </button>
      </div>

      <textarea 
        className="w-full h-40 p-4 border rounded mb-4 font-mono"
        placeholder={`Paste your ${mode === 'decode' ? 'Base64 string' : 'text'} here...`}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button 
        onClick={handleProcess}
        className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition"
      >
        {mode === 'encode' ? 'Encode' : 'Decode'}
      </button>

      {output && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold">Result:</h2>
            <button
              onClick={() => copyToClipboard(output)}
              onMouseDown={(e) => copyToClipboard(output, e)}
              className={`px-3 py-1 bg-black text-white text-sm rounded hover:bg-gray-800 transition-colors ${
                copySuccess ? 'bg-green-600 hover:bg-green-700' : ''
              }`}
            >
              {copySuccess ? 'Copied!' : 'Copy'}
            </button>
            <button
              onClick={clearAll}
              className="px-3 py-1 border border border-gray-300 text-gray-600 text-sm rounded hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>
          </div>
          <pre className="p-4 bg-gray-100 rounded break-all whitespace-pre-wrap font-mono">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
