import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Gallery from './pages/Gallery';
import Partitions from './pages/Partitions';
import Contact from './pages/Contact';
import { Toaster } from 'react-hot-toast';
import './App.css';

/**
 * Composant racine de l'application
 * Utilise désormais react-router-dom pour une SPA fluide.
 */
function App() {
  return (
    <div className="app-root">
      <Toaster position="top-right" reverseOrder={false} />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/partitions" element={<Partitions />} />
        <Route path="/contact" element={<Contact />} />
        {/* Fallback to Home for unknown routes */}
        <Route path="*" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
