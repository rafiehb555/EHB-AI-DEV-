import React from 'react';
import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  return (
    <div className="login-page">
      <div className="header">
        <h1>JPS Affiliate Program</h1>
        <p>Welcome Back</p>
      </div>
      
      <LoginForm /></LoginForm>
      
      <div className="info-section">
        <h3>Affiliate Program Benefits</h3>
        <p>Log in to manage your referrals and track your rewards in our affiliate program.</p>
      </div>
      
      <style jsx>{`
        .login-page {
          max-width: 900px;
          margin: 0 auto;
          padding: 40px 20px;
        }
        
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        
        .header h1 {
          color: #1565c0;
          margin-bottom: 10px;
        }
        
        .header p {
          color: #555;
          font-size: 18px;
        }
        
        .info-section {
          margin-top: 40px;
          background: #f5f5f5;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
        }
        
        .info-section h3 {
          color: #333;
          margin-bottom: 10px;
        }
        
        .info-section p {
          color: #555;
        }
      `}</style>
    </div>
  );
}
