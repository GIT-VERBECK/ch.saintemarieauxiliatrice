import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Image as ImageIcon, Filter, X, Maximize2 } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { GALLERY_IMAGES } from '../data/constants';
import '../styles/Gallery.css';

const Gallery = () => {
  const [filter, setFilter] = useState('Tous');
  const [selectedImage, setSelectedImage] = useState(null);
  const categories = ['Tous', ...new Set(GALLERY_IMAGES.map(img => img.category))];

  const filteredImages = filter === 'Tous' 
    ? GALLERY_IMAGES 
    : GALLERY_IMAGES.filter(img => img.category === filter);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="layout-root">
      <Header />
      
      <main className="gallery-page">
        {/* Hero Section */}
        <section className="gallery-hero">
          <div className="container">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="hero-content"
            >
              <span className="badge">Médiathèque</span>
              <h1>Galerie <span className="text-gradient">Photos</span></h1>
              <p>Retrouvez les moments forts de la chorale, nos concerts et la vie de notre communauté en images.</p>
            </motion.div>
          </div>
        </section>

        {/* Filter Section */}
        <section className="gallery-filters">
          <div className="container">
            <div className="filter-wrapper">
              <Filter size={18} className="filter-icon" />
              <div className="filter-buttons">
                {categories.map(cat => (
                  <button
                    key={cat}
                    className={`filter-btn ${filter === cat ? 'active' : ''}`}
                    onClick={() => setFilter(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Grid Section */}
        <section className="gallery-grid-section">
          <div className="container">
            <motion.div 
              layout
              className="gallery-grid"
            >
              <AnimatePresence mode='popLayout'>
                {filteredImages.map((image) => (
                  <motion.div
                    key={image.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="gallery-item"
                    onClick={() => setSelectedImage(image)}
                  >
                    <div className="image-container">
                      <img src={image.url} alt={image.title} loading="lazy" />
                      <div className="overlay">
                        <Maximize2 className="expand-icon" />
                        <div className="info">
                          <span className="category">{image.category}</span>
                          <h3>{image.title}</h3>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lightbox"
            onClick={() => setSelectedImage(null)}
          >
            <button className="close-btn" onClick={() => setSelectedImage(null)}>
              <X size={32} />
            </button>
            <motion.div 
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              className="lightbox-content"
              onClick={e => e.stopPropagation()}
            >
              <img src={selectedImage.url} alt={selectedImage.title} />
              <div className="lightbox-info">
                <span className="badge">{selectedImage.category}</span>
                <h2>{selectedImage.title}</h2>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Gallery;
