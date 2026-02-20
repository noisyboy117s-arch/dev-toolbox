'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';

export default function ToolDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const tools = [
    { name: 'Base64', href: '/base64-tool', icon: '🔡' },
    { name: 'JSON', href: '/json-tool', icon: '📦' },
    { name: 'Epoch', href: '/epoch-tool', icon: '🕒' },
    { name: 'Cron', href: '/cron-tool', icon: '⏰' },
    { name: 'URL', href: '/url-tool', icon: '🔗' },
    { name: 'JWT', href: '/jwt-tool', icon: '🔐' },
    { name: 'Hash', href: '/hash-tool', icon: '#️' },
    { name: 'UUID', href: '/uuid-tool', icon: '🆔' },
    { name: 'Regex', href: '/regex-tool', icon: '🔍' },
    { name: 'Color', href: '/color-tool', icon: '🎨' },
    { name: 'Query Params', href: '/query-tool', icon: '🔍' },
    { name: 'Password', href: '/password-tool', icon: '🔑' },
    { name: 'SQL', href: '/sql-tool', icon: '🗃️' },
    { name: 'Postgres EXPLAIN', href: '/postgres-tool', icon: '🐘' },
    { name: 'Markdown', href: '/markdown-tool', icon: '📝' },
    { name: 'Diff', href: '/diff-tool', icon: '🔄' },
    { name: 'SVG Viewer', href: '/svg-tool', icon: '🎨' },
    { name: 'Image to Base64', href: '/image-tool', icon: '🖼️' },
    { name: 'Lorem Ipsum', href: '/lorem-tool', icon: '📝' },
    { name: 'QR Code', href: '/qr-tool', icon: '📱' },
    { name: 'WCAG Contrast', href: '/contrast-tool', icon: '🎨' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        aria-label="Toggle tools menu"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <span className="text-gray-900 dark:text-gray-100">Tools</span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50">
          <div className="max-h-96 overflow-y-auto">
            {tools.map((tool) => (
              <Link
                key={tool.name}
                href={tool.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
              >
                <span className="text-xl">{tool.icon}</span>
                <span className="text-gray-900 dark:text-gray-100 font-medium">{tool.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
