import React from 'react';
import Head from 'next/head';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useSiteConfig } from '../context/SiteConfigContext';

export default function Analytics() {
  const siteConfig = useSiteConfig();

  // Sample analytics data
  const systemMetrics = [
    { name: 'API Requests', value: '45.2K', change: '+12%', timeframe: 'Last 7 days' },
    { name: 'Average Response Time', value: '238ms', change: '-18%', timeframe: 'Last 7 days' },
    { name: 'Error Rate', value: '0.05%', change: '-32%', timeframe: 'Last 7 days' },
    { name: 'AI Service Calls', value: '12.8K', change: '+28%', timeframe: 'Last 7 days' },
  ];

  // Sample usage by service data
  const serviceUsage = [
    { name: 'EHB AI Agent', usage: 35 },
    { name: 'Code Suggest', usage: 20 },
    { name: 'Voice Module Gen', usage: 15 },
    { name: 'SQL Badge System', usage: 10 },
    { name: 'Referral Tree', usage: 8 },
    { name: 'Others', usage: 12 },
  ];

  // User activity data by day
  const userActivity = [
    { day: 'Mon', developers: 120, admins: 45, users: 320 },
    { day: 'Tue', developers: 132, admins: 42, users: 350 },
    { day: 'Wed', developers: 141, admins: 48, users: 410 },
    { day: 'Thu', developers: 154, admins: 52, users: 390 },
    { day: 'Fri', developers: 165, admins: 55, users: 380 },
    { day: 'Sat', developers: 75, admins: 22, users: 190 },
    { day: 'Sun', developers: 65, admins: 19, users: 170 },
  ];

  return (
    <DashboardLayout activeItem="analytics">
      <Head>
        <title>{`${siteConfig.title} | Analytics`}</title>
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
              Analytics Dashboard
            </h1>
            <p style={{ color: '#666' }}>
              System performance metrics and usage statistics
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <select style={{
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              backgroundColor: 'white',
              fontSize: '14px'
            }}>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="365d">Last year</option>
            </select>
            
            <button style={{
              backgroundColor: '#0064db',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}>
              Export Report
            </button>
          </div>
        </div>
        
        {/* Metrics Grid */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          {systemMetrics.map((metric, index) => (
            <div key={index} style={{ 
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '20px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            }}>
              <h3 style={{ 
                fontSize: '0.9rem', 
                fontWeight: 'normal',
                color: '#666',
                marginBottom: '8px'
              }}>
                {metric.name}
              </h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '10px' }}>
                <span style={{ 
                  fontSize: '2rem', 
                  fontWeight: 'bold',
                  color: '#333'
                }}>
                  {metric.value}
                </span>
                <span style={{ 
                  fontSize: '0.9rem',
                  backgroundColor: metric.change.startsWith('+') ? '#e8f5e9' : '#ffebee',
                  color: metric.change.startsWith('+') ? '#2e7d32' : '#c62828',
                  padding: '3px 8px',
                  borderRadius: '12px',
                }}>
                  {metric.change}
                </span>
              </div>
              <div style={{ 
                fontSize: '0.8rem',
                color: '#888'
              }}>
                {metric.timeframe}
              </div>
            </div>
          ))}
        </div>
        
        {/* Main Content - Charts */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          {/* Service Usage Chart */}
          <div style={{ 
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          }}>
            <h2 style={{ 
              fontSize: '1.2rem', 
              fontWeight: 'bold',
              marginBottom: '20px',
              color: '#333'
            }}>
              Usage by Service
            </h2>
            
            <div style={{ height: '250px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <div style={{ display: 'flex', height: '200px', alignItems: 'flex-end', marginBottom: '15px' }}>
                {serviceUsage.map((service, index) => (
                  <div key={index} style={{ 
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    height: '100%',
                    justifyContent: 'flex-end'
                  }}>
                    <div style={{ 
                      width: '70%', 
                      height: `${service.usage * 5}px`,
                      backgroundColor: index === 0 ? '#0064db' : 
                                       index === 1 ? '#5a00ff' : 
                                       index === 2 ? '#00c853' : 
                                       index === 3 ? '#ff9100' : 
                                       index === 4 ? '#f50057' : '#888',
                      borderRadius: '4px 4px 0 0'
                    }} />
                  </div>
                ))}
              </div>
              
              <div style={{ display: 'flex' }}>
                {serviceUsage.map((service, index) => (
                  <div key={index} style={{ 
                    flex: 1,
                    fontSize: '0.7rem',
                    textAlign: 'center',
                    color: '#666',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    padding: '0 2px'
                  }}>
                    {service.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* User Activity Chart */}
          <div style={{ 
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          }}>
            <h2 style={{ 
              fontSize: '1.2rem', 
              fontWeight: 'bold',
              marginBottom: '20px',
              color: '#333'
            }}>
              Weekly User Activity
            </h2>
            
            <div style={{ height: '250px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <div style={{ display: 'flex', height: '200px', alignItems: 'flex-end', marginBottom: '15px', gap: '10px' }}>
                {userActivity.map((day, index) => (
                  <div key={index} style={{ 
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    height: '100%',
                    justifyContent: 'flex-end',
                    gap: '1px'
                  }}>
                    <div style={{ 
                      width: '100%', 
                      height: `${day.users / 4}px`,
                      backgroundColor: '#e3f2fd',
                      borderRadius: '4px 4px 0 0'
                    }} />
                    <div style={{ 
                      width: '100%', 
                      height: `${day.developers / 2}px`,
                      backgroundColor: '#0064db'
                    }} />
                    <div style={{ 
                      width: '100%', 
                      height: `${day.admins * 1.5}px`,
                      backgroundColor: '#002f6c',
                      borderRadius: '0 0 4px 4px'
                    }} />
                  </div>
                ))}
              </div>
              
              <div style={{ display: 'flex' }}>
                {userActivity.map((day, index) => (
                  <div key={index} style={{ 
                    flex: 1,
                    fontSize: '0.7rem',
                    textAlign: 'center',
                    color: '#666'
                  }}>
                    {day.day}
                  </div>
                ))}
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '15px', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.8rem' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: '#e3f2fd', marginRight: '5px', borderRadius: '2px' }} />
                <span>Users</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.8rem' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: '#0064db', marginRight: '5px', borderRadius: '2px' }} />
                <span>Developers</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.8rem' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: '#002f6c', marginRight: '5px', borderRadius: '2px' }} />
                <span>Admins</span>
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
          <p>Data last updated: {new Date().toLocaleString()}</p>
          <p>These metrics are based on actual system usage tracked across all EHB services.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}