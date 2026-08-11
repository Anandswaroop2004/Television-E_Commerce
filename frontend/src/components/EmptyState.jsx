import React from 'react';
import { FiInfo, FiSearch } from 'react-icons/fi';

const EmptyState = ({ 
  title = 'No Products Found', 
  description = 'We couldn\'t find any products matching your query.', 
  isSearch = false, 
  onActionClick 
}) => {
  return (
    <div className="empty-state">
      {isSearch ? (
        <FiSearch className="empty-icon" />
      ) : (
        <FiInfo className="empty-icon" />
      )}
      <h3 className="empty-title">{title}</h3>
      <p className="empty-desc">{description}</p>
      {onActionClick && (
        <button onClick={onActionClick} className="btn-primary">
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default EmptyState;
