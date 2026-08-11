import React from 'react';
import SearchBar from './SearchBar';

const Filters = ({ 
  searchQuery, 
  onSearchChange,
  selectedCategory, 
  onCategoryChange,
  priceRange, 
  onPriceChange,
  selectedRating, 
  onRatingChange,
  availability,
  onAvailabilityChange,
  sortBy, 
  onSortByChange
}) => {
  return (
    <div className="filter-panel-card">
      <div className="filter-grid">
        
        {/* Search Input */}
        <div className="filter-group" style={{ gridColumn: 'span 2' }}>
          <label className="filter-label">Search Catalogue</label>
          <SearchBar value={searchQuery} onChange={onSearchChange} />
        </div>

        {/* Category select */}
        <div className="filter-group">
          <label className="filter-label">Category</label>
          <select 
            className="filter-select"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="OLED TVs">OLED TVs</option>
            <option value="QLED TVs">QLED TVs</option>
            <option value="Gaming TVs">Gaming TVs</option>
            <option value="Curved TVs">Curved TVs</option>
            <option value="4K Ultra HD TVs">4K Ultra HD TVs</option>
          </select>
        </div>

        {/* Price filter range */}
        <div className="filter-group">
          <label className="filter-label">Max Price (₹{priceRange.max.toLocaleString('en-IN')})</label>
          <input 
            type="range" 
            min="0" 
            max="800000" 
            step="5000"
            className="filter-input" 
            style={{ padding: '0', cursor: 'pointer' }}
            value={priceRange.max}
            onChange={(e) => onPriceChange({ ...priceRange, max: parseInt(e.target.value) })}
          />
        </div>

        {/* Rating filter */}
        <div className="filter-group">
          <label className="filter-label">Min Rating</label>
          <select 
            className="filter-select"
            value={selectedRating}
            onChange={(e) => onRatingChange(parseFloat(e.target.value))}
          >
            <option value="0">All Ratings</option>
            <option value="4">4.0 ★ & above</option>
            <option value="4.5">4.5 ★ & above</option>
            <option value="4.8">4.8 ★ & above</option>
          </select>
        </div>

        {/* Availability Filter */}
        <div className="filter-group">
          <label className="filter-label">Availability</label>
          <select 
            className="filter-select"
            value={availability}
            onChange={(e) => onAvailabilityChange(e.target.value)}
          >
            <option value="all">All Items</option>
            <option value="instock">In Stock Only</option>
            <option value="outofstock">Out of Stock Only</option>
          </select>
        </div>

        {/* Sorting option */}
        <div className="filter-group">
          <label className="filter-label">Sort Products</label>
          <select 
            className="filter-select"
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
          >
            <option value="featured">Featured / Recommended</option>
            <option value="newest">New Arrivals</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating-high">Highest Rated ★</option>
          </select>
        </div>

      </div>
    </div>
  );
};

export default Filters;
