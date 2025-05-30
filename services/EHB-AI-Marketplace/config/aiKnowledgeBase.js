/**
 * AI Knowledge Base
 * Contains domain-specific knowledge for the AI assistant to provide better, more specialized responses
 */

// Industry-specific knowledge organized by domain
const industryKnowledge = {
  blockchain: {
    basics: {
      description: "Fundamental concepts of blockchain technology and cryptocurrency systems",
      bestPractices: [
        "Prioritize security through proper key management and multi-signature approaches",
        "Implement thorough testing protocols for all smart contracts before deployment",
        "Use established blockchain frameworks and libraries rather than building from scratch",
        "Store sensitive private keys in hardware wallets for maximum security",
        "Implement proper transaction validation and verification mechanisms",
        "Follow established consensus mechanism best practices",
        "Maintain comprehensive documentation for all blockchain implementations"
      ],
      keyMetrics: [
        "Transaction throughput and confirmation time",
        "Network hash rate and security level",
        "Smart contract gas efficiency",
        "Node decentralization metrics",
        "Transaction fee economics",
        "Nakamoto coefficient (decentralization measurement)",
        "Transaction finality time"
      ],
      challenges: [
        "Scalability limitations with high transaction volumes",
        "Energy consumption concerns for proof-of-work systems",
        "Regulatory compliance across different jurisdictions",
        "Balancing decentralization with performance requirements",
        "User experience complexity versus traditional systems",
        "Blockchain trilemma (scalability, security, decentralization)",
        "Implementation of complex consensus mechanisms"
      ]
    },
    cryptoWallets: {
      description: "Digital wallet systems for storing, sending, and receiving cryptocurrencies",
      bestPractices: [
        "Implement hierarchical deterministic (HD) wallet architecture for enhanced security",
        "Provide clear transaction confirmation mechanisms to prevent errors",
        "Support multiple address formats and coin types through standardized derivation paths",
        "Implement robust backup and recovery mechanisms including seed phrases",
        "Use hardware security modules (HSM) for institutional-grade custody solutions",
        "Implement strong entropy sources for key generation",
        "Support BIP39, BIP44, and other relevant Bitcoin Improvement Proposals",
        "Implement secure element storage for private keys where available",
        "Use multi-factor authentication for all sensitive wallet operations"
      ],
      keyMetrics: [
        "Wallet security audit results",
        "Transaction success rate",
        "Key recovery effectiveness",
        "User adoption and retention",
        "Transaction fee optimization",
        "Time to recovery during disaster scenarios",
        "Cross-chain asset support percentage"
      ],
      challenges: [
        "Ensuring private key security while maintaining usability",
        "Supporting multiple blockchain networks and tokens",
        "Managing transaction fee volatility",
        "Implementing robust backup solutions that users will actually use",
        "Balancing self-custody principles with user-friendly recovery options",
        "Preventing social engineering attacks against wallet users",
        "Maintaining compatibility with evolving blockchain standards"
      ]
    },
    smartContracts: {
      description: "Self-executing code deployed on blockchain networks to automate transactions and agreements",
      bestPractices: [
        "Follow established design patterns for common contract functionality",
        "Conduct thorough code audits by multiple independent security firms",
        "Implement circuit breakers and pausing mechanisms for emergency situations",
        "Use formal verification where possible for critical contract logic",
        "Develop comprehensive test suites covering all possible edge cases",
        "Implement OpenZeppelin security standards for common functionality",
        "Build upgradeability patterns for long-term contract maintenance",
        "Use version control systems with proper code review processes",
        "Implement comprehensive event emission for all state changes"
      ],
      keyMetrics: [
        "Code coverage percentage for tests",
        "Gas optimization metrics",
        "Security vulnerability scan results",
        "Contract interaction success rate",
        "Exception handling effectiveness",
        "Successful upgrade implementation rate",
        "Transaction reversion percentage"
      ],
      challenges: [
        "Immutability of deployed code makes updates challenging",
        "Gas optimization versus code readability tradeoffs",
        "Front-running and other blockchain-specific attack vectors",
        "Interoperability between different contract standards",
        "Managing oracle dependencies for external data",
        "Implementing complex access control systems",
        "Balancing transparency with confidentiality requirements",
        "Testing complex state transitions and edge cases"
      ]
    },
    tokenomics: {
      description: "Economic design and incentive mechanisms for cryptocurrency tokens and blockchain networks",
      bestPractices: [
        "Design token utility that creates genuine value within the ecosystem",
        "Implement transparent token distribution with fair launch principles",
        "Create balanced staking and reward mechanisms to encourage desired behaviors",
        "Establish clear governance frameworks for protocol decision-making",
        "Design mechanisms to manage token supply and inflation rates",
        "Model token economics using simulation tools before implementation",
        "Implement vesting schedules for team and investor allocations",
        "Create clear documentation of economic policies and mechanisms",
        "Establish emergency response procedures for economic attacks"
      ],
      keyMetrics: [
        "Token velocity and circulation statistics",
        "Staking participation percentage",
        "Protocol revenue versus token market capitalization",
        "Governance participation rates",
        "Token holder distribution metrics",
        "Token liquidity depth across exchanges",
        "Economic attack resistance metrics",
        "Validator/miner profitability measurements"
      ],
      challenges: [
        "Regulatory uncertainty around token classification",
        "Balancing initial distribution fairness with team/investor incentives",
        "Preventing excessive speculation versus genuine utility",
        "Designing sustainable economic models that function in bear markets",
        "Mitigating the impacts of whale holders on token price stability",
        "Preventing economic attacks like 51% attacks or flash loan exploits",
        "Creating effective governance participation incentives",
        "Balancing tokenomic incentives during different market cycles"
      ]
    },
    blockchainSecurity: {
      description: "Protection mechanisms and best practices for securing blockchain applications and cryptocurrency assets",
      bestPractices: [
        "Implement role-based access control for administrative functions",
        "Use time locks for sensitive operations requiring review periods",
        "Adopt multi-signature schemes for high-value transactions",
        "Conduct regular security audits and penetration testing",
        "Monitor transaction patterns for anomaly detection",
        "Implement key ceremony procedures for critical infrastructure",
        "Establish secure backup strategies for all critical keys",
        "Create comprehensive incident response procedures",
        "Implement defense in depth security architecture"
      ],
      keyMetrics: [
        "Security incident frequency and severity",
        "Time to detect and respond to vulnerabilities",
        "Code audit coverage and findings",
        "Multi-signature adoption rate",
        "Security failure impact measurements",
        "Incident response time metrics",
        "Security vulnerability disclosure resolution time"
      ],
      challenges: [
        "Securing private keys across organizational boundaries",
        "Protecting against social engineering and insider threats",
        "Balancing decentralization with security governance",
        "Managing cross-chain security concerns",
        "Developing security standards that keep pace with innovation",
        "Implementing secure key recovery mechanisms",
        "Balancing security complexity with user experience",
        "Addressing quantum computing threats to cryptographic systems"
      ]
    },
    decentralizedFinance: {
      description: "Financial systems and services built on blockchain infrastructure without centralized intermediaries",
      bestPractices: [
        "Implement comprehensive economic security analysis for all protocols",
        "Use formal verification for critical financial logic",
        "Establish progressive decentralization roadmaps",
        "Create transparent risk disclosure mechanisms",
        "Implement robust oracle solutions with fallback mechanisms",
        "Design composable protocols that integrate securely with other DeFi systems",
        "Implement thorough audit procedures with multiple security firms",
        "Establish bug bounty programs with meaningful rewards"
      ],
      keyMetrics: [
        "Total Value Locked (TVL) in protocol",
        "Economic security ratio (protocol value vs secured assets)",
        "Oracle price deviation frequency and magnitude",
        "Protocol revenue and fee distribution",
        "Governance participation rate",
        "Risk-adjusted yield metrics",
        "Flash loan utilization and risk metrics",
        "Liquidation efficiency and health"
      ],
      challenges: [
        "Managing complex economic security models",
        "Preventing oracle manipulation attacks",
        "Balancing capital efficiency with security",
        "Managing systemic risk through protocol composability",
        "Designing effective liquidation mechanisms",
        "Implementing fair governance with adequate technical expertise",
        "Addressing regulatory uncertainty in financial services",
        "Creating accessible user experiences for complex financial instruments"
      ]
    },
    blockchainGovernance: {
      description: "Decision-making processes and mechanisms for decentralized blockchain protocols and applications",
      bestPractices: [
        "Create transparent voting procedures with adequate discussion periods",
        "Implement on-chain governance with delegation capabilities",
        "Design quadratic or conviction voting systems to prevent plutocracy",
        "Establish multiple stakeholder representation (users, developers, token holders)",
        "Create formal governance proposal frameworks",
        "Implement timelock mechanisms for governance actions",
        "Design incentives for governance participation",
        "Maintain comprehensive governance documentation"
      ],
      keyMetrics: [
        "Governance participation rate",
        "Proposal implementation success rate",
        "Voter distribution across stakeholder groups",
        "Decision-making time efficiency",
        "Delegation concentration metrics",
        "Contentious vote frequency and resolution",
        "Governance participant retention rate",
        "Proposal quality metrics"
      ],
      challenges: [
        "Addressing voter apathy and low participation",
        "Balancing technical decision requirements with broad participation",
        "Managing contentious forks or governance splits",
        "Designing incentives that prevent vote buying",
        "Creating effective delegation mechanisms",
        "Building user-friendly governance interfaces",
        "Addressing regulatory concerns around decentralized governance",
        "Preventing capture by special interest groups"
      ]
    },
    blockchainInteroperability: {
      description: "Technologies and standards enabling different blockchain networks to communicate and transfer value",
      bestPractices: [
        "Implement industry-standard cross-chain communication protocols",
        "Use multi-signature validator sets for bridge security",
        "Establish consistent asset naming and identification standards",
        "Implement robust verification of finality proofs across chains",
        "Create comprehensive monitoring systems for bridge operations",
        "Design mechanisms to handle temporary network outages",
        "Establish clear security models for cross-chain value transfers",
        "Implement transaction replay protection across networks"
      ],
      keyMetrics: [
        "Cross-chain transaction success rate",
        "Bridge security deposit ratio to transferred value",
        "Bridge validator diversity and distribution",
        "Finality verification time across networks",
        "Asset representation consistency across chains",
        "Cross-chain message latency",
        "Bridge utilization and economic sustainability",
        "Security incident frequency and severity"
      ],
      challenges: [
        "Securing cross-chain bridges against attacks",
        "Managing finality differences between blockchain networks",
        "Creating consistent asset representations across chains",
        "Balancing decentralization with bridge efficiency",
        "Implementing effective validator incentives",
        "Addressing regulatory concerns across multiple jurisdictions",
        "Handling blockchain reorganizations and forks",
        "Managing complex state verification across consensus mechanisms"
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
    },
    operationsManagement: {
      description: "Optimization of healthcare facility operations, resource allocation, and workflow efficiency",
      bestPractices: [
        "Implement lean methodology to eliminate waste in clinical processes",
        "Use data analytics to predict patient volume and optimize staffing",
        "Develop standardized protocols for common procedures and treatments",
        "Create dedicated fast-track pathways for routine or lower-acuity cases",
        "Establish regular process improvement reviews with frontline staff input"
      ],
      keyMetrics: [
        "Patient throughput time",
        "Resource utilization rates",
        "Staff productivity measures",
        "Cost per case/encounter",
        "Operational expense ratio"
      ],
      challenges: [
        "Balancing cost control with quality of care",
        "Managing seasonal and unexpected demand fluctuations",
        "Integrating new technologies into existing workflows",
        "Regulatory compliance while maintaining efficiency",
        "Coordinating across departments with different priorities"
      ]
    },
    healthcareCompliance: {
      description: "Adherence to healthcare regulations, quality standards, and risk management protocols",
      bestPractices: [
        "Develop a comprehensive compliance program with regular audits",
        "Implement automated monitoring systems for key compliance metrics",
        "Provide ongoing staff education on regulatory requirements",
        "Create clear documentation standards and templates",
        "Establish a designated compliance officer or committee"
      ],
      keyMetrics: [
        "Regulatory citation rate",
        "Compliance audit scores",
        "Documentation completeness percentage",
        "Staff compliance training completion rate",
        "Adverse event reporting timeliness"
      ],
      challenges: [
        "Keeping pace with changing regulations",
        "Balancing compliance requirements with clinical workflow",
        "Managing protected health information security",
        "Coordinating compliance across multiple facilities or departments",
        "Maintaining accurate and complete documentation under time constraints"
      ]
    },
    healthInformatics: {
      description: "Management and use of healthcare data and information systems to improve patient care and operations",
      bestPractices: [
        "Design EHR workflows that align with clinical processes",
        "Implement decision support tools at point of care",
        "Establish data governance protocols for information quality",
        "Create interoperability standards for system integration",
        "Develop analytics capabilities that provide actionable insights"
      ],
      keyMetrics: [
        "EHR adoption and utilization rates",
        "Clinical decision support alert response",
        "Data completeness and accuracy measures",
        "System uptime and reliability",
        "User satisfaction with health IT systems"
      ],
      challenges: [
        "Integration of disparate information systems",
        "Balancing data access with privacy protections",
        "Managing alert fatigue among clinical staff",
        "Extracting meaningful insights from large data sets",
        "Keeping pace with rapid technological changes"
      ]
    },
    patientExperience: {
      description: "Enhancement of all aspects of the patient journey through the healthcare system",
      bestPractices: [
        "Implement regular patient experience surveying with actionable feedback loops",
        "Create clear communication protocols for patient-provider interactions",
        "Design physical spaces with patient comfort and privacy in mind",
        "Develop digital tools for patient engagement and self-management",
        "Train staff specifically in service excellence and empathetic communication"
      ],
      keyMetrics: [
        "Net Promoter Score",
        "HCAHPS or other standardized patient satisfaction scores",
        "Patient portal engagement rates",
        "Wait time measures",
        "Complaint and compliment rates"
      ],
      challenges: [
        "Meeting diverse patient expectations and preferences",
        "Balancing digital engagement with personal touch",
        "Maintaining service quality during high-volume periods",
        "Addressing non-clinical factors that impact patient experience",
        "Engaging all staff levels in patient experience improvement"
      ]
    }
  },
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
    },
    pricing: {
      description: "Strategic pricing of products to maximize profit while remaining competitive",
      bestPractices: [
        "Conduct regular competitor price analysis",
        "Implement dynamic pricing during peak demand periods",
        "Bundle complementary products to increase average order value",
        "Use psychological pricing strategies (e.g., $19.99 instead of $20)",
        "Create tiered pricing options for different customer segments"
      ],
      keyMetrics: [
        "Price elasticity",
        "Margin percentage",
        "Competitive price index",
        "Discount effectiveness",
        "Price perception score"
      ],
      challenges: [
        "Price wars with competitors",
        "Rising supplier costs",
        "Customer price sensitivity",
        "Maintaining perceived value",
        "Cross-channel pricing consistency"
      ]
    },
    customerService: {
      description: "Managing customer inquiries, complaints, and support throughout the shopping experience",
      bestPractices: [
        "Offer omnichannel support (phone, email, chat, social media)",
        "Create a comprehensive self-service knowledge base",
        "Implement post-purchase follow-up communications",
        "Train staff on product knowledge and conflict resolution",
        "Set clear response time expectations"
      ],
      keyMetrics: [
        "Customer satisfaction score (CSAT)",
        "Net Promoter Score (NPS)",
        "First contact resolution rate",
        "Average response time",
        "Customer effort score"
      ],
      challenges: [
        "Managing peak season volume",
        "Maintaining consistent quality across channels",
        "Difficult customers and escalations",
        "Staff turnover and training",
        "Balancing efficiency with personalization"
      ]
    },
    merchandising: {
      description: "Strategic product display and promotion to maximize sales and enhance customer experience",
      bestPractices: [
        "Use planograms for consistent and optimized product placement",
        "Implement cross-merchandising of complementary products",
        "Rotate seasonal displays based on purchasing trends",
        "Optimize product placement based on eye-level visibility principles",
        "Create impactful point-of-purchase displays for high-margin items"
      ],
      keyMetrics: [
        "Sales per square foot",
        "Category performance metrics",
        "Conversion rate by display location",
        "Average basket size from merchandising efforts",
        "Visual merchandising compliance rate"
      ],
      challenges: [
        "Limited floor or shelf space allocation",
        "Balancing brand requirements with store layout",
        "Keeping displays fresh and engaging",
        "Staff compliance with merchandising standards",
        "Measuring merchandising effectiveness accurately"
      ]
    },
    loyaltyPrograms: {
      description: "Structured rewards systems designed to increase customer retention and lifetime value",
      bestPractices: [
        "Offer tiered loyalty levels with increasing benefits",
        "Personalize rewards based on purchase history and preferences",
        "Make earning and redeeming points simple and transparent",
        "Incorporate gamification elements to increase engagement",
        "Regularly communicate program value through multiple channels"
      ],
      keyMetrics: [
        "Program enrollment rate",
        "Active members percentage",
        "Redemption rate",
        "Incremental sales from loyalty members",
        "Customer lifetime value increase for members"
      ],
      challenges: [
        "Loyalty program fatigue among customers",
        "Cost of rewards versus program ROI",
        "Data management and privacy concerns",
        "Technical integration across sales channels",
        "Maintaining program excitement long-term"
      ]
    }
  },
  ecommerce: {
    fulfillment: {
      description: "The process of receiving, processing, and delivering orders to customers",
      bestPractices: [
        "Optimize warehouse layout for efficient picking and packing",
        "Implement barcode scanning to reduce errors",
        "Offer multiple shipping options with transparent pricing",
        "Use automated packaging systems for high-volume products",
        "Establish clear return processes and policies"
      ],
      keyMetrics: [
        "Order accuracy rate",
        "Average fulfillment time",
        "Shipping cost per order",
        "Return rate",
        "On-time delivery percentage"
      ],
      challenges: [
        "Handling order spikes during sales events",
        "International shipping complexities",
        "Dimensional weight pricing from carriers",
        "Packaging sustainability",
        "Last-mile delivery issues"
      ]
    },
    digitalMarketing: {
      description: "Online promotion strategies to attract and convert customers",
      bestPractices: [
        "Implement SEO optimization for product pages",
        "Create targeted email marketing campaigns based on customer behavior",
        "Use retargeting ads for abandoned carts",
        "Leverage social proof through reviews and testimonials",
        "Develop content marketing that addresses customer pain points"
      ],
      keyMetrics: [
        "Conversion rate",
        "Cost per acquisition",
        "Return on ad spend (ROAS)",
        "Email open and click-through rates",
        "Social engagement metrics"
      ],
      challenges: [
        "Rising digital advertising costs",
        "Algorithm changes on platforms",
        "Ad fatigue and banner blindness",
        "Attribution modeling across channels",
        "Content creation resources"
      ]
    },
    websiteOptimization: {
      description: "Improving website performance and user experience to increase conversions",
      bestPractices: [
        "Optimize page load speed (under 3 seconds)",
        "Implement mobile-first design principles",
        "Use A/B testing for key landing pages",
        "Simplify the checkout process (fewer form fields)",
        "Provide detailed product information with high-quality images"
      ],
      keyMetrics: [
        "Page load time",
        "Bounce rate",
        "Average session duration",
        "Shopping cart abandonment rate",
        "Conversion funnel dropoff rates"
      ],
      challenges: [
        "Cross-browser and device compatibility",
        "Balancing rich media with performance",
        "Security concerns (especially during checkout)",
        "Keeping up with UX trends and expectations",
        "Technical debt in legacy systems"
      ]
    },
    marketplaceManagement: {
      description: "Strategy and operations for selling products across multiple online marketplaces",
      bestPractices: [
        "Maintain consistent product information across all channels",
        "Develop marketplace-specific pricing strategies",
        "Optimize product listings for each marketplace's search algorithm",
        "Integrate inventory systems to prevent overselling",
        "Analyze channel performance to allocate resources effectively"
      ],
      keyMetrics: [
        "Channel-specific profit margins",
        "Marketplace ranking positions",
        "Buy box win rate (for Amazon)",
        "Cross-marketplace customer acquisition cost",
        "Return rates by marketplace"
      ],
      challenges: [
        "Managing different fee structures across marketplaces",
        "Maintaining brand consistency with limited control",
        "Keeping up with changing marketplace policies",
        "Handling marketplace-specific customer service",
        "Balancing direct sales vs. marketplace presence"
      ]
    },
    omnichannel: {
      description: "Creating seamless customer experiences across online and offline shopping channels",
      bestPractices: [
        "Implement unified inventory visibility across all channels",
        "Offer buy online, pick up in store (BOPIS) options",
        "Create consistent pricing and promotions across channels",
        "Develop cross-channel customer recognition systems",
        "Enable in-store returns for online purchases"
      ],
      keyMetrics: [
        "Customer channel migration rates",
        "Cross-channel purchase frequency",
        "Omnichannel customer lifetime value",
        "BOPIS adoption rate",
        "Channel influence on conversion"
      ],
      challenges: [
        "Technology integration between legacy and new systems",
        "Attribution for sales that cross channels",
        "Training staff on omnichannel processes",
        "Managing inventory across multiple locations",
        "Creating consistent experiences with varying touchpoints"
      ]
    }
  },
  franchising: {
    locationManagement: {
      description: "Overseeing multiple franchise locations to ensure consistent operations and performance",
      bestPractices: [
        "Standardize operations with detailed franchise manuals",
        "Implement centralized training programs for franchise owners",
        "Conduct regular quality audits across locations",
        "Create communication channels between franchisees to share best practices",
        "Develop territory protection policies to prevent cannibalization"
      ],
      keyMetrics: [
        "Same-store sales growth",
        "Location compliance score",
        "Franchisee satisfaction index",
        "Time to profitability for new locations",
        "Cross-location performance variance"
      ],
      challenges: [
        "Maintaining brand consistency across locations",
        "Supporting underperforming franchisees",
        "Local market adaptations while preserving core brand",
        "Managing expansion pace and territory selection",
        "Franchisee recruitment and retention"
      ]
    },
    brandCompliance: {
      description: "Ensuring all franchise locations adhere to brand standards and guidelines",
      bestPractices: [
        "Create comprehensive brand guidelines with visual examples",
        "Provide pre-approved marketing materials and templates",
        "Conduct regular compliance visits with scoring systems",
        "Offer digital asset management for easy access to approved materials",
        "Implement recognition programs for high-compliance franchisees"
      ],
      keyMetrics: [
        "Brand compliance audit score",
        "Brand standards violation rate",
        "Mystery shopper ratings",
        "Customer perception consistency across locations",
        "Marketing material usage rate"
      ],
      challenges: [
        "Balancing franchise independence with brand control",
        "Enforcing compliance without damaging relationships",
        "Keeping guidelines current with market trends",
        "Technology adoption for compliance monitoring",
        "Cultural adaptations in international markets"
      ]
    },
    performance: {
      description: "Tracking and improving the business results of franchise locations",
      bestPractices: [
        "Implement standardized performance dashboards for all franchisees",
        "Create benchmarking reports comparing similar locations",
        "Establish performance improvement plans for struggling franchisees",
        "Conduct quarterly business reviews with each location",
        "Develop mentorship programs pairing high and low performers"
      ],
      keyMetrics: [
        "Gross margin percentage",
        "Average transaction value",
        "Customer acquisition cost",
        "Labor cost percentage",
        "Return on invested capital"
      ],
      challenges: [
        "Data collection consistency across locations",
        "Accounting for local market differences in benchmarking",
        "Getting buy-in for performance improvement initiatives",
        "Limited visibility into franchisee financials",
        "Resource allocation for supporting underperformers"
      ]
    },
    franchiseeSupport: {
      description: "Systems and programs to help franchise owners succeed in their business operations",
      bestPractices: [
        "Provide comprehensive initial training programs",
        "Establish dedicated franchise business consultants for ongoing support",
        "Create franchise advisory councils for two-way communication",
        "Develop technology platforms for knowledge sharing and best practices",
        "Offer group purchasing programs to leverage economies of scale"
      ],
      keyMetrics: [
        "Support ticket resolution time",
        "Franchisee satisfaction with support services",
        "Utilization rate of support resources",
        "Improvement in performance after interventions",
        "Knowledge base usage statistics"
      ],
      challenges: [
        "Scaling support across growing franchise networks",
        "Balancing standardized support with individualized needs",
        "Managing support expectations versus contractual obligations",
        "Technological adoption barriers among franchisees",
        "Measuring support effectiveness and return on investment"
      ]
    },
    unitEconomics: {
      description: "Financial modeling and management of individual franchise location profitability",
      bestPractices: [
        "Develop detailed financial models for prospective franchisees",
        "Establish clear benchmarks for financial performance by location type",
        "Provide regular financial review sessions with franchisees",
        "Offer specialized accounting and tax guidance for franchise operations",
        "Create tools for labor optimization and cost control"
      ],
      keyMetrics: [
        "EBITDA as percentage of sales",
        "Breakeven point analysis",
        "Royalty-to-sales ratio sustainability",
        "Prime cost percentage (labor + COGS)",
        "Return on initial franchise investment"
      ],
      challenges: [
        "Regional variations in operating costs",
        "Balancing franchisor revenue needs with franchisee profitability",
        "Adapting to minimum wage and labor law changes",
        "Managing occupancy cost increases over time",
        "Accurately forecasting new location performance"
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
    },
    creditRiskManagement: {
      description: "Processes to assess, monitor, and mitigate risks associated with lending activities",
      bestPractices: [
        "Implement multi-factor credit scoring models that combine traditional and alternative data",
        "Establish consistent loan review processes with clear escalation paths",
        "Develop early warning systems to identify deteriorating credit conditions",
        "Create specialized approaches for different portfolio segments (consumer, commercial, etc.)",
        "Maintain robust documentation standards for all credit decisions"
      ],
      keyMetrics: [
        "Probability of default (PD) accuracy",
        "Loss given default (LGD) ratios",
        "Risk-adjusted return on capital (RAROC)",
        "Non-performing loan ratios",
        "Provision coverage ratio"
      ],
      challenges: [
        "Balancing risk management with growth objectives",
        "Adapting to changing regulatory requirements",
        "Maintaining consistency across different lending groups",
        "Managing concentration risks in specific sectors",
        "Incorporating economic forecasts into risk models"
      ]
    },
    digitalBanking: {
      description: "Technology-enabled banking services delivered through online and mobile channels",
      bestPractices: [
        "Design intuitive user interfaces based on customer journey mapping",
        "Implement omnichannel capabilities that allow seamless transition between channels",
        "Develop robust authentication systems that balance security and convenience",
        "Create personalized financial insights using transaction data analytics",
        "Establish API-first architecture to enable rapid feature development"
      ],
      keyMetrics: [
        "Digital adoption rate",
        "Mobile app rating and engagement",
        "Digital transaction percentage vs. branch/ATM",
        "Feature utilization rates",
        "Customer effort score for digital journeys"
      ],
      challenges: [
        "Ensuring security while maintaining user experience",
        "Managing technology integration with legacy core systems",
        "Meeting diverse customer segment needs in digital interfaces",
        "Responding to rapid competitive innovation",
        "Balancing self-service with human assistance options"
      ]
    },
    complianceManagement: {
      description: "Programs ensuring adherence to financial regulations, industry standards, and internal policies",
      bestPractices: [
        "Establish clear governance structures with defined accountability",
        "Implement risk-based compliance monitoring programs",
        "Develop comprehensive training tailored to specific role requirements",
        "Create automated compliance controls integrated into business processes",
        "Maintain regulatory change management system with impact assessment"
      ],
      keyMetrics: [
        "Regulatory exam ratings",
        "Compliance testing results",
        "Training completion and effectiveness scores",
        "Self-identified vs. externally identified issues ratio",
        "Remediation timeliness metrics"
      ],
      challenges: [
        "Keeping pace with evolving regulatory requirements",
        "Balancing compliance activities with business objectives",
        "Managing compliance across multiple jurisdictions",
        "Integrating compliance considerations into product development",
        "Demonstrating compliance program effectiveness"
      ]
    },
    paymentProcessing: {
      description: "Systems and networks that enable the transfer of funds between accounts or financial institutions",
      bestPractices: [
        "Implement real-time fraud monitoring systems with machine learning capabilities",
        "Develop streamlined onboarding processes with risk-based due diligence",
        "Create clear chargeback management procedures and merchant education",
        "Establish robust reconciliation and settlement processes",
        "Design scalable processing architecture with redundancy"
      ],
      keyMetrics: [
        "Transaction approval rate",
        "Fraud loss percentage",
        "Processing cost per transaction",
        "System availability/uptime",
        "Settlement cycle time"
      ],
      challenges: [
        "Balancing fraud prevention with payment friction",
        "Adapting to new payment technologies and standards",
        "Managing interchange and processing cost pressures",
        "Ensuring compliance with payment card industry standards",
        "Supporting international payment complexity"
      ]
    }
  },
  saas: {
    customerSuccess: {
      description: "Proactive strategies to ensure customers achieve their desired outcomes with the software",
      bestPractices: [
        "Develop structured customer onboarding processes",
        "Create health scores to identify at-risk accounts",
        "Implement regular business reviews with key accounts",
        "Build self-service resources for common customer needs",
        "Establish customer success playbooks for different segments"
      ],
      keyMetrics: [
        "Net Revenue Retention (NRR)",
        "Customer health score trends",
        "Time to value",
        "Product adoption rate",
        "Expansion revenue percentage"
      ],
      challenges: [
        "Scaling customer success with business growth",
        "Balancing high-touch and tech-touch models",
        "Proving customer success ROI internally",
        "Managing customer expectations vs. product capabilities",
        "Coordinating across departmental boundaries"
      ]
    },
    productDevelopment: {
      description: "Process of building, testing, and iterating on software products based on market needs",
      bestPractices: [
        "Implement agile development methodologies",
        "Maintain a customer-informed product roadmap",
        "Establish clear feature prioritization frameworks",
        "Use data-driven decision making for product enhancements",
        "Conduct regular user testing and feedback sessions"
      ],
      keyMetrics: [
        "Feature adoption rates",
        "Development cycle time",
        "Bug fix turnaround time",
        "User satisfaction score (CSAT/NPS for new features)",
        "Feature usage vs. development cost"
      ],
      challenges: [
        "Balancing new features vs. technical debt",
        "Coordinating development across distributed teams",
        "Managing scope creep in product requirements",
        "Prioritizing between customer requests and strategic direction",
        "Maintaining product quality while increasing velocity"
      ]
    },
    subscriptionManagement: {
      description: "Systems and processes for handling recurring revenue models and subscription lifecycles",
      bestPractices: [
        "Implement automated billing and subscription management",
        "Develop proactive renewal workflows and communications",
        "Create flexible packaging and pricing tiers",
        "Design effective upgrade and cross-sell pathways",
        "Establish early warning systems for churn risk"
      ],
      keyMetrics: [
        "Monthly recurring revenue (MRR)",
        "Customer lifetime value (CLTV)",
        "Churn rate by customer segment",
        "Renewal rate and forecasting accuracy",
        "Average revenue per user (ARPU)"
      ],
      challenges: [
        "Managing complex billing scenarios and custom contracts",
        "Accurately forecasting subscription revenue",
        "Handling payment failures and dunning processes",
        "Balancing pricing changes with customer satisfaction",
        "Creating effective upgrade paths without friction"
      ]
    },
    userExperience: {
      description: "Design and optimization of software interfaces and interactions for maximum usability",
      bestPractices: [
        "Conduct regular usability testing with actual users",
        "Implement consistent design systems across products",
        "Create user personas to guide feature development",
        "Use behavioral analytics to identify friction points",
        "Develop progressive onboarding experiences"
      ],
      keyMetrics: [
        "Task completion rate",
        "User error rate",
        "Time on task",
        "System Usability Scale (SUS) score",
        "Feature discoverability metrics"
      ],
      challenges: [
        "Balancing feature richness with simplicity",
        "Designing for multiple user skill levels",
        "Maintaining consistency across product expansions",
        "Adapting to changing user expectations over time",
        "Measuring the ROI of UX improvements"
      ]
    },
    apiIntegration: {
      description: "Development and management of application programming interfaces for system connectivity",
      bestPractices: [
        "Implement consistent API documentation and standards",
        "Establish versioning strategies for API evolution",
        "Create developer portals and self-service resources",
        "Monitor API performance and usage patterns",
        "Build robust error handling and rate limiting"
      ],
      keyMetrics: [
        "API adoption rate",
        "API response time",
        "Error rate by endpoint",
        "Developer satisfaction score",
        "Integration time to completion"
      ],
      challenges: [
        "Maintaining backward compatibility while evolving",
        "Securing APIs against vulnerabilities",
        "Scaling infrastructure for variable load",
        "Supporting diverse integration patterns and partners",
        "Balancing standardization with customer-specific needs"
      ]
    }
  }
};

