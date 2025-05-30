import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [referralStats, setReferralStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [referralLink, setReferralLink] = useState('');
  const [copied, setCopied] = useState(false);

  // Fetch user data and referral stats on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError('');
      
      try {
        // Check if token exists in localStorage
        const token = localStorage.getItem('jps_token');
        if (!token) {
          // Redirect to login if no token found
          window.location.href = '/login';
          return;
        }
        
        // Set the authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Get user data from local storage
        const userData = localStorage.getItem('jps_user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          
          // Generate referral link based on user's referral code
          if (parsedUser.referralCode) {
            setReferralLink(`${window.location.origin}/register?ref=${parsedUser.referralCode}`);
          }
        }
        
        // Fetch referral statistics from the API
        const response = await axios.get('/api/auth/referral-stats');
        
        if (response.data.success) {
          setReferralStats(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        
        // Redirect to login if authentication fails
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('jps_token');
          localStorage.removeItem('jps_user');
          window.location.href = '/login';
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);
  
  // Copy referral link to clipboard
  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      })
      .catch(err => {
        console.error('Failed to copy:', err);
      });
  };
  
  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('jps_token');
    localStorage.removeItem('jps_user');
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
        
        <style jsx>{`
          .dashboard-loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
          }
          
          .loading-spinner {
            width: 50px;
            height: 50px;
            border: 5px solid #f3f3f3;
            border-top: 5px solid #1976d2;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }
  
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>JPS Affiliate Dashboard</h1>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {user && (
        <div className="user-welcome">
          <h2>Welcome, {user.name}!</h2>
        </div>
      )}
      
      <div className="dashboard-grid">
        <div className="dashboard-card referral-link-card">
          <h3>Your Referral Link</h3>
          <div className="referral-link-container">
            <input 
              type="text" 
              value={referralLink} 
              readOnly 
              className="referral-link-input"
            />
            <button 
              className="copy-button" 
              onClick={copyReferralLink}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <p className="referral-instructions">
            Share this link with friends, colleagues, or on social media to earn rewards when they register.
          </p>
        </div>
        
        <div className="dashboard-card stats-card">
          <h3>Your Referral Stats</h3>
          {referralStats ? (
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-value">
                  {referralStats.referralsCount || 0}
                </span>
                <span className="stat-label">Total Referrals</span>
              </div>
              
              <div className="stat-item">
                <span className="stat-value">
                  {referralStats.activeReferrals || 0}
                </span>
                <span className="stat-label">Active Referrals</span>
              </div>
              
              <div className="stat-item">
                <span className="stat-value">
                  {referralStats.pointsEarned || 0}
                </span>
                <span className="stat-label">Points Earned</span>
              </div>
              
              <div className="stat-item">
                <span className="stat-value">
                  ${referralStats.rewardsEarned || 0}
                </span>
                <span className="stat-label">Rewards Earned</span>
              </div>
            </div>
          ) : (
            <p className="no-stats">No referral statistics available yet. Start sharing your referral link to earn rewards!</p>
          )}
        </div>
        
        <div className="dashboard-card recent-activity-card">
          <h3>Recent Activity</h3>
          {referralStats && referralStats.recentActivity && referralStats.recentActivity.length > 0 ? (
            <ul className="activity-list">
              {(referralStats.recentActivity || []).map((activity, index) => (
                <li key={index} className="activity-item">
                  <div className="activity-icon"></div>
                  <div className="activity-details">
                    <p className="activity-description">{activity.description}</p>
                    <p className="activity-date">{new Date(activity.date).toLocaleDateString()}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-activity">No recent activity to display.</p>
          )}
        </div>
        
        <div className="dashboard-card how-it-works-card">
          <h3>How It Works</h3>
          <ol className="steps-list">
            <li>Share your unique referral link with potential job seekers or employers</li>
            <li>When they register using your link, you'll earn referral points</li>
            <li>Earn additional rewards when your referrals complete key milestones</li>
            <li>Redeem your points for rewards or cash bonuses</li>
          </ol>
        </div>
      </div>
      
      <style jsx>{`
        .dashboard-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 15px;
          border-bottom: 1px solid #eee;
        }
        
        .dashboard-header h1 {
          color: #1565c0;
          margin: 0;
        }
        
        .logout-button {
          background: #f5f5f5;
          color: #333;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }
        
        .logout-button:hover {
          background: #e0e0e0;
        }
        
        .user-welcome {
          margin-bottom: 30px;
        }
        
        .user-welcome h2 {
          color: #333;
          font-size: 24px;
        }
        
        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
          gap: 20px;
        }
        
        .dashboard-card {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        
        .dashboard-card h3 {
          color: #333;
          margin-top: 0;
          margin-bottom: 15px;
          font-size: 18px;
        }
        
        .referral-link-container {
          display: flex;
          margin-bottom: 15px;
        }
        
        .referral-link-input {
          flex: 1;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px 0 0 4px;
          font-size: 14px;
        }
        
        .copy-button {
          background: #1976d2;
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 0 4px 4px 0;
          cursor: pointer;
          font-weight: 500;
        }
        
        .copy-button:hover {
          background: #1565c0;
        }
        
        .referral-instructions {
          color: #666;
          font-size: 14px;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }
        
        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 15px;
          background: #f5f5f5;
          border-radius: 6px;
        }
        
        .stat-value {
          font-size: 24px;
          font-weight: 600;
          color: #1976d2;
          margin-bottom: 5px;
        }
        
        .stat-label {
          font-size: 14px;
          color: #666;
        }
        
        .no-stats, .no-activity {
          color: #666;
          font-style: italic;
        }
        
        .activity-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .activity-item {
          display: flex;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #eee;
        }
        
        .activity-item:last-child {
          border-bottom: none;
        }
        
        .activity-icon {
          width: 10px;
          height: 10px;
          background: #1976d2;
          border-radius: 50%;
          margin-right: 15px;
        }
        
        .activity-details {
          flex: 1;
        }
        
        .activity-description {
          margin: 0 0 5px 0;
          font-size: 14px;
          color: #333;
        }
        
        .activity-date {
          margin: 0;
          font-size: 12px;
          color: #666;
        }
        
        .steps-list {
          padding-left: 20px;
          margin: 0;
        }
        
        .steps-list li {
          margin-bottom: 10px;
          color: #333;
        }
        
        .error-message {
          background: #ffebee;
          color: #d32f2f;
          padding: 10px 15px;
          border-radius: 4px;
          margin-bottom: 20px;
          border-left: 4px solid #d32f2f;
        }
        
        /* Responsive adjustments */
        @media (max-width: 1024px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;