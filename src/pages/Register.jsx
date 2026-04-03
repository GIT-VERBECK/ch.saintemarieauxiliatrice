import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import SEO from '../components/ui/SEO';
import '../styles/auth.css';

/**
 * Page de Création de Compte (Register)
 * Comprend : Nom complet, Email, Téléphone et Mot de passe
 */
const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    voiceType: 'Soprano'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // --- Validation du mot de passe ---
    const { password } = formData;
    const errors = [];

    if (password.length < 8) {
      errors.push("au moins 8 caractères");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("une majuscule");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("un chiffre");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("un caractère spécial");
    }

    if (errors.length > 0) {
      toast.error(`Le mot de passe doit contenir : ${errors.join(', ')}.`, {
        duration: 5000,
        style: {
          background: '#ef4444',
          color: '#fff',
          borderRadius: '12px',
        }
      });
      return;
    }
    // ---------------------------------

    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          full_name: formData.fullName,
          voice_type: formData.voiceType,
          phone: formData.phone
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue lors de l'inscription.");
      }

      toast.success(`Bienvenue ${formData.fullName.split(' ')[0]} ! ${data.message}`, {
        duration: 6000,
        style: {
          background: 'var(--brand-dark)',
          color: '#fff',
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: '600',
        },
      });

      // Redirection vers la page de connexion
      setTimeout(() => {
        navigate('/login');
      }, 2000);

      // Vider le formulaire après succès
      setFormData({ fullName: '', email: '', phone: '', password: '', voiceType: 'Soprano' });

    } catch (error) {
      toast.error(error.message, {
        style: {
          background: '#ef4444',
          color: '#fff',
          borderRadius: '12px',
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <SEO 
        title="Inscription" 
        description="Rejoignez la Chorale Sainte Marie Auxiliatrice. Créez un compte pour accéder à notre bibliothèque de partitions et rester informé de nos activités." 
      />
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

          {/* Pupitre */}
          <div className="input-group">
            <label htmlFor="voiceType">Pupitre (Voix)</label>
            <div className="input-wrapper">
              <User size={18} />
              <select 
                id="voiceType" 
                name="voiceType"
                required
                className="input-field"
                value={formData.voiceType}
                onChange={handleChange}
                style={{ appearance: 'none', background: 'transparent' }}
              >
                <option value="Soprano">Soprano</option>
                <option value="Alto">Alto</option>
                <option value="Ténor">Ténor</option>
                <option value="Basse">Basse</option>
              </select>
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
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Min. 8 caractères, une majuscule, un chiffre et un symbole.
            </p>
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
          <span style={{ color: 'var(--text-muted)' }}>Déjà membre ? <a href="/login">Se connecter</a></span>
          <a href="/" className="back-link">Retour au site</a>
          <br />
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
