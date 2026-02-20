'use client';

import React, { useState, useEffect } from 'react';
import { epochToDate, dateToEpoch, formatEpochDate } from '@/lib/epoch-utils';

export default function EpochTool() {
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));
  const [epochInput, setEpochInput] = useState('');
  const [dateResult, setDateResult] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [epochResult, setEpochResult] = useState('');
  const [copySuccess, setCopySuccess] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(type);
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleEpochConvert = () => {
    const epoch = parseInt(epochInput);
    if (!isNaN(epoch)) {
      const date = epochToDate(epoch);
      setDateResult(formatEpochDate(date));
    } else {
      setDateResult('Invalid Epoch');
    }
  };

  const handleDateConvert = () => {
    const date = new Date(dateInput);
    if (!isNaN(date.getTime())) {
      setEpochResult(dateToEpoch(date).toString());
    } else {
      setEpochResult('Invalid Date');
    }
  };

  const clearAll = () => {
    setEpochInput('');
    setDateResult('');
    setDateInput('');
    setEpochResult('');
    setCopySuccess('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 text-black dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">Epoch Converter</h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-8">Convert between Unix timestamps and human-readable dates. Real-time current timestamp included.</p>
      
      <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg mb-8 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wide font-semibold">Current Unix Timestamp</p>
        <div className="flex items-center justify-center gap-3 mt-2">
          <p className="text-4xl font-mono font-bold text-gray-900 dark:text-gray-100">{now}</p>
          <button
            onClick={() => copyToClipboard(now.toString(), 'current')}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              copySuccess === 'current' 
                ? 'bg-green-600 text-white' 
                : 'bg-black dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600'
            }`}
          >
            {copySuccess === 'current' ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Epoch to Date</h2>
          <div className="space-y-4">
            <input
              type="text"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-gray-400 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Enter epoch (e.g. 1707833227)"
              value={epochInput}
              onChange={(e) => setEpochInput(e.target.value)}
            />
            <button
              onClick={handleEpochConvert}
              className="w-full py-3 bg-black dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
            >
              Convert
            </button>
            {dateResult && (
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Result (UTC):</p>
                  <button
                    onClick={() => copyToClipboard(dateResult, 'date')}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      copySuccess === 'date' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-600 text-white hover:bg-gray-700'
                    }`}
                  >
                    {copySuccess === 'date' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <p className="text-lg font-mono text-gray-900 dark:text-gray-100">{dateResult}</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Date to Epoch</h2>
          <div className="space-y-4">
            <input
              type="text"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-gray-400 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Enter date (e.g. 2024-02-13)"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
            />
            <button
              onClick={handleDateConvert}
              className="w-full py-3 bg-black dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
            >
              Convert
            </button>
            {epochResult && (
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Result (Seconds):</p>
                  <button
                    onClick={() => copyToClipboard(epochResult, 'epoch')}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      copySuccess === 'epoch' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-600 text-white hover:bg-gray-700'
                    }`}
                  >
                    {copySuccess === 'epoch' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <p className="text-lg font-mono text-gray-900 dark:text-gray-100">{epochResult}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={clearAll}
          className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Clear All
        </button>
      </div>
    </div>
  );
}