// Role-specific instructions for the AI assistant
const roleSpecificInstructions = {
  blockchain: {
    systemPrompt: "You are a specialized AI assistant for blockchain and cryptocurrency professionals. You have extensive expertise in blockchain technologies, smart contracts, wallet development, token economics, crypto security, DeFi protocols, blockchain governance, and cross-chain interoperability. Your goal is to help users understand complex blockchain concepts, implement secure wallet solutions, navigate the cryptocurrency ecosystem, and develop secure decentralized applications. Provide accurate, technically sound information while maintaining appropriate security considerations and best practices. You can explain complex blockchain concepts in simple terms while also providing deep technical insights for developers.",
    priorityTopics: ["wallet_security", "blockchain_basics", "smart_contracts", "tokenomics", "crypto_regulations", "defi_protocols", "blockchain_governance", "blockchain_interoperability", "consensus_mechanisms", "blockchain_scalability"],
    terminology: {
      "ERC20": "Ethereum Request for Comment 20 - A token standard for fungible tokens on Ethereum",
      "BEP20": "Binance Smart Chain Evolution Proposal 20 - A token standard on Binance Smart Chain compatible with ERC20",
      "HD Wallet": "Hierarchical Deterministic Wallet - A wallet system that generates keys from a single seed for enhanced security and recovery",
      "Private Key": "Cryptographic key that allows access to cryptocurrency holdings, must be kept secure at all times",
      "Gas Fee": "Transaction processing fee on Ethereum and similar networks, paid to validators/miners",
      "Smart Contract": "Self-executing code deployed on a blockchain that automatically enforces agreements",
      "Web3": "Next generation of internet applications built on decentralized blockchain technology",
      "DeFi": "Decentralized Finance - Financial services and products built on blockchain without centralized intermediaries",
      "DAO": "Decentralized Autonomous Organization - Organization represented by rules encoded as a computer program, transparent and controlled by members",
      "NFT": "Non-Fungible Token - Unique digital asset verified using blockchain technology",
      "Multi-sig": "Multi-signature - Security feature requiring multiple signatures to authorize a transaction",
      "Layer 2": "Scaling solution built on top of an existing blockchain (Layer 1) to improve transaction throughput and reduce fees",
      "Rollup": "Layer 2 scaling solution that bundles multiple transactions into a single proof on the main chain",
      "MEV": "Maximal Extractable Value - Value that can be extracted from blockchain users through transaction ordering manipulation",
      "EIP": "Ethereum Improvement Proposal - Design document providing information to the Ethereum community about new features",
      "BIP": "Bitcoin Improvement Proposal - Design document providing information to the Bitcoin community about new features",
      "Consensus Mechanism": "Method for achieving agreement on a single data value among distributed processes or systems",
      "Proof of Stake": "Consensus mechanism where validators are selected based on the amount of cryptocurrency they hold and are willing to 'stake'",
      "Proof of Work": "Consensus mechanism requiring computational work to validate transactions and create new blocks",
      "Liquidity Pool": "Collection of funds locked in a smart contract used for decentralized trading, lending, or other DeFi functions",
      "AMM": "Automated Market Maker - DeFi protocol allowing digital assets to be traded automatically using liquidity pools",
      "Yield Farming": "Strategy of staking or lending crypto assets to generate high returns in the form of additional cryptocurrency",
      "TVL": "Total Value Locked - The total value of cryptocurrency assets deposited in a DeFi protocol",
      "Oracles": "Blockchain middleware that connects smart contracts with real-world data sources",
      "Bridge": "Protocol enabling cross-chain token transfers and communication between different blockchain networks",
      "ZK-Proof": "Zero-Knowledge Proof - Cryptographic method allowing one party to prove knowledge without revealing the information itself",
      "Slashing": "Penalty mechanism in Proof of Stake systems that punishes validators for malicious or negligent behavior",
      "Governance Token": "Cryptocurrency that represents voting power in a decentralized protocol's governance system",
      "EVM": "Ethereum Virtual Machine - Runtime environment for executing smart contracts on Ethereum and EVM-compatible chains",
      "Gas Limit": "Maximum amount of gas a transaction or block can consume on Ethereum-compatible blockchains",
      "Hard Fork": "Radical change to a blockchain protocol that makes previously invalid blocks/transactions valid (or vice-versa)"
    },
    commonQuestions: [
      "How do I secure private keys in a wallet application?",
      "What's the difference between hot and cold storage?",
      "How do I implement ERC20 token support?",
      "What security considerations should I have for a multi-chain wallet?",
      "How do gas fees work and how can users optimize them?",
      "What are the best practices for smart contract auditing?",
      "How do I implement recovery mechanisms for lost keys?",
      "What regulatory considerations apply to cryptocurrency wallets?",
      "How can I validate blockchain addresses for different networks?",
      "What are the technical differences between custodial and non-custodial wallets?",
      "How do Layer 2 scaling solutions work?",
      "What are the security considerations for implementing cross-chain bridges?",
      "How do I design effective tokenomics for a blockchain project?",
      "What are the best practices for DAO governance implementation?",
      "How do I prevent common smart contract vulnerabilities?",
      "What are the trade-offs between different consensus mechanisms?",
      "How do I implement secure staking mechanisms?",
      "What are the best practices for integrating blockchain oracles?",
      "How can I mitigate MEV (Maximal Extractable Value) risks?",
      "What strategies can improve gas efficiency in smart contracts?",
      "How do I implement ZK-proof verification in smart contracts?",
      "What are the technical considerations for implementing a protocol-level governance system?",
      "How do I design secure liquidity pool mechanisms?",
      "What are the best approaches for onboarding non-technical users to blockchain applications?",
      "How can I implement secure cross-chain asset transfers?"
    ]
  },
  healthcare: {
    systemPrompt: "You are a specialized AI assistant for healthcare professionals. You have expertise in clinical practice, healthcare operations, and medical informatics. Your goal is to help healthcare providers improve patient care, optimize workflows, and navigate healthcare regulations. Provide accurate, evidence-based information while maintaining appropriate medical context and professional standards.",
    priorityTopics: ["patient_care", "clinical_operations", "compliance", "informatics", "quality_improvement"],
    terminology: {
      "EHR": "Electronic Health Record - Digital version of a patient's medical history maintained by the provider",
      "HIPAA": "Health Insurance Portability and Accountability Act - U.S. regulation for medical information privacy",
      "CMS": "Centers for Medicare & Medicaid Services - U.S. federal agency that administers Medicare and works with states on Medicaid",
      "PHI": "Protected Health Information - Individually identifiable health information protected by HIPAA",
      "ICD-10": "International Classification of Diseases, 10th Revision - Diagnostic coding system",
      "HCAHPS": "Hospital Consumer Assessment of Healthcare Providers and Systems - Patient satisfaction survey",
      "APM": "Alternative Payment Model - Payment approach that incentivizes quality and value",
      "ACO": "Accountable Care Organization - Group of healthcare providers who coordinate care for Medicare patients",
      "PQRS": "Physician Quality Reporting System - Quality reporting program for Medicare",
      "HEDIS": "Healthcare Effectiveness Data and Information Set - Performance measurement tool"
    },
    commonQuestions: [
      {
        question: "How can we improve patient adherence to treatment plans?",
        answer: "To improve treatment adherence: 1) Use the teach-back method to ensure patients understand instructions, 2) Simplify treatment regimens when possible, 3) Address barriers like transportation or costs, 4) Implement reminder systems (texts, apps), 5) Engage family members or caregivers in the care plan, 6) Schedule regular follow-ups to monitor progress, and 7) Use motivational interviewing techniques to address resistance. Consider implementing standardized adherence assessment tools to identify at-risk patients early."
      },
      {
        question: "What are effective strategies for reducing readmissions?",
        answer: "Effective readmission reduction strategies include: 1) Comprehensive discharge planning starting at admission, 2) Medication reconciliation to prevent adverse events, 3) Scheduling follow-up appointments before discharge, 4) Post-discharge phone calls within 48-72 hours, 5) Home health referrals for high-risk patients, 6) Use of transitional care coaches, 7) Clear, written discharge instructions with warning signs, 8) Care coordination with primary care and specialists, and 9) Risk stratification tools to target interventions to highest-risk patients."
      },
      {
        question: "How can we implement effective quality improvement initiatives?",
        answer: "Successful quality improvement implementation requires: 1) Select focused, measurable goals aligned with organizational priorities, 2) Use established QI methodologies like PDSA cycles or Lean, 3) Ensure frontline staff involvement from the planning stage, 4) Create multidisciplinary teams that include physicians, 5) Establish clear baseline metrics and regular data collection processes, 6) Set realistic timelines with milestone reviews, 7) Celebrate early wins to maintain momentum, 8) Provide protected time for QI activities, and 9) Link QI initiatives to meaningful outcomes for both patients and staff."
      },
      {
        question: "What are best practices for EHR optimization?",
        answer: "For EHR optimization: 1) Conduct workflow analysis before making changes, 2) Create specialty-specific templates and order sets, 3) Implement clinical decision support tools thoughtfully to avoid alert fatigue, 4) Designate super-users in each department for peer training, 5) Develop standardized documentation protocols, 6) Use data analytics to identify bottlenecks and improvement opportunities, 7) Schedule regular optimization rounds with IT and clinical staff, 8) Consider scribes or voice recognition for high-volume providers, and 9) Balance standardization needs with clinician autonomy and preferences."
      },
      {
        question: "How can we improve care coordination across different providers?",
        answer: "To enhance care coordination: 1) Implement a care team approach with clear role definitions, 2) Create standardized communication protocols between providers, 3) Use shared care plans accessible to all team members, 4) Hold regular multidisciplinary case conferences for complex patients, 5) Leverage health information exchange capabilities, 6) Develop closed-loop referral processes with tracking mechanisms, 7) Utilize care managers for high-risk patients, 8) Implement warm handoffs between care settings, and 9) Develop specialty-primary care compact agreements outlining mutual expectations."
      }
    ]
  },
  finance: {
    systemPrompt: "You are a specialized AI assistant for financial services professionals. You have expertise in wealth management, banking operations, risk assessment, and regulatory compliance. Your goal is to help finance professionals optimize client services, improve operational efficiency, and navigate complex regulations. Provide specific, actionable guidance based on industry best practices while maintaining appropriate risk considerations.",
    priorityTopics: ["wealth_management", "risk_assessment", "compliance", "digital_banking", "client_relationship"],
    terminology: {
      "AUM": "Assets Under Management - The total market value of assets a financial institution manages on behalf of clients",
      "KYC": "Know Your Customer - Due diligence procedures that financial institutions must perform to identify clients",
      "NAV": "Net Asset Value - The value of a fund's assets minus the value of its liabilities",
      "MBS": "Mortgage-Backed Security - Investment secured by a collection of mortgages",
      "FINRA": "Financial Industry Regulatory Authority - Self-regulatory organization that oversees broker-dealers",
      "SEC": "Securities and Exchange Commission - U.S. government agency responsible for regulating securities",
      "LIBOR": "London Interbank Offered Rate - Benchmark interest rate at which major global banks lend to one another",
      "Basel III": "International regulatory framework for banks that sets capital adequacy, stress testing, and liquidity requirements",
      "Fiduciary": "A person or entity that acts on behalf of another person, putting their clients' interests ahead of their own",
      "Alpha": "Excess return of an investment relative to the return of a benchmark index",
      "Beta": "Measure of a stock's volatility in relation to the overall market",
      "Leverage Ratio": "Financial measurement that indicates how much of a company's capital comes from debt"
    },
    commonQuestions: [
      {
        question: "How can we improve client portfolio performance reviews?",
        answer: "To enhance portfolio reviews: 1) Structure reviews around client goals rather than just benchmarks, 2) Use visualizations to explain complex performance concepts, 3) Incorporate forward-looking scenario analysis alongside historical performance, 4) Develop standardized review templates that can be customized by client segment, 5) Include both absolute and risk-adjusted performance metrics, 6) Schedule reviews at consistent intervals with prepared discussion guides, 7) Incorporate tax efficiency analysis alongside performance, and 8) Establish a systematic process for implementing agreed-upon changes following reviews."
      },
      {
        question: "What are best practices for regulatory compliance programs?",
        answer: "Effective compliance programs include: 1) Establishing a strong compliance culture from leadership, 2) Implementing risk-based compliance monitoring and testing, 3) Creating comprehensive documentation of policies and procedures, 4) Developing role-specific training programs with competency verification, 5) Implementing technology solutions for surveillance and monitoring, 6) Establishing clear escalation procedures for potential violations, 7) Conducting regular independent compliance reviews, and 8) Maintaining a regulatory change management process to stay current with evolving requirements."
      },
      {
        question: "How can we improve digital banking adoption among clients?",
        answer: "To increase digital banking adoption: 1) Segment clients and develop targeted adoption strategies for each group, 2) Create intuitive onboarding experiences with guided tutorials, 3) Train client-facing staff to demonstrate features during regular interactions, 4) Implement incentives for digital adoption, 5) Develop clear value messaging around convenience and features, 6) Address security concerns proactively with education, 7) Use data analytics to identify and reach out to low-adoption segments, and 8) Gather and implement feedback to continuously improve the digital experience."
      },
      {
        question: "What strategies work best for wealth transfer conversations?",
        answer: "For successful wealth transfer discussions: 1) Start conversations early, ideally 5-10 years before anticipated transfers, 2) Use family meeting facilitation techniques to involve multiple generations, 3) Focus initially on values and legacy rather than just technical details, 4) Develop educational programs for next-generation family members, 5) Create visual tools to explain complex estate structures, 6) Coordinate closely with clients' legal and tax advisors, 7) Implement regular review points for transfer strategies, and 8) Address potential family dynamics issues proactively through structured communication."
      },
      {
        question: "How can we improve risk assessment for lending decisions?",
        answer: "To enhance lending risk assessment: 1) Implement multi-factor models that combine traditional and alternative data sources, 2) Develop industry-specific risk assessment criteria for commercial lending, 3) Create standardized exception monitoring and reporting, 4) Implement early warning systems using leading indicators, 5) Conduct regular stress testing of the portfolio under different scenarios, 6) Establish formal risk appetite statements and concentration limits, 7) Implement regular back-testing of risk models, and 8) Develop ongoing training for lending staff on risk identification and mitigation techniques."
      }
    ]
  },
  seller: {
    systemPrompt: "You are an expert AI assistant for e-commerce sellers. You specialize in inventory management, pricing strategy, order fulfillment, and market analysis. Your goal is to help sellers optimize their operations, increase sales, and improve customer satisfaction. Provide specific, actionable advice based on your extensive knowledge of online retail best practices.",
    priorityTopics: ["inventory", "pricing", "marketing", "customer_service", "analytics"],
    terminology: {
      SKU: "Stock Keeping Unit - A unique identifier for each distinct product that can be purchased",
      COGS: "Cost of Goods Sold - The direct costs attributable to the production of the goods sold by a company",
      AOV: "Average Order Value - The average amount spent each time a customer places an order",
      ROAS: "Return on Ad Spend - A marketing metric that measures the revenue earned for every dollar spent on advertising",
      "Conversion Rate": "The percentage of website visitors who complete a desired action (like making a purchase)",
      Chargeback: "A forced transaction reversal initiated by the customer's bank, often due to disputed transactions"
    },
    commonQuestions: [
      {
        question: "How can I improve my product listings?",
        answer: "To improve your product listings: 1) Use high-quality images from multiple angles, 2) Write detailed, benefit-focused descriptions, 3) Include specific product dimensions and specifications, 4) Add customer reviews and testimonials, 5) Optimize titles and descriptions with relevant keywords, and 6) Clearly display pricing, shipping info, and return policies."
      },
      {
        question: "What's the best way to handle returns?",
        answer: "To effectively handle returns: 1) Create a clear, easy-to-understand return policy, 2) Make the return process simple for customers, 3) Analyze return reasons to identify product issues, 4) Consider offering free return shipping for higher-value items, 5) Process refunds quickly, and 6) Consider restocking fees only when appropriate. A good return policy can actually increase customer confidence and sales."
      },
      {
        question: "How should I price my products?",
        answer: "Effective pricing strategies include: 1) Cost-plus pricing (adding a markup to your costs), 2) Competitive pricing (based on market research), 3) Value-based pricing (based on perceived customer value), 4) Dynamic pricing (adjusting prices based on demand), and 5) Psychological pricing (such as $19.99 instead of $20). Consider your brand positioning, competitor prices, and customer price sensitivity. Regularly test different price points to optimize profits."
      }
    ]
  },
  buyer: {
    systemPrompt: "You are a knowledgeable AI assistant for online shoppers. You specialize in helping buyers find the best products, track orders, understand return policies, and make informed purchasing decisions. Your goal is to enhance the shopping experience by providing clear information, helpful suggestions, and problem-solving support.",
    priorityTopics: ["orders", "products", "payments", "shipping", "returns"],
    terminology: {
      "Tracking Number": "A unique identifier assigned to a package for shipment tracking purposes",
      "Return Window": "The timeframe during which a customer can return a product for a refund or exchange",
      "Order Confirmation": "An email or message acknowledging that an order has been received and processed",
      "Shipping Method": "The type of delivery service used to send a package (standard, expedited, etc.)",
      "Payment Gateway": "The service that processes credit card payments for online purchases",
      "Wishlist": "A feature that allows users to save products they're interested in for future consideration"
    },
    commonQuestions: [
      {
        question: "How can I track my order?",
        answer: "To track your order: 1) Go to the 'My Orders' section in your account dashboard, 2) Find the specific order you want to track, 3) Click on 'Track Order' or 'View Details', 4) You'll see the current shipping status and tracking number, 5) You can also click the tracking number to view detailed delivery progress on the carrier's website. If you don't see tracking information, it may mean your order is still processing."
      },
      {
        question: "What should I do if my order hasn't arrived?",
        answer: "If your order hasn't arrived: 1) Check the tracking information for the latest status, 2) Verify the delivery address in your order confirmation, 3) Check if anyone else at your location might have received it, 4) Contact customer support through the 'Help' or 'Contact Us' section, providing your order number and details of the issue. Customer service can investigate delivery delays, initiate package traces, or suggest next steps like refunds or replacements."
      },
      {
        question: "How do I return a product?",
        answer: "To return a product: 1) Go to 'My Orders' in your account, 2) Find the order containing the item to return, 3) Select 'Return Item' and follow the return process, 4) Print the provided return label, 5) Package the item securely with all original materials, 6) Attach the return label and drop off at the specified shipping location. You'll receive updates on your return status and refund processing via email."
      }
    ]
  },
  franchise: {
    systemPrompt: "You are a specialized AI assistant for franchise owners and managers. You have expertise in multi-location operations, brand compliance, performance optimization, and franchise relationship management. Your goal is to help franchisees maximize location performance while maintaining brand standards and developing successful business practices.",
    priorityTopics: ["operations", "marketing", "compliance", "staffing", "performance"],
    terminology: {
      "Franchise Agreement": "The legal contract outlining the rights and obligations of both the franchisor and franchisee",
      "Royalty Fee": "The ongoing payment made by the franchisee to the franchisor, typically a percentage of gross sales",
      "Territory": "The geographic area in which a franchisee has rights to operate, often with some form of exclusivity",
      "Operations Manual": "The comprehensive guide that details all procedures and standards for running the franchise",
      "Field Support": "Representatives from the franchisor who visit locations to provide training and ensure compliance",
      "Grand Opening": "The initial launch event for a new franchise location, often with special promotions"
    },
    commonQuestions: [
      {
        question: "How can I increase sales at my location?",
        answer: "To increase sales at your franchise: 1) Analyze local market demographics and adjust marketing accordingly, 2) Implement targeted promotions based on location-specific customer preferences, 3) Ensure staff are fully trained on upselling and cross-selling techniques, 4) Optimize your local digital presence (Google Business Profile, local social media), 5) Engage with community events and local partnerships, and 6) Conduct regular competitor analysis to identify opportunities. Also review successful strategies from other franchise locations in similar markets."
      },
      {
        question: "What's the best way to handle staffing issues?",
        answer: "Effective franchise staffing approaches include: 1) Developing a consistent hiring process with clear role descriptions, 2) Creating location-specific training programs that align with brand standards, 3) Implementing performance incentives tied to both individual and store metrics, 4) Establishing clear advancement paths to reduce turnover, 5) Building a bench of cross-trained employees to handle absences, and 6) Using scheduling software to optimize labor costs while maintaining service quality. Regular staff satisfaction surveys can help identify issues before they affect retention."
      },
      {
        question: "How do I maintain brand compliance while adapting to my local market?",
        answer: "Balancing brand compliance with local adaptation: 1) Thoroughly understand which brand elements are non-negotiable vs. flexible, 2) Propose localization ideas to your franchise representative before implementing, 3) Document successful local adaptations and their impact to support your case, 4) Participate in franchisee advisory councils to influence brand-wide adaptations, 5) Create a local marketing plan that aligns with brand guidelines while targeting local preferences. Most franchisors appreciate data-driven approaches to local market customization."
      }
    ]
  },
  admin: {
    systemPrompt: "You are an advanced AI assistant for platform administrators. You specialize in user management, system configuration, security, and technical troubleshooting. Your goal is to help administrators maintain platform integrity, optimize performance, and resolve technical issues efficiently. Provide detailed, technically accurate guidance while maintaining security best practices.",
    priorityTopics: ["security", "user_management", "system_configuration", "technical_support", "data_management"],
    terminology: {
      "SSO": "Single Sign-On - An authentication scheme that allows users to log in with a single ID to multiple related systems",
      "RBAC": "Role-Based Access Control - A method of regulating access based on the roles of individual users",
      "SLA": "Service Level Agreement - A commitment between a service provider and client about aspects like uptime and responsiveness",
      "API": "Application Programming Interface - A set of protocols for building and integrating application software",
      "Sandbox": "A testing environment that isolates code execution from the production environment",
      "CDN": "Content Delivery Network - A distributed server network that delivers web content based on user geographic location",
      "IAM": "Identity and Access Management - Framework for managing digital identities and their access rights",
      "Zero Trust": "Security concept that requires verification from everyone trying to access resources in the network",
      "GDPR": "General Data Protection Regulation - EU regulation on data protection and privacy",
      "MFA": "Multi-Factor Authentication - Authentication method requiring users to provide two or more verification factors"
    },
    commonQuestions: [
      {
        question: "How do I set up user roles and permissions?",
        answer: "To configure user roles and permissions: 1) Navigate to the Admin Dashboard > User Management section, 2) Select 'Roles & Permissions' to view existing roles, 3) Click 'Create New Role' to define custom roles beyond the defaults, 4) Use the permission matrix to assign specific capabilities to each role, 5) Implement the principle of least privilege by giving users only the access they need, 6) Test each role configuration before deploying to users. For complex permission structures, consider creating role hierarchies or permission groups."
      },
      {
        question: "What security best practices should I implement?",
        answer: "Essential security practices for administrators: 1) Enforce strong password policies with regular rotation, 2) Implement multi-factor authentication for all admin accounts, 3) Regularly audit user access logs for suspicious activity, 4) Keep all system components updated with security patches, 5) Configure session timeout settings appropriately, 6) Implement IP restrictions for administrative access where possible, 7) Regularly backup system data and test restore procedures, 8) Create and practice an incident response plan for potential security breaches."
      },
      {
        question: "How can I optimize system performance?",
        answer: "To optimize platform performance: 1) Monitor server resources (CPU, memory, disk I/O) to identify bottlenecks, 2) Configure caching appropriately for frequently accessed content, 3) Optimize database queries and create appropriate indexes, 4) Implement content delivery networks (CDNs) for static assets, 5) Schedule resource-intensive processes during off-peak hours, 6) Consider load balancing for high-traffic implementations, 7) Regularly clean up old data and logs to free storage space. Performance tuning should be an ongoing process with regular benchmarking."
      },
      {
        question: "How do I set up data governance protocols?",
        answer: "To establish effective data governance: 1) Create a comprehensive data classification system (public, internal, confidential, restricted), 2) Define data ownership and stewardship roles for each data category, 3) Implement access controls aligned with your classification system, 4) Establish data retention and disposal policies that comply with regulations, 5) Create audit mechanisms to track data access and modifications, 6) Develop data quality standards and validation processes, 7) Implement privacy controls for personally identifiable information (PII), 8) Document all governance policies and conduct regular training."
      },
      {
        question: "What's the best approach to system integration?",
        answer: "For successful system integration: 1) Create a detailed inventory of all systems and their current interfaces, 2) Document data flows and interdependencies between systems, 3) Choose appropriate integration patterns (API, event-driven, file-based, etc.) based on system capabilities and requirements, 4) Implement robust error handling and logging for all integration points, 5) Create a staging environment that mirrors production for testing, 6) Develop comprehensive integration tests including edge cases, 7) Establish monitoring for integration health and performance, 8) Document integration architecture and maintain up-to-date diagrams."
      }
    ]
  },
  developer: {
    systemPrompt: "You are a specialized AI assistant for software developers. You have expertise in programming languages, frameworks, architecture patterns, testing methodologies, and development best practices. Your goal is to help developers solve technical challenges, write efficient code, and implement robust solutions while following industry standards.",
    priorityTopics: ["coding", "debugging", "architecture", "testing", "deployment"],
    terminology: {
      "CI/CD": "Continuous Integration/Continuous Delivery - Automated approach to software delivery and deployment",
      "ORM": "Object-Relational Mapping - Technique that converts data between incompatible type systems in databases and OOP languages",
      "API": "Application Programming Interface - Interface that defines interactions between multiple software applications",
      "Git": "Distributed version control system for tracking changes in source code during software development",
      "Microservices": "Architectural style structuring an application as a collection of loosely coupled services",
      "TDD": "Test-Driven Development - Software development process relying on very short development cycles",
      "JWT": "JSON Web Token - A compact, URL-safe means of representing claims between two parties",
      "REST": "Representational State Transfer - Architectural style for distributed hypermedia systems"
    },
    commonQuestions: [
      {
        question: "What's the best way to structure a React application?",
        answer: "For effective React application structure: 1) Organize by feature/module rather than by file type, 2) Use atomic design principles for components (atoms, molecules, organisms), 3) Implement state management appropriate to your app's complexity (Context API for simpler apps, Redux/MobX for complex ones), 4) Separate business logic from UI components using custom hooks or service layers, 5) Create consistent naming conventions for files and components, 6) Implement lazy loading for route-based code splitting, 7) Centralize reusable utilities, constants, and types, 8) Consider implementing a component library or design system for UI consistency."
      },
      {
        question: "How should I handle API error states?",
        answer: "For robust API error handling: 1) Implement consistent error response structures across all endpoints, 2) Create different error classes/types for various error categories (validation, authentication, server, etc.), 3) Add appropriate HTTP status codes for different error scenarios, 4) Include meaningful error messages that are safe to display to users, 5) Log detailed error information server-side for debugging, 6) Implement retry logic with exponential backoff for transient errors, 7) Create a centralized error handling middleware or interceptor, 8) Return correlation IDs in error responses to help trace issues across systems."
      },
      {
        question: "What testing strategy should I implement?",
        answer: "A comprehensive testing strategy should include: 1) Unit tests for individual functions and components (aim for 70-80% coverage), 2) Integration tests for API endpoints and service interactions, 3) End-to-end tests for critical user flows, 4) Performance tests for high-traffic functionality, 5) Security tests for authentication and authorization, 6) Accessibility tests for compliance with standards like WCAG, 7) Automated visual regression tests for UI components, 8) Contract tests for API interfaces. Implement a testing pyramid with more unit tests than integration tests, and fewer end-to-end tests. Automate tests in your CI/CD pipeline."
      },
      {
        question: "How do I optimize database queries?",
        answer: "To optimize database queries: 1) Use proper indexing based on query patterns, 2) Select only the fields you need instead of using SELECT *, 3) Use pagination for large result sets, 4) Implement database-specific optimizations (like PostgreSQL explain analyze), 5) Consider denormalization for read-heavy operations, 6) Use query caching where appropriate, 7) Batch related queries to reduce roundtrips, 8) Use connection pooling for efficient resource utilization, 9) Optimize JOIN operations and consider pre-joining frequently accessed data, 10) Profile and monitor query performance in production to identify bottlenecks."
      },
      {
        question: "What's the best approach to API versioning?",
        answer: "Effective API versioning approaches include: 1) URL path versioning (e.g., /api/v1/resources), which is explicit and easy to understand, 2) Query parameter versioning (e.g., /api/resources?version=1), offering flexibility, 3) Header-based versioning using custom headers, which keeps URLs clean, 4) Accept header versioning (Content negotiation), following HTTP standards, 5) Media type versioning (e.g., application/vnd.company.v2+json). Choose based on your clients' needs, with URL versioning being most client-friendly. Document breaking vs. non-breaking changes, maintain backward compatibility when possible, and consider implementing a deprecation policy with sunset periods."
      }
    ]
  },
  analyst: {
    systemPrompt: "You are a specialized AI assistant for data analysts and business intelligence professionals. You have expertise in data analysis techniques, visualization best practices, statistical methods, and reporting strategies. Your goal is to help analysts extract meaningful insights from data, create impactful visualizations, and communicate findings effectively to stakeholders.",
    priorityTopics: ["data_analysis", "reporting", "visualization", "statistics", "forecasting"],
    terminology: {
      "KPI": "Key Performance Indicator - A measurable value that demonstrates how effectively a company is achieving key business objectives",
      "ETL": "Extract, Transform, Load - Process of copying data from source systems to destination systems",
      "BI": "Business Intelligence - Technologies, applications and practices for the collection, integration, analysis and presentation of business information",
      "SQL": "Structured Query Language - Standard language for storing, manipulating and retrieving data in databases",
      "Cohort Analysis": "Type of behavioral analytics that breaks data into related groups for analysis",
      "Regression": "Statistical method for estimating relationships among variables",
      "Data Warehouse": "System used for reporting and data analysis, and is considered a core component of business intelligence"
    },
    commonQuestions: [
      {
        question: "How do I choose the right chart type for my data?",
        answer: "Choose charts based on your data and purpose: 1) For composition data, use pie/donut charts (for few categories) or stacked bar/column charts (for many categories), 2) For distribution data, use histograms, box plots, or density plots, 3) For trend data over time, use line charts or area charts, 4) For relationship data, use scatter plots, bubble charts, or heatmaps, 5) For comparison data, use bar/column charts, radar charts, or bullet charts, 6) For geographical data, use maps with data overlays. Consider your audience's familiarity with chart types, and always prioritize clarity over complexity. Label all elements clearly and provide context."
      },
      {
        question: "What's the best way to identify outliers in my dataset?",
        answer: "To identify outliers effectively: 1) Use visual methods like box plots, scatter plots, or histograms to spot unusual values, 2) Apply statistical methods such as Z-scores (values beyond ±3 standard deviations) or IQR method (values beyond Q1-1.5×IQR or Q3+1.5×IQR), 3) Utilize distance-based methods like clustering or DBSCAN for multidimensional data, 4) Implement domain-specific business rules based on expert knowledge, 5) Check for data entry errors or processing issues first, 6) Consider contextual factors before removing outliers, as they may contain valuable information. Document your outlier identification methodology and decisions for transparency."
      },
      {
        question: "How should I structure an effective dashboard?",
        answer: "For effective dashboard design: 1) Start with a clear purpose and key questions the dashboard should answer, 2) Follow the 'overview first, details on demand' principle with primary KPIs at the top, 3) Group related metrics and visualizations together with clear sections or tabs, 4) Implement consistent color schemes, fonts, and styling throughout, 5) Include appropriate context like comparison periods or targets, 6) Provide interactive filtering and drill-down capabilities for exploration, 7) Ensure mobile responsiveness if needed, 8) Limit to 5-7 visualizations per view to prevent information overload, 9) Use appropriate data refreshing intervals based on the nature of the data, 10) Test with actual users and iterate based on feedback."
      },
      {
        question: "What statistical tests should I use for my analysis?",
        answer: "Choose statistical tests based on your data and questions: 1) For comparing means between two groups, use t-tests (parametric) or Mann-Whitney U test (non-parametric), 2) For comparing means across multiple groups, use ANOVA (parametric) or Kruskal-Wallis (non-parametric), 3) For relationships between continuous variables, use correlation (Pearson or Spearman) or regression analysis, 4) For relationships between categorical variables, use chi-square tests, 5) For time series data, use autocorrelation, ARIMA, or decomposition methods, 6) Always check assumptions for each test (normality, homogeneity of variance, etc.), 7) Consider effect size along with statistical significance to understand practical importance. Document your methodology and limitations."
      },
      {
        question: "How do I effectively present data findings to non-technical stakeholders?",
        answer: "When presenting to non-technical stakeholders: 1) Start with the key insights and recommendations rather than methodology, 2) Frame findings in terms of business impact and value, 3) Use simple, jargon-free language and define any necessary technical terms, 4) Create clear, minimalist visualizations that highlight the main points, 5) Use analogies and real-world examples to explain complex concepts, 6) Present data in context, including relevant benchmarks or historical comparisons, 7) Anticipate questions and prepare supporting details you can share if asked, 8) Create a narrative that connects data points to tell a coherent story, 9) Provide a concise executive summary for time-constrained audiences, 10) Include clear, actionable next steps based on the insights."
      }
    ]
  }
};

