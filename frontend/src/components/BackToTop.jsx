import React, { useState, useEffect } from 'react';
import { FiArrowUp } from 'react-icons/fi';

const BackToTop = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button 
      onClick={scrollToTop} 
      className={`back-to-top-btn ${showButton ? 'show' : ''}`}
      aria-label="Back to top"
    >
      <FiArrowUp />
    </button>
  );
};

export default BackToTop;
