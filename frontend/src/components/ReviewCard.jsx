import React from 'react';
import { FaStar } from 'react-icons/fa';

const ReviewCard = ({ review }) => {
  return (
    <div className="review-card">
      <div className="review-header">
        <img src={review.avatar} alt={review.name} className="review-avatar" />
        <div className="review-info">
          <span className="review-name">{review.name}</span>
          <span className="review-date">{review.date}</span>
        </div>
      </div>
      
      <div className="review-rating">
        {[...Array(review.rating)].map((_, i) => (
          <FaStar key={i} style={{ display: 'inline', marginRight: '2px' }} />
        ))}
      </div>
      
      <p className="review-comment">"{review.comment}"</p>
    </div>
  );
};

export default ReviewCard;
