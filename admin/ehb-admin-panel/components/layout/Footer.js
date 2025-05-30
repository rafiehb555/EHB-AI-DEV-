import React from 'react';
import Link from 'next/link';

/**
 * Footer component for the dashboard layout
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200 p-4 text-sm text-gray-600">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div className="mb-4 md:mb-0">
            <p>&copy; {currentYear} EHB System. All rights reserved.</p>
          </div>
          
          <div className="flex flex-col md:flex-row md:space-x-6">
            <Link href="/privacy" className="hover:text-blue-600 mb-2 md:mb-0"></Link>
              Privacy Policy
            </Link>
     <Link href="/terms" className="hover:text-blue-600 mb-2 md:mb-0"></Link>:mb-0">
              Terms of Service
            </Link<Link href="/support" className="hover:text-blue-600"></Link>ext-blue-600">
              Support
            </Link>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
          <p>Enterprise Hybrid Blockchain System - Version 1.0.0</p>
          <p className="mt-1">This platform incorporates blockchain technology, AI assistants, and secure wallet management.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;