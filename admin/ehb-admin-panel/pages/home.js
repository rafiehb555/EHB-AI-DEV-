import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import DashboardLayout from '../components/layout/DashboardLayout';

// Sample data for services
const servicesData = [
  {
    id: 'gosellr',
    name: 'GoSellr E-commerce',
    description: 'E-commerce platform with franchise management system for online sellers',
    icon: '🛒',
    link: '/services/EHB-GoSellr',
    category: 'E-commerce',
    status: 'active'
  },
  {
    id: 'corporate',
    name: 'Corporate Franchise',
    description: 'Enterprise-level franchise management platform',
    icon: '🏢',
    link: '/system/franchise-system/EHB-CORPORATE-FRANCHISE',
    category: 'Franchise',
    status: 'active'
  },
  {
    id: 'master',
    name: 'Master Franchise',
    description: 'Manage multiple franchise operations from a central dashboard',
    icon: '🔑',
    link: '/system/franchise-system/EHB-MASTER-FRANCHISE',
    category: 'Franchise',
    status: 'active'
  },
  {
    id: 'wallet',
    name: 'EHB Wallet',
    description: 'Secure digital wallet for crypto and fiat transactions',
    icon: '💼',
    link: '/admin/ehb-wallet',
    category: 'Finance',
    status: 'active'
  },
  {
    id: 'blockchain',
    name: 'Blockchain Services',
    description: 'Distributed ledger technology for secure transactions',
    icon: '🔗',
    link: '/system/EHB-Blockchain',
    category: 'Technology',
    status: 'active'
  },
  {
    id: 'departments',
    name: 'Departments Flow',
    description: 'Organizational workflow and department management',
    icon: '🏛️',
    link: '/system/EHB-Services-Departments-Flow',
    category: 'Management',
    status: 'active'
  },
  {
    id: 'database',
    name: 'SQL Services',
    description: 'Database management and SQL query tools',
    icon: '📊',
    link: '/system/EHB-SQL',
    category: 'Technology',
    status: 'active'
  },
  {
    id: 'analytics',
    name: 'Analytics Dashboard',
    description: 'Comprehensive data visualization and reporting tools',
    icon: '📈',
    link: '/dashboard/analytics',
    category: 'Business Intelligence',
    status: 'active'
  }
];

// Sample data for quick stats
const statsData = [
  { label: 'Total Services', value: 8 },
  { label: 'Active Users', value: 245 },
  { label: 'Transactions', value: 12854 },
  { label: 'System Uptime', value: '99.98%' }
];

function Home() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredServices, setFilteredServices] = useState(servicesData);
  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique categories
  useEffect(() => {
    const uniqueCategories = ['All', ...new Set((servicesData || []).map(service => service.category))];
    setCategories(uniqueCategories);
  }, []);

  // Filter services based on category and search query
  useEffect(() => {
    let filtered = servicesData;
    
    // Apply category filter
    if (selectedCategory !== 'All') {
      filtered = (filtered || []).filter(service => service.category === selectedCategory);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = (filtered || []).filter(service => 
        service.name.toLowerCase().includes(query) || 
        service.description.toLowerCase().includes(query)
      );
    }
    
    setFilteredServices(filtered);
  }, [selectedCategory, searchQuery]);

  return (
    <>
      <Head>
        <title>EHB Home Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div>
                <h1 className={styles.headerTitle}>EHB Home Dashboard</h1>
                <p className={styles.headerSubtitle}>Comprehensive Enterprise Hybrid Blockchain System</p>
              </div>
              <div style={{display: 'flex', gap: '0.75rem'}}>
                <Link href="/dashboard" style={{padding: '0.5rem 1rem', backgroundColor: '#2563eb', color: 'white', borderRadius: '0.375rem', textDecoration: 'none'}}>
                  Admin Panel
                </Link>
                <Link href="/dashboard/analytics" style={{padding: '0.5rem 1rem', backgroundColor: '#16a34a', color: 'white', borderRadius: '0.375rem', textDecoration: 'none'}}>
                  Analytics
                </Link>
              </div>
            </div>
          </div>
        </header>
        
        <main className={styles.main}>
          {/* Stats Section */}
          <div className={styles.statsGrid}>
            {(statsData || []).map((stat, index) => (
              <div key={index} className={styles.statCard}>
                <p className={styles.statLabel}>{stat.label}</p>
                <p className={styles.statValue}>{stat.value}</p>
              </div>
            ))}
          </div>
          
          {/* Filters */}
          <div className={styles.filterCard}>
            <div className={styles.filterRow}>
              <div className={styles.filterCategories}>
                {(categories || []).map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`${styles.filterButton} ${
                      selectedCategory === category
                        ? styles.filterButtonActive
                        : styles.filterButtonInactive
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <div style={{ width: '100%', maxWidth: '16rem' }}>
                <input
                  type="text"
                  placeholder="Search services..."
                  className={styles.searchInput}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          {/* Services Grid */}
          <div className={styles.servicesGrid}>
            {(filteredServices || []).map(service => (
              <Link href={service.link} key={service.id} style={{ textDecoration: 'none' }}>
                <div className={styles.serviceCard}>
                  <div className={styles.serviceCardBody}>
                    <div className={styles.serviceCardHead}>
                      <span className={styles.serviceIcon}>{service.icon}</span>
                      <div>
                        <h3 className={styles.serviceTitle}>{service.name}</h3>
                        <span className={styles.serviceCategory}>
                          {service.category}
                        </span>
                      </div>
                    </div>
                    <p className={styles.serviceDescription}>{service.description}</p>
                  </div>
                  <div className={styles.serviceCardFooter}>
                    <div className={styles.serviceFooterRow}>
                      <span className={`${styles.serviceStatus} ${
                        service.status === 'active' 
                          ? styles.serviceStatusActive 
                          : styles.serviceStatusMaintenance
                      }`}>
                        {service.status === 'active' ? 'Active' : 'Maintenance'}
                      </span>
                      <span className={styles.serviceAccess}>Access →</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {filteredServices.length === 0 && (
            <div className={styles.noResults}>
              <p className={styles.noResultsText}>No services found matching your criteria</p>
              <button 
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className={styles.resetButton}
              >
                Reset Filters
              </button>
            </div>
          )}
        </main>
        
        {/* Footer */}
        <footer className={styles.footer}>
          <div className={styles.footerInner}>
            <div className={styles.footerRow}>
              <div className={styles.footerCopyright}>
                &copy; {new Date().getFullYear()} EHB Technologies. All rights reserved.
              </div>
              <div className={styles.footerLinks}>
                <div className={styles.footerLinkList}>
                  <a href="#" className={styles.footerLink}>Help</a>
                  <a href="#" className={styles.footerLink}>Support</a>
                  <a href="#" className={styles.footerLink}>API</a>
                  <a href="#" className={styles.footerLink}>Contact</a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

// Apply DashboardLayout to this page<DashboardLayout></DashboardLayout> (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Home;