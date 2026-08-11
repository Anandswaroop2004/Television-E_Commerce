import React, { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const HERO_SLIDES = [
  {
    id: 1,
    tagline: 'PREMIUM CINEMATIC EXPERIENCE',
    title: 'Next-Gen OLED & QLED TVs',
    subtitle: 'Experience absolute blacks, infinite contrast, and over a billion shades of vibrant colors in up to 8K resolution.',
    buttonText: 'Explore OLED',
    image: 'https://ik.imagekit.io/StringStackAnand/OLED/OLED%201.jpg?updatedAt=1785244912371',
    gradient: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
    darkGradient: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)'
  },
  {
    id: 2,
    tagline: 'UNLEASH ULTIMATE SPEED',
    title: 'Immersive Gaming Displays',
    subtitle: 'Equipped with 240Hz high refresh rates, 0.1ms response times, and VRR for tears-free gaming performance.',
    buttonText: 'Explore Gaming',
    image: 'https://ik.imagekit.io/StringStackAnand/Gaming%20TVs/Gaming%2020.jpg?updatedAt=1785245990462',
    gradient: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
    darkGradient: 'linear-gradient(135deg, #022c22 0%, #064e3b 100%)'
  },
  {
    id: 3,
    tagline: 'ARCHITECTURAL MASTERPIECES',
    title: 'Spectacular Curved Screens',
    subtitle: 'Bring theater-scale entertainment home with immersive 1000R curved screens designed to match the human field of view.',
    buttonText: 'Explore Curved',
    image: 'https://ik.imagekit.io/StringStackAnand/Curved%20TVs/istockphoto-531069818-612x612.jpg',
    gradient: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
    darkGradient: 'linear-gradient(135deg, #1e1b4b 0%, #2e1045 100%)'
  }
];

const Hero = ({ onShopNowClick }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { theme } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev === HERO_SLIDES.length - 1 ? 0 : prev + 1));
    }, 5000); // Rotate slide every 5 seconds
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentSlide(prev => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide(prev => (prev === HERO_SLIDES.length - 1 ? 0 : prev + 1));
  };

  const renderTitle = (title) => {
    if (title.includes('OLED & QLED TVs')) {
      return (
        <>
          Next-Gen <span className="hero-title-highlight">OLED & QLED TVs</span>
        </>
      );
    }
    if (title.includes('Gaming Displays')) {
      return (
        <>
          Immersive <span className="hero-title-highlight">Gaming Displays</span>
        </>
      );
    }
    if (title.includes('Curved Screens')) {
      return (
        <>
          Spectacular <span className="hero-title-highlight">Curved Screens</span>
        </>
      );
    }
    return title;
  };

  const slideBackground = theme === 'dark' 
    ? HERO_SLIDES[currentSlide].darkGradient 
    : HERO_SLIDES[currentSlide].gradient;

  return (
    <section 
      className="hero-section" 
      style={{ 
        background: slideBackground,
        transition: 'background 0.5s ease'
      }}
    >
      <div className="hero-container">
        
        {/* Left column info */}
        <div className="hero-content" key={currentSlide}>
          <span className="hero-tag">{HERO_SLIDES[currentSlide].tagline}</span>
          <h1 className="hero-title">{renderTitle(HERO_SLIDES[currentSlide].title)}</h1>
          <p className="hero-subtitle">{HERO_SLIDES[currentSlide].subtitle}</p>
          <div className="hero-buttons">
            <button onClick={onShopNowClick} className="btn-primary">
              {HERO_SLIDES[currentSlide].buttonText} <FiArrowRight />
            </button>
            <button onClick={onShopNowClick} className="btn-secondary">
              Explore Collection
            </button>
          </div>
        </div>

        {/* Right column image */}
        <div className="hero-image-container">
          <img 
            src={HERO_SLIDES[currentSlide].image} 
            alt={HERO_SLIDES[currentSlide].title} 
            className="hero-img" 
            style={{ animation: 'fadeIn 0.5s ease-out' }}
          />
        </div>

      </div>

      {/* Carousel control buttons */}
      <button 
        onClick={handlePrev} 
        className="carousel-btn prev"
        aria-label="Previous slide"
      >
        <FiChevronLeft size={22} />
      </button>

      <button 
        onClick={handleNext} 
        className="carousel-btn next"
        aria-label="Next slide"
      >
        <FiChevronRight size={22} />
      </button>

      {/* Indicator dots */}
      <div className="carousel-indicators">
        {HERO_SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`indicator-dot ${currentSlide === idx ? 'active' : ''}`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

    </section>
  );
};

export default Hero;
