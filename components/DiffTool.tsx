'use client';

import React, { useState, useEffect } from 'react';
import { diffLines, diffChars } from 'diff';

export interface DiffResult {
  added: string;
  removed: string;
  unchanged: string;
}

export default function DiffTool() {
  const [leftText, setLeftText] = useState('');
  const [rightText, setRightText] = useState('');
  const [diffMode, setDiffMode] = useState<'lines' | 'chars'>('lines');
  const [diffResult, setDiffResult] = useState<DiffResult | null>(null);
  const [copySuccess, setCopySuccess] = useState<string>('');
  const [stats, setStats] = useState({
    added: 0,
    removed: 0,
    unchanged: 0,
    total: 0
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

  const calculateDiff = () => {
    if (!leftText && !rightText) {
      setDiffResult(null);
      setStats({ added: 0, removed: 0, unchanged: 0, total: 0 });
      return;
    }

    let diff;
    if (diffMode === 'lines') {
      diff = diffLines(leftText, rightText);
    } else {
      diff = diffChars(leftText, rightText);
    }

    let added = '';
    let removed = '';
    let unchanged = '';
    let addedCount = 0;
    let removedCount = 0;
    let unchangedCount = 0;

    diff.forEach(part => {
      if (part.added) {
        added += part.value;
        addedCount += diffMode === 'lines' ? 1 : part.value.length;
      } else if (part.removed) {
        removed += part.value;
        removedCount += diffMode === 'lines' ? 1 : part.value.length;
      } else {
        unchanged += part.value;
        unchangedCount += diffMode === 'lines' ? 1 : part.value.length;
      }
    });

    setDiffResult({ added, removed, unchanged });
    setStats({
      added: addedCount,
      removed: removedCount,
      unchanged: unchangedCount,
      total: addedCount + removedCount + unchangedCount
    });
  };

  useEffect(() => {
    calculateDiff();
  }, [leftText, rightText, diffMode]);

  const clearAll = () => {
    setLeftText('');
    setRightText('');
    setDiffResult(null);
    setStats({ added: 0, removed: 0, unchanged: 0, total: 0 });
    setCopySuccess('');
  };

  const loadSampleText = () => {
    setLeftText(`function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}

const products = [
  { name: 'Laptop', price: 999 },
  { name: 'Mouse', price: 25 },
  { name: 'Keyboard', price: 75 }
];

console.log(calculateTotal(products));`);

    setRightText(`function calculateTotal(items) {
  let total = 0;
  return items.reduce((sum, item) => sum + item.price, 0);
}

const products = [
  { name: 'Laptop', price: 999 },
  { name: 'Mouse', price: 25 },
  { name: 'Keyboard', price: 75 },
  { name: 'Monitor', price: 299 }
];

console.log(\`Total: $\${calculateTotal(products)}\`);
console.log('Items count:', products.length);`);
  };

  const renderDiff = () => {
    if (!diffResult) return null;

    const parts = [];
    let leftIndex = 0;
    let rightIndex = 0;

    if (diffMode === 'lines') {
      const leftLines = leftText.split('\n');
      const rightLines = rightText.split('\n');
      
      const diff = diffLines(leftText, rightText);
      let leftLineNum = 1;
      let rightLineNum = 1;

      return (
        <div className="font-mono text-sm">
          <div className="grid grid-cols-12 gap-0 border-t border-l border-r border-gray-300 dark:border-gray-600">
            <div className="col-span-1 p-2 bg-gray-100 dark:bg-gray-700 border-r border-gray-300 dark:border-gray-600 text-center text-gray-600 dark:text-gray-400 text-xs">
              Line
            </div>
            <div className="col-span-5 p-2 bg-gray-100 dark:bg-gray-700 border-r border-gray-300 dark:border-gray-600 text-center text-gray-600 dark:text-gray-400 text-xs">
              Original
            </div>
            <div className="col-span-1 p-2 bg-gray-100 dark:bg-gray-700 border-r border-gray-300 dark:border-gray-600 text-center text-gray-600 dark:text-gray-400 text-xs">
              Line
            </div>
            <div className="col-span-5 p-2 bg-gray-100 dark:bg-gray-700 text-center text-gray-600 dark:text-gray-400 text-xs">
              Modified
            </div>
          </div>

          {diff.map((part, index) => {
            const lines = part.value.split('\n').filter(line => line !== '');
            const isLastEmpty = part.value.endsWith('\n');
            
            if (part.removed) {
              return lines.map((line, lineIndex) => (
                <div key={`removed-${index}-${lineIndex}`} className="grid grid-cols-12 gap-0 border-l border-r border-gray-300 dark:border-gray-600">
                  <div className="col-span-1 p-2 bg-red-50 dark:bg-red-900/20 border-r border-gray-300 dark:border-gray-600 text-center text-red-600 dark:text-red-400 text-xs">
                    {leftLineNum++}
                  </div>
                  <div className="col-span-5 p-2 bg-red-50 dark:bg-red-900/20 border-r border-gray-300 dark:border-gray-600 text-red-800 dark:text-red-200">
                    {line}
                  </div>
                  <div className="col-span-1 p-2 bg-gray-50 dark:bg-gray-800 border-r border-gray-300 dark:border-gray-600"></div>
                  <div className="col-span-5 p-2 bg-gray-50 dark:bg-gray-800"></div>
                </div>
              ));
            } else if (part.added) {
              return lines.map((line, lineIndex) => (
                <div key={`added-${index}-${lineIndex}`} className="grid grid-cols-12 gap-0 border-l border-r border-gray-300 dark:border-gray-600">
                  <div className="col-span-1 p-2 bg-gray-50 dark:bg-gray-800 border-r border-gray-300 dark:border-gray-600"></div>
                  <div className="col-span-5 p-2 bg-gray-50 dark:bg-gray-800 border-r border-gray-300 dark:border-gray-600"></div>
                  <div className="col-span-1 p-2 bg-green-50 dark:bg-green-900/20 border-r border-gray-300 dark:border-gray-600 text-center text-green-600 dark:text-green-400 text-xs">
                    {rightLineNum++}
                  </div>
                  <div className="col-span-5 p-2 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200">
                    {line}
                  </div>
                </div>
              ));
            } else {
              return lines.map((line, lineIndex) => (
                <div key={`unchanged-${index}-${lineIndex}`} className="grid grid-cols-12 gap-0 border-l border-r border-gray-300 dark:border-gray-600">
                  <div className="col-span-1 p-2 bg-white dark:bg-gray-800 border-r border-gray-300 dark:border-gray-600 text-center text-gray-500 dark:text-gray-400 text-xs">
                    {leftLineNum++}
                  </div>
                  <div className="col-span-5 p-2 bg-white dark:bg-gray-800 border-r border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                    {line}
                  </div>
                  <div className="col-span-1 p-2 bg-white dark:bg-gray-800 border-r border-gray-300 dark:border-gray-600 text-center text-gray-500 dark:text-gray-400 text-xs">
                    {rightLineNum++}
                  </div>
                  <div className="col-span-5 p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                    {line}
                  </div>
                </div>
              ));
            }
          })}
        </div>
      );
    } else {
      // Character diff mode
      const diff = diffChars(leftText, rightText);
      let leftContent = '';
      let rightContent = '';

      return (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-sm mb-2 text-gray-900 dark:text-gray-100">Original</h3>
            <div className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 font-mono text-sm max-h-96 overflow-auto">
              {diff.map((part, index) => {
                if (part.removed) {
                  return <span key={index} className="bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200">{part.value}</span>;
                } else if (!part.added) {
                  return <span key={index}>{part.value}</span>;
                }
                return null;
              })}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-2 text-gray-900 dark:text-gray-100">Modified</h3>
            <div className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 font-mono text-sm max-h-96 overflow-auto">
              {diff.map((part, index) => {
                if (part.added) {
                  return <span key={index} className="bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200">{part.value}</span>;
                } else if (!part.removed) {
                  return <span key={index}>{part.value}</span>;
                }
                return null;
              })}
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 text-black dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">Diff Viewer</h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
        Compare text and code with visual highlighting of additions, deletions, and changes.
      </p>

      {/* Diff Mode Selector */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        <button
          onClick={() => setDiffMode('lines')}
          className={`px-4 py-2 rounded-lg transition-colors font-medium ${
            diffMode === 'lines'
              ? 'bg-black dark:bg-gray-700 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Line Diff
        </button>
        <button
          onClick={() => setDiffMode('chars')}
          className={`px-4 py-2 rounded-lg transition-colors font-medium ${
            diffMode === 'chars'
              ? 'bg-black dark:bg-gray-700 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Character Diff
        </button>
      </div>

      {/* Text Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Original Text
            </label>
            {leftText && (
              <button
                onClick={() => copyToClipboard(leftText, 'left')}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  copySuccess === 'left'
                    ? 'bg-green-600 text-white'
                    : 'bg-black dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600'
                }`}
              >
                {copySuccess === 'left' ? 'Copied!' : 'Copy'}
              </button>
            )}
          </div>
          <textarea
            value={leftText}
            onChange={(e) => setLeftText(e.target.value)}
            placeholder="Enter original text here..."
            className="w-full h-64 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-gray-400 focus:border-transparent font-mono text-sm resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Modified Text
            </label>
            {rightText && (
              <button
                onClick={() => copyToClipboard(rightText, 'right')}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  copySuccess === 'right'
                    ? 'bg-green-600 text-white'
                    : 'bg-black dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600'
                }`}
              >
                {copySuccess === 'right' ? 'Copied!' : 'Copy'}
              </button>
            )}
          </div>
          <textarea
            value={rightText}
            onChange={(e) => setRightText(e.target.value)}
            placeholder="Enter modified text here..."
            className="w-full h-64 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-gray-400 focus:border-transparent font-mono text-sm resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      {/* Statistics */}
      {(leftText || rightText) && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.added}</div>
            <div className="text-sm text-green-800 dark:text-green-200">Added</div>
          </div>
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.removed}</div>
            <div className="text-sm text-red-800 dark:text-red-200">Removed</div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-center">
            <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">{stats.unchanged}</div>
            <div className="text-sm text-gray-800 dark:text-gray-200">Unchanged</div>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</div>
            <div className="text-sm text-blue-800 dark:text-blue-200">Total</div>
          </div>
        </div>
      )}

      {/* Diff Result */}
      {diffResult && (leftText || rightText) && (
        <div className="mb-8">
          <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-gray-100">Diff Result</h3>
          <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden max-h-96 overflow-auto">
            {renderDiff()}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={clearAll}
          className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
        >
          Clear All
        </button>
        <button
          onClick={loadSampleText}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Load Sample
        </button>
      </div>

      <div className="mt-8 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
        <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Diff Viewer Tips</h3>
        <div className="text-purple-800 dark:text-purple-200 text-sm space-y-1">
          <p><strong>Line Diff:</strong> Shows line-by-line differences with line numbers</p>
          <p><strong>Character Diff:</strong> Shows character-level differences side by side</p>
          <p><strong>Color Coding:</strong> Green = added, Red = removed, White = unchanged</p>
          <p><strong>Use Cases:</strong> Code reviews, document changes, version comparisons</p>
        </div>
      </div>
    </div>
  );
}
