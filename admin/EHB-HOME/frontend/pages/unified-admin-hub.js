import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';

/**
 * Unified Admin Hub
 * 
 * This page serves as a central dashboard to access all administrative
 * functions across the EHB ecosystem. It provides links to all admin
 * interfaces, management tools, and AI services with status information.
 */
export default function UnifiedAdminHub() {
  const [systemStatus, setSystemStatus] = useState({
    aiServices: { status: 'checking', ports: { aiAgent: 5128, aiHub: 5150, langchain: 5100 } },
    adminPanels: { status: 'checking', ports: { main: 5000, dashboard: 5020, home: 5005 } },
    coreServices: { status: 'checking', ports: { backend: 5001, mongo: 5300, goSellr: 5002 } },
    devTools: { status: 'checking', ports: { devPortal: 5010, playground: 5050 } }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking system status
    const checkServices = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, you would ping each service to check its status
        // For now, we'll simulate this with mock data
        
        // This would be replaced with actual API calls to check each service
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setSystemStatus({
          aiServices: { 
            status: 'operational', 
            ports: { aiAgent: 5128, aiHub: 5150, langchain: 5100 },
            services: [
              { name: 'AI Agent Core', port: 5128, status: 'operational', description: 'Core AI orchestration service' },
              { name: 'AI Integration Hub', port: 5150, status: 'operational', description: 'Integrates external AI services' },
              { name: 'LangChain Service', port: 5100, status: 'operational', description: 'Natural language processing service' },
              { name: 'EHB Free Agent', port: 'various', status: 'operational', description: 'Autonomous agent system' }
            ]
          },
          adminPanels: { 
            status: 'operational', 
            ports: { main: 5000, dashboard: 5020, home: 5005 },
            services: [
              { name: 'Admin Panel', port: 5000, status: 'operational', description: 'Main EHB admin interface' },
              { name: 'EHB-HOME', port: 5005, status: 'operational', description: 'EHB Home integration service' },
              { name: 'Admin Dashboard', port: 5020, status: 'operational', description: 'Enterprise dashboard for metrics' }
            ]
          },
          coreServices: { 
            status: 'operational', 
            ports: { backend: 5001, mongo: 5300, goSellr: 5002 },
            services: [
              { name: 'Backend API', port: 5001, status: 'operational', description: 'Core backend services' },
              { name: 'MongoDB API', port: 5300, status: 'operational', description: 'Document database service' },
              { name: 'GoSellr', port: 5002, status: 'operational', description: 'E-commerce platform' }
            ]
          },
          devTools: { 
            status: 'operational', 
            ports: { devPortal: 5010, playground: 5050 },
            services: [
              { name: 'Developer Portal', port: 5010, status: 'operational', description: 'Developer documentation and APIs' },
              { name: 'AI Playground', port: 5050, status: 'operational', description: 'Interactive AI testing environment' }
            ]
          }
        });
      } catch (error) {
        console.error('Error checking services:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkServices();
  }, []);

  // Function to determine status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'operational':
        return 'bg-green-500';
      case 'degraded':
        return 'bg-yellow-500';
      case 'outage':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Render a service card with status and link
  const ServiceCard = ({ service }) => (
    <div className="bg-white shadow rounded-lg p-6 mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold">{service.name}</h3>
          <p className="text-gray-600 mt-1">{service.description}</p>
          <p className="text-gray-500 mt-2">Port: {service.port}</p>
        </div>
        <div className={`${getStatusColor(service.status)} text-white px-3 py-1 rounded-full text-sm`}>
          {service.status}
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <a 
          href={`http://localhost:${service.port}`} 
          target="_blank" 
          rel="noreferrer"
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Access Service →
        </a>
      </div>
    </div>
  );

  return (
    <Layout>
      <Head>
        <title>Unified Admin Hub | EHB</title>
        <meta name="description" content="Centralized administration hub for the Enterprise Hybrid Blockchain system" />
      </Head>

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Unified Admin Hub</h1>
          <p className="mt-2 text-gray-600">
            Access all administrative functions and services across the EHB ecosystem
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {/* AI Services Section */}
              <div className="col-span-1">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">AI Services</h2>
                  <div className="bg-white bg-opacity-10 p-2 rounded mb-4">
                    <p className="text-white">
                      Manage and monitor all AI-powered services and agents in the EHB ecosystem
                    </p>
                  </div>
                  <div className="space-y-4">
                    {systemStatus.aiServices.services.map((service, index) => (
                      <ServiceCard key={index} service={service} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Core Services Section */}
              <div className="col-span-1">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg shadow p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">Core Services</h2>
                  <div className="bg-white bg-opacity-10 p-2 rounded mb-4">
                    <p className="text-white">
                      Access core infrastructure services that power the Enterprise Hybrid Blockchain
                    </p>
                  </div>
                  <div className="space-y-4">
                    {systemStatus.coreServices.services.map((service, index) => (
                      <ServiceCard key={index} service={service} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Admin Panels Section */}
              <div className="col-span-1">
                <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-lg shadow p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">Admin Panels</h2>
                  <div className="bg-white bg-opacity-10 p-2 rounded mb-4">
                    <p className="text-white">
                      Central access to all administrative interfaces for system management
                    </p>
                  </div>
                  <div className="space-y-4">
                    {systemStatus.adminPanels.services.map((service, index) => (
                      <ServiceCard key={index} service={service} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Developer Tools Section */}
              <div className="col-span-1">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg shadow p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">Developer Tools</h2>
                  <div className="bg-white bg-opacity-10 p-2 rounded mb-4">
                    <p className="text-white">
                      Tools and resources for EHB development and integration
                    </p>
                  </div>
                  <div className="space-y-4">
                    {systemStatus.devTools.services.map((service, index) => (
                      <ServiceCard key={index} service={service} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}