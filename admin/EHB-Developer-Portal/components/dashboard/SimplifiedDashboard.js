import React, { useState, useEffect } from 'react';
import { FiActivity, FiBox, FiChevronDown, FiCode, FiDatabase, FiList, FiSettings } from 'react-icons/fi';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import ServiceSection from './ServiceSection';
import SystemHealthCard from './SystemHealthCard';
import GitHubIntegrationSection from './GitHubIntegrationSection';

// Mock data - will be replaced with real data
const chartData = {
  labels: ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'P10'],
  datasets: [
    {
      label: 'Progress',
      data: [100, 75, 90, 60, 85, 40, 20, 10, 5, 0],
      backgroundColor: 'rgba(90, 120, 255, 0.2)',
      borderColor: 'rgba(90, 120, 255, 1)',
      borderWidth: 2,
      tension: 0.4,
    },
  ],
};

const barData = {
  labels: ['Admin', 'Services', 'System', 'Blockchain', 'AI', 'Frontend'],
  datasets: [
    {
      label: 'Features Implemented',
      data: [75, 60, 85, 40, 92, 65],
      backgroundColor: [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 159, 64, 0.7)',
      ],
    },
  ],
};

const doughnutData = {
  labels: ['Completed', 'In Progress', 'Planned'],
  datasets: [
    {
      data: [63, 27, 10],
      backgroundColor: [
        'rgba(75, 192, 192, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
      ],
      borderColor: [
        'rgba(75, 192, 192, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

const SimplifiedDashboard = () => {
  const [phases, setPhases] = useState([]);
  const [services, setServices] = useState([]);
  const [systems, setSystems] = useState([]);
  const [adminModules, setAdminModules] = useState([]);
  const [healthData, setHealthData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  
  // Stats calculation
  const stats = {
    totalPhases: phases.length || 31,
    completedPhases: phases.filter(p => p?.status === 'completed')?.length || 24,
    inProgressPhases: phases.filter(p => p?.status === 'in-progress')?.length || 5,
    plannedPhases: phases.filter(p => p?.status === 'planned')?.length || 2,
  };
  
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchPhasesData(),
        fetchServiceData(),
        fetchHealthData()
      ]);
      setIsLoading(false);
    };
    
    fetchData();
  }, []);

  // Fetch phase data
  const fetchPhasesData = async () => {
    try {
      const res = await fetch('/api/phases');
      setPhases(await res.json());
    } catch (error) {
      console.error('Error fetching phases:', error);
      // Use mock data if API fails
      setPhases([]);
    }
  };

  // Fetch services, systems, and admin modules
  const fetchServiceData = async () => {
    try {
      const [servicesRes, systemsRes, adminRes] = await Promise.all([
        fetch('/api/services'),
        fetch('/api/systems'),
        fetch('/api/admin-modules')
      ]);
      
      setServices(await servicesRes.json());
      setSystems(await systemsRes.json());
      setAdminModules(await adminRes.json());
    } catch (error) {
      console.error('Error fetching service data:', error);
      // Use mock data if API fails
      setServices([]);
      setSystems([]);
      setAdminModules([]);
    }
  };
  
  // Fetch system health data
  const fetchHealthData = async () => {
    try {
      const res = await fetch('/api/system-health');
      setHealthData(await res.json());
    } catch (error) {
      console.error('Error fetching health data:', error);
      setHealthData(null);
    }
  };

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-indicator">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-label">Total Phases</div>
            <div className="stat-number" style={{color: '#4299E1'}}>{stats.totalPhases}</div>
            <div className="stat-help-text">EHB-AI-Dev Phases</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-label">Completed</div>
            <div className="stat-number" style={{color: '#38A169'}}>{stats.completedPhases}</div>
            <div className="progress-bar-container">
              <div 
                className="progress-bar" 
                style={{
                  width: `${(stats.completedPhases/stats.totalPhases*100)}%`,
                  backgroundColor: '#38A169'
                }} 
              />
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-label">In Progress</div>
            <div className="stat-number" style={{color: '#4299E1'}}>{stats.inProgressPhases}</div>
            <div className="progress-bar-container">
              <div 
                className="progress-bar" 
                style={{
                  width: `${(stats.inProgressPhases/stats.totalPhases*100)}%`,
                  backgroundColor: '#4299E1'
                }} 
              />
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-label">Planned</div>
            <div className="stat-number" style={{color: '#ECC94B'}}>{stats.plannedPhases}</div>
            <div className="progress-bar-container">
              <div 
                className="progress-bar" 
                style={{
                  width: `${(stats.plannedPhases/stats.totalPhases*100)}%`,
                  backgroundColor: '#ECC94B'
                }} 
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts Row */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Phases Progress</h3>
          </div>
          <div className="chart-body">
            <div className="chart-container">
              <Line 
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
        
        <div className="chart-card">
          <div className="chart-header">
            <h3>Feature Implementation</h3>
          </div>
          <div className="chart-body">
            <div className="chart-container">
              <Bar 
                data={barData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
        
        <div className="chart-card">
          <div className="chart-header">
            <h3>Status Overview</h3>
          </div>
          <div className="chart-body">
            <div className="chart-container">
              <Doughnut 
                data={doughnutData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* System Health and Tabs */}
      <div className="dashboard-grid">
        <div className="dashboard-main">
          <div className="tabs-container">
            <div className="tabs-header">
              <button 
                className={`tab-button ${activeTab === 0 ? 'active' : ''}`}
                onClick={() => setActiveTab(0)}
              >
                <FiList className="tab-icon" />
                All Phases
              </button>
              <button 
                className={`tab-button ${activeTab === 1 ? 'active' : ''}`}
                onClick={() => setActiveTab(1)}
              >
                <FiActivity className="tab-icon" />
                Recent Activity
              </button>
              <button 
                className={`tab-button ${activeTab === 2 ? 'active' : ''}`}
                onClick={() => setActiveTab(2)}
              >
                <FiSettings className="tab-icon" />
                System Updates
              </button>
            </div>
            
            <div className="tab-content">
              {activeTab === 0 && (
                <div className="phases-tab">
                  <div className="tab-card">
                    <div className="tab-card-header">
                      <h3>AI-Dev Project Phases</h3>
                      <div className="dropdown">
                        <button className="dropdown-toggle">
                          Filter <FiChevronDown />
                        </button>
                      </div>
                    </div>
                    <div className="phases-list">
                      {phases.length > 0 ? (
                        phases.map((phase, index) => (
                          <div key={`phase-${index}`} className="phase-item">
                            <div className="phase-header">
                              <div>
                                <div className="phase-title">{phase.name || `Phase ${index + 1}`}</div>
                                <div className="phase-description">{phase.description || 'Phase description not available'}</div>
                              </div>
                              <div className={`phase-badge ${phase.status || 'planned'}`}>
                                {phase.status || 'Planned'}
                              </div>
                            </div>
                            <div className="phase-progress-container">
                              <div 
                                className="phase-progress" 
                                style={{
                                  width: `${phase.progress || 0}%`,
                                  backgroundColor: 
                                    phase.status === 'completed' ? '#38A169' : 
                                    phase.status === 'in-progress' ? '#4299E1' : '#ECC94B'
                                }}
                              />
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="empty-phases">
                          No phases found. Phases data will appear here when available.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 1 && (
                <div className="activity-tab">
                  <div className="tab-card">
                    <h3 className="tab-card-title">Recent Activity</h3>
                    <div className="activity-list">
                      {[1, 2, 3, 4, 5].map((item) => (
                        <div key={`activity-${item}`} className="activity-item">
                          <div className="activity-icon">
                            <FiCode />
                          </div>
                          <div className="activity-content">
                            <div className="activity-title">Phase {item} Completed</div>
                            <div className="activity-description">
                              Integration of AI development tools with LangChain complete.
                            </div>
                            <div className="activity-time">
                              {item} hour{item !== 1 ? 's' : ''} ago
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 2 && (
                <div className="updates-tab">
                  <div className="tab-card">
                    <h3 className="tab-card-title">System Updates</h3>
                    <div className="updates-list">
                      {[1, 2, 3].map((item) => (
                        <div key={`update-${item}`} className="update-item">
                          <div className="update-header">
                            <div className="update-icon">
                              <FiDatabase />
                            </div>
                            <div className="update-title">System Update v1.{item}</div>
                          </div>
                          <div className="update-description">
                            Enhanced integration capabilities with {item === 1 ? 'LangChain' : item === 2 ? 'AutoGPT' : 'AutoGen'}
                          </div>
                          <div className="update-footer">
                            <div className="update-date">
                              Released: May {item + 1}, 2025
                            </div>
                            <div className="update-badge">System Core</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="dashboard-sidebar">
          <SystemHealthCard healthData={healthData} />
        </div>
      </div>
      
      {/* Services Sections */}
      <div className="services-container">
        <GitHubIntegrationSection />
        
        <ServiceSection
          title="AI Services" 
          description="AI-powered services, tools, and integration points"
          services={services.filter(s => s?.type === 'ai')} 
          filterKey="status"
          filterValue="all"
        />
        
        <ServiceSection
          title="System Components" 
          description="Core system components and infrastructure services"
          services={systems} 
          filterKey="status"
          filterValue="all"
        />
        
        <ServiceSection
          title="Admin Modules" 
          description="Administrative tools and management interfaces"
          services={adminModules} 
          filterKey="status"
          filterValue="all"
        />
      </div>
      
      <style jsx>{`
        .dashboard-container {
          min-height: 100vh;
          background-color: #F7FAFC;
          padding: 1rem;
          padding-bottom: 2rem;
        }
        
        .dashboard-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        
        .dashboard-loading {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .loading-indicator {
          font-size: 1.25rem;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        
        @media (min-width: 640px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (min-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        
        .stat-card {
          background-color: white;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          padding: 1rem;
        }
        
        .stat-content {
          width: 100%;
        }
        
        .stat-label {
          font-size: 0.875rem;
          font-weight: 500;
        }
        
        .stat-number {
          font-size: 1.875rem;
          font-weight: 700;
        }
        
        .stat-help-text {
          font-size: 0.875rem;
          color: #718096;
        }
        
        .progress-bar-container {
          height: 0.5rem;
          width: 100%;
          background-color: #EDF2F7;
          border-radius: 9999px;
          margin-top: 0.5rem;
          overflow: hidden;
        }
        
        .progress-bar {
          height: 100%;
          border-radius: 9999px;
        }
        
        .charts-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        
        @media (min-width: 768px) {
          .charts-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (min-width: 1024px) {
          .charts-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        
        .chart-card {
          background-color: white;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          overflow: hidden;
        }
        
        .chart-header {
          padding: 1rem 1rem 0 1rem;
        }
        
        .chart-header h3 {
          font-size: 1rem;
          font-weight: 600;
          margin: 0;
        }
        
        .chart-body {
          padding: 1rem;
        }
        
        .chart-container {
          height: 250px;
          position: relative;
        }
        
        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        
        @media (min-width: 1024px) {
          .dashboard-grid {
            grid-template-columns: 2fr 1fr;
          }
        }
        
        .tabs-container {
          width: 100%;
        }
        
        .tabs-header {
          display: flex;
          margin-bottom: 1rem;
          border-bottom: 1px solid #E2E8F0;
        }
        
        .tab-button {
          padding: 0.75rem 1rem;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
          color: #4A5568;
          display: flex;
          align-items: center;
          border-bottom: 2px solid transparent;
        }
        
        .tab-button.active {
          color: #4299E1;
          border-bottom: 2px solid #4299E1;
        }
        
        .tab-icon {
          margin-right: 0.5rem;
        }
        
        .tab-card {
          background-color: white;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          padding: 1rem;
        }
        
        .tab-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        
        .tab-card-header h3 {
          font-size: 1rem;
          font-weight: 600;
          margin: 0;
        }
        
        .tab-card-title {
          font-size: 1rem;
          font-weight: 600;
          margin: 0 0 1rem 0;
        }
        
        .dropdown-toggle {
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          background-color: white;
          border: 1px solid #E2E8F0;
          border-radius: 0.25rem;
          display: flex;
          align-items: center;
          cursor: pointer;
        }
        
        .dropdown-toggle svg {
          margin-left: 0.5rem;
        }
        
        .phases-list, .activity-list, .updates-list {
          max-height: 350px;
          overflow-y: auto;
        }
        
        .phase-item {
          padding: 0.75rem;
          margin-bottom: 0.5rem;
          border: 1px solid #E2E8F0;
          border-radius: 0.375rem;
        }
        
        .phase-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        
        .phase-title {
          font-weight: 600;
        }
        
        .phase-description {
          font-size: 0.875rem;
          color: #718096;
        }
        
        .phase-badge {
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
          border-radius: 9999px;
          text-transform: capitalize;
          color: white;
        }
        
        .phase-badge.completed {
          background-color: #38A169;
        }
        
        .phase-badge.in-progress {
          background-color: #4299E1;
        }
        
        .phase-badge.planned {
          background-color: #ECC94B;
        }
        
        .phase-progress-container {
          height: 0.5rem;
          width: 100%;
          background-color: #EDF2F7;
          border-radius: 9999px;
          margin-top: 0.5rem;
          overflow: hidden;
        }
        
        .phase-progress {
          height: 100%;
          border-radius: 9999px;
        }
        
        .empty-phases {
          text-align: center;
          padding: 2.5rem 0;
        }
        
        .activity-item {
          display: flex;
          padding: 0.75rem;
          margin-bottom: 0.5rem;
          border: 1px solid #E2E8F0;
          border-radius: 0.375rem;
          align-items: flex-start;
        }
        
        .activity-icon {
          background-color: #EBF8FF;
          color: #4299E1;
          padding: 0.5rem;
          border-radius: 0.375rem;
          margin-right: 0.75rem;
        }
        
        .activity-content {
          flex: 1;
        }
        
        .activity-title {
          font-weight: 600;
        }
        
        .activity-description {
          font-size: 0.875rem;
          color: #718096;
        }
        
        .activity-time {
          font-size: 0.75rem;
          color: #718096;
        }
        
        .update-item {
          padding: 0.75rem;
          margin-bottom: 0.5rem;
          border: 1px solid #E2E8F0;
          border-radius: 0.375rem;
        }
        
        .update-header {
          display: flex;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        
        .update-icon {
          background-color: #FAF5FF;
          color: #805AD5;
          padding: 0.5rem;
          border-radius: 0.375rem;
          margin-right: 0.75rem;
        }
        
        .update-title {
          font-weight: 600;
        }
        
        .update-description {
          font-size: 0.875rem;
        }
        
        .update-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 0.5rem;
        }
        
        .update-date {
          font-size: 0.75rem;
          color: #718096;
        }
        
        .update-badge {
          background-color: #805AD5;
          color: white;
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
          border-radius: 9999px;
        }
        
        .services-container {
          margin-bottom: 2rem;
        }
      `}</style>
    </div>
  );
};

export default SimplifiedDashboard;