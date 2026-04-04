import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Composant de protection de route
 * Redirige vers /login si l'utilisateur n'est pas connecté
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'var(--bg-body)'
      }}>
        <div className="skeleton-loader" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Garde l'URL de destination pour y revenir après login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
