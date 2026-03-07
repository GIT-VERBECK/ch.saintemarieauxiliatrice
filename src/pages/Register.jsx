import React, { useState } from 'react';
import { User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import '../styles/auth.css';

/**
 * Page de Création de Compte (Register)
 * Comprend : Nom complet, Email, Téléphone et Mot de passe
 */
const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simuler une requête réseau de 1.5 seconde pour le côté "Pro"
    setTimeout(() => {
      console.log('Données du compte:', formData);
      toast.success(`Bienvenue ${formData.fullName.split(' ')[0]} ! Ton compte a été créé avec succès.`, {
        duration: 4000,
        style: {
          background: 'var(--brand-dark)',
          color: '#fff',
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: '600',
        },
        iconTheme: {
          primary: '#22c55e',
          secondary: '#fff',
        },
      });
      setIsLoading(false);
      
      // Optionnel: vider le formulaire après succès
      setFormData({ fullName: '', email: '', phone: '', password: '' });
    }, 1500);
  };

  return (
    <div className="auth-page">
      <motion.div 
        className="auth-card"
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="auth-header">
          <br />
          <h1>Rejoignez-nous</h1>
          
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Nom Complet */}
          <div className="input-group">
            <label htmlFor="fullName">Nom complet</label>
            <div className="input-wrapper">
              <User size={18} />
              <input 
                type="text" 
                id="fullName" 
                name="fullName"
                placeholder="Ex: Jean-Dominique"
                required
                className="input-field"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Email */}
          <div className="input-group">
            <label htmlFor="email">Email professionnel</label>
            <div className="input-wrapper">
              <Mail size={18} />
              <input 
                type="email" 
                id="email" 
                name="email"
                placeholder="contact@sma.com"
                required
                className="input-field"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Phone */}
          <div className="input-group">
            <label htmlFor="phone">Téléphone</label>
            <div className="input-wrapper">
              <Phone size={18} />
              <input 
                type="tel" 
                id="phone" 
                name="phone"
                placeholder="+243 814 717 237"
                required
                className="input-field"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Password */}
          <div className="input-group">
            <label htmlFor="password">Mot de passe</label>
            <div className="input-wrapper">
              <Lock size={18} />
              <input 
                type={showPassword ? "text" : "password"} 
                id="password" 
                name="password"
                placeholder="********"
                required
                className="input-field"
                value={formData.password}
                onChange={handleChange}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '50px',top: '30%', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary auth-btn" 
            disabled={isLoading}
            style={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
          >
            {isLoading ? 'Création en cours...' : 'Créer mon compte'}
          </button>
        </form>

        <div className="auth-footer" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span>Déjà membre ? <a href="/login" onClick={(e) => e.preventDefault()}>Se connecter</a></span>
          <a href="/" className="back-link">Retour au site</a>
          <br />
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