// Domain-specific prompts for different business areas
const domainSpecificPrompts = {
  blockchain: {
    walletSecurity: "Provide a comprehensive security assessment for [wallet_type] storing [cryptocurrency_types]. Identify potential vulnerabilities, security best practices, and specific implementation strategies to protect user funds. Include considerations for private key management, backup procedures, and recovery options.",
    
    smartContractReview: "Analyze this smart contract code for [contract_purpose] on [blockchain_platform]. Identify potential security vulnerabilities, gas optimization opportunities, and adherence to best practices. Suggest specific improvements that would enhance security and efficiency.",
    
    blockchainArchitecture: "Design a blockchain architecture for [use_case] with [specific_requirements]. Consider scalability, security, consensus mechanisms, and integration points. Recommend specific technologies, frameworks, and implementation approaches for optimal performance and security.",
    
    tokenomicsDesign: "Create a tokenomics model for [project_type] with [business_objectives]. Include token utility, distribution mechanisms, supply management, and incentive structures. Analyze potential economic impacts and suggest governance frameworks that align with project goals.",
    
    regulatoryCompliance: "Provide guidance on regulatory considerations for [blockchain_activity] in [jurisdictions]. Identify key compliance requirements, potential risk areas, and specific actions needed to maintain regulatory alignment. Include recommendations for ongoing compliance monitoring.",
    
    walletIntegration: "Explain the technical approach for integrating [blockchain_network] support into a multi-chain wallet. Include address format handling, transaction signing, network fee management, and security considerations. Provide specific code patterns or API approaches that follow best practices.",
    
    blockchainPerformance: "Analyze performance metrics for [blockchain_system] and recommend optimization strategies. Consider transaction throughput, confirmation times, resource utilization, and user experience impacts. Suggest specific technical improvements to enhance system performance while maintaining security."
  },
  analytics: {
    dataInterpretation: "Analyze this [user_role] dashboard data about [data_subject]. Identify the key trends, anomalies, and actionable insights. Prioritize metrics most relevant to [business_goal]. Provide 3-5 specific recommendations based on this data.",
    salesForecasting: "Based on these historical sales data for [product_category], predict likely sales trends for the next [time_period]. Consider seasonality, growth patterns, and market factors. Highlight key opportunities and risks.",
    performanceComparison: "Compare the performance metrics between [comparison_subject_1] and [comparison_subject_2]. Identify significant differences, potential causes, and specific actions to improve underperforming areas.",
    cohortAnalysis: "Analyze these customer cohort data organized by [cohort_parameter]. Identify patterns in customer behavior, retention, and lifetime value across different cohorts. Suggest strategies to improve performance for underperforming cohorts.",
    multivariate: "Perform a multivariate analysis on these [business_area] metrics. Identify correlations between variables and explain potential causal relationships. Prioritize the factors that have the strongest influence on [target_metric]."
  },
  productManagement: {
    inventoryOptimization: "Analyze this inventory data for [product_category]. Identify items that are overstocked, understocked, or at risk of stockout. Consider sales velocity, seasonality, and lead times in your assessment.",
    pricingStrategy: "Evaluate the pricing structure for [product_line] based on these cost, competitor, and sales data. Recommend optimal price points that balance profit margins with market competitiveness.",
    productPerformance: "Review the performance metrics for [product_name]. Identify strengths, weaknesses, and opportunities for improvement based on sales data, customer feedback, and return rates.",
    productRoadmap: "Develop a 6-month product roadmap for [product_area] based on these customer requests, market trends, and technical constraints. Prioritize features using a value vs. effort framework and suggest a phased implementation approach.",
    featurePrioritization: "Analyze these feature requests for [product_name] using the RICE scoring method (Reach, Impact, Confidence, Effort). Rank the features and provide justification for your scoring. Create a prioritized implementation schedule."
  },
  customerService: {
    feedbackAnalysis: "Analyze these customer feedback responses about [service_aspect]. Identify common themes, sentiment patterns, and priority issues. Suggest specific improvements based on this feedback.",
    complaintResolution: "Provide a step-by-step approach to resolve this customer complaint about [complaint_subject]. Include recommended compensation or resolution options based on the severity and context.",
    customerRetention: "Review this data on customer churn for [customer_segment]. Identify key reasons for customer loss and recommend targeted retention strategies for at-risk customers.",
    serviceRecovery: "Design a service recovery framework for [business_type] when [service_failure] occurs. Include immediate response protocols, escalation paths, compensation guidelines, and follow-up procedures to rebuild customer trust.",
    supportTeamTraining: "Create a training outline for customer support agents handling [issue_type]. Include key knowledge areas, communication techniques, troubleshooting steps, empathy guidance, and metrics to evaluate agent performance."
  },
  marketing: {
    campaignOptimization: "Analyze the performance of this [campaign_type] marketing campaign. Identify which elements are working well and which need improvement. Recommend specific adjustments to improve ROI.",
    audienceTargeting: "Based on these customer data points, identify the most promising customer segments for [product_type]. Suggest targeting parameters and messaging approaches for each segment.",
    contentStrategy: "Develop a content strategy framework for promoting [product_or_service]. Include recommended content types, themes, channels, and metrics based on the target audience and business objectives.",
    competitiveAnalysis: "Perform a competitive analysis of [company] against these key competitors in the [industry] market. Evaluate positioning, messaging, product features, pricing strategies, and market share. Identify competitive advantages and vulnerabilities.",
    channelStrategy: "Analyze the performance of these marketing channels for [business_type]. Recommend an optimal channel mix based on customer acquisition cost, conversion rates, and lifetime value. Include budget allocation recommendations."
  },
  operations: {
    processOptimization: "Analyze this [business_process] workflow for inefficiencies and bottlenecks. Identify opportunities for automation, elimination of redundant steps, or resource reallocation. Provide specific recommendations to improve throughput and quality.",
    resourceAllocation: "Evaluate the current resource allocation for [department/team]. Based on these workload metrics and business priorities, recommend staffing adjustments, skill development needs, or workflow changes to optimize productivity.",
    supplyChainRisk: "Assess the supply chain risks for [product_line] based on these supplier data, geographic factors, and market conditions. Identify critical vulnerabilities and recommend risk mitigation strategies.",
    qualityControl: "Design a quality control framework for [product/service]. Include key inspection points, measurement criteria, acceptable quality levels, failure response protocols, and continuous improvement mechanisms.",
    capacityPlanning: "Based on these historical demand patterns and growth projections, develop a capacity planning model for [service_area]. Consider seasonal variations, peak demand periods, and resource constraints in your recommendations."
  },
  technology: {
    architectureReview: "Review this system architecture for [application_name]. Identify potential improvements in scalability, performance, security, and maintainability. Recommend specific architectural changes that balance technical debt reduction with business requirements.",
    securityAssessment: "Evaluate these security controls for [system_name] against industry best practices. Identify potential vulnerabilities in authentication, authorization, data protection, and incident response. Prioritize security enhancement recommendations.",
    integrationStrategy: "Develop an integration strategy for connecting [system_a] with [system_b]. Consider data synchronization requirements, API capabilities, error handling, and performance needs. Recommend an optimal integration pattern and implementation approach.",
    cloudMigration: "Create a cloud migration plan for [application_name] from on-premises to [cloud_platform]. Include assessment criteria, migration phases, testing strategies, risk mitigation, and post-migration optimization steps.",
    dataPlatform: "Design a data platform architecture for [business_purpose] that handles [data_volume] of data. Include data ingestion, storage, processing, analysis, and visualization components. Address security, governance, and scalability requirements."
  },
  finance: {
    budgetAnalysis: "Analyze this departmental budget for [department_name]. Identify variances, spending patterns, and optimization opportunities. Recommend adjustments to align spending with business priorities while maintaining operational effectiveness.",
    investmentEvaluation: "Evaluate these investment options for [business_area] using NPV, IRR, and payback period analyses. Consider both quantitative returns and qualitative strategic alignment. Rank the options and provide a recommended investment approach.",
    costReduction: "Review these operational costs for [business_unit] and identify potential cost reduction opportunities. Evaluate each opportunity based on implementation effort, potential savings, and business impact. Develop a phased approach for the top opportunities.",
    financialForecasting: "Based on these historical financial data and market indicators, create a financial forecast for [business_entity] for the next [time_period]. Include revenue, cost, margin, and cash flow projections with sensitivity analysis for key variables.",
    pricingModel: "Evaluate the current pricing model for [product/service] against these market conditions, cost structures, and competitive factors. Recommend pricing adjustments, structure changes, or new models to improve profitability while maintaining market position."
  },
  franchising: {
    locationSelection: "Analyze these potential locations for a new [franchise_type] franchise. Evaluate demographic data, competition, accessibility, and cost factors. Rank the locations and provide specific justification for each assessment.",
    franchiseePerformance: "Review the performance metrics for these [franchise_type] locations. Identify common success factors among top performers and challenges faced by underperforming locations. Create an action plan to improve struggling franchisees.",
    territoryPlanning: "Develop a territory allocation strategy for [franchise_system] in [geographic_region]. Consider population density, market potential, existing locations, and competitive landscape. Recommend optimal territory sizes and protection policies.",
    multiUnitManagement: "Create a management framework for multi-unit franchisees operating [number] locations of [franchise_brand]. Include organizational structure, performance monitoring, staff development, and resource allocation guidelines.",
    manualDevelopment: "Outline a comprehensive operations manual structure for [franchise_type] franchisees. Identify critical sections, key procedures, compliance requirements, and training elements. Suggest an approach for maintaining and updating the manual."
  },
  saas: {
    retentionStrategy: "Analyze these customer retention data for [saas_product] across different customer segments. Identify key churn indicators and retention drivers. Develop a comprehensive retention strategy with specific interventions for at-risk segments.",
    pricingTiers: "Evaluate the current pricing tiers for [saas_product] against these usage patterns, competitive offerings, and customer feedback. Recommend an optimized pricing structure that improves conversion, reduces churn, and increases average revenue per user.",
    onboardingFlow: "Design an onboarding flow for new users of [saas_platform] that maximizes activation and feature adoption. Include key user actions, education elements, progress tracking, and success metrics. Address common drop-off points from these user data.",
    featureAdoption: "Analyze usage data for these features in [saas_product]. Identify underutilized high-value features and recommend specific strategies to increase adoption through UI changes, education, or workflow integration.",
    expansionRevenue: "Develop a strategy to increase expansion revenue from existing customers of [saas_product]. Based on these usage patterns and account data, identify upsell and cross-sell opportunities, optimal timing, and messaging approaches."
  }
};

module.exports = {
  industryKnowledge,
  roleSpecificInstructions,
  domainSpecificPrompts
};