'use client';

import React, { useState, useEffect } from 'react';
import { 
  generatePassword, 
  calculatePasswordStrength, 
  getPasswordStrengthColor,
  getPasswordStrengthTextColor,
  PasswordOptions,
  PasswordStrength 
} from '@/lib/password-utils';

export default function PasswordTool() {
  const [password, setPassword] = useState('');
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: false,
    excludeAmbiguous: false
  });
  const [strength, setStrength] = useState<PasswordStrength | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [generatedCount, setGeneratedCount] = useState(0);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const generateNewPassword = () => {
    const newPassword = generatePassword(options);
    setPassword(newPassword);
    setGeneratedCount(prev => prev + 1);
  };

  const updateOption = (key: keyof PasswordOptions, value: boolean | number) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    generateNewPassword();
  }, []);

  useEffect(() => {
    if (password) {
      setStrength(calculatePasswordStrength(password));
    }
  }, [password]);

  const getPasswordLevelText = (level: PasswordStrength['level']) => {
    switch (level) {
      case 'weak': return 'Weak';
      case 'fair': return 'Fair';
      case 'good': return 'Good';
      case 'strong': return 'Strong';
      case 'very-strong': return 'Very Strong';
      default: return 'Unknown';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:px-8 md:py-8 text-black dark:text-gray-100">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center text-gray-900 dark:text-gray-100">
        Password Generator
      </h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-6 md:mb-8 text-sm md:text-base max-w-2xl mx-auto">
        Generate secure passwords with entropy analysis and strength assessment.
      </p>

      {/* Generated Password Display */}
      <div className="mb-6 md:mb-8">
        <div className="relative">
          <div className="p-3 md:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600">
            <div className="font-mono text-sm md:text-lg break-all pr-16 md:pr-20 text-gray-900 dark:text-gray-100 min-h-[2.5rem] flex items-center">
              {password || 'Click generate to create password'}
            </div>
            <button
              onClick={copyToClipboard}
              disabled={!password}
              className={`absolute top-2 md:top-4 right-2 md:right-4 px-2 md:px-4 py-1 md:py-2 rounded-lg transition-colors font-medium text-xs md:text-sm ${
                copySuccess
                  ? 'bg-green-600 text-white'
                  : password
                    ? 'bg-black dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600'
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }`}
            >
              {copySuccess ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Strength Indicator */}
        {strength && (
          <div className="mt-3 md:mt-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Password Strength
              </span>
              <span className={`text-sm font-medium ${getPasswordStrengthTextColor(strength.level)}`}>
                {getPasswordLevelText(strength.level)} ({strength.score}/100)
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(strength.level)}`}
                style={{ width: `${strength.score}%` }}
              />
            </div>
            <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 break-words">
              Entropy: {strength.entropy} bits • Estimated crack time: {strength.crackTime}
            </div>
          </div>
        )}
      </div>

      {/* Password Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
        {/* Length Slider */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Password Length: {options.length}
          </label>
          <input
            type="range"
            min="4"
            max="64"
            value={options.length}
            onChange={(e) => updateOption('length', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>4</span>
            <span>16</span>
            <span>32</span>
            <span>48</span>
            <span>64</span>
          </div>
        </div>

        {/* Character Options */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Character Types</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={options.includeLowercase}
                onChange={(e) => updateOption('includeLowercase', e.target.checked)}
                className="w-4 h-4 text-black dark:text-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-black dark:focus:ring-gray-400 bg-white dark:bg-gray-800"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Lowercase (a-z)</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={options.includeUppercase}
                onChange={(e) => updateOption('includeUppercase', e.target.checked)}
                className="w-4 h-4 text-black dark:text-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-black dark:focus:ring-gray-400 bg-white dark:bg-gray-800"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Uppercase (A-Z)</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={options.includeNumbers}
                onChange={(e) => updateOption('includeNumbers', e.target.checked)}
                className="w-4 h-4 text-black dark:text-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-black dark:focus:ring-gray-400 bg-white dark:bg-gray-800"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Numbers (0-9)</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={options.includeSymbols}
                onChange={(e) => updateOption('includeSymbols', e.target.checked)}
                className="w-4 h-4 text-black dark:text-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-black dark:focus:ring-gray-400 bg-white dark:bg-gray-800"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Symbols (!@#$%^&*...)</span>
            </label>
          </div>
        </div>

        {/* Exclusion Options */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Exclude Characters</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={options.excludeSimilar}
                onChange={(e) => updateOption('excludeSimilar', e.target.checked)}
                className="w-4 h-4 text-black dark:text-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-black dark:focus:ring-gray-400 bg-white dark:bg-gray-800"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Similar (ilLoO01)</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={options.excludeAmbiguous}
                onChange={(e) => updateOption('excludeAmbiguous', e.target.checked)}
                className="w-4 h-4 text-black dark:text-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-black dark:focus:ring-gray-400 bg-white dark:bg-gray-800"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Ambiguous ({}[]()/\'"`~)</span>
            </label>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center mb-8">
        <button
          onClick={generateNewPassword}
          className="px-6 py-2 bg-black dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors font-medium"
        >
          Generate Password
        </button>
        <button
          onClick={() => {
            setOptions({
              length: 16,
              includeUppercase: true,
              includeLowercase: true,
              includeNumbers: true,
              includeSymbols: true,
              excludeSimilar: false,
              excludeAmbiguous: false
            });
          }}
          className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
        >
          Reset Options
        </button>
      </div>

      {/* Feedback and Tips */}
      {strength && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strength Feedback */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Strength Analysis</h3>
            <ul className="text-blue-800 dark:text-blue-200 text-sm space-y-1">
              {strength.feedback.map((feedback, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">{feedback.includes('Strong') ? '✅' : '⚠️'}</span>
                  <span>{feedback}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Statistics */}
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">Password Statistics</h3>
            <div className="text-green-800 dark:text-green-200 text-sm space-y-1">
              <p><strong>Length:</strong> {password.length} characters</p>
              <p><strong>Entropy:</strong> {strength.entropy} bits</p>
              <p><strong>Strength Score:</strong> {strength.score}/100</p>
              <p><strong>Generated:</strong> {generatedCount} password{generatedCount !== 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">Security Tips</h3>
        <div className="text-yellow-800 dark:text-yellow-200 text-sm space-y-1">
          <p><strong>Length Matters:</strong> Each additional character exponentially increases security</p>
          <p><strong>Character Diversity:</strong> Mix uppercase, lowercase, numbers, and symbols</p>
          <p><strong>Avoid Patterns:</strong> Don't use dictionary words, keyboard patterns, or personal info</p>
          <p><strong>Unique Per Service:</strong> Use different passwords for each account</p>
        </div>
      </div>
    </div>
  );
}
