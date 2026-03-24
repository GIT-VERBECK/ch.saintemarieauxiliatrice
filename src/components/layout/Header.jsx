import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Music, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_LINKS } from '../../data/constants';
import ThemeToggle from '../ui/ThemeToggle';
import '../../styles/layout.css';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    if (path.startsWith('/#')) return false; // Anchor links are different
    return location.pathname === path;
  };

  return (
    <>
      <header className="header-main">
        <div className="container">
          <div className="header-content">
            <Link to="/" className="logo-group">
              <div className="logo-icon">
                <img src="/src/assets/images/icon.png" alt="Logo" width={66} height={45} style={{ borderRadius: 'var(--radius-md)' }}/>
              </div>
              <span className="logo-text" style={{ marginLeft: '-.5rem' }}>SMA</span>
            </Link>
            
            <nav className="nav-desktop"> 
              {NAV_LINKS.map(({ label, href }) => {
                const isExternal = href.startsWith('http') || href.startsWith('/#');
                return isExternal ? (
                  <a key={label} href={href} className="nav-link">
                    {label}
                  </a>
                ) : (
                  <Link 
                    key={label} 
                    to={href} 
                    className={`nav-link ${isActive(href) ? 'active' : ''}`}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>
            
            <div className="actions-group"> 
        
              <ThemeToggle />
              <Link to="/register" className="btn btn-ghost">Créer un compte</Link>
              <Link to="/login" className="btn btn-primary">Se Connecter</Link>
            </div>

            <button 
              className="hamburger" 
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={28} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="mobile-nav-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="mobile-menu-header">
              <Link to="/" className="logo-group" onClick={() => setIsMobileMenuOpen(false)}>
                <Music size={24} color="var(--brand-primary)" />
                <span className="logo-text" style={{ color: 'var(--brand-dark)' }}>SMA</span>
              </Link>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <ThemeToggle />
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X size={32} />
                </button>
              </div>
            </div>
            
            <nav className="mobile-links">
              {NAV_LINKS.map(({ label, href }) => {
                const isExternal = href.startsWith('http') || href.startsWith('/#');
                return isExternal ? (
                  <a key={label} href={href} onClick={() => setIsMobileMenuOpen(false)}>
                    {label}
                  </a>
                ) : (
                  <Link 
                    key={label} 
                    to={href} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={isActive(href) ? 'active' : ''}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>

            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link to="/register" className="btn btn-ghost" onClick={() => setIsMobileMenuOpen(false)}> Créer un compte</Link>
              <Link to="/login" className="btn btn-primary" onClick={() => setIsMobileMenuOpen(false)}>Se Connecter</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
