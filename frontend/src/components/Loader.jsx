import React from 'react';
import { CgSpinner } from 'react-icons/cg';

export const SpinnerLoader = ({ size = 32, color = 'var(--color-primary)' }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 0' }}>
      <CgSpinner className="spinner animate-spin" size={size} style={{ color }} />
    </div>
  );
};

export const SkeletonCardLoader = ({ count = 4 }) => {
  return (
    <div className="skeleton-container">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-image"></div>
          <div className="skeleton-title"></div>
          <div className="skeleton-text" style={{ width: '50%' }}></div>
          <div className="skeleton-text" style={{ width: '90%' }}></div>
          <div className="skeleton-price"></div>
        </div>
      ))}
    </div>
  );
};

export default SpinnerLoader;
