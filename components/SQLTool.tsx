'use client';

import React, { useState, useEffect } from 'react';
import { formatSQL, minifySQL, validateSQL, FormatOptions } from '@/lib/sql-utils';

export default function SQLTool() {
  const [sqlInput, setSqlInput] = useState('');
  const [formattedOutput, setFormattedOutput] = useState('');
  const [minifiedOutput, setMinifiedOutput] = useState('');
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState<string>('');
  const [options, setOptions] = useState<FormatOptions>({
    uppercase: true,
    commaFirst: false,
    indentSize: 2,
    keywordStyle: 'upper'
  });

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(type);
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatSQLCode = () => {
    const validation = validateSQL(sqlInput);
    if (!validation.valid) {
      setError(validation.error || 'Invalid SQL syntax');
      setFormattedOutput('');
      setMinifiedOutput('');
      return;
    }

    const formatted = formatSQL(sqlInput, options);
    const minified = minifySQL(sqlInput);

    if (formatted.success && minified.success) {
      setFormattedOutput(formatted.formatted || '');
      setMinifiedOutput(minified.formatted || '');
      setError('');
    } else {
      setError(formatted.error || minified.error || 'Failed to format SQL');
      setFormattedOutput('');
      setMinifiedOutput('');
    }
  };

  useEffect(() => {
    if (sqlInput) {
      formatSQLCode();
    } else {
      setFormattedOutput('');
      setMinifiedOutput('');
      setError('');
    }
  }, [sqlInput, options]);

  const updateOption = (key: keyof FormatOptions, value: boolean | number | string) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const clearAll = () => {
    setSqlInput('');
    setFormattedOutput('');
    setMinifiedOutput('');
    setError('');
    setCopySuccess('');
  };

  const loadSampleSQL = () => {
    setSqlInput(`SELECT u.id, u.name, u.email, COUNT(o.id) as order_count, SUM(o.total) as total_spent FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE u.created_at >= '2023-01-01' AND u.status = 'active' GROUP BY u.id, u.name, u.email HAVING COUNT(o.id) > 0 ORDER BY total_spent DESC LIMIT 10`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 text-black dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">SQL Formatter</h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
        Format, minify, and validate SQL queries with customizable formatting options.
      </p>

      {/* Formatting Options */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
        <h3 className="font-semibold text-sm mb-3 text-gray-900 dark:text-gray-100">Formatting Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Keyword Style
            </label>
            <select
              value={options.keywordStyle}
              onChange={(e) => updateOption('keywordStyle', e.target.value)}
              className="w-full px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-gray-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
            >
              <option value="upper">UPPERCASE</option>
              <option value="lower">lowercase</option>
              <option value="capitalize">Capitalize</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Indent Size
            </label>
            <select
              value={options.indentSize}
              onChange={(e) => updateOption('indentSize', parseInt(e.target.value))}
              className="w-full px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-gray-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
            >
              <option value="2">2 spaces</option>
              <option value="4">4 spaces</option>
              <option value="8">8 spaces</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="commaFirst"
              checked={options.commaFirst}
              onChange={(e) => updateOption('commaFirst', e.target.checked)}
              className="w-4 h-4 text-black dark:text-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-black dark:focus:ring-gray-400 bg-white dark:bg-gray-800"
            />
            <label htmlFor="commaFirst" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Comma First
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="uppercase"
              checked={options.uppercase}
              onChange={(e) => updateOption('uppercase', e.target.checked)}
              className="w-4 h-4 text-black dark:text-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-black dark:focus:ring-gray-400 bg-white dark:bg-gray-800"
            />
            <label htmlFor="uppercase" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Uppercase Keywords
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SQL Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              SQL Input
            </label>
            {sqlInput && (
              <button
                onClick={() => copyToClipboard(sqlInput, 'input')}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  copySuccess === 'input'
                    ? 'bg-green-600 text-white'
                    : 'bg-black dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600'
                }`}
              >
                {copySuccess === 'input' ? 'Copied!' : 'Copy'}
              </button>
            )}
          </div>
          <textarea
            value={sqlInput}
            onChange={(e) => setSqlInput(e.target.value)}
            placeholder="Enter your SQL query here..."
            className="w-full h-64 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-gray-400 focus:border-transparent font-mono text-sm resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
          
          {error && (
            <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Formatted Output */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Formatted SQL
            </label>
            {formattedOutput && (
              <button
                onClick={() => copyToClipboard(formattedOutput, 'formatted')}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  copySuccess === 'formatted'
                    ? 'bg-green-600 text-white'
                    : 'bg-black dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600'
                }`}
              >
                {copySuccess === 'formatted' ? 'Copied!' : 'Copy'}
              </button>
            )}
          </div>
          <textarea
            value={formattedOutput}
            readOnly
            placeholder="Formatted SQL will appear here..."
            className="w-full h-64 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 font-mono text-sm resize-none text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      {/* Minified Output */}
      {minifiedOutput && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Minified SQL
            </label>
            <button
              onClick={() => copyToClipboard(minifiedOutput, 'minified')}
              className={`px-3 py-1 text-xs rounded transition-colors ${
                copySuccess === 'minified'
                  ? 'bg-green-600 text-white'
                  : 'bg-black dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600'
              }`}
            >
              {copySuccess === 'minified' ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <textarea
            value={minifiedOutput}
            readOnly
            placeholder="Minified SQL will appear here..."
            className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 font-mono text-sm resize-none text-gray-900 dark:text-gray-100"
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center mt-8">
        <button
          onClick={clearAll}
          className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
        >
          Clear All
        </button>
        <button
          onClick={loadSampleSQL}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Load Sample SQL
        </button>
        <button
          onClick={formatSQLCode}
          disabled={!sqlInput}
          className="px-6 py-2 bg-black dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Format SQL
        </button>
      </div>

      {/* Statistics */}
      {sqlInput && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Input Statistics</h3>
            <div className="text-blue-800 dark:text-blue-200 text-sm">
              <p>Characters: {sqlInput.length}</p>
              <p>Lines: {sqlInput.split('\n').length}</p>
            </div>
          </div>
          
          {formattedOutput && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <h3 className="font-semibold text-green-900 dark:text-green-100 mb-1">Formatted Statistics</h3>
              <div className="text-green-800 dark:text-green-200 text-sm">
                <p>Characters: {formattedOutput.length}</p>
                <p>Lines: {formattedOutput.split('\n').length}</p>
              </div>
            </div>
          )}
          
          {minifiedOutput && (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">Minified Statistics</h3>
              <div className="text-yellow-800 dark:text-yellow-200 text-sm">
                <p>Characters: {minifiedOutput.length}</p>
                <p>Space Saved: {sqlInput.length - minifiedOutput.length} chars</p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-8 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
        <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">SQL Formatting Tips</h3>
        <div className="text-purple-800 dark:text-purple-200 text-sm space-y-1">
          <p><strong>Keyword Style:</strong> Choose how SQL keywords should be cased (UPPERCASE, lowercase, or Capitalized)</p>
          <p><strong>Comma First:</strong> Place commas at the beginning of lines for better readability</p>
          <p><strong>Indent Size:</strong> Control the number of spaces for indentation</p>
          <p><strong>Validation:</strong> Automatically checks for balanced parentheses and unclosed strings</p>
        </div>
      </div>
    </div>
  );
}
