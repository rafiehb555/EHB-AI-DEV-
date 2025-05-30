import React, { useState, useEffect } from 'react';
import { FiHelpCircle, FiChevronRight, FiX } from 'react-icons/fi';

// Mock helper functions until we implement the real ones
const getHelpTopics = (section) => {
  const topicsMap = {
    dashboard: [
      { id: 'overview', label: 'Overview' },
      { id: 'metrics', label: 'Metrics' },
      { id: 'charts', label: 'Charts' },
      { id: 'status', label: 'Status Indicators' }
    ],
    phases: [
      { id: 'overview', label: 'Overview' },
      { id: 'phase_status', label: 'Phase Status' },
      { id: 'dependencies', label: 'Dependencies' },
      { id: 'completion', label: 'Completion Tracking' }
    ],
    services: [
      { id: 'overview', label: 'Overview' },
      { id: 'gosellr', label: 'GoSellr' },
      { id: 'jps', label: 'JPS' },
      { id: 'aidev', label: 'AI Dev Service' }
    ],
    systems: [
      { id: 'overview', label: 'Overview' },
      { id: 'blockchain', label: 'Blockchain System' },
      { id: 'sql', label: 'SQL Department' },
      { id: 'franchise', label: 'Franchise System' }
    ],
    admin: [
      { id: 'overview', label: 'Overview' },
      { id: 'settings', label: 'Settings' },
      { id: 'user_management', label: 'User Management' },
      { id: 'permissions', label: 'Permissions' }
    ]
  };
  
  return topicsMap[section] || topicsMap.dashboard;
};

const getSampleExplanation = (section, topic) => {
  // Simple mapping to provide fallback explanations before API call
  const explanations = {
    dashboard: {
      overview: "The Dashboard provides a comprehensive view of the entire EHB ecosystem at a glance. It shows key metrics, service status, and system health indicators.",
      metrics: "Dashboard metrics show important numbers like phase completion percentages, active services count, and system health indicators to give you a quick overview of the project status.",
      charts: "Charts visualize data over time, helping you understand trends in project progress, service performance, and system utilization.",
      status: "Status indicators use color coding (green, blue, yellow, gray) to show the current state of various components, making it easy to identify what needs attention."
    },
    phases: {
      overview: "The Phases section displays all 31 development phases of the EHB system. Each phase represents a specific component or functionality being developed.",
      phase_status: "Phase status indicators show whether a phase is 'Completed', 'In Progress', or 'Not Started', helping track overall project progress.",
      dependencies: "The dependencies view shows what technologies, libraries, and other phases each development phase relies on, helping manage the development sequence.",
      completion: "Completion tracking uses progress bars to visually display how much of each phase has been completed, giving a precise measure of progress."
    }
  };
  
  // Return explanation if it exists, or a generic one
  return explanations[section]?.[topic] || 
    "This section provides information about the EHB Development Portal. Click on a topic in the sidebar to learn more about specific features.";
};

const getContextualHelp = async (section, topic) => {
  try {
    // Make an API call to get contextual help
    const response = await fetch('/api/ai/contextual-help', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ section, topic }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch contextual help');
    }
    
    const data = await response.json();
    return data.explanation;
  } catch (error) {
    console.error('Error fetching contextual help:', error);
    return null;
  }
};

// CSS styles
const styles = {
  helpButton: {
    position: 'fixed',
    right: '16px',
    bottom: '16px',
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: '#3182ce',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: 'none',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    zIndex: 1000
  },
  sidebar: {
    position: 'fixed',
    right: 0,
    top: 0,
    height: '100vh',
    width: '350px',
    background: '#ffffff',
    borderLeft: '1px solid #e2e8f0',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.3s ease-in-out',
    overflow: 'hidden'
  },
  sidebarHidden: {
    transform: 'translateX(100%)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    borderBottom: '1px solid #e2e8f0'
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '18px',
    fontWeight: '600',
    color: '#2d3748'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#718096',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1',
    overflow: 'hidden'
  },
  topicsSection: {
    padding: '16px',
    borderBottom: '1px solid #e2e8f0'
  },
  topicsTitle: {
    fontWeight: '500',
    marginBottom: '8px',
    color: '#4a5568'
  },
  topicsList: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  topicItem: (active) => ({
    marginBottom: '4px',
    padding: '8px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    background: active ? '#ebf8ff' : 'transparent',
    color: active ? '#3182ce' : '#4a5568',
    fontWeight: active ? '500' : '400',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  }),
  explanationSection: {
    padding: '16px',
    flex: '1',
    overflowY: 'auto'
  },
  explanationTitle: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#2d3748',
    display: 'flex',
    alignItems: 'center'
  },
  divider: {
    height: '1px',
    background: '#e2e8f0',
    margin: '12px 0'
  },
  explanationText: {
    whiteSpace: 'pre-wrap',
    color: '#4a5568',
    lineHeight: '1.6'
  },
  spinner: {
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    border: '2px solid #3182ce',
    borderTopColor: 'transparent',
    animation: 'spin 1s linear infinite',
    marginLeft: '8px',
    display: 'inline-block'
  },
  spinnerStyle: `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `
};

