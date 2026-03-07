import React from 'react';
import Home from './pages/Home';
import './App.css';

/**
 * Composant racine de l'application
 * Gère actuellement le rendu de la landing page
 */
function App() {
  return (
    <div className="app-root">
      <Home />
    </div>
  );
}

export default App;
