import React, { useState } from 'react';
import { Music, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_LINKS } from '../../data/constants';
import '../../styles/layout.css';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="header-main">
        <div className="container">
          <div className="header-content">
            <div className="logo-group">
              <div className="logo-icon">
                <img src="/src/assets/images/icon.png" alt="Logo" width={66} height={45} style={{ borderRadius: 'var(--radius-md)' }}/>
              </div>
              <span className="logo-text" style={{ marginLeft: '-.5rem' }}>SMA</span>
            </div>
            
            <nav className="nav-desktop">
              {NAV_LINKS.map(({ label, href }) => (
                <a key={label} href={href} className="nav-link">
                  {label}
                </a>
              ))}
            </nav>

            <div className="actions-group">
              <button className="btn btn-ghost">Connexion Membre</button>
              <button className="btn btn-primary">Faire un Don</button>
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
              <div className="logo-group">
                <Music size={24} color="var(--brand-primary)" />
                <span className="logo-text" style={{ color: 'var(--brand-dark)' }}>SMA</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X size={32} />
              </button>
            </div>
            
            <nav className="mobile-links">
              {NAV_LINKS.map(({ label, href }) => (
                <a key={label} href={href} onClick={() => setIsMobileMenuOpen(false)}>
                  {label}
                </a>
              ))}
            </nav>

            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button className="btn btn-primary" style={{ width: '100%' }}>Connexion Membre</button>
              <button className="btn btn-ghost" style={{ width: '100%' }}>Faire un Don</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
