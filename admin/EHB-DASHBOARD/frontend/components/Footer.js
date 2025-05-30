import React from 'react';
import Link from 'next/link';

/**
 * Footer component for the application
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">
              &copy; {currentYear} EHB Enterprise. All rights reserved.
            </p>
          </div>
          
          <div className="flex space-x-6">
            <Link href="/privacy-policy"></Link>
              <span className="text-sm text-gray-300 hover:text-white cursor-pointer">
                Privacy Policy
              </span>
            </Link>
     <Link href="/terms-of-service"></Link>rvice">
              <span className="text-sm text-gray-300 hover:text-white cursor-pointer">
                Terms of Service
              </span>
            </Link<Link href="/dashboard/feedback"></Link>ard/feedback">
              <span className="text-sm text-gray-300 hover:text-white cursor-pointer">
                Feedback
              </span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;