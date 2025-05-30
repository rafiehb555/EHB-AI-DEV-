import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useSiteConfig } from '../../context/SiteConfigContext';
import { useLearning } from '../../context/LearningContext';
import LearningProgress from '../../components/learning/LearningProgress';
import Achievements from '../../components/learning/Achievements';

function Learning() {
  const siteConfig = useSiteConfig();
  const [isLoading, setIsLoading] = useState(false);

  // Sample learning paths
  const learningPaths = [
    {
      id: 'ehb-basics',
      title: 'EHB Basics',
      description: 'Learn the fundamentals of the EHB system architecture and components.',
      totalChallenges: 10,
      completedChallenges: 8,
      level: 'Beginner',
      estimatedTime: '2 hours',
      xpReward: 500
    },
    {
      id: 'api-integration',
      title: 'API Integration',
      description: 'Master connecting with EHB APIs and building integrations.',
      totalChallenges: 12,
      completedChallenges: 5,
      level: 'Intermediate',
      estimatedTime: '3 hours',
      xpReward: 750
    },
    {
      id: 'frontend-development',
      title: 'Frontend Development',
      description: 'Build powerful interfaces using EHB UI components.',
      totalChallenges: 8,
      completedChallenges: 0,
      level: 'Intermediate',
      estimatedTime: '2.5 hours',
      xpReward: 650
    },
    {
      id: 'blockchain-basics',
      title: 'Blockchain Integration',
      description: 'Learn how to use EHB blockchain features and smart contracts.',
      totalChallenges: 15,
      completedChallenges: 0,
      level: 'Advanced',
      estimatedTime: '4 hours',
      xpReward: 1000
    },
    {
      id: 'ai-integration',
      title: 'AI Services',
      description: 'Integrate EHB AI capabilities into your applications.',
      totalChallenges: 10,
      completedChallenges: 0,
      level: 'Advanced',
      estimatedTime: '3.5 hours',
      xpReward: 850
    },
    {
      id: 'security-best-practices',
      title: 'Security Best Practices',
      description: 'Learn how to secure your EHB applications and implement proper authentication.',
      totalChallenges: 8,
      completedChallenges: 0,
      level: 'Intermediate',
      estimatedTime: '2.5 hours',
      xpReward: 700
    }
  ];

  // User progress data
  const userProgress = {
    totalXP: 1250,
    level: 3,
    completedChallenges: 13,
    totalChallenges: 63,
    completedPaths: 0
  };

  return (
    <DashboardLayout activeItem="learning">
      <Head>
        <title>{`${siteConfig.title} | Learning`}</title>
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
              Learning Paths
            </h1>
            <p style={{ color: '#666' }}>
              Master EHB development with interactive challenges and earn rewards
            </p>
          </div>
          
          <div>
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'white',
              borderRadius: '4px',
              border: '1px solid #ddd',
              padding: '8px 12px',
              width: '240px'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px', color: '#666' }}>
                <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input 
                type="text" 
                placeholder="Search learning paths..." 
                style={{
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>
        </div>
        
        {/* User Progress Section */}
        <div style={{ 
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          marginBottom: '30px'
        }}>
          <h2 style={{ 
            fontSize: '1.2rem', 
            fontWeight: 'bold',
            marginBottom: '15px',
            color: '#333'
          }}>
            Your Progress
          </h2>
          
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '20px',
            marginBottom: '20px'
          }}>
            <div>
              <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>
                Total XP
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#0064db' }}>
                {userProgress.totalXP}
              </div>
            </div>
            
            <div>
              <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>
                Current Level
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#0064db' }}>
                {userProgress.level}
              </div>
            </div>
            
            <div>
              <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>
                Challenges Completed
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#0064db' }}>
                {userProgress.completedChallenges}/{userProgress.totalChallenges}
              </div>
            </div>
            
            <div>
              <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>
                Paths Completed
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#0064db' }}>
                {userProgress.completedPaths}
              </div>
            </div>
          </div>
          
          <div>
            <div style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '5px'
            }}>
              <span style={{ fontSize: '0.9rem', color: '#666' }}>Level {userProgress.level}</span>
              <span style={{ fontSize: '0.9rem', color: '#666' }}>Level {userProgress.level + 1}</span>
            </div>
            <div style={{ 
              backgroundColor: '#f5f5f5',
              height: '8px',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{ 
                backgroundColor: '#0064db',
                width: '65%',
                height: '100%'
              }} />
            </div>
            <div style={{ 
              fontSize: '0.8rem',
              color: '#666',
              textAlign: 'center',
              marginTop: '5px'
            }}>
              750 XP to next level
            </div>
          </div>
        </div>
        
        {/* Learning Paths Grid */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ 
            fontSize: '1.2rem', 
            fontWeight: 'bold',
            marginBottom: '20px',
            color: '#333'
          }}>
            Available Learning Paths
          </h2>
          
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px',
          }}>
            {learningPaths.map((path) => (
              <div key={path.id} style={{ 
                backgroundColor: 'white',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexDirection: 'column',
              }}>
                <div style={{ 
                  backgroundColor: path.level === 'Beginner' ? '#2e7d32' : 
                                  path.level === 'Intermediate' ? '#e65100' : '#0d47a1',
                  height: '8px',
                }} />
                
                <div style={{ padding: '20px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '10px'
                  }}>
                    <h3 style={{ 
                      fontSize: '1.2rem', 
                      fontWeight: 'bold',
                      color: '#333',
                    }}>
                      {path.title}
                    </h3>
                    
                    <span style={{ 
                      fontSize: '0.8rem',
                      fontWeight: 'medium',
                      padding: '3px 8px',
                      borderRadius: '12px',
                      backgroundColor: 
                        path.level === 'Beginner' ? '#e8f5e9' :
                        path.level === 'Intermediate' ? '#fff3e0' : '#e3f2fd',
                      color:
                        path.level === 'Beginner' ? '#2e7d32' :
                        path.level === 'Intermediate' ? '#e65100' : '#0d47a1',
                    }}>
                      {path.level}
                    </span>
                  </div>
                  
                  <p style={{ 
                    color: '#666',
                    marginBottom: '15px',
                    fontSize: '0.9rem',
                    minHeight: '2.7rem',
                  }}>
                    {path.description}
                  </p>
                  
                  <div style={{ marginBottom: '15px' }}>
                    <div style={{ 
                      backgroundColor: '#f5f5f5',
                      height: '8px',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{ 
                        backgroundColor: 
                          path.level === 'Beginner' ? '#2e7d32' :
                          path.level === 'Intermediate' ? '#e65100' : '#0d47a1',
                        width: `${(path.completedChallenges / path.totalChallenges) * 100}%`,
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
                      <span>{path.completedChallenges} of {path.totalChallenges} challenges</span>
                      <span>{Math.round((path.completedChallenges / path.totalChallenges) * 100)}% complete</span>
                    </div>
                  </div>
                  
                  <div style={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>
                      {path.estimatedTime} • {path.xpReward} XP
                    </div>
                    
                    <a 
                      href={`/learning/path/${path.id}`}
                      style={{
                        backgroundColor: path.completedChallenges > 0 ? '#0064db' : 'white',
                        color: path.completedChallenges > 0 ? 'white' : '#0064db',
                        border: path.completedChallenges > 0 ? 'none' : '1px solid #0064db',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        textDecoration: 'none',
                        display: 'inline-block'
                      }}
                    >
                      {path.completedChallenges > 0 ? 'Continue' : 'Start'}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Recommended Challenge */}
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ 
            fontSize: '1.2rem', 
            fontWeight: 'bold',
            marginBottom: '15px',
            color: '#333'
          }}>
            Recommended for You
          </h2>
          
          <div style={{ 
            display: 'flex',
            flexDirection: 'row',
            backgroundColor: 'white',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          }}>
            <div style={{
              backgroundColor: '#0064db',
              minWidth: '120px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '3rem',
              fontWeight: 'bold'
            }}>
              🔒
            </div>
            
            <div style={{ padding: '20px', flex: '1' }}>
              <h3 style={{ 
                fontSize: '1.2rem', 
                fontWeight: 'bold',
                marginBottom: '10px',
                color: '#333'
              }}>
                API Authentication Challenge
              </h3>
              
              <p style={{ 
                color: '#666',
                marginBottom: '15px',
                fontSize: '0.9rem'
              }}>
                Learn how to implement secure API authentication in your EHB applications.
                This challenge will help you complete the "Security Best Practices" learning path.
              </p>
              
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <span style={{ 
                    fontSize: '0.8rem',
                    padding: '3px 8px',
                    borderRadius: '12px',
                    backgroundColor: '#e3f2fd',
                    color: '#0d47a1'
                  }}>
                    25 min
                  </span>
                  
                  <span style={{ 
                    fontSize: '0.8rem',
                    padding: '3px 8px',
                    borderRadius: '12px',
                    backgroundColor: '#e8f5e9',
                    color: '#2e7d32'
                  }}>
                    +150 XP
                  </span>
                </div>
                
                <a 
                  href="/learning/challenge/api-auth"
                  style={{
                    backgroundColor: '#0064db',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    textDecoration: 'none',
                    display: 'inline-block'
                  }}
                >
                  Start Challenge →
                </a>
              </div>
            </div>
          </div>
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
          <p>New learning paths are regularly added based on developer feedback and platform updates.</p>
          <p>Complete the EHB Basics path to unlock advanced certifications.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Learning;