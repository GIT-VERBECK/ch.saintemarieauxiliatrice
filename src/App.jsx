import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Gallery from './pages/Gallery';
import { Toaster } from 'react-hot-toast';
import './App.css';

/**
 * Composant racine de l'application
 * Implémente un routage natif simple.
 * Login temporairement retiré selon demande utilisateur.
 */
function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const renderPage = () => {
    switch(currentPath) {
      case '/register':
        return <Register />;
      case '/login':
        return <Login />;
      case '/gallery':
        return <Gallery />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="app-root">
      <Toaster position="top-right" reverseOrder={false} />
      {renderPage()}
    </div>
  );
}

export default App;
