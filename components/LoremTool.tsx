'use client';

import React, { useState, useEffect } from 'react';
import { generateLorem, getLoremStats, generateCustomText, LoremOptions } from '@/lib/lorem-utils';

export default function LoremTool() {
  const [options, setOptions] = useState<LoremOptions>({
    type: 'paragraphs',
    count: 3,
    startWithLorem: true
  });
  const [generatedText, setGeneratedText] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [customCategory, setCustomCategory] = useState<'design' | 'development' | 'business'>('design');
  const [customCount, setCustomCount] = useState(3);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const generateText = () => {
    const text = generateLorem(options);
    setGeneratedText(text);
  };

  const generateCustom = () => {
    const text = generateCustomText(customCategory, customCount);
    setGeneratedText(text);
  };

  const clearAll = () => {
    setGeneratedText('');
    setCopySuccess(false);
  };

  useEffect(() => {
    generateText();
  }, [options]);

  const stats = getLoremStats(generatedText);

  return (
    <div className="max-w-6xl mx-auto px-4 text-black dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">Lorem Ipsum Generator</h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
        Generate placeholder text for design mockups, prototypes, and testing.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Classic Lorem Options */}
        <div className="lg:col-span-2">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600">
            <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-gray-100">Classic Lorem Ipsum</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type
                </label>
                <select
                  value={options.type}
                  onChange={(e) => setOptions(prev => ({ ...prev, type: e.target.value as 'words' | 'sentences' | 'paragraphs' }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-gray-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="words">Words</option>
                  <option value="sentences">Sentences</option>
                  <option value="paragraphs">Paragraphs</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Count
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={options.count}
                  onChange={(e) => setOptions(prev => ({ ...prev, count: parseInt(e.target.value) || 1 }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-gray-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="startWithLorem"
                  checked={options.startWithLorem}
                  onChange={(e) => setOptions(prev => ({ ...prev, startWithLorem: e.target.checked }))}
                  className="w-4 h-4 text-black dark:text-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-black dark:focus:ring-gray-400 bg-white dark:bg-gray-800"
                />
                <label htmlFor="startWithLorem" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Start with "Lorem ipsum"
                </label>
              </div>
            </div>

            <button
              onClick={generateText}
              className="w-full px-4 py-2 bg-black dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors font-medium"
            >
              Generate Classic Text
            </button>
          </div>
        </div>

        {/* Custom Text Options */}
        <div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600">
            <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-gray-100">Custom Phrases</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value as 'design' | 'development' | 'business')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-gray-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="design">Design</option>
                  <option value="development">Development</option>
                  <option value="business">Business</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Count
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={customCount}
                  onChange={(e) => setCustomCount(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-gray-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              <button
                onClick={generateCustom}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Generate Custom Text
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Generated Text Output */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Generated Text
            </label>
            {generatedText && (
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
          
          <textarea
            value={generatedText}
            readOnly
            placeholder="Generated text will appear here..."
            className="w-full h-96 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
          />
        </div>

        {/* Statistics */}
        <div>
          <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-gray-100">Statistics</h3>
          <div className="space-y-3">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.words}</div>
              <div className="text-sm text-blue-800 dark:text-blue-200">Words</div>
            </div>
            
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.sentences}</div>
              <div className="text-sm text-green-800 dark:text-green-200">Sentences</div>
            </div>
            
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.paragraphs}</div>
              <div className="text-sm text-purple-800 dark:text-purple-200">Paragraphs</div>
            </div>
            
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.characters}</div>
              <div className="text-sm text-yellow-800 dark:text-yellow-200">Characters</div>
            </div>
            
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.charactersNoSpaces}</div>
              <div className="text-sm text-red-800 dark:text-red-200">No Spaces</div>
            </div>
          </div>

          <button
            onClick={clearAll}
            className="w-full mt-4 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
          >
            Clear Text
          </button>
        </div>
      </div>

      <div className="mt-8 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
        <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Lorem Ipsum Tips</h3>
        <div className="text-purple-800 dark:text-purple-200 text-sm space-y-1">
          <p><strong>Classic Lorem:</strong> Traditional placeholder text used since the 1500s</p>
          <p><strong>Custom Phrases:</strong> Themed placeholder text for specific contexts</p>
          <p><strong>Use Cases:</strong> Website mockups, app prototypes, design testing</p>
          <p><strong>Best Practice:</strong> Use realistic text lengths for accurate layout testing</p>
        </div>
      </div>
    </div>
  );
}
