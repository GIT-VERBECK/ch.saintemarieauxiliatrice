import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import '../styles/Contact.css';

/**
 * Composant SuccessMessage pour l'animation premium
 */
const SuccessMessage = ({ onClose }) => (
  <motion.div 
    className="success-overlay"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div 
      className="success-content"
      initial={{ scale: 0.8, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.8, y: 20 }}
    >
      <div className="success-icon-wrapper">
        <CheckCircle2 size={64} color="var(--brand-primary)" />
      </div>
      <h2>Message Envoyé !</h2>
      <p>Merci de nous avoir contactés. Notre équipe vous répondra dans les plus brefs délais.</p>
      <button className="btn btn-primary" onClick={onClose}>
        Retourner au site
      </button>
    </motion.div>
  </motion.div>
);

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Validation des champs
  const validateField = (name, value) => {
    let error = '';
    if (!value.trim()) {
      error = 'Ce champ est obligatoire';
    } else if (name === 'email' && !/\S+@\S+\.\S+/.test(value)) {
      error = 'Adresse email invalide';
    } else if (name === 'message' && value.length < 10) {
      error = 'Le message doit contenir au moins 10 caractères';
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validation en temps réel
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation finale
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    setIsSubmitting(true);
    
    // Simulation d'envoi
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setErrors({});
    }, 1800);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="layout-root contact-page">
      <Header />
      
      <main>
        {/* Success Animation Overlay */}
        <AnimatePresence>
          {showSuccess && <SuccessMessage onClose={() => setShowSuccess(false)} />}
        </AnimatePresence>

        <section className="contact-hero">
          <div className="container">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Restons en <span className="text-gradient">Contact</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Une question sur le chœur ou une demande de prestation ? 
              Notre équipe est à votre écoute pour vous répondre.
            </motion.p>
          </div>
        </section>

        <section className="contact-content">
          <div className="container">
            <div className="contact-grid">
              
              <div className="contact-left-column">
                <motion.div 
                  className="contact-info-list"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="contact-info-card">
                    <div className="contact-icon-wrapper">
                      <MapPin size={24} />
                    </div>
                    <div className="contact-info-details">
                      <h3>Notre Lieu de Répétition</h3>
                      <p>Paroisse Bienheureuse Anuarite <br/> Goma, Nord-Kivu, RDC</p>
                    </div>
                  </div>

                  <div className="contact-info-card">
                    <div className="contact-icon-wrapper">
                      <Mail size={24} />
                    </div>
                    <div className="contact-info-details">
                      <h3>Email</h3>
                      <p>anuarite.goma@gmail.com</p>
                      <p>contact@chorale-sma.org</p>
                    </div>
                  </div>
                </motion.div>

                {/* Google Maps Integration */}
                <motion.div 
                  className="contact-map-wrapper"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <iframe 
                    title="Paroisse Bienheureuse Anuarite Goma"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d8454.04859423451!2d29.185833877454694!3d-1.6583028057650582!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dd08d41be833d1%3A0xceccd3bf73fe256e!2sParoisse%20Bienheureuse%20Anuarite%2FGoma!5e0!3m2!1sen!2scd!4v1774120385270!5m2!1sen!2scd" 
                    width="100%" 
                    height="300" 
                    style={{ border: 0, borderRadius: '16px' }} 
                    allowFullScreen="" 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </motion.div>
              </div>

              <motion.div 
                className="contact-form-wrapper"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="form-header">
                  <h2>Envoyez un message</h2>
                  <p>Réponse garantie sous 48 heures</p>
                </div>

                <form className="contact-form" onSubmit={handleSubmit} noValidate>
                  <div className="form-row">
                    <div className={`form-group ${errors.name ? 'has-error' : ''}`}>
                      <label htmlFor="name">Nom complet</label>
                      <div className="input-with-icon">
                        <input 
                          type="text" 
                          id="name" 
                          name="name" 
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Ex: Marie Martin" 
                          required 
                        />
                        {errors.name && <AlertCircle className="error-icon" size={16} />}
                      </div>
                      {errors.name && <span className="error-text">{errors.name}</span>}
                    </div>
                    
                    <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
                      <label htmlFor="email">Adresse email</label>
                      <div className="input-with-icon">
                        <input 
                          type="email" 
                          id="email" 
                          name="email" 
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="votre@email.com" 
                          required 
                        />
                        {errors.email && <AlertCircle className="error-icon" size={16} />}
                      </div>
                      {errors.email && <span className="error-text">{errors.email}</span>}
                    </div>
                  </div>
                  
                  <div className={`form-group ${errors.subject ? 'has-error' : ''}`}>
                    <label htmlFor="subject">Sujet de votre demande</label>
                    <input 
                      type="text" 
                      id="subject" 
                      name="subject" 
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Ex: Demande d'audition" 
                      required 
                    />
                    {errors.subject && <span className="error-text">{errors.subject}</span>}
                  </div>

                  <div className={`form-group ${errors.message ? 'has-error' : ''}`}>
                    <label htmlFor="message">Votre message</label>
                    <textarea 
                      id="message" 
                      name="message" 
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Dites-nous en plus sur votre projet..." 
                      required 
                    ></textarea>
                    {errors.message && <span className="error-text">{errors.message}</span>}
                  </div>

                  <button 
                    type="submit" 
                    className={`submit-btn ${isSubmitting ? 'loading' : ''}`} 
                    disabled={isSubmitting}
                  >
                    <span>{isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}</span>
                    {!isSubmitting && <Send size={18} />}
                    {isSubmitting && <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="spinner" />}
                  </button>
                </form>
              </motion.div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
export default Contact;
