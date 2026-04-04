import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si un utilisateur est déjà connecté via localStorage
    const savedUser = localStorage.getItem('sma_user');
    const token = localStorage.getItem('sma_token');
    
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('sma_user', JSON.stringify(userData));
    localStorage.setItem('sma_token', token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sma_user');
    localStorage.removeItem('sma_token');
  };

  const updateUser = async (newUserData) => {
    try {
        const token = localStorage.getItem('sma_token');
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        
        const response = await fetch(`${API_URL}/auth/profile`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUserData)
        });

        if (!response.ok) throw new Error('Erreur de mise à jour');

        const { user: updatedUser } = await response.json();
        
        setUser(updatedUser);
        localStorage.setItem('sma_user', JSON.stringify(updatedUser));
        return updatedUser;
    } catch (error) {
        console.error("Profile Update Error:", error);
        throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
};
