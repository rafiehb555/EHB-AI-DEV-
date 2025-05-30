import React from 'react';
import Link from 'next/link';
import DashboardLayout from '../components/layout/DashboardLayout';

/**
 * Blockchain Knowledge Demo Page
 * 
 * This page demonstrates the enhanced AI knowledge base with
 * blockchain-specific and wallet-specific information.
 */
const BlockchainKnowledgeDemoPage = () => {
  return (
    <DashboardLayout></DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">
            Enhanced Blockchain AI Knowledge
          </h1>
          <p className="text-lg mb-4">
            Our AI assistant has been enhanced with deep knowledge about blockchain technologies, 
            cryptocurrency wallets, and wallet management systems. This page demonstrates how 
            the AI can provide specialized insights and assistance for blockchain-related topics.
          </p>
          
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="font-bold">Knowledge Enhancement Complete</p>
                <p>
                  The AI assistant now has comprehensive knowledge about blockchain fundamentals, 
                  wallet security, smart contracts, tokenomics, and crypto-specific best practices.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            Knowledge Categories
          </h2>
          <div className="bg-blue-50 p-4 rounded mb-6">
            <p className="font-bold mb-2">Blockchain Basics:</p>
            <p className="mb-4">
              Fundamental concepts of blockchain technology, distributed ledger systems, 
              consensus mechanisms, and cryptographic principles.
            </p>
            
            <p className="font-bold mb-2">Wallet Technologies:</p>
            <p className="mb-4">
              Comprehensive knowledge about wallet architectures, including standard wallets, 
              trusty wallets with validator locking, and cryptocurrency wallets with ERC20/BEP20 support.
            </p>
            
            <p className="font-bold mb-2">Security Best Practices:</p>
            <p className="mb-4">
              Detailed information about private key management, hierarchical deterministic 
              wallets, multi-signature approaches, and robust backup procedures.
            </p>
            
            <p className="font-bold mb-2">Smart Contract Development:</p>
            <p className="mb-4">
              Knowledge about smart contract security, gas optimization, common vulnerabilities, 
              and best practices for development and auditing.
            </p>
            
            <p className="font-bold mb-2">Tokenomics and Economics:</p>
            <p>
              Information on token utility design, incentive mechanisms, supply management, 
              and economic principles for blockchain systems.
            </p>
          </div>
        </div>

        <hr className="my-8" />
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            Try the Enhanced AI Assistant
          </h2>
          <p className="mb-6">
            Ask questions about blockchain technology, wallet systems, or cryptocurrency concepts
            to see how the AI provides more detailed and technically sound information.
          </p>
          
          <div className="bg-white shadow-md rounded p-6 border border-gray-200">
            <h3 className="text-xl font-bold mb-4">Blockchain Knowledge Demo</h3>
            <p>
              The AI knowledge base has been enhanced with specialized blockchain information.
              You can now ask more detailed questions about blockchain concepts, wallet technologies,
              and cryptocurrency topics using the contextual help feature in the system.
            </p>
            
            <div className="mt-4">
              <ul className="list-disc pl-5 space-y-2">
                <li>Try asking about wallet security best practices</li>
                <li>Ask for information about ERC20 or BEP20 tokens</li>
                <li>Request details about smart contract security</li>
                <li>Learn about hierarchical deterministic wallets</li>
                <li>Get information about blockchain consensus mechanisms</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 mb-4 text-c<Link href="/dashboard" className="text-blue-500 hover:text-blue-700"></Link>er:text-blue-700">
            Return to Dashboard
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BlockchainKnowledgeDemoPage;