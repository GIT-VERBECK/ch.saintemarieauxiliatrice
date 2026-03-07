import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { HERO_SLIDES } from '../../data/constants';
import '../../styles/home.css';

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 7000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const slideVariants = {
    enter: { opacity: 0, scale: 1.08 },
    center: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.98 }
  };

  return (
    <section className="hero-v4" id="home">
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentSlide}
          className="hero-slide"
          initial="enter"
          animate="center"
          exit="exit"
          variants={slideVariants}
          transition={{ duration: 1.4, ease: "easeInOut" }}
        >
          <div 
            className="hero-visual" 
            style={{ backgroundImage: `url(${HERO_SLIDES[currentSlide].image})` }}
          />
          <div className="hero-overlay" />
          
          <div className="container">
            <div className="hero-content">
              <motion.span 
                className="section-tag" 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                style={{ color: 'var(--brand-accent)', marginBottom: '16px' }}
              >
                {HERO_SLIDES[currentSlide].tag}
              </motion.span>
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                {HERO_SLIDES[currentSlide].title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                {HERO_SLIDES[currentSlide].description}
              </motion.p>
              <motion.div 
                className="hero-actions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <button className="btn btn-primary">
                  {HERO_SLIDES[currentSlide].cta1} <ChevronRight size={18} />
                </button>
                <button className="btn btn-ghost" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)' }}>
                  {HERO_SLIDES[currentSlide].cta2}
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="carousel-nav">
        {HERO_SLIDES.map((_, index) => (
          <button 
            key={index}
            className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <button className="carousel-arrow arrow-left" onClick={prevSlide} aria-label="Previous">
        <ChevronLeft size={24} />
      </button>
      <button className="carousel-arrow arrow-right" onClick={nextSlide} aria-label="Next">
        <ChevronRight size={24} />
      </button>
    </section>
  );
};

export default HeroSlider;