const HelpSidebar = ({ section = 'dashboard' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('overview');
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [helpTopics, setHelpTopics] = useState([]);
  
  // Load help topics for the current section
  useEffect(() => {
    if (section) {
      const topics = getHelpTopics(section);
      setHelpTopics(topics);
      
      // Reset selected topic when section changes
      setSelectedTopic('overview');
      
      // Load sample explanation immediately
      const sampleText = getSampleExplanation(section, 'overview');
      setExplanation(sampleText);
      
      // Then load AI-generated explanation
      fetchExplanation(section, 'overview');
    }
  }, [section]);
  
  // Fetch explanation from AI when topic changes
  useEffect(() => {
    if (selectedTopic && isOpen) {
      fetchExplanation(section, selectedTopic);
    }
  }, [selectedTopic, isOpen]);
  
  // Function to fetch explanation from the API
  const fetchExplanation = async (section, topic) => {
    try {
      setIsLoading(true);
      
      // Load sample explanation immediately
      const sampleText = getSampleExplanation(section, topic);
      setExplanation(sampleText);
      
      // Then get AI-generated explanation
      const aiExplanation = await getContextualHelp(section, topic);
      if (aiExplanation) {
        setExplanation(aiExplanation);
      }
    } catch (error) {
      console.error('Error fetching explanation:', error);
      // Keep the sample explanation if AI fails
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle topic selection
  const handleTopicSelect = (topicId) => {
    setSelectedTopic(topicId);
  };
  
  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  
  // Get topic title
  const getTopicTitle = () => {
    const topic = helpTopics.find(t => t.id === selectedTopic);
    return topic ? topic.label : 'Help';
  };
  
  return (
    <>
      <style>{styles.spinnerStyle}</style>
      
      {/* Help Button (always visible) */}
      {!isOpen && (
        <button 
          style={styles.helpButton}
          onClick={toggleSidebar}
          aria-label="Open Help"
        >
          <FiHelpCircle size={24} />
        </button>
      )}
      
      {/* Help Sidebar */}
      <div style={{
        ...styles.sidebar,
        ...(isOpen ? {} : styles.sidebarHidden)
      }}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerTitle}>
            <FiHelpCircle style={{ marginRight: '8px', color: '#3182ce' }} />
            AI Help Assistant
          </div>
          <button style={styles.closeButton} onClick={toggleSidebar} aria-label="Close">
            <FiX size={20} />
          </button>
        </div>
        
        {/* Content area */}
        <div style={styles.content}>
          {/* Topics sidebar */}
          <div style={styles.topicsSection}>
            <div style={styles.topicsTitle}>Help Topics</div>
            <ul style={styles.topicsList}>
              {helpTopics.map((topic) => (
                <li 
                  key={topic.id}
                  style={styles.topicItem(selectedTopic === topic.id)}
                  onClick={() => handleTopicSelect(topic.id)}
                >
                  {topic.label}
                  {selectedTopic === topic.id && <FiChevronRight />}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Explanation area */}
          <div style={styles.explanationSection}>
            <div style={styles.explanationTitle}>
              {getTopicTitle()}
              {isLoading && <span style={styles.spinner}></span>}
            </div>
            <div style={styles.divider}></div>
            <div style={styles.explanationText}>{explanation}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HelpSidebar;