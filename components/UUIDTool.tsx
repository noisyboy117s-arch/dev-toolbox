'use client';

import React, { useState } from 'react';
import { generateUUID, generateMultipleUUIDs, parseUUID, validateUUID, getUUIDVersionInfo, UUIDInfo } from '@/lib/uuid-utils';

export default function UUIDTool() {
  const [uuid, setUuid] = useState('');
  const [multipleUuids, setMultipleUuids] = useState<string[]>([]);
  const [count, setCount] = useState(5);
  const [validationInput, setValidationInput] = useState('');
  const [parsedInfo, setParsedInfo] = useState<UUIDInfo | null>(null);
  const [validationResult, setValidationResult] = useState<boolean | null>(null);
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

  const copyAllToClipboard = async (uuids: string[]) => {
    try {
      await navigator.clipboard.writeText(uuids.join('\n'));
      setCopySuccess('all');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const generateSingle = () => {
    const newUuid = generateUUID();
    setUuid(newUuid);
  };

  const generateMultiple = () => {
    const uuids = generateMultipleUUIDs(count);
    setMultipleUuids(uuids);
  };

  const validateUuid = () => {
    if (!validationInput.trim()) {
      setValidationResult(null);
      setParsedInfo(null);
      return;
    }
    
    const isValid = validateUUID(validationInput);
    setValidationResult(isValid);
    
    if (isValid) {
      const info = parseUUID(validationInput);
      setParsedInfo(info);
    } else {
      setParsedInfo(null);
    }
  };

  const clearAll = () => {
    setUuid('');
    setMultipleUuids([]);
    setValidationInput('');
    setParsedInfo(null);
    setValidationResult(null);
    setCopySuccess('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 text-black dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">UUID Generator</h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
        Generate RFC4122 version 4 UUIDs. Perfect for creating unique identifiers for databases, sessions, and more.
      </p>

      {/* Single UUID Generator */}
      <div className="mb-8 p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Generate Single UUID</h2>
        
        <div className="flex gap-4 mb-4">
          <button
            onClick={generateSingle}
            className="px-6 py-2 bg-black dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors font-medium"
          >
            Generate UUID
          </button>
          {uuid && (
            <button
              onClick={() => copyToClipboard(uuid, 'single')}
              className={`px-6 py-2 rounded-lg transition-colors font-medium ${
                copySuccess === 'single'
                  ? 'bg-green-600 text-white'
                  : 'border border-black dark:border-gray-600 text-black dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {copySuccess === 'single' ? 'Copied!' : 'Copy'}
            </button>
          )}
        </div>

        {uuid && (
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <p className="font-mono text-lg break-all text-gray-900 dark:text-gray-100">{uuid}</p>
          </div>
        )}
      </div>

      {/* Multiple UUID Generator */}
      <div className="mb-8 p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Generate Multiple UUIDs</h2>
        
        <div className="flex items-center gap-4 mb-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Count:</label>
          <input
            type="number"
            min="1"
            max="100"
            value={count}
            onChange={(e) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
            className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-gray-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
          <button
            onClick={generateMultiple}
            className="px-6 py-2 bg-black dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors font-medium"
          >
            Generate {count} UUIDs
          </button>
          {multipleUuids.length > 0 && (
            <>
              <button
                onClick={() => copyAllToClipboard(multipleUuids)}
                className={`px-6 py-2 rounded-lg transition-colors font-medium ${
                  copySuccess === 'all'
                    ? 'bg-green-600 text-white'
                    : 'border border-black dark:border-gray-600 text-black dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {copySuccess === 'all' ? 'Copied!' : 'Copy All'}
              </button>
              <button
                onClick={() => setMultipleUuids([])}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                Clear
              </button>
            </>
          )}
        </div>

        {multipleUuids.length > 0 && (
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 max-h-64 overflow-y-auto">
            <div className="space-y-2">
              {multipleUuids.map((uuid, index) => (
                <div key={index} className="flex items-center justify-between group">
                  <p className="font-mono text-sm break-all flex-1 text-gray-900 dark:text-gray-100">{uuid}</p>
                  <button
                    onClick={() => copyToClipboard(uuid, `multi-${index}`)}
                    className={`ml-2 px-2 py-1 text-xs rounded transition-all ${
                      copySuccess === `multi-${index}`
                        ? 'bg-green-600 text-white opacity-100'
                        : 'bg-black dark:bg-gray-700 text-white opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    {copySuccess === `multi-${index}` ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* UUID Validator */}
      <div className="mb-8 p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Validate & Parse UUID</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            UUID to Validate
          </label>
          <input
            type="text"
            value={validationInput}
            onChange={(e) => setValidationInput(e.target.value)}
            onBlur={validateUuid}
            placeholder="Enter UUID to validate..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-gray-400 focus:border-transparent font-mono bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>

        {validationResult !== null && (
          <div className={`p-4 rounded-lg mb-4 ${
            validationResult 
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
          }`}>
            <p className={`font-medium ${
              validationResult 
                ? 'text-green-900 dark:text-green-100' 
                : 'text-red-900 dark:text-red-100'
            }`}>
              {validationResult ? '✅ Valid UUID' : '❌ Invalid UUID'}
            </p>
          </div>
        )}

        {parsedInfo && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">UUID Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-blue-700 dark:text-blue-300">Version:</span>
                <span className="ml-2 text-blue-900 dark:text-blue-100">{parsedInfo.version}</span>
              </div>
              <div>
                <span className="font-medium text-blue-700 dark:text-blue-300">Variant:</span>
                <span className="ml-2 text-blue-900 dark:text-blue-100">{parsedInfo.variant}</span>
              </div>
              {parsedInfo.timestamp && (
                <div className="md:col-span-2">
                  <span className="font-medium text-blue-700 dark:text-blue-300">Timestamp:</span>
                  <span className="ml-2 text-blue-900 dark:text-blue-100">{new Date(parsedInfo.timestamp).toLocaleString()}</span>
                </div>
              )}
            </div>
            
            {parsedInfo.version && (
              <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Version {parsedInfo.version} Details</h4>
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <p><strong>Name:</strong> {getUUIDVersionInfo(parsedInfo.version).name}</p>
                  <p><strong>Description:</strong> {getUUIDVersionInfo(parsedInfo.version).description}</p>
                  <p><strong>Use Case:</strong> {getUUIDVersionInfo(parsedInfo.version).useCase}</p>
                  <p><strong>Security:</strong> {getUUIDVersionInfo(parsedInfo.version).security}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">What is a UUID?</h3>
        <p className="text-blue-800 dark:text-blue-200 text-sm">
          A UUID (Universally Unique Identifier) is a 128-bit number used to identify information in computer systems. 
          Version 4 UUIDs are generated using random or pseudo-random numbers and have no identifying information about the source or time of creation.
        </p>
      </div>

      <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">UUID Format</h3>
        <p className="text-yellow-800 dark:text-yellow-200 text-sm font-mono mb-2">
          xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
        </p>
        <p className="text-yellow-800 dark:text-yellow-200 text-sm">
          • 8 hex digits + 4 hex digits + 4 hex digits (version 4) + 4 hex digits (variant) + 12 hex digits<br/>
          • Total: 32 hex digits displayed in 5 groups separated by hyphens<br/>
          • Version 4 always starts with 4 in the third group<br/>
          • Variant always starts with 8, 9, a, or b in the fourth group
        </p>
      </div>
    </div>
  );
}
