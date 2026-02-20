'use client';

import React, { useState, useEffect } from 'react';
import { marked } from 'marked';

export default function MarkdownTool() {
  const [markdown, setMarkdown] = useState('');
  const [html, setHtml] = useState('');
  const [copySuccess, setCopySuccess] = useState<string>('');
  const [previewMode, setPreviewMode] = useState<'split' | 'editor' | 'preview'>('split');

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
    const processMarkdown = async () => {
      try {
        const processedHtml = await marked(markdown, {
          breaks: true,
          gfm: true,
        });
        setHtml(processedHtml);
      } catch (error) {
        console.error('Error processing markdown:', error);
        setHtml('<p>Error processing markdown</p>');
      }
    };
    
    processMarkdown();
  }, [markdown]);

  const clearAll = () => {
    setMarkdown('');
    setHtml('');
    setCopySuccess('');
  };

  const loadSampleMarkdown = () => {
    setMarkdown(`# Markdown Editor

Welcome to the **DevToolbox** Markdown editor! This tool allows you to write and preview Markdown in real-time.

## Features

- ✨ **Real-time preview** - See your formatted text as you type
- 📋 **Copy functionality** - Copy both Markdown and HTML
- 🌙 **Dark mode support** - Works perfectly in light and dark themes
- 📱 **Responsive design** - Works on all screen sizes

## Syntax Examples

### Text Formatting

You can write **bold text**, *italic text*, and ~~strikethrough text~~.

### Lists

#### Unordered List
- Item 1
- Item 2
  - Nested item
  - Another nested item
- Item 3

#### Ordered List
1. First item
2. Second item
3. Third item

### Links and Images

[Visit DevToolbox](https://devtoolbox.example.com)

### Code

Inline code: \`console.log('Hello, World!')\`

Code block:
\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('Developer'));
\`\`\`

### Tables

| Feature | Status | Priority |
|---------|--------|----------|
| Markdown Editor | ✅ Complete | High |
| Real-time Preview | ✅ Complete | High |
| Copy Functionality | ✅ Complete | Medium |

### Blockquotes

> "The best way to learn is by doing."
> 
> — Anonymous Developer

### Task Lists

- [x] Write Markdown content
- [x] Add real-time preview
- [ ] Add export functionality
- [ ] Add collaboration features

---

## Tips

1. Use **Ctrl/Cmd + B** for bold text in most editors
2. Use **Ctrl/Cmd + I** for italic text
3. Use **Ctrl/Cmd + K** for links
4. Use **\`** for inline code
5. Use **\`\`\`** for code blocks

Happy writing! 🚀`);
  };

  const getEditorWidth = () => {
    switch (previewMode) {
      case 'editor': return '100%';
      case 'preview': return '0%';
      case 'split': return '50%';
      default: return '50%';
    }
  };

  const getPreviewWidth = () => {
    switch (previewMode) {
      case 'editor': return '0%';
      case 'preview': return '100%';
      case 'split': return '50%';
      default: return '50%';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 text-black dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">Markdown Editor</h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
        Write and preview Markdown with real-time rendering and copy functionality.
      </p>

      {/* View Mode Selector */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        <button
          onClick={() => setPreviewMode('editor')}
          className={`px-4 py-2 rounded-lg transition-colors font-medium ${
            previewMode === 'editor'
              ? 'bg-black dark:bg-gray-700 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Editor Only
        </button>
        <button
          onClick={() => setPreviewMode('split')}
          className={`px-4 py-2 rounded-lg transition-colors font-medium ${
            previewMode === 'split'
              ? 'bg-black dark:bg-gray-700 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Split View
        </button>
        <button
          onClick={() => setPreviewMode('preview')}
          className={`px-4 py-2 rounded-lg transition-colors font-medium ${
            previewMode === 'preview'
              ? 'bg-black dark:bg-gray-700 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Preview Only
        </button>
      </div>

      {/* Editor and Preview */}
      <div className="flex gap-4 h-96 lg:h-[500px]">
        {/* Markdown Editor */}
        <div 
          style={{ width: getEditorWidth() }}
          className={`${previewMode === 'editor' ? 'block' : previewMode === 'preview' ? 'hidden' : 'block'} lg:block`}
        >
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Markdown
            </label>
            {markdown && (
              <button
                onClick={() => copyToClipboard(markdown, 'markdown')}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  copySuccess === 'markdown'
                    ? 'bg-green-600 text-white'
                    : 'bg-black dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600'
                }`}
              >
                {copySuccess === 'markdown' ? 'Copied!' : 'Copy'}
              </button>
            )}
          </div>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="Write your Markdown here..."
            className="w-full h-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-gray-400 focus:border-transparent font-mono text-sm resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* HTML Preview */}
        <div 
          style={{ width: getPreviewWidth() }}
          className={`${previewMode === 'preview' ? 'block' : previewMode === 'editor' ? 'hidden' : 'block'} lg:block`}
        >
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Preview
            </label>
            {html && (
              <div className="flex gap-2">
                <button
                  onClick={() => copyToClipboard(html, 'html')}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    copySuccess === 'html'
                      ? 'bg-green-600 text-white'
                      : 'bg-black dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600'
                  }`}
                >
                  {copySuccess === 'html' ? 'Copied!' : 'Copy HTML'}
                </button>
              </div>
            )}
          </div>
          <div className="w-full h-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 overflow-auto">
            <div 
              className="prose prose-sm dark:prose-invert max-w-none text-gray-900 dark:text-gray-100"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center mt-8">
        <button
          onClick={clearAll}
          className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
        >
          Clear All
        </button>
        <button
          onClick={loadSampleMarkdown}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Load Sample
        </button>
      </div>

      {/* Statistics */}
      {markdown && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Markdown Statistics</h3>
            <div className="text-blue-800 dark:text-blue-200 text-sm">
              <p>Characters: {markdown.length}</p>
              <p>Words: {markdown.split(/\s+/).filter(word => word.length > 0).length}</p>
              <p>Lines: {markdown.split('\n').length}</p>
            </div>
          </div>
          
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="font-semibold text-green-900 dark:text-green-100 mb-1">HTML Statistics</h3>
            <div className="text-green-800 dark:text-green-200 text-sm">
              <p>Characters: {html.length}</p>
              <p>HTML Tags: {(html.match(/<[^>]+>/g) || []).length}</p>
            </div>
          </div>
          
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-1">Content Analysis</h3>
            <div className="text-purple-800 dark:text-purple-200 text-sm">
              <p>Headings: {(markdown.match(/^#+\s/gm) || []).length}</p>
              <p>Links: {(markdown.match(/\[.*?\]\(.*?\)/g) || []).length}</p>
              <p>Code Blocks: {(markdown.match(/```/g) || []).length / 2}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">Markdown Tips</h3>
        <div className="text-yellow-800 dark:text-yellow-200 text-sm space-y-1">
          <p><strong>Headers:</strong> Use # for H1, ## for H2, ### for H3, etc.</p>
          <p><strong>Emphasis:</strong> Use *italic* or **bold** text</p>
          <p><strong>Links:</strong> Use [text](url) syntax</p>
          <p><strong>Images:</strong> Use ![alt text](image-url)</p>
          <p><strong>Code:</strong> Use `inline` or ```code blocks```</p>
          <p><strong>Lists:</strong> Use - or * for bullets, 1. for numbered</p>
          <p><strong>Tables:</strong> Use | Header | Header | syntax</p>
        </div>
      </div>
    </div>
  );
}
