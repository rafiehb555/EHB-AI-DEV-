import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

// Create the auth context
const AuthContext = createContext();

/**
 * Auth Provider Component
 * Manages authentication state and user data
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  
  // Create API instance
  const api = axios.create({
    baseURL: '/api',
  });
  
  // Check for existing token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);
  
  // Update axios headers when token changes
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);
  
  // Fetch the current user data
  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users/me');
      setUser(response.data.user);
      setError(null);
    } catch (err) {
      console.error('Error fetching current user:', err);
      setError('Failed to authenticate user');
      logout();
    } finally {
      setLoading(false);
    }
  };
  
  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/login', { email, password });
      
      const { token: newToken, user: userData } = response.data;
      
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      
      setError(null);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      return { success: false, error: err.response?.data?.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };
  
  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/register', userData);
      
      const { token: newToken, user: newUser } = response.data;
      
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('token', newToken);
      
      setError(null);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      return { success: false, error: err.response?.data?.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };
  
  // Logout function
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    router.push('/login');
  };
  
  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      await api.post('/auth/change-password', { currentPassword, newPassword });
      setError(null);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Password change failed');
      return { success: false, error: err.response?.data?.message || 'Password change failed' };
    } finally {
      setLoading(false);
    }
  };
  
  // Update profile
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      const response = await api.put('/users/profile', profileData);
      setUser(response.data.user);
      setError(null);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Profile update failed');
      return { success: false, error: err.response?.data?.message || 'Profile update failed' };
    } finally {
      setLoading(false);
    }
  };
  
  // Reset password request
  const requestPasswordReset = async (email) => {
    try {
      setLoading(true);
      await api.post('/auth/request-reset', { email });
      setError(null);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset request failed');
      return { success: false, error: err.response?.data?.message || 'Password reset request failed' };
    } finally {
      setLoading(false);
    }
  };
  
  // Reset password with token
  const resetPassword = async (token, newPassword) => {
    try {
      setLoading(true);
      await api.post('/auth/reset-password', { token, newPassword });
      setError(null);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed');
      return { success: false, error: err.response?.data?.message || 'Password reset failed' };
    } finally {
      setLoading(false);
    }
  };
  
  // Check if the user is authenticated
  const isAuthenticated = !!user;
  
  // Check if the user has a specific role
  const hasRole = (requiredRole) => {
    if (!user || !user.role) return false;
    if (Array.isArray(user.role)) {
      return user.role.includes(requiredRole);
    }
    return user.role === requiredRole;
  };
  
  // Value to be provided to consumers
  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    changePassword,
    updateProfile,
    requestPasswordReset,
    resetPassword,
    hasRole
  };
  
  return (
    <AuthContext.Provider value={value}></AuthContext>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}