import React, { useState, useEffect } from 'react';
import Link from 'next/link';

/**
 * FranchiseList Component
 * 
 * A component for displaying and managing the list of franchises
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.showFilters - Whether to show filtering options
 * @param {boolean} props.showActions - Whether to show action buttons for each franchise
 * @param {Function} props.onSelect - Callback when a franchise is selected
 */
const FranchiseList = ({ 
  showFilters = true,
  showActions = true,
  onSelect
}) => {
  const [franchises, setFranchises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    sortBy: 'name'
  });
  
  // Fetch franchises data
  useEffect(() => {
    const fetchFranchises = async () => {
      try {
        setLoading(true);
        
        // Example API call to fetch franchises
        // Replace with your actual API endpoint
        const response = await fetch('/api/franchises');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch franchises');
        }
        
        setFranchises(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching franchises:', err);
        setError(err.message || 'Failed to load franchises');
        
        // For demo purposes, provide some sample data if API fails
        // In production, remove this and handle the error properly
        setFranchises([
          {
            id: 'f1',
            name: 'EHB GoSellr',
            location: 'New York, NY',
            status: 'active',
            owner: 'John Smith',
            revenue: 145000,
            employees: 12
          },
          {
            id: 'f2',
            name: 'JPS Connect',
            location: 'San Francisco, CA',
            status: 'active',
            owner: 'Emily Johnson',
            revenue: 98500,
            employees: 8
          },
          {
            id: 'f3',
            name: 'EHB Marketing',
            location: 'Chicago, IL',
            status: 'pending',
            owner: 'David Wilson',
            revenue: 65000,
            employees: 5
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFranchises();
  }, []);
  
  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters({
      ...filters,
      [key]: value
    });
  };
  
  // Filter franchises based on current filters
  const filteredFranchises = (franchises || []).filter(franchise => {
    // Status filter
    if (filters.status !== 'all' && franchise.status !== filters.status) {
      return false;
    }
    
    // Search filter
    if (filters.search && !franchise.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Sort franchises based on current sort option
  const sortedFranchises = [...filteredFranchises].sort((a, b) => {
    if (filters.sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (filters.sortBy === 'revenue') {
      return b.revenue - a.revenue;
    } else if (filters.sortBy === 'employees') {
      return b.employees - a.employees;
    }
    return 0;
  });
  
  // Handle franchise selection
  const handleSelect = (franchise) => {
    if (onSelect) {
      onSelect(franchise);
    }
  };
  
  if (loading) {
    return <div className="loading">Loading franchises...</div>;
  }
  
  if (error) {
    return <div className="error">Error: {error}</div>;
  }
  
  return (
    <div className="franchise-list">
      {/* Filters */}
      {showFilters && (
        <div className="filters">
          <div className="filter-group">
            <input
              type="text"
              placeholder="Search franchises..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="search-input"
            />
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
              <option value="pending">Pending</option>
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
              <option value="revenue">Revenue</option>
              <option value="employees">Employees</option>
            </select>
          </div>
        </div>
      )}
      
      {/* Franchises Table */}
      <div className="franchises-table-container">
        <table className="franchises-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Status</th>
              <th>Owner</th>
              <th>Revenue</th>
              <th>Employees</th>
              {showActions && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {sortedFranchises.length > 0 ? (
      (sortedFranchises || []).map((ses || []).map(franchise => (
                <tr 
                  key={franchise.id}
                  onClick={() => handleSelect(franchise)}
                  className={onSelect ? 'clickable' : ''}
                >
                  <td>{franchise.name}</td>
                  <td>{franchise.location}</td>
                  <td>
                    <span className={`status-badge ${franchise.status}`}>
                      {franchise.status}
                    </span>
                  </td>
                  <td>{franchise.owner}</td>
                  <td>${franchise.revenue.toLocaleString()}</td>
                  <td>{franchise.employees}</td>
                  {showActions && (
                    <td className="actions">
                      <Link href={`/dashboard/franchises/${franchise.id}`}></Link>
                        <a className="btn-view">View</a>
                      </Link>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={showActions ? 7 : 6} className="no-data">
                  No franchises found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FranchiseList;