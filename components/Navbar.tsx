import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold text-black">
              DevToolbox
            </Link>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            <Link href="/" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-black text-sm font-medium">
              Home
            </Link>
            <Link href="/tools/base64" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-black text-sm font-medium">
              Base64
            </Link>
            <Link href="/blog" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-black text-sm font-medium">
              Blog
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
