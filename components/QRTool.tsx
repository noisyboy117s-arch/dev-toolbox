'use client';

import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';

export interface QROptions {
  text: string;
  size: number;
  margin: number;
  color: {
    dark: string;
    light: string;
  };
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
}

export default function QRTool() {
  const [options, setOptions] = useState<QROptions>({
    text: 'https://devtoolbox.com',
    size: 300,
    margin: 4,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    },
    errorCorrectionLevel: 'M'
  });
  const [qrCodeDataURL, setQrCodeDataURL] = useState('');
  const [copySuccess, setCopySuccess] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(type);
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const generateQRCode = async () => {
    try {
      const canvas = canvasRef.current;
      if (!canvas || !options.text) return;

      await QRCode.toCanvas(canvas, options.text, {
        width: options.size,
        margin: options.margin,
        color: options.color,
        errorCorrectionLevel: options.errorCorrectionLevel
      });

      // Also generate data URL for download
      const dataURL = await QRCode.toDataURL(options.text, {
        width: options.size,
        margin: options.margin,
        color: options.color,
        errorCorrectionLevel: options.errorCorrectionLevel
      });
      
      setQrCodeDataURL(dataURL);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const downloadQRCode = (format: 'png' | 'svg' | 'jpg') => {
    if (!options.text) return;

    const link = document.createElement('a');
    
    if (format === 'png' || format === 'jpg') {
      link.download = `qrcode.${format}`;
      link.href = qrCodeDataURL;
    } else if (format === 'svg') {
      QRCode.toString(options.text, {
        type: 'svg',
        width: options.size,
        margin: options.margin,
        color: options.color,
        errorCorrectionLevel: options.errorCorrectionLevel
      }).then((svgString: string) => {
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        link.download = 'qrcode.svg';
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      });
      return;
    }
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const updateOption = (key: keyof QROptions, value: any) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const clearAll = () => {
    setOptions(prev => ({ ...prev, text: '' }));
    setQrCodeDataURL('');
    setCopySuccess('');
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  };

  const loadSampleData = () => {
    setOptions(prev => ({ ...prev, text: 'https://devtoolbox.com' }));
  };

  useEffect(() => {
    generateQRCode();
  }, [options]);

  const getQRInfo = () => {
    if (!options.text) return null;
    
    const textLength = options.text.length;
    const estimatedModules = Math.ceil(Math.sqrt(textLength * 8)) + 17; // Rough estimation
    const maxCapacity = getMaxCapacity(options.errorCorrectionLevel);
    
    return {
      textLength,
      estimatedModules,
      maxCapacity,
      usagePercentage: ((textLength / maxCapacity) * 100).toFixed(1)
    };
  };

  const getMaxCapacity = (level: string): number => {
    // Approximate max characters for numeric data at different error correction levels
    const capacities: Record<string, number> = {
      'L': 7089,
      'M': 5596,
      'Q': 3996,
      'H': 3057
    };
    return capacities[level] || 5596;
  };

  const qrInfo = getQRInfo();

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:px-8 md:py-8 text-black dark:text-gray-100">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center text-gray-900 dark:text-gray-100">
        QR Code Generator
      </h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-6 md:mb-8 text-sm md:text-base max-w-2xl mx-auto">
        Generate QR codes with customizable colors, sizes, and error correction levels.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* QR Code Options */}
        <div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600">
            <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-gray-100">QR Code Options</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Text or URL
                </label>
                <textarea
                  value={options.text}
                  onChange={(e) => updateOption('text', e.target.value)}
                  placeholder="Enter text, URL, or any data to encode..."
                  className="w-full h-24 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-gray-400 focus:border-transparent resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Size (px)
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="1000"
                    value={options.size}
                    onChange={(e) => updateOption('size', parseInt(e.target.value) || 300)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-gray-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Margin
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={options.margin}
                    onChange={(e) => updateOption('margin', parseInt(e.target.value) || 4)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-gray-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Error Correction Level
                </label>
                <select
                  value={options.errorCorrectionLevel}
                  onChange={(e) => updateOption('errorCorrectionLevel', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-gray-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="L">Low (7%)</option>
                  <option value="M">Medium (15%)</option>
                  <option value="Q">Quartile (25%)</option>
                  <option value="H">High (30%)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Colors
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Foreground</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={options.color.dark}
                        onChange={(e) => updateOption('color', { ...options.color, dark: e.target.value })}
                        className="w-12 h-10 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={options.color.dark}
                        onChange={(e) => updateOption('color', { ...options.color, dark: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Background</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={options.color.light}
                        onChange={(e) => updateOption('color', { ...options.color, light: e.target.value })}
                        className="w-12 h-10 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={options.color.light}
                        onChange={(e) => updateOption('color', { ...options.color, light: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={loadSampleData}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Load Sample
                </button>
                <button
                  onClick={clearAll}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code Preview */}
        <div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600">
            <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-gray-100">QR Code Preview</h3>
            
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <canvas
                  ref={canvasRef}
                  width={options.size}
                  height={options.size}
                  className="max-w-full h-auto"
                />
              </div>
            </div>

            {options.text && (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => downloadQRCode('png')}
                    className="flex-1 px-4 py-2 bg-black dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors font-medium"
                  >
                    Download PNG
                  </button>
                  <button
                    onClick={() => downloadQRCode('svg')}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Download SVG
                  </button>
                  <button
                    onClick={() => downloadQRCode('jpg')}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Download JPG
                  </button>
                </div>

                <button
                  onClick={() => copyToClipboard(options.text, 'text')}
                  className={`w-full px-4 py-2 rounded-lg transition-colors font-medium ${
                    copySuccess === 'text'
                      ? 'bg-green-600 text-white'
                      : 'border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {copySuccess === 'text' ? 'Copied!' : 'Copy Text'}
                </button>
              </div>
            )}

            {/* QR Code Info */}
            {qrInfo && (
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-sm mb-2 text-blue-900 dark:text-blue-100">QR Code Information</h4>
                <div className="text-blue-800 dark:text-blue-200 text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Text Length:</span>
                    <span className="font-medium">{qrInfo.textLength} characters</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Capacity Usage:</span>
                    <span className="font-medium">{qrInfo.usagePercentage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Max Capacity:</span>
                    <span className="font-medium">{qrInfo.maxCapacity} chars</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
        <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">QR Code Tips</h3>
        <div className="text-purple-800 dark:text-purple-200 text-sm space-y-1">
          <p><strong>Error Correction:</strong> Higher levels allow QR codes to be read even if partially damaged</p>
          <p><strong>Size:</strong> Larger QR codes are easier to scan from a distance</p>
          <p><strong>Colors:</strong> Ensure sufficient contrast between foreground and background</p>
          <p><strong>Formats:</strong> SVG is scalable, PNG/JPG are raster formats</p>
        </div>
      </div>
    </div>
  );
}
