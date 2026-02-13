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

  const cron = generateCron(parts);

  const presets = [
    { name: 'Every minute', value: { minute: '*', hour: '*', dayOfMonth: '*', month: '*', dayOfWeek: '*' } },
    { name: 'Every hour', value: { minute: '0', hour: '*', dayOfMonth: '*', month: '*', dayOfWeek: '*' } },
    { name: 'Every day at midnight', value: { minute: '0', hour: '0', dayOfMonth: '*', month: '*', dayOfWeek: '*' } },
    { name: 'Every Sunday at midnight', value: { minute: '0', hour: '0', dayOfMonth: '*', month: '*', dayOfWeek: '0' } },
    { name: 'First day of every month', value: { minute: '0', hour: '0', dayOfMonth: '1', month: '*', dayOfWeek: '*' } },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 text-black">
      <h1 className="text-3xl font-bold mb-6 text-center">Cron Generator</h1>
      
      <div className="bg-black text-white p-8 rounded-lg mb-8 text-center shadow-lg">
        <p className="text-sm text-gray-400 uppercase tracking-widest font-bold mb-2">Generated Cron Expression</p>
        <code className="text-4xl font-mono">{cron}</code>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        {Object.keys(parts).map((key) => (
          <div key={key}>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{key}</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-black outline-none font-mono"
              value={parts[key as keyof CronParts]}
              onChange={(e) => setParts({ ...parts, [key]: e.target.value })}
            />
          </div>
        ))}
      </div>

      <div className="bg-white p-6 border border-gray-200 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Presets</h2>
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => setParts(preset.value)}
              className="px-3 py-1.5 bg-gray-100 border border-gray-200 rounded-full text-sm hover:bg-gray-200 transition-colors"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
