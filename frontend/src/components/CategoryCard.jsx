import React from 'react';

const CategoryCard = ({ category, onClick }) => {
  return (
    <div className="category-card" onClick={onClick}>
      <div className="category-card-img-container">
        <img src={category.image} alt={category.name} className="category-card-img" />
      </div>
      <div className="category-card-info">
        <h3 className="category-card-title">{category.name}</h3>
        <span className="category-card-tagline">{category.tagline}</span>
      </div>
    </div>
  );
};

export default CategoryCard;
