import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Image as ImageIcon, Filter, X, Maximize2, Share2, Facebook, Twitter, Link as LinkIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import SEO from '../components/ui/SEO';
import { GALLERY_IMAGES } from '../data/constants';
import '../styles/Gallery.css';

/**
 * Composant d'image avec chargement paresseux et squelette
 */
const LazyImage = ({ src, alt, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  return (
    <div className={`lazy-image-container ${isLoaded ? 'loaded' : ''}`}>
      {!isLoaded && <div className="skeleton-loader" />}
      <img
        src={src}
        alt={alt}
        className={className}
        onLoad={() => setIsLoaded(true)}
        loading="lazy"
      />
    </div>
  );
};

/**
 * Icône TikTok personnalisée (non présente dans Lucide par défaut)
 */
const TikTokIcon = ({ size = 20 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

/**
 * Section de partage social
 */
const ShareSection = ({ image, layout = "full" }) => {
  const shareUrl = window.location.href;
  const title = `Découvrez cette photo de la Chorale Sainte Marie Auxiliatrice : ${image.title}`;

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + shareUrl)}`,
    tiktok: `https://www.tiktok.com/` // TikTok n'a pas de partage URL direct, on redirige ou on informe
  };

  const copyToClipboard = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(shareUrl);
    toast.success('Lien copié !', {
      icon: '🔗',
      style: { borderRadius: '10px', background: '#333', color: '#fff' },
    });
  };

  const handleTikTok = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(shareUrl);
    toast.success('Lien prêt pour TikTok !', {
      icon: '🎵',
      style: { borderRadius: '10px', background: '#000', color: '#fff' },
    });
    window.open(shareLinks.tiktok, '_blank');
  };

  if (layout === "card") {
    return (
      <div className="card-share-actions">
        <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className="card-share-btn" onClick={e => e.stopPropagation()} title="Facebook">
          <Facebook size={16} />
        </a>
        <button onClick={handleTikTok} className="card-share-btn tiktok" title="TikTok">
          <TikTokIcon size={16} />
        </button>
        <button onClick={copyToClipboard} className="card-share-btn" title="Copier le lien">
          <LinkIcon size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="share-section">
      <span className="share-label">Partager cette photo</span>
      <div className="share-buttons">
        <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className="share-btn" title="Facebook">
          <Facebook size={20} />
        </a>
        <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" className="share-btn" title="Twitter">
          <Twitter size={20} />
        </a>
        <button onClick={handleTikTok} className="share-btn tiktok" title="Partager sur TikTok">
          <TikTokIcon size={20} />
        </button>
        <button onClick={copyToClipboard} className="share-btn copy" title="Copier le lien">
          <LinkIcon size={20} />
        </button>
      </div>
    </div>
  );
};

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
      <SEO 
        title="Galerie Photos" 
        description="Découvrez en images les moments forts de la Chorale Sainte Marie Auxiliatrice : concerts, répétitions et vie de notre communauté à Lyon." 
      />
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
                      <LazyImage src={image.url} alt={image.title} />
                      <div className="overlay">
                        <Maximize2 className="expand-icon" />
                        <div className="info">
                          <span className="category">{image.category}</span>
                          <h3>{image.title}</h3>
                        </div>
                      </div>
                      <ShareSection image={image} layout="card" />
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
                <ShareSection image={selectedImage} />
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
