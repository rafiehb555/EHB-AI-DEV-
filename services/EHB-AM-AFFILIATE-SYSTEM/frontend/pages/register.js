import React from 'react';
import RegisterForm from '../components/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="register-page">
      <div className="header">
        <h1>JPS Affiliate Program</h1>
        <p>Join our growing network of job providers and referrers</p>
      </div>
      
      <RegisterForm /></RegisterForm>
      
      <div className="benefits-section">
        <h3>Benefits of Joining Our Affiliate Program</h3>
        <ul>
          <li>Earn rewards for each successful referral</li>
          <li>Help others find job opportunities</li>
          <li>Track your referrals through our dashboard</li>
          <li>Get special perks as you reach referral milestones</li>
        </ul>
      </div>
      
      <style jsx>{`
        .register-page {
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
        
        .benefits-section {
          margin-top: 40px;
          background: #f5f5f5;
          padding: 20px;
          border-radius: 8px;
        }
        
        .benefits-section h3 {
          color: #333;
          margin-bottom: 15px;
        }
        
        .benefits-section ul {
          padding-left: 20px;
        }
        
        .benefits-section li {
          margin-bottom: 10px;
          color: #555;
        }
      `}</style>
    </div>
  );
}
