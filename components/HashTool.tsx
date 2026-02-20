'use client';

import React, { useState } from 'react';
import { generateHash, getHashInfo, HashAlgorithm } from '@/lib/hash-utils';

export default function HashTool() {
  const [input, setInput] = useState('');
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>('SHA-256');
  const [hashes, setHashes] = useState<Record<HashAlgorithm, string>>({
    'SHA-256': '',
    'SHA-512': '',
    'SHA-1': '',
    'MD5': ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [copySuccess, setCopySuccess] = useState<string>('');

  const algorithms: HashAlgorithm[] = ['SHA-256', 'SHA-512', 'SHA-1', 'MD5'];

  const copyToClipboard = async (text: string, algo: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(algo);
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const generateAllHashes = async () => {
    if (!input.trim()) return;
    
    setIsGenerating(true);
    const newHashes: Record<HashAlgorithm, string> = { ...hashes };
    
    try {
      for (const algo of algorithms) {
        newHashes[algo] = await generateHash(input, algo);
      }
      setHashes(newHashes);
    } catch (error) {
      console.error('Error generating hashes:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateSingleHash = async (algo: HashAlgorithm) => {
    if (!input.trim()) return;
    
    setIsGenerating(true);
    try {
      const hash = await generateHash(input, algo);
      setHashes(prev => ({ ...prev, [algo]: hash }));
    } catch (error) {
      console.error(`Error generating ${algo} hash:`, error);
    } finally {
      setIsGenerating(false);
    }
  };

  const clearAll = () => {
    setInput('');
    setHashes({
      'SHA-256': '',
      'SHA-512': '',
      'SHA-1': '',
      'MD5': ''
    });
    setCopySuccess('');
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    // Clear hashes when input changes
    setHashes({
      'SHA-256': '',
      'SHA-512': '',
      'SHA-1': '',
      'MD5': ''
    });
    setCopySuccess('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 text-black dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">Hash Generator</h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
        Generate secure cryptographic hashes from your text. Supports SHA-256, SHA-512, SHA-1, and MD5 algorithms.
      </p>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Input Text
        </label>
        <textarea
          className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-gray-400 focus:border-transparent font-mono text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Enter text to hash..."
        />
      </div>

      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        <button
          onClick={generateAllHashes}
          disabled={!input.trim() || isGenerating}
          className="px-6 py-2 bg-black dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? 'Generating...' : 'Generate All Hashes'}
        </button>
        <button
          onClick={clearAll}
          className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
        >
          Clear
        </button>
      </div>

      <div className="space-y-6">
        {algorithms.map((algo) => {
          const info = getHashInfo(algo);
          const hash = hashes[algo];
          
          return (
            <div key={algo} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{info.name}</h3>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{info.bits} bits</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{info.useCase}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{info.description}</p>
                </div>
                <button
                  onClick={() => generateSingleHash(algo)}
                  disabled={!input.trim() || isGenerating}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed ml-4"
                >
                  Generate
                </button>
              </div>
              
              <div className="relative">
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <p className="font-mono text-sm break-all min-h-[2.5rem] flex items-center text-gray-900 dark:text-gray-100">
                    {hash || (
                      <span className="text-gray-400 dark:text-gray-500">
                        Hash will appear here...
                      </span>
                    )}
                  </p>
                </div>
                {hash && (
                  <button
                    onClick={() => copyToClipboard(hash, algo)}
                    className={`absolute top-2 right-2 px-3 py-1 text-xs rounded transition-colors ${
                      copySuccess === algo
                        ? 'bg-green-600 text-white'
                        : 'bg-black dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600'
                    }`}
                  >
                    {copySuccess === algo ? 'Copied!' : 'Copy'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">⚠️ Security Notice</h3>
        <div className="text-yellow-800 dark:text-yellow-200 text-sm space-y-2">
          <p>
            <strong>MD5 and SHA-1</strong> are considered cryptographically broken and should not be used for security purposes.
          </p>
          <p>
            <strong>SHA-256</strong> is the recommended choice for most applications requiring secure hashing.
          </p>
          <p>
            <strong>SHA-512</strong> provides additional security but may be slower than SHA-256.
          </p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">What is a Hash?</h3>
        <p className="text-blue-800 dark:text-blue-200 text-sm">
          A hash function is a mathematical algorithm that converts an input of any size into a fixed-size string of characters. 
          Hashes are one-way functions - you can generate a hash from data, but you cannot reverse the process to get the original data back.
        </p>
      </div>
    </div>
  );
}
