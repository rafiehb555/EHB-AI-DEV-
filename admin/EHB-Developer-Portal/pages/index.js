import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import BasicLayout from '../components/layout/BasicLayout';
import { useSiteConfig } from '../context/SiteConfigContext';

export default function Home() {
  const siteConfig = useSiteConfig();

  return (
    <BasicLayout>
      <Head>
        <title>{`${siteConfig.title} | Home`}</title>
      </Head>
      
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '40px 20px',
        textAlign: 'center'
      }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold',
          marginBottom: '20px',
          color: '#333'
        }}>
          Welcome to {siteConfig.title}
        </h1>
        
        <p style={{ 
          fontSize: '1.2rem', 
          maxWidth: '800px', 
          margin: '0 auto 40px',
          color: '#666'
        }}>
          {siteConfig.description}
        </p>
        
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          {/* Dashboard Card */}
          <Link href="/dashboard" style={{ textDecoration: 'none' }}>
            <div style={{ 
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '30px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer',
              height: '100%',
              textAlign: 'left'
            }}>
              <h2 style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold',
                marginBottom: '15px',
                color: '#0064db'
              }}>
                Dashboard
              </h2>
              <p style={{ color: '#666' }}>
                View system status, metrics, and real-time analytics in one place.
              </p>
            </div>
          </Link>
          
          {/* Phases Card */}
          <Link href="/phases" style={{ textDecoration: 'none' }}>
            <div style={{ 
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '30px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer',
              height: '100%',
              textAlign: 'left'
            }}>
              <h2 style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold',
                marginBottom: '15px',
                color: '#0064db'
              }}>
                Phases
              </h2>
              <p style={{ color: '#666' }}>
                Explore all EHB phases and their implementation status.
              </p>
            </div>
          </Link>
          
          {/* Analytics Card */}
          <Link href="/analytics" style={{ textDecoration: 'none' }}>
            <div style={{ 
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '30px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer',
              height: '100%',
              textAlign: 'left'
            }}>
              <h2 style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold',
                marginBottom: '15px',
                color: '#0064db'
              }}>
                Analytics
              </h2>
              <p style={{ color: '#666' }}>
                Access detailed analytics and reporting for the entire system.
              </p>
            </div>
          </Link>
          
          {/* Learning Path Card */}
          <Link href="/learning" style={{ textDecoration: 'none' }}>
            <div style={{ 
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '30px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer',
              height: '100%',
              textAlign: 'left'
            }}>
              <h2 style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold',
                marginBottom: '15px',
                color: '#0064db'
              }}>
                Learning Path
              </h2>
              <p style={{ color: '#666' }}>
                Follow guided tutorials and interactive challenges to learn the EHB system.
              </p>
            </div>
          </Link>
        </div>
        
        <div style={{ 
          backgroundColor: '#f0f7ff',
          borderRadius: '8px',
          padding: '30px',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold',
            marginBottom: '15px',
            color: '#0064db'
          }}>
            Need Help?
          </h2>
          <p style={{ marginBottom: '20px', color: '#666' }}>
            Use the help button in the bottom right corner to access contextual help and AI explanations.
          </p>
          <p style={{ fontWeight: 'bold', color: '#333' }}>
            Version: {siteConfig.version}
          </p>
        </div>
      </div>
    </BasicLayout>
  );
}