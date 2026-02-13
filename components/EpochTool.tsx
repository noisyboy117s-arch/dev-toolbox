'use client';

import React, { useState, useEffect } from 'react';
import { epochToDate, dateToEpoch, formatEpochDate } from '@/lib/epoch-utils';

export default function EpochTool() {
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));
  const [epochInput, setEpochInput] = useState('');
  const [dateResult, setDateResult] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [epochResult, setEpochResult] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

  return (
    <div className="max-w-4xl mx-auto px-4 text-black">
      <h1 className="text-3xl font-bold mb-6 text-center">Epoch Converter</h1>
      
      <div className="bg-gray-100 p-6 rounded-lg mb-8 text-center">
        <p className="text-sm text-gray-600 uppercase tracking-wide font-semibold">Current Unix Timestamp</p>
        <p className="text-4xl font-mono font-bold mt-2">{now}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Epoch to Date</h2>
          <div className="space-y-4">
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-black outline-none"
              placeholder="Enter epoch (e.g. 1707833227)"
              value={epochInput}
              onChange={(e) => setEpochInput(e.target.value)}
            />
            <button
              onClick={handleEpochConvert}
              className="w-full py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
            >
              Convert
            </button>
            {dateResult && (
              <div className="mt-4 p-3 bg-gray-50 rounded border border-gray-200">
                <p className="text-sm font-medium text-gray-500">Result (UTC):</p>
                <p className="text-lg font-mono">{dateResult}</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Date to Epoch</h2>
          <div className="space-y-4">
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-black outline-none"
              placeholder="Enter date (e.g. 2024-02-13)"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
            />
            <button
              onClick={handleDateConvert}
              className="w-full py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
            >
              Convert
            </button>
            {epochResult && (
              <div className="mt-4 p-3 bg-gray-50 rounded border border-gray-200">
                <p className="text-sm font-medium text-gray-500">Result (Seconds):</p>
                <p className="text-lg font-mono">{epochResult}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
