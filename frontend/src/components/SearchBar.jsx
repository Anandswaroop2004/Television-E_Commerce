import React from 'react';
import { FiSearch } from 'react-icons/fi';

const SearchBar = ({ value, onChange, placeholder = 'Search products by name, brand, category...' }) => {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <FiSearch 
        style={{ 
          position: 'absolute', 
          left: '14px', 
          top: '50%', 
          transform: 'translateY(-50%)', 
          color: 'var(--color-text-muted)',
          fontSize: '18px'
        }} 
      />
      <input 
        type="text" 
        placeholder={placeholder} 
        className="filter-input"
        style={{ paddingLeft: '44px', width: '100%', borderRadius: 'var(--radius-sm)' }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
