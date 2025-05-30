import React from 'react';
import Link from 'next/link';

/**
 * Layout Component
 * Provides consistent layout structure across pages
 */
const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold cursor-pointer">
                EHB Dashboard
              </Link>
            </div>
            <nav className="flex space-x-4">
              <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 cursor-pointer">
                Home
              </Link>
              <Link href="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 cursor-pointer">
                Dashboard
              </Link>
              <Link href="/unified-admin-hub" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 cursor-pointer bg-blue-600">
                Admin Hub
              </Link>
              <Link href="/ai-feedback-demo" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 cursor-pointer">
                AI Feedback
              </Link>
            </nav>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-grow bg-gray-100">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p>&copy; {new Date().getFullYear()} EHB Dashboard. All rights reserved.</p>
            </div>
            <div className="flex space-x-4">
              <Link href="/help" className="hover:text-gray-300 cursor-pointer">
                Help
              </Link>
              <Link href="/privacy" className="hover:text-gray-300 cursor-pointer">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-gray-300 cursor-pointer">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;