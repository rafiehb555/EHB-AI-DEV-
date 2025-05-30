import React from 'react';
import Head from 'next/head';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useSiteConfig } from '../context/SiteConfigContext';

export default function Phases() {
  const siteConfig = useSiteConfig();

  // Sample phases data
  const phases = [
    { 
      id: 1, 
      name: 'EHB AI Agent', 
      status: 'completed', 
      completion: 100,
      description: 'Base AI agent system with core functionality',
    },
    { 
      id: 2, 
      name: 'Code Suggest', 
      status: 'completed', 
      completion: 100,
      description: 'Intelligent code suggestion system for developers',
    },
    { 
      id: 3, 
      name: 'AI Coding Chat', 
      status: 'completed', 
      completion: 100,
      description: 'Interactive coding assistant with chat interface',
    },
    { 
      id: 4, 
      name: 'Voice Module Generation', 
      status: 'completed', 
      completion: 100,
      description: 'Voice-based module code generation system',
    },
    { 
      id: 5, 
      name: 'SQL Badge System', 
      status: 'in_progress', 
      completion: 85,
      description: 'Achievement system for SQL development skills',
    },
    { 
      id: 6, 
      name: 'Referral Tree', 
      status: 'in_progress', 
      completion: 90,
      description: 'Hierarchical referral tracking and visualization',
    },
    { 
      id: 7, 
      name: 'Auto Card Generation', 
      status: 'in_progress', 
      completion: 75,
      description: 'Automatic generation of content cards',
    },
    { 
      id: 8, 
      name: 'Test Pass/Fail System', 
      status: 'in_planning', 
      completion: 40,
      description: 'Automated test result tracking and reporting',
    },
    { 
      id: 9, 
      name: 'AI Dashboard', 
      status: 'in_planning', 
      completion: 60,
      description: 'Comprehensive AI monitoring and control dashboard',
    },
    { 
      id: 10, 
      name: 'Smart AI Agent', 
      status: 'in_planning', 
      completion: 35,
      description: 'Enhanced AI agent with advanced learning capabilities',
    },
  ];

  return (
    <DashboardLayout activeItem="phases">
      <Head>
        <title>{`${siteConfig.title} | Phases`}</title>
      </Head>
      
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
      }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '30px'
        }}>
          <div>
            <h1 style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold',
              marginBottom: '8px',
              color: '#333'
            }}>
              Development Phases
            </h1>
            <p style={{ color: '#666' }}>
              Tracking progress of all EHB development phases
            </p>
          </div>
          
          <div>
            <button style={{
              backgroundColor: '#0064db',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}>
              Add New Phase
            </button>
          </div>
        </div>
        
        {/* Phases Grid */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          {phases.map((phase) => (
            <div key={phase.id} style={{ 
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '20px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '4px',
                width: `${phase.completion}%`,
                backgroundColor: 
                  phase.status === 'completed' ? '#00c853' :
                  phase.status === 'in_progress' ? '#ff9100' : '#0064db'
              }} />
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start'
              }}>
                <h3 style={{ 
                  fontSize: '1.1rem', 
                  fontWeight: 'bold',
                  marginBottom: '10px',
                  color: '#333'
                }}>
                  Phase {phase.id}: {phase.name}
                </h3>
                <span style={{ 
                  fontSize: '0.8rem',
                  fontWeight: 'medium',
                  padding: '3px 8px',
                  borderRadius: '12px',
                  backgroundColor: 
                    phase.status === 'completed' ? '#e8f5e9' :
                    phase.status === 'in_progress' ? '#fff3e0' : '#e3f2fd',
                  color:
                    phase.status === 'completed' ? '#2e7d32' :
                    phase.status === 'in_progress' ? '#e65100' : '#0d47a1',
                }}>
                  {phase.status === 'completed' ? 'Completed' :
                   phase.status === 'in_progress' ? 'In Progress' : 'Planning'}
                </span>
              </div>
              
              <p style={{ 
                color: '#666',
                marginBottom: '15px',
                fontSize: '0.9rem'
              }}>
                {phase.description}
              </p>
              
              <div>
                <div style={{ 
                  backgroundColor: '#f5f5f5',
                  height: '8px',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    backgroundColor: 
                      phase.status === 'completed' ? '#00c853' :
                      phase.status === 'in_progress' ? '#ff9100' : '#0064db',
                    width: `${phase.completion}%`,
                    height: '100%'
                  }} />
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginTop: '5px',
                  fontSize: '0.8rem',
                  color: '#666'
                }}>
                  <span>Progress</span>
                  <span>{phase.completion}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Footer Note */}
        <div style={{ 
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
          padding: '15px',
          fontSize: '0.9rem',
          color: '#666',
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          <p>Click on any phase card to view detailed information and related components.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}