'use client';

import React, { useState, useEffect } from 'react';
import { testRegex, getRegexFlags, getCommonRegexPatterns, RegexTestResult, RegexMatch } from '@/lib/regex-utils';

export default function RegexTool() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testText, setTestText] = useState('');
  const [result, setResult] = useState<RegexTestResult | null>(null);
  const [highlightedText, setHighlightedText] = useState('');
  const [copySuccess, setCopySuccess] = useState<string>('');

  const availableFlags = getRegexFlags();
  const commonPatterns = getCommonRegexPatterns();

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(type);
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  useEffect(() => {
    if (pattern && testText) {
      const testResult = testRegex(pattern, flags, testText);
      setResult(testResult);
      
      if (testResult.isValid && testResult.matches.length > 0) {
        const highlighted = highlightMatches(testText, testResult.matches);
        setHighlightedText(highlighted);
      } else {
        setHighlightedText(testText);
      }
    } else {
      setResult(null);
      setHighlightedText(testText);
    }
  }, [pattern, flags, testText]);

  const highlightMatches = (text: string, matches: RegexMatch[]): string => {
    let highlighted = text;
    let offset = 0;

    matches.forEach((match) => {
      const start = match.start + offset;
      const end = match.end + offset;
      const before = highlighted.substring(0, start);
      const matchText = highlighted.substring(start, end);
      const after = highlighted.substring(end);
      
      highlighted = before + `<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">${matchText}</mark>` + after;
      offset += '<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded"></mark>'.length;
    });

    return highlighted;
  };

  const toggleFlag = (flag: string) => {
    if (flags.includes(flag)) {
      setFlags(flags.replace(flag, ''));
    } else {
      setFlags(flags + flag);
    }
  };

  const loadPattern = (pattern: string) => {
    setPattern(pattern);
  };

  const clearAll = () => {
    setPattern('');
    setFlags('g');
    setTestText('');
    setResult(null);
    setHighlightedText('');
    setCopySuccess('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 text-black dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">Regex Tester</h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
        Test and debug regular expressions with real-time highlighting and detailed match information.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Pattern Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Regular Expression
          </label>
          <div className="relative">
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="Enter regex pattern..."
              className="w-full px-3 py-2 pr-8 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-gray-400 focus:border-transparent font-mono bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
            <span className="absolute right-3 top-2.5 text-gray-400 dark:text-gray-500 font-mono">/</span>
          </div>
          
          {/* Flags */}
          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Flags</label>
            <div className="flex flex-wrap gap-2">
              {availableFlags.map((flagInfo) => (
                <button
                  key={flagInfo.flag}
                  onClick={() => toggleFlag(flagInfo.flag)}
                  className={`px-3 py-1 rounded text-sm font-mono transition-colors ${
                    flags.includes(flagInfo.flag)
                      ? 'bg-black dark:bg-gray-700 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  title={flagInfo.description}
                >
                  {flagInfo.flag}
                </button>
              ))}
            </div>
          </div>

          {/* Common Patterns */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Common Patterns</label>
            <div className="space-y-2">
              {commonPatterns.map((commonPattern) => (
                <div
                  key={commonPattern.name}
                  className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                  onClick={() => loadPattern(commonPattern.pattern)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100">{commonPattern.name}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{commonPattern.description}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        loadPattern(commonPattern.pattern);
                      }}
                      className="px-2 py-1 bg-black dark:bg-gray-700 text-white text-xs rounded hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
                    >
                      Use
                    </button>
                  </div>
                  <p className="font-mono text-xs text-gray-700 dark:text-gray-300 mt-2 bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-600">
                    {commonPattern.pattern}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Test Text and Results */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Test Text
            </label>
            {testText && (
              <button
                onClick={() => copyToClipboard(testText, 'testText')}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  copySuccess === 'testText'
                    ? 'bg-green-600 text-white'
                    : 'bg-black dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600'
                }`}
              >
                {copySuccess === 'testText' ? 'Copied!' : 'Copy'}
              </button>
            )}
          </div>
          <textarea
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            placeholder="Enter text to test against the regex..."
            className="w-full h-64 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-gray-400 focus:border-transparent font-mono text-sm resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />

          {/* Results */}
          {result && (
            <div className="mt-4">
              <div className={`p-3 rounded-lg mb-4 ${
                result.isValid
                  ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
              }`}>
                <p className={`font-medium ${
                  result.isValid 
                    ? 'text-green-900 dark:text-green-100' 
                    : 'text-red-900 dark:text-red-100'
                }`}>
                  {result.isValid ? '✅ Valid Regex' : '❌ Invalid Regex'}
                </p>
                {result.error && (
                  <p className="text-red-800 dark:text-red-200 text-sm mt-1">{result.error}</p>
                )}
              </div>

              {result.isValid && (
                <>
                  {/* Highlighted Text */}
                  {highlightedText && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-sm mb-2 text-gray-900 dark:text-gray-100">Highlighted Matches</h3>
                        <button
                          onClick={() => copyToClipboard(testText, 'highlighted')}
                          className={`px-3 py-1 text-xs rounded transition-colors ${
                            copySuccess === 'highlighted'
                              ? 'bg-green-600 text-white'
                              : 'bg-black dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600'
                          }`}
                        >
                          {copySuccess === 'highlighted' ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                      <div 
                        className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 font-mono text-sm whitespace-pre-wrap break-words text-gray-900 dark:text-gray-100"
                        dangerouslySetInnerHTML={{ __html: highlightedText }}
                      />
                    </div>
                  )}

                  {/* Match Details */}
                  {result.matches.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-sm mb-2 text-gray-900 dark:text-gray-100">
                        Matches ({result.matches.length})
                      </h3>
                      <div className="max-h-64 overflow-y-auto space-y-2">
                        {result.matches.map((match, index) => (
                          <div
                            key={index}
                            className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-mono text-sm font-semibold text-gray-900 dark:text-gray-100">
                                Match {index + 1}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  Position {match.start}-{match.end}
                                </span>
                                <button
                                  onClick={() => copyToClipboard(match.match, `match-${index}`)}
                                  className={`px-2 py-1 text-xs rounded transition-colors ${
                                    copySuccess === `match-${index}`
                                      ? 'bg-green-600 text-white'
                                      : 'bg-black dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600'
                                  }`}
                                >
                                  {copySuccess === `match-${index}` ? 'Copied!' : 'Copy'}
                                </button>
                              </div>
                            </div>
                            <p className="font-mono text-sm bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-600 break-all text-gray-900 dark:text-gray-100">
                              {match.match}
                            </p>
                            {match.groups && match.groups.length > 0 && (
                              <div className="mt-2">
                                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Groups:</p>
                                <div className="space-y-1">
                                  {match.groups.map((group, groupIndex) => (
                                    <div
                                      key={groupIndex}
                                      className="flex items-center gap-2 text-xs"
                                    >
                                      <span className="font-mono bg-gray-200 dark:bg-gray-600 px-1 rounded text-gray-700 dark:text-gray-300">
                                        ${groupIndex + 1}
                                      </span>
                                      <span className="font-mono bg-white dark:bg-gray-800 px-2 py-1 rounded border border-gray-200 dark:border-gray-600 break-all text-gray-900 dark:text-gray-100">
                                        {group || '(empty)'}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.matches.length === 0 && (
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <p className="text-yellow-800 dark:text-yellow-200 text-sm">No matches found</p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center mb-8">
        <button
          onClick={clearAll}
          className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
        >
          Clear All
        </button>
        {pattern && (
          <button
            onClick={() => copyToClipboard(`/${pattern}/${flags}`, 'fullRegex')}
            className={`px-6 py-2 rounded-lg transition-colors font-medium ${
              copySuccess === 'fullRegex'
                ? 'bg-green-600 text-white'
                : 'bg-black dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600'
            }`}
          >
            {copySuccess === 'fullRegex' ? 'Copied!' : 'Copy Full Regex'}
          </button>
        )}
      </div>

      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Regex Tips</h3>
        <div className="text-blue-800 dark:text-blue-200 text-sm space-y-1">
          <p><strong>Flags:</strong> g (global), i (case-insensitive), m (multiline), s (dotall), u (unicode), y (sticky)</p>
          <p><strong>Anchors:</strong> ^ (start), $ (end), \b (word boundary), \B (non-word boundary)</p>
          <p><strong>Character Classes:</strong> \d (digit), \w (word), \s (whitespace), . (any character)</p>
          <p><strong>Quantifiers:</strong> * (0+), + (1+), ? (0-1), {'{n}'} (exact), {'{n,}'} (n+), {'{n,m}'} (n-m)</p>
        </div>
      </div>
    </div>
  );
}
