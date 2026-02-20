'use client';

import React, { useState } from 'react';
import { generateCron, CronParts } from '@/lib/cron-utils';

export default function CronTool() {
  const [parts, setParts] = useState<CronParts>({
    minute: '*',
    hour: '*',
    dayOfMonth: '*',
    month: '*',
    dayOfWeek: '*',
  });
  const [copySuccess, setCopySuccess] = useState(false);

  const cron = generateCron(parts);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const presets = [
    { name: 'Every minute', value: { minute: '*', hour: '*', dayOfMonth: '*', month: '*', dayOfWeek: '*' } },
    { name: 'Every hour', value: { minute: '0', hour: '*', dayOfMonth: '*', month: '*', dayOfWeek: '*' } },
    { name: 'Every day at midnight', value: { minute: '0', hour: '0', dayOfMonth: '*', month: '*', dayOfWeek: '*' } },
    { name: 'Every Sunday at midnight', value: { minute: '0', hour: '0', dayOfMonth: '*', month: '*', dayOfWeek: '0' } },
    { name: 'First day of every month', value: { minute: '0', hour: '0', dayOfMonth: '1', month: '*', dayOfWeek: '*' } },
  ];

  const clearAll = () => {
    setParts({
      minute: '*',
      hour: '*',
      dayOfMonth: '*',
      month: '*',
      dayOfWeek: '*',
    });
    setCopySuccess(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 text-black dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">Cron Generator</h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-8">Generate cron expressions with visual builder and common presets.</p>
      
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 text-white p-8 rounded-lg mb-8 text-center shadow-lg">
        <p className="text-sm text-gray-300 uppercase tracking-widest font-bold mb-4">Generated Cron Expression</p>
        <div className="flex items-center justify-center gap-4">
          <code className="text-4xl font-mono">{cron}</code>
          <button
            onClick={() => copyToClipboard(cron)}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
              copySuccess 
                ? 'bg-green-600 text-white' 
                : 'bg-white text-black hover:bg-gray-100'
            }`}
          >
            {copySuccess ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        {Object.keys(parts).map((key) => (
          <div key={key}>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">{key}</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-gray-400 outline-none font-mono bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              value={parts[key as keyof CronParts]}
              onChange={(e) => setParts({ ...parts, [key]: e.target.value })}
            />
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Presets</h2>
          <button
            onClick={clearAll}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
          >
            Reset
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => setParts(preset.value)}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-900 dark:text-gray-100"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">Quick Reference</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-blue-800 dark:text-blue-200 mb-1">Field Values:</p>
            <p className="text-blue-700 dark:text-blue-300">Minute: 0-59 | Hour: 0-23 | Day: 1-31 | Month: 1-12 | Weekday: 0-7</p>
          </div>
          <div>
            <p className="font-medium text-blue-800 dark:text-blue-200 mb-1">Special Characters:</p>
            <p className="text-blue-700 dark:text-blue-300">* = any value | , = list | - = range | / = step</p>
          </div>
        </div>
      </div>
    </div>
  );
}
