import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Test() {
  return (
    <>
      <Head></Head>
        <title>Test Page | EHB Admin</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-3xl font-bold text-blue-600 mb-4">
            EHB Admin Test Page
          </h1>
          <p className="text-gray-600 mb-4">
            This is a simple test page to verify that Next.js rendering is working correctly.
          </p>
          
          {/* System Information */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              System Information
            </h2>
            <ul className="space-y-1 text-gray-700">
              <li>Next.js Version: 15.3.2</li>
              <li>Environment: {process.env.NODE_ENV}</li>
              <li>Current Time: {new Date().toLocaleString()}</li>
            </ul>
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex flex-wrap gap-4">
     <Link 
              href="/dashboard"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            ></Link>      >
              Go to Dashboard
            </Link<Link 
              href="/dashboard/analytics"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            ></Link>
            >
              View Analytics
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}