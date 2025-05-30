import { useState } from 'react';
import axios from 'axios';

export default function LoginForm() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!form.email || !form.password) {
      setError('Email and password are required');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('/api/auth/login', form);
      
      if (response.data.success) {
        // Store the token in localStorage
        localStorage.setItem('jps_token', response.data.data.token);
        
        // Store basic user info if needed
        if (response.data.data.user) {
          localStorage.setItem('jps_user', JSON.stringify(response.data.data.user));
        }
        
        // Redirect to dashboard
        window.location.href = '/dashboard';
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.msg || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form-container">
      <h2>Login to Your Account</h2>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <form onSubmit={handleLogin}>
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
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="login-button"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <div className="register-link">
        Don't have an account? <a href="/register">Register here</a>
      </div>
      
      <style jsx>{`
        .login-form-container {
          max-width: 400px;
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
        
        .error-message {
          background: #ffebee;
          color: #d32f2f;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 15px;
          border-left: 4px solid #d32f2f;
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
        
        .login-button {
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
          margin-top: 10px;
        }
        
        .login-button:hover {
          background: #1565c0;
        }
        
        .login-button:disabled {
          background: #90caf9;
          cursor: not-allowed;
        }
        
        .register-link {
          text-align: center;
          margin-top: 15px;
          color: #555;
        }
        
        .register-link a {
          color: #1976d2;
          text-decoration: none;
        }
        
        .register-link a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
