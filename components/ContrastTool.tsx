'use client';

import React, { useState, useEffect } from 'react';
import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  analyzeContrast,
  suggestImprovements,
  getRandomColor,
  getComplementaryColor,
  getAnalogousColors,
  getTriadicColors,
  ColorResult,
  ContrastResult
} from '@/lib/contrast-utils';

export default function ContrastTool() {
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [foregroundResult, setForegroundResult] = useState<ColorResult | null>(null);
  const [backgroundResult, setBackgroundResult] = useState<ColorResult | null>(null);
  const [contrastResult, setContrastResult] = useState<ContrastResult | null>(null);
  const [copySuccess, setCopySuccess] = useState<string>('');
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(type);
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const parseColor = (color: string): ColorResult | null => {
    // Handle hex colors
    if (color.startsWith('#')) {
      const rgb = hexToRgb(color);
      if (!rgb) return null;
      return {
        hex: color,
        rgb,
        hsl: rgbToHsl(rgb.r, rgb.g, rgb.b)
      };
    }
    
    // Handle rgb colors
    const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1]);
      const g = parseInt(rgbMatch[2]);
      const b = parseInt(rgbMatch[3]);
      return {
        hex: rgbToHex(r, g, b),
        rgb: { r, g, b },
        hsl: rgbToHsl(r, g, b)
      };
    }
    
    return null;
  };

  useEffect(() => {
    const fg = parseColor(foregroundColor);
    const bg = parseColor(backgroundColor);
    
    if (fg && bg) {
      setForegroundResult(fg);
      setBackgroundResult(bg);
      setContrastResult(analyzeContrast(fg, bg));
    } else {
      setForegroundResult(null);
      setBackgroundResult(null);
      setContrastResult(null);
    }
  }, [foregroundColor, backgroundColor]);

  const swapColors = () => {
    setForegroundColor(backgroundColor);
    setBackgroundColor(foregroundColor);
  };

  const randomizeColors = () => {
    const fg = getRandomColor();
    const bg = getRandomColor();
    setForegroundColor(fg.hex);
    setBackgroundColor(bg.hex);
  };

  const applySuggestion = (color: ColorResult, isForeground: boolean) => {
    if (isForeground) {
      setForegroundColor(color.hex);
    } else {
      setBackgroundColor(color.hex);
    }
  };

  const getContrastRatioColor = (ratio: number): string => {
    if (ratio >= 7) return 'text-green-600 dark:text-green-400';
    if (ratio >= 4.5) return 'text-blue-600 dark:text-blue-400';
    if (ratio >= 3) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getContrastBadgeColor = (grade: string): string => {
    switch (grade) {
      case 'AAA': return 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200';
      case 'AA': return 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200';
      default: return 'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200';
    }
  };

  const suggestions = foregroundResult && backgroundResult 
    ? suggestImprovements(foregroundResult, backgroundResult)
    : null;

  const complementary = foregroundResult ? getComplementaryColor(foregroundResult) : null;
  const analogous = foregroundResult ? getAnalogousColors(foregroundResult) : null;
  const triadic = foregroundResult ? getTriadicColors(foregroundResult) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:px-8 md:py-8 text-black dark:text-gray-100">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center text-gray-900 dark:text-gray-100">
        WCAG Color Contrast Checker
      </h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-6 md:mb-8 text-sm md:text-base max-w-2xl mx-auto">
        Check color contrast ratios for WCAG compliance and get accessibility recommendations.
      </p>

      {/* Color Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600">
          <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-gray-100">Foreground Color</h3>
          
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="color"
                value={foregroundColor}
                onChange={(e) => setForegroundColor(e.target.value)}
                className="w-16 h-10 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
              />
              <input
                type="text"
                value={foregroundColor}
                onChange={(e) => setForegroundColor(e.target.value)}
                placeholder="#000000"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            {foregroundResult && (
              <div className="text-sm space-y-1">
                <div>RGB: {foregroundResult.rgb.r}, {foregroundResult.rgb.g}, {foregroundResult.rgb.b}</div>
                <div>HSL: {foregroundResult.hsl.h}°, {foregroundResult.hsl.s}%, {foregroundResult.hsl.l}%</div>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600">
          <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-gray-100">Background Color</h3>
          
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="w-16 h-10 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
              />
              <input
                type="text"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                placeholder="#FFFFFF"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            {backgroundResult && (
              <div className="text-sm space-y-1">
                <div>RGB: {backgroundResult.rgb.r}, {backgroundResult.rgb.g}, {backgroundResult.rgb.b}</div>
                <div>HSL: {backgroundResult.hsl.h}°, {backgroundResult.hsl.s}%, {backgroundResult.hsl.l}%</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center mb-8">
        <button
          onClick={swapColors}
          className="px-6 py-2 bg-black dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors font-medium"
        >
          Swap Colors
        </button>
        <button
          onClick={randomizeColors}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Random Colors
        </button>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-700 dark:text-gray-300">Text Size:</label>
          <select
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value as 'normal' | 'large')}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="normal">Normal (14px+)</option>
            <option value="large">Large (18px+)</option>
          </select>
        </div>
      </div>

      {/* Contrast Results */}
      {contrastResult && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600">
            <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-gray-100">Contrast Analysis</h3>
            
            <div className="space-y-4">
              <div className="text-center">
                <div className={`text-4xl font-bold ${getContrastRatioColor(contrastResult.ratio)}`}>
                  {contrastResult.ratio.toFixed(2)}:1
                </div>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${getContrastBadgeColor(contrastResult.grade)}`}>
                  {contrastResult.grade}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">WCAG Compliance</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="font-medium text-gray-700 dark:text-gray-300">AA Level</div>
                    <div className="text-sm">
                      <div className={`flex items-center gap-2 ${contrastResult.level.AA[fontSize === 'large' ? 'large' : 'normal'] ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        <span>{contrastResult.level.AA[fontSize === 'large' ? 'large' : 'normal'] ? '✓' : '✗'}</span>
                        <span>{fontSize === 'large' ? 'Large' : 'Normal'} Text</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="font-medium text-gray-700 dark:text-gray-300">AAA Level</div>
                    <div className="text-sm">
                      <div className={`flex items-center gap-2 ${contrastResult.level.AAA[fontSize === 'large' ? 'large' : 'normal'] ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        <span>{contrastResult.level.AAA[fontSize === 'large' ? 'large' : 'normal'] ? '✓' : '✗'}</span>
                        <span>{fontSize === 'large' ? 'Large' : 'Normal'} Text</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => copyToClipboard(`Contrast Ratio: ${contrastResult.ratio.toFixed(2)}:1`, 'ratio')}
                className={`w-full px-4 py-2 rounded-lg transition-colors font-medium ${
                  copySuccess === 'ratio'
                    ? 'bg-green-600 text-white'
                    : 'border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {copySuccess === 'ratio' ? 'Copied!' : 'Copy Ratio'}
              </button>
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600">
            <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-gray-100">Live Preview</h3>
            
            <div 
              className="p-8 rounded-lg mb-4"
              style={{ backgroundColor: backgroundColor }}
            >
              <p 
                style={{ color: foregroundColor }}
                className={fontSize === 'large' ? 'text-2xl' : 'text-base'}
              >
                The quick brown fox jumps over the lazy dog.
              </p>
              <p 
                style={{ color: foregroundColor }}
                className={`mt-2 ${fontSize === 'large' ? 'text-2xl' : 'text-base'}`}
              >
                PACK MY BOX WITH FIVE DOZEN LIQUOR JUGS.
              </p>
              <p 
                style={{ color: foregroundColor }}
                className={`mt-2 ${fontSize === 'large' ? 'text-2xl' : 'text-base'}`}
              >
                1234567890 !@#$%^&amp;*()_+-=[]{}|;:,.&lt;&gt;?
              </p>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p>• Normal text: 14px+ (or 18px+ bold)</p>
              <p>• Large text: 18px+ (or 14px+ bold)</p>
              <p>• AA: 4.5:1 (normal), 3:1 (large)</p>
              <p>• AAA: 7:1 (normal), 4.5:1 (large)</p>
            </div>
          </div>
        </div>
      )}

      {/* Color Suggestions */}
      {suggestions && (
        <div className="mb-8">
          <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-gray-100">Improvement Suggestions</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600">
              <h4 className="font-medium mb-3 text-gray-900 dark:text-gray-100">Foreground Variations</h4>
              <div className="grid grid-cols-4 gap-2">
                {suggestions.foreground.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => applySuggestion(color, true)}
                    className="h-12 rounded border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                    style={{ backgroundColor: color.hex }}
                    title={color.hex}
                  />
                ))}
              </div>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600">
              <h4 className="font-medium mb-3 text-gray-900 dark:text-gray-100">Background Variations</h4>
              <div className="grid grid-cols-4 gap-2">
                {suggestions.background.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => applySuggestion(color, false)}
                    className="h-12 rounded border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                    style={{ backgroundColor: color.hex }}
                    title={color.hex}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Color Harmony */}
      {foregroundResult && (
        <div className="mb-8">
          <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-gray-100">Color Harmony</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {complementary && (
              <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600">
                <h4 className="font-medium mb-3 text-gray-900 dark:text-gray-100">Complementary</h4>
                <button
                  onClick={() => setForegroundColor(complementary.hex)}
                  className="w-full h-20 rounded border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-colors mb-2"
                  style={{ backgroundColor: complementary.hex }}
                />
                <div className="text-sm text-center text-gray-600 dark:text-gray-400">
                  {complementary.hex}
                </div>
              </div>
            )}

            {analogous && analogous.length > 0 && (
              <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600">
                <h4 className="font-medium mb-3 text-gray-900 dark:text-gray-100">Analogous</h4>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {analogous.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => setForegroundColor(color.hex)}
                      className="h-20 rounded border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                      style={{ backgroundColor: color.hex }}
                      title={color.hex}
                    />
                  ))}
                </div>
              </div>
            )}

            {triadic && triadic.length > 0 && (
              <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600">
                <h4 className="font-medium mb-3 text-gray-900 dark:text-gray-100">Triadic</h4>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {triadic.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => setForegroundColor(color.hex)}
                      className="h-20 rounded border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                      style={{ backgroundColor: color.hex }}
                      title={color.hex}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">WCAG Guidelines</h3>
        <div className="text-blue-800 dark:text-blue-200 text-sm space-y-1">
          <p><strong>AA Level:</strong> Minimum compliance for most websites (4.5:1 normal, 3:1 large)</p>
          <p><strong>AAA Level:</strong> Enhanced compliance for better accessibility (7:1 normal, 4.5:1 large)</p>
          <p><strong>Text Size:</strong> Large text is 18px+ (or 14px+ bold), normal text is 14px+</p>
          <p><strong>Best Practice:</strong> Aim for AAA compliance when possible for maximum accessibility</p>
        </div>
      </div>
    </div>
  );
}
