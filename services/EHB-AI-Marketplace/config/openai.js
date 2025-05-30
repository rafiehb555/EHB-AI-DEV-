const OpenAI = require('openai');
const { roleSpecificInstructions, industryKnowledge, domainSpecificPrompts } = require('./aiKnowledgeBase');

// Initialize OpenAI with API key from environment variables
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || 'default_key'
});

/**
 * Get domain-specific knowledge for a particular industry and area
 * 
 * @param {string} industry - The industry sector (retail, ecommerce, franchising, etc.)
 * @param {string} domain - The specific domain within that industry
 * @returns {Object|null} - Domain-specific knowledge or null if not found
 */
const getDomainKnowledge = (industry, domain) => {
  if (industryKnowledge[industry] && industryKnowledge[industry][domain]) {
    return industryKnowledge[industry][domain];
  }
  return null;
};

/**
 * Get role-specific instructions for a particular user role
 * 
 * @param {string} role - The user role (seller, buyer, franchise, admin)
 * @returns {Object} - Role-specific instructions
 */
const getRoleInstructions = (role) => {
  return roleSpecificInstructions[role] || roleSpecificInstructions.buyer; // Default to buyer if role not found
};

/**
 * Format domain knowledge into a readable format for the AI
 * 
 * @param {Object} knowledge - Domain knowledge object
 * @returns {string} - Formatted knowledge text
 */
const formatDomainKnowledge = (knowledge) => {
  if (!knowledge) return '';
  
  let formattedText = `
Domain: ${knowledge.description}

Best Practices:
${(knowledge.bestPractices || []).map(practice => `- ${practice}`).join('\n')}

Key Metrics:
${(knowledge.keyMetrics || []).map(metric => `- ${metric}`).join('\n')}

Common Challenges:
${(knowledge.challenges || []).map(challenge => `- ${challenge}`).join('\n')}
  `;
  
  return formattedText;
};

/**
 * Format role terminology into a readable glossary
 * 
 * @param {Object} terminology - Role-specific terminology
 * @returns {string} - Formatted terminology text
 */
const formatTerminology = (terminology) => {
  if (!terminology) return '';
  
  let terms = Object.entries(terminology).map(([term, definition]) => {
    return `- ${term}: ${definition}`;
  }).join('\n');
  
  return `
Terminology Glossary:
${terms}
  `;
};

/**
 * Detect the domain and topic from user message
 * 
 * @param {string} message - User message
 * @param {string} userRole - User role
 * @returns {Object} - Detected domain and topic
 */
