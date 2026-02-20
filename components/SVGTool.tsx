'use client';

import React, { useState, useRef, useEffect } from 'react';

export default function SVGTool() {
  const [svgCode, setSvgCode] = useState('');
  const [copySuccess, setCopySuccess] = useState<string>('');
  const [svgSize, setSvgSize] = useState({ width: 400, height: 400 });
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(type);
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const validateSVG = (code: string): boolean => {
    try {
      // Basic SVG validation
      const trimmed = code.trim();
      if (!trimmed) return false;
      
      // Check if it starts with <svg and ends with </svg>
      const lowerCode = trimmed.toLowerCase();
      return lowerCode.includes('<svg') && lowerCode.includes('</svg>');
    } catch {
      return false;
    }
  };

  const formatSVG = (code: string): string => {
    try {
      // Basic SVG formatting
      const trimmed = code.trim();
      const parser = new DOMParser();
      const doc = parser.parseFromString(trimmed, 'image/svg+xml');
      
      if (doc.querySelector('parsererror')) {
        return code; // Return original if parsing fails
      }
      
      // Re-serialize with proper formatting
      const serializer = new XMLSerializer();
      let formatted = serializer.serializeToString(doc);
      
      // Add proper indentation (basic)
      formatted = formatted
        .replace(/></g, '>\n<')
        .replace(/^(\s)+/gm, (match) => {
          const depth = Math.floor(match.length / 2);
          return '  '.repeat(depth);
        });
      
      return formatted;
    } catch {
      return code;
    }
  };

  const minifySVG = (code: string): string => {
    try {
      return code
        .replace(/>\s+</g, '><')
        .replace(/\s+/g, ' ')
        .replace(/^\s+|\s+$/g, '');
    } catch {
      return code;
    }
  };

  const optimizeSVG = (code: string): string => {
    try {
      let optimized = code;
      
      // Remove unnecessary attributes
      optimized = optimized.replace(/xmlns="http:\/\/www\.w3\.org\/2000\/svg"/g, '');
      
      // Remove default values
      optimized = optimized.replace(/fill="black"/g, '');
      optimized = optimized.replace(/stroke="black"/g, '');
      optimized = optimized.replace(/stroke-width="1"/g, '');
      
      // Remove empty attributes
      optimized = optimized.replace(/\s+\w+=""/g, '');
      
      // Optimize numbers
      optimized = optimized.replace(/\b0+(\.\d+)/g, '$1');
      optimized = optimized.replace(/(\d+)\.0+/g, '$1');
      
      return optimized;
    } catch {
      return code;
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setSvgCode(content);
        setError('');
      };
      reader.readAsText(file);
    } else {
      setError('Please upload a valid SVG file');
    }
  };

  const handleSVGCodeChange = (code: string) => {
    setSvgCode(code);
    if (code && !validateSVG(code)) {
      setError('Invalid SVG code');
    } else {
      setError('');
    }
  };

  const clearAll = () => {
    setSvgCode('');
    setError('');
    setCopySuccess('');
    setBackgroundColor('#ffffff');
    setSvgSize({ width: 400, height: 400 });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const loadSampleSVG = () => {
    setSvgCode(`<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="80" fill="#3b82f6" />
  <circle cx="100" cy="100" r="60" fill="#1e40af" />
  <circle cx="100" cy="100" r="40" fill="#1e3a8a" />
  <circle cx="100" cy="100" r="20" fill="#172554" />
</svg>`);
    setError('');
  };

  const downloadSVG = () => {
    if (!svgCode) return;
    
    const blob = new Blob([svgCode], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'image.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadPNG = async () => {
    if (!svgCode) return;
    
    try {
      const svgElement = document.createElement('div');
      svgElement.innerHTML = svgCode;
      const svg = svgElement.querySelector('svg');
      
      if (!svg) {
        setError('Invalid SVG for PNG conversion');
        return;
      }
      
      const canvas = document.createElement('canvas');
      canvas.width = svgSize.width;
      canvas.height = svgSize.height;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return;
      
      // Fill background
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const svgData = new XMLSerializer().serializeToString(svg);
      const img = new Image();
      
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'image.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }
        });
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    } catch (err) {
      setError('Failed to convert SVG to PNG');
    }
  };

  const getSVGStats = () => {
    if (!svgCode) return null;
    
    const stats = {
      size: svgCode.length,
      lines: svgCode.split('\n').length,
      elements: (svgCode.match(/<[a-zA-Z][^>]*>/g) || []).length,
      attributes: (svgCode.match(/\w+="[^"]*"/g) || []).length,
      optimized: optimizeSVG(svgCode).length,
      minified: minifySVG(svgCode).length
    };
    
    return stats;
  };

  const stats = getSVGStats();

  return (
    <div className="max-w-7xl mx-auto px-4 text-black dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">SVG Viewer & Editor</h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
        View, edit, format, and convert SVG files with optimization and export options.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SVG Code Editor */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              SVG Code
            </label>
            <div className="flex gap-2">
              {svgCode && (
                <>
                  <button
                    onClick={() => copyToClipboard(svgCode, 'code')}
                    className={`px-3 py-1 text-xs rounded transition-colors ${
                      copySuccess === 'code'
                        ? 'bg-green-600 text-white'
                        : 'bg-black dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600'
                    }`}
                  >
                    {copySuccess === 'code' ? 'Copied!' : 'Copy'}
                  </button>
                  <button
                    onClick={() => handleSVGCodeChange(formatSVG(svgCode))}
                    className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Format
                  </button>
                  <button
                    onClick={() => handleSVGCodeChange(minifySVG(svgCode))}
                    className="px-3 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                  >
                    Minify
                  </button>
                  <button
                    onClick={() => handleSVGCodeChange(optimizeSVG(svgCode))}
                    className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    Optimize
                  </button>
                </>
              )}
            </div>
          </div>
          
          <textarea
            value={svgCode}
            onChange={(e) => handleSVGCodeChange(e.target.value)}
            placeholder="Paste your SVG code here or upload a file..."
            className="w-full h-96 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-gray-400 focus:border-transparent font-mono text-sm resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
          
          {error && (
            <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
            </div>
          )}

          {/* File Upload */}
          <div className="mt-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".svg,image/svg+xml"
              onChange={handleFileUpload}
              className="hidden"
              id="svg-upload"
            />
            <label
              htmlFor="svg-upload"
              className="inline-block px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer text-sm font-medium"
            >
              Upload SVG File
            </label>
          </div>
        </div>

        {/* SVG Preview */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Preview
            </label>
            <div className="flex gap-2">
              {svgCode && (
                <>
                  <button
                    onClick={downloadSVG}
                    className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Download SVG
                  </button>
                  <button
                    onClick={downloadPNG}
                    className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    Download PNG
                  </button>
                </>
              )}
            </div>
          </div>
          
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-800 min-h-[400px] flex items-center justify-center">
            {svgCode && validateSVG(svgCode) ? (
              <div
                dangerouslySetInnerHTML={{ __html: svgCode }}
                style={{ maxWidth: '100%', maxHeight: '400px' }}
              />
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400">
                <div className="text-4xl mb-2">🎨</div>
                <p>SVG preview will appear here</p>
              </div>
            )}
          </div>

          {/* Export Options */}
          {svgCode && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
              <h3 className="font-semibold text-sm mb-3 text-gray-900 dark:text-gray-100">Export Options</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Width (px)</label>
                  <input
                    type="number"
                    value={svgSize.width}
                    onChange={(e) => setSvgSize(prev => ({ ...prev, width: parseInt(e.target.value) || 400 }))}
                    className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Height (px)</label>
                  <input
                    type="number"
                    value={svgSize.height}
                    onChange={(e) => setSvgSize(prev => ({ ...prev, height: parseInt(e.target.value) || 400 }))}
                    className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Background Color</label>
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-full h-8 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.size}</div>
            <div className="text-sm text-blue-800 dark:text-blue-200">Size (bytes)</div>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.lines}</div>
            <div className="text-sm text-green-800 dark:text-green-200">Lines</div>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.elements}</div>
            <div className="text-sm text-purple-800 dark:text-purple-200">Elements</div>
          </div>
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800 text-center">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.attributes}</div>
            <div className="text-sm text-yellow-800 dark:text-yellow-200">Attributes</div>
          </div>
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.optimized}</div>
            <div className="text-sm text-red-800 dark:text-red-200">Optimized</div>
          </div>
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800 text-center">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{stats.minified}</div>
            <div className="text-sm text-indigo-800 dark:text-indigo-200">Minified</div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center mt-8">
        <button
          onClick={clearAll}
          className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
        >
          Clear All
        </button>
        <button
          onClick={loadSampleSVG}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Load Sample SVG
        </button>
      </div>

      <div className="mt-8 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
        <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">SVG Tips</h3>
        <div className="text-purple-800 dark:text-purple-200 text-sm space-y-1">
          <p><strong>Format:</strong> Adds proper indentation and line breaks for readability</p>
          <p><strong>Minify:</strong> Removes whitespace and unnecessary characters for smaller file size</p>
          <p><strong>Optimize:</strong> Removes default attributes and optimizes numeric values</p>
          <p><strong>Export:</strong> Download as SVG or convert to PNG with custom dimensions</p>
        </div>
      </div>
    </div>
  );
}
