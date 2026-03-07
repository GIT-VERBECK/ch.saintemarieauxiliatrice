import React from 'react';
import { Music, MapPin, Phone, Mail, Instagram, Youtube } from 'lucide-react';

const Footer = () => (
  <footer id="contact" className="footer-v3">
    <div className="container">
      <div className="footer-grid">
        <div className="footer-col">
          <div className="logo-group" style={{ marginBottom: '24px' }}>
            <img src="/src/assets/images/icon2.png" alt="Logo" width={66} height={43} style={{ borderRadius: 'var(--radius-md)',marginLeft: '-.9rem' }}/>
            <span className="logo-text" style={{ color: 'white', marginLeft: '-1.5rem' }}>SMA</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9375rem', lineHeight: '1.8' }}>
            Une chorale au service de la liturgie et de la prière, dédiée à la beauté du chant sacré.
          </p>
        </div>

        <div className="footer-col">
          <h5>Navigation</h5>
          <ul className="footer-list">
            <li><a href="#evenements">Événements</a></li>
            <li><a href="#partitions">Répertoire</a></li>
            <li><a href="#chorale">La Chorale</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h5>Communauté</h5>
          <ul className="footer-list">
            <li><a href="#">Espace Membres</a></li>
            <li><a href="#">Donations</a></li>
            <li><a href="#">Auditions</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h5>Contact</h5>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', opacity: 0.7, fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', gap: '12px' }}><MapPin size={18} color="var(--brand-primary)" /> Paroisse Bienheurese Anuarite Goma RDC</div>
            <div style={{ display: 'flex', gap: '12px' }}><Phone size={18} color="var(--brand-primary)" /> +243 814 717 237</div>
            <div style={{ display: 'flex', gap: '12px' }}><Mail size={18} color="var(--brand-primary)" /> jeanmarcverbeck.dev@gmail.com</div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2024 Chorale Sainte Marie Auxiliatrice. Goma.</span>
        <div style={{ display: 'flex', gap: '24px' }}>
          <a href="#">Confidentialité</a>
          <a href="#">Mentions Légales</a>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <a href="#" aria-label="Instagram" className="social-icon"><Instagram size={20} /></a>
          <a href="#" aria-label="Youtube" className="social-icon"><Youtube size={20} /></a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