const detectTopicAndDomain = (message, userRole) => {
  const roleInfo = getRoleInstructions(userRole);
  const topicKeywords = {
    // Core business operations
    inventory: ['inventory', 'stock', 'warehouse', 'supply', 'reorder', 'stockout', 'overstocked', 'backorder', 'sku', 'inventory turnover', 'days of supply', 'shrinkage', 'buffer stock', 'just-in-time', 'fifo', 'lifo'],
    pricing: ['pricing', 'price', 'discount', 'margin', 'promotion', 'markup', 'price elasticity', 'dynamic pricing', 'competitive pricing', 'psychological pricing', 'bundling', 'tiered pricing', 'price sensitivity', 'msrp', 'map', 'cost-plus', 'penetration pricing'],
    marketing: ['marketing', 'advertisement', 'campaign', 'promotion', 'audience', 'lead generation', 'conversion', 'ctr', 'roas', 'cac', 'target audience', 'segmentation', 'brand awareness', 'a/b testing', 'content marketing', 'seo', 'sem', 'social media', 'email marketing'],
    customer_service: ['customer service', 'support', 'complaint', 'ticket', 'resolution', 'chatbot', 'helpdesk', 'csat', 'nps', 'customer satisfaction', 'service recovery', 'escalation', 'response time', 'churn', 'retention', 'loyalty', 'feedback'],
    
    // Analytics and data
    analytics: ['analytics', 'report', 'data', 'metric', 'performance', 'insight', 'dashboard', 'kpi', 'forecast', 'trend', 'benchmark', 'cohort', 'segment', 'visualization', 'attribution', 'conversion funnel', 'retention curve', 'correlate', 'regression', 'anomaly'],
    
    // Ecommerce specific
    orders: ['order', 'purchase', 'shipment', 'delivery', 'tracking', 'fulfillment', 'cart', 'checkout', 'abandoned cart', 'average order value', 'order frequency', 'delivery time', 'expedited shipping', 'order status', 'backorder'],
    returns: ['return', 'refund', 'exchange', 'warranty', 'satisfaction', 'rma', 'return authorization', 'restocking fee', 'return policy', 'return rate', 'damaged goods', 'warranty claim', 'refund processing', 'customer satisfaction'],
    
    // Operational concerns
    operations: ['operations', 'process', 'workflow', 'efficiency', 'procedure', 'sop', 'standard operating procedure', 'bottleneck', 'throughput', 'optimization', 'capacity', 'automation', 'resource allocation', 'quality control', 'continuous improvement'],
    compliance: ['compliance', 'standard', 'regulation', 'policy', 'guideline', 'iso', 'audit', 'certification', 'legal requirement', 'gdpr', 'hipaa', 'sox', 'pci', 'regulatory', 'industry standard', 'best practice'],
    security: ['security', 'privacy', 'breach', 'authentication', 'authorization', 'encryption', 'vulnerability', 'threat', 'risk assessment', 'penetration testing', 'data protection', 'access control', 'firewall', 'malware', 'phishing', 'multi-factor'],
    
    // Technical topics
    development: ['development', 'code', 'programming', 'software', 'application', 'api', 'integration', 'database', 'microservice', 'architecture', 'framework', 'library', 'testing', 'deployment', 'ci/cd', 'version control', 'bug', 'feature', 'sprint'],
    infrastructure: ['infrastructure', 'server', 'cloud', 'hosting', 'network', 'storage', 'database', 'container', 'kubernetes', 'docker', 'aws', 'azure', 'gcp', 'scaling', 'load balancing', 'cdn', 'dns', 'vpn', 'firewall'],
    
    // SaaS specific
    subscription: ['subscription', 'recurring revenue', 'mrr', 'arr', 'churn', 'retention', 'lifetime value', 'cltv', 'expansion revenue', 'contraction', 'upgrade', 'downgrade', 'billing cycle', 'renewal', 'trial', 'freemium', 'tiered pricing'],
    onboarding: ['onboarding', 'user activation', 'first value', 'time to value', 'user journey', 'welcome flow', 'tutorial', 'training', 'setup wizard', 'guided tour', 'feature adoption', 'user engagement', 'friction point'],
    
    // Franchise specific
    location_management: ['location', 'territory', 'site selection', 'multi-unit', 'franchise location', 'store performance', 'location comparison', 'geographic expansion', 'market penetration', 'cannibalization', 'trade area', 'flagship location'],
    brand_compliance: ['brand compliance', 'brand standard', 'visual identity', 'franchise manual', 'quality audit', 'mystery shopper', 'field visit', 'compliance score', 'brand consistency', 'standard operating procedure', 'franchise agreement'],
    
    // Financial areas
    finance: ['finance', 'accounting', 'revenue', 'expense', 'profit', 'loss', 'cash flow', 'budget', 'forecast', 'capital', 'investment', 'roi', 'npv', 'irr', 'balance sheet', 'income statement', 'cash flow statement', 'tax', 'audit'],
    
    // Blockchain basics
    blockchain_basics: ['blockchain', 'distributed ledger', 'consensus', 'decentralized', 'cryptocurrency', 'bitcoin', 'ethereum', 'hash', 'block', 'chain', 'mining', 'node', 'genesis block', 'merkle tree', 'nakamoto', 'peer-to-peer', 'p2p', 'private key', 'public key', 'public blockchain', 'private blockchain', 'permissionless', 'permissioned'],
    
    // Crypto wallets
    crypto_wallets: ['wallet', 'crypto wallet', 'hot wallet', 'cold wallet', 'hardware wallet', 'software wallet', 'custodial', 'non-custodial', 'seed phrase', 'recovery phrase', 'mnemonic', 'private key', 'public key', 'address', 'hd wallet', 'hierarchical deterministic', 'derivation path', 'keystore', 'multi-signature', 'multisig', 'ledger', 'trezor', 'metamask', 'wallet connect'],
    
    // Smart contracts
    smart_contracts: ['smart contract', 'solidity', 'vyper', 'contract', 'automated agreement', 'code is law', 'self-executing', 'bytecode', 'abi', 'application binary interface', 'gas', 'gas limit', 'gas price', 'transaction fee', 'evm', 'ethereum virtual machine', 'opcode', 'contract deployment', 'function call', 'view function', 'pure function', 'state variable', 'event', 'modifier', 'require', 'assert', 'revert', 'fallback function'],
    
    // Tokenomics
    tokenomics: ['tokenomics', 'token', 'coin', 'utility token', 'security token', 'governance token', 'staking', 'yield', 'incentive', 'token distribution', 'vesting', 'inflation', 'deflation', 'burn', 'mint', 'total supply', 'circulating supply', 'market cap', 'fully diluted valuation', 'token model', 'token economy', 'token design', 'token utility', 'token value capture'],
    
    // DeFi
    defi: ['defi', 'decentralized finance', 'lending', 'borrowing', 'yield farming', 'liquidity mining', 'liquidity pool', 'amm', 'automated market maker', 'dex', 'decentralized exchange', 'swap', 'impermanent loss', 'tvl', 'total value locked', 'collateral', 'overcollateralized', 'flash loan', 'aave', 'compound', 'uniswap', 'curve', 'stablecoin', 'synthetic asset', 'oracle', 'chainlink'],
    
    // Blockchain governance
    blockchain_governance: ['governance', 'dao', 'decentralized autonomous organization', 'proposal', 'vote', 'delegation', 'quadratic voting', 'conviction voting', 'timelock', 'multisig', 'quorum', 'snapshot', 'governance token', 'community', 'stakeholder', 'treasury', 'veto', 'optimistic governance', 'fork', 'upgrade'],
    
    // Blockchain interoperability
    blockchain_interoperability: ['interoperability', 'cross-chain', 'bridge', 'atomic swap', 'wrapped token', 'polkadot', 'cosmos', 'ibc', 'relay chain', 'parachain', 'peg', 'pegged token', 'wrapped bitcoin', 'wbtc', 'multichain', 'cross-chain messaging', 'trustless bridge', 'trusted bridge', 'relay'],
    
    // Blockchain security
    blockchain_security: ['blockchain security', 'key management', 'multisig', 'multi-signature', 'cold storage', 'hst', 'hardware security module', 'audit', 'penetration testing', 'smart contract vulnerability', 'reentrancy', 'front-running', 'sandwich attack', 'flash loan attack', '51% attack', 'eclipse attack', 'selfish mining', 'replay attack', 'key derivation', 'encryption']
  };
  
  // Default domain based on user role
  let detectedDomain = 'general';
  let detectedTopic = roleInfo.priorityTopics[0];
  
  // Simple keyword matching (in a production system, this would use more advanced NLP)
  for (const [topic, keywords] of Object.entries(topicKeywords)) {
    if (keywords.some(keyword => message.toLowerCase().includes(keyword.toLowerCase()))) {
      detectedTopic = topic;
      break;
    }
  }
  
  // Map topics to likely domains
  const topicToDomain = {
    // Core business operations
    inventory: 'retail',
    pricing: userRole === 'franchise' ? 'franchising' : 'retail',
    marketing: userRole === 'franchise' ? 'franchising' : 'ecommerce',
    customer_service: userRole === 'admin' ? 'saas' : 'retail',
    
    // Analytics and data
    analytics: userRole === 'franchise' ? 'franchising' : (userRole === 'developer' ? 'saas' : 'ecommerce'),
    
    // Ecommerce specific
    orders: 'ecommerce',
    returns: 'ecommerce',
    
    // Operational concerns
    operations: userRole === 'franchise' ? 'franchising' : (userRole === 'admin' ? 'saas' : 'retail'),
    compliance: userRole === 'franchise' ? 'franchising' : (userRole === 'admin' ? 'saas' : 'retail'),
    security: 'saas',
    
    // Technical topics
    development: 'saas',
    infrastructure: 'saas',
    
    // SaaS specific
    subscription: 'saas',
    onboarding: 'saas',
    
    // Franchise specific
    location_management: 'franchising',
    brand_compliance: 'franchising',
    
    // Financial areas
    finance: userRole === 'franchise' ? 'franchising' : (userRole === 'seller' ? 'retail' : 'ecommerce'),
    
    // Blockchain-related topics
    blockchain_basics: 'blockchain',
    crypto_wallets: 'blockchain',
    smart_contracts: 'blockchain',
    tokenomics: 'blockchain',
    defi: 'blockchain',
    blockchain_governance: 'blockchain',
    blockchain_interoperability: 'blockchain',
    blockchain_security: 'blockchain'
  };
  
  detectedDomain = topicToDomain[detectedTopic] || 'general';
  
  return { domain: detectedDomain, topic: detectedTopic };
};

