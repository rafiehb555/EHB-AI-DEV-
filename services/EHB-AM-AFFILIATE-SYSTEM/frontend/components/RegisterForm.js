import { useState } from 'react';
import axios from 'axios';

export default function RegisterForm() {
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Get referral code from URL if present
  const referral = typeof window !== 'undefined' 
    ? new URLSearchParams(window.location.search).get('ref') 
    : null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
  };

  const validateForm = () => {
    // Reset error state
    setError('');
    
    // Check if all required fields are filled
    if (!form.name || !form.email || !form.password) {
      setError('All fields are required');
      return false;
    }
    
    // Check if passwords match
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    // Email validation pattern
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(form.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    // Password strength validation
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Create API request body with referral if present
      const requestBody = { 
        name: form.name, 
        email: form.email, 
        password: form.password 
      };
      
      if (referral) {
        requestBody.referredBy = referral;
      }
      
      // Submit registration request
      const response = await axios.post('/api/auth/register', requestBody);
      
      if (response.data.success) {
        setSuccess('Registration successful! Your referral code is: ' + response.data.data.referralCode);
        // Reset form after successful registration
        setForm({ name: '', email: '', password: '', confirmPassword: '' });
        
        // Redirect to login page or dashboard after a delay
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.msg || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-form-container">
      <h2>Create an Account</h2>
      {referral && (
        <div className="referral-notification">
          <p>You were referred by: {referral}</p>
        </div>
      )}
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {success && (
        <div className="success-message">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your full name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email address"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Create a password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="register-button"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      
      <div className="login-link">
        Already have an account? <a href="/login">Login here</a>
      </div>
      
      <style jsx>{`
        .register-form-container {
          max-width: 500px;
          margin: 0 auto;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          background: white;
        }
        
        h2 {
          text-align: center;
          margin-bottom: 20px;
          color: #333;
        }
        
        .referral-notification {
          background: #e8f4ff;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 15px;
          border-left: 4px solid #1e88e5;
        }
        
        .error-message {
          background: #ffebee;
          color: #d32f2f;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 15px;
          border-left: 4px solid #d32f2f;
        }
        
        .success-message {
          background: #e8f5e9;
          color: #388e3c;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 15px;
          border-left: 4px solid #388e3c;
        }
        
        .form-group {
          margin-bottom: 15px;
        }
        
        label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
          color: #333;
        }
        
        input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
        }
        
        input:focus {
          outline: none;
          border-color: #1e88e5;
          box-shadow: 0 0 0 2px rgba(30, 136, 229, 0.2);
        }
        
        .register-button {
          width: 100%;
          padding: 12px;
          background: #1976d2;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.3s;
        }
        
        .register-button:hover {
          background: #1565c0;
        }
        
        .register-button:disabled {
          background: #90caf9;
          cursor: not-allowed;
        }
        
        .login-link {
          text-align: center;
          margin-top: 15px;
          color: #555;
        }
        
        .login-link a {
          color: #1976d2;
          text-decoration: none;
        }
        
        .login-link a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
