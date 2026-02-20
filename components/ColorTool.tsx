'use client';

import React, { useState, useEffect } from 'react';
import { parseColor, getContrastColor, getRandomColor, ColorValues } from '@/lib/color-utils';

export default function ColorTool() {
  const [colorInput, setColorInput] = useState('#3b82f6');
  const [color, setColor] = useState<ColorValues | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [copySuccess, setCopySuccess] = useState<string>('');

  useEffect(() => {
    const parsed = parseColor(colorInput);
    if (parsed) {
      setColor(parsed);
    }
  }, [colorInput]);

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(type);
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const addToHistory = (color: string) => {
    setHistory(prev => {
      const newHistory = [color, ...prev.filter(c => c !== color)].slice(0, 10);
      return newHistory;
    });
  };

  const handleColorChange = (value: string) => {
    setColorInput(value);
    addToHistory(value);
  };

  const handleHexChange = (value: string) => {
    if (value.startsWith('#') || /^[0-9a-f]{6}$/i.test(value)) {
      const hex = value.startsWith('#') ? value : '#' + value;
      handleColorChange(hex);
    }
  };

  const handleRgbChange = (channel: 'r' | 'g' | 'b', value: string) => {
    const num = parseInt(value) || 0;
    const clamped = Math.max(0, Math.min(255, num));
    
    if (color) {
      const newRgb = { ...color.rgb, [channel]: clamped };
      const hex = '#' + [newRgb.r, newRgb.g, newRgb.b].map(x => 
        x.toString(16).padStart(2, '0')
      ).join('');
      handleColorChange(hex);
    }
  };

  const handleHslChange = (channel: 'h' | 's' | 'l', value: string) => {
    const num = parseInt(value) || 0;
    const clamped = channel === 'h' 
      ? ((num % 360) + 360) % 360
      : Math.max(0, Math.min(100, num));
    
    if (color) {
      const newHsl = { ...color.hsl, [channel]: clamped };
      const rgb = { r: 0, g: 0, b: 0 }; // Will be calculated by parseColor
      const tempColor = { hex: '', rgb, hsl: newHsl };
      const hslString = `hsl(${newHsl.h}, ${newHsl.s}%, ${newHsl.l}%)`;
      const parsed = parseColor(hslString);
      if (parsed) {
        handleColorChange(parsed.hex);
      }
    }
  };

  const generateRandom = () => {
    const randomColor = getRandomColor();
    handleColorChange(randomColor);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 text-black dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">Color Picker & Converter</h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
        Pick colors and convert between HEX, RGB, and HSL formats with real-time preview.
      </p>

      {/* Color Display */}
      <div className="mb-8">
        <div 
          className="w-full h-32 rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-inner"
          style={{ backgroundColor: color?.hex || '#ffffff' }}
        >
          <div className="h-full flex items-center justify-center">
            {color && (
              <div className="text-center">
                <p 
                  className="text-2xl font-bold mb-1"
                  style={{ color: getContrastColor(color.rgb) }}
                >
                  {color.hex.toUpperCase()}
                </p>
                <p 
                  className="text-sm"
                  style={{ color: getContrastColor(color.rgb) }}
                >
                  RGB({color.rgb.r}, {color.rgb.g}, {color.rgb.b})
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* HEX Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">HEX</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={color?.hex || ''}
              onChange={(e) => handleHexChange(e.target.value)}
              placeholder="#000000"
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-gray-400 focus:border-transparent font-mono bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
            <button
              onClick={() => color && copyToClipboard(color.hex, 'hex')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                copySuccess === 'hex'
                  ? 'bg-green-600 text-white'
                  : 'bg-black dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600'
              }`}
            >
              {copySuccess === 'hex' ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* RGB Inputs */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">RGB</label>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">R</label>
              <input
                type="number"
                min="0"
                max="255"
                value={color?.rgb.r || ''}
                onChange={(e) => handleRgbChange('r', e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-gray-400 focus:border-transparent font-mono bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">G</label>
              <input
                type="number"
                min="0"
                max="255"
                value={color?.rgb.g || ''}
                onChange={(e) => handleRgbChange('g', e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-gray-400 focus:border-transparent font-mono bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">B</label>
              <input
                type="number"
                min="0"
                max="255"
                value={color?.rgb.b || ''}
                onChange={(e) => handleRgbChange('b', e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-gray-400 focus:border-transparent font-mono bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
            <button
              onClick={() => color && copyToClipboard(`rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`, 'rgb')}
              className={`px-4 py-2 rounded-lg transition-colors mt-5 ${
                copySuccess === 'rgb'
                  ? 'bg-green-600 text-white'
                  : 'bg-black dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600'
              }`}
            >
              {copySuccess === 'rgb' ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* HSL Inputs */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">HSL</label>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">H</label>
              <input
                type="number"
                min="0"
                max="360"
                value={color?.hsl.h || ''}
                onChange={(e) => handleHslChange('h', e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-gray-400 focus:border-transparent font-mono bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">S</label>
              <input
                type="number"
                min="0"
                max="100"
                value={color?.hsl.s || ''}
                onChange={(e) => handleHslChange('s', e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-gray-400 focus:border-transparent font-mono bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">L</label>
              <input
                type="number"
                min="0"
                max="100"
                value={color?.hsl.l || ''}
                onChange={(e) => handleHslChange('l', e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-gray-400 focus:border-transparent font-mono bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
            <button
              onClick={() => color && copyToClipboard(`hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`, 'hsl')}
              className={`px-4 py-2 rounded-lg transition-colors mt-5 ${
                copySuccess === 'hsl'
                  ? 'bg-green-600 text-white'
                  : 'bg-black dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600'
              }`}
            >
              {copySuccess === 'hsl' ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Random Color Generator */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Random Color</label>
          <button
            onClick={generateRandom}
            className="w-full px-4 py-2 bg-black dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
          >
            Generate Random Color
          </button>
        </div>
      </div>

      {/* Color History */}
      {history.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Recent Colors</h3>
          <div className="flex flex-wrap gap-2">
            {history.map((hex, index) => (
              <button
                key={index}
                onClick={() => handleColorChange(hex)}
                className="w-12 h-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:scale-110 transition-transform"
                style={{ backgroundColor: hex }}
                title={hex}
              />
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Color Formats</h3>
        <div className="text-blue-800 dark:text-blue-200 text-sm space-y-1">
          <p><strong>HEX:</strong> #RRGGBB - Web standard format</p>
          <p><strong>RGB:</strong> rgb(r, g, b) - Red, Green, Blue values (0-255)</p>
          <p><strong>HSL:</strong> hsl(h, s%, l%) - Hue, Saturation, Lightness</p>
        </div>
      </div>
    </div>
  );
}
