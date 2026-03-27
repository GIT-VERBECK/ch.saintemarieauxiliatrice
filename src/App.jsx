import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Gallery from './pages/Gallery';
import Partitions from './pages/Partitions';
import Contact from './pages/Contact';
import PageTransition from './components/layout/PageTransition';
import ScrollToTop from './components/ui/ScrollToTop';
import { Toaster } from 'react-hot-toast';
import './App.css';

/**
 * Composant racine de l'application
 * Utilise désormais react-router-dom pour une SPA fluide.
 */
function App() {
  const location = useLocation();

  return (
    <div className="app-root">
      <Toaster position="top-right" reverseOrder={false} />
      <ScrollToTop />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
          <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
          <Route path="/gallery" element={<PageTransition><Gallery /></PageTransition>} />
          <Route path="/partitions" element={<PageTransition><Partitions /></PageTransition>} />
          <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
          {/* Fallback to Home for unknown routes */}
          <Route path="*" element={<PageTransition><Home /></PageTransition>} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
