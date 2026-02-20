'use client';

import React, { useState, useRef, useCallback } from 'react';

export interface ImageInfo {
  name: string;
  size: number;
  type: string;
  width: number;
  height: number;
  base64: string;
  dataUrl: string;
}

export default function ImageTool() {
  const [images, setImages] = useState<ImageInfo[]>([]);
  const [copySuccess, setCopySuccess] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);
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

  const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    try {
      const [base64, dimensions] = await Promise.all([
        fileToBase64(file),
        getImageDimensions(file)
      ]);

      const imageInfo: ImageInfo = {
        name: file.name,
        size: file.size,
        type: file.type,
        width: dimensions.width,
        height: dimensions.height,
        base64: base64.split(',')[1] || '', // Remove data:image/...;base64, prefix
        dataUrl: base64
      };

      setImages(prev => [...prev, imageInfo]);
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Failed to process image');
    }
  };

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(processFile);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      Array.from(e.dataTransfer.files).forEach(processFile);
    }
  }, []);

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setImages([]);
    setCopySuccess('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadBase64 = (image: ImageInfo) => {
    const link = document.createElement('a');
    link.download = `${image.name.split('.')[0]}_base64.txt`;
    link.href = `data:text/plain;base64,${image.base64}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getBase64Stats = (image: ImageInfo) => {
    const base64Size = image.base64.length;
    const originalSize = image.size;
    const overhead = base64Size - originalSize;
    const overheadPercentage = ((overhead / originalSize) * 100).toFixed(1);
    
    return {
      base64Size,
      overhead,
      overheadPercentage
    };
  };

  return (
    <div className="max-w-6xl mx-auto px-4 text-black dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">Image to Base64 Converter</h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
        Convert images to Base64 format with drag-and-drop support and batch processing.
      </p>

      {/* Upload Area */}
      <div className="mb-8">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="text-4xl mb-4">📸</div>
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Drag & drop images here
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            or click to browse files
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="inline-block px-6 py-2 bg-black dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors cursor-pointer font-medium"
          >
            Choose Files
          </label>
        </div>
      </div>

      {/* Images List */}
      {images.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Converted Images ({images.length})
            </h2>
            <button
              onClick={clearAll}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              Clear All
            </button>
          </div>

          {images.map((image, index) => {
            const stats = getBase64Stats(image);
            return (
              <div key={index} className="border border-gray-300 dark:border-gray-600 rounded-lg p-6 bg-white dark:bg-gray-800">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Image Preview */}
                  <div>
                    <h3 className="font-semibold text-sm mb-3 text-gray-900 dark:text-gray-100">Preview</h3>
                    <div className="relative">
                      <img
                        src={image.dataUrl}
                        alt={image.name}
                        className="w-full h-48 object-contain bg-gray-100 dark:bg-gray-700 rounded-lg"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                    
                    {/* Image Info */}
                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Name:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">{image.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Type:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">{image.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Dimensions:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">{image.width} × {image.height}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Original Size:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">{formatFileSize(image.size)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Base64 Output */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">Base64 Output</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => copyToClipboard(image.base64, `base64-${index}`)}
                          className={`px-3 py-1 text-xs rounded transition-colors ${
                            copySuccess === `base64-${index}`
                              ? 'bg-green-600 text-white'
                              : 'bg-black dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600'
                          }`}
                        >
                          {copySuccess === `base64-${index}` ? 'Copied!' : 'Copy Base64'}
                        </button>
                        <button
                          onClick={() => copyToClipboard(image.dataUrl, `dataurl-${index}`)}
                          className={`px-3 py-1 text-xs rounded transition-colors ${
                            copySuccess === `dataurl-${index}`
                              ? 'bg-green-600 text-white'
                              : 'bg-black dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600'
                          }`}
                        >
                          {copySuccess === `dataurl-${index}` ? 'Copied!' : 'Copy Data URL'}
                        </button>
                        <button
                          onClick={() => downloadBase64(image)}
                          className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                          Download
                        </button>
                      </div>
                    </div>
                    
                    <textarea
                      value={image.base64}
                      readOnly
                      className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 font-mono text-xs resize-none text-gray-900 dark:text-gray-100"
                      placeholder="Base64 output will appear here..."
                    />
                    
                    <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                      <div className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                        <div className="flex justify-between">
                          <span>Base64 Size:</span>
                          <span className="font-medium">{formatFileSize(stats.base64Size)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Overhead:</span>
                          <span className="font-medium">{formatFileSize(stats.overhead)} ({stats.overheadPercentage}%)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <div className="text-6xl mb-4">🖼️</div>
          <p className="text-lg">No images converted yet</p>
          <p className="text-sm mt-2">Upload images to see them converted to Base64</p>
        </div>
      )}

      <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">Base64 Tips</h3>
        <div className="text-yellow-800 dark:text-yellow-200 text-sm space-y-1">
          <p><strong>Base64 Size:</strong> Base64 encoding increases file size by ~33%</p>
          <p><strong>Data URL:</strong> Includes the MIME type and can be used directly in HTML/CSS</p>
          <p><strong>Use Cases:</strong> Embed small images in HTML, CSS, or JSON</p>
          <p><strong>Limitations:</strong> Not recommended for large files due to size overhead</p>
        </div>
      </div>
    </div>
  );
}