// Text-based chat completion with the AI
const getAIResponse = async (message, userRole = 'user') => {
  try {
    // Get role-specific instructions
    const roleInfo = roleSpecificInstructions[userRole] || roleSpecificInstructions.buyer;
    
    // Detect topic and domain from message
    const { domain, topic } = detectTopicAndDomain(message, userRole);
    
    // Get relevant domain knowledge
    let domainKnowledge = '';
    if (domain !== 'general') {
      // First try to find an exact topic match in the industry knowledge
      if (industryKnowledge[domain] && industryKnowledge[domain][topic]) {
        domainKnowledge = formatDomainKnowledge(industryKnowledge[domain][topic]);
      } else {
        // If no exact match, search for related topics in the message
        for (const [topicKey, topicValue] of Object.entries(industryKnowledge[domain] || {})) {
          if (message.toLowerCase().includes(topicKey.toLowerCase())) {
            domainKnowledge = formatDomainKnowledge(topicValue);
            break;
          }
        }
        
        // If still no match, select the most relevant topic from the domain based on role
        if (!domainKnowledge && industryKnowledge[domain]) {
          // Define role-to-topic priority mapping
          const rolePriorityTopics = {
            seller: ['pricing', 'inventory', 'marketing', 'customerService', 'merchandising', 'loyaltyPrograms'],
            buyer: ['pricing', 'customerService', 'returns', 'fulfillment'],
            franchise: ['locationManagement', 'brandCompliance', 'performance', 'franchiseeSupport', 'unitEconomics'],
            admin: ['security', 'performance', 'compliance', 'apiIntegration', 'userExperience'],
            developer: ['apiIntegration', 'userExperience', 'productDevelopment', 'subscriptionManagement'],
            analyst: ['analytics', 'performance', 'marketing', 'customerService'],
            blockchain: ['blockchain_basics', 'crypto_wallets', 'smart_contracts', 'tokenomics', 'defi', 'blockchain_governance', 'blockchain_interoperability', 'blockchain_security']
          };
          
          // Use the first available priority topic for this role and domain
          const priorityTopics = rolePriorityTopics[userRole] || rolePriorityTopics.buyer;
          for (const priorityTopic of priorityTopics) {
            if (industryKnowledge[domain][priorityTopic]) {
              domainKnowledge = formatDomainKnowledge(industryKnowledge[domain][priorityTopic]);
              break;
            }
          }
        }
      }
    }
    
    // Format terminology glossary if available
    const terminologyGlossary = formatTerminology(roleInfo.terminology);
    
    // Check for common questions
    let commonQuestionAnswer = '';
    if (roleInfo.commonQuestions) {
      // Handle different formats of commonQuestions (objects with Q&A or just array of questions)
      if (typeof roleInfo.commonQuestions[0] === 'object' && roleInfo.commonQuestions[0].question) {
        // Format: [{question: "...", answer: "..."}]
        for (const qa of roleInfo.commonQuestions) {
          // Simple similarity check (in production, use more advanced matching)
          if (message.toLowerCase().includes(qa.question.toLowerCase().substring(0, 10))) {
            commonQuestionAnswer = `A common question similar to yours: "${qa.question}"\n\n${qa.answer}\n\n`;
            break;
          }
        }
      } else {
        // Format: ["How do I...", "What is..."]
        for (const question of roleInfo.commonQuestions) {
          // Simple check for at least 5 characters of question being present in message
          if (question.length > 5 && message.toLowerCase().includes(question.toLowerCase().substring(0, Math.min(10, question.length)))) {
            commonQuestionAnswer = `Note: Your question is similar to a common question in this domain: "${question}"\n\n`;
            break;
          }
        }
      }
    }
    
    // Create enhanced system message
    const enhancedSystemPrompt = `${roleInfo.systemPrompt}
    
${terminologyGlossary}

${domainKnowledge}

Remember to:
1. Provide specific, actionable advice tailored to the user's role as a ${userRole}
2. Reference industry best practices and metrics when relevant
3. Avoid vague suggestions and focus on concrete steps
4. Consider the user's likely knowledge level based on their role
5. Prioritize areas that are typically important to a ${userRole}: ${roleInfo.priorityTopics.join(', ')}
6. Provide concise, helpful responses and actionable insights. Avoid placeholder data or making up information.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: enhancedSystemPrompt },
        { role: "user", content: commonQuestionAnswer + message }
      ],
      max_tokens: 800, // Increased to handle more detailed responses
      temperature: 0.7,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw new Error('Failed to get AI response. Please try again later.');
  }
};

// Transcribe audio to text using Whisper API
const transcribeAudio = async (audioBuffer) => {
  try {
    const response = await openai.audio.transcriptions.create({
      file: audioBuffer,
      model: "whisper-1",
    });

    return {
      text: response.text,
      duration: response.duration || 0
    };
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw new Error('Failed to transcribe audio. Please try again later.');
  }
};

// Generate analytics insights from data
const generateAnalyticsInsights = async (data, context, userRole = 'admin') => {
  try {
    // Get role-specific instructions
    const roleInfo = roleSpecificInstructions[userRole] || roleSpecificInstructions.admin;
    
    // Get relevant domain prompts based on context
    const analyticsPrompts = domainSpecificPrompts.analytics;
    let selectedPrompt = analyticsPrompts.dataInterpretation; // Default prompt
    
    // Determine appropriate analytics prompt based on context
    if (context.toLowerCase().includes('forecast') || context.toLowerCase().includes('predict')) {
      selectedPrompt = analyticsPrompts.salesForecasting;
    } else if (context.toLowerCase().includes('compar')) {
      selectedPrompt = analyticsPrompts.performanceComparison;
    } else if (context.toLowerCase().includes('cohort')) {
      selectedPrompt = analyticsPrompts.cohortAnalysis;
    } else if (context.toLowerCase().includes('correlat') || context.toLowerCase().includes('relationship')) {
      selectedPrompt = analyticsPrompts.multivariate;
    } else if (context.toLowerCase().includes('blockchain') || context.toLowerCase().includes('crypto') || 
               context.toLowerCase().includes('token') || context.toLowerCase().includes('wallet') || 
               context.toLowerCase().includes('smart contract') || context.toLowerCase().includes('defi')) {
      // For blockchain-related analytics, use a specialized prompt
      selectedPrompt = `You are a blockchain and cryptocurrency analytics expert. Analyze the provided [data_subject] data, focusing on [target_metric]. Generate insights about [business_area] trends, patterns, and anomalies. Highlight significant on-chain metrics and provide actionable recommendations for [user_role]s. Include appropriate blockchain KPIs and terminology in your analysis.`;
    }
    
    // Replace placeholders in the selected prompt
    const filledPrompt = selectedPrompt
      .replace('[user_role]', userRole)
      .replace('[data_subject]', context)
      .replace('[business_goal]', roleInfo.priorityTopics[0])
      .replace('[time_period]', 'quarter') // Default time period
      .replace('[comparison_subject_1]', 'current period')
      .replace('[comparison_subject_2]', 'previous period')
      .replace('[cohort_parameter]', 'acquisition date')
      .replace('[target_metric]', roleInfo.priorityTopics[0])
      .replace('[business_area]', context);
    
    // Get relevant domain knowledge based on role
    const { domain, topic } = detectTopicAndDomain(context, userRole);
    let domainKnowledge = '';
    if (domain !== 'general' && industryKnowledge[domain]) {
      for (const [topicKey, topicValue] of Object.entries(industryKnowledge[domain])) {
        if (context.toLowerCase().includes(topicKey.toLowerCase())) {
          domainKnowledge = formatDomainKnowledge(topicValue);
          break;
        }
      }
    }
    
    // Format terminology glossary
    const terminologyGlossary = formatTerminology(roleInfo.terminology);
    
    // Construct enhanced prompt with domain knowledge, terminology, and selected prompt
    const enhancedPrompt = `
      You are a specialized AI business analyst for a ${userRole}. 
      
      ${roleInfo.systemPrompt}
      
      ${terminologyGlossary}
      
      ${domainKnowledge}
      
      Analyze the following business data using this approach:
      ${filledPrompt}
      
      Context: ${context}
      
      Data: ${JSON.stringify(data, null, 2)}
      
      Focus on metrics and recommendations most relevant to a ${userRole}, particularly involving these areas: ${roleInfo.priorityTopics.join(', ')}.
      
      Please format your response as JSON with the following structure:
      {
        "summary": "Brief overview of the analysis tailored for a ${userRole}",
        "keyInsights": ["Insight 1", "Insight 2", ...],
        "trends": ["Trend 1", "Trend 2", ...],
        "recommendations": ["Recommendation 1", "Recommendation 2", ...]
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: "You are an AI business analyst that provides data-driven insights." },
        { role: "user", content: enhancedPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.5,
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('Error generating analytics insights:', error);
    throw new Error('Failed to generate insights. Please try again later.');
  }
};

module.exports = {
  openai,
  getAIResponse,
  transcribeAudio,
  generateAnalyticsInsights,
  getDomainKnowledge, // Exported for use in other modules if needed
  getRoleInstructions, // Exported for use in other modules if needed
  formatDomainKnowledge, // For formatting domain knowledge into human-readable text
  formatTerminology, // For formatting terminology glossaries
  detectTopicAndDomain, // For detecting topics and domains from user messages
  domainSpecificPrompts // Exposing domain-specific prompt templates
};
