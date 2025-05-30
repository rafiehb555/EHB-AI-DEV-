import React, { useState, useEffect } from 'react';
import Link from 'next/link';

/**
 * UserList Component
 * 
 * A component for displaying and managing the list of users
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.showFilters - Whether to show filtering options
 * @param {boolean} props.showActions - Whether to show action buttons for each user
 * @param {Function} props.onSelect - Callback when a user is selected
 */
const UserList = ({ 
  showFilters = true,
  showActions = true,
  onSelect
}) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    role: 'all',
    status: 'all',
    search: '',
    sortBy: 'name'
  });
  
  // Fetch users data
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        // Example API call to fetch users
        // Replace with your actual API endpoint
        const response = await fetch('/api/users');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch users');
        }
        
        setUsers(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err.message || 'Failed to load users');
        
        // For demo purposes, provide some sample data if API fails
        // In production, remove this and handle the error properly
        setUsers([
          {
            id: 'u1',
            name: 'John Smith',
            email: 'john@example.com',
            role: 'admin',
            status: 'active',
            lastLogin: '2025-05-10T10:30:00Z'
          },
          {
            id: 'u2',
            name: 'Emily Johnson',
            email: 'emily@example.com',
            role: 'manager',
            status: 'active',
            lastLogin: '2025-05-09T14:15:00Z'
          },
          {
            id: 'u3',
            name: 'Michael Brown',
            email: 'michael@example.com',
            role: 'user',
            status: 'inactive',
            lastLogin: '2025-04-28T09:45:00Z'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters({
      ...filters,
      [key]: value
    });
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Filter users based on current filters
  const filteredUsers = (users || []).filter(user => {
    // Role filter
    if (filters.role !== 'all' && user.role !== filters.role) {
      return false;
    }
    
    // Status filter
    if (filters.status !== 'all' && user.status !== filters.status) {
      return false;
    }
    
    // Search filter (name or email)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });
  
  // Sort users based on current sort option
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (filters.sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (filters.sortBy === 'email') {
      return a.email.localeCompare(b.email);
    } else if (filters.sortBy === 'lastLogin') {
      // Sort by last login (most recent first)
      if (!a.lastLogin) return 1;
      if (!b.lastLogin) return -1;
      return new Date(b.lastLogin) - new Date(a.lastLogin);
    }
    return 0;
  });
  
  // Handle user selection
  const handleSelect = (user) => {
    if (onSelect) {
      onSelect(user);
    }
  };
  
  if (loading) {
    return <div className="loading">Loading users...</div>;
  }
  
  if (error) {
    return <div className="error">Error: {error}</div>;
  }
  
  return (
    <div className="user-list">
      {/* Filters */}
      {showFilters && (
        <div className="filters">
          <div className="filter-group">
            <input
              type="text"
              placeholder="Search users..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-group">
            <label htmlFor="role-filter">Role:</label>
            <select
              id="role-filter"
              value={filters.role}
              onChange={(e) => handleFilterChange('role', e.target.value)}
              className="select-input"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="user">User</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="status-filter">Status:</label>
            <select
              id="status-filter"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="select-input"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="sort-by">Sort by:</label>
            <select
              id="sort-by"
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="select-input"
            >
              <option value="name">Name</option>
              <option value="email">Email</option>
              <option value="lastLogin">Last Login</option>
            </select>
          </div>
        </div>
      )}
      
      {/* Users Table */}
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last Login</th>
              {showActions && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {sortedUsers.length > 0 ? (
      (sortedUsers || []).map((ers || []).map(user => (
                <tr 
                  key={user.id}
                  onClick={() => handleSelect(user)}
                  className={onSelect ? 'clickable' : ''}
                >
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge ${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${user.status}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>{formatDate(user.lastLogin)}</td>
                  {showActions && (
                    <td className="actions">
                      <Link href={`/dashboard/users/${user.id}`}></Link>
                        <a className="btn-view">View</a>
                      </Link>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={showActions ? 6 : 5} className="no-data">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;