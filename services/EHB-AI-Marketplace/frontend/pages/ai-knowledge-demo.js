import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useHelp } from '../context/HelpContext';
import { AiAssistantExamples } from '../utils/aiAssistantExamples';

/**
 * AI Knowledge Demo Page
 * 
 * This page demonstrates the enhanced AI knowledge base with
 * industry-specific and role-specific information.
 */
const AIKnowledgeDemo = () => {
  const [selectedIndustry, setSelectedIndustry] = useState('retail');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [selectedRole, setSelectedRole] = useState('seller');
  const [knowledgeData, setKnowledgeData] = useState(null);
  const [terminology, setTerminology] = useState(null);
  const { getDomainKnowledge, getRoleTerminology, loading } = useHelp();

  // Industry options
  const industries = [
    { value: 'retail', label: 'Retail' },
    { value: 'ecommerce', label: 'E-commerce' },
    { value: 'franchising', label: 'Franchising' },
    { value: 'saas', label: 'SaaS' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'finance', label: 'Finance' }
  ];

  // Domain options based on selected industry
  const getDomainOptions = () => {
    const domainMap = {
      retail: [
        { value: 'inventory', label: 'Inventory Management' },
        { value: 'pricing', label: 'Pricing Strategy' },
        { value: 'customerService', label: 'Customer Service' },
        { value: 'merchandising', label: 'Merchandising' },
        { value: 'loyaltyPrograms', label: 'Loyalty Programs' }
      ],
      ecommerce: [
        { value: 'fulfillment', label: 'Fulfillment' },
        { value: 'digitalMarketing', label: 'Digital Marketing' },
        { value: 'productListings', label: 'Product Listings' },
        { value: 'marketplace', label: 'Marketplace Management' },
        { value: 'omnichannel', label: 'Omnichannel Strategy' }
      ],
      franchising: [
        { value: 'locationManagement', label: 'Location Management' },
        { value: 'brandCompliance', label: 'Brand Compliance' },
        { value: 'franchiseeSupport', label: 'Franchisee Support' },
        { value: 'unitEconomics', label: 'Unit Economics' }
      ],
      saas: [
        { value: 'customerSuccess', label: 'Customer Success' },
        { value: 'productDevelopment', label: 'Product Development' },
        { value: 'subscriptionManagement', label: 'Subscription Management' },
        { value: 'userExperience', label: 'User Experience' },
        { value: 'apiIntegration', label: 'API Integration' }
      ],
      healthcare: [
        { value: 'patientCare', label: 'Patient Care' },
        { value: 'operationsManagement', label: 'Operations Management' },
        { value: 'healthcareCompliance', label: 'Healthcare Compliance' },
        { value: 'healthInformatics', label: 'Health Informatics' },
        { value: 'patientExperience', label: 'Patient Experience' }
      ],
      finance: [
        { value: 'wealthManagement', label: 'Wealth Management' },
        { value: 'creditRiskManagement', label: 'Credit Risk Management' },
        { value: 'digitalBanking', label: 'Digital Banking' },
        { value: 'complianceManagement', label: 'Compliance Management' },
        { value: 'paymentProcessing', label: 'Payment Processing' }
      ]
    };
    
    return domainMap[selectedIndustry] || [];
  };

  // Role options
  const roles = [
    { value: 'seller', label: 'Seller' },
    { value: 'buyer', label: 'Buyer' },
    { value: 'franchise', label: 'Franchise Owner' },
    { value: 'admin', label: 'Administrator' },
    { value: 'healthcare', label: 'Healthcare Professional' },
    { value: 'finance', label: 'Finance Professional' }
  ];

  // Fetch domain knowledge when industry and domain change
  useEffect(() => {
    const fetchDomainKnowledge = async () => {
      if (selectedIndustry && selectedDomain) {
        const knowledge = await getDomainKnowledge(selectedIndustry, selectedDomain);
        setKnowledgeData(knowledge);
      } else {
        setKnowledgeData(null);
      }
    };
    
    fetchDomainKnowledge();
  }, [selectedIndustry, selectedDomain, getDomainKnowledge]);

  // Fetch role terminology when role changes
  useEffect(() => {
    const fetchRoleTerminology = async () => {
      if (selectedRole) {
        const terms = await getRoleTerminology(selectedRole);
        setTerminology(terms);
      } else {
        setTerminology(null);
      }
    };
    
    fetchRoleTerminology();
  }, [selectedRole, getRoleTerminology]);

  // Handle industry change
  const handleIndustryChange = (e) => {
    setSelectedIndustry(e.target.value);
    setSelectedDomain(''); // Reset domain when industry changes
    setKnowledgeData(null);
  };

  // Handle domain change
  const handleDomainChange = (e) => {
    setSelectedDomain(e.target.value);
  };

  // Handle role change
  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  return (
    <Layout title="AI Knowledge Base Demo"></Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">AI Knowledge Base Demo</h1>
        <p className="text-lg mb-8">
          This page demonstrates the enhanced AI knowledge base with industry-specific and 
          role-specific information, powering contextual help and personalized recommendations.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Domain Knowledge Explorer */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">Domain Knowledge Explorer</h2>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Select Industry</label>
              <select 
                className="w-full p-2 border rounded"
                value={selectedIndustry}
                onChange={handleIndustryChange}
              >
                {(industries || []).map(industry => (
                  <option key={industry.value} value={industry.value}>
                    {industry.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Select Domain</label>
              <select 
                className="w-full p-2 border rounded"
                value={selectedDomain}
                onChange={handleDomainChange}
              >
                <option value="">-- Select Domain --</option>
                {getDomainOptions().map(domain => (
                  <option key={domain.value} value={domain.value}>
                    {domain.label}
                  </option>
                ))}
              </select>
            </div>
            
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : knowledgeData ? (
              <div className="bg-gray-50 p-4 rounded">
                <h3 className="text-xl font-medium mb-3">{selectedDomain}</h3>
                <p className="text-gray-700 mb-4">{knowledgeData.description}</p>
                
                <div className="mb-4">
                  <h4 className="text-lg font-medium mb-2">Best Practices</h4>
                  <ul className="list-disc pl-5 space-y-1">
             (knowledgeData.bestPractices || []).map((ces || []).map((practice, index) => (
                      <li key={index} className="text-gray-700">{practice}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-lg font-medium mb-2">Key Metrics</h4>
                  <ul className="list-disc pl-5 space-y-1">
     (knowledgeData.keyMetrics || [(keyMetrics || []).map((ics || []).map((metric, index) => (
                      <li key={index} className="text-gray-700">{metric}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium mb-2">Common Challenges</h4>
                  <ul className="list-disc pl-5 space-y-1(knowledgeData.challe(edgeData.challenges || [(challenges || []).map((ges || []).map((challenge, index) => (
                      <li key={index} className="text-gray-700">{challenge}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded text-center text-gray-500">
                {selectedIndustry && !selectedDomain ? 
                  "Please select a domain to view knowledge" : 
                  "No knowledge data available for this selection"}
              </div>
            )}
          </div>
          
          {/* Role Terminology Explorer */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">Role Terminology Explorer</h2>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Select Role</label>
              <select 
                className="w-full p-2 border rounded"
                value={selectedRole}
                onChange={handleRoleChange}
 (roles || []).ma(roles || []).ma(roles || []).ma(roles || []).map(les.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>
            
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : terminology ? (
              <div className="bg-gray-50 p-4 rounded">
                <h3 className="text-xl font-medium mb-3">Terminology for {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Role</h3>
                <dl className="divide-y">
                  {Object.entries(terminology).map(([term, definition], index) => (
                    <div key={index} className="py-3">
                      <dt className="font-medium text-gray-800">{term}</dt>
                      <dd className="text-gray-600 mt-1">{definition}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded text-center text-gray-500">
                No terminology data available for this role
              </div>
            )}
          </div>
        </div>
        
        {/* Interactive Examples */}
        <div className="bg-white rounded-lg shadow p-6 mb-10">
          <h2 className="text-2xl font-semibold mb-4">Interactive AI Assistant Examples</h2>
          <p className="text-gray-700 mb-6">
            Try these interactive examples to see how the AI assistant provides contextual help and
            recommendations using the specialized knowledge base.
          </p>
          
 <AiAssistantExamples /></AiAssistantExamples>amples />
        </div>
      </div>
    </Layout>
  );
};

export default AIKnowledgeDemo;