"use client";
import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';
import ToolDropdown from './ToolDropdown';

export default function Navbar() {
  const { theme } = useTheme();

  return (
    <nav className="border-b bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold text-black dark:text-gray-100">
              DevToolbox
            </Link>
          </div>
          
          <div className="hidden sm:flex sm:items-center sm:gap-4">
            <Link href="/" className="text-gray-900 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-300 px-3 py-2 text-sm font-medium transition-colors">
              Home
            </Link>
            <ToolDropdown />
            <Link href="/blog" className="text-gray-900 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-300 px-3 py-2 text-sm font-medium transition-colors">
              Blog
            </Link>
            <Link href="/about" className="text-gray-900 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-300 px-3 py-2 text-sm font-medium transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-gray-900 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-300 px-3 py-2 text-sm font-medium transition-colors">
              Contact
            </Link>
            <div className="ml-4">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center gap-2">
            <ToolDropdown />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
