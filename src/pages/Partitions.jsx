import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Download, Music, Filter, FileText } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import SEO from '../components/ui/SEO';
import { PARTITIONS_DATA } from '../data/constants';
import '../styles/Partitions.css';

const Partitions = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('Toutes');
  
  const categories = ['Toutes', ...new Set(PARTITIONS_DATA.map(item => item.category))];

  const filteredPartitions = PARTITIONS_DATA.filter(partition => {
    const matchesSearch = 
      partition.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partition.composer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filter === 'Toutes' || partition.category === filter;

    return matchesSearch && matchesFilter;
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="layout-root">
      <SEO 
        title="Bibliothèque de Partitions" 
        description="Accédez aux partitions de notre répertoire : œuvres classiques (Mozart, Fauré, Handel), chants liturgiques et compositions sacrées." 
      />
      <Header />
      
      <main className="partitions-page">
        {/* Hero Section */}
        <section className="partitions-hero">
          <div className="container">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="hero-content"
            >
              <span className="badge">Ressources Digitales</span>
              <h1>Bibliothèque de <span className="text-gradient">Partitions</span></h1>
              <p>Explorez et téléchargez les partitions de notre répertoire. Des œuvres classiques aux chants contemporains.</p>
            </motion.div>
          </div>
        </section>

        {/* Controls Section */}
        <section className="partitions-controls">
          <div className="container">
            <div className="controls-wrapper">
              <div className="search-bar">
                <Search className="search-icon" size={20} />
                <input 
                  type="text" 
                  placeholder="Rechercher par titre ou compositeur..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="filter-group">
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
          </div>
        </section>

        {/* Grid Section */}
        <section className="partitions-grid-section">
          <div className="container">
            {filteredPartitions.length > 0 ? (
              <motion.div 
                layout
                className="partitions-grid"
              >
                <AnimatePresence mode='popLayout'>
                  {filteredPartitions.map((partition) => (
                    <motion.div
                      key={partition.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="partition-card"
                    >
                      <div className="partition-header">
                        <div className="partition-icon-wrapper">
                          <Music size={24} />
                        </div>
                      </div>
                      
                      <div className="partition-info">
                        <span className="partition-category">{partition.category}</span>
                        <h3 className="partition-title">{partition.title}</h3>
                        <p className="partition-composer">{partition.composer}</p>
                      </div>

                      <div className="partition-actions">
                        <a href={partition.url} className="btn-download" download>
                          <Download size={18} />
                          <span>Télécharger</span>
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="no-results"
              >
                <FileText className="no-results-icon" />
                <h2>Aucune partition trouvée</h2>
                <p>Essayez de modifier vos critères de recherche.</p>
                <button 
                  className="btn btn-ghost"
                  onClick={() => {
                    setSearchQuery('');
                    setFilter('Toutes');
                  }}
                  style={{ marginTop: '1rem' }}
                >
                  Réinitialiser les filtres
                </button>
              </motion.div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Partitions;
