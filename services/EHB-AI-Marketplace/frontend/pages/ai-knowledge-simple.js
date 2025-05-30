import React, { useState } from 'react';
import Layout from '../components/Layout';

/**
 * AI Knowledge Demo Page - Simplified Version
 * 
 * This page demonstrates the enhanced AI knowledge base with
 * industry-specific and role-specific information.
 */
const AIKnowledgeSimple = () => {
  const [selectedIndustry, setSelectedIndustry] = useState('retail');
  const [selectedDomain, setSelectedDomain] = useState('inventory');
  const [contentType, setContentType] = useState('knowledge'); // 'knowledge' or 'terminology'

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
  const domainOptions = {
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

  // Sample knowledge data for demonstration (would normally be fetched from API)
  const sampleKnowledge = {
    retail: {
      inventory: {
        description: "Management of product stock levels, reordering, and warehouse organization",
        bestPractices: [
          "Implement just-in-time inventory to reduce storage costs",
          "Use FIFO (First In, First Out) for perishable goods",
          "Set up automatic reorder points based on historical sales data",
          "Conduct regular inventory audits to prevent shrinkage",
          "Optimize warehouse layout based on product popularity"
        ],
        keyMetrics: [
          "Inventory turnover ratio",
          "Days of supply",
          "Holding cost per unit",
          "Stockout rate",
          "Inventory accuracy"
        ],
        challenges: [
          "Seasonal demand fluctuations",
          "Supply chain disruptions",
          "Dead stock management",
          "Storage space limitations",
          "Balancing stock levels with cash flow"
        ]
      }
    },
    healthcare: {
      patientCare: {
        description: "Management of patient treatment, care coordination, and health outcomes",
        bestPractices: [
          "Implement patient-centered care models focusing on individual needs and preferences",
          "Establish clear communication protocols between care team members",
          "Use standardized handoff procedures to reduce errors during transitions of care",
          "Develop comprehensive care plans with measurable goals and regular reassessment",
          "Incorporate evidence-based practice guidelines into routine care"
        ],
        keyMetrics: [
          "Patient satisfaction scores",
          "Hospital readmission rates",
          "Length of stay",
          "Clinical outcome measures",
          "Adherence to treatment plans"
        ],
        challenges: [
          "Balancing quality care with operational efficiency",
          "Staff shortages and burnout",
          "Coordination across multiple specialists and care settings",
          "Managing patients with complex comorbidities",
          "Addressing social determinants of health"
        ]
      }
    },
    finance: {
      wealthManagement: {
        description: "Services focused on growing and protecting client assets through investment strategies and financial planning",
        bestPractices: [
          "Implement comprehensive client risk profiling beyond standard questionnaires",
          "Create documented investment policy statements for all client portfolios",
          "Establish regular portfolio review cadences based on client segment and complexity",
          "Utilize goals-based planning approaches that align investments with specific client objectives",
          "Leverage behavioral finance principles to improve client decision-making and adherence to plans"
        ],
        keyMetrics: [
          "Risk-adjusted returns (Sharpe ratio, information ratio)",
          "Asset retention rate",
          "Client satisfaction scores",
          "Wallet share percentage",
          "Financial plan completion rate"
        ],
        challenges: [
          "Managing client expectations during market volatility",
          "Fee compression and transparency requirements",
          "Integrating tax considerations into investment strategies",
          "Balancing technology automation with personalized service",
          "Addressing generational wealth transfer dynamics"
        ]
      }
    }
  };

  // Sample terminology data for demonstration
  const sampleTerminology = {
    healthcare: {
      "EHR": "Electronic Health Record - Digital version of a patient's medical history maintained by the provider",
      "HIPAA": "Health Insurance Portability and Accountability Act - U.S. regulation for medical information privacy",
      "CMS": "Centers for Medicare & Medicaid Services - U.S. federal agency that administers Medicare and works with states on Medicaid",
      "PHI": "Protected Health Information - Individually identifiable health information protected by HIPAA",
      "ICD-10": "International Classification of Diseases, 10th Revision - Diagnostic coding system"
    },
    finance: {
      "AUM": "Assets Under Management - The total market value of assets a financial institution manages on behalf of clients",
      "KYC": "Know Your Customer - Due diligence procedures that financial institutions must perform to identify clients",
      "NAV": "Net Asset Value - The value of a fund's assets minus the value of its liabilities",
      "FINRA": "Financial Industry Regulatory Authority - Self-regulatory organization that oversees broker-dealers",
      "SEC": "Securities and Exchange Commission - U.S. government agency responsible for regulating securities"
    },
    retail: {
      "SKU": "Stock Keeping Unit - A unique identifier for each distinct product that can be purchased",
      "COGS": "Cost of Goods Sold - The direct costs attributable to the production of the goods sold by a company",
      "AOV": "Average Order Value - The average amount spent each time a customer places an order",
      "ROAS": "Return on Ad Spend - A marketing metric that measures the revenue earned for every dollar spent on advertising",
      "Conversion Rate": "The percentage of website visitors who complete a desired action (like making a purchase)"
    }
  };

  // Get domain options for current industry
  const getDomainOptions = () => domainOptions[selectedIndustry] || [];

  // Get current knowledge data
  const getCurrentKnowledge = () => {
    if (contentType === 'knowledge') {
      if (sampleKnowledge[selectedIndustry] && sampleKnowledge[selectedIndustry][selectedDomain]) {
        return sampleKnowledge[selectedIndustry][selectedDomain];
      }
      return sampleKnowledge.retail.inventory; // Default fallback
    } else {
      return sampleTerminology[selectedIndustry] || sampleTerminology.retail;
    }
  };

  // Handle industry change
  const handleIndustryChange = (e) => {
    setSelectedIndustry(e.target.value);
    
    // Set a default domain for the new industry
    const domains = domainOptions[e.target.value] || [];
    if (domains.length > 0) {
      setSelectedDomain(domains[0].value);
    }
  };

  // Handle domain change
  const handleDomainChange = (e) => {
    setSelectedDomain(e.target.value);
  };

  // Current data to display
  const currentData = getCurrentKnowledge();

  return (
    <Layout title="AI Knowledge Base Demo"></Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">AI Knowledge Base Demo</h1>
        <p className="text-lg mb-8">
          This page demonstrates the enhanced AI knowledge base with industry-specific and 
          role-specific information, powering contextual help and personalized recommendations.
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <p className="text-blue-800">
            <strong>Note:</strong> This is a simplified demo showing how the domain knowledge 
            would appear. In production, this data would be fetched from the API endpoints.
          </p>
        </div>
        
        <div className="flex mb-6 space-x-4">
          <button 
            className={`px-4 py-2 rounded-lg ${contentType === 'knowledge' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => setContentType('knowledge')}
          >
            Domain Knowledge
          </button>
          <button 
            className={`px-4 py-2 rounded-lg ${contentType === 'terminology' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => setContentType('terminology')}
          >
            Role Terminology
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-xl font-semibold mb-4">Options</h2>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Industry</label>
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
              
              {contentType === 'knowledge' && (
                <div>
                  <label className="block text-gray-700 mb-2">Domain</label>
                  <select 
                    className="w-full p-2 border rounded"
                    value={selectedDomain}
                    onChange={handleDomainChange}
                  >
                    {getDomainOptions().map(domain => (
                      <option key={domain.value} value={domain.value}>
                        {domain.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow p-6">
              {contentType === 'knowledge' ? (
                // Domain Knowledge View
                <>
                  <h2 className="text-2xl font-semibold mb-2">{selectedDomain}</h2>
                  <p className="text-gray-700 mb-6">{currentData.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h3 className="text-lg font-medium text-blue-800 mb-3">Best Practices</h3>
                      <ul className="list-disc pl-5 space-y-2">
                 (currentData.bestPractices || []).map((ces || []).map((practice, index) => (
                          <li key={index} className="text-gray-700">{practice}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-blue-800 mb-3">Key Metrics</h3>
                      <ul className="list-disc pl-5 space-y-2">
         (currentData.keyMetrics || [(keyMetrics || []).map((ics || []).map((metric, index) => (
                          <li key={index} className="text-gray-700">{metric}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-blue-800 mb-3">Challenges</h3>
                      <ul className="list-disc pl-5 space-y-2">
 (currentData.challe(rentData.challenges || [(challenges || []).map((ges || []).map((challenge, index) => (
                          <li key={index} className="text-gray-700">{challenge}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </>
              ) : (
                // Terminology View
                <>
                  <h2 className="text-2xl font-semibold mb-4">{selectedIndustry.charAt(0).toUpperCase() + selectedIndustry.slice(1)} Terminology</h2>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <dl className="divide-y">
                      {Object.entries(currentData).map(([term, definition], index) => (
                        <div key={index} className="py-3">
                          <dt className="font-medium text-gray-800">{term}</dt>
                          <dd className="text-gray-600 mt-1">{definition}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">How to Use the AI Knowledge Base</h2>
          
          <div className="prose max-w-none">
            <p>
              The AI Knowledge Base provides domain-specific knowledge and terminology for 
              different industries and user roles. This enables the AI assistant to provide more 
              relevant and helpful responses based on the context of the user's questions.
            </p>
            
            <h3>API Endpoints</h3>
            <ul>
              <li><code>/api/ai/knowledge?industry=healthcare&domain=patientCare</code> - Get domain-specific knowledge</li>
              <li><code>/api/ai/terminology?role=finance</code> - Get role-specific terminology</li>
              <li><code>/api/ai/recommendations</code> - Get AI-powered recommendations with industry context</li>
            </ul>
            
            <h3>React Components</h3>
            <p>
              The AI Knowledge Base can be accessed through the <code>useHelp</code> hook:
            </p>
            <pre className="bg-gray-100 p-3 rounded">
              {`const { 
  getDomainKnowledge, 
  getRoleTerminology,
  getAIRecommendations 
} = useHelp();

// Example usage
const knowledgeData = await getDomainKnowledge('healthcare', 'patientCare');
const terminology = await getRoleTerminology('finance');
const recommendations = await getAIRecommendations('digital marketing');`}
            </pre>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AIKnowledgeSimple;