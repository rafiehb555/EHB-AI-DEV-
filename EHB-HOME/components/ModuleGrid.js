/**
 * ModuleGrid Component
 * Auto-generated by EHB-HOME Integrator
 */

import React, { useState } from 'react';
import ModuleCard from './ModuleCard';
import { MODULE_CATEGORIES } from '../utils/moduleConfig';

export default function ModuleGrid({ modules }) {
  const [filter, setFilter] = useState('all');
  
  const filteredModules = filter === 'all'
    ? modules
    : modules.filter(module => module.type === filter);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <FilterButton 
          active={filter === 'all'} 
          onClick={() => setFilter('all')}
        >
          All
        </FilterButton>
        <FilterButton 
          active={filter === MODULE_CATEGORIES.SERVICE} 
          onClick={() => setFilter(MODULE_CATEGORIES.SERVICE)}
          color="bg-purple-500"
        >
          Services
        </FilterButton>
        <FilterButton 
          active={filter === MODULE_CATEGORIES.DEPARTMENT} 
          onClick={() => setFilter(MODULE_CATEGORIES.DEPARTMENT)}
          color="bg-yellow-500"
        >
          Departments
        </FilterButton>
        <FilterButton 
          active={filter === MODULE_CATEGORIES.ADMIN} 
          onClick={() => setFilter(MODULE_CATEGORIES.ADMIN)}
          color="bg-red-500"
        >
          Admin
        </FilterButton>
        <FilterButton 
          active={filter === MODULE_CATEGORIES.AFFILIATE} 
          onClick={() => setFilter(MODULE_CATEGORIES.AFFILIATE)}
          color="bg-blue-500"
        >
          Affiliate
        </FilterButton>
        <FilterButton 
          active={filter === MODULE_CATEGORIES.SYSTEM} 
          onClick={() => setFilter(MODULE_CATEGORIES.SYSTEM)}
          color="bg-green-500"
        >
          System
        </FilterButton>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map(module => (
          <ModuleCard key={module.id} module={module} />
        ))}
        
        {filteredModules.length === 0 && (
          <div className="col-span-full text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No modules found for the selected category.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterButton({ children, active, onClick, color = 'bg-gray-500' }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md ${
        active 
          ? 'bg-gray-800 text-white' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      } transition-colors flex items-center`}
    >
      {color && <span className={`w-2 h-2 rounded-full ${active ? color : 'bg-gray-400'} mr-2`}></span>}
      {children}
    </button>
  );
}
