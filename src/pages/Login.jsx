import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import '../styles/auth.css';

/**
 * Page de Connexion (Login)
 * Design assorti à la page de création de compte
 */
const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulation de connexion
    setTimeout(() => {
      console.log('Connexion...', formData);
      toast.success(`Heureux de vous revoir ! Connexion réussie.`, {
        duration: 4000,
        style: {
          background: 'var(--brand-dark)',
          color: '#fff',
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: '600',
        }
      });
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="auth-page">
      <motion.div 
        className="auth-card"
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <br />
        <br />
        <div className="auth-header">
          <br />
          <h1>Connectez-vous!</h1>
        </div>
        <br />

        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="input-group">
            <label htmlFor="email">Adresse email</label>
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
                style={{ position: 'absolute', right: '50px', top: '30%', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
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
            {isLoading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>

        <div className="auth-footer" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span>Nouveau ici ? <a href="/register">Créer un compte</a></span>
          <a href="/" className="back-link">Retour au site</a>
          <br />
          <br />
          <br />
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
