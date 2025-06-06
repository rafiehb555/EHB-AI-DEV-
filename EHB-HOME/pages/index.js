/**
 * Home Page
 * Auto-generated by EHB-HOME Integrator
 */

import React from 'react';
import Layout from '../components/Layout';
import ModuleGrid from '../components/ModuleGrid';
import { getAllModules } from '../utils/moduleScanner';

export default function Home() {
  const modules = getAllModules();
  
  return (
    <Layout title="Home">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Enterprise Hybrid Blockchain
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Your integrated enterprise platform with AI-powered services
          </p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">System Modules</h2>
          <ModuleGrid modules={modules} />
        </div>
      </div>
    </Layout>
  );
}
