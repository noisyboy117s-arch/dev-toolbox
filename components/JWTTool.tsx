'use client';

import React, { useState } from 'react';
import { parseJWT, formatJSON, isTokenExpired, getTokenExpirationTime, getTokenIssuedAtTime, JWTParsed } from '@/lib/jwt-utils';

export default function JWTTool() {
  const [token, setToken] = useState('');
  const [parsed, setParsed] = useState<JWTParsed | null>(null);
  const [error, setError] = useState<string | null>(null);
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

  const handleParse = () => {
    try {
      setError(null);
      const result = parseJWT(token);
      setParsed(result);
      
      if (!result.valid) {
        setError(result.error || 'Failed to parse JWT');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred');
      setParsed(null);
    }
  };

  const clearAll = () => {
    setToken('');
    setParsed(null);
    setError(null);
    setCopySuccess('');
  };

  const formatTimestamp = (timestamp: string | null) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 text-black dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">JWT Debugger & Parser</h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
        Decode and inspect JSON Web Tokens (JWT) to view headers, payloads, and signatures. 
        All processing happens securely in your browser.
      </p>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          JWT Token
        </label>
        <textarea
          className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-gray-400 focus:border-transparent font-mono text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Paste your JWT token here... (e.g., eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)"
        />
      </div>

      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        <button
          onClick={handleParse}
          className="px-6 py-2 bg-black dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors font-medium"
        >
          Parse JWT
        </button>
        <button
          onClick={clearAll}
          className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
        >
          Clear
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">Error</h3>
          <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
        </div>
      )}

      {parsed && parsed.valid && (
        <div className="space-y-6">
          {/* Token Status */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Token Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-blue-700 dark:text-blue-300">Valid Format:</span>
                <span className="ml-2 text-blue-800 dark:text-blue-200">✅ Yes</span>
              </div>
              <div>
                <span className="font-medium text-blue-700 dark:text-blue-300">Expired:</span>
                <span className="ml-2 text-blue-800 dark:text-blue-200">
                  {isTokenExpired(parsed.payload) ? '⚠️ Yes' : '✅ No'}
                </span>
              </div>
              <div>
                <span className="font-medium text-blue-700 dark:text-blue-300">Algorithm:</span>
                <span className="ml-2 text-blue-800 dark:text-blue-200">{parsed.header.alg || 'N/A'}</span>
              </div>
            </div>
            
            {(getTokenExpirationTime(parsed.payload) || getTokenIssuedAtTime(parsed.payload)) && (
              <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-800 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {getTokenIssuedAtTime(parsed.payload) && (
                  <div>
                    <span className="font-medium text-blue-700 dark:text-blue-300">Issued At:</span>
                    <span className="ml-2 text-blue-800 dark:text-blue-200">
                      {formatTimestamp(getTokenIssuedAtTime(parsed.payload))}
                    </span>
                  </div>
                )}
                {getTokenExpirationTime(parsed.payload) && (
                  <div>
                    <span className="font-medium text-blue-700 dark:text-blue-300">Expires At:</span>
                    <span className="ml-2 text-blue-800 dark:text-blue-200">
                      {formatTimestamp(getTokenExpirationTime(parsed.payload))}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Header</h3>
                <button
                  onClick={() => copyToClipboard(formatJSON(parsed.header), 'header')}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    copySuccess === 'header'
                      ? 'bg-green-600 text-white'
                      : 'bg-black dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600'
                  }`}
                >
                  {copySuccess === 'header' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <pre className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 overflow-x-auto text-sm font-mono text-gray-900 dark:text-gray-100">
                {formatJSON(parsed.header)}
              </pre>
            </div>

            {/* Payload */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Payload</h3>
                <button
                  onClick={() => copyToClipboard(formatJSON(parsed.payload), 'payload')}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    copySuccess === 'payload'
                      ? 'bg-green-600 text-white'
                      : 'bg-black dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600'
                  }`}
                >
                  {copySuccess === 'payload' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <pre className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 overflow-x-auto text-sm font-mono text-gray-900 dark:text-gray-100">
                {formatJSON(parsed.payload)}
              </pre>
            </div>
          </div>

          {/* Signature */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Signature</h3>
              <button
                onClick={() => copyToClipboard(parsed.signature, 'signature')}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  copySuccess === 'signature'
                    ? 'bg-green-600 text-white'
                    : 'bg-black dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600'
                }`}
              >
                {copySuccess === 'signature' ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <p className="font-mono text-sm break-all text-gray-900 dark:text-gray-100">{parsed.signature}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">⚠️ Security Notice</h3>
        <p className="text-yellow-800 dark:text-yellow-200 text-sm">
          JWT tokens contain sensitive information. This tool processes tokens entirely in your browser 
          and never sends data to any server. However, be cautious when pasting tokens from untrusted sources.
        </p>
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">What is a JWT?</h3>
        <p className="text-blue-800 dark:text-blue-200 text-sm">
          A JSON Web Token (JWT) is a compact, URL-safe means of representing claims to be transferred 
          between two parties. It consists of three parts: header, payload, and signature, separated by dots.
        </p>
      </div>
    </div>
  );
}
